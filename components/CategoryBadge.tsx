import { CATEGORY_MAP } from '@/lib/categories'
import type { SkillCategory } from '@/lib/types'

export function CategoryBadge({
  category,
  size = 'sm',
}: {
  category: SkillCategory
  size?: 'sm' | 'md'
}) {
  const meta = CATEGORY_MAP[category]
  if (!meta) return null

  const pad = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-btn border border-shelf-border bg-shelf-elevated ${pad} text-shelf-text-secondary`}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  )
}
