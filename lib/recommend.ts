import 'server-only'
import { getSupabase } from './supabase'
import { getSkills } from './data'
import { getPacks } from './packs'
import { embedText, isEmbeddingConfigured } from './embeddings'

/**
 * Semantic recommender: turn a free-text task into the most relevant skills and
 * packs. The primary path embeds the task and runs pgvector cosine top-k via the
 * `match_skills` / `match_packs` RPCs (migration 0009). Every failure mode —
 * no embedding credential, no Supabase, an RPC error — degrades to the existing
 * lexical `getSkills` / `getPacks` search so the tool never hard-fails.
 */

export interface RecSkill {
  id: string
  slug: string
  name: string
  category: string
  description: string
  tags?: string[]
  similarity: number
}

export interface RecPack {
  id: string
  slug: string
  name: string
  tagline?: string
  description: string
  category: string
  similarity: number
}

export interface RecResult {
  skills: RecSkill[]
  packs: RecPack[]
  /** Which retrieval path produced these results. */
  mode: 'semantic' | 'lexical'
}

export interface RecommendOptions {
  skillLimit?: number
  packLimit?: number
  /** Skill ids to drop from results (e.g. already installed). */
  excludeSkillIds?: string[]
}

export async function recommendSkills(
  task: string,
  opts: RecommendOptions = {}
): Promise<RecResult> {
  const skillLimit = opts.skillLimit ?? 12
  const packLimit = opts.packLimit ?? 4
  const exclude = opts.excludeSkillIds ?? []
  const supabase = getSupabase()

  // ── Semantic path ──────────────────────────────────────────────────────
  if (supabase && isEmbeddingConfigured() && task.trim()) {
    try {
      const vec = JSON.stringify(await embedText(task))
      const [skillRes, packRes] = await Promise.all([
        supabase.rpc('match_skills', {
          query_embedding: vec,
          match_count: skillLimit,
          exclude_ids: exclude,
        }),
        supabase.rpc('match_packs', { query_embedding: vec, match_count: packLimit }),
      ])
      if (!skillRes.error && !packRes.error && Array.isArray(skillRes.data)) {
        return {
          skills: skillRes.data as RecSkill[],
          packs: (packRes.data ?? []) as RecPack[],
          mode: 'semantic',
        }
      }
      console.warn(
        '[recommend] match RPC error, falling back to lexical:',
        skillRes.error?.message ?? packRes.error?.message
      )
    } catch (err) {
      console.warn(
        '[recommend] semantic path failed, falling back to lexical:',
        err instanceof Error ? err.message : err
      )
    }
  }

  // ── Lexical fallback ───────────────────────────────────────────────────
  const [skillPage, packPage] = await Promise.all([
    getSkills({ query: task, limit: skillLimit }),
    getPacks({ query: task, limit: packLimit }),
  ])
  const exSet = new Set(exclude)
  return {
    skills: skillPage.skills
      .filter((s) => !exSet.has(s.id))
      .map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        category: s.category,
        description: s.description,
        tags: s.tags ?? undefined,
        similarity: 0,
      })),
    packs: packPage.packs.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline ?? undefined,
      description: p.description,
      category: p.category,
      similarity: 0,
    })),
    mode: 'lexical',
  }
}
