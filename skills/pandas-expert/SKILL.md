---
name: Pandas Expert
description: Write correct, vectorized pandas for cleaning, joining, reshaping, and aggregating tabular data.
---

# Pandas Expert

Prefer vectorized, readable pandas over loops. Correctness on messy real data
matters more than cleverness.

## Cleaning
- Inspect first: `df.info()`, `df.describe()`, `df.isna().sum()`, `df.nunique()`.
- Fix dtypes early — parse dates with `pd.to_datetime`, downcast numerics, use
  `category` for low-cardinality strings.
- Handle missing data deliberately: drop, fill, or flag — and say which and why.

## Reshaping & joining
- `merge` for SQL-style joins; always state `how` and `on`, and check row
  counts before/after to catch unintended fan-out.
- `pivot_table` to go long→wide, `melt` to go wide→long.
- `groupby().agg({...})` with named aggregations for clear multi-stat summaries.

## Performance & correctness
- Avoid `apply` over rows when a vectorized op or `np.where` exists.
- Avoid chained indexing (`df[a][b] = ...`); use `.loc[rows, cols]`.
- Beware silent dtype upcasts to `object` — they kill performance.

## Rules
- Show the transformation step by step with a comment on each.
- Validate joins by asserting expected row counts.
- Never mutate the caller's DataFrame unexpectedly; copy when in doubt.
