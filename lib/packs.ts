import 'server-only'
import { getSupabase } from './supabase'
import { PACK_DEFINITIONS } from './pack-definitions'
import { sanitizeSearchTerm } from './search'
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

/**
 * Fallback seed packs — shown when Supabase is unavailable. Derived from the
 * canonical PACK_DEFINITIONS so this list and the DB seeder never drift and the
 * per-pack skill count is always accurate.
 */
export const SEED_PACKS: Pack[] = PACK_DEFINITIONS.map((p) => ({
  id: `pack-${p.slug}`,
  slug: p.slug,
  name: p.name,
  tagline: p.tagline,
  description: p.description,
  author: p.author,
  repo_url: p.repo_url,
  category: p.category,
  tags: p.tags,
  install_count: p.install_count,
  featured: p.featured,
  verified: p.verified,
  free: p.free,
  skill_count: p.skill_slugs.length,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}))

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
  const q = sanitizeSearchTerm(query)
  if (q) {
    builder = builder.or(
      `name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`
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
