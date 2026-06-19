---
name: gym-meta-ads-funnel
description: Use when a gym owner is running or planning Meta (Facebook/Instagram) ads to fill a challenge or front-end offer. Triggers on "write gym Facebook ads", "my ads aren't converting", "what should I spend on ads", "Meta ad funnel", "cost per lead too high", "ad creative for my gym", "scale my ads". Encodes the paid-ads play from the Core Four with gym ad scripts, funnel structure, and budget math.
---

# Gym Meta Ads Funnel

Paid ads are the cold, one-to-many channel of the Core Four. For a gym, the ad
sells the challenge, never the gym itself, and routes strangers into a simple
funnel that books a consult. This skill writes the creative, structures the
funnel, sets the budget, and reads the numbers against the challenge economics.

It depends on gym-transformation-challenge for the offer being sold and
gym-money-model for the economics the ad spend must respect. The moment a lead
comes in, control passes to objection-handling-and-speed-to-lead.

## When to use this skill

Use it when the owner wants ad copy, asks what to spend, says cost per lead is
too high, or wants to scale. Set the offer and price first; ads amplify a good
offer and cannot rescue a weak one.

## The operating procedure

### Step 1: Build the funnel

Keep it short. Every extra step loses people.

- Ad: sells the challenge with a clear hook and offer.
- Lead capture: a lead form (fast, native to Meta) or a landing page (more
  qualified, needs copy). Define the conversion event as the lead submission.
- Automated booking: the lead immediately gets a text and a link to book the
  intro consult. Speed matters; see step 5.
- Consult: the no-sweat intro where the challenge or membership is sold with
  closer-sales-script.

Pick lead form for volume and low CPL, landing page for higher intent. Track from
ad to booked to shown to sold, not just to lead.

### Step 2: Write the creative

Structure every ad as hook, then the angle stack: problem, mechanism, proof,
offer.

- Hook: stop the scroll. Call out the avatar and the problem. "Busy mom with no
  time to train?" or "Down to your last 15 pounds and stuck?"
- Problem: name the pain in their words.
- Mechanism: why this challenge works (small group, done-for-you plan, coaching).
- Proof: a result, a number, a before-and-after.
- Offer: the challenge, the price, the deadline, the call to action.

Produce 5 to 10 variations across angles so you can test. Angles for a gym:
busy professional, postpartum, strength, weight loss. See references/ad-anatomy
for 12 written examples and use ad-script-pack to draft 8 of your own.

### Step 3: Set targeting and budget

- Targeting: a local radius around the gym (commonly 5 to 10 miles), the avatar's
  age range, broad interests. Let Meta optimize; do not over-narrow.
- Budget: start small and let data accumulate. Run ad_budget_planner.js to turn
  the fill goal into a daily spend, expected leads, and the breakeven cost per
  lead the challenge economics allow.
- Read the funnel costs: cost per lead, cost per booked, cost per show, cost per
  sale. Judge against the challenge, not against a vanity CPL. A higher CPL that
  produces members is better than a cheap lead that never shows. See
  references/funnel-and-tracking for benchmarks.

### Step 4: Scale or kill

- Scale a winner by raising budget gradually once cost per booked is stable.
- Kill a creative when its cost per lead runs well above the others after enough
  spend to judge. Replace it with a new angle.
- More-better-new: more budget on winners, better creative on the rest, new
  angles in the queue. See references/budget-and-scaling.

### Step 5: Hand off to speed-to-lead

A booked lead is worthless if no one calls. The instant a lead submits, the
follow-up clock starts. Pass every lead to
objection-handling-and-speed-to-lead, where the rule is contact within minutes.

## Calculator

Self-contained Node script. Save as `ad_budget_planner.js` and run with
`node ad_budget_planner.js`. No dependencies.

```javascript
// Meta ad budget planner. Edit inputs, then: node ad_budget_planner.js
const inputs = {
  monthlyFillGoal: 20,           // paid challengers wanted this month
  targetCpl: 25,                 // target cost per lead
  monthlyBudget: 1500,           // ad budget for the month
  leadToFill: 0.4,               // share of leads that become paid challengers
  challengePrice: 499,           // for the breakeven CPL
  fulfillmentPerChallenger: 120, // delivery cost per challenger
}

function plan(i) {
  const dailySpend = i.monthlyBudget / 30
  const expectedLeads = i.monthlyBudget / i.targetCpl
  const expectedFills = expectedLeads * i.leadToFill
  const leadsNeeded = i.monthlyFillGoal / i.leadToFill
  const budgetForGoal = leadsNeeded * i.targetCpl
  // Front-end breakeven CPL: price = cpl/leadToFill + fulfillment  ->  solve cpl.
  const breakevenCpl = (i.challengePrice - i.fulfillmentPerChallenger) * i.leadToFill
  return {
    dailySpend, expectedLeads, expectedFills, leadsNeeded, budgetForGoal, breakevenCpl,
  }
}

const r = plan(inputs)
const m = (n) => '$' + n.toFixed(2)
console.log('Daily spend:               ', m(r.dailySpend))
console.log('Expected leads at target:  ', Math.round(r.expectedLeads))
console.log('Expected challengers:      ', Math.round(r.expectedFills))
console.log('Leads needed for goal:     ', Math.ceil(r.leadsNeeded))
console.log('Budget to hit fill goal:   ', m(r.budgetForGoal))
console.log('Breakeven cost per lead:   ', m(r.breakevenCpl))
console.log(
  inputs.targetCpl <= r.breakevenCpl
    ? 'Verdict: target CPL is below breakeven. Front-end self-funds.'
    : 'Verdict: target CPL exceeds breakeven. Back-end must carry the loss.'
)
```

### Worked example output

```
Daily spend:                $50.00
Expected leads at target:   60
Expected challengers:       24
Leads needed for goal:      50
Budget to hit fill goal:    $1250.00
Breakeven cost per lead:    $151.60
Verdict: target CPL is below breakeven. Front-end self-funds.
```

Read it: 1,500 a month is 50 a day, which at a 25 cost per lead buys 60 leads
and about 24 challengers, past the goal of 20. You only need 1,250 to hit 20, so
there is room. Breakeven cost per lead is 151.60, so even if leads got six times
more expensive the front-end would still cover itself. Plenty of margin to test.

## Template: ad-script-pack

Eight fill-in ad skeletons. Each has two hook options; pick one and complete the
stack.

```
AD 1. Avatar: busy professional
  Hook A: "[FILL: No time to train but tired of feeling out of shape?]"
  Hook B: "[FILL: Work 50 hours a week and still want to be fit?]"
  Problem:   [FILL]
  Mechanism: [FILL: 30-minute small-group sessions, done-for-you plan]
  Proof:     [FILL: client result]
  Offer:     [FILL: 6-week challenge, price, deadline] -> [CTA]

AD 2. Avatar: postpartum
  Hook A: "[FILL: Months after baby and your body still doesn't feel like yours?]"
  Hook B: "[FILL: Ready to feel strong again after baby?]"
  Problem / Mechanism / Proof / Offer: [FILL]

AD 3. Avatar: weight loss
  Hook A: "[FILL: Stuck on the same 15 pounds?]"
  Hook B: "[FILL: Tried every diet and nothing sticks?]"
  Problem / Mechanism / Proof / Offer: [FILL]

AD 4. Avatar: strength / over 40
  Hook A: "[FILL: Over 40 and losing strength every year?]"
  Hook B: "[FILL: Want to be the strong dad who keeps up?]"
  Problem / Mechanism / Proof / Offer: [FILL]

AD 5-8. Repeat the structure for: bridal/event, beginner/intimidated,
  corporate team, and a testimonial-led ad (lead with the client's words).
```

## Template: landing-page-copy

```
CHALLENGE LANDING PAGE. [FILL: challenge name]

HEADLINE:    [FILL: the promise, who it's for, the time frame]
SUBHEAD:     [FILL: the mechanism in one line]
BULLETS:     [FILL: 4-6 inclusions, each tied to an obstacle removed]
PROOF:       [FILL: 2-3 before/after results or testimonials]
GUARANTEE:   [FILL from gym-pricing-and-guarantees]
SCARCITY:    [FILL: spots per cohort]
URGENCY:     [FILL: start date / doors close]
CTA:         [FILL: "Claim your spot" -> lead form]
```

## references/ad-anatomy

Every ad is hook, problem, mechanism, proof, offer, call to action. Twelve
compact examples across four angles:

Busy professional:
1. "No time to train but sick of feeling unfit? Our 30-minute small-group
   sessions fit a lunch break. James, an accountant, dropped 18 pounds in 6
   weeks. 6-Week Challenge, 20 spots, starts Monday. Book your spot."
2. "You schedule everything but your health. We schedule it for you. Coaching,
   plan, and sessions that fit a packed week. Start the 6-Week Challenge."
3. "Out of shape and out of time? 3 sessions a week, done-for-you nutrition, real
   coaching. See results in 6 weeks or we keep coaching you free."

Postpartum:
4. "Months after baby and your body still feels foreign? A coach, a plan, and
   moms in the same place. Sarah lost her baby weight in 6 weeks. Join the next
   cohort."
5. "Strong-mom comeback in 6 weeks. Small group, real support, child-friendly
   times. Spots are limited."
6. "You took care of everyone else first. Now it's your turn. Postpartum 6-Week
   Challenge, starts soon."

Strength / over 40:
7. "Over 40 and feeling weaker every year? Rebuild strength with a coach who
   programs for your body. 6-Week Strength Reset, 20 spots."
8. "Be the dad who keeps up, not the one on the sideline. Strength and energy in
   6 weeks. Book a free intro."
9. "Lifting since forever but stuck? Coached programming and accountability.
   Start the 6-Week Reset."

Weight loss:
10. "Stuck on the same 15 pounds? It's not willpower, it's the plan. Done-for-you
    nutrition and coaching. Drop a size in 6 weeks or we coach you free."
11. "Tried every diet and nothing sticks? This time you get a coach. 6-Week
    Challenge, real results, real support."
12. "Down to your last stubborn pounds? Small-group coaching that finishes the
    job. Limited spots, starts Monday."

Each names the avatar, the pain, the mechanism, a proof point, and a clear next
step with scarcity and urgency.

## references/funnel-and-tracking

Track the whole path, not the cheapest top-of-funnel number:

- Cost per lead. Ad spend divided by leads. Useful only alongside the rates
  below.
- Cost per booked. Spend divided by booked consults. Reveals whether leads are
  real.
- Cost per show. Spend divided by consults that show. Reveals follow-up quality.
- Cost per sale. Spend divided by members. The number that matters.

Rough local-gym benchmarks: cost per lead 5 to 40 depending on market, lead to
booked around 50 percent, booked to show around 70 percent, show to sale 30 to
50 percent. Use your own numbers once you have two weeks of data. Compare cost
per sale to the breakeven from ad_budget_planner.js, not to a vanity CPL.

## references/budget-and-scaling

- Starting budget: enough daily spend to gather signal, commonly 20 to 50 a day
  for one local gym. Too little and the data is noise.
- When to scale: raise budget 20 to 30 percent at a time once cost per booked is
  stable across several days. Large jumps reset learning.
- When to kill: cut a creative whose cost per lead runs well above the set after
  enough spend to judge fairly. Do not kill on one bad day.
- Keep a queue of new angles so there is always a fresh test when a winner
  fatigues.
