export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="h-10 w-56 animate-pulse rounded bg-shelf-surface" />
      <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-shelf-surface" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-40 animate-pulse p-5">
            <div className="h-4 w-2/3 rounded bg-shelf-elevated" />
            <div className="mt-3 h-3 w-full rounded bg-shelf-elevated" />
            <div className="mt-2 h-3 w-5/6 rounded bg-shelf-elevated" />
          </div>
        ))}
      </div>
    </div>
  )
}
