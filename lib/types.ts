export type SkillCategory =
  | 'coding'
  | 'writing'
  | 'research'
  | 'productivity'
  | 'data'
  | 'design'
  | 'business'
  | 'personal'

export interface Skill {
  id: string
  slug: string
  name: string
  description: string
  category: SkillCategory
  subcategory?: string
  source_url?: string
  author?: string
  skill_content: string
  install_count: number
  rating_avg: number
  rating_count: number
  verified: boolean
  featured: boolean
  free: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export interface UserInstall {
  id: string
  user_token: string
  skill_id: string
  active: boolean
  rating?: number
  installed_at: string
  updated_at?: string
  skill?: Skill
}

export interface MCPToolResult {
  content: Array<{ type: 'text'; text: string }>
  isError?: boolean
}
