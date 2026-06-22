import { Mark } from './Mark'

/**
 * Skill Me lockup: the <Mark/> + the wordmark as real HTML text (Inter 700,
 * tight tracking) so it's crisp, selectable, and never falls back to a
 * system font the way an <img> of an SVG <text> would.
 *
 * Wordmark: "skill" in the current text color, "me" in the vermilion accent.
 * Lowercase, per the brand. The component is presentational — wrap it in a
 * <Link aria-label="Skill Me"> at the call site for navigation.
 */
export function Logo({
  className = '',
  markSize = 28,
}: {
  className?: string
  markSize?: number
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark size={markSize} />
      <span className="whitespace-nowrap font-display text-lg font-bold leading-none tracking-[-0.03em] text-shelf-text-primary">
        skill<span className="text-brand-accent">me</span>
      </span>
    </span>
  )
}
