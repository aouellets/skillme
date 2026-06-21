'use client'

import { useEffect, useState } from 'react'

/**
 * A vertical "slot machine" word that cycles through roles inside a headline
 * ("become a founder / a data scientist / ..."). Motivated motion (storytelling):
 * the rotation IS the message that one connection becomes many jobs. The index
 * is discrete and low-frequency, so component state is appropriate here (the
 * "no state for continuous values" rule targets per-frame pointer/scroll, not a
 * 2s interval). Reduced motion holds the first word and never starts the timer.
 */
export function WordRotator({
  words,
  intervalMs = 2200,
  className = '',
}: {
  words: string[]
  intervalMs?: number
  className?: string
}) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((p) => (p + 1) % words.length), intervalMs)
    return () => clearInterval(id)
  }, [words.length, intervalMs])

  return (
    <span className={`word-rotator ${className}`}>
      {/* Sizer: reserves the width of the widest word so the headline never
          reflows as words change. Invisible, out of the a11y tree. */}
      <span className="word-rotator-sizer" aria-hidden>
        {words.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
      <span
        className="word-rotator-track"
        style={{ transform: `translateY(${-i * 100}%)` }}
        aria-live="polite"
      >
        {words.map((w) => (
          <span key={w} className="word-rotator-item">
            {w}
          </span>
        ))}
      </span>
    </span>
  )
}
