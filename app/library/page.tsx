import Link from 'next/link'
import type { Metadata } from 'next'
import { LibraryTabs } from '@/components/LibraryTabs'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getServiceSupabase } from '@/lib/supabase'
import { getUserCollections } from '@/lib/collections'
import { SITE_URL } from '@/lib/site'
import type { Skill, UserCollection } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Library',
  description: 'The skills you have installed, favorited, and collected on Skill Me.',
}

type InstallRow = { rating: number | null; installed_at: string; skills: Skill | null }
type FavoriteRow = { created_at: string; skills: Skill | null }

/** Drop the heavy skill_content before handing skills to client components. */
function lite(skill: Skill): Omit<Skill, 'skill_content'> {
  const rest = { ...skill }
  delete (rest as Partial<Skill>).skill_content
  return rest
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
          body="Sign in with your email or GitHub to view the skills you've installed, favorited, and collected."
          signIn
        />
      </Shell>
    )
  }

  const userToken = `auth:${user.id}`
  const service = getServiceSupabase()

  let installed: Array<{ skill: Omit<Skill, 'skill_content'>; rating: number | null }> = []
  let favorites: Array<Omit<Skill, 'skill_content'>> = []
  let collections: UserCollection[] = []

  if (service) {
    const [installsRes, favsRes, cols] = await Promise.all([
      service
        .from('user_installs')
        .select('rating, installed_at, skills(*)')
        .eq('user_token', userToken)
        .order('installed_at', { ascending: false }),
      service
        .from('user_favorites')
        .select('created_at, skills(*)')
        .eq('user_token', userToken)
        .order('created_at', { ascending: false }),
      getUserCollections(userToken),
    ])

    installed = ((installsRes.data ?? []) as unknown as InstallRow[])
      .filter((r) => r.skills)
      .map((r) => ({ skill: lite(r.skills!), rating: r.rating }))
    favorites = ((favsRes.data ?? []) as unknown as FavoriteRow[])
      .filter((r) => r.skills)
      .map((r) => lite(r.skills!))
    collections = cols
  }

  return (
    <Shell>
      <LibraryTabs
        installed={installed}
        favorites={favorites}
        collections={collections}
        siteUrl={SITE_URL}
      />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-shelf-text-primary">Your library</h1>
      <p className="mt-3 max-w-xl text-shelf-text-secondary">
        Skills you&apos;ve installed, favorited, and collected on the web. Inside Claude, your
        installed skills load automatically each session.
      </p>
      <div className="mt-8">{children}</div>
    </div>
  )
}

function EmptyCard({
  title,
  body,
  signIn,
}: {
  title: string
  body: string
  signIn?: boolean
}) {
  return (
    <div className="card p-10 text-center">
      <p className="text-shelf-text-primary">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-shelf-text-secondary">{body}</p>
      {signIn && (
        <Link href="/login?next=/library" className="btn btn-primary mt-5">
          Sign in →
        </Link>
      )}
    </div>
  )
}
