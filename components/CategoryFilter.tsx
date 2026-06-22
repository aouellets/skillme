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
    // Mobile: a single horizontally-scrolling row (full-bleed into the page
    // gutter via -mx-4/px-4) so the 9 categories don't wrap to three rows above
    // the results. Desktop is unchanged — wraps within the container at sm+.
    <div
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      role="tablist"
      aria-label="Filter by category"
    >
      {items.map((item) => {
        const isActive = active === item.value
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={`chip shrink-0 ${isActive ? 'chip-active' : ''}`}
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
