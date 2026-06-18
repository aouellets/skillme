---
name: Supply Chain Intelligence
description: Map supplier landscapes, find concentration risks, and surface alternatives.
---

# Supply Chain Intelligence

Build a clear picture of where a product's inputs come from, where the fragile points
are, and what alternatives exist. The goal is resilience, not just cost.

## 1. Map the supply chain tiers
- **Tier 1**: direct suppliers.
- **Tier 2+**: their suppliers, and so on toward raw materials.
Most catastrophic disruptions originate below Tier 1, so push visibility deeper. For each
node capture: what they supply, location, capacity, and substitutability.

## 2. Identify concentration risks
Flag dependencies that create single points of failure:
- **Supplier concentration**: one vendor for a critical input.
- **Geographic concentration**: many suppliers clustered in one region (shared exposure
  to disaster, conflict, or regulation).
- **Sub-tier concentration**: many Tier-1 suppliers secretly relying on the same Tier-2
  source (a hidden choke point).
- **Logistics concentration**: dependence on one port, route, or carrier.

## 3. Assess each risk
Rate by likelihood and impact:
- **Impact**: how much does losing this node halt production? Days of buffer inventory?
- **Likelihood**: geopolitical, financial (supplier solvency), natural-disaster, and
  single-source exposure.
Prioritize high-impact, high-likelihood nodes.

## 4. Surface alternatives
For critical nodes, identify alternative sources:
- Qualified second-source suppliers in different regions.
- Substitute materials or designs that reduce dependence.
- Buffer-stock or nearshoring options.
Note the switching cost and qualification lead time for each alternative — an
alternative that takes a year to qualify is not a short-term mitigation.

## 5. Output
Deliver: a tiered supply map, a ranked concentration-risk register (node | risk type |
impact | likelihood | current buffer), and an alternatives list per critical node with
switching cost and lead time. Summarize the top 3 vulnerabilities and recommended moves.

## Guardrails
- Sub-tier blindness is the biggest risk — flag where visibility ends.
- Cost and resilience trade off; state the trade-off rather than optimizing one blindly.
- Supplier data ages fast; note the date and recommend periodic refresh.
- Use public, ethically sourced information; do not infer confidential supplier terms.
