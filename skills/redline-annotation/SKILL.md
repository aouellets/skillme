---
name: Redline Annotation
description: Produces precise redline and spec annotations — spacing, sizes, and behavior notes — engineers can build from directly. Use when preparing design files or specs for a development handoff.
---

# Redline Annotation

Redlines eliminate guesswork. Every measurement, color, and behavior that is not self-evident in the design tool must be annotated. Annotate for the engineer who has never seen the design before and cannot ask a question mid-sprint.

## What Always Gets Annotated

- Spacing: all padding, margin, and gap values in pixels (or the token name if a token system exists).
- Sizing: width, height, and min/max constraints for every non-trivially-sized element.
- Type: font family, weight, size, line-height, letter-spacing, and color for every text style not covered by a named style.
- Color: token name first; raw hex only if no token exists. Include opacity if not 100%.
- Corner radius: per-corner values if they differ (e.g. top-left: 8, top-right: 8, bottom: 0).
- Layer/z-index relationships for overlapping elements (e.g. 'dropdown sits above modal overlay').

## Behavior Notes

Annotate anything a developer cannot infer from a static frame:
- Hover, focus, active, and disabled visual states with delta description ('background shifts from surface-primary to surface-hover, 150ms ease-out').
- Overflow behavior: scroll direction, hidden vs. clipped vs. visible.
- Conditional visibility: what triggers show/hide, and whether it is CSS display:none or removed from DOM.
- Truncation rules: max lines before ellipsis, tooltip on truncate yes/no.

## Spacing Annotation Format

Use a consistent notation so engineers scan quickly:
- Internal padding: annotate as 'padding: 12 16' (top/bottom left/right) or all four values if asymmetric.
- Gap between siblings: draw a gap arrow and label the value.
- 'Auto' widths: note 'grows to fill container' vs. 'shrinks to content'.
- Never annotate only half of a symmetrical component — annotate fully so there is no ambiguity.

## What Not to Annotate

- Values already defined in a shared style or component (if the engineer has access to the design system, do not re-document every token).
- Structural markup or class names — that is the engineer's domain. Annotate intent, not implementation.
- Every single pixel when a 4px or 8px grid is the explicit convention — annotate exceptions to the grid, not the grid itself.

## Delivery Checklist

- All annotations are visible without needing to click into layers.
- A legend is included if custom notation is used.
- The file includes a 'last updated' date and the name of the design owner.
- Responsive behavior is called out inline or linked to the responsive spec.
