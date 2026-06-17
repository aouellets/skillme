import 'server-only'
import { getSupabase } from './supabase'
import type { Pack, PackCategory } from './types'

export interface PackQuery {
  category?: PackCategory
  featured?: boolean
  limit?: number
  offset?: number
  query?: string
}

export interface PackPage {
  packs: Pack[]
  total: number
}

/** Fallback seed packs — shown when Supabase is unavailable */
export const SEED_PACKS: Pack[] = [
  {
    id: 'pack-solo-founder',
    slug: 'solo-founder-stack',
    name: 'Solo Founder Stack',
    tagline: 'Everything a solo founder needs from idea to first $10k MRR.',
    description: 'A curated collection of 12 skills for founders building alone. Covers investor updates, competitive intelligence, pricing strategy, cold email, landing page copy, and unit economics. Built from what actually gets used in the first 18 months.',
    author: 'Skill Me',
    category: 'business',
    tags: ['startups', 'founder', 'business'],
    install_count: 14800,
    featured: true,
    verified: true,
    free: true,
    skill_count: 12,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pack-design-system',
    slug: 'design-system-builder',
    name: 'Design System Builder',
    tagline: 'From tokens to components to documentation — the complete design system workflow.',
    description: 'Build a production design system end to end. Covers design token systems, component API design, color accessibility, dark mode, icon systems, and prototype specs. 8 complementary skills that work together.',
    author: 'Skill Me',
    category: 'design',
    tags: ['design-system', 'design', 'components'],
    install_count: 9200,
    featured: true,
    verified: true,
    free: true,
    skill_count: 8,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pack-content-marketing',
    slug: 'content-marketing-engine',
    name: 'Content Marketing Engine',
    tagline: 'LinkedIn, Twitter, blog, newsletter — one pack, every channel.',
    description: 'A full content marketing stack for founders and marketers. Includes LinkedIn posts, tweet threads, technical blog, email newsletters, landing page copy, case studies, and brand voice. Write for every channel without starting from scratch each time.',
    author: 'Skill Me',
    category: 'writing',
    tags: ['content', 'marketing', 'writing'],
    install_count: 22400,
    featured: true,
    verified: true,
    free: true,
    skill_count: 9,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pack-eng-workflow',
    slug: 'engineering-workflow',
    name: 'Engineering Workflow',
    tagline: 'The git, review, and release workflow every senior engineer already uses.',
    description: 'Commit messages, PR descriptions, changelogs, readmes, code review, TypeScript strict mode, and TDD — the core workflow skills that separate professional engineers from juniors. 8 skills that complement each other.',
    author: 'Skill Me',
    category: 'coding',
    tags: ['git', 'workflow', 'engineering'],
    install_count: 31600,
    featured: true,
    verified: true,
    free: true,
    skill_count: 8,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pack-legal-team',
    slug: 'legal-team-starter',
    name: 'Legal Team Starter',
    tagline: 'NDA triage, contract review, terms drafting — the essentials for in-house legal.',
    description: 'A skill pack for legal teams and founders who handle their own legal work. Covers contract review, terms of service drafting, employment contract flags, startup legal basics, and regulatory scanning. Built from the Anthropic Claude for Legal Teams pattern library.',
    author: 'Skill Me',
    category: 'business',
    tags: ['legal', 'compliance', 'contracts'],
    install_count: 7400,
    featured: false,
    verified: true,
    free: true,
    skill_count: 6,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pack-data-analyst',
    slug: 'data-analyst-toolkit',
    name: 'Data Analyst Toolkit',
    tagline: 'From raw data to board-ready insights, every step covered.',
    description: 'The complete data analysis workflow: SQL to insights, pandas data cleaning, A/B test analysis, funnel analysis, customer analytics, and dashboard narration. Whether you work in Python or SQL, these skills turn data into decisions.',
    author: 'Skill Me',
    category: 'data',
    tags: ['analytics', 'data', 'sql'],
    install_count: 18200,
    featured: false,
    verified: true,
    free: true,
    skill_count: 7,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

export async function getPacks(opts: PackQuery = {}): Promise<PackPage> {
  const supabase = getSupabase()
  if (!supabase) return applyFallbackPackQuery(opts)

  const { category, featured, limit = 12, offset = 0, query } = opts

  let builder = supabase
    .from('packs')
    .select(`
      *,
      pack_skills(count)
    `, { count: 'exact' })

  if (category) builder = builder.eq('category', category)
  if (featured) builder = builder.eq('featured', true)
  if (query?.trim()) {
    builder = builder.or(
      `name.ilike.%${query.trim()}%,tagline.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`
    )
  }

  builder = builder.order('install_count', { ascending: false }).range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) {
    console.error('[getPacks] error:', error.message)
    return applyFallbackPackQuery(opts)
  }

  const packs = (data ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    skill_count: Array.isArray(p.pack_skills)
      ? (p.pack_skills[0] as { count: number })?.count ?? 0
      : 0,
  })) as Pack[]

  return { packs, total: count ?? packs.length }
}

export async function getPackBySlug(slug: string): Promise<Pack | null> {
  const supabase = getSupabase()
  if (!supabase) return SEED_PACKS.find((p) => p.slug === slug) ?? null

  // Step 1: fetch the pack
  const { data: pack, error: packError } = await supabase
    .from('packs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (packError || !pack) {
    console.error('[getPackBySlug] pack fetch error:', packError?.message)
    return SEED_PACKS.find((p) => p.slug === slug) ?? null
  }

  // Step 2: fetch pack_skills with skill data as a separate query (more reliable)
  const { data: packSkills, error: psError } = await supabase
    .from('pack_skills')
    .select('position, skill_id, skills(*)')
    .eq('pack_id', pack.id)
    .order('position', { ascending: true })

  if (psError) {
    console.error('[getPackBySlug] pack_skills fetch error:', psError.message)
    return { ...pack, skills: [], skill_count: 0 } as unknown as Pack
  }

  const skills = (packSkills ?? [])
    .map((ps: Record<string, unknown>) => ps.skills)
    .filter(Boolean)

  return {
    ...pack,
    skills,
    skill_count: skills.length,
  } as unknown as Pack
}

export async function getFeaturedPacks(limit = 4): Promise<Pack[]> {
  const { packs } = await getPacks({ featured: true, limit })
  return packs
}

function applyFallbackPackQuery(opts: PackQuery): PackPage {
  const { category, featured, limit = 12, offset = 0, query } = opts
  let rows = [...SEED_PACKS]

  if (category) rows = rows.filter((p) => p.category === category)
  if (featured) rows = rows.filter((p) => p.featured)
  if (query?.trim()) {
    const q = query.trim().toLowerCase()
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  return { packs: rows.slice(offset, offset + limit), total: rows.length }
}
