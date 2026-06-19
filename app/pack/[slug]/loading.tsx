/**
 * Route-level skeleton for the pack detail page. Shape-matches the real layout
 * (breadcrumb → header → [1fr_300px] body with an included-skills grid and a
 * sidebar) so the fallback doesn't flash the catalog-grid skeleton from the
 * global app/loading.tsx before swapping to a detail layout.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading pack"
      className="mx-auto max-w-4xl animate-pulse px-4 py-10 sm:px-6"
    >
      {/* breadcrumb */}
      <div className="h-4 w-40 rounded-xs bg-shelf-surface" />

      {/* header */}
      <div className="mt-6">
        <div className="h-7 w-36 rounded bg-shelf-surface" />
        <div className="mt-4 h-10 w-2/3 rounded-sm bg-shelf-surface" />
        <div className="mt-4 h-5 w-80 max-w-full rounded-xs bg-shelf-surface" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {/* description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-xs bg-shelf-surface" />
            <div className="h-4 w-11/12 rounded-xs bg-shelf-surface" />
          </div>
          {/* included skills grid */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[16/9] w-full bg-shelf-elevated" />
                <div className="p-5">
                  <div className="h-4 w-2/3 rounded-xs bg-shelf-elevated" />
                  <div className="mt-3 h-3 w-full rounded-xs bg-shelf-elevated" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* install sidebar (desktop only) */}
        <div className="hidden lg:block">
          <div className="h-64 w-full rounded-lg border border-shelf-border bg-shelf-surface" />
        </div>
      </div>
    </div>
  )
}
