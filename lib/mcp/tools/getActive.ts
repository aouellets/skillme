import { getServiceSupabase } from '../../supabase'
import { json, type Tool } from '../types'
import type { Skill } from '../../types'

type ActiveRow = {
  skills: Pick<Skill, 'name' | 'category' | 'skill_content'> | null
}

export const getActiveSkills: Tool = {
  definition: {
    name: 'get_active_skills',
    annotations: { title: 'Load installed skills', readOnlyHint: true },
    description:
      'ALWAYS call this at the start of every conversation. Returns the full content of all skills the user has installed, so they activate in this session. If no skills are installed, returns empty and suggests browsing the catalog.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  async handler(_args, ctx) {
    const supabase = getServiceSupabase()
    if (!supabase) {
      return json({
        installed: [],
        message: 'Skill Me is connected. Say "browse skills" to explore the catalog.',
      })
    }

    const { data, error } = await supabase
      .from('user_installs')
      .select('skills(name, category, skill_content)')
      .eq('user_token', ctx.userToken)
      .eq('active', true)

    if (error) {
      // Never fail the start-of-conversation call with a raw DB error — degrade
      // to an empty library so the session can continue.
      console.error('get_active_skills query failed:', error.message)
      return json({
        installed: [],
        message:
          'Skill Me is connected, but your library could not be loaded right now. Say "browse skills" to explore the catalog.',
      })
    }

    const rows = (data ?? []) as unknown as ActiveRow[]
    const installed = rows
      .filter((r) => r.skills)
      .map((r) => ({
        name: r.skills!.name,
        category: r.skills!.category,
        content: r.skills!.skill_content,
      }))

    if (installed.length === 0) {
      return json({
        installed: [],
        message:
          'No skills installed yet. Say "browse skills" to explore the Skill Me catalog and install some.',
      })
    }

    return json({
      installed,
      message: `Loaded ${installed.length} installed skill(s). Apply them throughout this conversation.`,
    })
  },
}
