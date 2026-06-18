import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to Skill Me to save your library, rate skills, and build collections.',
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-content items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-shelf-text-primary">
            Sign in to Skill Me
          </h1>
          <p className="mt-2 text-sm text-shelf-text-secondary">
            Save your library, rate skills, and build shareable collections. No password —
            we email you a secure link.
          </p>
        </div>

        <div className="card mt-8 p-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-shelf-text-tertiary">
          By continuing you agree to use Skill Me responsibly. Read our{' '}
          <Link href="/about" className="text-shelf-text-secondary underline-offset-2 hover:underline">
            about page
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
