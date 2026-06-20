---
name: Variant Copy Scaler
description: Generates distinct, on-brand copy for every size, color, and bundle variant from a single master description, splitting shared core from a thin per-variant layer to avoid thin or duplicate-content pages. Use when one product ships in many variants (colors, sizes, bundles, SKUs) and you need per-variant PDP copy, or when near-identical variant pages are creating duplicate-content or canonical problems. Do NOT use when writing the single master or parent PDP description from specs — use product-description-writer instead.
---
# Variant Copy Scaler

Scale one master product description across many variants so each variant page is distinct enough to rank and answer "is THIS the one I want," without re-writing the brand story per SKU.

## Workflow
1. Gather inputs: ask for the master description and the full variant matrix (every color, size, bundle, and SKU). Stop if either is missing.
2. Decide indexing strategy first. If the platform mints a separate indexable URL per variant, choose deliberately: rank variants individually (requires materially unique copy per page) or consolidate to the parent (set canonical tags to the parent product). State the canonical decision explicitly in your output.
3. If you chose consolidation, or the matrix is large and undifferentiated (e.g. 30 near-identical shades), recommend a single parent page with a swatch/size selector instead of spinning per-variant pages, and stop before generating thin copy.
4. Extract the shared core once: brand story, materials, core benefit, care, warranty, shipping. This is reused verbatim on every variant.
5. Build a template with fixed slots and a fixed section order, bullet count, and tone, so output scales without drift.
6. Write a thin variant layer per option that fills the slots with genuinely variant-specific text:
   - Color: name the actual hue honestly ("warm oatmeal, not bright white") plus one styling/pairing cue.
   - Size: state who it fits and the use case ("the 12oz suits a single espresso; the 20oz is for all-day desk sipping").
   - Bundle: show per-unit value math and the occasion (gifting, stocking up).
7. Render each page as shared core plus its variant layer (~80% consistent, ~20% unique) and verify no two variants read as near-duplicates.

## Quality bar
- Every variant page has materially distinct text in its variant layer, not a single swapped word.
- Section order, bullet count, and voice are identical across all variants.
- Canonical/indexing decision is stated and consistent with the copy you produced.
- Care, warranty, and shipping are identical across variants unless they genuinely differ.

## Do NOT
- Do NOT swap one color or size word and call it new copy.
- Do NOT publish multiple indexable variant URLs with near-identical text that compete and dilute authority.
- Do NOT claim a benefit for one variant that isn't true of it (a black fabric isn't "slimming" by virtue of color).
- Do NOT rewrite the brand story, materials, or core benefit per variant — those live in the shared core.
- Do NOT generate thin pages for an undifferentiated matrix; consolidate to a parent with a selector instead.
