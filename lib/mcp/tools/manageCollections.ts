import {
  getUserCollections,
  createCollection,
  addSkillToCollection,
  removeSkillFromCollection,
  setCollectionPublic,
  deleteCollection,
} from '../../collections'
import { text, type Tool } from '../types'
import { SITE_URL } from '../../site'

interface CollectionArgs {
  action: 'list' | 'create' | 'add_skill' | 'remove_skill' | 'share' | 'delete'
  collection_id?: string
  collection_name?: string
  collection_description?: string
  skill_id?: string
  public?: boolean
}

export const manageCollections: Tool<CollectionArgs> = {
  definition: {
    name: 'manage_collection',
    description:
      "Manage the user's personal skill collections — named shelves of hand-picked skills. Actions: list (show all collections), create (new collection), add_skill (add a skill to a collection), remove_skill (remove a skill), share (make a collection public and get a shareable link), delete (remove a collection).",
    inputSchema: {
      type: 'object',
      required: ['action'],
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'create', 'add_skill', 'remove_skill', 'share', 'delete'],
          description: 'What to do',
        },
        collection_id: { type: 'string', description: 'UUID of the collection (required for most actions)' },
        collection_name: { type: 'string', description: 'Name for a new collection (required for create)' },
        collection_description: { type: 'string', description: 'Optional description for create' },
        skill_id: { type: 'string', description: 'Skill UUID (required for add_skill and remove_skill)' },
        public: { type: 'boolean', description: 'Set to true to make the collection shareable (for share action)' },
      },
    },
  },
  async handler(args, ctx) {
    const siteUrl = SITE_URL

    switch (args.action) {
      case 'list': {
        const collections = await getUserCollections(ctx.userToken)
        if (collections.length === 0) {
          return text('You have no collections yet. Say "create a collection called My Stack" to make one.')
        }
        const lines = collections.map((c, i) =>
          `${i + 1}. ${c.name}${c.public ? ' · public' : ' · private'} · ${c.skill_count ?? 0} skills\n   id: ${c.id}`
        )
        return text(`Your collections:\n\n${lines.join('\n\n')}`)
      }

      case 'create': {
        if (!args.collection_name?.trim()) {
          return text('A collection name is required.', true)
        }
        const collection = await createCollection(ctx.userToken, args.collection_name.trim(), args.collection_description)
        if (!collection) return text('Could not create the collection.', true)
        return text(
          `Created collection "${collection.name}".\n\nCollection id: ${collection.id}\n\nAdd skills with: add_skill action and the skill_id from browse_skills.`
        )
      }

      case 'add_skill': {
        if (!args.collection_id) return text('A collection_id is required.', true)
        if (!args.skill_id) return text('A skill_id is required.', true)
        const ok = await addSkillToCollection(args.collection_id, args.skill_id, ctx.userToken)
        return ok
          ? text('Skill added to collection.')
          : text('Could not add the skill. Check the collection_id belongs to you.', true)
      }

      case 'remove_skill': {
        if (!args.collection_id) return text('A collection_id is required.', true)
        if (!args.skill_id) return text('A skill_id is required.', true)
        const ok = await removeSkillFromCollection(args.collection_id, args.skill_id, ctx.userToken)
        return ok ? text('Skill removed from collection.') : text('Could not remove the skill.', true)
      }

      case 'share': {
        if (!args.collection_id) return text('A collection_id is required.', true)
        const isPublic = args.public !== false // default to true for share action
        const shareToken = await setCollectionPublic(args.collection_id, ctx.userToken, isPublic)
        if (!shareToken) return text('Could not update the collection.', true)
        if (!isPublic) return text('Collection is now private.')
        return text(
          `Collection is now public. Share this link:\n${siteUrl}/collection/${shareToken}`
        )
      }

      case 'delete': {
        if (!args.collection_id) return text('A collection_id is required.', true)
        const ok = await deleteCollection(args.collection_id, ctx.userToken)
        return ok ? text('Collection deleted.') : text('Could not delete the collection.', true)
      }

      default:
        return text('Unknown action. Valid actions: list, create, add_skill, remove_skill, share, delete.', true)
    }
  },
}
