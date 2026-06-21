/**
 * Ingest skills from public GitHub repositories into the Skill Me catalog.
 *
 * Wraps the shared engine in `lib/ingest.ts`: for each target it gates on an
 * allowed open-source license, fetches SKILL.md, runs the Claude safety
 * classifier, and upserts verified skills into Supabase. Repos with multiple
 * SKILL.md files ingest every skill unless a single path is given.
 *
 * Usage:
 *   npx tsx scripts/ingest.ts owner/repo                 # all skills in the repo
 *   npx tsx scripts/ingest.ts owner/repo:path/SKILL.md   # one specific skill
 *   npx tsx scripts/ingest.ts --dry-run owner/repo       # preview, no writes
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or anon), ANTHROPIC_API_KEY
 *   GITHUB_TOKEN (optional — raises GitHub rate limits)
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { ingestRepo, type IngestRepoSpec, type SkillResult } from '../lib/ingest'
import { isClassifierConfigured } from '../lib/safety-core'

config({ path: '.env.local' })
config()

function logSkill(r: SkillResult) {
  const mark =
    r.status === 'added' || r.status === 'updated'
      ? '✓'
      : r.status === 'dry-run'
        ? '·'
        : '✗'
  const label = r.name ? `${r.name} ` : ''
  const reason = r.reason ? ` — ${r.reason}` : ''
  console.log(`  ${mark} [${r.status}] ${label}(${r.slug})${reason}`)
}

async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const targets = argv.filter((a) => !a.startsWith('--'))

  if (targets.length === 0) {
    console.error('Usage: npx tsx scripts/ingest.ts [--dry-run] owner/repo[:path/SKILL.md] ...')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local.')
    process.exit(1)
  }
  if (!dryRun && !isClassifierConfigured()) {
    console.error('Missing classifier credential (ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY) in .env.local.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  for (const arg of targets) {
    const [slug, path] = arg.split(':')
    const [owner, repo] = slug.split('/')
    if (!owner || !repo) {
      console.error(`Skipping "${arg}": expected owner/repo or owner/repo:path`)
      continue
    }

    const spec: IngestRepoSpec = { owner, repo, paths: path ? [path] : undefined }
    console.log(`\nIngesting ${owner}/${repo}${path ? `:${path}` : ''}${dryRun ? ' (dry-run)' : ''}…`)
    const result = await ingestRepo(supabase, spec, { dryRun, onSkill: logSkill })

    if (result.skipped) {
      console.warn(`  ⚠ skipped: ${result.skipped}`)
      continue
    }
    const ok = result.skills.filter((s) => s.status === 'added' || s.status === 'updated').length
    console.log(`  → ${ok}/${result.skills.length} skill(s) published (license: ${result.license})`)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
