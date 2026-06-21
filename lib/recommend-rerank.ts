import 'server-only'
import { z } from 'zod'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { RecSkill, RecPack } from './recommend'

/**
 * Optional rerank stage: takes the vector/lexical candidates and asks a small
 * model to pick the best few and write a per-result "why it fits your task"
 * reason. Strictly optional — when no credential is configured or the call
 * fails, the caller falls back to vector order with templated reasons, so the
 * recommender works without this.
 *
 * Routed to a direct OpenAI model: the only reliable runtime credential here is
 * OPENAI_API_KEY (there is no direct Anthropic key and the AI Gateway free tier
 * rate-limits Claude models). Override with RERANK_MODEL.
 */

export const RERANK_MODEL = process.env.RERANK_MODEL || 'gpt-4o-mini'

export interface RankedRef {
  id: string
  reason: string
}

export interface RerankOutput {
  skills: RankedRef[]
  pack: RankedRef | null
}

/** True when the rerank stage can run. */
export function isRerankConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY)
}

const RERANK_SCHEMA = z.object({
  skills: z
    .array(z.object({ id: z.string(), reason: z.string().max(200) }))
    .max(8),
  pack: z.object({ id: z.string(), reason: z.string().max(200) }).nullable(),
})

/**
 * Rerank candidates against the task. Returns null when rerank is unavailable or
 * errors — the caller then uses vector order + templated reasons.
 */
export async function rerankRecommendations(
  task: string,
  skills: RecSkill[],
  packs: RecPack[],
  max = 5
): Promise<RerankOutput | null> {
  if (!isRerankConfigured()) return null

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const skillMenu = skills
    .map((s) => `- id=${s.id} | ${s.name} [${s.category}]: ${s.description}`)
    .join('\n')
  const packMenu = packs
    .map((p) => `- id=${p.id} | ${p.name}: ${p.tagline ?? p.description}`)
    .join('\n')

  try {
    const { object } = await generateObject({
      model: openai(RERANK_MODEL),
      schema: RERANK_SCHEMA,
      maxRetries: 2,
      prompt:
        `A user described this task:\n"""${task}"""\n\n` +
        `From the candidate skills and packs below, choose the ${max} MOST relevant skills ` +
        `(fewer if only a few genuinely fit) and the single best-fit pack (or null if none fits). ` +
        `For each choice, write a one-sentence reason addressed to the user ("you") explaining why ` +
        `it fits THIS task. Use ONLY ids from the lists. Order skills best-first.\n\n` +
        `SKILLS:\n${skillMenu}\n\nPACKS:\n${packMenu}`,
    })

    // Drop any hallucinated ids the model invented.
    const skillIds = new Set(skills.map((s) => s.id))
    const packIds = new Set(packs.map((p) => p.id))
    return {
      skills: object.skills.filter((s) => skillIds.has(s.id)).slice(0, max),
      pack: object.pack && packIds.has(object.pack.id) ? object.pack : null,
    }
  } catch (err) {
    console.warn(
      '[recommend] rerank failed, using vector order:',
      err instanceof Error ? err.message : err
    )
    return null
  }
}
