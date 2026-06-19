/**
 * Publish in-house packs to standalone, starrable GitHub repos (one repo per
 * pack) under the Skill Me org. The catalog monorepo stays the single source of
 * truth; each pack repo is a mirror so users can install via `npx skills add`
 * and star the pack on GitHub.
 *
 * What a pack repo contains:
 *   - skills/<slug>/SKILL.md for every skill the catalog HOSTS (isHostedHere).
 *     Externally-authored skills are NOT mirrored — we don't republish others'
 *     work — they're listed in the README with a link to their real source.
 *   - A generated README.md and the repo's MIT LICENSE.
 *
 * The script is idempotent: it creates the repo if missing, otherwise clones and
 * re-syncs, committing only when content actually changed. On success it writes
 * packs.repo_url in the live DB so the pack page shows the "Star on GitHub" CTA.
 *
 * Usage:
 *   tsx scripts/publish-pack-repos.ts --all [--dry-run] [--no-db]
 *   tsx scripts/publish-pack-repos.ts <pack-slug> [<pack-slug> ...]
 *
 * Requires: `gh` authenticated with repo scope. DB writes need
 * NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, rmSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { PACK_DEFINITIONS } from '../lib/pack-definitions'
import { SEED_SKILLS } from '../lib/seed-data'
import { isHostedHere, resolveSourceUrl, packRepoUrl, SKILLS_OWNER, isOfficial } from '../lib/skill-source'

config({ path: '.env.local' })
config()

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SKILLS_DIR = join(ROOT, 'skills')
const LICENSE = join(ROOT, 'LICENSE')
const SKILL_BY_SLUG = new Map(SEED_SKILLS.map((s) => [s.slug, s]))

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const NO_DB = args.includes('--no-db')
const ALL = args.includes('--all')
const slugArgs = args.filter((a) => !a.startsWith('--'))

function sh(cmd: string, cmdArgs: string[], cwd?: string): string {
  return execFileSync(cmd, cmdArgs, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

function repoExists(slug: string): boolean {
  try {
    execFileSync('gh', ['repo', 'view', `${SKILLS_OWNER}/${slug}`], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function toTopic(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)
}

interface SkillEntry {
  slug: string
  name: string
  description: string
  hosted: boolean
  link: string // path within the repo (hosted) or external source_url
}

function resolveEntries(skillSlugs: string[]): { entries: SkillEntry[]; missing: string[] } {
  const entries: SkillEntry[] = []
  const missing: string[] = []
  for (const slug of skillSlugs) {
    const skill = SKILL_BY_SLUG.get(slug)
    if (!skill) {
      missing.push(slug)
      continue
    }
    const hosted = isHostedHere(skill) && existsSync(join(SKILLS_DIR, slug, 'SKILL.md'))
    entries.push({
      slug,
      name: skill.name,
      description: firstSentence(skill.description),
      hosted,
      link: hosted ? `skills/${slug}/SKILL.md` : resolveSourceUrl(skill) ?? `${SKILLS_OWNER}`,
    })
  }
  return { entries, missing }
}

function firstSentence(desc: string): string {
  const trimmed = desc.replace(/\s+Triggers? (on|when).*$/i, '').trim()
  const m = trimmed.match(/^.*?[.!?](?=\s|$)/)
  return (m ? m[0] : trimmed).trim()
}

function buildReadme(pack: (typeof PACK_DEFINITIONS)[number], entries: SkillEntry[]): string {
  const lines: string[] = []
  lines.push(`# ${pack.name}`, '')
  lines.push(`**${pack.tagline}** — built in-house by [Skill&nbsp;Me](https://skillme.dev).`, '')
  lines.push(pack.description, '')
  lines.push(`⭐ **If this is useful, star the repo** — it's how we gauge what to build next.`, '')
  lines.push('## Install', '')
  lines.push(`- **From the catalog:** [skillme.dev/pack/${pack.slug}](https://skillme.dev/pack/${pack.slug}) — install the whole pack into Claude in one step.`)
  lines.push(`- **With the skills CLI:** \`npx skills add ${SKILLS_OWNER}/${pack.slug}\``)
  lines.push('- **Manually:** copy any `skills/<slug>/SKILL.md` into your Claude skills directory.', '')
  lines.push('## Skills in this pack', '')
  for (const e of entries) {
    const suffix = e.hosted ? '' : ' _(external — see source)_'
    lines.push(`- **[${e.name}](${e.link})** — ${e.description}${suffix}`)
  }
  lines.push('', '## License', '')
  lines.push('MIT — see [LICENSE](LICENSE). Skills are portable `SKILL.md` files; the canonical')
  lines.push('copies live in the [Skill&nbsp;Me catalog](https://skillme.dev).', '')
  return lines.join('\n')
}

/** Write the desired repo contents into destDir (managed paths only). */
function writeContents(destDir: string, pack: (typeof PACK_DEFINITIONS)[number], entries: SkillEntry[]) {
  // Clear managed paths so removed/renamed skills don't linger on re-sync.
  rmSync(join(destDir, 'skills'), { recursive: true, force: true })
  rmSync(join(destDir, 'README.md'), { force: true })
  rmSync(join(destDir, 'LICENSE'), { force: true })

  for (const e of entries.filter((x) => x.hosted)) {
    const dir = join(destDir, 'skills', e.slug)
    mkdirSync(dir, { recursive: true })
    copyFileSync(join(SKILLS_DIR, e.slug, 'SKILL.md'), join(dir, 'SKILL.md'))
  }
  writeFileSync(join(destDir, 'README.md'), buildReadme(pack, entries))
  copyFileSync(LICENSE, join(destDir, 'LICENSE'))
}

const COMMIT_MSG = (name: string) =>
  `Sync ${name} from the Skill Me catalog\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

interface Result { slug: string; action: 'created' | 'synced' | 'unchanged' | 'skipped'; url: string; note?: string }

function publishPack(pack: (typeof PACK_DEFINITIONS)[number]): Result {
  const url = packRepoUrl(pack.slug)
  const { entries, missing } = resolveEntries(pack.skill_slugs)
  const hostedCount = entries.filter((e) => e.hosted).length
  const note = `${hostedCount}/${entries.length} hosted${missing.length ? `, missing: ${missing.join(',')}` : ''}`

  if (DRY) {
    return { slug: pack.slug, action: repoExists(pack.slug) ? 'synced' : 'created', url, note: `[dry-run] ${note}` }
  }

  const exists = repoExists(pack.slug)
  const work = mkdtempSync(join(tmpdir(), `pack-${pack.slug}-`))
  const desc = pack.tagline.slice(0, 110)
  const topics = ['claude', 'claude-skills', 'skill-me', toTopic(pack.category), ...pack.tags.map(toTopic)]
    .filter(Boolean)

  try {
    if (exists) {
      sh('gh', ['repo', 'clone', `${SKILLS_OWNER}/${pack.slug}`, work, '--', '--depth', '1'])
      writeContents(work, pack, entries)
      sh('git', ['add', '-A'], work)
      const status = sh('git', ['status', '--porcelain'], work).trim()
      if (!status) return { slug: pack.slug, action: 'unchanged', url, note }
      sh('git', ['commit', '-m', COMMIT_MSG(pack.name)], work)
      sh('git', ['push', 'origin', 'HEAD'], work)
      return { slug: pack.slug, action: 'synced', url, note }
    }

    // New repo. `gh repo create` uses the GraphQL createRepository mutation,
    // which some tokens can't access ("Resource not accessible"); the REST
    // endpoint works, so create the empty repo there and push to it.
    mkdirSync(join(work, 'skills'), { recursive: true })
    writeContents(work, pack, entries)
    sh('git', ['init', '-q', '-b', 'main'], work)
    sh('git', ['add', '-A'], work)
    sh('git', ['commit', '-q', '-m', COMMIT_MSG(pack.name)], work)
    sh('gh', ['api', '-X', 'POST', '/user/repos', '-f', `name=${pack.slug}`, '-f', `description=${desc}`, '-F', 'private=false', '-F', 'has_wiki=false'])
    sh('git', ['remote', 'add', 'origin', `https://github.com/${SKILLS_OWNER}/${pack.slug}.git`], work)
    sh('git', ['push', '-u', 'origin', 'main'], work)
    try {
      sh('gh', ['repo', 'edit', `${SKILLS_OWNER}/${pack.slug}`, '--homepage', `https://skillme.dev/pack/${pack.slug}`, ...topics.flatMap((t) => ['--add-topic', t])])
    } catch {
      // homepage/topics are cosmetic — never fail a publish over them
    }
    return { slug: pack.slug, action: 'created', url, note }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

async function updateDb(results: Result[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const published = results.filter((r) => r.action !== 'skipped')
  if (NO_DB || DRY || !published.length) return
  if (!url || !key) {
    console.warn('\n⚠ Skipping DB update: missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.')
    return
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  let ok = 0
  for (const r of published) {
    const { error } = await supabase.from('packs').update({ repo_url: r.url, updated_at: new Date().toISOString() }).eq('slug', r.slug)
    if (error) console.warn(`  ⚠ DB update failed for ${r.slug}: ${error.message}`)
    else ok++
  }
  console.log(`\nDB: set repo_url for ${ok}/${published.length} packs.`)
}

async function main() {
  const inHouse = PACK_DEFINITIONS.filter((p) => isOfficial(p))
  let targets: typeof PACK_DEFINITIONS
  if (slugArgs.length) {
    targets = PACK_DEFINITIONS.filter((p) => slugArgs.includes(p.slug))
    const found = new Set(targets.map((p) => p.slug))
    for (const s of slugArgs) if (!found.has(s)) console.warn(`⚠ unknown pack slug: ${s}`)
  } else if (ALL) {
    targets = inHouse
  } else {
    console.error('Specify pack slugs, or --all for every in-house pack. Add --dry-run to preview.')
    process.exit(1)
  }

  const nonOfficial = targets.filter((p) => !isOfficial(p))
  if (nonOfficial.length) {
    console.warn(`⚠ Skipping non-in-house packs: ${nonOfficial.map((p) => p.slug).join(', ')}`)
  }
  const toPublish = targets.filter((p) => isOfficial(p))

  console.log(`${DRY ? '[dry-run] ' : ''}Publishing ${toPublish.length} pack repo(s) under ${SKILLS_OWNER}/…\n`)
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const THROTTLE_MS = 2500 // stay under GitHub's secondary content-creation limit
  const isCreationBlock = (msg: string) =>
    /Resource not accessible|secondary rate limit|exceeded a secondary|abuse/i.test(msg)
  const results: Result[] = []
  for (const pack of toPublish) {
    try {
      const r = publishPack(pack)
      results.push(r)
      console.log(`  ${r.action.padEnd(9)} ${SKILLS_OWNER}/${r.slug}${r.note ? `  (${r.note})` : ''}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ slug: pack.slug, action: 'skipped', url: packRepoUrl(pack.slug), note: 'error' })
      console.error(`  FAILED    ${SKILLS_OWNER}/${pack.slug}: ${msg}`)
      // GitHub temporarily blocks repo creation after a burst. Stop rather than
      // churn through the rest (which deepens the flag); the run is idempotent,
      // so re-run after the cooldown to create whatever is still missing.
      if (isCreationBlock(msg)) {
        console.error(
          '\n⛔ GitHub is rate-limiting/abuse-blocking repo creation. Stopping early.\n' +
            '   Wait for the cooldown (typically ~1 hour), then re-run the same command —\n' +
            '   already-created repos are skipped, only the missing ones are made.'
        )
        break
      }
    }
    if (!DRY) await sleep(THROTTLE_MS)
  }

  await updateDb(results)

  const by = (a: Result['action']) => results.filter((r) => r.action === a).length
  console.log(`\nDone. created=${by('created')} synced=${by('synced')} unchanged=${by('unchanged')} skipped=${by('skipped')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
