'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SkillCard } from './SkillCard'
import type { Skill, UserCollection } from '@/lib/types'

type InstalledItem = { skill: Omit<Skill, 'skill_content'>; rating: number | null }
type Tab = 'installed' | 'favorites' | 'collections'

export function LibraryTabs({
  installed,
  favorites,
  collections,
  siteUrl,
}: {
  installed: InstalledItem[]
  favorites: Array<Omit<Skill, 'skill_content'>>
  collections: UserCollection[]
  siteUrl: string
}) {
  const [tab, setTab] = useState<Tab>('installed')

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: 'installed', label: 'Installed', count: installed.length },
    { key: 'favorites', label: 'Favorites', count: favorites.length },
    { key: 'collections', label: 'Collections', count: collections.length },
  ]

  return (
    <div>
      <div className="flex gap-1 border-b border-shelf-border" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors ${
              tab === t.key
                ? 'border-accent text-shelf-text-primary'
                : 'border-transparent text-shelf-text-tertiary hover:text-shelf-text-secondary'
            }`}
          >
            {t.label}
            <span className="ml-1.5 font-mono text-xs text-shelf-text-tertiary">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'installed' && (
          <Grid empty="Rate or install skills and they'll show up here.">
            {installed.map((item) => (
              <div key={item.skill.id} className="flex flex-col gap-1">
                <SkillCard skill={item.skill} />
                {item.rating ? (
                  <p className="px-1 font-mono text-xs text-shelf-text-tertiary">
                    Your rating: <span className="text-accent">{'★'.repeat(item.rating)}</span>
                  </p>
                ) : null}
              </div>
            ))}
          </Grid>
        )}

        {tab === 'favorites' && (
          <Grid empty="Tap the heart on any skill to save it here.">
            {favorites.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </Grid>
        )}

        {tab === 'collections' && (
          <CollectionsTab collections={collections} siteUrl={siteUrl} />
        )}
      </div>
    </div>
  )
}

function Grid({ children, empty }: { children: React.ReactNode[]; empty: string }) {
  if (children.length === 0) {
    return <p className="card p-10 text-center text-sm text-shelf-text-secondary">{empty}</p>
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  )
}

function CollectionsTab({
  collections: initial,
  siteUrl,
}: {
  collections: UserCollection[]
  siteUrl: string
}) {
  const [collections, setCollections] = useState(initial)
  const [busy, setBusy] = useState<string | null>(null)

  async function toggleShare(c: UserCollection) {
    setBusy(c.id)
    try {
      const res = await fetch(`/api/collections/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public: !c.public }),
      })
      const data = await res.json()
      if (res.ok) {
        setCollections((prev) =>
          prev.map((x) =>
            x.id === c.id
              ? { ...x, public: data.public, share_token: data.share_token ?? x.share_token }
              : x
          )
        )
      }
    } finally {
      setBusy(null)
    }
  }

  async function remove(c: UserCollection) {
    if (!confirm(`Delete the collection "${c.name}"? This can't be undone.`)) return
    setBusy(c.id)
    try {
      const res = await fetch(`/api/collections/${c.id}`, { method: 'DELETE' })
      if (res.ok) setCollections((prev) => prev.filter((x) => x.id !== c.id))
    } finally {
      setBusy(null)
    }
  }

  if (collections.length === 0) {
    return (
      <p className="card p-10 text-center text-sm text-shelf-text-secondary">
        You haven&apos;t created any collections yet. Open any skill and use{' '}
        <span className="text-shelf-text-primary">Save to collection</span> to start one.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {collections.map((c) => (
        <li key={c.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-shelf-text-primary">{c.name}</p>
            <p className="font-mono text-xs text-shelf-text-tertiary">
              {c.skill_count ?? 0} skill{(c.skill_count ?? 0) === 1 ? '' : 's'} ·{' '}
              {c.public ? 'Public' : 'Private'}
            </p>
            {c.public && (
              <a
                href={`${siteUrl}/collection/${c.share_token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-xs text-accent hover:text-accent-hover"
              >
                {siteUrl}/collection/{c.share_token}
              </a>
            )}
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              onClick={() => toggleShare(c)}
              disabled={busy === c.id}
              className="btn btn-ghost"
            >
              {c.public ? 'Make private' : 'Share'}
            </button>
            <button
              type="button"
              onClick={() => remove(c)}
              disabled={busy === c.id}
              className="btn btn-ghost text-danger"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
