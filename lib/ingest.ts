import type { SupabaseClient } from '@supabase/supabase-js'
import { classify } from './safety-core'
import type { PackCategory } from './types'

/**
 * Shared skill-ingest engine.
 *
 * Pulls SKILL.md files from public GitHub repos, runs the safety classifier,
 * gates on an allowed open-source license, and upserts the result into the
 * catalog. One engine, two callers:
 *   - `scripts/ingest.ts` / `scripts/scout-seed.ts` (tsx CLIs)
 *   - `app/api/cron/scout/route.ts` (weekly headless discovery)
 *
 * Runtime-agnostic by design: the caller injects the Supabase client, so this
 * module carries no `server-only` guard and works under tsx and Next alike.
 */

// ── License gate ───────────────────────────────────────────────────────────

/**
 * SPDX ids we consider safe to redistribute in the catalog. Auto-publish is
 * gated on this list; anything else (including `NOASSERTION` / no license) is
 * blocked and left for a human to clear, since redistributing unlicensed work
 * is a real legal risk for a catalog.
 */
export const ALLOWED_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BSD-3-Clause-Clear',
  'ISC',
  '0BSD',
  'Zlib',
  'Unlicense',
  'CC0-1.0',
  'MPL-2.0',
])

export function isAllowedLicense(spdx?: string | null): boolean {
  return Boolean(spdx) && ALLOWED_LICENSES.has(spdx as string)
}

// ── GitHub helpers ─────────────────────────────────────────────────────────

const GH_API = 'https://api.github.com'

function ghHeaders(raw = false): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
    'User-Agent': 'skillme-ingest',
  }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return headers
}

export interface RepoMeta {
  owner: string
  repo: string
  exists: boolean
  defaultBranch: string
  license: string | null
  stars: number
  pushedAt: string | null
}

export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}`, { headers: ghHeaders() })
  if (res.status === 404) {
    return { owner, repo, exists: false, defaultBranch: 'main', license: null, stars: 0, pushedAt: null }
  }
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${owner}/${repo}`)
  const d = (await res.json()) as {
    default_branch?: string
    license?: { spdx_id?: string } | null
    stargazers_count?: number
    pushed_at?: string
  }
  return {
    owner,
    repo,
    exists: true,
    defaultBranch: d.default_branch ?? 'main',
    license: d.license?.spdx_id && d.license.spdx_id !== 'NOASSERTION' ? d.license.spdx_id : null,
    stars: d.stargazers_count ?? 0,
    pushedAt: d.pushed_at ?? null,
  }
}

/** All file paths in a repo at the given branch (recursive git tree). */
async function fetchTree(owner: string, repo: string, branch: string): Promise<string[]> {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
    headers: ghHeaders(),
  })
  if (!res.ok) throw new Error(`GitHub tree ${res.status} for ${owner}/${repo}@${branch}`)
  const d = (await res.json()) as { tree?: { path: string; type: string }[] }
  return (d.tree ?? []).filter((t) => t.type === 'blob').map((t) => t.path)
}

const MIRROR_PREFIXES = ['.agents/', '.opencode/', '.cursor/', 'claude-plugin/', 'plugins/']

/**
 * Path segments / skill-folder names that are tooling *about* skills rather than
 * catalog skills (skill scaffolders, finders, self-improvers, templates). These
 * pollute a curated catalog, so discovery drops them.
 */
const NOISE_SEGMENTS = new Set(['meta', 'template', 'templates', 'examples', 'example'])
const NOISE_BASENAMES = new Set([
  'create-skill',
  'new-skill',
  'test-skill',
  'skill-finder',
  'skill-creator',
  'skill-generator',
  'self-improver',
])

function isNoiseSkill(path: string): boolean {
  const dir = path.replace(/\/?SKILL\.md$/i, '')
  if (!dir) return false
  const segments = dir.toLowerCase().split('/')
  if (segments.some((s) => NOISE_SEGMENTS.has(s))) return true
  return NOISE_BASENAMES.has(segments[segments.length - 1])
}

/**
 * Reduce a repo's raw SKILL.md paths to the canonical set of distinct skills.
 *
 * Many repos mirror the same skill into several agent-runtime folders
 * (`.claude/skills`, `.agents/skills`, `.opencode/skills`, `plugins/…`). We:
 *   1. prefer the `.claude/` copies when present (canonical for Claude),
 *   2. otherwise drop known mirror folders,
 *   3. drop a lone root `SKILL.md` when nested skills exist (it's a repo index).
 */
export function dedupeSkillPaths(paths: string[]): string[] {
  const skillPaths = paths.filter((p) => /(^|\/)SKILL\.md$/i.test(p))
  if (skillPaths.length <= 1) return skillPaths

  const claude = skillPaths.filter((p) => p.startsWith('.claude/'))
  let set = claude.length > 0 ? claude : skillPaths.filter((p) => !MIRROR_PREFIXES.some((pre) => p.startsWith(pre)))
  if (set.length === 0) set = skillPaths

  const nested = set.filter((p) => p.toLowerCase() !== 'skill.md')
  const canonical = nested.length > 0 ? nested : set
  const filtered = canonical.filter((p) => !isNoiseSkill(p))
  // Never let the noise filter empty out a repo that does have skills.
  return filtered.length > 0 ? filtered : canonical
}

/** Discover the canonical SKILL.md paths in a repo. */
export async function discoverSkillFiles(owner: string, repo: string, branch: string): Promise<string[]> {
  const tree = await fetchTree(owner, repo, branch)
  return dedupeSkillPaths(tree)
}

async function fetchRaw(owner: string, repo: string, path: string): Promise<string | null> {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${path}`, { headers: ghHeaders(true) })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub raw ${res.status} for ${owner}/${repo}/${path}`)
  return res.text()
}

// ── Parsing / slugs ────────────────────────────────────────────────────────

/** Minimal YAML frontmatter reader for the leading --- block. */
export function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const out: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key) out[key] = value
  }
  return out
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Directory holding a SKILL.md (`a/b/SKILL.md` -> `a/b`; `SKILL.md` -> ''). */
function skillDir(path: string): string {
  return path.replace(/\/?SKILL\.md$/i, '')
}

/** Stable slug for a skill: `owner-repo` for a root skill, plus the subdir. */
export function skillSlug(owner: string, repo: string, path: string): string {
  const dir = skillDir(path)
  return slugify(dir ? `${owner}-${repo}-${dir}` : `${owner}-${repo}`)
}

// ── Result types ───────────────────────────────────────────────────────────

export type SkillStatus = 'added' | 'updated' | 'exists' | 'unsafe' | 'license-blocked' | 'error' | 'dry-run'

export interface SkillResult {
  slug: string
  path: string
  name?: string
  status: SkillStatus
  reason?: string
}

export interface RepoResult {
  owner: string
  repo: string
  license: string | null
  stars: number
  /** Repo skipped wholesale (missing, license-blocked, no skills, error). */
  skipped?: string
  skills: SkillResult[]
  pack?: { slug: string; status: 'added' | 'error' | 'skipped'; reason?: string; members: number }
}

export interface PackSpec {
  slug: string
  name: string
  tagline: string
  description: string
  category: PackCategory
  tags: string[]
}

export interface IngestRepoSpec {
  owner: string
  repo: string
  /** Explicit SKILL.md paths to ingest. When omitted, discover them. */
  paths?: string[]
  /** When set and >1 skill is ingested, group them into this pack. */
  pack?: PackSpec
  /** Override the author attribution (defaults to the repo owner). */
  author?: string
}

export interface IngestOptions {
  dryRun?: boolean
  /** Cap skills ingested per repo (newest discovery order). Default: no cap. */
  maxSkills?: number
  /** Skip skills already in the catalog (no re-classify) — for resumable runs. */
  skipExisting?: boolean
  /** Per-skill progress callback for CLI logging. */
  onSkill?: (r: SkillResult) => void
}

// ── Core: one skill file ───────────────────────────────────────────────────

async function ingestOneSkill(
  supabase: SupabaseClient,
  meta: RepoMeta,
  path: string,
  author: string,
  opts: IngestOptions
): Promise<SkillResult> {
  const slug = skillSlug(meta.owner, meta.repo, path)
  try {
    if (opts.dryRun) return { slug, path, status: 'dry-run' }

    if (opts.skipExisting) {
      const { data: present } = await supabase.from('skills').select('id').eq('slug', slug).maybeSingle()
      if (present) return { slug, path, status: 'exists' }
    }

    const content = await fetchRaw(meta.owner, meta.repo, path)
    if (!content) return { slug, path, status: 'error', reason: 'SKILL.md not fetchable' }

    const frontmatter = parseFrontmatter(content)
    const c = await classify(content)
    if (!c.safe) return { slug, path, name: c.name, status: 'unsafe', reason: c.reason }

    const dir = skillDir(path)
    const sourceUrl = dir
      ? `https://github.com/${meta.owner}/${meta.repo}/tree/${meta.defaultBranch}/${dir}`
      : `https://github.com/${meta.owner}/${meta.repo}`

    const { data: existing } = await supabase.from('skills').select('id').eq('slug', slug).maybeSingle()

    const row = {
      slug,
      name: frontmatter.name || c.name,
      description: c.description,
      category: c.category,
      tags: c.tags,
      source_url: sourceUrl,
      author,
      skill_content: content,
      verified: true,
      featured: false,
      free: true,
    }

    const { error } = await supabase.from('skills').upsert(row, { onConflict: 'slug' })
    if (error) return { slug, path, name: row.name, status: 'error', reason: error.message }
    return { slug, path, name: row.name, status: existing ? 'updated' : 'added' }
  } catch (err) {
    return { slug, path, status: 'error', reason: err instanceof Error ? err.message : 'unknown error' }
  }
}

// ── Core: one repo ─────────────────────────────────────────────────────────

export async function ingestRepo(
  supabase: SupabaseClient,
  spec: IngestRepoSpec,
  opts: IngestOptions = {}
): Promise<RepoResult> {
  const meta = await fetchRepoMeta(spec.owner, spec.repo)
  const base: RepoResult = { owner: spec.owner, repo: spec.repo, license: meta.license, stars: meta.stars, skills: [] }

  if (!meta.exists) return { ...base, skipped: 'repo not found' }
  if (!isAllowedLicense(meta.license)) {
    return { ...base, skipped: `license-blocked (${meta.license ?? 'none'})` }
  }

  let paths = spec.paths ?? (await discoverSkillFiles(spec.owner, spec.repo, meta.defaultBranch))
  if (paths.length === 0) return { ...base, skipped: 'no SKILL.md found' }
  if (opts.maxSkills && paths.length > opts.maxSkills) paths = paths.slice(0, opts.maxSkills)

  const author = spec.author ?? spec.owner
  const skills: SkillResult[] = []
  for (const path of paths) {
    const r = await ingestOneSkill(supabase, meta, path, author, opts)
    skills.push(r)
    opts.onSkill?.(r)
  }
  base.skills = skills

  // Group into a pack when requested and we have >1 catalog member. 'exists'
  // counts so a resumed run rebuilds the pack with its full membership.
  const published = skills
    .filter((s) => s.status === 'added' || s.status === 'updated' || s.status === 'exists')
    .map((s) => s.slug)
  if (spec.pack && !opts.dryRun) {
    if (published.length < 2) {
      base.pack = { slug: spec.pack.slug, status: 'skipped', reason: 'fewer than 2 skills published', members: published.length }
    } else {
      base.pack = await upsertPack(supabase, spec.pack, author, meta, published)
    }
  } else if (spec.pack && opts.dryRun) {
    base.pack = { slug: spec.pack.slug, status: 'skipped', reason: 'dry-run', members: paths.length }
  }

  return base
}

async function upsertPack(
  supabase: SupabaseClient,
  pack: PackSpec,
  author: string,
  meta: RepoMeta,
  memberSlugs: string[]
): Promise<NonNullable<RepoResult['pack']>> {
  const { data: packRow, error: packErr } = await supabase
    .from('packs')
    .upsert(
      {
        slug: pack.slug,
        name: pack.name,
        tagline: pack.tagline,
        description: pack.description,
        author,
        author_url: `https://github.com/${meta.owner}`,
        repo_url: `https://github.com/${meta.owner}/${meta.repo}`,
        category: pack.category,
        tags: pack.tags,
        featured: false,
        verified: true,
        free: true,
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single()

  if (packErr || !packRow) {
    return { slug: pack.slug, status: 'error', reason: packErr?.message ?? 'pack upsert failed', members: 0 }
  }

  const { data: skillRows } = await supabase.from('skills').select('id, slug').in('slug', memberSlugs)
  const rows = (skillRows ?? []).map((s: { id: string; slug: string }) => ({
    pack_id: packRow.id,
    skill_id: s.id,
    position: memberSlugs.indexOf(s.slug),
  }))

  await supabase.from('pack_skills').delete().eq('pack_id', packRow.id)
  if (rows.length > 0) {
    const { error: psErr } = await supabase.from('pack_skills').insert(rows)
    if (psErr) return { slug: pack.slug, status: 'error', reason: psErr.message, members: 0 }
  }
  return { slug: pack.slug, status: 'added', members: rows.length }
}

/** Slugs already present in the catalog — used by the cron to skip known repos. */
export async function existingSkillSlugs(supabase: SupabaseClient): Promise<Set<string>> {
  const { data } = await supabase.from('skills').select('slug')
  return new Set((data ?? []).map((r: { slug: string }) => r.slug))
}

// ── Discovery (weekly cron) ──────────────────────────────────────────────────

export interface DiscoveredRepo {
  owner: string
  repo: string
  stars: number
  license: string | null
  pushedAt: string | null
}

/** Default GitHub topics swept by the weekly discovery cron. */
export const DISCOVERY_TOPICS = ['claude-skill', 'claude-skills', 'agent-skills', 'anthropic-skills']

/**
 * Find recently-active repos under the skill topics, ranked by stars. Returns
 * permissively-licensed repos only (the same gate `ingestRepo` enforces), newest
 * activity first. `pushedSince` is an ISO date (YYYY-MM-DD).
 */
export async function searchTrendingRepos(
  topics: string[],
  pushedSince: string,
  perTopic = 20
): Promise<DiscoveredRepo[]> {
  const byKey = new Map<string, DiscoveredRepo>()
  for (const topic of topics) {
    const q = encodeURIComponent(`topic:${topic} pushed:>${pushedSince}`)
    const url = `${GH_API}/search/repositories?q=${q}&sort=stars&order=desc&per_page=${perTopic}`
    const res = await fetch(url, { headers: ghHeaders() })
    if (!res.ok) continue // a single failing topic should not abort the sweep
    const d = (await res.json()) as {
      items?: {
        owner?: { login?: string }
        name?: string
        stargazers_count?: number
        license?: { spdx_id?: string } | null
        pushed_at?: string
      }[]
    }
    for (const item of d.items ?? []) {
      const owner = item.owner?.login
      const repo = item.name
      if (!owner || !repo) continue
      const license = item.license?.spdx_id && item.license.spdx_id !== 'NOASSERTION' ? item.license.spdx_id : null
      if (!isAllowedLicense(license)) continue
      const key = `${owner}/${repo}`.toLowerCase()
      if (!byKey.has(key)) {
        byKey.set(key, { owner, repo, stars: item.stargazers_count ?? 0, license, pushedAt: item.pushed_at ?? null })
      }
    }
  }
  return [...byKey.values()].sort((a, b) => b.stars - a.stars)
}

/** True when the catalog already carries this repo (root slug or any sub-skill). */
export function repoAlreadyKnown(owner: string, repo: string, existing: Set<string>): boolean {
  const base = skillSlug(owner, repo, 'SKILL.md')
  if (existing.has(base)) return true
  for (const slug of existing) if (slug.startsWith(`${base}-`)) return true
  return false
}
