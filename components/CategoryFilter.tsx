'use client'

import { CATEGORIES } from '@/lib/categories'
import type { SkillCategory } from '@/lib/types'

export function CategoryFilter({
  active,
  onChange,
}: {
  active: SkillCategory | 'all'
  onChange: (value: SkillCategory | 'all') => void
}) {
  const items: Array<{ value: SkillCategory | 'all'; label: string; color?: string }> = [
    { value: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ value: c.slug, label: c.label, color: c.color })),
  ]

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      {items.map((item) => {
        const isActive = active === item.value
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={`inline-flex items-center gap-1.5 rounded-btn border px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? 'border-accent-border bg-accent-dim text-accent-hover'
                : 'border-shelf-border bg-shelf-surface text-shelf-text-secondary hover:border-shelf-muted hover:text-shelf-text-primary'
            }`}
          >
            {item.color && (
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
