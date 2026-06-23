import 'server-only'
import { getSupabase } from './supabase'
import { SEED_SKILLS, type SeedSkill } from './seed-data'
import { resolveSourceUrl } from './skill-source'
import { searchTerms, toTsQuery } from './search'
import { embedText, isEmbeddingConfigured } from './embeddings'
import type { Skill, SkillCategory } from './types'

/**
 * Minimum cosine similarity (text-embedding-3-small) for a semantic ("related")
 * match to be shown. Calibrated against prod: gibberish queries top out around
 * 0.31, genuine queries start ~0.39, so 0.37 keeps real matches while dropping
 * noise (the few rows in the 0.31–0.37 band were off-topic). Tunable per-env via
 * SEMANTIC_SEARCH_MIN_SIMILARITY without a code change.
 */
const SEMANTIC_MIN_SIMILARITY = Number(process.env.SEMANTIC_SEARCH_MIN_SIMILARITY ?? 0.37)

export type SortOption = 'trending' | 'newest' | 'top_rated' | 'hot'

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
    source_url: resolveSourceUrl(seed),
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
    // Mirror the DB's initial hot_score seed (ln(1 + install_count)) so the Hot
    // section ranks identically in fallback mode and right after seeding.
    hot_score:        Math.log(1 + seed.install_count),
    featured_rank:    null,
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
  const terms = searchTerms(query)
  if (terms.length) {
    // Mirror the DB's full-text behaviour: every term must appear somewhere in
    // name / description / tags (AND across terms, OR across fields), so
    // multi-word queries match even when the words aren't adjacent.
    rows = rows.filter((s) => {
      const hay = `${s.name} ${s.description} ${s.tags.join(' ')}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }

  rows.sort((a, b) => {
    if (sort === 'newest') return Date.parse(b.created_at) - Date.parse(a.created_at)
    if (sort === 'top_rated') return b.rating_avg - a.rating_avg
    if (sort === 'hot') return (b.hot_score ?? 0) - (a.hot_score ?? 0)
    // Featured shelves order by curator-set rank first, then install volume.
    if (featured) {
      const ra = a.featured_rank ?? Number.MAX_SAFE_INTEGER
      const rb = b.featured_rank ?? Number.MAX_SAFE_INTEGER
      if (ra !== rb) return ra - rb
    }
    return b.install_count - a.install_count
  })

  const total = rows.length
  return { skills: rows.slice(offset, offset + limit), total }
}

function orderColumn(sort: SortOption): { column: string; ascending: boolean } {
  if (sort === 'newest') return { column: 'created_at', ascending: false }
  if (sort === 'top_rated') return { column: 'rating_avg', ascending: false }
  if (sort === 'hot') return { column: 'hot_score', ascending: false }
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
  const ts = toTsQuery(query)
  if (ts) {
    // Full-text match against the `fts` tsvector (name+tags+category+description,
    // weighted, English-stemmed). Prefix + AND query so multi-word and
    // as-you-type searches both work. See lib/search.ts toTsQuery().
    builder = builder.textSearch('fts', ts, { config: 'english' })
  }

  // Featured shelves order by the curator-set rank first (nulls last), then by
  // the requested sort column — so you can hand-pin the top of "Featured".
  if (featured) {
    builder = builder.order('featured_rank', { ascending: true, nullsFirst: false })
  }
  builder = builder.order(column, { ascending }).range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) {
    console.error('[getSkills] Supabase query failed — code:', error.code, 'message:', error.message)
    return applyFallbackQuery(opts)
  }

  if (!data || data.length === 0) {
    // Only treat an empty result as a failure for the unfiltered base catalog
    // (table empty / RLS misconfigured). A genuinely empty search or category
    // result should render an empty state, not silently show seed data.
    if (!query?.trim() && !category && !featured) {
      console.warn('[getSkills] Base query returned zero rows — falling back to seed data')
      return applyFallbackQuery(opts)
    }
    return { skills: [], total: count ?? 0 }
  }

  return { skills: data as Skill[], total: count ?? data.length }
}

interface RelatedOptions {
  /** Skill ids already shown by keyword search — excluded from related. */
  excludeIds?: string[]
  limit?: number
}

/**
 * Semantic "related" skills for a free-text query, via pgvector cosine top-k
 * (the `match_skills` RPC from migration 0009). This is the recall safety net
 * for vocabulary gaps that keyword/FTS can't bridge — e.g. searching
 * "issue tracker" surfacing skills the catalog only tags "project-management".
 *
 * Returns full skill rows (hydrated by slug) in similarity order, filtered by
 * {@link SEMANTIC_MIN_SIMILARITY}. Degrades to [] on every failure mode (no
 * embedding credential, no Supabase, RPC error, empty query) so callers can
 * treat it as a best-effort augmentation.
 */
export async function getRelatedSkills(
  query: string,
  opts: RelatedOptions = {}
): Promise<Skill[]> {
  const limit = opts.limit ?? 6
  const excludeIds = opts.excludeIds ?? []
  const supabase = getSupabase()
  if (!supabase || !isEmbeddingConfigured() || !query.trim()) return []

  try {
    const vec = JSON.stringify(await embedText(query))
    const { data, error } = await supabase.rpc('match_skills', {
      query_embedding: vec,
      // Over-fetch so the similarity floor still leaves up to `limit` rows.
      match_count: limit * 2,
      exclude_ids: excludeIds,
    })
    if (error || !Array.isArray(data)) {
      if (error) console.warn('[getRelatedSkills] match_skills error:', error.message)
      return []
    }
    const matches = (data as { slug: string; similarity: number }[])
      .filter((r) => (r.similarity ?? 0) >= SEMANTIC_MIN_SIMILARITY)
      .slice(0, limit)
    if (matches.length === 0) return []
    const simBySlug = new Map(matches.map((m) => [m.slug, m.similarity]))
    const rows = await getSkillsBySlugs(matches.map((m) => m.slug))
    return rows.map((r) => ({ ...r, similarity: simBySlug.get(r.slug) ?? 0 }))
  } catch (err) {
    console.warn(
      '[getRelatedSkills] semantic path failed:',
      err instanceof Error ? err.message : err
    )
    return []
  }
}

/**
 * Fetch a hand-picked set of skills by slug, returned in the exact order given.
 * Powers the curated landing-page shelves (a marquee spanning every category, a
 * deliberately wide-range "become anything" grid) so the homepage shows the
 * breadth of the catalog deterministically instead of relying on sparse,
 * not-yet-real popularity signals. Missing slugs are skipped; offline it draws
 * from the seed catalog so the shelves never come up empty.
 */
export async function getSkillsBySlugs(slugs: string[]): Promise<Skill[]> {
  if (slugs.length === 0) return []
  const order = new Map(slugs.map((slug, i) => [slug, i]))
  const bySlug = (a: Skill, b: Skill) =>
    (order.get(a.slug) ?? Infinity) - (order.get(b.slug) ?? Infinity)

  const supabase = getSupabase()
  if (!supabase) return FALLBACK.filter((s) => order.has(s.slug)).sort(bySlug)

  const { data, error } = await supabase.from('skills').select('*').in('slug', slugs)
  if (error || !data || data.length === 0) {
    if (error) console.error('[getSkillsBySlugs] error:', error.message)
    return FALLBACK.filter((s) => order.has(s.slug)).sort(bySlug)
  }
  return (data as Skill[]).sort(bySlug)
}

/**
 * Live total number of skills in the catalog. Cheap head-only count query;
 * falls back to the seed catalog size when Supabase is unavailable so marketing
 * copy and OG images never show a zero or a stale hardcoded figure.
 */
export async function getSkillCount(): Promise<number> {
  const supabase = getSupabase()
  if (!supabase) return FALLBACK.length

  const { count, error } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
  if (error || count == null || count === 0) return FALLBACK.length
  return count
}

/**
 * Format a catalog size for display — rounded down to a clean "190+"-style
 * figure so the number reads as a floor, not a precise (and quickly stale) count.
 */
export function formatSkillCount(n: number): string {
  if (n <= 0) return 'Curated'
  if (n < 10) return `${n}`
  return `${Math.floor(n / 10) * 10}+`
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
