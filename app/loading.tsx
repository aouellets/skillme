export default function Loading() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <div className="h-10 w-56 animate-pulse rounded-sm bg-shelf-surface" />
      <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded-sm bg-shelf-surface" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card animate-pulse overflow-hidden">
            <div className="aspect-[16/9] w-full bg-shelf-elevated" />
            <div className="p-5">
              <div className="h-4 w-2/3 rounded-xs bg-shelf-elevated" />
              <div className="mt-3 h-3 w-full rounded-xs bg-shelf-elevated" />
              <div className="mt-2 h-3 w-5/6 rounded-xs bg-shelf-elevated" />
              <div className="mt-4 h-3 w-1/3 rounded-xs bg-shelf-elevated" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
