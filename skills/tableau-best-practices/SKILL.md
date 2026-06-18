---
name: Tableau Best Practices
description: Build performant Tableau dashboards with LOD expressions and clean design.
---

# Tableau Best Practices

Design Tableau workbooks that compute the right numbers and stay fast.

## Understand aggregation

Tableau aggregates measures based on the dimensions in the view. A SUM at the row level differs from a SUM across the whole view. Always ask: at what grain is this number computed?

## Level of Detail (LOD) expressions

LOD expressions control the grain independently of the view.

- FIXED computes at a stated grain regardless of the view filters (except context filters):

```
{ FIXED [Customer] : SUM([Sales]) }
```

- INCLUDE adds dimensions to the view grain, then aggregates up.
- EXCLUDE removes dimensions from the view grain.

Common use: customer-level metrics shown on a less granular chart, like average sales per customer by region:

```
AVG({ FIXED [Customer] : SUM([Sales]) })
```

## Filter order matters for performance

Tableau applies filters in this order: Extract, Data Source, Context, Dimension, Measure, Table Calc. FIXED LODs are computed before dimension filters but after context filters. Promote a slow categorical filter to a context filter to reduce the data the rest of the workbook scans.

## Performance optimization

- Use extracts (Hyper) rather than live connections for large or slow sources.
- Reduce marks: high mark counts slow rendering. Aggregate before plotting.
- Avoid blending when a join or relationship will do; blends are computed client-side.
- Minimize quick filters with many values; use a relevant-values or wildcard filter.
- Hide unused fields and reduce the number of worksheets on a dashboard.
- Run Performance Recorder to find slow queries and rendering steps.

## Table calculations vs LODs

Table calcs (RUNNING_SUM, RANK, WINDOW_AVG) operate on the rendered table after aggregation and depend on partitioning and addressing. Use them for running totals, percent of total, and rank. Use LODs when you need a fixed grain regardless of the view.

## Design principles

- One clear question per dashboard; lead with the headline metric.
- Use consistent color encoding and a restrained palette.
- Right-size: build for the target screen and device.
- Add tooltips with context, not clutter.
- Use parameters and dashboard actions for interactivity instead of many separate sheets.

## Maintainability

- Name calculated fields clearly and comment complex logic.
- Organize fields into folders.
- Document data source assumptions and refresh schedules.
