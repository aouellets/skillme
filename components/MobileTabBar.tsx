'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* App-native bottom navigation — mobile/tablet only (hidden at lg+, where the
   top header nav takes over unchanged). Thumb-reachable, safe-area aware, four
   top-level destinations with icon + label. Connect is styled as the standing
   CTA so the conversion action is always one tap away. */

type IconProps = { active: boolean }

function HomeIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0} />
    </svg>
  )
}

function BrowseIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={11} cy={11} r={7} />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function PacksIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0} />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  )
}

function ConnectIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v5" />
      <path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" />
      <path d="M12 16v5" />
    </svg>
  )
}

type Tab = {
  href: string
  label: string
  icon: (p: IconProps) => React.ReactNode
  isActive: (path: string) => boolean
  cta?: boolean
}

const TABS: Tab[] = [
  { href: '/', label: 'Home', icon: HomeIcon, isActive: (p) => p === '/' },
  {
    href: '/browse',
    label: 'Browse',
    icon: BrowseIcon,
    isActive: (p) => p.startsWith('/browse') || p.startsWith('/skill'),
  },
  {
    href: '/packs',
    label: 'Packs',
    icon: PacksIcon,
    // matches both /packs and /pack/[slug]
    isActive: (p) => p.startsWith('/pack'),
  },
  {
    href: '/connect',
    label: 'Connect',
    icon: ConnectIcon,
    isActive: (p) => p.startsWith('/connect'),
    cta: true,
  },
]

export function MobileTabBar() {
  const pathname = usePathname() ?? '/'

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-shelf-border bg-shelf-void/85 backdrop-blur-xl supports-[backdrop-filter]:bg-shelf-void/70 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch">
        {TABS.map((tab) => {
          const active = tab.isActive(pathname)
          const color = tab.cta
            ? 'text-accent'
            : active
              ? 'text-shelf-text-primary'
              : 'text-shelf-text-tertiary'
          const iconColor = !tab.cta && active ? 'text-accent' : ''
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 px-1 pb-1.5 pt-2 text-[11px] font-medium leading-none transition-colors active:scale-[0.96] ${color}`}
              >
                <span className={iconColor}>{tab.icon({ active })}</span>
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
