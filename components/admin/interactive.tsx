'use client'

import { useMemo, useState } from 'react'
import { fmtNum, fmtSignedPct, fmtDate } from './format'

/**
 * Client-side interactive primitives for the telemetry dashboard. The dashboard
 * loads all rollup rows once (they are tiny) and these components slice / sort /
 * search them entirely in the browser — no extra server round-trips, and no
 * faked filtering: every control only ever re-arranges already-loaded data.
 */

// --- Sparkline ----------------------------------------------------------------

/** Minimal inline SVG sparkline. `values` oldest→newest. */
export function Sparkline({
  values,
  width = 120,
  height = 28,
  className = 'text-accent',
}: {
  values: number[]
  width?: number
  height?: number
  className?: string
}) {
  if (values.length < 2) return <div style={{ width, height }} aria-hidden />
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  const pts = values.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / span) * (height - 2) - 1
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// --- Delta badge --------------------------------------------------------------

/** ▲/▼ trend chip. `pct` is a 0..1 ratio (or null for "new / n.a."). */
export function DeltaBadge({ delta, pct }: { delta: number; pct: number | null | undefined }) {
  if (delta === 0 && (pct === null || pct === undefined)) {
    return <span className="font-mono text-xs text-shelf-text-tertiary">—</span>
  }
  const up = delta > 0
  const flat = delta === 0
  const color = flat
    ? 'text-shelf-text-tertiary'
    : up
      ? 'text-success'
      : 'text-danger'
  const arrow = flat ? '→' : up ? '▲' : '▼'
  const label = pct === null || pct === undefined ? (up ? 'new' : '—') : fmtSignedPct(pct)
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs ${color}`}>
      <span aria-hidden>{arrow}</span>
      {label}
    </span>
  )
}

// --- Sortable / searchable table ---------------------------------------------

export interface Column<T> {
  key: string
  label: string
  align?: 'left' | 'right'
  render: (row: T) => React.ReactNode
  /** Provide to make the column sortable. */
  sortValue?: (row: T) => number | string
  /** First click on this header sorts descending (good for count columns). */
  defaultDesc?: boolean
}

function Th({
  col,
  active,
  desc,
  onSort,
}: {
  col: Column<unknown>
  active: boolean
  desc: boolean
  onSort: () => void
}) {
  const base = `border-b border-shelf-border px-3 py-2 font-mono text-xs font-normal uppercase tracking-widest ${
    col.align === 'right' ? 'text-right' : 'text-left'
  }`
  if (!col.sortValue) {
    return <th className={`${base} text-shelf-text-tertiary`}>{col.label}</th>
  }
  return (
    <th className={base}>
      <button
        onClick={onSort}
        className={`inline-flex items-center gap-1 uppercase tracking-widest transition-colors hover:text-shelf-text-primary ${
          active ? 'text-shelf-text-primary' : 'text-shelf-text-tertiary'
        }`}
      >
        {col.label}
        <span aria-hidden className="text-[0.6rem]">
          {active ? (desc ? '▼' : '▲') : '↕'}
        </span>
      </button>
    </th>
  )
}

export function SortableTable<T>({
  rows,
  columns,
  getKey,
  searchAccessor,
  searchPlaceholder = 'Filter…',
  initialSortKey,
  emptyMessage = 'No rows.',
}: {
  rows: T[]
  columns: Column<T>[]
  getKey: (row: T) => string
  /** Enables the search box; returns the haystack string for a row. */
  searchAccessor?: (row: T) => string
  searchPlaceholder?: string
  initialSortKey?: string
  emptyMessage?: string
}) {
  const firstSortable = columns.find((c) => c.sortValue)
  const [sortKey, setSortKey] = useState<string | undefined>(
    initialSortKey ?? firstSortable?.key
  )
  const initialCol = columns.find((c) => c.key === (initialSortKey ?? firstSortable?.key))
  const [desc, setDesc] = useState<boolean>(initialCol?.defaultDesc ?? true)
  const [query, setQuery] = useState('')

  const activeCol = columns.find((c) => c.key === sortKey)

  const visible = useMemo(() => {
    let out = rows
    if (searchAccessor && query.trim()) {
      const q = query.trim().toLowerCase()
      out = out.filter((r) => searchAccessor(r).toLowerCase().includes(q))
    }
    if (activeCol?.sortValue) {
      const sv = activeCol.sortValue
      out = [...out].sort((a, b) => {
        const av = sv(a)
        const bv = sv(b)
        let cmp: number
        if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
        else cmp = String(av).localeCompare(String(bv))
        return desc ? -cmp : cmp
      })
    }
    return out
  }, [rows, query, searchAccessor, activeCol, desc])

  function onSort(col: Column<T>) {
    if (!col.sortValue) return
    if (col.key === sortKey) {
      setDesc((d) => !d)
    } else {
      setSortKey(col.key)
      setDesc(col.defaultDesc ?? true)
    }
  }

  return (
    <div>
      {searchAccessor ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="input w-full max-w-xs text-sm"
          />
          <span className="shrink-0 font-mono text-xs text-shelf-text-tertiary">
            {visible.length} of {rows.length}
          </span>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <Th
                  key={col.key}
                  col={col as Column<unknown>}
                  active={col.key === sortKey}
                  desc={desc}
                  onSort={() => onSort(col)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-sm text-shelf-text-tertiary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr
                  key={getKey(row)}
                  className="transition-colors hover:bg-shelf-elevated/40"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`border-b border-shelf-border/60 px-3 py-2.5 text-sm text-shelf-text-secondary ${
                        col.align === 'right' ? 'text-right tabular-nums' : 'text-left'
                      }`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Event volume explorer ----------------------------------------------------

export interface EventVolumePoint {
  day: string
  event_name: string
  source: string
  events: number
  actors: number
}

const RANGES = [
  { key: '7d', label: '7d', days: 7 },
  { key: '30d', label: '30d', days: 30 },
  { key: '90d', label: '90d', days: 90 },
  { key: 'all', label: 'All', days: Infinity },
] as const

/**
 * Filterable activity timeline. Range + event-name + source selectors re-slice
 * the daily rollup client-side and draw a per-day bar trend with a total and a
 * within-range trend delta (second half vs first half of the window).
 */
export function EventVolumeExplorer({ rows }: { rows: EventVolumePoint[] }) {
  const eventNames = useMemo(
    () => [...new Set(rows.map((r) => r.event_name))].sort(),
    [rows]
  )
  const sources = useMemo(() => [...new Set(rows.map((r) => r.source))].sort(), [rows])

  const [range, setRange] = useState<(typeof RANGES)[number]['key']>('30d')
  const [event, setEvent] = useState<string>('all')
  const [source, setSource] = useState<string>('all')

  const rangeDays = RANGES.find((r) => r.key === range)?.days ?? 30

  const { trend, total, delta, deltaPct } = useMemo(() => {
    const cutoff =
      rangeDays === Infinity ? null : new Date(Date.now() - rangeDays * 86400000)
    const byDay = new Map<string, number>()
    for (const r of rows) {
      if (event !== 'all' && r.event_name !== event) continue
      if (source !== 'all' && r.source !== source) continue
      if (cutoff && new Date(r.day) < cutoff) continue
      byDay.set(r.day, (byDay.get(r.day) ?? 0) + r.events)
    }
    const ordered = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    const series = ordered.map(([day, events]) => ({ day, events }))
    const total = series.reduce((s, p) => s + p.events, 0)
    // Trend delta: second half vs first half of the visible window.
    const mid = Math.floor(series.length / 2)
    const firstHalf = series.slice(0, mid).reduce((s, p) => s + p.events, 0)
    const secondHalf = series.slice(mid).reduce((s, p) => s + p.events, 0)
    const delta = secondHalf - firstHalf
    const deltaPct = firstHalf > 0 ? delta / firstHalf : null
    return { trend: series, total, delta, deltaPct }
  }, [rows, rangeDays, event, source])

  const peak = Math.max(1, ...trend.map((p) => p.events))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={RANGES.map((r) => ({ key: r.key, label: r.label }))}
          value={range}
          onChange={(k) => setRange(k as (typeof RANGES)[number]['key'])}
        />
        <select
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="input text-sm py-1.5"
          aria-label="Event"
        >
          <option value="all">All events</option>
          {eventNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="input text-sm py-1.5"
          aria-label="Source"
        >
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-display text-2xl text-shelf-text-primary">{fmtNum(total)}</span>
        <span className="text-xs text-shelf-text-tertiary">events in range</span>
        <DeltaBadge delta={delta} pct={deltaPct} />
        <span className="text-xs text-shelf-text-tertiary">vs first half of window</span>
      </div>

      {trend.length === 0 ? (
        <div className="rounded-md border border-dashed border-shelf-border bg-shelf-void/40 px-4 py-8 text-center">
          <p className="text-sm text-shelf-text-tertiary">No events match these filters.</p>
        </div>
      ) : (
        <div className="flex h-28 items-end gap-px">
          {trend.map((p) => (
            <div
              key={p.day}
              className="group relative flex-1"
              title={`${fmtDate(p.day)}: ${fmtNum(p.events)} events`}
            >
              <div
                className="w-full rounded-xs bg-accent/70 transition-colors group-hover:bg-accent"
                style={{ height: `${Math.max(2, (p.events / peak) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Segmented control --------------------------------------------------------

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[]
  value: string
  onChange: (key: string) => void
}) {
  return (
    <div className="inline-flex rounded-md border border-shelf-border bg-shelf-void/40 p-0.5">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`rounded-sm px-2.5 py-1 font-mono text-xs transition-colors ${
            value === o.key
              ? 'bg-accent/20 text-shelf-text-primary'
              : 'text-shelf-text-tertiary hover:text-shelf-text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
