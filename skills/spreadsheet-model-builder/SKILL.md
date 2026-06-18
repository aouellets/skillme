---
name: Spreadsheet Model Builder
description: Build clean, auditable spreadsheet models — separated assumptions, consistent formula hygiene, and a layout a second analyst can navigate without a guide. Use for financial models, forecasts, or any model reviewed by others.
---

# Spreadsheet Model Builder

A good spreadsheet model is auditable, extensible, and self-documenting. The goal is not to impress with complexity but to be right in a way anyone can verify.

## Sheet structure

Separate the model into distinct sheets with clear roles:
- 'Inputs' or 'Assumptions' — every editable variable lives here, and only here
- 'Calcs' or intermediate sheets — derived values, never raw inputs
- 'Output' or 'Summary' — the final numbers a reader cares about
- 'Data' — raw imported or pasted data, never edited by hand

No hardcoded number should appear inside a formula. If a value might ever change, it is an input.

## Assumption sheet rules

Group assumptions by theme (revenue, costs, headcount, timing). Label every row clearly — include units and the basis for the assumption in an adjacent note column. Color-code inputs distinctly (e.g., blue text on white) so auditors can identify them at a glance without reading a legend.

Date the assumption set. When a model has multiple scenarios, each scenario is a separate column in the Inputs sheet — not a separate file.

## Formula hygiene

One formula per row, consistent across all columns. If row 5 sums differently in column D than in column E, something is wrong. Audit with Ctrl+backslash (Windows) or Cmd+backslash (Mac) to spot inconsistencies.

Avoid:
- Nested IF chains deeper than two levels — use a lookup table or helper column
- INDIRECT — it hides dependencies and breaks refactoring
- Volatile functions (NOW, RAND, OFFSET) in calculation paths — they recalculate constantly and obscure change

Prefer INDEX+MATCH over VLOOKUP; it handles column insertions without breaking.

## Navigation and legibility

- Freeze the top row and leftmost label column on every sheet
- Use consistent date formatting (YYYY-MM or MMM-YY) across all sheets
- Left-align text labels, right-align numbers, center column headers
- Keep column widths consistent within a section
- Never merge cells in data ranges — it breaks sorting, filtering, and formulas

## Audit trail

Before sharing, document three things in a 'Cover' sheet: what the model does, what the key assumptions are, and what changed in the last update. A model without a cover note is incomplete.
