'use client'

import { CountUp } from './CountUp'

interface Stat {
  /** Numeric value to count up to, or null for a non-numeric value (e.g. "MIT"). */
  value: number | null
  /** Static text used when `value` is null. */
  text?: string
  suffix?: string
  label: string
}

/**
 * The metrics strip directly under the hero: live catalog size, packs, partner
 * count, and the open-source fact, divided into glass cells. Numeric cells count
 * up on first view (CountUp). Keeping the numbers out of the hero itself respects
 * hero-stack discipline; they earn their own band here.
 */
export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 divide-shelf-border sm:grid-cols-4 sm:divide-x">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col items-center justify-center gap-1.5 px-4 py-6 text-center ${
            i < 2 ? 'border-b border-shelf-border sm:border-b-0' : ''
          } ${i % 2 === 1 ? 'border-l border-shelf-border sm:border-l-0' : ''}`}
        >
          <dd className="font-display text-3xl font-semibold tracking-tight text-shelf-text-primary sm:text-4xl">
            {s.value !== null ? (
              <CountUp value={s.value} suffix={s.suffix ?? ''} />
            ) : (
              <span className="text-accent">{s.text}</span>
            )}
          </dd>
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-shelf-text-tertiary">
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  )
}
