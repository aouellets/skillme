import { getServiceSupabase } from '../../supabase'
import { checkRateLimit } from '../rateLimit'
import { text, type Tool } from '../types'

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

    const limit = checkRateLimit(ctx.userToken)
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
      .select('id, name, pack_skills(skill_id, position, skills(id, name, description))')
      .eq('id', args.pack_id)
      .single()

    if (packError || !pack) {
      return text(`No pack found with id ${args.pack_id}. Use browse_packs to find a valid pack_id.`, true)
    }

    const packData = pack as unknown as {
      id: string
      name: string
      pack_skills: Array<{ skill_id: string; skills: { id: string; name: string; description: string } | null }>
    }

    const skillIds = packData.pack_skills
      .map((ps) => ps.skills?.id)
      .filter((id): id is string => Boolean(id))

    if (skillIds.length === 0) {
      return text(`Pack "${packData.name}" has no skills yet.`, true)
    }

    // Upsert all skills as installed
    const installs = skillIds.map((skill_id) => ({
      user_token: ctx.userToken,
      skill_id,
      active: true,
      updated_at: new Date().toISOString(),
    }))

    const { error: upsertError } = await supabase
      .from('user_installs')
      .upsert(installs, { onConflict: 'user_token,skill_id' })

    if (upsertError) {
      return text(`Could not install pack: ${upsertError.message}`, true)
    }

    // Record pack install
    await supabase.from('user_pack_installs').upsert(
      { user_token: ctx.userToken, pack_id: packData.id },
      { onConflict: 'user_token,pack_id' }
    )

    // Increment pack install count
    await supabase.rpc('increment_pack_install_count', { p_pack_id: packData.id })

    // Increment individual skill counts
    for (const skill_id of skillIds) {
      await supabase.rpc('increment_install_count', { p_skill_id: skill_id })
    }

    const skillNames = packData.pack_skills
      .map((ps) => ps.skills?.name)
      .filter(Boolean)
      .map((n, i) => `  ${i + 1}. ${n}`)
      .join('\n')

    return text(
      `Installed "${packData.name}" — ${skillIds.length} skills added to your library:\n\n${skillNames}\n\nAll skills activate automatically in your next session.`
    )
  },
}
