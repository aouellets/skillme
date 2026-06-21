import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminEmail } from '@/lib/admin'
import { loadTelemetryDashboard } from '@/lib/telemetry/admin-queries'
import { TelemetryDashboard } from '@/components/admin/TelemetryDashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Telemetry',
  robots: { index: false, follow: false },
}

/**
 * Admin-only telemetry dashboard. The gate is server-side: getAdminEmail()
 * returns null for anon and non-admin users, and we return the "Admin only"
 * fallback BEFORE any rollup is read — so a non-admin never triggers a data
 * fetch. Defense in depth: the rollups are also revoked from anon/authenticated
 * at the DB level (migration 0008), so even a direct query returns nothing.
 */
export default async function AdminTelemetryPage() {
  const admin = await getAdminEmail()

  if (!admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-shelf-text-primary">Admin only</h1>
        <p className="mt-3 text-sm text-shelf-text-secondary">
          Sign in with an authorized admin account to view telemetry. Set{' '}
          <code className="font-mono text-accent">ADMIN_EMAILS</code> in the environment
          to grant access.
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          Back home
        </Link>
      </div>
    )
  }

  const data = await loadTelemetryDashboard()
  return <TelemetryDashboard data={data} adminEmail={admin} />
}
