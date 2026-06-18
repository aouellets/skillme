---
name: Print Layout
description: Prepare print-ready layouts with correct bleed, safe zones, color, and prepress checks.
---

# Print Layout

Use this skill to take a design to print without the costly surprises that screen
designers hit — cut-off content, color shifts, and rejected files.

## Step 1: Set up the document correctly

- **Trim size** — the final cut dimensions of the piece.
- **Bleed** — extend any artwork that touches the edge by 3mm (0.125in) past trim,
  so a slightly off cut never reveals white paper.
- **Safe zone** — keep all critical content (text, logos) at least 3–5mm inside the
  trim to survive cutting tolerance.
- **Document resolution** — design at 300 DPI for the final print size; 150 DPI may
  suffice for large-format viewed from a distance.

## Step 2: Color management

- Work in **CMYK** for offset/digital print, not RGB — screen colors won't all
  reproduce on press. Convert and review before delivery.
- Assign the correct **ICC profile** for the press/paper (ask the printer; e.g.
  US Web Coated SWOP, FOGRA39 for European coated).
- Use **spot/Pantone** colors only when specified; they cost extra plates.
- Rich black for large dark areas (e.g. C60 M40 Y40 K100), pure K100 for small text.

## Step 3: Typography for print

- Embed or outline all fonts so the printer's system doesn't substitute them.
- Minimum text size ~6pt; ensure fine text prints in a single plate (K only) to
  avoid registration blur.
- Avoid hairline rules thinner than 0.25pt — they may not print reliably.

## Step 4: Images and links

- All raster images at 300 DPI **at placed size**, not source size.
- Links embedded or packaged — never deliver a file with missing links.
- Total ink coverage under the press limit (commonly ~300%) to prevent smearing.

## Step 5: Prepress checklist

Before sending to print, verify:

- Bleed present on every edge-touching element.
- No critical content in the bleed or outside the safe zone.
- Color mode CMYK, correct ICC profile attached.
- Fonts embedded or outlined.
- Images 300 DPI, no missing links, ink limit respected.
- Overprint and knockout set correctly (watch white text set to overprint — it vanishes).
- Crop marks and bleed marks included on the export.

## Step 6: Export

- Export to **PDF/X-1a** or **PDF/X-4** (confirm which the printer wants).
- Include bleed and trim marks; set the correct output intent.
- Flatten transparency if the printer requires it.

## Step 7: Proof

- Request a hard proof for color-critical jobs; soft proofs miss paper and press shifts.
- Check a physical proof for registration, color, and trim before the full run.

## Output

Deliver the print-ready PDF/X file plus a prepress checklist confirming bleed, safe
zone, color profile, fonts, image resolution, and ink limits were all verified.
