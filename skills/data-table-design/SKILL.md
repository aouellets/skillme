---
name: Data Table Design
description: Design tables that communicate clearly — alignment, consistent precision, meaningful sort order, and well-placed totals. Use when presenting tabular data where a misread number has real consequences.
---

# Data Table Design

A table is not a spreadsheet dump. Every formatting choice either helps or hinders the reader's ability to compare, rank, and interpret values.

## Alignment

- Right-align all numeric columns without exception — alignment makes magnitude visible at a glance
- Left-align text columns
- Center column headers only when the column is narrow and centering does not create visual disconnection from the values below
- Never mix alignments within a single column

## Numeric precision

Consistency within a column matters more than absolute precision. Rules:
- Currency: two decimal places for unit prices; zero for large aggregates (1,240,000 not 1,240,000.00)
- Percentages: one decimal place unless the context is scientific
- Large numbers: use K, M, B suffixes with a note of the unit in the header rather than printing eight digits
- If a column mixes values at different scales (some in thousands, one in millions), flag the outlier with a footnote rather than changing the column format

Never imply false precision — round to the significant figures the data actually supports.

## Sort order

Default to the sort order that answers the reader's most likely question:
- Rankings: descending by primary metric
- Time series: chronological
- Categories with no natural order: alphabetical or by a meaningful grouping variable
- Never present data in database row order unless that order is meaningful

## Totals and subtotals

- Totals belong at the bottom of the column, not the top
- Use a visible separator (bold row, horizontal rule, or shaded background) above totals
- Averages and totals should not appear in the same row unless explicitly labeled — they are different statistics
- For percentage columns, a column total is rarely meaningful; show it only when the column sums to 100% by design

## Column and row density

- Include only columns the reader needs to act on or compare. Every unnecessary column adds cognitive load.
- For tables wider than 8 columns, consider whether a chart or two smaller tables communicate better
- Freeze or repeat the label column when a table scrolls horizontally
- Alternate row shading (zebra striping) is acceptable for tables taller than 15 rows; avoid it for short tables

## Headers

Every column header should name the metric and the unit. 'Revenue' is incomplete. 'Revenue (USD, thousands)' is correct. Avoid abbreviations unless they are universal in the reader's context.
