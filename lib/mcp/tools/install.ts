import { getServiceSupabase } from '../../supabase'
import { checkRateLimit } from '../rateLimit'
import { text, type Tool } from '../types'

interface InstallArgs {
  skill_id?: string
}

export const installSkill: Tool<InstallArgs> = {
  definition: {
    name: 'install_skill',
    description:
      'Install a skill from Skill Me so it activates in future Claude sessions. Returns confirmation and the skill content that will be loaded automatically going forward.',
    inputSchema: {
      type: 'object',
      required: ['skill_id'],
      properties: {
        skill_id: {
          type: 'string',
          description: 'The skill UUID from browse_skills results',
        },
      },
    },
  },
  async handler(args, ctx) {
    if (!args.skill_id) {
      return text('A skill_id is required. Call browse_skills first to find one.', true)
    }

    const limit = checkRateLimit(ctx.userToken)
    if (!limit.ok) {
      return text(
        `Rate limit reached (10 installs per minute). Try again in ${limit.retryAfter}s.`,
        true
      )
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return text(
        'Install is unavailable because the catalog database is not configured on this server.',
        true
      )
    }

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('id, name, description')
      .eq('id', args.skill_id)
      .single()

    if (skillError || !skill) {
      return text(
        `No skill found with id ${args.skill_id}. Use browse_skills to get a valid skill_id.`,
        true
      )
    }

    const { error: upsertError } = await supabase.from('user_installs').upsert(
      {
        user_token: ctx.userToken,
        skill_id: skill.id,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_token,skill_id' }
    )

    if (upsertError) {
      return text(`Could not install the skill: ${upsertError.message}`, true)
    }

    // Best-effort install counter; never block the install on it.
    await supabase.rpc('increment_install_count', { p_skill_id: skill.id })

    return text(
      `Installed "${skill.name}". ${skill.description}\n\nThis skill will activate automatically in your next session.`
    )
  },
}
