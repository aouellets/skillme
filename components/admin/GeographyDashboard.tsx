'use client'

import { useMemo, useState } from 'react'
import { fmtNum } from './format'
import { SegmentedControl, SortableTable, type Column } from './interactive'
import { WorldMap, type GeoMetric } from './WorldMap'
import type { GeoAdoptionRow } from '@/lib/telemetry/admin-queries'

// Local copies of the dashboard primitives — deliberately NOT lifted out of
// TelemetryDashboard.tsx (keeping that file's internals private; see the design
// reconciliation). They mirror the same tokens/markup.
function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-display text-xl text-shelf-text-primary">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-shelf-text-secondary">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-shelf-border bg-shelf-void/40 px-4 py-3">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">{label}</p>
      <p className="mt-1 font-display text-2xl text-shelf-text-primary">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-shelf-text-tertiary">{sub}</p> : null}
    </div>
  )
}

const METRICS: { key: GeoMetric; label: string }[] = [
  { key: 'events', label: 'Events' },
  { key: 'actors', label: 'Users' },
  { key: 'installs', label: 'Installs' },
  { key: 'activations', label: 'Activations' },
]

function locationLabel(r: GeoAdoptionRow): string {
  return [r.city, r.region, r.country].filter(Boolean).join(', ') || 'Unknown'
}

export function GeographyDashboard({
  rows,
  adminEmail,
}: {
  rows: GeoAdoptionRow[]
  adminEmail: string
}) {
  const [metric, setMetric] = useState<GeoMetric>('events')

  const totals = useMemo(() => {
    const t = { events: 0, actors: 0, installs: 0, activations: 0 }
    for (const r of rows) {
      t.events += r.events
      t.actors += r.actors
      t.installs += r.installs
      t.activations += r.activations
    }
    const countries = new Set(rows.map((r) => r.country).filter(Boolean)).size
    const located = rows.filter((r) => r.lat != null && r.lng != null).length
    return { ...t, countries, located }
  }, [rows])

  const columns: Column<GeoAdoptionRow>[] = [
    {
      key: 'location',
      label: 'Location',
      render: (r) => <span className="text-shelf-text-primary">{locationLabel(r)}</span>,
      sortValue: (r) => locationLabel(r),
      defaultDesc: false,
    },
    { key: 'events', label: 'Events', align: 'right', render: (r) => fmtNum(r.events), sortValue: (r) => r.events },
    { key: 'actors', label: 'Users', align: 'right', render: (r) => fmtNum(r.actors), sortValue: (r) => r.actors },
    { key: 'installs', label: 'Installs', align: 'right', render: (r) => fmtNum(r.installs), sortValue: (r) => r.installs },
    {
      key: 'activations',
      label: 'Activations',
      align: 'right',
      render: (r) => fmtNum(r.activations),
      sortValue: (r) => r.activations,
    },
  ]

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Admin · {adminEmail}
      </p>
      <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">Adoption</h1>
      <p className="mt-3 max-w-2xl text-sm text-shelf-text-secondary">
        Where Skill Me is used, from coarse, non-identifying edge geo. Refreshes every
        15 minutes with the other rollups.
      </p>

      {rows.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-shelf-text-primary">No located activity yet.</p>
          <p className="mt-1 text-sm text-shelf-text-secondary">
            Geography populates as located events are recorded.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Countries" value={fmtNum(totals.countries)} sub="with activity" />
            <StatCard label="Events" value={fmtNum(totals.events)} />
            <StatCard label="Users" value={fmtNum(totals.actors)} sub="distinct actors" />
            <StatCard
              label="Located buckets"
              value={fmtNum(totals.located)}
              sub="with coordinates"
            />
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <SegmentedControl
              options={METRICS.map((m) => ({ key: m.key, label: m.label }))}
              value={metric}
              onChange={(k) => setMetric(k as GeoMetric)}
            />
            <p className="hidden text-xs text-shelf-text-tertiary sm:block">
              Metric shades the map
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Panel title="Adoption map" description="Country shade + bubble size by the selected metric.">
                <WorldMap rows={rows} metric={metric} />
              </Panel>
            </div>
            <Panel title="Top locations" description="Busiest buckets. Click a column to re-sort.">
              <SortableTable
                rows={rows}
                columns={columns}
                getKey={(r) => r.loc_key}
                searchAccessor={(r) => locationLabel(r)}
                searchPlaceholder="Filter locations…"
                initialSortKey="events"
                maxRows={12}
              />
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}
