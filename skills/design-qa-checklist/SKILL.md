---
name: Design QA Checklist
description: Reviews an implemented UI against design specs — spacing, states, typography, color, and responsiveness. Use during implementation review or before design sign-off.
---

# Design QA Checklist

A systematic review catches drift between design intent and shipped code before it compounds. Work through each section top-to-bottom; flag deviations with a file path or component name and the exact expected vs. actual value.

## Spacing and Layout

- Verify all margin, padding, and gap values match the design token or explicit spec (e.g. space-4 = 16px, not 15px or 18px).
- Check that grid columns, gutters, and container max-widths are correct at every breakpoint.
- Confirm that element alignment is pixel-accurate — use a grid overlay or browser devtools ruler, not eyeballing.
- Flag any 'magic number' hardcoded values that should reference a token.

## Typography

- Font family, weight, size, line-height, and letter-spacing must match the spec exactly.
- Check truncation behavior on long strings — does it ellipsize, wrap, or clip as designed?
- Verify heading hierarchy is semantically correct (H1 > H2 > H3) even if visual size differs.
- Confirm no system fallback fonts are rendering in place of the intended typeface.

## Color and Tokens

- Every color must reference a design token, not a raw hex. Flag any raw hex values in CSS/Tailwind.
- Check that semantic tokens are used correctly: 'surface-danger' on error states, not 'red-500'.
- Verify color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text and UI components).
- Test both light and dark modes if the product supports them.

## Interactive States

- Hover, focus, active, disabled, and loading states must all be implemented and match the spec.
- Focus rings must be visible and styled — never 'outline: none' without an equivalent replacement.
- Confirm that disabled controls are non-interactive (not just visually muted) and excluded from tab order.
- Animated transitions must match specified duration and easing — check the motion spec if one exists.

## Responsiveness and Touch

- Resize from the narrowest supported viewport (typically 320px) up to the widest. No horizontal overflow.
- Touch targets must be at least 44x44px on mobile — check buttons, links, and icon controls.
- Test at 1x, 1.5x, and 2x pixel density for image sharpness.
- Verify text does not become unreadable (too small or overflowing) at any breakpoint.

## Accessibility Baseline

- Run an automated check (axe, Lighthouse) as a first pass; review all violations before sign-off.
- All images have descriptive alt text; decorative images use alt=''.
- Form inputs have visible, associated labels — not placeholder-only.
- Screen reader announces dynamic content changes (loading states, errors, success messages).
