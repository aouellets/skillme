import 'server-only'
import { getServiceSupabase } from './supabase'
import type { UserCollection } from './types'

/** Slugify a collection name for the URL. */
function slugifyCollection(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
  return `${base}-${id.slice(0, 6)}`
}

export async function getUserCollections(userToken: string): Promise<UserCollection[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('user_collections')
    .select(`
      *,
      collection_skills(count)
    `)
    .eq('user_token', userToken)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[getUserCollections] error:', error.message)
    return []
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((c) => ({
    ...c,
    skill_count: Array.isArray(c.collection_skills)
      ? (c.collection_skills[0] as { count: number })?.count ?? 0
      : 0,
  })) as UserCollection[]
}

export async function getCollectionByShareToken(
  shareToken: string
): Promise<UserCollection | null> {
  const supabase = getServiceSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('user_collections')
    .select(`
      *,
      collection_skills(
        position,
        skills(*)
      )
    `)
    .eq('share_token', shareToken)
    .eq('public', true)
    .single()

  if (error || !data) return null

  const skills = ((data as Record<string, unknown>).collection_skills as Array<{ position: number; skills: unknown }>)
    ?.sort((a, b) => a.position - b.position)
    .map((cs) => cs.skills)
    .filter(Boolean) ?? []

  return { ...data, skills, skill_count: skills.length } as unknown as UserCollection
}

export async function createCollection(
  userToken: string,
  name: string,
  description?: string
): Promise<UserCollection | null> {
  const supabase = getServiceSupabase()
  if (!supabase) return null

  const id = crypto.randomUUID()
  const slug = slugifyCollection(name, id)

  const { data, error } = await supabase
    .from('user_collections')
    .insert({
      id,
      user_token: userToken,
      slug,
      name,
      description: description ?? null,
      public: false,
    })
    .select()
    .single()

  if (error) {
    console.error('[createCollection] error:', error.message)
    return null
  }

  return data as unknown as UserCollection
}

export async function addSkillToCollection(
  collectionId: string,
  skillId: string,
  userToken: string
): Promise<boolean> {
  const supabase = getServiceSupabase()
  if (!supabase) return false

  // Verify the collection belongs to this user
  const { data: col } = await supabase
    .from('user_collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_token', userToken)
    .single()
  if (!col) return false

  // Get current max position
  const { data: existing } = await supabase
    .from('collection_skills')
    .select('position')
    .eq('collection_id', collectionId)
    .order('position', { ascending: false })
    .limit(1)

  const position = ((existing?.[0] as { position: number } | undefined)?.position ?? -1) + 1

  const { error } = await supabase
    .from('collection_skills')
    .upsert({ collection_id: collectionId, skill_id: skillId, position }, { onConflict: 'collection_id,skill_id' })
  if (error) console.error('[addSkillToCollection] error:', error.message)

  // Update collection timestamp
  await supabase
    .from('user_collections')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', collectionId)

  return !error
}

export async function removeSkillFromCollection(
  collectionId: string,
  skillId: string,
  userToken: string
): Promise<boolean> {
  const supabase = getServiceSupabase()
  if (!supabase) return false

  const { data: col } = await supabase
    .from('user_collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_token', userToken)
    .single()
  if (!col) return false

  const { error } = await supabase
    .from('collection_skills')
    .delete()
    .eq('collection_id', collectionId)
    .eq('skill_id', skillId)

  return !error
}

export async function setCollectionPublic(
  collectionId: string,
  userToken: string,
  isPublic: boolean
): Promise<string | null> {
  const supabase = getServiceSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('user_collections')
    .update({ public: isPublic, updated_at: new Date().toISOString() })
    .eq('id', collectionId)
    .eq('user_token', userToken)
    .select('share_token')
    .single()

  if (error || !data) return null
  return (data as { share_token: string }).share_token
}

export async function deleteCollection(collectionId: string, userToken: string): Promise<boolean> {
  const supabase = getServiceSupabase()
  if (!supabase) return false

  const { error } = await supabase
    .from('user_collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_token', userToken)

  return !error
}
