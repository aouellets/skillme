import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 font-display text-5xl text-shelf-text-primary">
        Nothing on this shelf.
      </h1>
      <p className="mt-4 text-shelf-text-secondary">
        The page or skill you are looking for does not exist.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/browse" className="btn btn-secondary">
          Browse skills →
        </Link>
      </div>
    </div>
  )
}
