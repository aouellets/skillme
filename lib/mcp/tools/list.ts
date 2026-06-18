import { getServiceSupabase } from '../../supabase'
import { text, type Tool } from '../types'
import type { Skill } from '../../types'

type InstallRow = {
  installed_at: string
  skills: Pick<Skill, 'name' | 'category'> | null
}

export const listInstalled: Tool = {
  definition: {
    name: 'list_installed',
    annotations: { title: 'List installed skills', readOnlyHint: true },
    description:
      'Show the user what skills they currently have installed, with install date and category.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  async handler(_args, ctx) {
    const supabase = getServiceSupabase()
    if (!supabase) {
      return text(
        'Your library is unavailable because the catalog database is not configured on this server.',
        true
      )
    }

    if (!ctx.userToken) {
      return text(
        'You have no skills installed yet. Say "browse skills" to explore the catalog.'
      )
    }

    const { data, error } = await supabase
      .from('user_installs')
      .select('installed_at, skills(name, category)')
      .eq('user_token', ctx.userToken)
      .eq('active', true)
      .order('installed_at', { ascending: false })

    if (error) {
      console.error('list_installed query failed:', error.message)
      return text(
        'Your library could not be read right now. Say "browse skills" to explore the catalog.',
        true
      )
    }

    const rows = (data ?? []) as unknown as InstallRow[]
    const installed = rows.filter((r) => r.skills)

    if (installed.length === 0) {
      return text(
        'You have no skills installed yet. Say "browse skills" to explore the catalog.'
      )
    }

    const lines = installed.map((r) => {
      const date = new Date(r.installed_at).toISOString().slice(0, 10)
      return `- ${r.skills!.name} (${r.skills!.category}) · installed ${date}`
    })

    return text(`You have ${installed.length} skill(s) installed:\n\n${lines.join('\n')}`)
  },
}
