'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function AuthButton() {
  const supabase = getSupabaseBrowserClient()
  const pathname = usePathname()
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

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    const next = pathname && pathname !== '/login' ? `?next=${encodeURIComponent(pathname)}` : ''
    return (
      <Link href={`/login${next}`} className="btn btn-ghost" aria-label="Sign in">
        Sign in
      </Link>
    )
  }

  const label =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    'Account'

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        href="/library"
        className="hidden max-w-[140px] truncate rounded-sm px-2.5 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary sm:inline"
        title="Your library"
      >
        {label}
      </Link>
      <Link
        href="/library"
        className="rounded-sm px-2.5 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary sm:hidden"
      >
        Library
      </Link>
      <button onClick={signOut} className="btn btn-ghost">
        Sign out
      </button>
    </div>
  )
}
