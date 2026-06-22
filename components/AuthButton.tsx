'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function AuthButton() {
  const supabase = getSupabaseBrowserClient()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Collapse the menu after navigating (e.g. tapping "Your library").
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Auth not configured — hide the control entirely.
  if (!supabase || !ready) return null

  async function signOut() {
    if (!supabase) return
    setOpen(false)
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

  const name =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    'Account'
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined)
  const initial = (name.trim()[0] ?? 'A').toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full border border-shelf-border py-1 pr-1 pl-1 transition-colors hover:border-shelf-border-strong hover:bg-shelf-surface sm:pl-3"
      >
        <span className="hidden max-w-[140px] truncate text-sm text-shelf-text-secondary sm:inline">
          {name}
        </span>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shelf-elevated text-xs font-semibold text-shelf-text-primary">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-shelf-border bg-shelf-surface shadow-xl"
        >
          <div className="border-b border-shelf-border px-3 py-2.5">
            <p className="truncate text-sm font-medium text-shelf-text-primary">{name}</p>
            {user.email && name !== user.email && (
              <p className="truncate text-xs text-shelf-text-tertiary">{user.email}</p>
            )}
          </div>
          <div className="py-1">
            <Link
              href="/library"
              role="menuitem"
              className="block px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:bg-shelf-elevated hover:text-shelf-text-primary"
            >
              Your library
            </Link>
            <button
              type="button"
              onClick={signOut}
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-shelf-text-secondary transition-colors hover:bg-shelf-elevated hover:text-shelf-text-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
