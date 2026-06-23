import { getServiceSupabase } from '../../supabase'
import { checkRateLimit } from '../rateLimit'
import { text, requireToken, type Tool } from '../types'
import { track } from '../../telemetry/track'
import { inlineSkills } from '../inlineContent'

interface InstallArgs {
  skill_id?: string
}

export const installSkill: Tool<InstallArgs> = {
  definition: {
    name: 'install_skill',
    annotations: { title: 'Install skill', readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    description:
      'Install a skill from Skill Me. Saves it to the library for future sessions AND returns its content so it applies immediately — read and follow that content for the rest of this conversation.',
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

    const auth = requireToken(ctx)
    if ('error' in auth) return auth.error

    const limit = checkRateLimit(auth.token)
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
      .select('id, name, description, skill_content')
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
        user_token: auth.token,
        skill_id: skill.id,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_token,skill_id' }
    )

    if (upsertError) {
      console.error('install_skill upsert failed:', upsertError.message)
      return text('Could not install the skill right now. Please try again.', true)
    }

    // Best-effort install counter; never block the install on it.
    await supabase.rpc('increment_install_count', { p_skill_id: skill.id })

    void track(
      { name: 'skill_installed', properties: { skill_id: skill.id, via: 'single' } },
      { source: 'mcp', userToken: auth.token, sessionId: auth.token, context: ctx.context }
    )

    // Return the content so the skill applies immediately — installs are saved
    // for future sessions too, but get_active_skills only reloads at session
    // start, so without this the skill would stay dark for the rest of this one.
    // Bounded so a single oversized skill can't produce a tool result the
    // connector rejects (see inlineContent).
    const { body } = inlineSkills([
      { id: skill.id, name: skill.name, skill_content: skill.skill_content },
    ])
    const tail = body
      ? `\n\nIt's active now — apply it for the rest of this conversation:\n\n${body}`
      : '\n\nIt will activate automatically in your next session.'
    return text(`Installed "${skill.name}". ${skill.description}${tail}`)
  },
}
