'use client'

import { useMemo, useState } from 'react'
import type { UserDirectoryRow } from '@/lib/telemetry/admin-queries'
import { SegmentedControl, SortableTable, type Column } from './interactive'
import { fmtNum, fmtDate, fmtRelative } from './format'

/** ISO-3166 alpha-2 → regional-indicator flag emoji. '' when not a 2-letter code. */
function flag(cc: string | null | undefined): string {
  if (!cc || cc.length !== 2 || !/^[a-zA-Z]{2}$/.test(cc)) return ''
  const base = 0x1f1e6
  return String.fromCodePoint(
    ...[...cc.toUpperCase()].map((c) => base + c.charCodeAt(0) - 65)
  )
}

/** "San Francisco, CA · US" from the coarse geo parts. '—' when nothing known. */
function placeLabel(city: string | null, region: string | null, country: string | null): string {
  const parts = [city, region].filter(Boolean)
  const head = parts.join(', ')
  if (head && country) return `${head} · ${country}`
  return head || country || '—'
}

/** A hover tooltip with the captured lat/lng, or undefined when not located. */
function coordTitle(lat: number | null, lng: number | null): string | undefined {
  return lat != null && lng != null ? `~${lat}, ${lng}` : undefined
}

const KIND_LABEL: Record<UserDirectoryRow['actor_kind'], string> = {
  account: 'Account',
  mcp_anon: 'MCP connector',
  web_anon: 'Web visitor',
}

const KIND_STYLE: Record<UserDirectoryRow['actor_kind'], string> = {
  account: 'bg-accent/15 text-accent',
  mcp_anon: 'bg-shelf-text-tertiary/15 text-shelf-text-secondary',
  web_anon: 'bg-shelf-text-tertiary/10 text-shelf-text-tertiary',
}

/** Actor-kind filter for the sticky toolbar. `all` keeps every row. */
const KIND_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'account', label: 'Accounts' },
  { key: 'mcp_anon', label: 'MCP' },
  { key: 'web_anon', label: 'Web' },
] as const

type KindFilter = (typeof KIND_FILTERS)[number]['key']

function shortId(value: string | null): string {
  if (!value) return '—'
  // Strip a leading "anon:"/"mcp_"/"auth:" marker then show a short, stable head.
  const bare = value.replace(/^(anon:|mcp_|auth:)/, '')
  return bare.length > 14 ? `${bare.slice(0, 8)}…${bare.slice(-4)}` : bare
}

/** The human label for an actor: email/name for accounts, a short token otherwise. */
function identity(row: UserDirectoryRow): { primary: string; secondary: string | null } {
  if (row.email) return { primary: row.email, secondary: row.name }
  if (row.name) return { primary: row.name, secondary: row.user_id ? shortId(row.user_id) : null }
  if (row.actor_kind === 'account') return { primary: shortId(row.user_id), secondary: 'account' }
  return { primary: shortId(row.user_token ?? row.anonymous_id), secondary: null }
}

export function UserDirectory({
  rows,
  adminEmail,
}: {
  rows: UserDirectoryRow[]
  adminEmail: string
}) {
  const [kind, setKind] = useState<KindFilter>('all')

  const stats = useMemo(() => {
    const accounts = rows.filter((r) => r.actor_kind === 'account').length
    const located = rows.filter((r) => r.last_country).length
    const countries = new Set(rows.map((r) => r.last_country).filter(Boolean)).size
    return { total: rows.length, accounts, located, countries }
  }, [rows])

  const filtered = useMemo(
    () => (kind === 'all' ? rows : rows.filter((r) => r.actor_kind === kind)),
    [rows, kind]
  )

  const columns: Column<UserDirectoryRow>[] = [
    {
      key: 'identity',
      label: 'User',
      render: (r) => {
        const id = identity(r)
        return (
          <div className="flex flex-col">
            <span className="font-mono text-xs text-shelf-text-primary">{id.primary}</span>
            <span className="mt-0.5 flex items-center gap-1.5">
              <span
                className={`rounded px-1.5 py-px text-[0.6rem] uppercase tracking-wide ${KIND_STYLE[r.actor_kind]}`}
              >
                {KIND_LABEL[r.actor_kind]}
              </span>
              {id.secondary && (
                <span className="text-[0.7rem] text-shelf-text-tertiary">{id.secondary}</span>
              )}
            </span>
          </div>
        )
      },
      sortValue: (r) => identity(r).primary.toLowerCase(),
    },
    {
      key: 'location',
      label: 'Active from',
      render: (r) => (
        <span className="text-shelf-text-secondary" title={coordTitle(r.last_lat, r.last_lng)}>
          {flag(r.last_country) && <span className="mr-1">{flag(r.last_country)}</span>}
          {placeLabel(r.last_city, r.last_region, r.last_country)}
        </span>
      ),
      sortValue: (r) => `${r.last_country ?? '~'}${r.last_region ?? ''}${r.last_city ?? ''}`,
    },
    {
      key: 'signup',
      label: 'Signed up from',
      render: (r) =>
        r.signup_at ? (
          <span className="text-shelf-text-secondary" title={coordTitle(r.signup_lat, r.signup_lng)}>
            {flag(r.signup_country) && <span className="mr-1">{flag(r.signup_country)}</span>}
            {placeLabel(r.signup_city, r.signup_region, r.signup_country)}
            <span className="ml-1 text-[0.7rem] text-shelf-text-tertiary">
              {fmtDate(r.signup_at)}
            </span>
          </span>
        ) : (
          <span className="text-shelf-text-tertiary">—</span>
        ),
      sortValue: (r) => r.signup_at ?? '',
    },
    {
      key: 'first_seen',
      label: 'First seen',
      align: 'right',
      render: (r) => <span className="text-shelf-text-secondary">{fmtDate(r.first_seen_at)}</span>,
      sortValue: (r) => r.first_seen_at,
      defaultDesc: true,
    },
    {
      key: 'last_seen',
      label: 'Last seen',
      align: 'right',
      render: (r) => <span className="text-shelf-text-secondary">{fmtRelative(r.last_seen_at)}</span>,
      sortValue: (r) => r.last_seen_at,
      defaultDesc: true,
    },
    {
      key: 'events',
      label: 'Events',
      align: 'right',
      render: (r) => <span className="font-mono text-shelf-text-primary">{fmtNum(r.total_events)}</span>,
      sortValue: (r) => r.total_events,
      defaultDesc: true,
    },
    {
      key: 'tools',
      label: 'Tools',
      align: 'right',
      render: (r) => <span className="font-mono text-shelf-text-secondary">{fmtNum(r.tool_invocations)}</span>,
      sortValue: (r) => r.tool_invocations,
      defaultDesc: true,
    },
    {
      key: 'installs',
      label: 'Installs',
      align: 'right',
      render: (r) => <span className="font-mono text-shelf-text-secondary">{fmtNum(r.installs)}</span>,
      sortValue: (r) => r.installs,
      defaultDesc: true,
    },
    {
      key: 'activations',
      label: 'Active uses',
      align: 'right',
      render: (r) => <span className="font-mono text-shelf-text-secondary">{fmtNum(r.activations)}</span>,
      sortValue: (r) => r.activations,
      defaultDesc: true,
    },
  ]

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
          Admin · {adminEmail}
        </p>
        <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">Users</h1>
        <p className="mt-3 max-w-2xl text-sm text-shelf-text-secondary">
          Every resolved actor — accounts and anonymous connectors — with coarse geography and
          signup origin. Emails are read live from auth.users; nothing here is stored as PII in
          telemetry.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Actors" value={fmtNum(stats.total)} sub="resolved identities" />
        <StatCard label="Accounts" value={fmtNum(stats.accounts)} sub="signed-in users" />
        <StatCard label="Located" value={fmtNum(stats.located)} sub="with coarse geography" />
        <StatCard label="Countries" value={fmtNum(stats.countries)} sub="distinct, by last seen" />
      </div>

      {/* Sticky toolbar: the actor-kind filter stays reachable while scrolling
          the directory. top-16 clears the global header; bleed margins span the
          page gutter. */}
      <div className="sticky top-16 z-20 -mx-4 mt-8 border-b border-shelf-border bg-shelf-void/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl
            options={KIND_FILTERS.map((k) => ({ key: k.key, label: k.label }))}
            value={kind}
            onChange={(k) => setKind(k as KindFilter)}
          />
          <span className="font-mono text-xs text-shelf-text-tertiary">
            {fmtNum(filtered.length)} {kind === 'all' ? 'actors' : KIND_LABEL[kind].toLowerCase() + 's'}
          </span>
        </div>
      </div>

      <div className="mt-5 card p-2 sm:p-3">
        <SortableTable
          rows={filtered}
          columns={columns}
          getKey={(r) => r.actor_key}
          searchAccessor={(r) =>
            [
              r.email,
              r.name,
              r.user_token,
              r.anonymous_id,
              r.last_country,
              r.last_region,
              r.last_city,
              r.signup_country,
              r.actor_kind,
            ]
              .filter(Boolean)
              .join(' ')
          }
          searchPlaceholder="Filter by email, name, token, country…"
          initialSortKey="last_seen"
          emptyMessage="No telemetry actors match this filter."
          maxRows={12}
        />
      </div>
    </div>
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
