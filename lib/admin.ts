import 'server-only'
import { createSupabaseServerClient } from './supabase/server'

/** Allowed admin emails, from the ADMIN_EMAILS env (comma-separated). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Returns the signed-in user's email if they are an admin, else null.
 * Admin = authenticated Supabase user whose email is in ADMIN_EMAILS.
 */
export async function getAdminEmail(): Promise<string | null> {
  if (adminEmails().length === 0) return null
  const auth = await createSupabaseServerClient()
  if (!auth) return null
  const {
    data: { user },
  } = await auth.auth.getUser()
  const email = user?.email?.toLowerCase()
  if (!email) return null
  return adminEmails().includes(email) ? email : null
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminEmail()) !== null
}
