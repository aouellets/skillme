import { getSkills } from '../../data'
import { formatInstalls, isCategory } from '../../categories'
import { text, type Tool } from '../types'

interface BrowseArgs {
  query?: string
  category?: string
  limit?: number
  featured?: boolean
}

export const browseSkills: Tool<BrowseArgs> = {
  definition: {
    name: 'browse_skills',
    description:
      'Browse and search the SkillShelf catalog. Returns skills matching the query with name, description, category, install count, and skill_id. Use this when the user wants to discover, find, or explore Claude skills.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query — what the skill should help with',
        },
        category: {
          type: 'string',
          enum: [
            'coding',
            'writing',
            'research',
            'productivity',
            'data',
            'design',
            'business',
            'personal',
          ],
          description: 'Filter by category (optional)',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return (default 5, max 10)',
        },
        featured: {
          type: 'boolean',
          description: 'Return only featured/curated skills',
        },
      },
    },
  },
  async handler(args) {
    const limit = Math.min(Math.max(args.limit ?? 5, 1), 10)
    const category =
      args.category && isCategory(args.category) ? args.category : undefined

    const { skills } = await getSkills({
      query: args.query,
      category,
      featured: args.featured,
      sort: 'trending',
      limit,
    })

    if (skills.length === 0) {
      const what = args.query ? ` for "${args.query}"` : ''
      return text(
        `No skills found${what}. Try a broader search, or ask to "browse skills" with no filter to see what's popular.`
      )
    }

    const lines = skills.map((s, i) => {
      const verified = s.verified ? ' · verified' : ''
      return [
        `${i + 1}. ${s.name} — ${s.category}${verified}`,
        `   ${s.description}`,
        `   ${formatInstalls(s.install_count)} installs · rating ${s.rating_avg.toFixed(1)}`,
        `   skill_id: ${s.id}`,
      ].join('\n')
    })

    const header = `Found ${skills.length} skill${skills.length === 1 ? '' : 's'}:`
    const footer =
      'To install one, call install_skill with its skill_id (or say "install the [name] skill").'

    return text(`${header}\n\n${lines.join('\n\n')}\n\n${footer}`)
  },
}
