'use client'

import { useMemo, useState } from 'react'
import type { SkillSubmission } from '@/lib/types'

const VERDICT_STYLE: Record<string, string> = {
  safe: 'text-success border-success/40',
  unsafe: 'text-danger border-danger/40',
  unknown: 'text-shelf-text-tertiary border-shelf-border',
}

const STATUS_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_review', label: 'In review' },
  { key: 'needs_changes', label: 'Needs changes' },
]

const SAFETY_RANK: Record<string, number> = { unsafe: 0, unknown: 1, safe: 2 }

export function AdminReview({ initial }: { initial: SkillSubmission[] }) {
  const [items, setItems] = useState<SkillSubmission[]>(initial)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'risk'>('newest')

  function removeItem(id: string) {
    setItems((prev) => prev.filter((s) => s.id !== id))
  }

  const visible = useMemo(() => {
    let out = items
    if (status !== 'all') out = out.filter((s) => s.status === status)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      out = out.filter((s) =>
        [s.name, s.description, s.category, s.author, s.submitter_email]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }
    return [...out].sort((a, b) => {
      if (sort === 'risk') {
        const ra = SAFETY_RANK[a.safety_verdict] ?? 1
        const rb = SAFETY_RANK[b.safety_verdict] ?? 1
        if (ra !== rb) return ra - rb
      }
      const cmp = a.created_at.localeCompare(b.created_at)
      return sort === 'oldest' ? cmp : -cmp
    })
  }, [items, query, status, sort])

  if (items.length === 0) {
    return (
      <div className="card mt-8 p-10 text-center">
        <p className="text-shelf-text-primary">Queue is clear. No submissions to review.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Sticky toolbar: the filters stay reachable while scrolling a long queue.
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
            onChange={(e) => setSort(e.target.value as 'newest' | 'oldest' | 'risk')}
            className="input py-1.5 text-sm"
            aria-label="Sort"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="risk">Safety risk first</option>
          </select>
          <span className="ml-auto font-mono text-xs text-shelf-text-tertiary">
            {visible.length} of {items.length}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card mt-5 p-10 text-center">
          <p className="text-shelf-text-secondary">No submissions match these filters.</p>
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

function ReviewCard({ sub, onDone }: { sub: SkillSubmission; onDone: () => void }) {
  const [note, setNote] = useState('')
  const [feature, setFeature] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  async function act(action: 'approve' | 'reject' | 'needs_changes') {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/submissions', {
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

  const verdictClass = VERDICT_STYLE[sub.safety_verdict] ?? VERDICT_STYLE.unknown

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-shelf-text-primary">{sub.name}</h3>
          <p className="mt-1 text-sm text-shelf-text-secondary">{sub.description}</p>
          <p className="mt-2 font-mono text-xs text-shelf-text-tertiary">
            {sub.category}
            {sub.author ? ` · @${sub.author}` : ''}
            {sub.submitter_email ? ` · ${sub.submitter_email}` : ''}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-xs ${verdictClass}`}>
          safety: {sub.safety_verdict}
        </span>
      </div>

      {sub.safety_reason && (
        <p className="mt-3 rounded-md border border-shelf-border bg-shelf-void p-3 text-xs text-shelf-text-secondary">
          {sub.safety_reason}
        </p>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-xs text-accent hover:text-accent-hover"
      >
        {open ? 'Hide' : 'View'} SKILL.md ({sub.skill_content.length} chars)
      </button>
      {open && (
        <pre className="mt-2 max-h-80 overflow-auto rounded-md border border-shelf-border bg-shelf-void p-4 font-mono text-xs text-shelf-text-secondary">
          {sub.skill_content}
        </pre>
      )}

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
            Feature this skill on approve
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
