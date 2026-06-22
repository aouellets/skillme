/**
 * Pure formatters shared by the (server) telemetry dashboard and its (client)
 * interactive panels. No 'use client' / 'server-only' directive so both sides
 * can import it. Keep these dependency-free.
 */

export const fmtNum = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : n.toLocaleString('en-US')

export const fmtPct = (r: number | null | undefined) =>
  r === null || r === undefined ? '—' : `${Math.round(r * 100)}%`

/** Signed percentage for deltas, e.g. +42% / -13%. Caps the display at ±999%. */
export const fmtSignedPct = (r: number | null | undefined) => {
  if (r === null || r === undefined || !Number.isFinite(r)) return '—'
  const p = Math.round(r * 100)
  const capped = Math.max(-999, Math.min(999, p))
  return `${capped > 0 ? '+' : ''}${capped}%`
}

export const fmtRating = (r: number | null | undefined) =>
  r === null || r === undefined ? '—' : r.toFixed(2)

export const fmtHours = (h: number | null | undefined) =>
  h === null || h === undefined ? '—' : h < 48 ? `${h.toFixed(1)}h` : `${(h / 24).toFixed(1)}d`

export const fmtMs = (ms: number | null | undefined) =>
  ms === null || ms === undefined
    ? '—'
    : ms >= 1000
      ? `${(ms / 1000).toFixed(2)}s`
      : `${Math.round(ms)}ms`

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

/** "3h ago" / "2d ago" style relative time. Null-safe. */
export const fmtRelative = (iso: string | null | undefined) => {
  if (!iso) return '—'
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  if (!Number.isFinite(diff)) return '—'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const clampPct = (r: number) =>
  `${Math.max(0, Math.min(100, Math.round(r * 100)))}%`
