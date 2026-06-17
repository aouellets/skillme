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
            className={`chip ${isActive ? 'chip-active' : ''}`}
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
