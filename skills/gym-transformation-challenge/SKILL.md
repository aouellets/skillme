---
name: gym-transformation-challenge
description: Use when a gym owner is building or running a transformation challenge as a front-end offer. Triggers on "design a 6-week challenge", "transformation challenge", "challenge to membership", "front-end offer to fill my gym", "how do I convert challengers to members", "run-of-show for my challenge". Encodes the Gym Launch challenge front-end and the challenge-to-membership ascension.
---

# Gym Transformation Challenge

The transformation challenge is the gym's front-end: a time-bound program,
usually 6 weeks, that fills the gym at low friction and is engineered to convert
challengers into recurring members. Priced right, it covers its own ad spend and
fulfillment, so acquisition self-funds. Built right, it ascends a large share of
challengers into membership.

This skill structures the challenge, builds the conversion offer, and lays out
the run-of-show. It leans on three other skills: grand-slam-offer-builder for the
offer, gym-money-model for the price that breaks even, and closer-sales-script
for the week-five conversion conversation.

## When to use this skill

Use it when the owner wants a challenge designed, asks how to convert challengers
to members, or needs a week-by-week plan to run one. Build the offer first in
grand-slam-offer-builder, then structure the challenge here.

## The operating procedure

### Step 1: Structure the challenge

Decide and write down each element:

- Duration: 6 weeks is the default. Long enough for a visible result, short
  enough to feel doable.
- Promise: one specific, believable result. "Drop a dress size in 6 weeks" beats
  "get fit."
- Inclusions: sessions per week, a done-for-you nutrition plan, weekly
  accountability check-ins, a start and finish body-composition scan, a private
  group. Each inclusion removes one obstacle from the Value Equation.
- Price: set with gym-money-model so the challenge clears the 2x cash rule.
  Common range 199 to 599. The price must cover ad spend and fulfillment, with
  the back-end membership as the profit.

### Step 2: Design the ascension to membership

The challenge is not the business; the membership is. Decide before launch how a
challenger becomes a member.

- The conversion offer: a member price and terms presented at the end of the
  challenge. Make staying easier than stopping. Offer a member rate that is only
  available to challengers and only this week.
- The timing: present it in week five, after the mid-challenge win and before the
  final week, when motivation peaks. Book a results review for every challenger
  and run the CLOSER conversation there.
- The bridge: continuity of coach, group, and plan. Frame membership as keeping
  the result they just earned, not buying a new thing.

Fill conversion-offer-sheet for the exact offer presented to challengers.

### Step 3: Run the challenge week by week

Use the run-of-show. The shape:

- Pre-launch: fill the cohort, collect payment, send the welcome and the first
  scan booking.
- Week 1: onboarding, baseline scan, first win, group introductions.
- Weeks 2 to 4: deliver sessions, weekly check-ins, keep attendance high, surface
  early results publicly in the group.
- Week 5: mid-result review, present the membership conversion offer, book
  results consults.
- Week 6: final scan, celebrate transformations, close remaining conversions,
  collect testimonials and before-and-after proof for the next cohort.

See references/challenge-blueprint for the full deliverables per week.

### Step 4: Confirm the economics

Run challenge_pnl.js with the cohort's numbers. It returns the front-end profit
or loss after ad spend and fulfillment, and the projected back-end revenue from
conversions. A healthy challenge is at least breakeven on the front-end and earns
its real profit on the back end. See references/challenge-economics.

### Step 5: Produce the artifacts

Fill challenge-offer-sheet (the public offer), conversion-offer-sheet (the
end-of-challenge membership offer), and challenge-runbook (the internal
week-by-week checklist with owners and timing).

## Calculator

Self-contained Node script. Save as `challenge_pnl.js` and run with
`node challenge_pnl.js`. No dependencies.

```javascript
// Challenge P&L and back-end projection. Edit inputs, then: node challenge_pnl.js
const inputs = {
  fillCount: 20,                 // paid challengers enrolled
  challengePrice: 499,           // price per challenger
  costPerLead: 25,               // ad cost per lead
  showRate: 0.4,                 // share of leads that become paid challengers
  fulfillmentPerChallenger: 120, // cost to deliver the challenge per person
  conversionToMembership: 0.5,   // share of challengers who become members
  membershipLtv: 1558,           // contribution LTV per member (from money model)
}

function pnl(i) {
  const leadsNeeded = i.fillCount / i.showRate
  const adSpend = leadsNeeded * i.costPerLead
  const frontEndRevenue = i.fillCount * i.challengePrice
  const fulfillmentCost = i.fillCount * i.fulfillmentPerChallenger
  const frontEndProfit = frontEndRevenue - adSpend - fulfillmentCost
  const cacPerChallenger = adSpend / i.fillCount
  const newMembers = i.fillCount * i.conversionToMembership
  const cacPerMember = adSpend / newMembers
  const backEndRevenue = newMembers * i.membershipLtv
  const totalValue = frontEndProfit + backEndRevenue
  return {
    leadsNeeded, adSpend, frontEndRevenue, fulfillmentCost, frontEndProfit,
    cacPerChallenger, newMembers, cacPerMember, backEndRevenue, totalValue,
  }
}

const r = pnl(inputs)
const m = (n) => '$' + n.toFixed(0)
console.log('FRONT END')
console.log('  Leads needed:        ', Math.ceil(r.leadsNeeded))
console.log('  Ad spend:            ', m(r.adSpend))
console.log('  Challenge revenue:   ', m(r.frontEndRevenue))
console.log('  Fulfillment cost:    ', m(r.fulfillmentCost))
console.log('  Front-end profit:    ', m(r.frontEndProfit),
  r.frontEndProfit >= 0 ? '(self-funding)' : '(loss, back-end must cover)')
console.log('  CAC per challenger:  ', m(r.cacPerChallenger))
console.log('BACK END')
console.log('  New members:         ', r.newMembers)
console.log('  CAC per member:      ', m(r.cacPerMember))
console.log('  Projected LTV value: ', m(r.backEndRevenue))
console.log('TOTAL projected value: ', m(r.totalValue))
```

### Worked example output

```
FRONT END
  Leads needed:         50
  Ad spend:             $1250
  Challenge revenue:    $9980
  Fulfillment cost:     $2400
  Front-end profit:     $6330 (self-funding)
  CAC per challenger:   $63
BACK END
  New members:          10
  CAC per member:       $125
  Projected LTV value:  $15580
TOTAL projected value:  $21910
```

Read it: 1,250 dollars of ads fills 20 challengers who pay 9,980. After ads and
fulfillment the challenge nets 6,330 before a single membership sells, so it
self-funds. Half convert, adding 15,580 in projected lifetime contribution. The
front-end pays for growth; the back-end is the profit. Drop the fill or
conversion rate and watch where the model breaks.

## Template: challenge-offer-sheet

```
CHALLENGE OFFER. [FILL: challenge name]
Promise:        [FILL: one specific result in 6 weeks]
Price:          $[FILL]   (payment plan: [FILL])
Includes:       [FILL: sessions/week, nutrition plan, check-ins, scans, group]
Guarantee:      [FILL from gym-pricing-and-guarantees]
Scarcity:       [FILL: spots per cohort]
Urgency:        [FILL: start date, doors close date]
Who it's for:   [FILL: avatar]
```

## Template: conversion-offer-sheet

```
CHALLENGER-TO-MEMBER OFFER (presented week 5)
Member rate:        $[FILL]/mo  (challenger-only, this week only)
What continues:     [FILL: same coach, group, plan, sessions/week]
Onboarding bonus:   [FILL: e.g. free InBody re-test, branded gear]
Terms:              [FILL: commitment length, start date]
Why now line:       "[FILL: keep the result you just earned]"
Deadline:           [FILL: offer expires end of week 6]
```

## Template: challenge-runbook

```
CHALLENGE RUNBOOK. [FILL: cohort name / dates]

PRE-LAUNCH (owner: [FILL])
  [ ] Cohort filled to [FILL] spots, payment collected
  [ ] Welcome message + first scan booked
WEEK 1 (owner: [FILL])
  [ ] Baseline scan, onboarding, first-win session, group intros
WEEKS 2-4 (owner: [FILL])
  [ ] Sessions delivered, weekly check-ins, attendance tracked
  [ ] Early results posted in the group
WEEK 5 (owner: [FILL])
  [ ] Mid-result review, conversion offer presented, consults booked
WEEK 6 (owner: [FILL])
  [ ] Final scan, celebration, remaining conversions closed
  [ ] Before/after proof and testimonials collected
```

## references/challenge-blueprint

Full 6-week run-of-show and deliverables:

- Pre-launch (week 0): confirm payment, send a welcome that sets expectations,
  collect a starting photo and measurements, book the week-one scan. Add each
  challenger to the private group.
- Week 1: baseline body scan, movement assessment, first session designed to feel
  like a win, nutrition plan handed over, group introductions. The goal is an
  early result and the habit started.
- Week 2: first weekly check-in, address the early friction (soreness, schedule),
  publicly celebrate the first small wins in the group.
- Week 3: progress check, adjust nutrition, keep attendance high. Reinforce that
  results are tracking.
- Week 4: mid-point scan or measurement, share visible progress, begin seeding the
  idea of continuing past the challenge.
- Week 5: results review per challenger, present the conversion offer, book a
  short consult for anyone undecided. This is the conversion week.
- Week 6: final scan, transformation celebration, close remaining conversions,
  collect before-and-after photos and testimonials for the next cohort's ads.

The conversion mechanic: every challenger gets a one-to-one results review where
the coach shows the progress, names the result still available with continued
training, and presents the challenger-only member rate with a deadline. Run that
conversation with closer-sales-script.

## references/challenge-economics

What makes a challenge self-funding: the up-front challenge revenue must cover ad
spend and fulfillment, with the back-end membership as profit. The four levers
are fill count, challenge price, cost per lead (which sets ad spend through the
show rate), and conversion to membership.

Worked example, using the calculator defaults: 1,250 in ad spend fills 20
challengers paying 499 each for 9,980 in revenue. After 2,400 of fulfillment, the
front-end nets 6,330, so the challenge profits before any member converts. Ten
challengers convert at a contribution LTV of 1,558 each, projecting 15,580 of
back-end value. Total projected value is 21,910 from a 1,250 ad investment.

If the front-end runs at a loss (low price or high cost per lead), the back-end
can still justify it, but only if conversion and LTV are strong and the gym has
the cash to wait. The safer design keeps the front-end at or above breakeven so
growth never depends on borrowing against future dues.
