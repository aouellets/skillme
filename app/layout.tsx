import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/react'
import { SITE_URL } from '@/lib/site'
import { AuthButton } from '@/components/AuthButton'
import { Wordmark } from '@/components/Logo'
import { EmailCapture } from '@/components/EmailCapture'
import './globals.css'

// Display: Space Grotesk — a technical grotesk for headlines + wordmark.
// (Deliberately not Instrument Serif / Inter — both are AI-default "tells".)
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--ff-display',
  display: 'swap',
})

const siteUrl = SITE_URL

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SkillShelf · The App Store for Claude Skills',
    template: '%s · SkillShelf',
  },
  description:
    'Install intelligence. Browse curated Claude skills and install them from inside Claude. No setup, no ZIP files, no copy-pasting.',
  openGraph: {
    title: 'SkillShelf · The App Store for Claude Skills',
    description: 'Install intelligence. Connect once, install anything.',
    url: siteUrl,
    siteName: 'SkillShelf',
    type: 'website',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'SkillShelf · The App Store for Claude Skills',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillShelf · The App Store for Claude Skills',
    description: 'Install intelligence. Connect once, install anything.',
    images: ['/og-default.png'],
    creator: '@aouellets',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  width: 'device-width',
  initialScale: 1,
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-shelf-border bg-shelf-void/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="SkillShelf home" className="transition-opacity hover:opacity-80">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/browse"
            className="rounded-sm px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
          >
            Browse
          </Link>
          <Link
            href="/packs"
            className="rounded-sm px-3 py-2 text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
          >
            Packs
          </Link>
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
    <footer className="mt-28 border-t border-shelf-border">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-3 text-sm leading-relaxed text-shelf-text-tertiary">
              The App Store for Claude skills. Connect once, install anything.
            </p>
            <div className="mt-5">
              <EmailCapture placement="footer" label="New skills weekly" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-2">
            <span className="col-span-2 mb-1 font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
              Explore
            </span>
            <Link href="/browse" className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary">
              Browse skills
            </Link>
            <Link href="/packs" className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary">
              Skill packs
            </Link>
            <Link href="/connect" className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary">
              Connect to Claude
            </Link>
            <Link href="/about" className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary">
              About
            </Link>
            <Link href="/submit" className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary">
              Submit a skill
            </Link>
            <Link href="/skill-media-guide" className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary">
              Media guide
            </Link>
            <a
              href="https://github.com/aouellets/skillshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
            >
              GitHub
            </a>
            <a
              href="https://x.com/aouellets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
            >
              X / Twitter
            </a>
          </div>
        </div>
        <div className="rule mt-10" />
        <p className="mt-6 text-xs text-shelf-text-tertiary">
          © {new Date().getFullYear()} SkillShelf. Built for the Claude community.
        </p>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
