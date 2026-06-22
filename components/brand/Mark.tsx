/**
 * Skill Me logo mark — inline SVG so the three colors are driven by CSS
 * variables and ONE component serves both light and dark surfaces:
 *
 *   --mark-bg      the rounded tile (paper on the dark shell, ink on paper)
 *   --mark-fg      the two static bars
 *   --mark-accent  the wider middle bar — vermilion, and it intentionally
 *                  breaks the right edge of the frame (extends to x=117 in a
 *                  120-wide viewBox) as the brand's signature gesture.
 *
 * Defaults live in styles/tokens.css (:root). To render on a light surface,
 * add the `.mark-on-paper` class on an ancestor to flip bg/fg.
 *
 * Rendered as JSX (not <img>) so it inherits theme tokens and stays crisp at
 * any size. The standalone /public/brand/*.svg files are for external use.
 */
export function Mark({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="100" height="100" rx="27" fill="var(--mark-bg)" />
      <rect x="34" y="33" width="42" height="12" rx="6" fill="var(--mark-fg)" />
      <rect x="34" y="54" width="83" height="12" rx="6" fill="var(--mark-accent)" />
      <rect x="34" y="75" width="33" height="12" rx="6" fill="var(--mark-fg)" />
    </svg>
  )
}
