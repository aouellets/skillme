'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

export function CopyButton({
  value,
  label = 'Copy',
  className = 'btn btn-secondary',
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      track('mcp_url_copied')
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? 'Copied' : label}
    </button>
  )
}
