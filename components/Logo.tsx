/**
 * Skill Me brand mark — a rounded tile holding an ascending pulse/sparkline in
 * the locked lime accent. The rising line reads as personal momentum (the "me"
 * in Skill Me) and nods to the vitals-trend graphs of the product surface.
 * Single simple geometric mark (no hand-drawn illustration). Renders crisp at
 * any size; the tile + rail inherit the design tokens so it sits on any surface.
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
      <rect width="32" height="32" rx="9" fill="var(--shelf-surface)" />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="8.25"
        stroke="var(--shelf-border-strong)"
        strokeWidth="1.5"
      />
      {/* ascending pulse line */}
      <path
        d="M6 21.5 L11 21.5 L13.5 11 L17 24 L19.5 16.5 L21.5 16.5"
        stroke="var(--shelf-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* leading node */}
      <circle cx="24.5" cy="16.5" r="2" fill="var(--shelf-accent)" />
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
        Skill<span className="text-accent"> Me</span>
      </span>
    </span>
  )
}
