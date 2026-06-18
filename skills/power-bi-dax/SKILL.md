---
name: Power BI DAX
description: Write correct, performant DAX measures with proper filter context and time intelligence.
---

# Power BI DAX

Use this skill to author DAX measures and calculated columns that are correct under filter context and fast in VertiPaq.

## Core principles

1. Prefer measures over calculated columns. Measures evaluate in the report's filter context and do not bloat the model. Use calculated columns only when you need a row-level value for slicing or relationships.
2. Always wrap aggregations so they respect context. `SUM(Sales[Amount])` is implicitly `CALCULATE(SUM(...))` inside a measure.
3. Understand the two contexts: filter context (slicers, rows, columns, CALCULATE) and row context (calculated columns, iterators like SUMX). `CALCULATE` is the only function that turns row context into filter context via context transition.

## Writing a base measure

```dax
Total Sales = SUM ( Sales[Amount] )
```

## Time intelligence

Always have a marked Date table with a contiguous date range. Then:

```dax
Sales YTD =
CALCULATE ( [Total Sales], DATESYTD ( 'Date'[Date] ) )

Sales PY =
CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

Sales YoY % =
DIVIDE ( [Total Sales] - [Sales PY], [Sales PY] )
```

Use `DIVIDE` instead of `/` to avoid divide-by-zero errors.

## Controlling filter context

```dax
% of Total =
DIVIDE (
    [Total Sales],
    CALCULATE ( [Total Sales], ALLSELECTED ( Product[Category] ) )
)
```

- `ALL` removes all filters from a column or table.
- `ALLSELECTED` respects outer slicers but ignores inner row/column grouping.
- `KEEPFILTERS` intersects rather than overrides a filter inside CALCULATE.
- `REMOVEFILTERS` is the modern alias for clearing filters.

## Iterators

Row-by-row math uses X functions:

```dax
Weighted Margin =
SUMX ( Sales, Sales[Qty] * ( Sales[Price] - Sales[Cost] ) )
```

Avoid wrapping iterators in unnecessary CALCULATE; each row triggers context transition and can be slow.

## Variables for clarity and speed

```dax
Margin % =
VAR Revenue = [Total Sales]
VAR Cost = SUM ( Sales[Cost] )
RETURN DIVIDE ( Revenue - Cost, Revenue )
```

Variables are evaluated once and reused, improving readability and performance.

## Performance checklist

- Reduce cardinality of columns used in relationships.
- Avoid bidirectional relationships unless required.
- Prefer integer keys over strings.
- Use `SELECTEDVALUE` instead of `HASONEVALUE` + `VALUES` patterns.
- Test measures with Performance Analyzer and DAX Studio to inspect the query plan and VertiPaq scans.

## Common pitfalls

- Forgetting context transition: a measure referenced inside SUMX is wrapped in implicit CALCULATE.
- Using calculated columns for aggregations that should be measures.
- Time intelligence failing because the Date table is not marked or has gaps.
