import { getServiceSupabase } from '../../supabase'
import { checkRateLimit } from '../rateLimit'
import { text, requireToken, type Tool } from '../types'

interface RateArgs {
  skill_id?: string
  rating?: number
}

export const rateSkill: Tool<RateArgs> = {
  definition: {
    name: 'rate_skill',
    annotations: { title: 'Rate skill', readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    description:
      'Rate a skill from 1 to 5 stars. The rating is recorded against the user and folded into the skill\'s public average.',
    inputSchema: {
      type: 'object',
      required: ['skill_id', 'rating'],
      properties: {
        skill_id: {
          type: 'string',
          description: 'The skill UUID to rate',
        },
        rating: {
          type: 'number',
          description: 'A whole number from 1 (worst) to 5 (best)',
        },
      },
    },
  },
  async handler(args, ctx) {
    if (!args.skill_id) {
      return text('A skill_id is required.', true)
    }

    const rating = Number(args.rating)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return text('Rating must be a whole number from 1 to 5.', true)
    }

    const auth = requireToken(ctx)
    if ('error' in auth) return auth.error

    const limit = checkRateLimit(auth.token)
    if (!limit.ok) {
      return text(`Rate limit reached. Try again in ${limit.retryAfter}s.`, true)
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return text(
        'Rating is unavailable because the catalog database is not configured on this server.',
        true
      )
    }

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('id, name')
      .eq('id', args.skill_id)
      .single()

    if (skillError || !skill) {
      return text(
        `No skill found with id ${args.skill_id}. Use browse_skills to get a valid skill_id.`,
        true
      )
    }

    // Record the rating on the user's install row (creating it if needed).
    const { error: upsertError } = await supabase.from('user_installs').upsert(
      {
        user_token: auth.token,
        skill_id: skill.id,
        rating,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_token,skill_id' }
    )

    if (upsertError) {
      console.error('rate_skill upsert failed:', upsertError.message)
      return text('Could not save your rating right now. Please try again.', true)
    }

    // Fold the rating into the public average. Best-effort; never block on it.
    const { error: rpcError } = await supabase.rpc('recompute_skill_rating', {
      p_skill_id: skill.id,
    })
    if (rpcError) {
      console.error('recompute_skill_rating failed:', rpcError.message)
    }

    return text(`Thanks — you rated "${skill.name}" ${rating}/5.`)
  },
}
