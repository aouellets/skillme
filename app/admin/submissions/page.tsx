import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminEmail } from '@/lib/admin'
import { getServiceSupabase } from '@/lib/supabase'
import { AdminReview } from '@/components/AdminReview'
import type { SkillSubmission } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Review submissions',
  robots: { index: false, follow: false },
}

async function loadPending(): Promise<SkillSubmission[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('skill_submissions')
    .select('*')
    .in('status', ['pending', 'in_review', 'needs_changes'])
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return []
  return (data ?? []) as SkillSubmission[]
}

export default async function AdminSubmissionsPage() {
  const admin = await getAdminEmail()

  if (!admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-shelf-text-primary">Admin only</h1>
        <p className="mt-3 text-sm text-shelf-text-secondary">
          Sign in with an authorized admin account to review the submission queue.
          Set <code className="font-mono text-accent">ADMIN_EMAILS</code> in the
          environment to grant access.
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          Back home
        </Link>
      </div>
    )
  }

  const submissions = await loadPending()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Admin · {admin}
      </p>
      <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">
        Submission queue
      </h1>
      <p className="mt-3 text-sm text-shelf-text-secondary">
        {submissions.length} awaiting review. Approving publishes the skill to the
        live catalog as verified.
      </p>

      <AdminReview initial={submissions} />
    </div>
  )
}
