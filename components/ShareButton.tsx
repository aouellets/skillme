'use client'

import { useState } from 'react'

export function ShareButton({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    // Prefer the native share sheet on mobile.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: text, url })
        return
      } catch {
        // user cancelled or unsupported — fall back to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`

  return (
    <div className="flex gap-2">
      <button type="button" onClick={share} className="btn btn-secondary flex-1">
        {copied ? 'Link copied' : 'Share'}
      </button>
      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost"
        aria-label="Share on X"
      >
        Post on X
      </a>
    </div>
  )
}
