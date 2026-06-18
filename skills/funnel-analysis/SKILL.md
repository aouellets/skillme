---
name: Funnel Analysis
description: Build conversion funnels with drop-off attribution and significance testing.
---

# Funnel Analysis

Measure where users drop off in a multi-step flow and find statistically real differences between segments.

## Define the funnel precisely

1. List the ordered steps (e.g. view -> add to cart -> checkout -> purchase).
2. Decide on the conversion window (e.g. complete within 7 days of step 1).
3. Choose ordered vs unordered: must steps happen in sequence, or just all occur?

Ambiguous definitions produce misleading funnels; write them down.

## Compute the funnel in SQL

```sql
with steps as (
  select user_id,
         min(case when event = 'view' then event_time end) as t_view,
         min(case when event = 'add_to_cart' then event_time end) as t_cart,
         min(case when event = 'checkout' then event_time end) as t_checkout,
         min(case when event = 'purchase' then event_time end) as t_purchase
  from events group by user_id
)
select
  count(t_view) as viewed,
  count(t_cart) as carted,
  count(t_checkout) as checked_out,
  count(t_purchase) as purchased
from steps
where t_cart > t_view or t_cart is null;
```

Enforce ordering by requiring each timestamp to exceed the prior one.

## Drop-off attribution

For each adjacent pair compute step conversion = stage_n / stage_n-1. The largest drop is the biggest opportunity. Also report overall conversion = final / first.

## Segment comparison

Break the funnel by device, channel, plan, or cohort. Differences in step conversion point to where a segment struggles.

## Significance testing

Do not eyeball rate differences. Compare two conversion rates with a two-proportion z-test:

```python
from statsmodels.stats.proportion import proportions_ztest
stat, p = proportions_ztest([conv_a, conv_b], [n_a, n_b])
```

For many segments, control the false discovery rate (Benjamini-Hochberg). Report confidence intervals on each rate, not just point estimates.

## Time-to-convert

Beyond whether users convert, analyze how long each step takes. A long median time at a step often signals friction even if conversion looks fine.

## Best practices

- Deduplicate events before counting.
- Account for users still in the conversion window (right-censoring) so you do not understate conversion.
- Track funnels over time; a sudden step drop often signals a release bug.
- Pair quantitative drop-off with session recordings or surveys to learn why.
