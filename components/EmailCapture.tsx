'use client'

import { useState } from 'react'

export function EmailCapture({
  placement = 'inline',
  label = 'Get notified when new skills drop',
}: {
  placement?: 'inline' | 'banner' | 'footer'
  label?: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'You\'re subscribed.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not connect. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-success">
        <span>✓</span>
        <span>{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={placement === 'banner' ? 'flex flex-col gap-2 sm:flex-row' : 'flex flex-col gap-2'}>
      {placement !== 'footer' && (
        <p className="text-sm text-shelf-text-secondary">{label}</p>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address"
          className="input flex-1"
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn btn-primary flex-shrink-0" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining…' : 'Join newsletter'}
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" className="text-xs text-danger">
          {message}
        </p>
      )}
    </form>
  )
}
