import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SkillCard } from '@/components/SkillCard'
import { getCollectionByShareToken } from '@/lib/collections'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareToken: string }>
}): Promise<Metadata> {
  const { shareToken } = await params
  const collection = await getCollectionByShareToken(shareToken)
  if (!collection) return { title: 'Collection not found' }
  return {
    title: collection.name,
    description: collection.description ?? `A skill collection on SkillShelf — ${collection.skill_count ?? 0} skills.`,
  }
}

export default async function SharedCollectionPage({
  params,
}: {
  params: Promise<{ shareToken: string }>
}) {
  const { shareToken } = await params
  const collection = await getCollectionByShareToken(shareToken)
  if (!collection) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-2 text-sm text-shelf-text-tertiary">
        <Link href="/browse" className="transition-colors hover:text-shelf-text-secondary">Browse</Link>
        <span>/</span>
        <span className="text-shelf-text-secondary">Shared collection</span>
      </nav>

      <header className="mt-6">
        <span className="inline-flex items-center gap-1 rounded border border-shelf-border bg-shelf-surface px-2.5 py-1 font-mono text-xs text-shelf-text-tertiary">
          Community collection
        </span>
        <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">{collection.name}</h1>
        {collection.description && (
          <p className="mt-2 text-lg text-shelf-text-secondary">{collection.description}</p>
        )}
        <p className="mt-2 font-mono text-sm text-shelf-text-tertiary">
          {collection.skill_count ?? 0} skills
        </p>
      </header>

      {(!collection.skills || collection.skills.length === 0) ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-shelf-text-secondary">This collection is empty.</p>
          <Link href="/browse" className="btn btn-secondary mt-4">Browse skills →</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      <div className="card mt-8 p-5">
        <p className="text-sm text-shelf-text-secondary">
          Want to install all skills in this collection? Connect the SkillShelf MCP and say:
        </p>
        <p className="mt-2 font-mono text-sm text-shelf-text-primary">
          &quot;Install all skills from collection {collection.name}&quot;
        </p>
        <Link href="/connect" className="btn btn-primary mt-4">
          Connect to Claude →
        </Link>
      </div>
    </div>
  )
}
