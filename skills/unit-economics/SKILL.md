---
name: Unit Economics
description: Calculate and improve CAC, LTV, payback, and contribution margin correctly.
---

# Unit Economics

Unit economics answer one question: does each customer make money, and how
fast? Get the definitions wrong and you will scale a business that loses money
faster the more it grows. This skill enforces honest math.

## The Four Core Metrics

### CAC (Customer Acquisition Cost)
Fully-loaded: all sales and marketing spend (salaries, tools, ad spend,
commissions) divided by new customers in the same period. The most common
mistake is counting ad spend only and ignoring people.

### Contribution Margin
Revenue per customer minus the variable cost to serve them (hosting, payment
fees, support, third-party APIs). This is the real margin that funds CAC and
overhead — not gross revenue.

### LTV (Lifetime Value)
LTV = (ARPA × gross margin %) / churn rate. Use gross margin, never raw
revenue. For SaaS, cap the horizon at 3 years for credibility; infinite-life
LTV math flatters early-stage churn.

### Payback Period
CAC / (monthly contribution margin per customer). The number of months to earn
back acquisition cost. The metric VCs trust most because it is hard to fake.

## Healthy Benchmarks

- **LTV:CAC** — 3:1 or better. Below 1:1 you lose money per customer; above 5:1
  you may be underinvesting in growth.
- **Payback** — under 12 months for SMB, under 18-24 for enterprise.
- **Contribution margin** — 70%+ for software; structurally lower for
  usage-heavy or services-heavy models.

## Segment Before You Conclude

Blended unit economics hide the truth. A great SMB segment can mask a brutal
enterprise one, or vice versa. Always compute by:

- Acquisition channel (paid vs organic CAC differ wildly).
- Customer segment / size.
- Cohort (newer cohorts may churn differently).

## Optimization Levers

To improve LTV:CAC, in order of usual leverage:

1. **Reduce churn** — the single biggest LTV lever; compounds.
2. **Expand revenue** — upsell and net-revenue-retention above 100%.
3. **Raise prices** — direct margin, often under-tested.
4. **Lower CAC** — shift to compounding channels, improve conversion.
5. **Improve gross margin** — renegotiate infra, automate support.

## Common Traps

- Using revenue instead of gross margin in LTV.
- Excluding fully-loaded headcount from CAC.
- Averaging across segments that should be separated.
- Ignoring the time value — a 30-month payback is a financing problem even if
  LTV:CAC looks fine.

## Deliverable

Produce a unit economics model: CAC, contribution margin, LTV, LTV:CAC, and
payback — computed blended and split by at least channel and segment — plus the
top three levers ranked by expected impact on payback period.
