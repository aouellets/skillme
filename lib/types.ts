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
  thumbnail_url?:    string
  thumbnail_gif?:    string
  thumbnail_video?:  string
  thumbnail_lottie?: string
  media_alt?:        string
  hot_score?:        number
  featured_rank?:    number | null
  created_at: string
  updated_at: string
}

export type SubmissionStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'needs_changes'

export type SafetyVerdict = 'safe' | 'unsafe' | 'unknown'

export interface SkillSubmission {
  id: string
  status: SubmissionStatus
  name: string
  description: string
  category: SkillCategory
  subcategory?: string
  source_url?: string
  author?: string
  skill_content: string
  tags?: string[]
  thumbnail_url?: string
  media_alt?: string
  submitter_email?: string
  submitter_token?: string
  safety_verdict: SafetyVerdict
  safety_reason?: string
  classifier_model?: string
  reviewer_note?: string
  reviewed_at?: string | null
  published_skill_id?: string | null
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

export type PackCategory =
  | 'coding' | 'writing' | 'research' | 'productivity'
  | 'data' | 'design' | 'business' | 'personal' | 'mixed'

export interface Pack {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  author: string
  author_url?: string
  repo_url?: string             // GitHub repo for this pack (starrable)
  category: PackCategory
  tags: string[]
  thumbnail_url?: string
  thumbnail_gif?: string
  media_alt?: string
  install_count: number
  featured: boolean
  verified: boolean
  free: boolean
  skill_count?: number          // populated by join queries
  skills?: Skill[]              // populated by detail queries
  created_at: string
  updated_at: string
}

export interface PackSkill {
  pack_id: string
  skill_id: string
  position: number
  skill?: Skill
}

export interface UserCollection {
  id: string
  user_token: string
  slug: string
  name: string
  description?: string
  public: boolean
  share_token: string
  skill_count?: number
  skills?: Skill[]
  created_at: string
  updated_at: string
}

export interface CollectionSkill {
  collection_id: string
  skill_id: string
  position: number
  skill?: Skill
}

export interface UserFavorite {
  id: string
  user_token: string
  skill_id: string
  created_at: string
  skill?: Skill
}

export interface SkillReview {
  id: string
  user_token: string
  skill_id: string
  rating: number
  body: string
  author_name?: string | null
  created_at: string
  updated_at: string
}

export interface PackSubmission {
  id: string
  status: SubmissionStatus
  name: string
  tagline: string
  description: string
  author?: string
  author_url?: string
  category: PackCategory
  tags?: string[]
  skill_slugs: string[]
  thumbnail_url?: string
  media_alt?: string
  submitter_email?: string
  submitter_token?: string
  reviewer_note?: string
  reviewed_at?: string | null
  published_pack_id?: string | null
  created_at: string
  updated_at: string
}

export interface MCPToolResult {
  content: Array<{ type: 'text'; text: string }>
  isError?: boolean
}
