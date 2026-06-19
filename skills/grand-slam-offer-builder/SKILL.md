---
name: grand-slam-offer-builder
description: Use when a gym owner needs to design or sharpen a core offer so prospects feel stupid saying no. Triggers on "build my offer", "my offer isn't converting", "what should I include", "make my offer irresistible", "design my challenge offer", "name my program". Encodes the Value Equation and the Grand Slam Offer construction and MAGIC naming methods from $100M Offers.
---

# Grand Slam Offer Builder

A Grand Slam Offer is one so strong that the right prospect feels stupid saying
no. You get there by raising the value the offer delivers and lowering the cost
in time and effort, then stacking solutions until the perceived value dwarfs the
price. This skill builds or sharpens the gym's core offers: the front-end
challenge and the core membership.

Guarantee design has its own skill. When you reach the guarantee, hand off to
gym-pricing-and-guarantees. Pricing the offer against margin also lives there.

## When to use this skill

Use it when the owner says the offer is not converting, asks what to include,
wants to make an offer irresistible, or needs to name a program. If they are
building the 6-week challenge specifically, this skill builds the offer and
gym-transformation-challenge builds the run-of-show around it.

## The operating procedure

### Step 1: Score the current offer on the Value Equation

Value rises with the dream outcome and the prospect's belief they will reach it,
and falls with the time it takes and the effort it costs:

Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort and Sacrifice).

Rate the offer 1 to 10 on each of four levers, where 10 is best:

- Dream outcome: how badly the prospect wants the result the offer promises.
- Perceived likelihood: how believable it is that they will get the result.
- Speed: how fast they feel the result arrive (this is the inverse of time
  delay, so faster scores higher).
- Ease: how little effort and sacrifice it demands (the inverse of effort, so
  easier scores higher).

Run value_score.js. It multiplies the four and names the lowest lever as the
first thing to fix, because the equation is multiplicative: the weakest lever
caps the whole offer. Fix that lever before adding bonuses. See
references/value-equation for how to raise each one.

### Step 2: Build the offer from problems

Do not start from features. Start from the outcome and work backward through
every obstacle.

1. Name the dream outcome in the prospect's words. Example: "drop two dress
   sizes before the wedding and keep it off."
2. List every problem on the path. Brainstorm freely: no time, no idea what to
   eat, intimidated by the gym floor, tried before and quit, no accountability,
   sore and discouraged in week one.
3. Turn each problem into a solution stated as the thing you provide. "No idea
   what to eat" becomes "a done-for-you meal plan with a swap list."
4. Choose a delivery vehicle for each solution: group session, one-to-one
   check-in, app, printed guide, private community, text support. Pick the
   vehicle that fits the value and your cost to deliver.
5. Trim and stack. Cut anything low-value or expensive to deliver, then stack
   the survivors into one offer that reads as overwhelming value for the price.

See references/offer-construction for a full worked example on both the
challenge and the membership.

### Step 3: Enhance with the four amplifiers

Add these only after the core stack is strong. They multiply a good offer and do
nothing for a weak one.

- Scarcity: limit real capacity. "We take 20 challengers per cohort because that
  is what our coaches can serve well."
- Urgency: a real deadline. "Cohort starts the 6th; doors close the 3rd."
- Bonuses: stack extra wins that solve adjacent problems. Each bonus gets a name
  and a stated value. A bonus should remove a specific objection.
- Guarantee: hand off to gym-pricing-and-guarantees to choose the type and write
  the language. Drop the chosen guarantee into the canvas guarantee slot.

Never fake scarcity or urgency. A deadline you do not hold trains prospects to
ignore you.

### Step 4: Name the offer with MAGIC

A good name states who it is for and what they get. Use the MAGIC formula and
pick the two or three elements that fit; you do not need all five every time.

- Magnetic reason why: the hook or occasion ("Summer Shred", "New Year").
- Avatar: who it is for ("Busy Moms", "Men Over 40").
- Goal: the outcome ("Drop a Dress Size", "First Pull-Up").
- Interval: the time frame ("6-Week", "28-Day").
- Container word: the format ("Challenge", "Project", "Bootcamp", "Intensive").

See references/naming-magic for the formula and 15 worked gym names.

### Step 5: Fill the offer canvas

Complete the one-page canvas below. That is the deliverable the owner takes to
their designer, their landing page, and their sales team.

## Calculator

Self-contained Node script. Save as `value_score.js` and run with
`node value_score.js`. No dependencies.

```javascript
// Value Equation scorer. Rate each lever 1-10 (10 = best). Run: node value_score.js
const ratings = {
  dreamOutcome: 8,        // how badly they want the result
  perceivedLikelihood: 4, // how believable the result is for them
  speed: 6,               // how fast results feel (inverse of time delay)
  ease: 5,                // how little effort it takes (inverse of effort)
}

const levers = {
  dreamOutcome: 'Dream outcome: make the promised result bigger or more specific',
  perceivedLikelihood: 'Perceived likelihood: add proof, testimonials, and a guarantee',
  speed: 'Speed: show or deliver a faster first win',
  ease: 'Ease: remove steps, do more for them, lower the effort asked',
}

const score = Object.values(ratings).reduce((a, b) => a * b, 1)
const pct = (score / 10000) * 100
const weakest = Object.keys(ratings).reduce((a, b) => (ratings[a] <= ratings[b] ? a : b))

console.log('Value score:', score, 'of 10000  (' + pct.toFixed(1) + '% of ceiling)')
console.log('Weakest lever:', ratings[weakest], '/10 ->', weakest)
console.log('Fix first:', levers[weakest])
```

### Worked example output

With the ratings above the script prints:

```
Value score: 960 of 10000  (9.6% of ceiling)
Weakest lever: 4 /10 -> perceivedLikelihood
Fix first: Perceived likelihood: add proof, testimonials, and a guarantee
```

Read it: the offer promises a result people want (8) but they do not believe
they will get it (4). No bonus fixes that. Raise belief with before-and-after
proof, a results guarantee, and named coaches, and the whole score jumps because
the equation multiplies.

## Template: offer-canvas

```
GRAND SLAM OFFER CANVAS. [FILL: offer name]

DREAM OUTCOME (in their words)
  [FILL]

PROBLEMS ON THE PATH            ->  SOLUTION  ->  DELIVERY VEHICLE
  [FILL problem]                ->  [FILL]    ->  [FILL]
  [FILL problem]                ->  [FILL]    ->  [FILL]
  [FILL problem]                ->  [FILL]    ->  [FILL]
  (add rows until every problem has a solution)

THE STACK (kept solutions, in value order)
  1. [FILL]                     value $[FILL]
  2. [FILL]                     value $[FILL]
  3. [FILL]                     value $[FILL]
  Total stacked value:          $[FILL]

PRICE
  Price:                        $[FILL]
  Value-to-price framing:       "[FILL: e.g. $2,400 of coaching for $499]"

AMPLIFIERS
  Scarcity:                     [FILL: real capacity limit]
  Urgency:                      [FILL: real deadline]
  Bonuses:                      [FILL: name + value, one per objection]
  Guarantee:                    [FILL from gym-pricing-and-guarantees]

NAME (MAGIC)
  [FILL: e.g. 6-Week Summer Shred Challenge for Busy Moms]
```

## references/value-equation

How to raise each lever for a gym:

- Dream outcome. Sell the identity and the life, not the workout. "Be the parent
  who keeps up with their kids" beats "lose 10 pounds." Make it specific and
  vivid. Tie it to an event the prospect already cares about.
- Perceived likelihood. This is usually the weakest lever and the cheapest to
  fix. Add before-and-after photos of people who look like the prospect, written
  and video testimonials, named and credentialed coaches, a clear simple plan,
  and a guarantee. Each one raises belief.
- Speed (lower time delay). Engineer an early win in week one: a measurable
  result, a body-composition scan, a personal record. Show the timeline so the
  result feels close. Do not promise unsafe speed; show a believable fast first
  win.
- Ease (lower effort and sacrifice). Do more for them. Provide the meal plan
  rather than nutrition theory. Book their sessions. Lay out the exact steps.
  Every decision you remove lowers the effort they feel.

Because the equation multiplies, a 2 on any lever caps the offer no matter how
strong the other three are. Always fix the lowest lever first.

## references/offer-construction

Worked example, challenge offer:

- Dream outcome: drop a dress size and feel confident in 6 weeks.
- Problems and solutions: no time becomes 30-minute semi-private sessions; no
  diet plan becomes a done-for-you meal plan with swaps; intimidation becomes a
  small same-goal group and a dedicated coach; quitting becomes weekly check-ins
  and a group chat; no proof of progress becomes a start and finish InBody scan.
- Vehicles: semi-private sessions, printed plus app meal plan, private group
  chat, weekly 1:1 check-in, two body scans.
- Stack and price: the stack reads as well over a thousand dollars of coaching;
  the challenge is priced at 499, anchored against that stacked value.

Worked example, membership offer (the ascension):

- Dream outcome: keep the result and make it a lifestyle.
- Stack: 3 or 4 semi-private sessions per week, quarterly body scans, ongoing
  nutrition adjustments, the community, member events, and a re-test guarantee.
- Vehicle and price: monthly recurring membership, priced on the ongoing
  transformation and the community, not per session.

The pattern is the same for both: outcome first, problems next, solutions and
vehicles, then trim and stack.

## references/naming-magic

The MAGIC formula combines a Magnetic reason why, the Avatar, the Goal, the time
Interval, and a Container word. You rarely need all five; pick the clearest two
or three. Fifteen gym examples:

1. 6-Week Summer Shred Challenge
2. 28-Day Dress Size Project for Busy Moms
3. Men Over 40 Strength Reset
4. New Year First Pull-Up Challenge
5. Postpartum Comeback 8-Week Program
6. Bridal Body 90-Day Intensive
7. Beach Body Bootcamp for Beginners
8. Drop-a-Size 6-Week Challenge
9. Dad Bod Demolition 42-Day Project
10. Holiday Hold-the-Line Maintenance Challenge
11. Couch to Confident 6-Week Start
12. Strong Mom Semi-Private Program
13. Back-to-School Busy Parent Reset
14. First Responders 6-Week Fitness Challenge
15. Over-50 Mobility and Strength Project

Test a name by reading it cold: a stranger should know who it is for, what they
get, and how long it takes.
