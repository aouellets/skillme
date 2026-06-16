'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function StarRating({
  skillId,
  initialAvg,
  initialCount,
}: {
  skillId: string
  initialAvg: number
  initialCount: number
}) {
  const supabase = getSupabaseBrowserClient()
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [myRating, setMyRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [avg, setAvg] = useState(initialAvg)
  const [count, setCount] = useState(initialCount)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    if (!supabase) {
      setSignedIn(false)
      return
    }
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(Boolean(session?.user))
    )
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  async function rate(value: number) {
    setMyRating(value)
    setStatus('saving')
    try {
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: skillId, rating: value }),
      })
      if (!res.ok) throw new Error('rate failed')
      const data = await res.json()
      if (typeof data.rating_avg === 'number') setAvg(data.rating_avg)
      if (typeof data.rating_count === 'number') setCount(data.rating_count)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  const display = hover || myRating

  return (
    <div className="card p-5">
      <h2 className="text-sm font-medium text-shelf-text-primary">Rate this skill</h2>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = display >= n
          const interactive = signedIn === true
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={myRating === n}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
              disabled={!interactive}
              onMouseEnter={() => interactive && setHover(n)}
              onMouseLeave={() => interactive && setHover(0)}
              onClick={() => interactive && rate(n)}
              className={`text-2xl leading-none transition-colors ${
                active ? 'text-accent' : 'text-shelf-muted'
              } ${interactive ? 'cursor-pointer hover:text-accent-hover' : 'cursor-default'}`}
            >
              ★
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-shelf-text-tertiary">
        {count > 0 ? `${avg.toFixed(1)} average · ${count} rating${count === 1 ? '' : 's'}` : 'No ratings yet'}
      </p>

      {signedIn === false && (
        <p className="mt-2 text-xs text-shelf-text-secondary">Sign in to rate this skill.</p>
      )}
      {status === 'saved' && (
        <p className="mt-2 text-xs text-success">Thanks — your rating was saved.</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs text-danger">Could not save your rating. Try again.</p>
      )}
    </div>
  )
}
