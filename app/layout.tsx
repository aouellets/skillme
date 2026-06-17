import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site'
import { AuthButton } from '@/components/AuthButton'
import { EmailCapture } from '@/components/EmailCapture'
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

const siteUrl = SITE_URL

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
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'SkillShelf — The App Store for Claude Skills',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillShelf — The App Store for Claude Skills',
    description: 'Install intelligence. Connect once, install anything.',
    images: ['/og-default.png'],
    creator: '@aouellets',
  },
}

export const viewport: Viewport = {
  themeColor: '#0E0F11',
  width: 'device-width',
  initialScale: 1,
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
            href="/packs"
            className="px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
          >
            Packs
          </Link>
          {/* Library nav — re-enable once GitHub OAuth is configured in Supabase
          <Link
            href="/library"
            className="hidden px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary sm:inline"
          >
            Library
          </Link>
          */}
          <AuthButton />
          <Link href="/connect" className="btn btn-primary ml-1">
            <span className="sm:hidden">Connect</span>
            <span className="hidden sm:inline">Connect to Claude</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-shelf-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-b border-shelf-border py-6">
          <EmailCapture placement="footer" label="New skills weekly →" />
        </div>
        <div className="flex flex-col gap-4 py-10 text-sm text-shelf-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-shelf-text-secondary">SkillShelf</span>
            <span>· The App Store for Claude Skills</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/browse" className="transition-colors hover:text-shelf-text-secondary">
              Browse
            </Link>
            <Link href="/packs" className="transition-colors hover:text-shelf-text-secondary">
              Packs
            </Link>
            <Link href="/connect" className="transition-colors hover:text-shelf-text-secondary">
              Connect
            </Link>
            <Link href="/about" className="transition-colors hover:text-shelf-text-secondary">
              About
            </Link>
            <Link href="/submit" className="transition-colors hover:text-shelf-text-secondary">
              Submit a skill
            </Link>
            <Link href="/skill-media-guide" className="transition-colors hover:text-shelf-text-secondary">
              Media Guide
            </Link>
            <a
              href="https://github.com/aouellets/skillshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-shelf-text-secondary"
            >
              GitHub
            </a>
            <a
              href="https://x.com/aouellets"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-shelf-text-secondary"
            >
              X / Twitter
            </a>
          </div>
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
