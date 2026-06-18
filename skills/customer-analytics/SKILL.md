---
name: Customer Analytics
description: Cohort analysis, LTV modeling, and churn prediction from transactions.
---

# Customer Analytics

Turn transactional data into cohort, lifetime value, and churn insights.

## Build cohorts

Group customers by acquisition period and track behavior across subsequent periods.

```sql
with first_order as (
  select customer_id,
         date_trunc('month', min(order_date)) as cohort_month
  from orders group by 1
),
activity as (
  select o.customer_id,
         f.cohort_month,
         date_trunc('month', o.order_date) as active_month
  from orders o join first_order f using (customer_id)
)
select cohort_month,
       date_diff('month', cohort_month, active_month) as month_number,
       count(distinct customer_id) as active_customers
from activity group by 1, 2 order by 1, 2;
```

Render as a retention triangle: cohorts on rows, months-since-acquisition on columns.

## Retention curves

Compute the share of each cohort still active at month N. Retention usually drops fast then flattens; the flattening level is your durable base.

## Lifetime value (LTV)

Two approaches:

1. Historical: sum realized margin per customer to date.
2. Predictive: model expected future value.

A simple contractual LTV:

```
LTV = ARPU * gross_margin / churn_rate
```

For non-contractual (e-commerce), use a BG/NBD model for purchase frequency and a Gamma-Gamma model for monetary value:

```python
from lifetimes import BetaGeoFitter, GammaGammaFitter
bgf = BetaGeoFitter(penalizer_coef=0.01)
bgf.fit(rfm['frequency'], rfm['recency'], rfm['T'])
```

## RFM segmentation

Score customers on Recency, Frequency, and Monetary value into quintiles, then group into segments like Champions, At Risk, and Hibernating to target campaigns.

## Churn prediction

Define churn precisely (e.g. no purchase in 90 days). Build features:

- Recency, frequency, monetary, tenure.
- Trend features: change in order rate quarter over quarter.
- Engagement: logins, support tickets, feature usage.

Train a gradient boosting classifier, evaluate with AUC and precision at the top decile, and calibrate probabilities. Use SHAP to explain drivers so the business can act.

## Best practices

- Always exclude the most recent incomplete period from cohort charts.
- Use margin, not revenue, for LTV.
- Validate churn models on a held-out future window.
- Tie every metric to an action: who do you contact, and with what offer.
