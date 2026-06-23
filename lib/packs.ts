import 'server-only'
import { getSupabase } from './supabase'
import { PACK_DEFINITIONS } from './pack-definitions'
import { searchTerms, toTsQuery } from './search'
import { embedText, isEmbeddingConfigured } from './embeddings'
import type { Pack, PackCategory } from './types'

/** See lib/data.ts — same calibrated floor, shared env knob. */
const SEMANTIC_MIN_SIMILARITY = Number(process.env.SEMANTIC_SEARCH_MIN_SIMILARITY ?? 0.37)

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

  // One builder per FTS expression so we can re-run with a looser query on a miss.
  const query_ = (ts: string) => {
    let builder = supabase
      .from('packs')
      .select(`
        *,
        pack_skills(count)
      `, { count: 'exact' })
    if (category) builder = builder.eq('category', category)
    if (featured) builder = builder.eq('featured', true)
    // Full-text match against the `fts` tsvector (name+tagline+tags+description,
    // English-stemmed). Prefix query — see lib/search.ts toTsQuery().
    if (ts) builder = builder.textSearch('fts', ts, { config: 'english' })
    return builder.order('install_count', { ascending: false }).range(offset, offset + limit - 1)
  }

  let res = await query_(toTsQuery(query))
  if (res.error) {
    console.error('[getPacks] error:', res.error.message)
    return applyFallbackPackQuery(opts)
  }

  // Recall fallback: retry OR-combined when the strict AND query misses. See getSkills.
  if ((!res.data || res.data.length === 0) && searchTerms(query).length > 1) {
    const or = await query_(toTsQuery(query, '|'))
    if (!or.error && or.data && or.data.length > 0) res = or
  }

  const { data, count } = res
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

/**
 * Semantic "related" packs for a free-text query, via the `match_packs` RPC
 * (migration 0009). The recall safety net for vocabulary gaps keyword/FTS
 * can't bridge. Returns full pack rows (hydrated by slug, with skill_count) in
 * similarity order; degrades to [] on any failure. See getRelatedSkills.
 */
export async function getRelatedPacks(
  query: string,
  opts: { excludeIds?: string[]; limit?: number } = {}
): Promise<Pack[]> {
  const limit = opts.limit ?? 4
  const excludeIds = opts.excludeIds ?? []
  const supabase = getSupabase()
  if (!supabase || !isEmbeddingConfigured() || !query.trim()) return []

  try {
    const vec = JSON.stringify(await embedText(query))
    const { data, error } = await supabase.rpc('match_packs', {
      query_embedding: vec,
      match_count: limit * 2,
      exclude_ids: excludeIds,
    })
    if (error || !Array.isArray(data)) {
      if (error) console.warn('[getRelatedPacks] match_packs error:', error.message)
      return []
    }
    const matches = (data as { slug: string; similarity: number }[])
      .filter((r) => (r.similarity ?? 0) >= SEMANTIC_MIN_SIMILARITY)
      .slice(0, limit)
    if (matches.length === 0) return []
    const simBySlug = new Map(matches.map((m) => [m.slug, m.similarity]))
    const rows = await getPacksBySlugs(matches.map((m) => m.slug))
    return rows.map((r) => ({ ...r, similarity: simBySlug.get(r.slug) ?? 0 }))
  } catch (err) {
    console.warn(
      '[getRelatedPacks] semantic path failed:',
      err instanceof Error ? err.message : err
    )
    return []
  }
}

/**
 * Fetch a hand-picked set of packs by slug, returned in the exact order given.
 * Used by the landing-page showcase to surface one pack per discipline so the
 * grid conveys the breadth of the catalog instead of clustering by install
 * count. Missing slugs are silently skipped; falls back to seed packs offline.
 */
export async function getPacksBySlugs(slugs: string[]): Promise<Pack[]> {
  if (slugs.length === 0) return []
  const order = new Map(slugs.map((slug, i) => [slug, i]))
  const bySlug = (a: Pack, b: Pack) =>
    (order.get(a.slug) ?? Infinity) - (order.get(b.slug) ?? Infinity)

  const supabase = getSupabase()
  if (!supabase) {
    return SEED_PACKS.filter((p) => order.has(p.slug)).sort(bySlug)
  }

  const { data, error } = await supabase
    .from('packs')
    .select(`*, pack_skills(count)`)
    .in('slug', slugs)

  if (error || !data) {
    if (error) console.error('[getPacksBySlugs] error:', error.message)
    return SEED_PACKS.filter((p) => order.has(p.slug)).sort(bySlug)
  }

  return (data as Record<string, unknown>[])
    .map((p) => ({
      ...p,
      skill_count: Array.isArray(p.pack_skills)
        ? (p.pack_skills[0] as { count: number })?.count ?? 0
        : 0,
    }))
    .sort((a, b) => bySlug(a as Pack, b as Pack)) as Pack[]
}

function applyFallbackPackQuery(opts: PackQuery): PackPage {
  const { category, featured, limit = 12, offset = 0, query } = opts
  let rows = [...SEED_PACKS]

  if (category) rows = rows.filter((p) => p.category === category)
  if (featured) rows = rows.filter((p) => p.featured)
  const terms = searchTerms(query)
  if (terms.length) {
    // Mirror the DB's full-text behaviour: every term must appear somewhere in
    // name / tagline / tags (AND across terms, OR across fields).
    rows = rows.filter((p) => {
      const hay = `${p.name} ${p.tagline} ${p.tags.join(' ')}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }

  return { packs: rows.slice(offset, offset + limit), total: rows.length }
}
