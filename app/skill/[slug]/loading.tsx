/**
 * Route-level skeleton for the skill detail page. Shape-matches the real
 * layout (breadcrumb → header → [1fr_320px] body with a SKILL.md preview pane
 * and sidebar) so the fallback doesn't flash the catalog-grid skeleton from
 * the global app/loading.tsx before swapping to a detail layout.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading skill"
      className="mx-auto max-w-4xl animate-pulse px-4 py-10 sm:px-6"
    >
      {/* breadcrumb */}
      <div className="h-4 w-48 rounded-xs bg-shelf-surface" />

      {/* header */}
      <div className="mt-6">
        <div className="h-6 w-28 rounded-full bg-shelf-surface" />
        <div className="mt-4 h-10 w-3/4 rounded-sm bg-shelf-surface" />
        <div className="mt-4 h-4 w-64 max-w-full rounded-xs bg-shelf-surface" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {/* description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-xs bg-shelf-surface" />
            <div className="h-4 w-5/6 rounded-xs bg-shelf-surface" />
          </div>
          {/* tags */}
          <div className="mt-5 flex gap-2">
            <div className="h-5 w-16 rounded-btn bg-shelf-surface" />
            <div className="h-5 w-20 rounded-btn bg-shelf-surface" />
            <div className="h-5 w-14 rounded-btn bg-shelf-surface" />
          </div>
          {/* SKILL.md preview pane */}
          <div className="mt-8 h-4 w-32 rounded-xs bg-shelf-surface" />
          <div className="mt-3 h-80 w-full rounded-lg border border-shelf-border bg-shelf-void" />
        </div>
        {/* sidebar (desktop only, matches lg:grid-cols-[1fr_320px]) */}
        <div className="hidden lg:block">
          <div className="h-56 w-full rounded-lg border border-shelf-border bg-shelf-surface" />
        </div>
      </div>
    </div>
  )
}
