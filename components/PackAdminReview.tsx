'use client'

import { useState } from 'react'
import type { PackSubmission } from '@/lib/types'

export function PackAdminReview({ initial }: { initial: PackSubmission[] }) {
  const [items, setItems] = useState<PackSubmission[]>(initial)

  function removeItem(id: string) {
    setItems((prev) => prev.filter((s) => s.id !== id))
  }

  if (items.length === 0) {
    return (
      <div className="card mt-8 p-10 text-center">
        <p className="text-shelf-text-primary">No pack submissions to review.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-5">
      {items.map((sub) => (
        <ReviewCard key={sub.id} sub={sub} onDone={() => removeItem(sub.id)} />
      ))}
    </div>
  )
}

function ReviewCard({ sub, onDone }: { sub: PackSubmission; onDone: () => void }) {
  const [note, setNote] = useState('')
  const [feature, setFeature] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function act(action: 'approve' | 'reject' | 'needs_changes') {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/pack-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, action, note: note || undefined, featured: feature }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Action failed')
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
      setBusy(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-shelf-text-primary">{sub.name}</h3>
          <p className="mt-0.5 text-sm text-shelf-text-secondary">{sub.tagline}</p>
          <p className="mt-2 text-sm text-shelf-text-secondary">{sub.description}</p>
          <p className="mt-2 font-mono text-xs text-shelf-text-tertiary">
            {sub.category}
            {sub.author ? ` · ${sub.author}` : ''}
            {sub.submitter_email ? ` · ${sub.submitter_email}` : ''}
          </p>
          {sub.repo_url && (
            <a
              href={sub.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all font-mono text-xs text-accent hover:text-accent-hover"
            >
              {sub.repo_url}
            </a>
          )}
        </div>
        <span className="shrink-0 rounded-full border border-shelf-border px-2.5 py-1 font-mono text-xs text-shelf-text-tertiary">
          {sub.skill_slugs.length} skills
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {sub.skill_slugs.map((slug) => (
          <a
            key={slug}
            href={`/skill/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-btn border border-shelf-border bg-shelf-elevated px-2 py-0.5 font-mono text-xs text-shelf-text-secondary hover:text-accent"
          >
            {slug}
          </a>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reviewer note (sent with reject / request changes)"
          className="input w-full text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-shelf-text-secondary">
          <input type="checkbox" checked={feature} onChange={(e) => setFeature(e.target.checked)} />
          Feature this pack on approve
        </label>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button onClick={() => act('approve')} disabled={busy} className="btn btn-primary">
            {busy ? 'Working…' : feature ? 'Approve + feature' : 'Approve & publish'}
          </button>
          <button onClick={() => act('needs_changes')} disabled={busy} className="btn btn-secondary">
            Request changes
          </button>
          <button onClick={() => act('reject')} disabled={busy} className="btn btn-secondary">
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
