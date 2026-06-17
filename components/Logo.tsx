/**
 * SkillShelf brand mark — a stacked "shelf" of skill tiles forming an implied
 * monogram. Single simple geometric mark (no hand-drawn illustration), uses the
 * locked gold accent. Renders crisp at any size; inherits currentColor for the
 * neutral rails so it works on light or dark surfaces.
 */
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="var(--shelf-surface)" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7"
        stroke="var(--shelf-border-strong)"
      />
      {/* top tile — active / gold */}
      <rect x="7" y="8" width="18" height="4.5" rx="2" fill="var(--shelf-accent)" />
      {/* middle tile — neutral, short */}
      <rect x="7" y="14.5" width="11" height="4.5" rx="2" fill="var(--shelf-text-secondary)" />
      {/* base shelf — gold, full width */}
      <rect x="7" y="21" width="18" height="4.5" rx="2" fill="var(--shelf-accent)" />
    </svg>
  )
}

export function Wordmark({
  withMark = true,
  className = '',
}: {
  withMark?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {withMark && <LogoMark className="h-7 w-7" />}
      <span className="font-display text-lg font-semibold tracking-tight text-shelf-text-primary">
        Skill<span className="text-accent">Shelf</span>
      </span>
    </span>
  )
}
