import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminEmail } from '@/lib/admin'
import { getServiceSupabase } from '@/lib/supabase'
import {
  getActiveUsersDaily,
  getEventVolumeDaily,
  getToolPerformance,
} from '@/lib/telemetry/admin-queries'
import { KpiHeader } from '@/components/admin/TelemetryDashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

/** head-only exact count; null on any failure. `build` refines the query. */
async function count(
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  build?: (q: any) => any
): Promise<number | null> {
  const supabase = getServiceSupabase()
  if (!supabase) return null
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (build) q = build(q)
  const { count: c, error } = await q
  if (error) return null
  return c ?? 0
}

const PENDING = ['pending', 'in_review', 'needs_changes']

async function loadOps() {
  const [pendingSkills, pendingPacks, subscribers, skills, packs] = await Promise.all([
    count('skill_submissions', (q) => q.in('status', PENDING)),
    count('pack_submissions', (q) => q.in('status', PENDING)),
    count('newsletter_signups', (q) => q.is('unsubscribed_at', null)),
    count('skills'),
    count('packs'),
  ])
  return { pendingSkills, pendingPacks, subscribers, skills, packs }
}

function fmt(n: number | null) {
  return n === null ? '—' : n.toLocaleString('en-US')
}

function OpCard({
  label,
  value,
  href,
  cta,
  highlight,
}: {
  label: string
  value: string
  href: string
  cta: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className="card group flex flex-col justify-between gap-3 p-5 transition-colors hover:border-accent/50"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
          {label}
        </p>
        <p
          className={`mt-1 font-display text-3xl ${
            highlight ? 'text-accent' : 'text-shelf-text-primary'
          }`}
        >
          {value}
        </p>
      </div>
      <span className="text-sm text-shelf-text-secondary group-hover:text-accent">{cta} →</span>
    </Link>
  )
}

export default async function AdminOverviewPage() {
  const admin = await getAdminEmail()
  if (!admin) return null // layout already renders the gate; this is defense-in-depth.

  const [ops, activeUsers, eventVolume, tools] = await Promise.all([
    loadOps(),
    getActiveUsersDaily(),
    getEventVolumeDaily(),
    getToolPerformance(),
  ])

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Admin · {admin}
      </p>
      <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">Overview</h1>
      <p className="mt-3 text-sm text-shelf-text-secondary">
        Operational status and the last 7 days of product activity.{' '}
        <Link href="/admin/telemetry" className="text-accent hover:text-accent-hover">
          Full telemetry →
        </Link>
      </p>

      <div className="mt-8">
        <KpiHeader activeUsers={activeUsers} eventVolume={eventVolume} tools={tools} />
      </div>

      <h2 className="mt-10 font-display text-xl text-shelf-text-primary">Operations</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OpCard
          label="Skill queue"
          value={fmt(ops.pendingSkills)}
          href="/admin/submissions"
          cta="Review submissions"
          highlight={(ops.pendingSkills ?? 0) > 0}
        />
        <OpCard
          label="Pack queue"
          value={fmt(ops.pendingPacks)}
          href="/admin/packs"
          cta="Review packs"
          highlight={(ops.pendingPacks ?? 0) > 0}
        />
        <OpCard
          label="Newsletter subs"
          value={fmt(ops.subscribers)}
          href="/admin/telemetry"
          cta="Active subscribers"
        />
        <OpCard
          label="Catalog"
          value={`${fmt(ops.skills)} / ${fmt(ops.packs)}`}
          href="/browse"
          cta="Skills / packs live"
        />
      </div>
    </div>
  )
}
