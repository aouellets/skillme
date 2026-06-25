'use client'

// Client component: it builds table column definitions containing render and
// sortValue *functions* and passes them to the interactive primitives — a
// Server Component can't pass functions across the client boundary. It only
// imports types from admin-queries (erased at build), pure formatters, and the
// client primitives, and receives already-loaded serializable data as props.
import type {
  ActiveUsersDailyRow,
  ActivationRow,
  EventVolumeRow,
  FunnelRow,
  GrowthRow,
  PackPerfRow,
  RetentionRow,
  SearchTermRow,
  SkillPerfRow,
  TelemetryDashboardData,
  ToolPerfRow,
  TrendingPackRow,
  TrendingSkillRow,
} from '@/lib/telemetry/admin-queries'
import {
  clampPct,
  fmtDate,
  fmtDateTime,
  fmtHours,
  fmtMs,
  fmtNum,
  fmtPct,
  fmtRating,
  fmtRelative,
} from './format'
import { useState } from 'react'
import {
  DeltaBadge,
  EventVolumeExplorer,
  SegmentedControl,
  Sparkline,
  SortableTable,
  type Column,
} from './interactive'

/**
 * Server-rendered telemetry dashboard. Static visuals (funnel, retention
 * heatmap, growth, cohorts) stay Server Components; tables and the activity
 * timeline are delegated to the client primitives in ./interactive so admins
 * can sort, search and range-filter the already-loaded rollups without extra
 * server work. Colors come from the shelf-* theme tokens; the only inline
 * styles are data-driven dimensions referencing CSS theme variables.
 */

// --- primitives ---------------------------------------------------------------

function Panel({
  title,
  description,
  children,
  id,
}: {
  title: string
  description?: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <section id={id} className="card p-5 sm:p-6">
      <h2 className="font-display text-xl text-shelf-text-primary">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-shelf-text-secondary">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-shelf-border bg-shelf-void/40 px-4 py-8 text-center">
      <p className="text-sm text-shelf-text-tertiary">{message}</p>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-shelf-border bg-shelf-void/40 px-4 py-3">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl text-shelf-text-primary">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-shelf-text-tertiary">{sub}</p> : null}
    </div>
  )
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`border-b border-shelf-border px-3 py-2 font-mono text-xs font-normal uppercase tracking-widest text-shelf-text-tertiary ${
        right ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  )
}

function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <td
      className={`border-b border-shelf-border/60 px-3 py-2 text-sm text-shelf-text-secondary ${
        right ? 'text-right tabular-nums' : 'text-left'
      }`}
    >
      {children}
    </td>
  )
}

// --- KPI header ---------------------------------------------------------------

/** Sum a daily series over a trailing window, optionally skipping the most
 *  recent `skip` days (used to read the prior period). */
function sumWindow(series: { day: string; v: number }[], days: number, skip = 0): number {
  const end = Date.now() - skip * 86400000
  const start = Date.now() - (skip + days) * 86400000
  return series
    .filter((p) => {
      const t = new Date(p.day).getTime()
      return t < end && t >= start
    })
    .reduce((s, p) => s + p.v, 0)
}

/** Daily totals for an event from the event-volume rollup, oldest→newest. */
function eventSeries(rows: EventVolumeRow[], name: string): { day: string; v: number }[] {
  const byDay = new Map<string, number>()
  for (const r of rows) {
    if (r.event_name !== name) continue
    byDay.set(r.day, (byDay.get(r.day) ?? 0) + r.events)
  }
  return [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([day, v]) => ({ day, v }))
}

function KpiCard({
  label,
  value,
  sub,
  delta,
  pct,
  spark,
}: {
  label: string
  value: string
  sub?: string
  delta?: number
  pct?: number | null
  spark?: number[]
}) {
  return (
    <div className="card flex flex-col justify-between gap-3 p-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
          {label}
        </p>
        <p className="mt-1 font-display text-3xl text-shelf-text-primary">{value}</p>
        <div className="mt-1 flex items-center gap-2">
          {delta !== undefined ? <DeltaBadge delta={delta} pct={pct} /> : null}
          {sub ? <span className="text-xs text-shelf-text-tertiary">{sub}</span> : null}
        </div>
      </div>
      {spark && spark.length > 1 ? (
        <Sparkline values={spark} width={160} height={32} className="text-accent/70" />
      ) : null}
    </div>
  )
}

export function KpiHeader({
  activeUsers,
  eventVolume,
  tools,
}: {
  activeUsers: ActiveUsersDailyRow[]
  eventVolume: EventVolumeRow[]
  tools: ToolPerfRow[]
}) {
  // DAU: latest day total across sources, vs the same day one week earlier.
  const dauByDay = new Map<string, number>()
  for (const r of activeUsers) dauByDay.set(r.day, (dauByDay.get(r.day) ?? 0) + r.dau)
  const dauSeries = [...dauByDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, v]) => ({ day, v }))
  const latestDau = dauSeries.at(-1)?.v ?? 0
  const weekAgoDau = dauSeries.at(-8)?.v ?? 0
  const dauDelta = latestDau - weekAgoDau
  const dauPct = weekAgoDau > 0 ? dauDelta / weekAgoDau : null

  const installSeries = eventSeries(eventVolume, 'skill_installed')
  const install7 = sumWindow(installSeries, 7)
  const installPrev7 = sumWindow(installSeries, 7, 7)

  const signupSeries = eventSeries(eventVolume, 'user_signed_up')
  const signup7 = sumWindow(signupSeries, 7)
  const signupPrev7 = sumWindow(signupSeries, 7, 7)

  const toolSeries = eventSeries(eventVolume, 'mcp_tool_invoked')
  const tool7 = tools.reduce((s, t) => s + t.invocations_7d, 0)
  const toolPrev7 = tools.reduce((s, t) => s + t.invocations_prev_7d, 0)

  const last30 = (s: { day: string; v: number }[]) => s.slice(-30).map((p) => p.v)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Active users · DAU"
        value={fmtNum(latestDau)}
        sub="vs 7d ago"
        delta={dauDelta}
        pct={dauPct}
        spark={last30(dauSeries)}
      />
      <KpiCard
        label="Tool calls · 7d"
        value={fmtNum(tool7)}
        sub="vs prior 7d"
        delta={tool7 - toolPrev7}
        pct={toolPrev7 > 0 ? (tool7 - toolPrev7) / toolPrev7 : null}
        spark={last30(toolSeries)}
      />
      <KpiCard
        label="Skill installs · 7d"
        value={fmtNum(install7)}
        sub="vs prior 7d"
        delta={install7 - installPrev7}
        pct={installPrev7 > 0 ? (install7 - installPrev7) / installPrev7 : null}
        spark={last30(installSeries)}
      />
      <KpiCard
        label="New signups · 7d"
        value={fmtNum(signup7)}
        sub="vs prior 7d"
        delta={signup7 - signupPrev7}
        pct={signupPrev7 > 0 ? (signup7 - signupPrev7) / signupPrev7 : null}
        spark={last30(signupSeries)}
      />
    </div>
  )
}

// --- panels: active users -----------------------------------------------------

function ActiveUsersPanel({ rows }: { rows: ActiveUsersDailyRow[] }) {
  if (rows.length === 0) {
    return (
      <Panel title="Active users" description="Daily / weekly / monthly active users by source.">
        <EmptyState message="No active-user data yet." />
      </Panel>
    )
  }

  const latestDay = rows.reduce((max, r) => (r.day > max ? r.day : max), rows[0].day)
  const latest = rows.filter((r) => r.day === latestDay)

  const byDay = new Map<string, number>()
  for (const r of rows) byDay.set(r.day, (byDay.get(r.day) ?? 0) + r.dau)
  const trend = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-30)
  const peak = Math.max(1, ...trend.map(([, v]) => v))

  return (
    <Panel
      title="Active users"
      description={`Daily / weekly / monthly active users by source. Latest day: ${fmtDate(
        latestDay
      )}.`}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((r) => (
          <StatCard
            key={r.source}
            label={`${r.source} · DAU`}
            value={fmtNum(r.dau)}
            sub={`WAU ${fmtNum(r.wau)} · MAU ${fmtNum(r.mau)}`}
          />
        ))}
      </div>

      <p className="mt-6 mb-2 font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        DAU trend (all sources, last {trend.length}d)
      </p>
      <div className="flex h-24 items-end gap-1">
        {trend.map(([day, v]) => (
          <div key={day} className="group relative flex-1" title={`${fmtDate(day)}: ${v}`}>
            <div
              className="w-full rounded-xs bg-accent/70"
              style={{ height: `${Math.max(2, (v / peak) * 100)}%` }}
            />
          </div>
        ))}
      </div>
    </Panel>
  )
}

// --- panels: tool performance -------------------------------------------------

function ToolPerfPanel({ rows }: { rows: ToolPerfRow[] }) {
  const desc =
    'MCP tool calls: volume, week-over-week trend, error rate and latency (p50 / p95).'
  if (rows.length === 0) {
    return (
      <Panel title="MCP tool performance" description={desc}>
        <EmptyState message="No tool calls recorded yet. mcp_tool_invoked events populate this once the MCP server is used." />
      </Panel>
    )
  }
  const columns: Column<ToolPerfRow>[] = [
    {
      key: 'tool',
      label: 'Tool',
      render: (r) => <span className="font-mono text-shelf-text-primary">{r.tool}</span>,
      sortValue: (r) => r.tool,
      defaultDesc: false,
    },
    {
      key: 'invocations',
      label: 'Calls',
      align: 'right',
      render: (r) => fmtNum(r.invocations),
      sortValue: (r) => r.invocations,
    },
    {
      key: 'inv24h',
      label: '24h',
      align: 'right',
      render: (r) => fmtNum(r.invocations_24h),
      sortValue: (r) => r.invocations_24h,
    },
    {
      key: 'inv7d',
      label: '7d',
      align: 'right',
      render: (r) => (
        <span className="inline-flex items-center justify-end gap-2">
          {fmtNum(r.invocations_7d)}
          <DeltaBadge
            delta={r.invocations_7d - r.invocations_prev_7d}
            pct={
              r.invocations_prev_7d > 0
                ? (r.invocations_7d - r.invocations_prev_7d) / r.invocations_prev_7d
                : null
            }
          />
        </span>
      ),
      sortValue: (r) => r.invocations_7d,
    },
    {
      key: 'actors',
      label: 'Users',
      align: 'right',
      render: (r) => fmtNum(r.distinct_actors),
      sortValue: (r) => r.distinct_actors,
    },
    {
      key: 'error_rate',
      label: 'Errors',
      align: 'right',
      render: (r) => (
        <span className={r.error_rate > 0.05 ? 'text-danger' : 'text-shelf-text-secondary'}>
          {fmtPct(r.error_rate)}
        </span>
      ),
      sortValue: (r) => r.error_rate,
    },
    {
      key: 'p50',
      label: 'p50',
      align: 'right',
      render: (r) => fmtMs(r.p50_ms),
      sortValue: (r) => r.p50_ms ?? 0,
    },
    {
      key: 'p95',
      label: 'p95',
      align: 'right',
      render: (r) => (
        <span className={(r.p95_ms ?? 0) > 2000 ? 'text-danger' : 'text-shelf-text-secondary'}>
          {fmtMs(r.p95_ms)}
        </span>
      ),
      sortValue: (r) => r.p95_ms ?? 0,
    },
    {
      key: 'last_used',
      label: 'Last used',
      align: 'right',
      render: (r) => fmtRelative(r.last_used_at),
      sortValue: (r) => r.last_used_at ?? '',
    },
  ]
  return (
    <Panel title="MCP tool performance" description={desc}>
      <SortableTable
        rows={rows}
        columns={columns}
        getKey={(r) => r.tool}
        initialSortKey="invocations"
      />
    </Panel>
  )
}

// --- panels: trending ---------------------------------------------------------

function TrendingSkillsPanel({ rows }: { rows: TrendingSkillRow[] }) {
  const desc = 'Last 7 days vs the prior 7, by install velocity.'
  if (rows.length === 0) {
    return (
      <Panel title="Trending skills" description={desc}>
        <EmptyState message="No skill activity in the last 7 days." />
      </Panel>
    )
  }
  const columns: Column<TrendingSkillRow>[] = [
    {
      key: 'skill',
      label: 'Skill',
      render: (r) => (
        <span className="text-shelf-text-primary">{r.skill_name ?? r.skill_id.slice(0, 8)}</span>
      ),
      sortValue: (r) => r.skill_name ?? r.skill_id,
      defaultDesc: false,
    },
    {
      key: 'installs_7d',
      label: 'Installs 7d',
      align: 'right',
      render: (r) => (
        <span className="inline-flex items-center justify-end gap-2">
          {fmtNum(r.installs_7d)}
          <DeltaBadge delta={r.installs_delta} pct={r.installs_growth} />
        </span>
      ),
      sortValue: (r) => r.installs_7d,
    },
    {
      key: 'views_7d',
      label: 'Views 7d',
      align: 'right',
      render: (r) => fmtNum(r.views_7d),
      sortValue: (r) => r.views_7d,
    },
    {
      key: 'activations_7d',
      label: 'Activations 7d',
      align: 'right',
      render: (r) => fmtNum(r.activations_7d),
      sortValue: (r) => r.activations_7d,
    },
  ]
  return (
    <Panel title="Trending skills" description={desc}>
      <SortableTable
        rows={rows}
        columns={columns}
        getKey={(r) => r.skill_id}
        searchAccessor={(r) => r.skill_name ?? r.skill_id}
        searchPlaceholder="Filter skills…"
        initialSortKey="installs_7d"
      />
    </Panel>
  )
}

function TrendingPacksPanel({ rows }: { rows: TrendingPackRow[] }) {
  const desc = 'Last 7 days vs the prior 7, by install velocity.'
  if (rows.length === 0) {
    return (
      <Panel title="Trending packs" description={desc}>
        <EmptyState message="No pack installs in the last 7 days." />
      </Panel>
    )
  }
  const columns: Column<TrendingPackRow>[] = [
    {
      key: 'pack',
      label: 'Pack',
      render: (r) => (
        <span className="text-shelf-text-primary">{r.pack_name ?? r.pack_id.slice(0, 8)}</span>
      ),
      sortValue: (r) => r.pack_name ?? r.pack_id,
      defaultDesc: false,
    },
    {
      key: 'installs_7d',
      label: 'Installs 7d',
      align: 'right',
      render: (r) => (
        <span className="inline-flex items-center justify-end gap-2">
          {fmtNum(r.installs_7d)}
          <DeltaBadge delta={r.installs_delta} pct={r.installs_growth} />
        </span>
      ),
      sortValue: (r) => r.installs_7d,
    },
    {
      key: 'actors_7d',
      label: 'Installers 7d',
      align: 'right',
      render: (r) => fmtNum(r.actors_7d),
      sortValue: (r) => r.actors_7d,
    },
  ]
  return (
    <Panel title="Trending packs" description={desc}>
      <SortableTable
        rows={rows}
        columns={columns}
        getKey={(r) => r.pack_id}
        searchAccessor={(r) => r.pack_name ?? r.pack_id}
        searchPlaceholder="Filter packs…"
        initialSortKey="installs_7d"
      />
    </Panel>
  )
}

// --- panels: search terms -----------------------------------------------------

function SearchTermsPanel({ rows }: { rows: SearchTermRow[] }) {
  const desc =
    'Browse / recommend queries. A high zero-result rate is a direct catalog-gap signal.'
  if (rows.length === 0) {
    return (
      <Panel title="Search terms" description={desc}>
        <EmptyState message="No search queries recorded yet." />
      </Panel>
    )
  }
  const columns: Column<SearchTermRow>[] = [
    {
      key: 'term',
      label: 'Query',
      render: (r) => <span className="text-shelf-text-primary">{r.term}</span>,
      sortValue: (r) => r.term,
      defaultDesc: false,
    },
    {
      key: 'searches',
      label: 'Searches',
      align: 'right',
      render: (r) => fmtNum(r.searches),
      sortValue: (r) => r.searches,
    },
    {
      key: 'distinct_searchers',
      label: 'Users',
      align: 'right',
      render: (r) => fmtNum(r.distinct_searchers),
      sortValue: (r) => r.distinct_searchers,
    },
    {
      key: 'avg_results',
      label: 'Avg results',
      align: 'right',
      render: (r) => (r.avg_results === null ? '—' : r.avg_results.toFixed(1)),
      sortValue: (r) => r.avg_results ?? 0,
    },
    {
      key: 'zero_result_rate',
      label: 'Zero-result',
      align: 'right',
      render: (r) => (
        <span className={r.zero_result_rate >= 0.5 ? 'text-danger' : 'text-shelf-text-secondary'}>
          {fmtPct(r.zero_result_rate)}
        </span>
      ),
      sortValue: (r) => r.zero_result_rate,
    },
  ]
  return (
    <Panel title="Search terms" description={desc}>
      <SortableTable
        rows={rows}
        columns={columns}
        getKey={(r) => r.term}
        searchAccessor={(r) => r.term}
        searchPlaceholder="Filter queries…"
        initialSortKey="searches"
      />
    </Panel>
  )
}

// --- panels: activation -------------------------------------------------------

function ActivationPanel({ rows }: { rows: ActivationRow[] }) {
  const desc = 'Signup → first install, by signup-week cohort, with time-to-activate.'
  if (rows.length === 0) {
    return (
      <Panel title="Activation" description={desc}>
        <EmptyState message="No activation data yet — no signups have been recorded. Cohorts appear here once user_signed_up events land." />
      </Panel>
    )
  }

  const cohortTotal = rows.reduce((s, r) => s + r.cohort_size, 0)
  const activatedTotal = rows.reduce((s, r) => s + r.activated_users, 0)
  const overall = cohortTotal > 0 ? activatedTotal / cohortTotal : 0
  const hoursVals = rows.map((r) => r.avg_hours_to_activate).filter((h): h is number => h !== null)
  const avgHours = hoursVals.length ? hoursVals.reduce((a, b) => a + b, 0) / hoursVals.length : null

  return (
    <Panel title="Activation" description={desc}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Overall activation" value={fmtPct(overall)} sub={`${activatedTotal} of ${cohortTotal}`} />
        <StatCard label="Avg time to activate" value={fmtHours(avgHours)} />
        <StatCard label="Cohorts" value={fmtNum(rows.length)} />
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Signup week</Th>
              <Th right>Cohort</Th>
              <Th right>Activated</Th>
              <Th right>Rate</Th>
              <Th right>Avg time</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.signup_week}>
                <Td>{fmtDate(r.signup_week)}</Td>
                <Td right>{fmtNum(r.cohort_size)}</Td>
                <Td right>{fmtNum(r.activated_users)}</Td>
                <Td right>{fmtPct(r.activation_rate)}</Td>
                <Td right>{fmtHours(r.avg_hours_to_activate)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

// --- panels: retention --------------------------------------------------------

function RetentionPanel({ rows }: { rows: RetentionRow[] }) {
  const desc = 'Weekly cohort retention by signup week. Cell shade = % of the cohort still active.'
  if (rows.length === 0) {
    return (
      <Panel title="Retention cohorts" description={desc}>
        <EmptyState message="No retention data yet — needs signup cohorts with follow-on activity. Populates once signups accrue across weeks." />
      </Panel>
    )
  }

  const weeks = [...new Set(rows.map((r) => r.signup_week))].sort()
  const maxOffset = Math.max(...rows.map((r) => r.week_offset))
  const offsets = Array.from({ length: maxOffset + 1 }, (_, i) => i)
  const cell = new Map<string, RetentionRow>()
  for (const r of rows) cell.set(`${r.signup_week}:${r.week_offset}`, r)

  return (
    <Panel title="Retention cohorts" description={desc}>
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <Th>Cohort</Th>
              <Th right>Size</Th>
              {offsets.map((o) => (
                <Th key={o} right>
                  W{o}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => {
              const size = cell.get(`${w}:0`)?.cohort_size ?? 0
              return (
                <tr key={w}>
                  <Td>{fmtDate(w)}</Td>
                  <Td right>{fmtNum(size)}</Td>
                  {offsets.map((o) => {
                    const c = cell.get(`${w}:${o}`)
                    if (!c) return <td key={o} className="border-b border-shelf-border/60 px-3 py-2" />
                    return (
                      <td
                        key={o}
                        className="border-b border-shelf-border/60 px-3 py-2 text-right text-sm tabular-nums text-shelf-text-primary"
                        style={{
                          backgroundColor: `color-mix(in srgb, var(--shelf-accent) ${clampPct(
                            c.retention_rate
                          )}, transparent)`,
                        }}
                        title={`${c.retained_users}/${c.cohort_size}`}
                      >
                        {fmtPct(c.retention_rate)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

// --- panels: funnel -----------------------------------------------------------

function FunnelPanel({ rows }: { rows: FunnelRow[] }) {
  const desc = 'Browse → view → install → activate, with drop-off at each step.'
  if (rows.length === 0) {
    return (
      <Panel title="Install funnel" description={desc}>
        <EmptyState message="No funnel data yet." />
      </Panel>
    )
  }
  return (
    <Panel title="Install funnel" description={desc}>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.step_order}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="capitalize text-shelf-text-primary">{r.step}</span>
              <span className="tabular-nums text-shelf-text-tertiary">
                {fmtNum(r.actors)} · {fmtPct(r.pct_of_top)} of top
                {r.step_conversion !== null ? ` · ${fmtPct(r.step_conversion)} step` : ''}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-xs bg-shelf-void/60">
              <div className="h-full rounded-xs bg-accent" style={{ width: clampPct(r.pct_of_top) }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// --- panels: skill / pack performance (sortable) ------------------------------

function SkillPerfPanel({ rows }: { rows: SkillPerfRow[] }) {
  const desc = 'Per skill: installs, uninstalls, distinct activators, rating, install→activation.'
  if (rows.length === 0) {
    return (
      <Panel title="Skill performance" description={desc}>
        <EmptyState message="No skill activity yet." />
      </Panel>
    )
  }
  const columns: Column<SkillPerfRow>[] = [
    {
      key: 'skill',
      label: 'Skill',
      render: (r) => <span className="text-shelf-text-primary">{r.skill_name ?? r.skill_id.slice(0, 8)}</span>,
      sortValue: (r) => r.skill_name ?? r.skill_id,
      defaultDesc: false,
    },
    { key: 'installs', label: 'Installs', align: 'right', render: (r) => fmtNum(r.installs), sortValue: (r) => r.installs },
    { key: 'uninstalls', label: 'Uninstalls', align: 'right', render: (r) => fmtNum(r.uninstalls), sortValue: (r) => r.uninstalls },
    { key: 'activators', label: 'Activators', align: 'right', render: (r) => fmtNum(r.activating_users), sortValue: (r) => r.activating_users },
    {
      key: 'rating',
      label: 'Rating',
      align: 'right',
      render: (r) => `${fmtRating(r.avg_rating)}${r.ratings > 0 ? ` (${r.ratings})` : ''}`,
      sortValue: (r) => r.avg_rating ?? 0,
    },
    {
      key: 'inst_act',
      label: 'Inst→Act',
      align: 'right',
      render: (r) => fmtPct(r.install_to_activation_rate),
      sortValue: (r) => r.install_to_activation_rate ?? 0,
    },
  ]
  return (
    <Panel title="Skill performance" description={desc}>
      <SortableTable
        rows={rows}
        columns={columns}
        getKey={(r) => r.skill_id}
        searchAccessor={(r) => r.skill_name ?? r.skill_id}
        searchPlaceholder="Filter skills…"
        initialSortKey="installs"
      />
    </Panel>
  )
}

function PackPerfPanel({ rows }: { rows: PackPerfRow[] }) {
  const desc = 'Per pack: installs, distinct installers, and derived skill activations.'
  if (rows.length === 0) {
    return (
      <Panel title="Pack performance" description={desc}>
        <EmptyState message="No pack activity yet." />
      </Panel>
    )
  }
  const columns: Column<PackPerfRow>[] = [
    {
      key: 'pack',
      label: 'Pack',
      render: (r) => <span className="text-shelf-text-primary">{r.pack_name ?? r.pack_id.slice(0, 8)}</span>,
      sortValue: (r) => r.pack_name ?? r.pack_id,
      defaultDesc: false,
    },
    { key: 'installs', label: 'Installs', align: 'right', render: (r) => fmtNum(r.installs), sortValue: (r) => r.installs },
    { key: 'installers', label: 'Installers', align: 'right', render: (r) => fmtNum(r.distinct_installers), sortValue: (r) => r.distinct_installers },
    { key: 'skill_acts', label: 'Skill activations', align: 'right', render: (r) => fmtNum(r.derived_skill_activations), sortValue: (r) => r.derived_skill_activations },
    { key: 'act_users', label: 'Activating users', align: 'right', render: (r) => fmtNum(r.distinct_activating_users), sortValue: (r) => r.distinct_activating_users },
  ]
  return (
    <Panel title="Pack performance" description={desc}>
      <SortableTable
        rows={rows}
        columns={columns}
        getKey={(r) => r.pack_id}
        searchAccessor={(r) => r.pack_name ?? r.pack_id}
        searchPlaceholder="Filter packs…"
        initialSortKey="installs"
      />
    </Panel>
  )
}

// --- panels: growth -----------------------------------------------------------

const GROWTH_SEGMENTS = [
  { key: 'new_users' as const, label: 'New', varName: '--shelf-accent' },
  { key: 'retained_users' as const, label: 'Retained', varName: '--shelf-success' },
  { key: 'resurrected_users' as const, label: 'Resurrected', varName: '--shelf-info' },
  { key: 'churned_users' as const, label: 'Churned', varName: '--shelf-danger' },
]

function GrowthPanel({ rows }: { rows: GrowthRow[] }) {
  const desc = 'New / retained / resurrected / churned accounts per period.'
  if (rows.length === 0) {
    return (
      <Panel title="Growth accounting" description={desc}>
        <EmptyState message="No growth data yet." />
      </Panel>
    )
  }
  const peak = Math.max(
    1,
    ...rows.map((r) => r.new_users + r.retained_users + r.resurrected_users + r.churned_users)
  )
  return (
    <Panel title="Growth accounting" description={desc}>
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-shelf-text-tertiary">
        {GROWTH_SEGMENTS.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-xs"
              style={{ backgroundColor: `var(${s.varName})` }}
            />
            {s.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const total = r.new_users + r.retained_users + r.resurrected_users + r.churned_users
          return (
            <div key={r.period} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs tabular-nums text-shelf-text-tertiary">
                {fmtDate(r.period)}
              </span>
              <div className="flex h-4 flex-1 overflow-hidden rounded-xs bg-shelf-void/60">
                {GROWTH_SEGMENTS.map((s) =>
                  r[s.key] > 0 ? (
                    <div
                      key={s.key}
                      title={`${s.label}: ${r[s.key]}`}
                      style={{
                        width: `${(r[s.key] / peak) * 100}%`,
                        backgroundColor: `var(${s.varName})`,
                      }}
                    />
                  ) : null
                )}
              </div>
              <span className="w-8 shrink-0 text-right text-xs tabular-nums text-shelf-text-tertiary">
                {fmtNum(total)}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// --- sections -----------------------------------------------------------------

/** The three telemetry lenses. Splitting the 12 panels into focused groups keeps
 *  each view to ~4 panels instead of one long undifferentiated scroll. */
const SECTIONS = [
  { key: 'adoption', label: 'Adoption' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'catalog', label: 'Catalog' },
] as const

type SectionKey = (typeof SECTIONS)[number]['key']

/** Who shows up and whether they stick around: active users, growth, retention,
 *  activation. */
function AdoptionSection({ data }: { data: TelemetryDashboardData }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <ActiveUsersPanel rows={data.activeUsers} />
      </div>
      <GrowthPanel rows={data.growth} />
      <ActivationPanel rows={data.activation} />
      <div className="lg:col-span-2">
        <RetentionPanel rows={data.retention} />
      </div>
    </div>
  )
}

/** What they do once here: the activity timeline, MCP tool calls, and the
 *  browse→install funnel. */
function EngagementSection({ data }: { data: TelemetryDashboardData }) {
  return (
    <div className="space-y-5">
      <Panel
        title="Activity timeline"
        description="Every event by day. Filter by range, event and source; the trend delta compares the second half of the window to the first."
      >
        <EventVolumeExplorer rows={data.eventVolume} />
      </Panel>
      <ToolPerfPanel rows={data.tools} />
      <FunnelPanel rows={data.funnel} />
    </div>
  )
}

/** How the catalog performs: trending + per-skill/pack tables, and the search
 *  terms that surface catalog gaps. */
function CatalogSection({ data }: { data: TelemetryDashboardData }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <TrendingSkillsPanel rows={data.trendingSkills} />
      <TrendingPacksPanel rows={data.trendingPacks} />
      <div className="lg:col-span-2">
        <SkillPerfPanel rows={data.skills} />
      </div>
      <div className="lg:col-span-2">
        <PackPerfPanel rows={data.packs} />
      </div>
      <div className="lg:col-span-2">
        <SearchTermsPanel rows={data.searchTerms} />
      </div>
    </div>
  )
}

// --- root ---------------------------------------------------------------------

export function TelemetryDashboard({
  data,
  adminEmail,
}: {
  data: TelemetryDashboardData
  adminEmail: string
}) {
  const [section, setSection] = useState<SectionKey>('adoption')

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Admin · {adminEmail}
      </p>
      <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">Telemetry</h1>
      <p className="mt-3 max-w-2xl text-sm text-shelf-text-secondary">
        First-party adoption analytics. Rollups refresh every 15 minutes.
        {data.freshness ? ` Data through ${fmtDateTime(data.freshness)}.` : ' No events recorded yet.'}
      </p>

      {/* KPI strip stays pinned above the lens switcher — the at-a-glance summary
          is always in view regardless of which section is open. */}
      <div className="mt-8">
        <KpiHeader
          activeUsers={data.activeUsers}
          eventVolume={data.eventVolume}
          tools={data.tools}
        />
      </div>

      {/* Sticky lens switcher. Sits just under the global header (h-16) so it
          stays reachable while scrolling a long section. */}
      <div className="sticky top-16 z-30 -mx-4 mt-8 border-b border-shelf-border bg-shelf-void/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <SegmentedControl
            options={SECTIONS.map((s) => ({ key: s.key, label: s.label }))}
            value={section}
            onChange={(k) => setSection(k as SectionKey)}
          />
          <p className="hidden text-xs text-shelf-text-tertiary sm:block">
            {section === 'adoption'
              ? 'Acquisition, growth & retention'
              : section === 'engagement'
                ? 'Activity, tools & conversion'
                : 'Skill, pack & search performance'}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {section === 'adoption' ? (
          <AdoptionSection data={data} />
        ) : section === 'engagement' ? (
          <EngagementSection data={data} />
        ) : (
          <CatalogSection data={data} />
        )}
      </div>
    </div>
  )
}
