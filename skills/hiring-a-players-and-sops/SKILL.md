---
name: hiring-a-players-and-sops
description: Use when a gym owner is hiring or wants to systematize the business. Triggers on "hire a coach", "find A-players", "write a job description for my gym", "interview process", "document my processes", "write an SOP", "get out of the day-to-day", "first hire for my gym". Encodes role-outcome hiring, the A-player pay logic, and the four-step SOP method.
---

# Hiring A-Players and SOPs

A gym scales when the owner stops being the bottleneck. That takes two things:
hiring people who produce results without supervision, and documenting the work
so it can be handed off. This skill runs a role-outcome hiring funnel that finds
A-players and a four-step method that turns the owner's knowledge into SOPs
someone else can run.

It connects to kpi-scoreboard-and-cadence, because every role owns numbers on the
scoreboard, and to closer-sales-script and the lead skills, because the first
hires run those plays.

## When to use this skill

Use it when the owner is making a hire, writing a job description, building an
interview process, or trying to get out of the day-to-day by documenting work. If
the owner is drowning in operations, start with SOPs; if growth is capped by the
owner's own hours selling or coaching, start with hiring.

## The operating procedure

### Step 1: Define the role by its outcome, not a task list

A job description that lists tasks attracts task-doers. Define the outcome the
role owns.

- Write the one-line mission: what this role is responsible for producing.
- List 3 to 5 outcomes with numbers: what success looks like in 90 days and 12
  months (for example, "book 60 consults a month at a 70 percent show rate").
- List the few competencies that actually predict success in that outcome.

Fill role-scorecard with the mission, outcomes, and competencies before you post
anything.

### Step 2: Run a volume-based candidate funnel

Hiring is a funnel like lead generation. More candidates at the top means a better
hire at the bottom.

- Source widely: job boards, your member base, referrals, local networks. Aim for
  many applicants, not a few.
- Screen fast with a short application and a knockout question or two.
- Use a work sample: have finalists do the actual work. A setter does a mock
  booking call; a coach runs a real session; a manager fixes a broken process on
  paper. Work samples predict performance far better than interviews.

See references/hiring-funnel for sourcing and screening detail.

### Step 3: Pay top of market for A-players

An A-player costs more in salary and less per result. They produce more, need
less management, and stay longer. Underpaying for talent is the expensive choice.

Run ab_player_cost.js to see the cost per result. A-players usually win even at a
much higher salary, because output, not pay, sets the true cost.

### Step 4: Hire roles in the order a gym needs them

A scaling single-location gym typically hires in this order:

- Sales setter or salesperson first: someone to book and close so the owner stops
  being the only seller. This frees the most owner time and funds the next hire.
- Coach next: to deliver sessions as the member base grows, protecting retention.
- Manager last: to own the daily operation and the scoreboard so the owner can
  step out of the seat.

Each role owns clear outcomes and the numbers behind them.

### Step 5: Document work into SOPs with the four-step method

To hand off a process, document it so someone else can run it without you.

1. Do it: perform the task and capture every step as you go.
2. Document it: write the steps plainly, with the trigger, the steps, and the
   definition of done.
3. Demonstrate it: show someone the SOP in action so gaps surface.
4. Hand it off: let them run it from the document while you watch once, then step
   away.

Fill sop-template for each process. Start with the highest-frequency or
highest-risk processes (consult booking, front-desk open, new-member onboarding).
See references/sop-method.

## Calculator

Self-contained Node script. Save as `ab_player_cost.js` and run with
`node ab_player_cost.js`. No dependencies.

```javascript
// A-player vs B-player cost per result. Edit inputs, then: node ab_player_cost.js
const inputs = {
  aPlayerSalary: 70000,
  aPlayerResults: 100,  // results produced per year (e.g. members closed)
  bPlayerSalary: 45000,
  bPlayerResults: 45,
  targetResults: 100,   // results the gym needs per year
}

function compare(i) {
  const aCostPerResult = i.aPlayerSalary / i.aPlayerResults
  const bCostPerResult = i.bPlayerSalary / i.bPlayerResults
  const cheaperPct = (bCostPerResult - aCostPerResult) / bCostPerResult
  const aNeeded = i.targetResults / i.aPlayerResults
  const bNeeded = i.targetResults / i.bPlayerResults
  const aCost = aNeeded * i.aPlayerSalary
  const bCost = bNeeded * i.bPlayerSalary
  return { aCostPerResult, bCostPerResult, cheaperPct, aNeeded, bNeeded, aCost, bCost }
}

const r = compare(inputs)
const m = (n) => '$' + Math.round(n).toLocaleString('en-US')
console.log('A-player cost per result:', m(r.aCostPerResult))
console.log('B-player cost per result:', m(r.bCostPerResult))
console.log('A-player is', (r.cheaperPct * 100).toFixed(0) + '% cheaper per result')
console.log('To deliver', inputs.targetResults, 'results:')
console.log('  A-players needed:', r.aNeeded.toFixed(1), '=>', m(r.aCost))
console.log('  B-players needed:', r.bNeeded.toFixed(1), '=>', m(r.bCost))
console.log('  Savings with A-players:', m(r.bCost - r.aCost) + '/yr')
```

### Worked example output

```
A-player cost per result: $700
B-player cost per result: $1,000
A-player is 30% cheaper per result
To deliver 100 results:
  A-players needed: 1.0 => $70,000
  B-players needed: 2.2 => $100,000
  Savings with A-players: $30,000/yr
```

Read it: the A-player earns far more in salary yet costs 300 less per result and
saves 30,000 a year to deliver the same output, before counting the management
time and turnover the B-players add. Pay for output, not for the lowest sticker
price.

## Template: role-scorecard

```
ROLE SCORECARD. [FILL: role title]

MISSION (one line)
  [FILL: what this role produces]

OUTCOMES (with numbers)
  90 days:   [FILL]
  12 months: [FILL]
  Ongoing:   [FILL: e.g. book 60 consults/mo at 70% show]

COMPETENCIES (the few that predict success)
  [FILL]
  [FILL]
  [FILL]

INTERVIEW + WORK SAMPLE
  Screen question:   [FILL]
  Work sample:       [FILL: the actual task, e.g. mock booking call]
  Pass bar:          [FILL: what good looks like]
```

## Template: sop-template

```
SOP. [FILL: process name]

PURPOSE
  [FILL: why this process exists]
TRIGGER
  [FILL: what starts it]
STEPS
  1. [FILL]
  2. [FILL]
  3. [FILL]
DEFINITION OF DONE
  [FILL: how you know it was done right]
OWNER
  [FILL: role responsible]
```

## references/hiring-funnel

Sourcing: treat openings like a marketing campaign. Post where your avatar of
candidate looks, ask members and your network for referrals, and keep a pipeline
warm even when you are not hiring. Volume at the top raises the quality at the
bottom.

The role-outcome definition: candidates rise to the bar you set. A task list
("teach classes, clean equipment") attracts people who want a job. An outcome
("members you coach hit their goals and renew at 80 percent") attracts people who
want to win. Define and screen on the outcome.

Screening with work samples: interviews reward people who interview well. Work
samples reward people who do the work well, which is what you are buying. Have a
setter run a mock booking call, a coach run a real session with real members, a
manager redesign a broken process. Watch how they actually perform.

The A-player pay logic: A-players are not expensive, they are efficient. They
produce more per dollar, need less oversight, and stay longer, so the fully loaded
cost per result is lower even at a premium salary. Paying bottom of market to save
on salary usually costs more in output, management, and turnover. Run the
calculator and decide on cost per result, not on salary.

## references/sop-method

The four-step method turns tacit knowledge into a transferable process:

1. Do it. The person who already does the task performs it and records every step,
   including the small judgment calls they make without thinking.
2. Document it. Write it plainly: purpose, trigger, numbered steps, definition of
   done, and owner. Short and specific beats long and vague.
3. Demonstrate it. Walk someone through the SOP live. Wherever they get confused,
   the document is missing a step; fix it.
4. Hand it off. Let the new owner run it from the document while you observe once,
   then step away. The test of an SOP is that it works without you in the room.

Worked example, consult booking SOP:

- Purpose: turn a new lead into a booked consult fast.
- Trigger: a lead submits a form.
- Steps: call within 5 minutes; if no answer, text then email; offer two specific
  times; confirm with a calendar invite; send a reminder the day before.
- Definition of done: consult on the calendar with a confirmation sent.
- Owner: the setter.

Document the highest-frequency and highest-risk processes first. Each SOP you
finish is one more thing the owner no longer has to do personally.
