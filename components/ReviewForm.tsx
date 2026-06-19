'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

/**
 * Write or edit your review for a skill (stars + text). Shown only to signed-in
 * users; the server component decides via `signedIn`. Submits to /api/reviews,
 * which also keeps the numeric rating in sync with the catalog average.
 */
export function ReviewForm({
  skillId,
  signedIn,
  initialRating = 0,
  initialBody = '',
  loginHref,
}: {
  skillId: string
  signedIn: boolean
  initialRating?: number
  initialBody?: string
  loginHref: string
}) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [body, setBody] = useState(initialBody)
  const firstStarRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const editing = initialBody.length > 0

  if (!signedIn) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-medium text-shelf-text-primary">Write a review</h3>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          <Link href={loginHref} className="text-accent hover:text-accent-hover">
            Sign in
          </Link>{' '}
          to rate and review this skill.
        </p>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (rating < 1) {
      setStatus('error')
      setMessage('Pick a star rating first.')
      firstStarRef.current?.focus()
      return
    }
    if (body.trim().length < 4) {
      setStatus('error')
      setMessage('Write a few words for your review.')
      bodyRef.current?.focus()
      return
    }
    setStatus('saving')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: skillId, rating, body: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not save review.')
      setStatus('saved')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Could not save review.')
    }
  }

  const display = hover || rating

  return (
    <form onSubmit={submit} className="card p-5">
      <h3 className="text-sm font-medium text-shelf-text-primary">
        {editing ? 'Edit your review' : 'Write a review'}
      </h3>

      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            ref={n === 1 ? firstStarRef : undefined}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className={`flex h-11 w-11 cursor-pointer items-center justify-center text-2xl leading-none transition-colors hover:text-accent-hover ${
              display >= n ? 'text-accent' : 'text-shelf-muted'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        ref={bodyRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What did this skill do well? Where did it fall short?"
        rows={4}
        maxLength={2000}
        className="input mt-3 w-full resize-y"
      />

      <div className="mt-3 flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : editing ? 'Update review' : 'Post review'}
        </button>
        {status === 'saved' && (
          <span role="status" className="text-xs text-success">
            Your review was saved.
          </span>
        )}
        {status === 'error' && (
          <span role="alert" className="text-xs text-danger">
            {message}
          </span>
        )}
      </div>
    </form>
  )
}
