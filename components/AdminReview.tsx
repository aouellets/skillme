'use client'

import { useState } from 'react'
import type { SkillSubmission } from '@/lib/types'

const VERDICT_STYLE: Record<string, string> = {
  safe: 'text-success border-success/40',
  unsafe: 'text-danger border-danger/40',
  unknown: 'text-shelf-text-tertiary border-shelf-border',
}

export function AdminReview({ initial }: { initial: SkillSubmission[] }) {
  const [items, setItems] = useState<SkillSubmission[]>(initial)

  function removeItem(id: string) {
    setItems((prev) => prev.filter((s) => s.id !== id))
  }

  if (items.length === 0) {
    return (
      <div className="card mt-8 p-10 text-center">
        <p className="text-shelf-text-primary">Queue is clear. No submissions to review.</p>
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
    <div className="card p-6">
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

      <div className="mt-4 space-y-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reviewer note (sent with reject / request changes)"
          className="input w-full text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-shelf-text-secondary">
          <input type="checkbox" checked={feature} onChange={(e) => setFeature(e.target.checked)} />
          Feature this skill on approve
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

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
