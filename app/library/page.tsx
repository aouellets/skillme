import Link from 'next/link'
import type { Metadata } from 'next'
import { SkillCard } from '@/components/SkillCard'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getServiceSupabase } from '@/lib/supabase'
import type { Skill } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Library',
  description: 'The skills you have installed and rated on SkillShelf.',
}

type InstallRow = {
  rating: number | null
  installed_at: string
  skills: Skill | null
}

export default async function LibraryPage() {
  const auth = await createSupabaseServerClient()
  const user = auth ? (await auth.auth.getUser()).data.user : null

  if (!auth) {
    return (
      <Shell>
        <EmptyCard
          title="Sign-in isn't configured"
          body="Authentication isn't set up on this deployment yet. Your installed skills still load automatically inside Claude."
        />
      </Shell>
    )
  }

  if (!user) {
    return (
      <Shell>
        <EmptyCard
          title="Sign in to see your library"
          body="Use the Sign in button in the top bar to connect your GitHub account and view the skills you've installed and rated here."
        />
      </Shell>
    )
  }

  const service = getServiceSupabase()
  let rows: InstallRow[] = []
  if (service) {
    const { data } = await service
      .from('user_installs')
      .select('rating, installed_at, skills(*)')
      .eq('user_token', `auth:${user.id}`)
      .order('installed_at', { ascending: false })
    rows = (data ?? []) as unknown as InstallRow[]
  }

  const items = rows.filter((r) => r.skills)

  return (
    <Shell>
      {items.length === 0 ? (
        <EmptyCard
          title="Your library is empty"
          body="Rate or install skills and they'll show up here."
          cta
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <div key={r.skills!.id} className="flex flex-col gap-1">
              <SkillCard skill={r.skills!} />
              {r.rating ? (
                <p className="px-1 font-mono text-xs text-shelf-text-tertiary">
                  Your rating: <span className="text-accent">{'★'.repeat(r.rating)}</span>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-shelf-text-primary">Your library</h1>
      <p className="mt-2 text-shelf-text-secondary">
        Skills you&apos;ve installed and rated on the web. Inside Claude, your installed
        skills load automatically each session.
      </p>
      <div className="mt-8">{children}</div>
    </div>
  )
}

function EmptyCard({ title, body, cta }: { title: string; body: string; cta?: boolean }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-shelf-text-primary">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-shelf-text-secondary">{body}</p>
      {cta && (
        <Link href="/browse" className="btn btn-secondary mt-5">
          Browse skills →
        </Link>
      )}
    </div>
  )
}
