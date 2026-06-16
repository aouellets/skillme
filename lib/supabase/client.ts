'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null | undefined

/**
 * Browser Supabase client (singleton) for auth on the client. Returns null when
 * auth env isn't configured so callers can degrade gracefully.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (cached !== undefined) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  cached = url && key ? createBrowserClient(url, key) : null
  return cached
}
