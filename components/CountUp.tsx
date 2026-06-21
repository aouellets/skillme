'use client'

import { useEffect, useRef } from 'react'

/**
 * Counts a metric up from zero the first time it scrolls into view. Motivated
 * motion (feedback): the live catalog size reads as something that grows, not a
 * static label. The value is written to the node via rAF + textContent — no
 * per-frame React state. Honors prefers-reduced-motion by rendering the final
 * value immediately. SSR renders the final value too, so no-JS sees it correctly.
 */
export function CountUp({
  value,
  durationMs = 1500,
  suffix = '',
  format,
}: {
  value: number
  durationMs?: number
  suffix?: string
  format?: (n: number) => string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fmt = format ?? ((n: number) => Math.round(n).toLocaleString())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = fmt(value) + suffix
      return
    }

    let raf = 0
    let start = 0
    el.textContent = fmt(0) + suffix

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const tick = (t: number) => {
          if (!start) start = t
          const p = Math.min(1, (t - start) / durationMs)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = fmt(value * eased) + suffix
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, durationMs, suffix, format])

  // SSR / no-JS fallback: the resolved value.
  const initial = (format ?? ((n: number) => Math.round(n).toLocaleString()))(value) + suffix
  return <span ref={ref}>{initial}</span>
}
