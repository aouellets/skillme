'use client'

import { useMemo, useState } from 'react'
import { fmtNum } from './format'
import { WORLD_COUNTRIES, WORLD_W, WORLD_H, projectToWorld } from '@/lib/geo/world'
import type { GeoAdoptionRow } from '@/lib/telemetry/admin-queries'

export type GeoMetric = 'events' | 'actors' | 'installs' | 'activations'

/**
 * Hand-rolled SVG world map — no map/topojson runtime dependency. Countries are
 * the vendored Natural Earth 110m outline (lib/geo/world.ts), shaded as a
 * choropleth by the selected metric (the retention-cell color-mix idiom), with
 * coordinate bubbles layered on top for located events. Country totals always
 * render (they only need the ISO code we already store); bubbles appear as
 * coordinate-bearing events accumulate.
 */
export function WorldMap({ rows, metric }: { rows: GeoAdoptionRow[]; metric: GeoMetric }) {
  const [hover, setHover] = useState<{ label: string; value: number } | null>(null)

  const { byCountry, maxCountry, bubbles, maxBubble } = useMemo(() => {
    const byCountry = new Map<string, number>()
    for (const r of rows) {
      if (!r.country) continue
      byCountry.set(r.country, (byCountry.get(r.country) ?? 0) + r[metric])
    }
    const maxCountry = Math.max(1, ...byCountry.values())

    // One bubble per located bucket (rows that carry coordinates).
    const bubbles = rows
      .filter((r) => r.lat != null && r.lng != null && r[metric] > 0)
      .map((r) => {
        const { x, y } = projectToWorld(r.lng as number, r.lat as number)
        const label = [r.city, r.region, r.country].filter(Boolean).join(', ') || 'Unknown'
        return { key: r.loc_key, x, y, value: r[metric], label }
      })
    const maxBubble = Math.max(1, ...bubbles.map((b) => b.value))
    return { byCountry, maxCountry, bubbles, maxBubble }
  }, [rows, metric])

  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-md border border-shelf-border bg-shelf-void/40">
        <svg
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label="World map of adoption by location"
        >
          {/* Choropleth: every country, shaded by its share of the leading total. */}
          {WORLD_COUNTRIES.map((c) => {
            const total = byCountry.get(c.id) ?? 0
            const pct = total > 0 ? Math.round((total / maxCountry) * 100) : 0
            const fill =
              total > 0
                ? `color-mix(in srgb, var(--shelf-accent) ${Math.max(8, pct)}%, var(--shelf-elevated))`
                : 'var(--shelf-elevated)'
            return (
              <path
                key={c.id}
                d={c.d}
                fill={fill}
                stroke="var(--shelf-void)"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
                onMouseEnter={() => setHover({ label: c.name, value: total })}
                onMouseLeave={() => setHover(null)}
              >
                <title>{`${c.name}: ${fmtNum(total)}`}</title>
              </path>
            )
          })}

          {/* Bubbles: one per located bucket, area-scaled by the metric. */}
          {bubbles.map((b) => {
            const r = 1.5 + Math.sqrt(b.value / maxBubble) * 12
            return (
              <circle
                key={b.key}
                cx={b.x}
                cy={b.y}
                r={r}
                fill="color-mix(in srgb, var(--shelf-accent) 70%, transparent)"
                stroke="var(--shelf-accent)"
                strokeWidth={0.75}
                vectorEffect="non-scaling-stroke"
                onMouseEnter={() => setHover({ label: b.label, value: b.value })}
                onMouseLeave={() => setHover(null)}
              >
                <title>{`${b.label}: ${fmtNum(b.value)}`}</title>
              </circle>
            )
          })}
        </svg>

        {/* Hover readout, pinned top-left so it never shifts the map. */}
        <div className="pointer-events-none absolute left-3 top-3 max-w-[60%]">
          {hover ? (
            <span className="inline-flex items-baseline gap-2 rounded-md border border-shelf-border bg-shelf-void/90 px-2.5 py-1 backdrop-blur-sm">
              <span className="truncate text-sm text-shelf-text-primary">{hover.label}</span>
              <span className="font-mono text-xs tabular-nums text-accent">{fmtNum(hover.value)}</span>
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-2 font-mono text-xs text-shelf-text-tertiary">
        Country shade and bubble size scale with {metric}. Bubbles need coordinates,
        which accrue from new located events.
      </p>
    </div>
  )
}
