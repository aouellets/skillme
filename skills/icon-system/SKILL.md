---
name: Icon System
description: Design a consistent icon set with shared grid, stroke, sizing, and naming.
---

# Icon System

Use this skill to design or audit an icon set so every glyph feels like it belongs
to the same family.

## Step 1: Define the grid

Pick a base canvas, commonly 24x24px. Inside it define:

- **Live area** — typically 20x20, where the icon body sits.
- **Padding** — the 2px margin keeping icons from touching their bounds.
- **Keylines** — reference shapes (square, circle, rectangles) that anchor the
  optical size of different forms so a circle and a square feel equally large.

## Step 2: Choose stroke weight

- Pick one stroke (commonly 1.5px or 2px at 24px) and apply it everywhere.
- Keep stroke weight **constant** across the set — mixing weights breaks cohesion.
- Use consistent corner radius on stroke endpoints (round vs butt caps) and joins.

## Step 3: Optical sizing

Mathematical size != perceived size. Adjust so glyphs feel balanced:

- Circles must slightly overshoot the live area to look the same size as squares.
- Triangles and diagonal forms need optical centering, not geometric centering.
- Test icons side by side at target size and nudge until none looks heavier.

## Step 4: Establish drawing rules

- Align edges to the pixel grid at the base size for crispness.
- Standardize how you depict recurring metaphors (a "plus" is always the same plus).
- Choose a level of detail and hold it — don't mix detailed and minimal glyphs.
- Decide handling of filled vs outline variants up front if you need both.

## Step 5: Naming conventions

Name by meaning, not appearance, so swaps don't require renames:

- Prefer `delete` over `trash-can`, `settings` over `gear`.
- Use a consistent pattern: `category-name-variant`, e.g. `arrow-left`, `arrow-left-filled`.
- Keep names lowercase-hyphenated and singular.
- Maintain an alias list mapping synonyms to canonical names.

## Step 6: Delivery format

- Export optimized SVGs with consistent `viewBox` and no hard-coded fills where you
  want color to inherit (`currentColor`).
- Strip editor metadata; run through an SVG optimizer.
- Provide multiple sizes only if optically redrawn — never just scale 24px to 16px.

## Step 7: Multi-size variants

For small sizes (16px), redraw with reduced detail and adjusted stroke so the icon
stays legible. A scaled-down 24px icon looks muddy.

## Output

Deliver the grid spec, stroke and corner rules, optical-sizing notes, the naming
convention with an alias table, and an export checklist for engineering handoff.
