import { createHash } from 'node:crypto'
import { embedMany, type EmbeddingModel } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

/**
 * Embedding layer for the semantic recommender.
 *
 * Deliberately free of `server-only` so the tsx backfill script
 * (`scripts/embed-catalog.ts`) and Next server code can both import it,
 * mirroring `lib/safety-core.ts`.
 *
 * Provider resolution prefers a direct `OPENAI_API_KEY` — the Vercel AI Gateway
 * free tier rate-limits embedding models — and falls back to the gateway, where
 * a plain `"provider/model"` string routes automatically via
 * `AI_GATEWAY_API_KEY`. Either path uses the same model and dimensionality.
 */

/**
 * Embedding model id. Stored in gateway-prefixed `provider/model` form; the
 * direct-OpenAI path strips the prefix. Override with `EMBEDDING_MODEL`. The
 * dimensionality below is coupled to this default; switching to a model with a
 * different dimension requires a column migration and a full re-embed (0009).
 */
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'openai/text-embedding-3-small'

/** Vector dimensionality of {@link EMBEDDING_MODEL}; must match `vector(N)` in 0009. */
export const EMBEDDING_DIMS = 1536

/**
 * Resolve the model passed to `embedMany`: a direct OpenAI embedding model when
 * `OPENAI_API_KEY` is set, otherwise the gateway model string (resolved by the
 * AI SDK's default gateway provider via `AI_GATEWAY_API_KEY`).
 */
function resolveEmbeddingModel(): EmbeddingModel {
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const id = EMBEDDING_MODEL.includes('/')
      ? EMBEDDING_MODEL.slice(EMBEDDING_MODEL.indexOf('/') + 1)
      : EMBEDDING_MODEL
    return openai.embedding(id)
  }
  return EMBEDDING_MODEL
}

/** Cap embedding input length — keeps us well under the model's token limit and
 *  bounds cost. Skill bodies are long; the head carries the signal. */
const MAX_INPUT_CHARS = 8000

/** True when an embedding call can run (a direct OpenAI key or the gateway). */
export function isEmbeddingConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY)
}

/** Minimal shape needed to build an embedding input — structural, so both the
 *  DB `Skill` row and the seed `SeedSkill` satisfy it without importing types. */
export interface EmbeddableSkill {
  name: string
  description: string
  category: string
  tags?: string[] | null
  skill_content: string
}

export interface EmbeddablePack {
  name: string
  tagline?: string | null
  description: string
  category: string
  tags?: string[] | null
}

/** Build the text we embed for a skill: the metadata that describes what the
 *  skill is *for* (which is what a task query matches against), then a slice of
 *  the body for depth. */
export function skillEmbeddingInput(skill: EmbeddableSkill): string {
  const tags = (skill.tags ?? []).join(', ')
  return [
    `Skill: ${skill.name}`,
    `Category: ${skill.category}`,
    tags ? `Tags: ${tags}` : '',
    `Description: ${skill.description}`,
    skill.skill_content ? `Content:\n${skill.skill_content}` : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, MAX_INPUT_CHARS)
}

/** Build the text we embed for a pack. Member skill names give the pack its
 *  semantic footprint (what tasks it covers) beyond its own blurb. */
export function packEmbeddingInput(pack: EmbeddablePack, memberSkillNames: string[]): string {
  const tags = (pack.tags ?? []).join(', ')
  const members = memberSkillNames.join(', ')
  return [
    `Pack: ${pack.name}`,
    pack.tagline ? `Tagline: ${pack.tagline}` : '',
    `Category: ${pack.category}`,
    tags ? `Tags: ${tags}` : '',
    `Description: ${pack.description}`,
    members ? `Skills in this pack: ${members}` : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, MAX_INPUT_CHARS)
}

/** Stable hash of an embedding input. Stored alongside the vector so the
 *  backfill can skip rows whose input text is unchanged. */
export function embeddingHash(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

/**
 * Embed a batch of texts via the AI Gateway. Returns one vector per input, in
 * order. Empty input returns an empty array (no network call). Throws on
 * transport errors so the backfill can fail loudly and be re-run.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  const { embeddings } = await embedMany({
    model: resolveEmbeddingModel(),
    values: texts,
    // The gateway free tier 429s under load; honor Retry-After and back off.
    maxRetries: 6,
  })
  return embeddings
}

/** Embed a single text. Convenience wrapper for the query side. */
export async function embedText(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text])
  return vec
}
