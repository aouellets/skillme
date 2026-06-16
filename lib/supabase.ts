import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * True when Supabase credentials are present. When false, the app falls back to
 * the bundled seed catalog so the site is browsable without a database.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

let browserClient: SupabaseClient | null = null
let serviceClient: SupabaseClient | null = null

/** Public, anon-key client. Safe for read-only catalog queries. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null
  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    })
  }
  return browserClient
}

/**
 * Service-role client for privileged writes (installs, counters) from the MCP
 * server. Falls back to the anon client if a service key is not configured.
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (!url) return null
  const key = serviceKey ?? anonKey
  if (!key) return null
  if (!serviceClient) {
    serviceClient = createClient(url, key, {
      auth: { persistSession: false },
    })
  }
  return serviceClient
}
