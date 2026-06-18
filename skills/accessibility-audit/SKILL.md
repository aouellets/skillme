---
name: Accessibility Audit
description: Audit and fix UI against WCAG 2.2.
---

# Accessibility Audit

Make interfaces usable by keyboard, screen reader, and low-vision users.

## Audit process

1. Tab through the entire page using only the keyboard. Everything interactive must be reachable and operable.
2. Run an automated pass (axe) to catch the ~30% it can detect.
3. Test with a screen reader (VoiceOver/NVDA) for the rest.
4. Check at 200% zoom and 400% reflow.

## Semantic HTML first

- Use native elements: `<button>`, `<a href>`, `<nav>`, `<main>`, `<label>`. They come with built-in roles and keyboard behavior.
- Reach for ARIA only when no native element fits. The first rule of ARIA: don't use ARIA.

## Keyboard and focus

- Visible focus indicator on every focusable element — never `outline: none` without a replacement.
- Logical tab order following the visual order; avoid positive `tabindex`.
- Trap focus inside modals; restore focus to the trigger on close.
- WCAG 2.2: focus must not be entirely hidden behind sticky headers (Focus Not Obscured).

## ARIA correctly

```html
<button aria-expanded="false" aria-controls="menu">Options</button>
<ul id="menu" hidden>...</ul>
```

- Keep `aria-expanded`/`aria-selected` state in sync with reality.
- Use `aria-live="polite"` regions to announce async updates.
- Label controls: `<label>`, `aria-label`, or `aria-labelledby`.

## Color and contrast

- Text contrast >= 4.5:1 (3:1 for large text). UI components and graphics >= 3:1.
- Never convey meaning by color alone — add text or icons.

## WCAG 2.2 additions

- Target size: interactive targets at least 24x24 CSS px (with spacing exceptions).
- Dragging movements need a single-pointer alternative.
- Accessible authentication: don't require memory/transcription puzzles.

## Rules

- Every image: meaningful `alt`, or `alt=""` if decorative.
- Form errors: associate messages with fields via `aria-describedby`; don't rely on color.
- Don't disable zoom (`user-scalable=no` is an accessibility violation).

## Edge cases

- Custom widgets (comboboxes, tabs): follow the WAI-ARIA Authoring Practices keyboard model exactly.
- Animations: respect `prefers-reduced-motion`.
- Skip link: provide a "skip to content" link as the first focusable element.
