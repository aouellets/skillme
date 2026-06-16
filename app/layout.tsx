import type { Metadata } from 'next'
import { Inter, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--ff-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--ff-body',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--ff-mono',
  display: 'swap',
})

const DEFAULT_SITE_URL = 'https://skillshelf.io'

/**
 * Resolve the public site URL defensively. A missing, empty, or bare-host value
 * (e.g. "skillshelf.io") would otherwise throw `new URL(...)` during the build's
 * page-data collection and fail the deploy. Coerce a bare host to https and fall
 * back to the default if it still isn't a valid absolute URL.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return DEFAULT_SITE_URL
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(candidate).toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

const siteUrl = resolveSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SkillShelf — The App Store for Claude Skills',
    template: '%s · SkillShelf',
  },
  description:
    'Install intelligence. Browse curated Claude skills and install them from inside Claude — no setup, no ZIP files, no copy-pasting.',
  openGraph: {
    title: 'SkillShelf — The App Store for Claude Skills',
    description: 'Install intelligence. Connect once, install anything.',
    url: siteUrl,
    siteName: 'SkillShelf',
    type: 'website',
  },
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-shelf-border bg-shelf-void/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-2xl leading-none text-shelf-text-primary">
          SkillShelf
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/browse"
            className="px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
          >
            Browse
          </Link>
          <Link
            href="/connect"
            className="px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
          >
            Connect
          </Link>
          <Link href="/connect" className="btn btn-primary ml-1">
            Connect to Claude
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-shelf-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-shelf-text-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg text-shelf-text-secondary">SkillShelf</span>
          <span>· The App Store for Claude Skills</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/browse" className="transition-colors hover:text-shelf-text-secondary">
            Browse
          </Link>
          <Link href="/connect" className="transition-colors hover:text-shelf-text-secondary">
            Connect
          </Link>
          <a
            href="https://github.com/aouellets/skillshelf"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-shelf-text-secondary"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
