---
name: Revenue Modeling
description: Build SaaS revenue models covering MRR, expansion, churn, and scenarios.
---

# Revenue Modeling

Build a rigorous SaaS revenue model that ties recurring revenue movements together correctly.

## The MRR bridge

Every period, MRR moves through these components. They must reconcile:

```
Ending MRR = Beginning MRR
           + New MRR          (newly acquired customers)
           + Expansion MRR    (upgrades, seat adds, cross-sell)
           + Reactivation MRR (returning churned customers)
           - Contraction MRR  (downgrades)
           - Churned MRR       (cancellations)
```

Always validate: the sum of components equals the change in MRR. A model that does not reconcile is wrong.

## Key rates

- Gross revenue churn = churned + contraction MRR / beginning MRR.
- Net revenue retention (NRR) = (beginning + expansion - contraction - churn) / beginning. NRR above 100% means the existing base grows without new logos.
- Logo churn = customers lost / customers at start.

## Cohort-based forecasting

Forecast retained revenue from existing customers using cohort retention curves, then layer new-customer cohorts on top.

```
For each acquisition cohort:
  revenue_t = cohort_initial_mrr * retention_curve[t] * expansion_factor[t]
Total_MRR_t = sum over cohorts of revenue_t + new_cohorts
```

Fit the retention curve from historical cohorts; do not assume linear decay.

## Driver-based new revenue

Model New MRR bottom-up from drivers, not a single growth rate:

```
New MRR = leads * lead_to_opp * opp_to_win * average_deal_size
```

This lets you connect marketing spend and sales capacity to revenue.

## Scenario forecasting

Build base, upside, and downside cases by flexing the key assumptions: win rate, churn, expansion, and average deal size. Keep assumptions in a single inputs sheet so scenarios are one toggle away.

```
Sensitivity: vary NRR and new-logo growth on a 2D grid, read ending ARR.
```

## Connect to cash and unit economics

- ARR = MRR * 12.
- CAC payback = CAC / (ARPA * gross margin).
- LTV:CAC ratio should exceed 3 for healthy economics.
- Model billing terms (annual prepay vs monthly) for the cash forecast, which differs from recognized revenue.

## Best practices

- Separate bookings, billings, and recognized revenue; they are not the same.
- Reconcile the MRR bridge every period against the general ledger.
- Show actuals vs forecast and track forecast accuracy over time.
- Document every assumption and its source.
- Stress-test the downside: what happens to runway if churn doubles.
