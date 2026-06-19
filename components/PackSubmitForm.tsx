'use client'

import { useEffect, useRef, useState } from 'react'
import { PACK_CATEGORIES } from '@/lib/categories'

type SkillHit = { id: string; slug: string; name: string; category: string }

export function PackSubmitForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<SkillHit[]>([])
  const errorRef = useRef<HTMLParagraphElement>(null)

  // Move focus to the error when a submit fails (e.g. fewer than 2 skills, or a
  // server error) — the banner sits below a long form.
  useEffect(() => {
    if (status === 'error') errorRef.current?.focus()
  }, [status, message])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    if (selected.length < 2) {
      setStatus('error')
      setMessage('Add at least 2 skills to the pack.')
      return
    }

    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/submit/pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          tagline: fd.get('tagline'),
          description: fd.get('description'),
          author: fd.get('author'),
          author_url: fd.get('author_url'),
          category: fd.get('category'),
          tags: fd.get('tags'),
          skill_slugs: selected.map((s) => s.slug),
          submitter_email: fd.get('submitter_email'),
          website: fd.get('website'), // honeypot
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'Submitted! Your pack is in the review queue.')
        form.reset()
        setSelected([])
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not connect. Try again, or use the GitHub option.')
    }
  }

  if (status === 'success') {
    return (
      <div className="card border-success/40 p-6">
        <div className="flex items-center gap-2 text-success">
          <span aria-hidden>✓</span>
          <h3 className="text-base font-medium">Submission received</h3>
        </div>
        <p className="mt-2 text-sm text-shelf-text-secondary">{message}</p>
        <button onClick={() => setStatus('idle')} className="btn btn-secondary mt-4">
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      {/* Honeypot — hidden from humans, catches bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Pack name" hint="Short, max ~5 words" required>
          <input name="name" required maxLength={80} className="input w-full" placeholder="Frontend Power Pack" />
        </Field>
        <Field label="Category" required>
          <select name="category" required defaultValue="" className="input w-full">
            <option value="" disabled>
              Choose a category…
            </option>
            {PACK_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tagline" hint="One line shown on the pack card" required>
        <input
          name="tagline"
          required
          maxLength={120}
          className="input w-full"
          placeholder="Everything you need to ship a React feature."
        />
      </Field>

      <Field label="Description" hint="A short paragraph for the pack page" required>
        <textarea
          name="description"
          required
          rows={3}
          maxLength={600}
          className="input w-full resize-y"
          placeholder="What this pack is for and who it's for."
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Author" hint="Your name or handle (optional)">
          <input name="author" maxLength={80} className="input w-full" placeholder="your-handle" />
        </Field>
        <Field label="Author URL" hint="Link to your site/profile (optional)">
          <input name="author_url" type="url" className="input w-full" placeholder="https://yoursite.com" />
        </Field>
      </div>

      <Field label="Tags" hint="Comma-separated, e.g. react, frontend, ui">
        <input name="tags" className="input w-full" placeholder="react, frontend, ui" />
      </Field>

      <div>
        <span className="text-sm font-medium text-shelf-text-primary">
          Skills in this pack
          <span className="ml-0.5 text-accent" aria-label="required">
            *
          </span>
        </span>
        <span className="ml-2 text-xs text-shelf-text-tertiary">
          Search the catalog and add at least 2 existing skills
        </span>
        <div className="mt-1.5">
          <SkillPicker selected={selected} onChange={setSelected} />
        </div>
      </div>

      <Field label="Your email" hint="So we can reach you about the review (optional)">
        <input name="submitter_email" type="email" className="input w-full" placeholder="your@email.com" />
      </Field>

      {status === 'error' && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="text-sm text-danger outline-none">
          {message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Submit for review'}
        </button>
        <span className="text-xs text-shelf-text-tertiary">
          Human-reviewed before going live.
        </span>
      </div>
    </form>
  )
}

function SkillPicker({
  selected,
  onChange,
}: {
  selected: SkillHit[]
  onChange: (next: SkillHit[]) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SkillHit[]>([])
  const [loading, setLoading] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current)
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    debounce.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/skills?q=${encodeURIComponent(query.trim())}&limit=8`)
        const data = await res.json()
        setResults((data.skills ?? []) as SkillHit[])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => {
      if (debounce.current) clearTimeout(debounce.current)
    }
  }, [query])

  const selectedIds = new Set(selected.map((s) => s.id))

  function add(hit: SkillHit) {
    if (selectedIds.has(hit.id)) return
    onChange([...selected, hit])
    setQuery('')
    setResults([])
  }

  function remove(id: string) {
    onChange(selected.filter((s) => s.id !== id))
  }

  return (
    <div>
      {selected.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {selected.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-1.5 rounded-btn border border-shelf-border bg-shelf-elevated px-2 py-1 text-sm text-shelf-text-secondary"
            >
              <span>{s.name}</span>
              <button
                type="button"
                onClick={() => remove(s.id)}
                aria-label={`Remove ${s.name}`}
                className="-mr-1 flex h-6 w-6 flex-none items-center justify-center rounded-full text-base leading-none text-shelf-text-tertiary transition-colors hover:text-danger"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search skills to add…"
        className="input w-full"
      />

      {(results.length > 0 || loading) && (
        <ul className="mt-1.5 max-h-56 overflow-auto rounded-lg border border-shelf-border bg-shelf-void">
          {loading && results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-shelf-text-tertiary">Searching…</li>
          ) : (
            results.map((hit) => {
              const already = selectedIds.has(hit.id)
              return (
                <li key={hit.id}>
                  <button
                    type="button"
                    onClick={() => add(hit)}
                    disabled={already}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-shelf-text-secondary transition-colors hover:bg-shelf-elevated disabled:opacity-50"
                  >
                    <span className="truncate">{hit.name}</span>
                    <span className="font-mono text-xs text-shelf-text-tertiary">
                      {already ? 'added' : hit.category}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-shelf-text-primary">
        {label}
        {required && (
          <span className="ml-0.5 text-accent" aria-label="required">
            *
          </span>
        )}
      </span>
      {hint && <span className="ml-2 text-xs text-shelf-text-tertiary">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
