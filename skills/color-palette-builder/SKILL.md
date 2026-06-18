---
name: Color Palette Builder
description: Builds an accessible, purposeful brand color palette with usage rules and WCAG compliance notes. Use when defining brand colors or building a design system color layer.
---

# Color Palette Builder

A brand color palette is not a mood board — it is a functional system with rules. This skill builds palettes that are purposeful, accessible, and documented well enough for a developer to implement without guessing.

## Start with One Anchor Color

Every strong palette begins with a single well-chosen anchor: the primary brand color. Choose it for its strategic meaning and its flexibility — it must work on white, work on dark surfaces, and survive single-color reproduction. Derive the full palette from this anchor rather than assembling unrelated colors. This keeps the system coherent.

## Structure the Palette in Roles, Not Names

Assign every color a role before a name. Roles: Primary (main brand actions, links, focus), Secondary (supporting accents, hover states), Neutral (text, borders, backgrounds), Semantic (success green, warning amber, error red, info blue). Neutrals are the most underestimated — a well-stepped gray scale (50 through 900) does more work than any accent color.

## Build Tonal Scales, Not Single Swatches

For Primary and Secondary colors, generate a 9-step tonal scale from near-white to near-black (100 through 900). Use the 500 value as the anchor. This gives component designers flexibility without needing to invent one-off shades. Tools like Radix Colors, Tailwind's palette generator, or manual HSL stepping all produce consistent results.

## Check Contrast at Every Step

Apply WCAG 2.1 AA minimums as non-negotiable: 4.5:1 for normal text, 3:1 for large text and UI components. Test Primary 600 and above against white backgrounds; test Primary 200 and below against dark text. Document the passing pairs explicitly — do not leave developers to guess which combinations are accessible. Aim for AAA (7:1) on body text wherever possible.

## Document Usage Rules

For each color role, state what it is for and what it is not for. Example: 'Primary 500 — use for interactive elements, primary buttons, and focus rings. Do not use as a background behind body text.' Without usage rules, a palette becomes decoration and designers make inconsistent decisions. Usage rules are the difference between a palette and a system.

## Semantic and Dark Mode Consideration

If the product has a dark mode, define semantic tokens ('color-background-default', 'color-text-primary') that map to different palette values per mode. Semantic tokens decouple component code from raw color values and make theming maintainable. Even if dark mode is not in scope now, architecting for tokens adds no cost and saves significant rework later.
