import { getServiceSupabase } from '../../supabase'
import { checkRateLimit } from '../rateLimit'
import { text, requireToken, type Tool } from '../types'
import { buildRow, insertEvents } from '../../telemetry/track'
import { inlineSkills } from '../inlineContent'

interface InstallPackArgs {
  pack_id?: string
}

export const installPack: Tool<InstallPackArgs> = {
  definition: {
    name: 'install_pack',
    annotations: { title: 'Install pack', readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    description:
      'Install a skill pack — installs all skills in the pack at once. Returns the list of installed skills. Use after browse_packs to install a pack by its pack_id.',
    inputSchema: {
      type: 'object',
      required: ['pack_id'],
      properties: {
        pack_id: { type: 'string', description: 'The pack UUID from browse_packs results' },
      },
    },
  },
  async handler(args, ctx) {
    if (!args.pack_id) {
      return text('A pack_id is required. Call browse_packs first to find one.', true)
    }

    const auth = requireToken(ctx)
    if ('error' in auth) return auth.error

    const limit = checkRateLimit(auth.token)
    if (!limit.ok) {
      return text(`Rate limit reached. Try again in ${limit.retryAfter}s.`, true)
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return text('Install is unavailable — database is not configured.', true)
    }

    // Fetch pack with its skills
    const { data: pack, error: packError } = await supabase
      .from('packs')
      .select('id, name, pack_skills(skill_id, position, skills(id, name, description, skill_content))')
      .eq('id', args.pack_id)
      .single()

    if (packError || !pack) {
      return text(`No pack found with id ${args.pack_id}. Use browse_packs to find a valid pack_id.`, true)
    }

    const packData = pack as unknown as {
      id: string
      name: string
      pack_skills: Array<{
        skill_id: string
        skills: { id: string; name: string; description: string; skill_content: string | null } | null
      }>
    }

    const skillIds = packData.pack_skills
      .map((ps) => ps.skills?.id)
      .filter((id): id is string => Boolean(id))

    if (skillIds.length === 0) {
      return text(`Pack "${packData.name}" has no skills yet.`, true)
    }

    // Upsert all skills as installed
    const installs = skillIds.map((skill_id) => ({
      user_token: auth.token,
      skill_id,
      active: true,
      updated_at: new Date().toISOString(),
    }))

    const { error: upsertError } = await supabase
      .from('user_installs')
      .upsert(installs, { onConflict: 'user_token,skill_id' })

    if (upsertError) {
      console.error('install_pack upsert failed:', upsertError.message)
      return text('Could not install the pack right now. Please try again.', true)
    }

    // Record pack install
    await supabase.from('user_pack_installs').upsert(
      { user_token: auth.token, pack_id: packData.id },
      { onConflict: 'user_token,pack_id' }
    )

    // Increment pack install count
    await supabase.rpc('increment_pack_install_count', { p_pack_id: packData.id })

    // Increment individual skill counts
    for (const skill_id of skillIds) {
      await supabase.rpc('increment_install_count', { p_skill_id: skill_id })
    }

    // Telemetry: one pack_installed plus a skill_installed (via pack) per skill,
    // batched into a single fire-and-forget insert. Never blocks the response.
    const opts = { source: 'mcp' as const, userToken: auth.token, sessionId: auth.token, context: ctx.context }
    void insertEvents([
      buildRow(
        { name: 'pack_installed', properties: { pack_id: packData.id, skill_count: skillIds.length } },
        opts
      ),
      ...skillIds.map((skill_id) =>
        buildRow(
          { name: 'skill_installed', properties: { skill_id, via: 'pack', pack_id: packData.id } },
          opts
        )
      ),
    ])

    const installed = packData.pack_skills
      .map((ps) => ps.skills)
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
    const skillNames = installed.map((s, i) => `  ${i + 1}. ${s.name}`).join('\n')

    // Inline skill content so the pack applies immediately — but bounded by a
    // byte budget, because inlining every skill in a large pack produced tool
    // results the connector rejected as a failed install (see inlineContent).
    // Skills past the budget are still installed; we name them so the model can
    // load any now with install_skill, and they activate next session anyway.
    const { body, overflow } = inlineSkills(installed)
    let tail: string
    if (body) {
      tail = `\n\nThey're active now — apply them for the rest of this conversation:\n\n${body}`
      if (overflow.length > 0) {
        const names = overflow.map((s) => `  • ${s.name} (skill_id: ${s.id})`).join('\n')
        tail +=
          `\n\n---\n\nThe other ${overflow.length} skill${overflow.length === 1 ? ' is' : 's are'} ` +
          `saved to your library and will activate next session. To load one now, call ` +
          `install_skill with its id:\n${names}`
      }
    } else {
      tail = '\n\nThey will activate automatically in your next session.'
    }

    return text(
      `Installed "${packData.name}" — ${skillIds.length} skills added to your library:\n\n${skillNames}${tail}`
    )
  },
}
