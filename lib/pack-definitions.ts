import type { PackCategory } from './types'

/**
 * Canonical pack catalog — the single source of truth shared by the database
 * seeder (`scripts/seed-packs.ts`) and the app's offline fallback
 * (`SEED_PACKS` in `lib/packs.ts`). Keeping one list here prevents the two from
 * drifting (and the per-pack skill count from going stale).
 *
 * Every entry in `skill_slugs` must be a real skill slug from
 * `lib/seed-data.ts`; the seeder warns on any that don't resolve.
 *
 * This module is intentionally free of `server-only` and runtime dependencies so
 * the tsx-run seed script can import it directly.
 */
export interface PackDefinition {
  slug: string
  name: string
  tagline: string
  description: string
  author: string
  category: PackCategory
  tags: string[]
  featured: boolean
  verified: boolean
  free: boolean
  install_count: number
  skill_slugs: string[]
}

export const PACK_DEFINITIONS: PackDefinition[] = [
  // ── Launch packs ────────────────────────────────────────────────────────
  {
    slug: 'solo-founder-stack',
    name: 'Solo Founder Stack',
    tagline: 'Everything a solo founder needs from idea to first $10k MRR.',
    description:
      'A curated collection for founders building alone. Covers investor updates, competitive intelligence, pricing strategy, cold email, landing page copy, and unit economics. Built from what actually gets used in the first 18 months.',
    author: 'Skill Me',
    category: 'business',
    tags: ['startups', 'founder', 'business'],
    featured: true,
    verified: true,
    free: true,
    install_count: 14800,
    skill_slugs: [
      'investor-update-writer', 'competitive-intelligence', 'pricing-strategy',
      'cold-email-craft', 'landing-page-copy', 'go-to-market-planner',
      'unit-economics', 'fact-checker',
      'financial-planner', 'market-sizing', 'fundraising-narrative',
    ],
  },
  {
    slug: 'design-system-builder',
    name: 'Design System Builder',
    tagline: 'From tokens to components to documentation — the complete design system workflow.',
    description:
      'Build a production design system end to end. Covers design token systems, component API design, color accessibility, dark mode, icon systems, and prototype specs.',
    author: 'Skill Me',
    category: 'design',
    tags: ['design-system', 'design', 'components'],
    featured: true,
    verified: true,
    free: true,
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
    description:
      'A full content marketing stack. Includes LinkedIn posts, tweet threads, technical blog, email newsletters, landing page copy, case studies, and brand voice.',
    author: 'Skill Me',
    category: 'writing',
    tags: ['content', 'marketing', 'writing'],
    featured: true,
    verified: true,
    free: true,
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
    description:
      'Commit messages, PR descriptions, changelogs, readmes, code review, TypeScript strict mode, and TDD — the core workflow skills that separate professional engineers.',
    author: 'Skill Me',
    category: 'coding',
    tags: ['git', 'workflow', 'engineering'],
    featured: true,
    verified: true,
    free: true,
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
    description:
      'Skills for legal teams and founders handling their own legal work. Covers terms of service, employment contract flags, and regulatory scanning.',
    author: 'Skill Me',
    category: 'business',
    tags: ['legal', 'compliance', 'contracts'],
    featured: false,
    verified: true,
    free: true,
    install_count: 7400,
    skill_slugs: [
      'terms-of-service', 'employment-contract',
      'regulatory-scan', 'fact-checker',
    ],
  },
  {
    slug: 'data-analyst-toolkit',
    name: 'Data Analyst Toolkit',
    tagline: 'From raw data to board-ready insights, every step covered.',
    description:
      'The complete data analysis workflow: SQL to insights, pandas, A/B tests, funnel analysis, customer analytics, and data storytelling.',
    author: 'Skill Me',
    category: 'data',
    tags: ['analytics', 'data', 'sql'],
    featured: false,
    verified: true,
    free: true,
    install_count: 18200,
    skill_slugs: [
      'sql-to-insights', 'pandas-expert', 'ab-test-analyzer',
      'funnel-analysis', 'customer-analytics', 'data-story',
      'revenue-modeling',
    ],
  },
  {
    slug: 'saas-growth-stack',
    name: 'SaaS Growth Stack',
    tagline: 'Acquisition, activation, retention — the full SaaS growth toolkit.',
    description:
      'Everything you need to grow a SaaS product. Covers growth modeling, churn reduction, expansion revenue, customer success QBRs, product analytics, and unit economics.',
    author: 'Skill Me',
    category: 'business',
    tags: ['saas', 'growth', 'product'],
    featured: false,
    verified: true,
    free: true,
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
    description:
      'Async communication, meeting notes, weekly reviews, 1:1 agendas, OKRs, and feedback delivery — the full stack for high-functioning remote teams.',
    author: 'Skill Me',
    category: 'productivity',
    tags: ['remote', 'teams', 'management'],
    featured: false,
    verified: true,
    free: true,
    install_count: 12800,
    skill_slugs: [
      'meeting-notes-to-actions', 'weekly-review', 'okr-builder',
      'feedback-writer', 'stakeholder-update', 'async-communication',
      '1on1-agenda',
    ],
  },
  {
    slug: 'devops-platform-engineer',
    name: 'DevOps & Platform Engineering',
    tagline: 'Infrastructure as code, CI/CD, containers, and observability.',
    description:
      'Terraform, GitHub Actions, Docker Compose, Kubernetes, and observability — the tools platform engineers use every day, encoded as skills.',
    author: 'Skill Me',
    category: 'coding',
    tags: ['devops', 'infrastructure', 'platform'],
    featured: false,
    verified: true,
    free: true,
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
    tagline: 'Literature reviews, systematic reviews, citations, and policy briefs.',
    description:
      'A skill pack for academics and researchers. Covers systematic reviews, literature synthesis, citation management, academic essays, and policy briefs.',
    author: 'Skill Me',
    category: 'research',
    tags: ['academic', 'research', 'writing'],
    featured: false,
    verified: true,
    free: true,
    install_count: 8600,
    skill_slugs: [
      'systematic-review', 'literature-review', 'citation-tracker',
      'academic-essay', 'policy-brief', 'fact-checker',
    ],
  },

  // ── Expansion packs ─────────────────────────────────────────────────────
  {
    slug: 'personal-operating-system',
    name: 'Personal Operating System',
    tagline: 'Build the habits, focus, and systems that compound — your life, run like a product.',
    description:
      'A complete operating system for your personal life. Build durable habits, fix your sleep, study faster, journal with intent, make better decisions, manage stress, and run a second brain — the routines high-performers rely on.',
    author: 'Skill Me',
    category: 'personal',
    tags: ['personal', 'habits', 'productivity'],
    featured: true,
    verified: true,
    free: true,
    install_count: 13400,
    skill_slugs: [
      'habit-builder', 'sleep-optimizer', 'study-system',
      'journal-framework', 'decision-making', 'stress-management',
      'goals-accountability', 'second-brain', 'deep-work-planner',
    ],
  },
  {
    slug: 'ai-engineer-toolkit',
    name: 'AI Engineer Toolkit',
    tagline: 'Ship LLM features that work — prompts, evals, agents, and MCP servers.',
    description:
      "The modern AI engineer's toolkit. Design prompts that hold up, build MCP servers, evaluate LLM output rigorously, orchestrate multi-step agents, run deep research, engineer ML features, and handle errors gracefully.",
    author: 'Skill Me',
    category: 'coding',
    tags: ['ai', 'llm', 'agents'],
    featured: true,
    verified: true,
    free: true,
    install_count: 24600,
    skill_slugs: [
      'prompt-engineer', 'mcp-builder', 'llm-evaluation',
      'agent-orchestration', 'deep-research', 'ml-feature-engineering',
      'error-handling',
    ],
  },
  {
    slug: 'product-manager-stack',
    name: 'Product Manager Stack',
    tagline: 'Roadmaps, specs, sprints, and analytics — the PM’s full operating kit.',
    description:
      'Everything a product manager needs to plan and ship. Write roadmaps and specs, define personas, run sprints, set OKRs, read product analytics, map user flows, and write crisp tickets.',
    author: 'Skill Me',
    category: 'productivity',
    tags: ['product', 'pm', 'roadmap'],
    featured: false,
    verified: true,
    free: true,
    install_count: 17200,
    skill_slugs: [
      'product-roadmap', 'technical-spec', 'user-persona',
      'sprint-planning', 'okr-builder', 'product-analytics',
      'user-flow-mapper', 'jira-ticket-writer',
    ],
  },
  {
    slug: 'full-stack-web-dev',
    name: 'Full-Stack Web Dev',
    tagline: 'Next.js to Postgres — build and ship a modern web app end to end.',
    description:
      'The full modern web stack as skills. Next.js App Router, GraphQL and database schema design, OAuth, Stripe billing, Supabase, web performance, and clean API design.',
    author: 'Skill Me',
    category: 'coding',
    tags: ['web', 'fullstack', 'nextjs'],
    featured: false,
    verified: true,
    free: true,
    install_count: 26800,
    skill_slugs: [
      'nextjs-app-router', 'graphql-schema', 'database-schema',
      'oauth-flow', 'stripe-integration', 'supabase-expert',
      'web-performance', 'api-design',
    ],
  },
  {
    slug: 'job-search-kit',
    name: 'Job Search Kit',
    tagline: 'Land the offer — applications, outreach, networking, and negotiation.',
    description:
      'A focused kit for your job hunt. Tailor applications, write cold outreach and a standout LinkedIn presence, build a networking system, and negotiate the offer with confidence.',
    author: 'Skill Me',
    category: 'personal',
    tags: ['career', 'job-search', 'personal'],
    featured: false,
    verified: true,
    free: true,
    install_count: 15600,
    skill_slugs: [
      'job-application', 'salary-negotiation', 'networking-system',
      'linkedin-post-writer', 'cold-email-craft',
    ],
  },
  {
    slug: 'fiction-writers-room',
    name: "Fiction Writer's Room",
    tagline: 'Scenes, voice, and structure — the craft of long-form storytelling.',
    description:
      'For novelists and storytellers. Write vivid scenes, develop a distinct voice through ghostwriting, craft speeches and op-eds, pitch a book proposal, and shape narrative for any audience.',
    author: 'Skill Me',
    category: 'writing',
    tags: ['fiction', 'writing', 'storytelling'],
    featured: false,
    verified: true,
    free: true,
    install_count: 9100,
    skill_slugs: [
      'fiction-scene-writer', 'ghostwriter', 'speech-writer',
      'book-proposal', 'op-ed-writer', 'sermon-writer',
    ],
  },
  {
    slug: 'data-engineering-pipeline',
    name: 'Data Engineering Pipeline',
    tagline: 'Streams, batch, and storage — production data pipelines, encoded.',
    description:
      'Build and run production data pipelines. Kafka streaming, Spark batch jobs, ClickHouse analytics, data quality checks, time-series modeling, ML feature engineering, and query optimization.',
    author: 'Skill Me',
    category: 'data',
    tags: ['data-engineering', 'pipelines', 'data'],
    featured: false,
    verified: true,
    free: true,
    install_count: 14200,
    skill_slugs: [
      'kafka-pipelines', 'spark-jobs', 'clickhouse-analytics',
      'data-quality', 'time-series', 'ml-feature-engineering',
      'sql-query-optimizer', 'mongodb-expert',
    ],
  },
  {
    slug: 'startup-fundraising',
    name: 'Startup Fundraising',
    tagline: 'From first pitch to closed round — the founder’s fundraising playbook.',
    description:
      'Raise your round with confidence. Craft the pitch and fundraising narrative, send investor updates, understand term sheets, prep for Series A and due diligence, size the market, and model the financials.',
    author: 'Skill Me',
    category: 'business',
    tags: ['fundraising', 'startup', 'investors'],
    featured: false,
    verified: true,
    free: true,
    install_count: 11800,
    skill_slugs: [
      'vc-pitch-email', 'fundraising-narrative', 'investor-update-writer',
      'term-sheet-explainer', 'series-a-readiness', 'due-diligence-checklist',
      'market-sizing', 'financial-planner',
    ],
  },
  {
    slug: 'technical-writing-studio',
    name: 'Technical Writing Studio',
    tagline: 'Docs people actually read — READMEs, guides, changelogs, and specs.',
    description:
      'Write technical content that lands. READMEs, developer blogs, changelogs, help docs, API references, process docs, and whitepapers — clear, accurate, and maintainable.',
    author: 'Skill Me',
    category: 'writing',
    tags: ['technical-writing', 'docs', 'writing'],
    featured: false,
    verified: true,
    free: true,
    install_count: 10400,
    skill_slugs: [
      'readme-generator', 'technical-blog-engine', 'changelog-writer',
      'help-documentation', 'api-design', 'process-doc', 'whitepapers',
    ],
  },
  {
    slug: 'bi-and-dashboards',
    name: 'BI & Dashboards',
    tagline: 'Turn warehouse rows into decisions — dashboards and the story behind them.',
    description:
      'The business-intelligence stack. Build dashboards in Tableau and Power BI, turn SQL into insights, narrate the data story, analyze customers, summarize for execs, and spot trends.',
    author: 'Skill Me',
    category: 'data',
    tags: ['bi', 'dashboards', 'analytics'],
    featured: false,
    verified: true,
    free: true,
    install_count: 12100,
    skill_slugs: [
      'tableau-best-practices', 'power-bi-dax', 'sql-to-insights',
      'data-story', 'customer-analytics', 'executive-summary',
      'trend-analysis',
    ],
  },
]
