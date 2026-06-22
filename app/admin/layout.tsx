import Link from 'next/link'
import { getAdminEmail } from '@/lib/admin'
import { AdminTabs } from '@/components/admin/AdminTabs'

export const dynamic = 'force-dynamic'

/**
 * Shared shell for every /admin route. Gates the whole section once
 * (getAdminEmail() is null for anon / non-admin) and renders the sub-nav for
 * admins. This is the visibility/UX gate; the security boundaries stay per-page
 * (data fetches behind getAdminEmail) and at the DB (rollups + privileged tables
 * revoked from anon/authenticated). Each page keeps its own gate as defense.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminEmail()

  if (!admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-shelf-text-primary">Admin only</h1>
        <p className="mt-3 text-sm text-shelf-text-secondary">
          Sign in with an authorized admin account. Set{' '}
          <code className="font-mono text-accent">ADMIN_EMAILS</code> in the environment to
          grant access.
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <AdminTabs />
      {children}
    </div>
  )
}
