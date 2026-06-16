import type { SkillCategory } from './types'

export interface CategoryMeta {
  slug: SkillCategory
  label: string
  color: string
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: 'coding', label: 'Coding', color: 'var(--cat-coding)' },
  { slug: 'writing', label: 'Writing', color: 'var(--cat-writing)' },
  { slug: 'research', label: 'Research', color: 'var(--cat-research)' },
  { slug: 'productivity', label: 'Productivity', color: 'var(--cat-productivity)' },
  { slug: 'data', label: 'Data', color: 'var(--cat-data)' },
  { slug: 'design', label: 'Design', color: 'var(--cat-design)' },
  { slug: 'business', label: 'Business', color: 'var(--cat-business)' },
  { slug: 'personal', label: 'Personal', color: 'var(--cat-personal)' },
]

export const CATEGORY_MAP: Record<SkillCategory, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.slug] = c
    return acc
  },
  {} as Record<SkillCategory, CategoryMeta>
)

export function isCategory(value: string): value is SkillCategory {
  return CATEGORIES.some((c) => c.slug === value)
}

export function formatInstalls(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(count)
}
