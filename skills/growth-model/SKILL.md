---
name: Growth Model
description: Build a driver-based growth model with loops, not a hockey-stick guess.
---

# Growth Model

A growth model is not a revenue forecast with a hopeful curve. It is a
driver-based system that shows how inputs (traffic, conversion, retention)
compound into output (users, revenue) — and where the leverage is. This skill
builds one you can actually steer with.

## Loops, Not Funnels

Funnels are linear and leak. Loops compound — the output of one cycle feeds the
input of the next. The most defensible growth comes from loops:

- **Viral loop**: users invite users (each new user brings k more).
- **Content loop**: usage creates content that attracts new users (SEO,
  user-generated pages).
- **Paid loop**: revenue funds acquisition that funds more revenue (works only
  if payback < cycle time).
- **Sales loop**: customers refer or expand, funding more sales capacity.

Identify which loop is your primary engine. A business with no loop rents all
its growth and stalls when spend stops.

## Model Structure

Build the model from drivers, top to bottom:

1. **Acquisition**: new users per period, split by channel, each with its own
   volume and cost.
2. **Activation**: the % who reach first value. A small activation gain
   multiplies everything downstream.
3. **Retention**: the % who stay each period — the single most powerful input
   because it compounds.
4. **Monetization**: revenue per retained user, including expansion.
5. **Referral / loop factor**: how many new users each user generates.

Output = the compounding interaction of these, period over period.

## Why Retention Dominates

Run the sensitivity: a 5-point improvement in monthly retention usually beats a
20% increase in acquisition over a 12-month horizon, because retention
compounds while acquisition is a one-time add. Model this explicitly so the
team invests where leverage is, not where it feels busy.

## Building the Projection

- Use real cohort data for retention and activation, not assumptions, wherever
  you have it.
- Project bottom-up from drivers; never draw the output curve first and
  back-fill.
- Show base / upside / downside scenarios by flexing the two or three most
  sensitive drivers.
- Tie the model to the growth instrumentation (see product-analytics) so it
  updates with reality.

## Using the Model

- Identify the constraint: the one driver that, if improved, unlocks the most
  growth. Focus the roadmap there.
- Set targets per driver, not just a top-line number, so teams own inputs they
  control.
- Re-forecast monthly against actuals; a model that is not compared to reality
  is fiction.

## Anti-Patterns

- A spreadsheet that grows revenue by a fixed % with no driver behind it.
- Ignoring retention decay — assuming everyone you acquire stays forever.
- Modeling a loop factor above 1 without evidence (true sustained virality is
  rare).

## Deliverable

Produce a driver-based growth model: the primary growth loop identified, the
acquisition / activation / retention / monetization / referral inputs, a
12-month projection with base/upside/downside, and the named constraint to
focus on next.
