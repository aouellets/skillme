---
name: Responsive Spec
description: Specifies responsive behavior across breakpoints — reflow, content priority, and touch targets — engineers can implement directly. Use when designing adaptive layouts for multi-device products.
---

# Responsive Spec

A static design at one viewport does not specify a responsive product. A responsive spec documents the rules that govern how layout, content, and interaction change as the viewport changes — not just a set of static frames.

## Breakpoint Definitions

State the breakpoints explicitly with pixel values and their semantic name:
- 'mobile': 0-767px
- 'tablet': 768-1023px
- 'desktop': 1024-1439px
- 'wide': 1440px and above

If the product uses a different grid system (e.g. a 5-breakpoint Tailwind config), match those values exactly. Never use vague names like 'small' without a pixel value.

## Layout Changes Per Breakpoint

For each breakpoint transition, document:
- Column count and gutter width.
- Which elements stack, collapse, or disappear.
- Container max-width and horizontal padding.
- Any changes to element ordering (e.g. 'CTA moves above image on mobile').

An explicit table works well: rows are breakpoints, columns are layout properties.

## Content Priority

On mobile, not all content fits without compromising usability. Document:
- Which elements are hidden below a breakpoint and the rationale (progressive disclosure, not arbitrary omission).
- Which elements change behavior instead of disappearing (e.g. 'horizontal tabs become a select dropdown below 768px').
- Text truncation rules that apply only on mobile.
- Navigation patterns: desktop nav bar becomes bottom tab bar or hamburger menu — specify which and at what breakpoint.

## Touch Targets

All interactive elements on touch viewports must meet minimum target size:
- Minimum 44x44px for any tappable element. If the visual size is smaller, add invisible padding.
- Spacing between adjacent touch targets: minimum 8px to prevent mis-taps.
- Swipe gestures: document direction, threshold, and what action they trigger. Note if swipe conflicts with system gestures (e.g. back swipe on iOS).

## Fluid vs. Fixed Behavior

For every significant element, specify whether it scales fluidly between breakpoints or snaps at discrete points:
- 'Fluid': element width is a percentage; font size uses clamp() or viewport units.
- 'Fixed': element width locks to a pixel value at each breakpoint and snaps.
- Images: specify object-fit (cover vs. contain), aspect ratio at each breakpoint, and whether focal point shifts.

## Edge Cases to Specify

- Landscape phone orientation: is the layout treated as mobile or tablet?
- Very long text strings in labels and headings: does the layout break? What is the overflow rule?
- 320px minimum: the spec must remain functional at the minimum supported width — verify this explicitly.
