'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useFavorites } from './FavoritesProvider'
import type { UserCollection } from '@/lib/types'

/**
 * "Save to collection" dropdown for the skill detail page. Lazily loads the
 * user's collections (and which already contain this skill) on open, toggles
 * membership, and supports inline creation. Reuses FavoritesProvider for the
 * signed-in signal so it doesn't duplicate an auth round-trip.
 */
export function CollectionPicker({ skillId }: { skillId: string }) {
  const { signedIn } = useFavorites()
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState<UserCollection[]>([])
  const [memberOf, setMemberOf] = useState<Set<string>>(new Set())
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function loadAndOpen() {
    if (signedIn === false) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/collections?skill_id=${skillId}`)
      const data = await res.json()
      setCollections(data.collections ?? [])
      setMemberOf(new Set<string>(data.member_of ?? []))
    } catch {
      setError('Could not load your collections.')
    } finally {
      setLoading(false)
    }
  }

  async function toggle(collectionId: string) {
    const isMember = memberOf.has(collectionId)
    const action = isMember ? 'remove' : 'add'
    // Optimistic
    setMemberOf((prev) => {
      const copy = new Set(prev)
      if (isMember) copy.delete(collectionId)
      else copy.add(collectionId)
      return copy
    })
    try {
      const res = await fetch(`/api/collections/${collectionId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: skillId, action }),
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revert
      setMemberOf((prev) => {
        const copy = new Set(prev)
        if (isMember) copy.add(collectionId)
        else copy.delete(collectionId)
        return copy
      })
      setError('Could not update that collection.')
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok || !data.collection) throw new Error(data.error)
      const created = data.collection as UserCollection
      setCollections((prev) => [created, ...prev])
      setNewName('')
      // Add the skill to the freshly created collection.
      await toggle(created.id)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not create the collection.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="card p-5">
      <button
        type="button"
        onClick={loadAndOpen}
        aria-expanded={open}
        className="btn btn-ghost w-full"
      >
        Save to collection {open ? '▲' : '▾'}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {loading ? (
            <p className="text-sm text-shelf-text-tertiary">Loading…</p>
          ) : (
            <>
              {collections.length > 0 ? (
                <ul className="space-y-1">
                  {collections.map((c) => (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1 text-sm text-shelf-text-secondary hover:bg-shelf-elevated">
                        <input
                          type="checkbox"
                          checked={memberOf.has(c.id)}
                          onChange={() => toggle(c.id)}
                          className="accent-accent"
                        />
                        <span className="flex-1 truncate">{c.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-shelf-text-tertiary">No collections yet. Create one:</p>
              )}

              <form onSubmit={create} className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New collection name"
                  maxLength={60}
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-secondary flex-shrink-0" disabled={creating}>
                  {creating ? '…' : 'Add'}
                </button>
              </form>

              {error && <p className="text-xs text-danger">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
