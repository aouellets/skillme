import 'server-only'
import { createSupabaseServerClient } from './supabase/server'

/**
 * The signed-in user's stable token (`auth:<id>`), used to scope all
 * user-owned rows, or null if auth isn't configured / the user isn't signed in.
 */
export async function getUserToken(): Promise<string | null> {
  const auth = await createSupabaseServerClient()
  if (!auth) return null
  const {
    data: { user },
  } = await auth.auth.getUser()
  return user ? `auth:${user.id}` : null
}
