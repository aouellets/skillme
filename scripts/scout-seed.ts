/**
 * Seed the Skill Scout Report (2026-06-20) candidates into the catalog.
 *
 * Encodes the nine vetted GitHub candidates and ingests them through the shared
 * engine (`lib/ingest.ts`): license-gated, safety-classified, auto-published.
 * Single-skill repos become skills; multi-skill suites become packs whose
 * members are the repo's individual skills.
 *
 * Note: the report listed "obra/superpowers-marketplace", which is only a
 * marketplace pointer (no SKILL.md). The real skills live in `obra/superpowers`
 * (MIT, 234k★, 14 skills) — that is what we ingest for the Superpowers pack.
 *
 * Usage:
 *   npx tsx scripts/scout-seed.ts --dry-run   # preview discovery + counts
 *   npx tsx scripts/scout-seed.ts             # publish to the catalog
 *   npx tsx scripts/scout-seed.ts --resume    # only ingest skills not yet present
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { ingestRepo, type IngestRepoSpec, type SkillResult } from '../lib/ingest'
import { isClassifierConfigured } from '../lib/safety-core'

config({ path: '.env.local' })
config()

const CANDIDATES: IngestRepoSpec[] = [
  // ── Single-skill repos ────────────────────────────────────────────────────
  { owner: 'eugeniughelbur', repo: 'obsidian-second-brain' },
  { owner: 'louisedesadeleer', repo: 'clipify' },
  { owner: 'uditgoenka', repo: 'autoresearch' },
  { owner: 'ayghri', repo: 'i-have-adhd' },

  // ── Multi-skill suites → packs ────────────────────────────────────────────
  {
    owner: 'nowork-studio',
    repo: 'NotFair',
    pack: {
      slug: 'notfair-growth-suite',
      name: 'NotFair Growth Suite',
      tagline: 'SEO, GEO, Google Ads, and Meta Ads execution in one suite.',
      description:
        'A full growth-marketing toolkit covering technical SEO, generative-engine optimization (GEO), Google Ads audit/copy/landing/management, and Meta Ads. Fills the platform paid-ads gap with hands-on, channel-specific execution skills.',
      category: 'business',
      tags: ['marketing', 'paid-ads', 'seo', 'meta-ads', 'google-ads'],
    },
  },
  {
    owner: 'obra',
    repo: 'superpowers',
    pack: {
      slug: 'superpowers',
      name: 'Superpowers',
      tagline: 'TDD, systematic debugging, and planning discipline for agents.',
      description:
        'The flagship engineering-discipline framework: test-driven development, systematic debugging, writing and executing plans, code review, git worktrees, and parallel-agent dispatch. The most-used skill framework in the ecosystem.',
      category: 'coding',
      tags: ['tdd', 'debugging', 'planning', 'engineering', 'workflow'],
    },
  },
  {
    owner: 'zubair-trabzada',
    repo: 'ai-marketing-claude',
    pack: {
      slug: 'ai-marketing-suite',
      name: 'AI Marketing Suite',
      tagline: 'Ads, copy, funnels, launches, SEO, social — the full marketing stack.',
      description:
        'A broad marketing playbook suite: ad creative, brand and competitor audits, copywriting, email, funnels, landing pages, launches, proposals, reporting, SEO, and social. Deeper than single marketing skills for solo founders running their own GTM.',
      category: 'business',
      tags: ['marketing', 'copywriting', 'funnels', 'launch', 'social'],
    },
  },
  {
    owner: 'shawnpang',
    repo: 'startup-founder-skills',
    pack: {
      slug: 'startup-founder-skills',
      name: 'Startup Founder Skills',
      tagline: 'Fundraising, sales, hiring, and ops skills for founders.',
      description:
        'Operating skills across the founder job: accelerator applications, board updates, churn analysis, competitive analysis, content strategy, contracts, data rooms, cold outreach, and more. Built for early-stage founders wearing every hat.',
      category: 'business',
      tags: ['startups', 'founder', 'fundraising', 'sales', 'operations'],
    },
  },
  {
    owner: 'Affitor',
    repo: 'affiliate-skills',
    pack: {
      slug: 'affiliate-marketing-skills',
      name: 'Affiliate Marketing Skills',
      tagline: 'Content, SEO, automation, and analytics for affiliate marketers.',
      description:
        'A deep affiliate-marketing toolkit: blog and listicle builders, comparison and how-to writers, keyword clustering, SEO audits, conversion tracking, A/B testing, email and multi-program automation, and trend research.',
      category: 'business',
      tags: ['affiliate', 'marketing', 'seo', 'content', 'automation'],
    },
  },
]

function logSkill(r: SkillResult) {
  const mark =
    r.status === 'added' || r.status === 'updated'
      ? '✓'
      : r.status === 'exists'
        ? '='
        : r.status === 'dry-run'
          ? '·'
          : '✗'
  const reason = r.reason ? ` — ${r.reason}` : ''
  console.log(`    ${mark} [${r.status}] ${r.slug}${reason}`)
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const resume = process.argv.includes('--resume')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('Missing Supabase credentials in .env.local.')
    process.exit(1)
  }
  if (!dryRun && !isClassifierConfigured()) {
    console.error('Missing classifier credential (ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY) in .env.local.')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  console.log(`Scout seed — ${CANDIDATES.length} candidates${dryRun ? ' (dry-run)' : resume ? ' (resume)' : ''}\n`)
  let totalPublished = 0
  let totalSkills = 0
  const packsCreated: string[] = []

  for (const spec of CANDIDATES) {
    console.log(`▸ ${spec.owner}/${spec.repo}${spec.pack ? ` → pack:${spec.pack.slug}` : ''}`)
    const result = await ingestRepo(supabase, spec, { dryRun, skipExisting: resume, onSkill: logSkill })

    if (result.skipped) {
      console.warn(`    ⚠ skipped: ${result.skipped}\n`)
      continue
    }
    const published = result.skills.filter((s) => s.status === 'added' || s.status === 'updated').length
    totalPublished += published
    totalSkills += result.skills.length
    if (result.pack?.status === 'added') packsCreated.push(result.pack.slug)
    const packNote = result.pack ? ` | pack ${result.pack.status} (${result.pack.members} members)` : ''
    console.log(`    → ${dryRun ? result.skills.length + ' discovered' : published + '/' + result.skills.length + ' published'} (license ${result.license})${packNote}\n`)
  }

  console.log('─'.repeat(60))
  console.log(
    dryRun
      ? `Dry-run: ${totalSkills} skills across ${CANDIDATES.length} repos would be ingested.`
      : `Done: ${totalPublished}/${totalSkills} skills published, ${packsCreated.length} packs created (${packsCreated.join(', ')}).`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
