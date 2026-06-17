'use client'

import { useState } from 'react'
import { CATEGORIES } from '@/lib/categories'

const PLACEHOLDER = `---
name: Your Skill Name
description: One sentence, plain English, no buzzwords.
license: MIT
---

# Your Skill Name

[Instructions: what Claude should do when this skill is active]`

export function SubmitForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          description: fd.get('description'),
          category: fd.get('category'),
          author: fd.get('author'),
          source_url: fd.get('source_url'),
          tags: fd.get('tags'),
          skill_content: fd.get('skill_content'),
          submitter_email: fd.get('submitter_email'),
          website: fd.get('website'), // honeypot
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'Submitted! Your skill is in the review queue.')
        form.reset()
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
        <Field label="Skill name" hint="Short, max ~5 words">
          <input name="name" required maxLength={80} className="input w-full" placeholder="SQL Debugger" />
        </Field>
        <Field label="Category">
          <select name="category" required defaultValue="" className="input w-full">
            <option value="" disabled>
              Choose a category…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" hint="One sentence, plain English, max 25 words">
        <input
          name="description"
          required
          maxLength={200}
          className="input w-full"
          placeholder="Finds and explains the root cause of a failing SQL query."
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Author" hint="Your name or GitHub handle (optional)">
          <input name="author" maxLength={80} className="input w-full" placeholder="your-handle" />
        </Field>
        <Field label="Source URL" hint="Link to the repo (optional)">
          <input name="source_url" type="url" className="input w-full" placeholder="https://github.com/you/skill" />
        </Field>
      </div>

      <Field label="Tags" hint="Comma-separated, e.g. sql, debugging, data">
        <input name="tags" className="input w-full" placeholder="sql, debugging, data" />
      </Field>

      <Field label="SKILL.md content" hint="Paste your full SKILL.md. Stubs are rejected.">
        <textarea
          name="skill_content"
          required
          rows={12}
          className="input w-full resize-y font-mono text-sm"
          placeholder={PLACEHOLDER}
        />
      </Field>

      <Field label="Your email" hint="So we can reach you about the review (optional)">
        <input name="submitter_email" type="email" className="input w-full" placeholder="your@email.com" />
      </Field>

      {status === 'error' && <p className="text-sm text-danger">{message}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Submit for review'}
        </button>
        <span className="text-xs text-shelf-text-tertiary">
          Auto-checked for safety, then human-reviewed before going live.
        </span>
      </div>
    </form>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-shelf-text-primary">{label}</span>
      {hint && <span className="ml-2 text-xs text-shelf-text-tertiary">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
