import { getPacks } from '../../packs'
import { formatInstalls } from '../../categories'
import { text, type Tool } from '../types'

interface BrowsePacksArgs {
  query?: string
  category?: string
  limit?: number
}

export const browsePacks: Tool<BrowsePacksArgs> = {
  definition: {
    name: 'browse_packs',
    annotations: { title: 'Browse packs', readOnlyHint: true },
    description:
      'Browse curated skill packs — themed bundles of multiple skills that install together. Use when the user wants a set of related skills for a specific role or workflow (e.g. "marketing skills", "startup pack", "engineering workflow").',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        category: {
          type: 'string',
          enum: ['coding', 'writing', 'research', 'productivity', 'data', 'design', 'business', 'personal', 'mixed'],
          description: 'Filter by category',
        },
        limit: { type: 'number', description: 'Number of results (default 5, max 10)' },
      },
    },
  },
  async handler(args) {
    const limit = Math.min(Math.max(args.limit ?? 5, 1), 10)
    const { packs } = await getPacks({ query: args.query, category: args.category as never, limit })

    if (packs.length === 0) {
      return text('No packs found. Try browsing individual skills with browse_skills instead.')
    }

    const lines = packs.map((p, i) => [
      `${i + 1}. ${p.name}${p.verified ? ' · verified' : ''}`,
      `   ${p.tagline}`,
      `   ${p.skill_count ?? '?'} skills · ${formatInstalls(p.install_count)} installs · ${p.category}`,
      `   pack_id: ${p.id}`,
    ].join('\n'))

    return text(
      `Found ${packs.length} pack${packs.length === 1 ? '' : 's'}:\n\n${lines.join('\n\n')}\n\nTo install a pack and all its skills, call install_pack with its pack_id.`
    )
  },
}
