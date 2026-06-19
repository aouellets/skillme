---
name: gym-pricing-and-guarantees
description: Use when a gym owner is setting prices or designing a guarantee. Triggers on "what should I charge", "set my membership price", "price my challenge", "design a guarantee", "is a money-back guarantee safe", "how risky is my guarantee", "premium pricing". Encodes value-based pricing and the guarantee-type framework from $100M Offers, with margin math so a guarantee never bleeds the gym.
---

# Gym Pricing and Guarantees

Price on the value and outcome you deliver, not on what it costs you to deliver
or on what the gym down the road charges. Then add a guarantee that removes the
buyer's risk without putting the business at risk. This skill sets the gym's
price points and designs guarantees you can actually afford.

This skill owns price points and guarantee language. The offer stack that
justifies the price is built in grand-slam-offer-builder, and whether the price
self-funds growth is tested in gym-money-model.

## When to use this skill

Use it when the owner asks what to charge, wants to set or raise prices, or asks
whether a guarantee is safe. If they are pricing the challenge to break even on
ads, run gym-money-model alongside this.

## The operating procedure

### Step 1: Price on value, not cost or competitor

Three rules:

- Anchor high, then justify with the stacked value. A 499 challenge next to a
  list of inclusions worth far more reads as a deal. The same 499 with no
  framing reads as expensive.
- Do not cost-plus. Adding a margin to your delivery cost caps the price at your
  imagination of cost, not the buyer's desire for the outcome.
- Do not match the local discount gym. Matching a budget competitor tells the
  buyer you are the same thing for less, which destroys the premium position.
  Higher price can raise perceived likelihood, because people trust that results
  cost something.

Discounting is the fastest way to kill perceived value. If you must move on
price, add value or remove an inclusion instead of cutting the number. See
references/pricing-on-value.

### Step 2: Set the three price points

A single-location gym usually runs three tiers. Set each with a target gross
margin and a one-line value justification.

- Front-end challenge. Priced to clear the 2x cash rule from gym-money-model,
  commonly 199 to 599 depending on market. Target margin on delivery 60 to 70
  percent. Justification: the stacked challenge value versus the price.
- Core membership. The recurring engine. Priced on the ongoing transformation
  and community, monthly, commonly 129 to 199. Target margin 65 to 75 percent.
  Justification: cost per week of coaching versus a personal trainer.
- Semi-private or high-ticket. Small-group or hybrid coaching for buyers who
  want more access, commonly 249 to 500 plus monthly. Target margin 60 to 70
  percent. Justification: near-personal-training results at a fraction of
  one-to-one cost.

Fill the price-architecture template with the gym's actual numbers.

### Step 3: Choose a guarantee by risk and confidence

A guarantee converts because it moves risk from the buyer to the seller. Pick
the type by how confident you are in fulfillment and how much risk the business
can carry. See references/guarantee-types for full mechanics.

- Unconditional. Full refund, no questions, within a window. Highest conversion,
  highest risk. Use only when margin is fat and refund rates are proven low.
- Conditional. Refund or free extension only if the member did their part:
  attended a minimum number of sessions, logged meals, hit check-ins. Lower risk
  because non-doers do not qualify, and the conditions drive the behavior that
  produces results. Best default for a gym.
- Anti-guarantee. No refunds, stated plainly, framed as commitment ("this is for
  people ready to commit"). Filters for serious buyers. Use on high-ticket where
  buy-in matters.
- Implied or performance guarantee. You tie payment or continuation to a result
  ("hit your goal or your next month is free"). Powerful and high-risk; only use
  with a measurable goal and a confident system.

### Step 4: Check the guarantee against margin

Before you publish any refundable guarantee, run margin_check.js. It shows the
effective margin after expected refunds and the breakeven refund rate: the share
of buyers who can claim before the offer stops making money on delivery. If the
breakeven is comfortably above any realistic refund rate, the guarantee is safe.
A conditional guarantee with required actions keeps real refund rates low, which
is why it is the safe default.

### Step 5: Write the guarantee language and conditions

State the promise, the window, and the exact conditions in plain language. The
conditions protect the business and double as the behaviors that create the
result. Use the guarantee-language template. Hand the chosen guarantee back to
the offer canvas in grand-slam-offer-builder.

## Calculator

Self-contained Node script. Save as `margin_check.js` and run with
`node margin_check.js`. No dependencies.

```javascript
// Guarantee margin check. Edit inputs, then: node margin_check.js
const inputs = {
  price: 499,          // what the buyer pays
  fulfillmentCost: 150, // cost to deliver, incurred even if later refunded
  refundRate: 0.10,    // assumed share of buyers who claim the guarantee
}

function check(i) {
  const grossMargin = (i.price - i.fulfillmentCost) / i.price
  // Refunded buyers get the price back but you already spent fulfillment.
  const profitPerSale = i.price * (1 - i.refundRate) - i.fulfillmentCost
  const effectiveMargin = profitPerSale / i.price
  // Breakeven: refund rate where profit per sale hits zero.
  const breakevenRefundRate = 1 - i.fulfillmentCost / i.price
  return { grossMargin, profitPerSale, effectiveMargin, breakevenRefundRate }
}

const r = check(inputs)
const pct = (n) => (n * 100).toFixed(1) + '%'
console.log('Gross margin (no refunds):  ', pct(r.grossMargin))
console.log('Profit per sale at refund:  ', '$' + r.profitPerSale.toFixed(2))
console.log('Effective margin w/ refunds:', pct(r.effectiveMargin))
console.log('Breakeven refund rate:      ', pct(r.breakevenRefundRate))
console.log(
  inputs.refundRate < r.breakevenRefundRate
    ? 'Verdict: guarantee is affordable on delivery cost.'
    : 'Verdict: refunds exceed breakeven, this guarantee loses money.'
)
```

### Worked example output

```
Gross margin (no refunds):   69.9%
Profit per sale at refund:   $299.10
Effective margin w/ refunds: 59.9%
Breakeven refund rate:       69.9%
Verdict: guarantee is affordable on delivery cost.
```

Read it: at a 10 percent refund rate the challenge still keeps 60 percent
margin, and you would have to refund roughly 7 in 10 buyers before delivery
turns unprofitable. That cushion means the owner can offer a strong guarantee.
Note this covers delivery cost only; acquisition cost is separate and lives in
gym-money-model, so keep real refund rates low to protect the ad spend too.

## Template: price-architecture

```
GYM PRICE ARCHITECTURE. [FILL: gym name]

TIER              PRICE        MARGIN TARGET   VALUE JUSTIFICATION (one line)
Front-end         $[FILL]      [FILL]%         [FILL]
Core membership   $[FILL]/mo   [FILL]%         [FILL]
Semi/high-ticket  $[FILL]/mo   [FILL]%         [FILL]

Anchor line for the front-end:
  "[FILL: $X,XXX of coaching and support for $YYY]"
```

## Template: guarantee-language

Three ready scripts. Replace the FILL fields with the gym's numbers.

```
1. CONDITIONAL RESULTS GUARANTEE (safe default)
"Complete the [FILL: 6-week] challenge and follow the plan. Attend at least
[FILL: 16 of 24] sessions, log your nutrition each week, and make every check-in.
If you do all of that and do not [FILL: lose 5% body fat / drop a size], we coach
you free until you do."

2. SATISFACTION GUARANTEE (window-based)
"Train with us for [FILL: 14] days. If you do not love your coaching and your
plan, tell us by day [FILL: 14] and we refund every dollar. No forms, no friction."

3. ATTENDANCE-CONDITIONED GUARANTEE (drives the behavior that works)
"Show up for [FILL: 3] sessions a week for the full [FILL: 6 weeks]. If you hit
that attendance and do not see the result we promised, your next [FILL: month]
is on us."
```

## references/pricing-on-value

Anchoring works because price is judged by comparison, not in isolation. Present
the stacked value first, then the price, and the price lands against the value
rather than against the buyer's wallet. Premium positioning compounds this: a
higher price signals a stronger result and raises perceived likelihood, the
exact lever most gyms are weakest on.

Why discounting hurts: a discount teaches the buyer the real value was lower and
that waiting earns a better deal. It also attracts the price-shopper, the member
most likely to churn. When a prospect pushes on price, the move is to restate the
value, offer a payment plan, or remove an inclusion, never to cut the number.
Hold price and let the offer do the work.

## references/guarantee-types

- Unconditional. "Money back, no questions, 30 days." Mechanics: full refund in a
  window. Risk: highest; a weak fulfillment system or a refund-prone audience can
  drain cash. Conversion lift: largest. Fit: established gym with proven low
  refund rate and healthy margin.
- Conditional. "Do the work and get the result, or we keep coaching you free."
  Mechanics: refund or free extension only when stated actions were met. Risk:
  low, because the conditions exclude non-doers and create the behavior that
  produces results. Conversion lift: strong, and it pre-sells the behavior. Fit:
  the default for most gym challenges.
- Anti-guarantee. "No refunds. This is for the committed." Mechanics: states
  there is no refund and frames it as a filter. Risk: lowest for the business.
  Conversion: lower volume, higher-quality buyers. Fit: high-ticket and coaching
  where commitment predicts results.
- Implied or performance guarantee. "Hit the goal or the next month is free."
  Mechanics: ties continuation or payment to a measurable result. Risk: high if
  the goal is vague or the system is weak. Conversion lift: very strong when
  believable. Fit: a confident gym with a measurable promise and tracking.

Match the guarantee to fulfillment confidence. The stronger your system and the
better your margin, the bolder the guarantee you can afford. When unsure, ship a
conditional guarantee and run margin_check.js to confirm the cushion.
