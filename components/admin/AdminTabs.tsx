'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/telemetry', label: 'Telemetry' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/packs', label: 'Packs' },
]

/** Shared admin sub-navigation. Active tab = exact match for /admin, prefix
 *  match otherwise (so nested routes stay highlighted). */
export function AdminTabs() {
  const pathname = usePathname()
  return (
    <nav className="border-b border-shelf-border bg-shelf-void/30">
      <div className="mx-auto flex max-w-content gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {TABS.map((t) => {
          const active = t.href === '/admin' ? pathname === '/admin' : pathname.startsWith(t.href)
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
                active
                  ? 'border-accent text-shelf-text-primary'
                  : 'border-transparent text-shelf-text-secondary hover:text-shelf-text-primary'
              }`}
            >
              {t.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
