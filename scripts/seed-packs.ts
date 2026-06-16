/**
 * Seeds SkillShelf with launch packs.
 * Run: npm run db:seed-packs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Skills must already be seeded (npm run db:seed) before running this.
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })
config()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const PACK_DEFINITIONS = [
  {
    slug: 'solo-founder-stack',
    name: 'Solo Founder Stack',
    tagline: 'Everything a solo founder needs from idea to first $10k MRR.',
    description: 'A curated collection for founders building alone. Covers investor updates, competitive intelligence, pricing strategy, cold email, landing page copy, and unit economics. Built from what actually gets used in the first 18 months.',
    author: 'SkillShelf',
    category: 'business',
    tags: ['startups', 'founder', 'business'],
    featured: true, verified: true, free: true,
    install_count: 14800,
    skill_slugs: [
      'investor-update-writer', 'competitive-intelligence', 'pricing-strategy',
      'cold-email-craft', 'landing-page-copy', 'go-to-market-planner',
      'unit-economics', 'pitch-deck-narrative', 'fact-checker',
      'financial-planner', 'market-sizing', 'fundraising-narrative',
    ],
  },
  {
    slug: 'design-system-builder',
    name: 'Design System Builder',
    tagline: 'From tokens to components to documentation — the complete design system workflow.',
    description: 'Build a production design system end to end. Covers design token systems, component API design, color accessibility, dark mode, icon systems, and prototype specs.',
    author: 'SkillShelf',
    category: 'design',
    tags: ['design-system', 'design', 'components'],
    featured: true, verified: true, free: true,
    install_count: 9200,
    skill_slugs: [
      'design-token-system', 'component-api-design', 'color-accessibility',
      'dark-mode-design', 'icon-system', 'prototype-spec',
      'animation-system', 'anthropic-frontend-design',
    ],
  },
  {
    slug: 'content-marketing-engine',
    name: 'Content Marketing Engine',
    tagline: 'LinkedIn, Twitter, blog, newsletter — one pack, every channel.',
    description: 'A full content marketing stack. Includes LinkedIn posts, tweet threads, technical blog, email newsletters, landing page copy, case studies, and brand voice.',
    author: 'SkillShelf',
    category: 'writing',
    tags: ['content', 'marketing', 'writing'],
    featured: true, verified: true, free: true,
    install_count: 22400,
    skill_slugs: [
      'linkedin-post-writer', 'tweet-thread-builder', 'technical-blog-engine',
      'email-newsletter-pro', 'landing-page-copy', 'case-study-builder',
      'brand-guidelines', 'content-brief',
    ],
  },
  {
    slug: 'engineering-workflow',
    name: 'Engineering Workflow',
    tagline: 'The git, review, and release workflow every senior engineer already uses.',
    description: 'Commit messages, PR descriptions, changelogs, readmes, code review, TypeScript strict mode, and TDD — the core workflow skills that separate professional engineers.',
    author: 'SkillShelf',
    category: 'coding',
    tags: ['git', 'workflow', 'engineering'],
    featured: true, verified: true, free: true,
    install_count: 31600,
    skill_slugs: [
      'git-commit-writer', 'pr-description-writer', 'changelog-generator',
      'readme-generator', 'code-review-checklist', 'typescript-strict',
      'tdd-expert', 'karpathy-behavioral-rules',
    ],
  },
  {
    slug: 'legal-team-starter',
    name: 'Legal Team Starter',
    tagline: 'NDA triage, contract review, terms drafting — the essentials for in-house legal.',
    description: 'Skills for legal teams and founders handling their own legal work. Covers contract review, terms of service, employment contract flags, startup legal basics, and regulatory scanning.',
    author: 'SkillShelf',
    category: 'business',
    tags: ['legal', 'compliance', 'contracts'],
    featured: false, verified: true, free: true,
    install_count: 7400,
    skill_slugs: [
      'contract-reviewer', 'terms-of-service', 'employment-contract',
      'startup-legal-basics', 'regulatory-scan', 'fact-checker',
    ],
  },
  {
    slug: 'data-analyst-toolkit',
    name: 'Data Analyst Toolkit',
    tagline: 'From raw data to board-ready insights, every step covered.',
    description: 'The complete data analysis workflow: SQL to insights, pandas, A/B tests, funnel analysis, customer analytics, and dashboard narration.',
    author: 'SkillShelf',
    category: 'data',
    tags: ['analytics', 'data', 'sql'],
    featured: false, verified: true, free: true,
    install_count: 18200,
    skill_slugs: [
      'sql-to-insights', 'pandas-expert', 'ab-test-analyzer',
      'funnel-analysis', 'customer-analytics', 'dashboard-narrator',
      'revenue-modeling',
    ],
  },
  {
    slug: 'saas-growth-stack',
    name: 'SaaS Growth Stack',
    tagline: 'Acquisition, activation, retention — the full SaaS growth toolkit.',
    description: 'Everything you need to grow a SaaS product. Covers growth modeling, churn reduction, expansion revenue, customer success QBRs, product analytics, and unit economics.',
    author: 'SkillShelf',
    category: 'business',
    tags: ['saas', 'growth', 'product'],
    featured: false, verified: true, free: true,
    install_count: 16400,
    skill_slugs: [
      'growth-model', 'churn-reduction', 'expansion-revenue',
      'customer-success-qbr', 'product-analytics', 'unit-economics',
      'saas-pricing',
    ],
  },
  {
    slug: 'remote-team-toolkit',
    name: 'Remote Team Toolkit',
    tagline: 'Run a tight remote team without drowning in meetings.',
    description: 'Async communication, meeting notes, weekly reviews, 1:1 agendas, OKRs, and feedback delivery — the full stack for high-functioning remote teams.',
    author: 'SkillShelf',
    category: 'productivity',
    tags: ['remote', 'teams', 'management'],
    featured: false, verified: true, free: true,
    install_count: 12800,
    skill_slugs: [
      'meeting-notes-to-actions', 'weekly-review', 'okr-builder',
      'feedback-writer', 'stakeholder-update', 'async-communication',
      'one-on-one-agenda',
    ],
  },
  {
    slug: 'devops-platform-engineer',
    name: 'DevOps & Platform Engineering',
    tagline: 'Infrastructure as code, CI/CD, containers, and observability.',
    description: 'Terraform, GitHub Actions, Docker Compose, Kubernetes, and observability — the tools platform engineers use every day, encoded as skills.',
    author: 'SkillShelf',
    category: 'coding',
    tags: ['devops', 'infrastructure', 'platform'],
    featured: false, verified: true, free: true,
    install_count: 19400,
    skill_slugs: [
      'terraform-expert', 'github-actions', 'docker-compose-wizard',
      'kubernetes-basics', 'observability-stack', 'env-doctor',
      'security-audit',
    ],
  },
  {
    slug: 'academic-researcher',
    name: 'Academic Researcher',
    tagline: 'Literature reviews, systematic reviews, citations, and grant writing.',
    description: 'A skill pack for academics and researchers. Covers systematic reviews, literature synthesis, citation management, grant writing, policy briefs, and academic abstracts.',
    author: 'SkillShelf',
    category: 'research',
    tags: ['academic', 'research', 'writing'],
    featured: false, verified: true, free: true,
    install_count: 8600,
    skill_slugs: [
      'systematic-review', 'literature-review', 'citation-tracker',
      'grant-writing', 'academic-abstract', 'policy-brief',
      'fact-checker',
    ],
  },
]

async function main() {
  if (!url || !key) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  console.log(`Seeding ${PACK_DEFINITIONS.length} packs...`)

  for (const packDef of PACK_DEFINITIONS) {
    const { skill_slugs, ...packData } = packDef

    // Upsert the pack
    const { data: pack, error: packError } = await supabase
      .from('packs')
      .upsert(packData, { onConflict: 'slug' })
      .select('id, slug')
      .single()

    if (packError || !pack) {
      console.error(`  ✗ ${packDef.slug}: ${packError?.message}`)
      continue
    }

    // Look up skill IDs by slug
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, slug')
      .in('slug', skill_slugs)

    if (skillsError) {
      console.error(`  ✗ skill lookup for ${packDef.slug}: ${skillsError.message}`)
      continue
    }

    const foundSlugs = new Set((skills ?? []).map((s: { slug: string }) => s.slug))
    const missingSlugs = skill_slugs.filter((s) => !foundSlugs.has(s))
    if (missingSlugs.length > 0) {
      console.warn(`  ⚠ ${packDef.slug}: skills not found (run db:seed first): ${missingSlugs.join(', ')}`)
    }

    // Build pack_skills rows in the defined order
    const packSkills = (skills ?? []).map((skill: { id: string; slug: string }) => ({
      pack_id: pack.id,
      skill_id: skill.id,
      position: skill_slugs.indexOf(skill.slug),
    }))

    if (packSkills.length > 0) {
      // Remove existing pack_skills for this pack, then re-insert
      await supabase.from('pack_skills').delete().eq('pack_id', pack.id)
      const { error: psError } = await supabase.from('pack_skills').insert(packSkills)
      if (psError) {
        console.error(`  ✗ pack_skills for ${packDef.slug}: ${psError.message}`)
        continue
      }
    }

    console.log(`  ✓ ${pack.slug} (${packSkills.length} skills)`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
