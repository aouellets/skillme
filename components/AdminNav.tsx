import 'server-only'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'

/**
 * Desktop-only admin entry point in the top nav. Renders the Telemetry tab ONLY
 * for an authenticated admin (server-side isAdmin() check); everyone else gets
 * null. This is a VISIBILITY gate, not the security boundary — the real
 * enforcement lives on /admin/telemetry (server-side gate) and at the DB
 * (rollups revoked from anon/authenticated). Hidden below lg so the mobile
 * header stays focused (admin is desktop-only by design).
 */
export async function AdminNav() {
  if (!(await isAdmin())) return null
  return (
    <Link
      href="/admin"
      className="hidden rounded-sm px-2.5 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary sm:px-3 lg:inline-flex"
    >
      Admin
    </Link>
  )
}
