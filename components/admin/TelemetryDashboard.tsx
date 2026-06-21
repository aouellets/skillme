import type {
  ActiveUsersDailyRow,
  ActivationRow,
  FunnelRow,
  GrowthRow,
  PackPerfRow,
  RetentionRow,
  SkillPerfRow,
  TelemetryDashboardData,
} from '@/lib/telemetry/admin-queries'

/**
 * Server-rendered, dependency-free telemetry dashboard. No charting library:
 * the data volume is tiny and everything stays a Server Component. Colors come
 * from the shelf-* theme tokens (no arbitrary Tailwind values); the only inline
 * styles are data-driven dimensions (bar widths, heatmap intensity) that a
 * utility class cannot express, and even those reference CSS theme variables.
 */

// --- formatting ---------------------------------------------------------------

const fmtNum = (n: number) => n.toLocaleString('en-US')
const fmtPct = (r: number | null | undefined) =>
  r === null || r === undefined ? '—' : `${Math.round(r * 100)}%`
const fmtRating = (r: number | null) => (r === null ? '—' : r.toFixed(2))
const fmtHours = (h: number | null) =>
  h === null ? '—' : h < 48 ? `${h.toFixed(1)}h` : `${(h / 24).toFixed(1)}d`
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
const clampPct = (r: number) => `${Math.max(0, Math.min(100, Math.round(r * 100)))}%`

// --- primitives ---------------------------------------------------------------

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

// --- panels -------------------------------------------------------------------

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

  // DAU trend: sum across sources per day, oldest→newest, last 30 days.
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
                        // Heat intensity is data-driven (cannot be a utility class);
                        // color-mix keeps the hue sourced from the theme accent token.
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
              <div
                className="h-full rounded-xs bg-accent"
                style={{ width: clampPct(r.pct_of_top) }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function SkillPerfPanel({ rows }: { rows: SkillPerfRow[] }) {
  const desc = 'Per skill: installs, uninstalls, distinct activators, rating, install→activation.'
  if (rows.length === 0) {
    return (
      <Panel title="Skill performance" description={desc}>
        <EmptyState message="No skill activity yet." />
      </Panel>
    )
  }
  return (
    <Panel title="Skill performance" description={desc}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Skill</Th>
              <Th right>Installs</Th>
              <Th right>Uninstalls</Th>
              <Th right>Activators</Th>
              <Th right>Rating</Th>
              <Th right>Inst→Act</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.skill_id}>
                <Td>{r.skill_name}</Td>
                <Td right>{fmtNum(r.installs)}</Td>
                <Td right>{fmtNum(r.uninstalls)}</Td>
                <Td right>{fmtNum(r.activating_users)}</Td>
                <Td right>
                  {fmtRating(r.avg_rating)}
                  {r.ratings > 0 ? ` (${r.ratings})` : ''}
                </Td>
                <Td right>{fmtPct(r.install_to_activation_rate)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  return (
    <Panel title="Pack performance" description={desc}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Pack</Th>
              <Th right>Installs</Th>
              <Th right>Installers</Th>
              <Th right>Skill activations</Th>
              <Th right>Activating users</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pack_id}>
                <Td>{r.pack_name}</Td>
                <Td right>{fmtNum(r.installs)}</Td>
                <Td right>{fmtNum(r.distinct_installers)}</Td>
                <Td right>{fmtNum(r.derived_skill_activations)}</Td>
                <Td right>{fmtNum(r.distinct_activating_users)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

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

// --- root ---------------------------------------------------------------------

export function TelemetryDashboard({
  data,
  adminEmail,
}: {
  data: TelemetryDashboardData
  adminEmail: string
}) {
  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Admin · {adminEmail}
      </p>
      <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">Telemetry</h1>
      <p className="mt-3 text-sm text-shelf-text-secondary">
        First-party adoption analytics. Rollups refresh every 15 minutes.
        {data.freshness ? ` Data through ${fmtDateTime(data.freshness)}.` : ' No events recorded yet.'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <ActiveUsersPanel rows={data.activeUsers} />
        </div>
        <FunnelPanel rows={data.funnel} />
        <GrowthPanel rows={data.growth} />
        <ActivationPanel rows={data.activation} />
        <div className="lg:col-span-2">
          <RetentionPanel rows={data.retention} />
        </div>
        <SkillPerfPanel rows={data.skills} />
        <PackPerfPanel rows={data.packs} />
      </div>
    </div>
  )
}
