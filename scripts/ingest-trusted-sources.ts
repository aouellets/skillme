/**
 * One-off converter for the "Trusted Sources Skills Expansion" research dump
 * (~/Downloads/trusted-source-skills-expanded-download). Unlike ingest-packs.ts
 * this needs no network: the research set already carries the real upstream
 * frontmatter name, an *original-synthesis* summary (not copied upstream body),
 * tags, and immutable commit-pinned GitHub paths.
 *
 * Policy (matches ingest-packs.ts): ground each catalog entry in the REAL
 * upstream frontmatter name + description (fetched from the commit-pinned raw
 * SKILL.md — the research dump's own summaries are low-quality templated strings)
 * with an original framing body + source link. No upstream bodies are copied, so
 * MIT / Apache / BSD / unknown-license repos are all fine.
 *
 * Scope decisions baked in here:
 *  - Only `public_installable` packs are imported (23 packs). The 5
 *    `project_local` packs (Meta FBOSS — high-risk, can deploy to lab switches —
 *    and four AMD/ROCm in-repo skill sets) are excluded: they aren't installable
 *    and the research itself kept them project-local.
 *  - Skills already in the catalog are de-duped by upstream source path.
 *
 * Outputs:
 *   scripts/expansion-data/pack-<key>.json     — skills for each new pack
 *   scripts/_trusted-manifest.json             — pack metadata + resolved slugs
 *
 * Run:  npx tsx scripts/ingest-trusted-sources.ts   (then npm run build:catalog)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEED_SKILLS } from '../lib/seed-data'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA = join(__dirname, 'expansion-data')
const SRC = '/Users/alexanderouellet/Downloads/trusted-source-skills-expanded-download/trusted-source-skills.json'
const PACKS_SRC = '/Users/alexanderouellet/Downloads/trusted-source-skills-expanded-download/trusted-source-skill-packs.json'

type Cat = 'coding' | 'writing' | 'research' | 'productivity' | 'data' | 'design' | 'business' | 'personal'

// Map the research set's fine-grained primary_category to our 8 buckets.
const CAT: Record<string, Cat> = {
  'Observability': 'coding', 'Infrastructure as code': 'coding', 'Developer tooling': 'coding',
  'Edge cloud development': 'coding', 'Cloud operations': 'coding', 'Cloud optimization': 'coding',
  'Accelerated computing': 'coding', 'AI infrastructure': 'coding', 'Security operations': 'coding',
  'Security and privacy': 'coding', 'Frontend engineering': 'coding', 'Design engineering': 'design',
  'Edge AI': 'coding', 'Edge hardware': 'coding', 'On-device AI': 'coding', 'Code migration': 'coding',
  'Mobile development': 'coding', 'Deployment': 'coding', 'Optimization': 'coding',
  'Graphics and game development': 'coding', 'Wearable and spatial computing': 'coding',
  'GPU performance analysis': 'coding', 'GPU correctness validation': 'coding',
  'GPU execution analysis': 'coding', 'GPU source-line profiling': 'coding', 'GPU kernel isolation': 'coding',
  'Analytics engineering': 'data', 'Database operations': 'data', 'Vector database engineering': 'data',
  'Data cloud': 'data', 'Data and AI platform': 'data', 'Database engineering': 'data',
  'Analytics and visualization': 'data', 'Search and database operations': 'data', 'Data streaming': 'data',
  'Analytical database engineering': 'data', 'Data engineering': 'data', 'Computer vision': 'data',
  'Data platform migration': 'data', 'Retrieval augmented generation': 'data', 'Synthetic data': 'data',
  'Data platform': 'data',
  'Medical AI': 'research', 'Scientific research': 'research', 'Climate science': 'research',
  'AI research': 'research', 'Quantum computing': 'research',
  'Quantitative finance': 'business',
  'Documentation': 'writing',
  'Skill discovery': 'productivity',
}

interface PackCfg { key: string; cat: Cat; tags: string[]; tagline: string }
// pack_id -> import config (slug prefix = key; pack slug = pack_id).
const INCLUDE: Record<string, PackCfg> = {
  'nvidia-skills':            { key: 'nvidia',     cat: 'coding', tags: ['nvidia', 'gpu', 'cuda', 'accelerated-computing'], tagline: 'GPU, CUDA, and accelerated-computing skills from NVIDIA.' },
  'grafana-skills':           { key: 'grafana',    cat: 'coding', tags: ['grafana', 'observability', 'monitoring', 'dashboards'], tagline: 'Observability, dashboards, and monitoring skills from Grafana Labs.' },
  'elastic-agent-skills':     { key: 'elastic',    cat: 'data',   tags: ['elastic', 'search', 'observability', 'security'], tagline: 'Search, observability, and security skills from Elastic (technical preview).' },
  'apple-game-porting':       { key: 'apple-game', cat: 'coding', tags: ['apple', 'game-porting', 'graphics', 'metal'], tagline: 'Game porting, graphics, and Metal skills from Apple.' },
  'cockroachdb-claude-plugin':{ key: 'cockroachdb',cat: 'data',   tags: ['cockroachdb', 'database', 'sql', 'distributed'], tagline: 'Distributed SQL database operations from Cockroach Labs.' },
  'motherduck-agent-skills':  { key: 'motherduck', cat: 'data',   tags: ['motherduck', 'duckdb', 'analytics', 'sql'], tagline: 'DuckDB and analytics skills from MotherDuck.' },
  'snowflake-coco-skills':    { key: 'snowflake',  cat: 'data',   tags: ['snowflake', 'data-cloud', 'cortex', 'sql'], tagline: 'Cortex Code community skills for the Snowflake data cloud.' },
  'pulumi-agent-skills':      { key: 'pulumi',     cat: 'coding', tags: ['pulumi', 'infrastructure-as-code', 'cloud', 'devops'], tagline: 'Infrastructure-as-code skills from Pulumi.' },
  'meta-projectaria':         { key: 'aria',       cat: 'coding', tags: ['meta', 'project-aria', 'spatial-computing', 'wearable'], tagline: "Project Aria spatial-computing skills from Meta's research labs." },
  'dbt-agent-skills':         { key: 'dbt',        cat: 'data',   tags: ['dbt', 'analytics-engineering', 'data-modeling', 'sql'], tagline: 'Analytics-engineering and data-modeling skills from dbt Labs.' },
  'databricks-agent-skills':  { key: 'databricks', cat: 'data',   tags: ['databricks', 'data', 'ai-platform', 'spark'], tagline: 'Stable data + AI platform skills from Databricks.' },
  'cloudflare-skills':        { key: 'cloudflare', cat: 'coding', tags: ['cloudflare', 'edge', 'workers', 'serverless'], tagline: 'Edge, Workers, and serverless skills from Cloudflare.' },
  'redis-agent-skills':       { key: 'redis',      cat: 'data',   tags: ['redis', 'cache', 'database', 'data-structures'], tagline: 'Caching and data-structure skills from Redis.' },
  'pinecone-skills':          { key: 'pinecone',   cat: 'data',   tags: ['pinecone', 'vector-database', 'rag', 'embeddings'], tagline: 'Vector-database and RAG skills from Pinecone.' },
  'qdrant-skills':            { key: 'qdrant',     cat: 'data',   tags: ['qdrant', 'vector-database', 'search', 'embeddings'], tagline: 'Vector-search and retrieval skills from Qdrant.' },
  'allenai-asta':             { key: 'asta',       cat: 'research',tags: ['research', 'science', 'literature', 'allen-institute'], tagline: 'Scientific research and literature skills from Ai2 (Allen Institute for AI).' },
  'confluent-agent-skills':   { key: 'confluent',  cat: 'data',   tags: ['confluent', 'kafka', 'streaming', 'data'], tagline: 'Apache Kafka and data-streaming skills from Confluent.' },
  'amd-intellikit':           { key: 'intellikit', cat: 'coding', tags: ['amd', 'gpu', 'performance', 'validation'], tagline: 'GPU performance and validation skills from AMD Research.' },
  'clickhouse-agent-skills':  { key: 'clickhouse', cat: 'data',   tags: ['clickhouse', 'olap', 'analytics', 'database'], tagline: 'Analytical (OLAP) database skills from ClickHouse.' },
  'apple-coreai':             { key: 'coreai',     cat: 'coding', tags: ['apple', 'on-device-ai', 'core-ml', 'models'], tagline: 'On-device AI and model skills from Apple.' },
  'apache-doris-skills':      { key: 'doris',      cat: 'data',   tags: ['apache-doris', 'olap', 'analytics', 'database'], tagline: 'Real-time analytical database skills for Apache Doris.' },
  'meta-secpriv':             { key: 'secpriv',    cat: 'coding', tags: ['meta', 'security', 'privacy', 'code-review'], tagline: "Meta's SecPriv security & privacy review skill." },
  // NOTE: aws-agent-toolkit excluded — the single skill recorded in the research
  // dump (find-aws-skills @ pinned commit) was removed upstream and the repo was
  // fully restructured into 100+ DevSecOps skills. Re-ingesting that live tree is
  // a separate, larger decision; not silently re-scoped here.
}

// A few first-party repos ship a single root-level SKILL.md with NO YAML
// frontmatter (just a license comment + H1), so there is no upstream description
// to extract. Hand-author those here, keyed by repo, grounded in the repo's H1.
const SKILL_OVERRIDE: Record<string, { slug: string; name: string; description: string }> = {
  'facebookresearch/secpriv-skill': {
    slug: 'secpriv-security-privacy-review',
    name: 'SecPriv Security & Privacy Review',
    description:
      "Meta's unified security & privacy code-review skill: reviews code or a diff in a single pass, flagging security vulnerabilities and privacy issues with explanations and fixes. Use it as a review system prompt or a drop-in review skill.",
  },
}

// Normalize a few unwieldy publisher strings to clean catalog author labels
// (these double as partner-registry keys in lib/partners.ts).
const AUTHOR_MAP: Record<string, string> = {
  'Ai2 / Allen Institute for AI': 'Ai2',
  'Apache Software Foundation / Apache Doris': 'Apache Doris',
}
const normAuthor = (c: string): string => AUTHOR_MAP[c] || c

const existingSlugs = new Set(SEED_SKILLS.map((s) => s.slug))
function parseKey(u?: string): string | null {
  const m = (u || '').match(/github\.com\/([^/]+)\/([^/]+)\/(?:tree|blob)\/[^/]+\/(.+?)(?:\/SKILL\.md)?\/?$/)
  return m ? `${m[1]}/${m[2]}::${m[3].replace(/\/+$/, '')}`.toLowerCase() : null
}
const existingKeys = new Set(
  (SEED_SKILLS as any[]).map((s) => parseKey(s.source_url)).filter(Boolean) as string[]
)

const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
const titleize = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * Parse a top-level scalar key out of SKILL.md YAML frontmatter. Handles inline
 * (`k: value`), quoted, and block scalars (`k: >` / `k: |` followed by an
 * indented block) — the last is common in these repos and must not be truncated
 * at the first line end.
 */
function parseFrontmatter(md: string): { name?: string; description?: string } {
  if (!md.startsWith('---')) return {}
  const end = md.indexOf('\n---', 3)
  if (end < 0) return {}
  const lines = md.slice(3, end).replace(/^\n/, '').split('\n')
  const grab = (key: string): string | undefined => {
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(new RegExp(`^${key}:\\s*(.*)$`))
      if (!m) continue
      const inline = m[1].trim()
      if (inline && inline !== '>' && inline !== '|' && inline !== '>-' && inline !== '|-') {
        return inline.replace(/^["']|["']$/g, '').trim()
      }
      // Block scalar: collect subsequent indented (or blank) lines.
      const block: string[] = []
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '') { block.push(''); continue }
        if (/^\s/.test(lines[j])) { block.push(lines[j].trim()); continue }
        break // dedented → next top-level key
      }
      return block.join(' ').replace(/\s+/g, ' ').trim()
    }
    return undefined
  }
  return { name: grab('name'), description: grab('description') }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Fetch a list of URLs with a bounded concurrency pool + retry (raw.githubusercontent rate-limits bursts). */
async function fetchAll(urls: string[], concurrency = 8, retries = 4): Promise<(string | null)[]> {
  const out: (string | null)[] = new Array(urls.length).fill(null)
  let next = 0
  let done = 0
  async function worker() {
    while (next < urls.length) {
      const i = next++
      if (!urls[i]) { out[i] = null; done++; continue }
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const r = await fetch(urls[i])
          if (r.ok) { out[i] = await r.text(); break }
          if (r.status === 404) { out[i] = null; break } // genuine miss — don't retry
        } catch { /* network blip — retry */ }
        if (attempt < retries) await sleep(300 * (attempt + 1))
      }
      if (++done % 50 === 0) console.log(`  fetched ${done}/${urls.length}…`)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  return out
}

const skills = JSON.parse(readFileSync(SRC, 'utf8')).skills as any[]
const packsMeta = JSON.parse(readFileSync(PACKS_SRC, 'utf8')).packs as any[]
const packByeId: Record<string, any> = Object.fromEntries(packsMeta.map((p) => [p.pack_id, p]))

// A few commit-pinned paths in the research dump are stale (upstream renamed the
// skill dir). Map the dump's directory path -> the current one so we resolve the
// real SKILL.md instead of dropping the entry.
const PATH_OVERRIDE: Record<string, string> = {
  'plugins/asta-preview/skills/run-experiment': 'plugins/asta-preview/skills/experiment',
}

// 1. Resolve, dedup, and slug every entry first; collect raw URLs to fetch.
interface Pending { packId: string; cfg: PackCfg; meta: any; author: string; e: any; slug: string; repo: string; dirUrl: string; rawUrl: string; rawAlt: string }
const pending: Pending[] = []
const byPack: Record<string, Pending[]> = {}
const seenGlobal = new Set<string>()
let skippedDup = 0

for (const [packId, cfg] of Object.entries(INCLUDE)) {
  const meta = packByeId[packId]
  const author: string = normAuthor(meta.company)
  byPack[packId] = []
  for (const e of skills.filter((s) => s.pack?.pack_id === packId)) {
    const gp = e.github_paths || {}
    const repo = e.repository?.full_name
    const rawPath = (gp.skill_directory_path || (gp.skill_file_path || '').replace(/\/SKILL\.md$/, '')).replace(/\/+$/, '')
    const path = PATH_OVERRIDE[rawPath] || rawPath
    const srcKey = repo && path ? `${repo}::${path}`.toLowerCase() : null
    if (srcKey && existingKeys.has(srcKey)) { skippedDup++; continue }

    const ov = repo ? SKILL_OVERRIDE[repo] : undefined
    const leaf = path.split('/').pop() || e.slug || kebab(e.name)
    let slug = ov ? ov.slug : `${cfg.key}-${kebab(leaf)}`
    if (existingSlugs.has(slug) || seenGlobal.has(slug)) {
      let i = 2
      while (existingSlugs.has(`${slug}-${i}`) || seenGlobal.has(`${slug}-${i}`)) i++
      slug = `${slug}-${i}`
    }
    seenGlobal.add(slug)
    const branch = e.repository?.default_branch || 'main'
    const dirUrl = path ? `https://github.com/${repo}/tree/${branch}/${path}` : `https://github.com/${repo}`
    // Prefer the pinned raw URL, but if the dir was overridden (renamed upstream),
    // build a fresh default-branch raw URL. The fetch step also falls back to the
    // default branch when the pinned URL 404s.
    const rawUrl: string = path !== rawPath
      ? `https://raw.githubusercontent.com/${repo}/${branch}/${path}/SKILL.md`
      : (gp.raw_skill_file_url || `https://raw.githubusercontent.com/${repo}/${branch}/${path}/SKILL.md`)
    const rawAlt = `https://raw.githubusercontent.com/${repo}/${branch}/${path}/SKILL.md`
    const p: Pending = { packId, cfg, meta, author, e, slug, repo, dirUrl, rawUrl, rawAlt }
    pending.push(p)
    byPack[packId].push(p)
  }
}

async function main() {
// 2. Fetch real upstream frontmatter for every pending skill (parallel),
//    falling back to the default-branch URL when the pinned URL 404s.
console.log(`Fetching real SKILL.md frontmatter for ${pending.length} skills…`)
const mds = await fetchAll(pending.map((p) => p.rawUrl))
const retryIdx = pending.map((p, i) => i).filter((i) => !mds[i] && pending[i].rawAlt !== pending[i].rawUrl)
if (retryIdx.length) {
  console.log(`Retrying ${retryIdx.length} on default branch…`)
  const alts = await fetchAll(retryIdx.map((i) => pending[i].rawAlt))
  retryIdx.forEach((i, k) => { if (alts[k]) mds[i] = alts[k] })
}
const fm: Map<Pending, { name?: string; description?: string }> = new Map()
let fetched = 0
pending.forEach((p, i) => {
  const parsed = mds[i] ? parseFrontmatter(mds[i] as string) : {}
  if (parsed.description) fetched++
  fm.set(p, parsed)
})
console.log(`Resolved real descriptions for ${fetched}/${pending.length} skills.\n`)

// 3. Emit per-pack JSON + manifest.
const manifest: any[] = []
let total = 0
let dropped = 0

for (const [packId, cfg] of Object.entries(INCLUDE)) {
  const meta = packByeId[packId]
  const author: string = normAuthor(meta.company)
  const out: any[] = []
  const slugs: string[] = []

  for (const p of byPack[packId]) {
    const e = p.e
    const ov = p.repo ? SKILL_OVERRIDE[p.repo] : undefined
    const parsed = fm.get(p) || {}
    // Drop entries whose upstream SKILL.md never resolved (stale/removed path),
    // unless we hand-authored an override: shipping a dead link with a templated
    // description is worse than omitting the entry.
    if (!ov && (!parsed.description || parsed.description.replace(/\s+/g, ' ').trim().length < 20)) {
      console.log(`  · dropped (unresolved upstream): ${p.slug}`)
      dropped++
      continue
    }
    const upName = parsed.name && parsed.name.length < 80 ? titleize(parsed.name) : ''
    const name: string = (ov?.name || upName || e.name || titleize(p.slug.replace(`${cfg.key}-`, ''))).trim()

    let desc: string = (ov?.description || parsed.description || '').replace(/\s+/g, ' ').trim()
    if (desc.length > 220) desc = desc.slice(0, 217).replace(/\s+\S*$/, '') + '…'

    const cat: Cat = CAT[e.primary_category] || cfg.cat
    // The dump's tags carry generic noise ('agent-skills', 'company', …). Drop
    // those, then top up with the curated pack tags so every skill has ≥2 useful,
    // brand-relevant tags for search/filtering.
    const NOISE = new Set(['agent-skills', 'company', 'skill', 'skills', 'claude', 'official', 'core', 'plugin', 'marketplace'])
    const upTags = (Array.isArray(e.tags) ? e.tags : []).map((t: string) => String(t).toLowerCase()).filter((t: string) => t.length >= 2 && !NOISE.has(t))
    let tags: string[] = Array.from(new Set([...upTags, ...cfg.tags])).slice(0, 4)
    if (tags.length < 2) tags = cfg.tags.slice(0, 4)

    const fmDesc = desc.replace(/\n/g, ' ')
    const content = `---\nname: ${name}\ndescription: ${fmDesc}\n---\n\n# ${name}\n\nPart of the **${meta.pack_name}** pack by ${author} (\`${p.repo}\`).\n\n${desc}\n\nThis catalog entry summarizes the skill for discovery. Get the full skill — including any bundled scripts and resources — from the source:\n\nFull skill & source: ${p.dirUrl}\n`

    out.push({ slug: p.slug, name, category: cat, description: desc, author, source_url: p.dirUrl, tags, skill_content: content })
    slugs.push(p.slug)
  }

  writeFileSync(join(DATA, `pack-${cfg.key}.json`), JSON.stringify(out, null, 2) + '\n')
  manifest.push({
    pack_id: packId,
    key: cfg.key,
    slug: packId,
    name: meta.pack_name,
    author,
    category: cfg.cat,
    tagline: cfg.tagline,
    description: meta.description,
    tags: cfg.tags,
    repo_url: meta.repository_url,
    license_spdx: meta.license_spdx,
    skill_slugs: slugs,
  })
  total += out.length
  console.log(`${cfg.key.padEnd(12)} ${String(out.length).padStart(3)} skills  (${packId})`)
}

writeFileSync(join(__dirname, '_trusted-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nTOTAL: ${total} new skills across ${Object.keys(INCLUDE).length} packs.  (skipped ${skippedDup} already in catalog, dropped ${dropped} unresolved upstream)`)
}

main().catch((err) => { console.error(err); process.exit(1) })
