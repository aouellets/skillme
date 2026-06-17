import 'server-only'
import { getSupabase } from './supabase'
import { SEED_SKILLS, type SeedSkill } from './seed-data'
import type { Skill, SkillCategory } from './types'

export type SortOption = 'trending' | 'newest' | 'top_rated'

export interface SkillQuery {
  query?: string
  category?: SkillCategory
  sort?: SortOption
  limit?: number
  offset?: number
  featured?: boolean
}

export interface SkillPage {
  skills: Skill[]
  total: number
}

const NOW = '2026-01-01T00:00:00.000Z'

/** Deterministic, browsable fallback catalog when Supabase is not configured. */
function seedToSkill(seed: SeedSkill, index: number): Skill {
  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    category: seed.category,
    source_url: seed.source_url,
    author: seed.author,
    skill_content: seed.skill_content,
    install_count: seed.install_count,
    rating_avg: seed.rating_avg,
    rating_count: seed.rating_count,
    verified: seed.verified,
    featured: seed.featured,
    free: true,
    tags: seed.tags,
    thumbnail_url:    seed.thumbnail_url,
    thumbnail_gif:    seed.thumbnail_gif,
    thumbnail_video:  seed.thumbnail_video,
    thumbnail_lottie: seed.thumbnail_lottie,
    media_alt:        seed.media_alt,
    // Stagger created_at so "newest" sorting is stable in fallback mode.
    created_at: new Date(Date.parse(NOW) - index * 86_400_000).toISOString(),
    updated_at: NOW,
  }
}

const FALLBACK: Skill[] = SEED_SKILLS.map(seedToSkill)

function applyFallbackQuery(opts: SkillQuery): SkillPage {
  const { query, category, sort = 'trending', limit = 12, offset = 0, featured } = opts
  let rows = [...FALLBACK]

  if (featured) rows = rows.filter((s) => s.featured)
  if (category) rows = rows.filter((s) => s.category === category)
  if (query) {
    const q = query.toLowerCase()
    rows = rows.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  rows.sort((a, b) => {
    if (sort === 'newest') return Date.parse(b.created_at) - Date.parse(a.created_at)
    if (sort === 'top_rated') return b.rating_avg - a.rating_avg
    return b.install_count - a.install_count
  })

  const total = rows.length
  return { skills: rows.slice(offset, offset + limit), total }
}

function orderColumn(sort: SortOption): { column: string; ascending: boolean } {
  if (sort === 'newest') return { column: 'created_at', ascending: false }
  if (sort === 'top_rated') return { column: 'rating_avg', ascending: false }
  return { column: 'install_count', ascending: false }
}

export async function getSkills(opts: SkillQuery = {}): Promise<SkillPage> {
  const supabase = getSupabase()
  if (!supabase) return applyFallbackQuery(opts)

  const { query, category, sort = 'trending', limit = 12, offset = 0, featured } = opts
  const { column, ascending } = orderColumn(sort)

  let builder = supabase.from('skills').select('*', { count: 'exact' })

  if (featured) builder = builder.eq('featured', true)
  if (category) builder = builder.eq('category', category)
  if (query && query.trim()) {
    builder = builder.or(
      `name.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`
    )
  }

  builder = builder.order(column, { ascending }).range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) {
    console.error('[getSkills] Supabase error, using fallback:', error.message, error.code)
    return applyFallbackQuery(opts)
  }

  return { skills: (data ?? []) as Skill[], total: count ?? data?.length ?? 0 }
}

export async function getFeaturedSkills(limit = 6): Promise<Skill[]> {
  const { skills } = await getSkills({ featured: true, sort: 'trending', limit })
  return skills
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const supabase = getSupabase()
  if (!supabase) return FALLBACK.find((s) => s.slug === slug) ?? null

  const { data, error } = await supabase.from('skills').select('*').eq('slug', slug).single()
  if (error || !data) {
    return FALLBACK.find((s) => s.slug === slug) ?? null
  }
  return data as Skill
}

// Re-exported from the client-safe module so it can be used in both server and
// client components (SkillCard renders inside the client BrowseClient).
export { isNewSkill } from './categories'

export async function getAllSlugs(): Promise<string[]> {
  const supabase = getSupabase()
  if (!supabase) return FALLBACK.map((s) => s.slug)

  const { data, error } = await supabase.from('skills').select('slug')
  if (error || !data) return FALLBACK.map((s) => s.slug)
  return data.map((r) => r.slug as string)
}
