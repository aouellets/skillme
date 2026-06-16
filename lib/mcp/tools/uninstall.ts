import { getServiceSupabase } from '../../supabase'
import { text, type Tool } from '../types'

interface UninstallArgs {
  skill_id?: string
}

export const uninstallSkill: Tool<UninstallArgs> = {
  definition: {
    name: 'uninstall_skill',
    description:
      'Remove an installed skill so it no longer activates in Claude sessions.',
    inputSchema: {
      type: 'object',
      required: ['skill_id'],
      properties: {
        skill_id: {
          type: 'string',
          description: 'The skill UUID to remove',
        },
      },
    },
  },
  async handler(args, ctx) {
    if (!args.skill_id) {
      return text('A skill_id is required.', true)
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return text(
        'Uninstall is unavailable because the catalog database is not configured on this server.',
        true
      )
    }

    const { data, error } = await supabase
      .from('user_installs')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('user_token', ctx.userToken)
      .eq('skill_id', args.skill_id)
      .select('id')

    if (error) {
      return text(`Could not remove the skill: ${error.message}`, true)
    }

    if (!data || data.length === 0) {
      return text('That skill was not in your library, so nothing changed.')
    }

    return text('Removed from your library. It will no longer activate in new sessions.')
  },
}
