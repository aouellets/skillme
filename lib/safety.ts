import 'server-only'
import {
  CLASSIFIER_MODEL,
  SAFETY_SYSTEM,
  classify,
  isClassifierConfigured,
  type Classification,
} from './safety-core'

/**
 * Server-only safety surface for Next code.
 *
 * The classifier itself lives in `lib/safety-core.ts` (runtime-agnostic) so the
 * ingest CLI and cron route can reuse it. This module re-exports that core
 * behind the `server-only` guard and adds `classifySafe` — the best-effort
 * wrapper used by the public submit API (`/api/submit`), which must never throw
 * so submissions still land in the review queue for a human to decide.
 */

export {
  CLASSIFIER_MODEL,
  SAFETY_SYSTEM,
  classify,
  isClassifierConfigured,
  type Classification,
}

export type SafetyVerdict = 'safe' | 'unsafe' | 'unknown'

export interface SafetyResult {
  verdict: SafetyVerdict
  reason: string
  model: string | null
  /** Metadata the classifier suggested; absent when the call could not run. */
  suggested?: Pick<Classification, 'name' | 'description' | 'category' | 'tags'>
}

/**
 * Best-effort wrapper for the submit API. Never throws — returns an 'unknown'
 * verdict when the classifier is unconfigured or errors, so submissions still
 * land in the review queue for a human to decide.
 */
export async function classifySafe(content: string): Promise<SafetyResult> {
  if (!isClassifierConfigured()) {
    return {
      verdict: 'unknown',
      reason: 'Automated safety check not configured — pending human review.',
      model: null,
    }
  }
  try {
    const c = await classify(content)
    return {
      verdict: c.safe ? 'safe' : 'unsafe',
      reason: c.reason,
      model: CLASSIFIER_MODEL,
      suggested: {
        name: c.name,
        description: c.description,
        category: c.category,
        tags: c.tags,
      },
    }
  } catch (err) {
    return {
      verdict: 'unknown',
      reason: `Automated safety check failed: ${
        err instanceof Error ? err.message : 'unknown error'
      }. Pending human review.`,
      model: CLASSIFIER_MODEL,
    }
  }
}
