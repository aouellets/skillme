'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function AuthButton() {
  const supabase = getSupabaseBrowserClient()
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  // Auth not configured — hide the control entirely.
  if (!supabase || !ready) return null

  async function signIn() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return (
      <button onClick={signIn} className="btn btn-ghost" aria-label="Sign in with GitHub">
        Sign in
      </button>
    )
  }

  const label =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    'Account'

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[140px] truncate text-sm text-shelf-text-secondary sm:inline">
        {label}
      </span>
      <button onClick={signOut} className="btn btn-ghost">
        Sign out
      </button>
    </div>
  )
}
