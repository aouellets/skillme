'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-danger">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl text-shelf-text-primary">
        This shelf hit a snag.
      </h1>
      <p className="mt-4 text-shelf-text-secondary">
        An unexpected error occurred while loading this page. You can try again.
      </p>
      <button onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </div>
  )
}
