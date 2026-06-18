---
name: Product Analytics
description: Stand up product analytics with a clean event taxonomy and the right metrics.
---

# Product Analytics

You cannot improve what you do not measure, but most teams measure the wrong
things badly. A messy event taxonomy is technical debt that misleads every
decision built on it. This skill sets up analytics that actually inform product
work.

## Start With Questions, Not Events

Before instrumenting anything, write the decisions analytics must inform:

- Where do users drop off before first value?
- Which features correlate with retention?
- What does an activated user do that a churned one did not?

Instrument backward from these questions. Tracking everything "just in case"
produces noise nobody queries.

## Event Taxonomy

A disciplined naming convention is the foundation. Get it wrong and you spend a
year cleaning data.

- Use a consistent structure: object-action (e.g. `project_created`,
  `invite_sent`). Pick one convention and enforce it.
- Define properties deliberately: each event carries the context you will
  segment by (plan, source, role).
- Maintain a tracking plan — a single source of truth listing every event, its
  properties, and its owner. This is the contract between product, eng, and
  data.
- Govern changes: new events go through review so the taxonomy does not rot.

## The North Star and Inputs

- Pick one north-star metric that captures delivered value (e.g. weekly active
  teams, queries run, documents shipped) — not a vanity count.
- Decompose it into input metrics you can actually move (acquisition,
  activation, engagement, retention).

## Core Analyses

### Funnels
Map the path to first value and measure conversion at each step. The biggest
drop-off is your highest-leverage fix. Watch time-to-convert, not just rate.

### Cohort Retention
Group users by signup period and track retention over time. A healthy product
shows a retention curve that flattens (a "smile" for the best products); a
curve decaying to zero means no product-market fit yet.

### Activation
Define the activation event — the action that predicts long-term retention
(the "aha moment"). Find it by comparing what retained users did early versus
churned users. Then optimize the funnel to it.

### Feature Adoption
Track breadth (how many use a feature) and depth (how often). Correlate
adoption with retention to prioritize the roadmap.

## Avoid Vanity Metrics

- Total signups, total pageviews, cumulative anything — they only go up and
  inform nothing.
- Prefer rates and cohorts over totals; prefer leading indicators over lagging
  ones.

## Tooling and Hygiene

- Choose one analytics tool as the source of truth; pipe to a warehouse for
  deep analysis.
- Validate instrumentation regularly — silent tracking bugs corrupt every
  downstream decision.
- Document metric definitions so "active user" means the same thing to everyone.

## Deliverable

Produce an analytics plan: the decision questions, a north-star metric with
input-metric tree, an event tracking plan with naming convention, and the
priority analyses (activation funnel, cohort retention) to build first.
