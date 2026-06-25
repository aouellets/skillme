import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminEmail } from '@/lib/admin'
import { getGeoAdoption } from '@/lib/telemetry/admin-queries'
import { GeographyDashboard } from '@/components/admin/GeographyDashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Adoption',
  robots: { index: false, follow: false },
}

/**
 * Admin-only geographic adoption map. Same gate as /admin/telemetry: the
 * server-side getAdminEmail() returns null for anon/non-admin and we bail BEFORE
 * any read — so a non-admin never triggers a data fetch. Defense in depth:
 * mv_geo_adoption is also revoked from anon/authenticated (migration 0021), so
 * even a direct query returns nothing.
 */
export default async function AdminGeographyPage() {
  const admin = await getAdminEmail()

  if (!admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-shelf-text-primary">Admin only</h1>
        <p className="mt-3 text-sm text-shelf-text-secondary">
          Sign in with an authorized admin account to view adoption geography. Set{' '}
          <code className="font-mono text-accent">ADMIN_EMAILS</code> in the environment to grant
          access.
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          Back home
        </Link>
      </div>
    )
  }

  const rows = await getGeoAdoption()
  return <GeographyDashboard rows={rows} adminEmail={admin} />
}
