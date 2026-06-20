import 'server-only'
import { getServiceSupabase } from '../supabase'

/**
 * Fold an anonymous connector library (`mcp_<uuid>` subject) into a signed-in
 * account library (`auth:<id>`).
 *
 * WHY: identity is fixed once, at the OAuth authorize step. A user who connects
 * the MCP before signing in to Skill Me is bound to a throwaway anonymous
 * subject, and any skills they install land under it — disjoint from the
 * `auth:<id>` library their website installs use. When that same browser later
 * authorizes while signed in (we recognise it by the `skillme_anon_sub` cookie),
 * this reclaims those stranded installs instead of leaving them orphaned.
 *
 * Best-effort and idempotent. The account row is authoritative: skills already
 * installed under the account are kept as-is (`ignoreDuplicates`), then the
 * anonymous rows are deleted so a repeat authorize can't double-apply. Never
 * throws — a failed merge must not break the sign-in/connect flow.
 *
 * Returns the number of anonymous installs considered for migration (0 when
 * there is nothing to do, the identities are the wrong shape, or anything fails).
 */
export async function mergeAnonLibrary(
  anonSub: string,
  accountToken: string
): Promise<number> {
  // Guard the shapes: only ever move FROM an anonymous subject INTO an account.
  if (!anonSub.startsWith('mcp_') || !accountToken.startsWith('auth:')) return 0

  const supabase = getServiceSupabase()
  if (!supabase) return 0

  try {
    const { data: anonRows, error } = await supabase
      .from('user_installs')
      .select('skill_id, active, rating, installed_at, updated_at')
      .eq('user_token', anonSub)

    if (error || !anonRows || anonRows.length === 0) return 0

    // Insert the anonymous installs under the account, skipping any skill the
    // account already has (its row wins). ignoreDuplicates relies on the
    // unique (user_token, skill_id) constraint.
    const { error: upsertError } = await supabase.from('user_installs').upsert(
      anonRows.map((r) => ({ ...r, user_token: accountToken })),
      { onConflict: 'user_token,skill_id', ignoreDuplicates: true }
    )
    if (upsertError) {
      console.error('mergeAnonLibrary upsert failed:', upsertError.message)
      return 0
    }

    // Drop the migrated anonymous rows so the merge is one-shot.
    await supabase.from('user_installs').delete().eq('user_token', anonSub)

    return anonRows.length
  } catch (err) {
    console.error(
      'mergeAnonLibrary failed:',
      err instanceof Error ? err.message : 'unknown error'
    )
    return 0
  }
}
