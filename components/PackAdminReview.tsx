'use client'

import { useMemo, useState } from 'react'
import type { PackSubmission } from '@/lib/types'

const STATUS_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_review', label: 'In review' },
  { key: 'needs_changes', label: 'Needs changes' },
]

export function PackAdminReview({ initial }: { initial: PackSubmission[] }) {
  const [items, setItems] = useState<PackSubmission[]>(initial)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  function removeItem(id: string) {
    setItems((prev) => prev.filter((s) => s.id !== id))
  }

  const visible = useMemo(() => {
    let out = items
    if (status !== 'all') out = out.filter((s) => s.status === status)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      out = out.filter((s) =>
        [s.name, s.tagline, s.description, s.category, s.author, s.submitter_email]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }
    return [...out].sort((a, b) => {
      const cmp = a.created_at.localeCompare(b.created_at)
      return sort === 'oldest' ? cmp : -cmp
    })
  }, [items, query, status, sort])

  if (items.length === 0) {
    return (
      <div className="card mt-8 p-10 text-center">
        <p className="text-shelf-text-primary">No pack submissions to review.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Sticky toolbar: filters stay reachable while scrolling a long queue.
          top-16 clears the global header; the bleed margins span the page gutter. */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-shelf-border bg-shelf-void/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, author, email…"
            className="input w-full max-w-xs text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input py-1.5 text-sm"
            aria-label="Status"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
            className="input py-1.5 text-sm"
            aria-label="Sort"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <span className="ml-auto font-mono text-xs text-shelf-text-tertiary">
            {visible.length} of {items.length}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card mt-5 p-10 text-center">
          <p className="text-shelf-text-secondary">No pack submissions match these filters.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {visible.map((sub) => (
            <ReviewCard key={sub.id} sub={sub} onDone={() => removeItem(sub.id)} />
          ))}
        </div>
      )}
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
    <div className="card p-5">
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

      <div className="mt-4 space-y-3 border-t border-shelf-border/60 pt-4">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reviewer note (sent with reject / request changes)"
          className="input w-full text-sm"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-shelf-text-secondary">
            <input type="checkbox" checked={feature} onChange={(e) => setFeature(e.target.checked)} />
            Feature this pack on approve
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => act('reject')} disabled={busy} className="btn btn-ghost">
              Reject
            </button>
            <button onClick={() => act('needs_changes')} disabled={busy} className="btn btn-secondary">
              Request changes
            </button>
            <button onClick={() => act('approve')} disabled={busy} className="btn btn-primary">
              {busy ? 'Working…' : feature ? 'Approve + feature' : 'Approve & publish'}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
