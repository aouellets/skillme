---
name: kpi-scoreboard-and-cadence
description: Use when a gym owner wants to run the business on numbers. Triggers on "what KPIs should I track", "build a gym scoreboard", "weekly meeting agenda", "daily numbers huddle", "what metrics matter for my gym", "find my weakest funnel stage", "leading vs lagging indicators". Encodes the gym KPI set, leading-versus-lagging indicators, and the daily, weekly, and monthly cadence that runs the business.
---

# KPI Scoreboard and Cadence

A gym runs on a handful of numbers reviewed on a fixed rhythm. This skill defines
the KPIs that matter, separates the leading indicators you manage daily from the
lagging ones you watch monthly, builds the morning scoreboard, and sets the
meeting cadence where numbers turn into decisions.

It is the control panel for the whole pack: the funnel stages come from the lead
and sales skills, churn from retention-and-churn-killer, and CAC and LTV:CAC from
gym-money-model. Every role from hiring-a-players-and-sops owns a number here.

## When to use this skill

Use it when the owner asks what to track, wants a scoreboard or a meeting agenda,
or wants to find the weakest stage of the funnel. Use it weekly to run the review
and find the one stage to fix.

## The operating procedure

### Step 1: Track the KPIs by funnel stage

Organize metrics along the path from stranger to retained member, so a problem
shows up at the stage it lives in.

- Leads: new prospects captured. Source: ad platform, forms, manual log.
- Booked: leads who scheduled a consult. Source: booking calendar.
- Shown: booked consults who attended. Source: consult log.
- Closed: shows who joined. Source: sales log.
- Active members: current paying members. Source: billing.
- Churn: members lost this month divided by members at the start. Source: billing.
- Revenue: recurring plus front-end. Source: billing.
- CAC and LTV:CAC: from gym-money-model.

See references/gym-kpis for the definition, formula, source, and healthy range of
each.

### Step 2: Separate leading from lagging indicators

- Leading indicators predict the future and you can act on them today: leads,
  booked, shown, daily activity, attendance. Manage these daily and weekly.
- Lagging indicators report the past: revenue, active members, churn, LTV:CAC.
  Review these weekly and monthly. They confirm whether the leading work paid off.

Managing only lagging numbers is driving by the rearview mirror. Manage the
leading ones to change the lagging ones.

### Step 3: Run the cadence

Three meetings, each producing a decision. See references/cadence-design for full
agendas.

- Daily numbers huddle (10 minutes): yesterday's leads, booked, shown, closed,
  and today's targets. Decision: what each person does today to hit the number.
- Weekly scorecard review (30 to 45 minutes): the week's funnel and conversion
  rates, the weakest stage, and the fix. Decision: the one stage to improve and
  who owns it.
- Monthly economics review (60 minutes): revenue, churn, CAC, LTV:CAC, and the
  money model. Decision: where to invest next month and which lever to pull.

### Step 4: Find the weakest stage each week

Run scoreboard.js with the week's funnel numbers. It returns each stage's
conversion rate, the weakest stage against benchmark, and the skill to apply.
Fixing the single weakest stage moves more members than tuning everything at once.

### Step 5: Build the morning scoreboard

Put the few numbers the owner reviews every morning on one screen or board. Fill
the scoreboard template. If it does not fit on one view, it has too many numbers.

## Calculator

Self-contained Node script. Save as `scoreboard.js` and run with
`node scoreboard.js`. No dependencies.

```javascript
// Weekly funnel scoreboard. Edit inputs, then: node scoreboard.js
const week = {
  leads: 120,
  booked: 54,
  shown: 38,
  closed: 14,
}

// Healthy benchmarks for a local gym (edit to your own history).
const benchmarks = {
  leadToBooked: 0.50,
  bookedToShown: 0.70,
  shownToClosed: 0.40,
}

const fixes = {
  leadToBooked: 'objection-handling-and-speed-to-lead (faster contact, follow-up to book)',
  bookedToShown: 'objection-handling-and-speed-to-lead (reminders and confirmation sequence)',
  shownToClosed: 'closer-sales-script (sharpen the consult and the close)',
}

const stages = {
  leadToBooked: week.booked / week.leads,
  bookedToShown: week.shown / week.booked,
  shownToClosed: week.closed / week.shown,
}

// Weakest = largest shortfall below benchmark (in percentage points).
let weakest = null
let worstGap = Infinity
for (const k of Object.keys(stages)) {
  const gap = stages[k] - benchmarks[k]
  if (gap < worstGap) { worstGap = gap; weakest = k }
}

const pct = (n) => (n * 100).toFixed(1) + '%'
console.log('STAGE CONVERSIONS (actual vs benchmark)')
for (const k of Object.keys(stages)) {
  console.log('  ' + k.padEnd(14), pct(stages[k]), 'vs', pct(benchmarks[k]))
}
console.log('Weakest stage:', weakest, '(' + (worstGap * 100).toFixed(1) + ' pts vs benchmark)')
console.log('Focus this week:', fixes[weakest])
```

### Worked example output

```
STAGE CONVERSIONS (actual vs benchmark)
  leadToBooked   45.0% vs 50.0%
  bookedToShown  70.4% vs 70.0%
  shownToClosed  36.8% vs 40.0%
Weakest stage: leadToBooked (-5.0 pts vs benchmark)
Focus this week: objection-handling-and-speed-to-lead (faster contact, follow-up to book)
```

Read it: booking is the weakest stage at 45 percent against a 50 percent
benchmark, a 5-point gap, while shows and closes are near target. The fix is not
more ads or a new script; it is faster lead contact and better follow-up to get
booked. One stage, one owner, one week. Re-run next week to confirm it moved.

## Template: scoreboard

The few numbers reviewed every morning.

```
GYM SCOREBOARD. [FILL: gym name]. [FILL: date]

THIS WEEK            TARGET    ACTUAL
  Leads               [FILL]    ____
  Booked              [FILL]    ____
  Shown               [FILL]    ____
  Closed (joined)     [FILL]    ____

HEALTH (lagging)
  Active members      [FILL]    ____
  Churn this month    [FILL]%   ____
  Revenue (MTD)       $[FILL]   ____
  LTV:CAC             [FILL]:1  ____

WEAKEST STAGE THIS WEEK: [FILL from scoreboard.js]
FOCUS + OWNER:           [FILL]
```

## Template: meeting-agendas

```
DAILY HUDDLE (10 min, every morning)
  1. Yesterday: leads / booked / shown / closed
  2. Today's targets per person
  3. Blockers
  -> Decision: what each person does today to hit the number

WEEKLY SCORECARD (30-45 min)
  1. Week's funnel and conversion rates (run scoreboard.js)
  2. Weakest stage and why
  3. Last week's focus: did it move?
  -> Decision: the one stage to fix and who owns it

MONTHLY ECONOMICS (60 min)
  1. Revenue, active members, churn
  2. CAC, 30-day cash, LTV:CAC (run money_model from gym-money-model)
  3. Which lever is constrained
  -> Decision: where to invest next month, which lever to pull
```

## references/gym-kpis

Each metric, definition, formula, source, and healthy range for a local gym:

- Leads. New prospects captured. Source: ad platform and forms. Range: set by
  goal and spend; track the trend.
- Booked. Leads who scheduled a consult. Lead-to-booked formula: booked / leads.
  Source: calendar. Healthy: around 50 percent.
- Shown. Booked who attended. Booked-to-shown: shown / booked. Source: consult
  log. Healthy: around 70 percent.
- Closed. Shows who joined. Show-to-close: closed / shown. Source: sales log.
  Healthy: 30 to 50 percent.
- Active members. Current paying members. Source: billing. The base everything
  scales from.
- Churn. Members lost / members at month start. Source: billing. Healthy: 3 to 6
  percent monthly for a local gym; lower is better.
- Revenue. Recurring dues plus front-end. Source: billing. Track recurring
  separately, since it is the stable base.
- CAC. Fully loaded acquisition cost per member, from gym-money-model.
- LTV:CAC. Lifetime contribution over CAC, from gym-money-model. Healthy: at or
  above 3:1.

Pick the few that drive decisions. A scoreboard with forty numbers gets ignored;
one with eight gets used.

## references/cadence-design

The rhythm matters as much as the metrics. Each meeting has a fixed length, a
fixed agenda, and produces one decision.

- Daily huddle. Short and standing. Yesterday's funnel and today's targets. Its
  job is focus: everyone leaves knowing the number they own today. Keep it to ten
  minutes; problems that need longer get scheduled, not solved here.
- Weekly scorecard. The core operating meeting. Review the week's conversion
  rates, name the weakest stage, check whether last week's fix worked, and assign
  this week's single focus. One stage, one owner. Resist fixing everything; the
  weakest stage returns the most.
- Monthly economics. Step back to the money model. Revenue, churn, CAC, and
  LTV:CAC tell you whether the machine is healthy and where to invest. The
  decision is allocation: which lever (acquisition, conversion, retention, price)
  gets next month's attention and budget.

The pattern across all three: look at the numbers, find the one thing to change,
assign an owner, and check it next time. A cadence without a decision is just a
status update.
