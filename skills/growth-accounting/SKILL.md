---
name: Growth Accounting
description: Decompose active-user growth into new, retained, resurrected, and churned.
---

# Growth Accounting

Explain why your active user count changed by decomposing it into its underlying flows.

## The core identity

For any period, the change in active users reconciles exactly:

```
Active(t) = Active(t-1) + New + Resurrected - Churned
```

Where, comparing the set of active users this period vs last:

- New: active this period, never active before.
- Retained: active this period and last period.
- Resurrected: active this period, inactive last period, but active sometime earlier.
- Churned: active last period, not active this period (a negative contribution).

Net new users = New + Resurrected - Churned. This must equal Active(t) - Active(t-1).

## Quick Ratio

A single health metric summarizing growth efficiency:

```
Quick Ratio = (New + Resurrected) / Churned
```

A ratio above 1 means you are adding more users than you lose. Best-in-class consumer products sit well above 1; a ratio near or below 1 means growth is stalling even if the top line still rises.

## Computing it in SQL

Define an activity table with one row per user per active period, then compare consecutive periods with window functions:

```sql
with activity as (
  select user_id, date_trunc('month', activity_date) as period
  from events group by 1, 2
),
flags as (
  select user_id, period,
    lag(period) over (partition by user_id order by period) as prev_period,
    min(period) over (partition by user_id) as first_period
  from activity
)
select period,
  count(*) filter (where period = first_period) as new_users,
  count(*) filter (where prev_period = period - interval '1 month') as retained,
  count(*) filter (where period <> first_period
                   and (prev_period is null
                        or prev_period < period - interval '1 month')) as resurrected
from flags group by period order by period;
```

Compute churned separately as users active last period but absent this period.

## Revenue growth accounting

The same framework applies to revenue (the MRR bridge). Decompose revenue change into new, expansion, contraction, churned, and resurrected dollars. This connects user-level growth accounting to financial outcomes.

## How to use it

- Track each flow over time, not just net actives. A flat active count can hide rising churn offset by rising acquisition, which is fragile.
- When growth slows, the decomposition tells you whether the problem is acquisition, retention, or resurrection so you fix the right thing.
- Segment the flows by cohort, channel, and plan to localize problems.
- Pair churn flow with reason analysis to drive retention work.

## Best practices

- Define "active" with a meaningful action, not just a login.
- Keep the period (daily, weekly, monthly) consistent and matched to your usage cadence.
- Always validate the identity reconciles before trusting the chart.
