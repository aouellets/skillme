---
name: Color Accessibility
description: Build color systems that meet WCAG 2.2 contrast and stay legible for color-blind users.
---

# Color Accessibility

Color should never be the only thing carrying meaning, and text must always be
readable.

## Contrast targets (WCAG 2.2)
- Body text: at least **4.5:1** against its background.
- Large text (≥24px, or ≥19px bold): at least **3:1**.
- UI components and focus indicators: at least **3:1** against adjacent colors.
- Always test the *actual* pairing, including text over images and on hover.

## Don't rely on color alone
- Pair color with a label, icon, or pattern (e.g. error = red + icon + text).
- Links in body text need an underline or another non-color cue.
- Charts: use shape, position, or direct labels, not just hue.

## Color-blind safety
- Avoid red/green as the only distinction (8% of men can't separate them).
- Prefer blue/orange palettes; verify with a simulator (deuteranopia,
  protanopia, tritanopia).

## Process
1. Define tokens, then check every text/surface pair against the targets.
2. Fix failures by adjusting lightness, not by nudging hue.
3. Verify focus states and disabled states meet contrast too.
4. Re-check in dark mode — it has its own pairings.
