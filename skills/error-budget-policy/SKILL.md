---
name: Error Budget Policy
description: Defines and applies an SLO error-budget policy that gates feature work versus reliability work based on remaining budget. Use when setting up SLOs or when high burn rate lacks a formal team response protocol.
---

# Error Budget Policy

An error budget without a policy is a number nobody acts on. The policy converts budget state into team behavior automatically, without requiring a manager decision each time.

## Define the Budget

Error budget = (1 - SLO target) x window duration.

Example: 99.9% SLO over 30 days = 0.1% x 30 days x 24 hours = 43.2 minutes of allowed downtime.

Track budget as a percentage remaining, not as raw minutes. 'Budget: 34% remaining' is actionable. 'Budget: 14.7 minutes remaining' is not.

## Four Policy States

Define exactly four states and the automatic team behavior each one triggers.

### Green (budget above 50%)

Feature work proceeds at full velocity. No reliability-only sprints required. On-call improvements are encouraged but not mandatory. Treat this state as the reward for good reliability work.

### Yellow (budget between 20% and 50%)

Feature work continues but every sprint must include at least one reliability or observability ticket. The team reviews burn rate trend weekly. No new non-critical migrations or risky deploys without IC sign-off.

### Orange (budget between 0% and 20%)

Feature work is paused for engineers on the service. The team shifts to reliability work: fixing root causes of recent incidents, improving alert coverage, reducing toil. No new features ship until budget is back above 20%. Exception: security patches and compliance work.

### Red (budget exhausted or SLO breach active)

Freeze all feature deploys immediately. Escalate to engineering lead and product manager. Convene a reliability review within 48 hours to decide: (a) improve reliability, or (b) formally lower the SLO to match actual capability. Do not silently operate below SLO.

## Budget Consumption Rules

- Planned maintenance counts against the budget unless users were notified and no user-impacting errors occurred.
- Incidents caused by a dependency consume budget. Track them separately and use the data in vendor reviews.
- Budget does not roll over month to month. Surplus in January does not excuse a breach in February.

## Governance

- Publish the current budget state in the team's Slack channel weekly. One line: service name, SLO, budget remaining, state color.
- Review SLO targets annually. An SLO that is always green without effort is set too low.
- Product and engineering agree on the policy in writing before it is enforced. Policy surprises cause more damage than missed SLOs.

## Do / Don't

- Do: automate the state calculation and publish it. Manual tracking fails within two months.
- Do: tie the policy to a real window (rolling 30 days is standard). Calendar month windows create perverse incentives at month-end.
- Don't: let teams renegotiate the policy during an Orange or Red state. That is when pressure to bend it is highest and discipline matters most.
- Don't: apply the same SLO to every endpoint. Tier your services: critical, standard, best-effort. Different tiers, different policies.
