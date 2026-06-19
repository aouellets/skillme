'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const ERROR_MESSAGES: Record<string, string> = {
  callback: 'We couldn’t complete sign-in. The link may have expired — please try again.',
  exchange: 'That sign-in link is invalid or has already been used. Request a new one.',
}

/** Sanitize the post-login redirect to an in-app path only (no open redirects). */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/'
  return next
}

export function LoginForm() {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get('next'))

  const [email, setEmail] = useState('')
  const emailRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'oauth'>('idle')
  const [error, setError] = useState<string | null>(
    params.get('error') ? ERROR_MESSAGES[params.get('error') as string] ?? 'Sign-in failed. Please try again.' : null
  )

  // Already signed in? Send them on their way.
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(next)
    })
  }, [supabase, router, next])

  if (!supabase) {
    return (
      <p className="text-center text-sm text-shelf-text-secondary">
        Sign-in isn’t configured on this deployment yet. Your installed skills still load
        automatically inside Claude.
      </p>
    )
  }

  const redirectTo = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email address.')
      emailRef.current?.focus()
      return
    }
    setError(null)
    setStatus('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirectTo() },
    })
    if (error) {
      setStatus('idle')
      setError(error.message || 'Couldn’t send the link. Try again in a moment.')
      return
    }
    setStatus('sent')
  }

  async function signInWithGitHub() {
    if (!supabase) return
    setError(null)
    setStatus('oauth')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: redirectTo() },
    })
    if (error) {
      setStatus('idle')
      setError(error.message || 'Couldn’t start GitHub sign-in.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center">
        <p className="text-sm text-shelf-text-primary">Check your email</p>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          We sent a secure sign-in link to <span className="text-shelf-text-primary">{email}</span>.
          Open it on this device to finish signing in.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setEmail('')
          }}
          className="btn btn-ghost mt-5 w-full"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'sending'}
          className="input"
          required
        />
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full">
          {status === 'sending' ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-shelf-border" />
        <span className="text-xs uppercase tracking-wide text-shelf-text-tertiary">or</span>
        <span className="h-px flex-1 bg-shelf-border" />
      </div>

      <button
        type="button"
        onClick={signInWithGitHub}
        disabled={status === 'oauth'}
        className="btn btn-secondary w-full"
      >
        <GitHubMark />
        {status === 'oauth' ? 'Redirecting…' : 'Continue with GitHub'}
      </button>

      {error && (
        <p role="alert" className="text-center text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function GitHubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}
