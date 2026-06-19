---
name: core-four-lead-engine
description: Use when a gym owner needs more leads or a plan to get known. Triggers on "I need more leads", "how do I get members", "what marketing should I do", "build a lead plan", "warm outreach", "cold outreach", "what's a lead magnet". Encodes the Core Four (warm outreach, content, cold outreach, paid ads) and the lead-volume math from $100M Leads.
---

# Core Four Lead Engine

There are only four ways to let people know about the gym, and every tactic is a
version of one of them. Plot them on a grid of who you contact (people who know
you, or strangers) by how many at once (one, or many):

- Warm outreach: people who know you, one to one.
- Content: people who follow you, one to many.
- Cold outreach: strangers, one to one.
- Paid ads: strangers, one to many.

This skill picks the right channels for the gym's stage, sets the daily activity
to hit a member goal, and builds a 30-day plan the owner can actually run.

Paid ads have their own depth in gym-meta-ads-funnel. Referrals, affiliates, and
other lead-getters have their own depth in referral-and-affiliate-system. This
skill plans across all of them and hands off for execution.

## When to use this skill

Use it when the owner needs leads, asks what marketing to do, or wants a lead
plan. If the goal is to fill a specific challenge, set the member goal from
gym-transformation-challenge and the budget from gym-meta-ads-funnel.

## The operating procedure

### Step 1: Pick the starting channel by audience and budget

Start where you already have an unfair advantage.

- Existing audience (email list, social following, past members): start with
  warm outreach and content. Free, fast, highest conversion.
- Money but no audience: start with paid ads to the challenge. Buys reach
  immediately.
- Neither audience nor budget: start with cold outreach and content. Costs time,
  not money, and builds the audience that makes the other channels work.

You will run more than one channel eventually. Start with one or two you can do
daily without fail, then add.

### Step 2: Set the volume math

Back into daily activity from the member goal. The funnel is reach to lead to
booked to show to close. Decide the goal and the conversion rates, then
lead_volume.js computes the leads needed and the daily activity per channel. See
references/volume-math for how to estimate each rate.

The point of the math is to make the goal concrete. "Get more members" is not a
plan. "Have 8 warm conversations and 21 cold outreaches a day" is.

### Step 3: Run each channel with a daily minimum

Each channel works only with consistent volume. Set a daily minimum per channel
and protect it.

- Warm outreach: message people who know you with a genuine check-in, then a soft
  offer. Minimum is a fixed number of conversations a day.
- Content: post on a schedule. Each piece should show a problem the gym solves
  and a transformation. Minimum is a posting cadence you never miss.
- Cold outreach: reach strangers in your area with a relevant opener and a free
  lead magnet. Minimum is a fixed number of new outreaches a day.
- Paid ads: a daily budget against the challenge offer. Hand off to
  gym-meta-ads-funnel for creative and budget.

Scale a channel with the more-better-new sequence: do more of what works, make
it better, then add a new channel. See references/core-four-grid.

### Step 4: Use a lead magnet to convert attention into leads

Cold and content traffic does not buy yet. Offer something valuable and free or
cheap that reveals the problem the paid offer solves. A free body-composition
scan reveals the gap the challenge closes. A nutrition guide reveals how much the
prospect does not know. The lead magnet should solve a narrow problem completely
and make the next step obvious. See references/lead-magnet-design for eight gym
examples and the criteria for a good one.

### Step 5: Build the 30-day lead plan

Put it together in the template: which channels, the daily minimum for each, the
lead magnet, and the owner of each channel. Review it weekly against actual
leads. A plan you do not measure is a wish.

## Calculator

Self-contained Node script. Save as `lead_volume.js` and run with
`node lead_volume.js`. No dependencies.

```javascript
// Lead volume planner. Edit inputs, then: node lead_volume.js
const goal = {
  monthlyNewMembers: 20,
  workingDays: 22,
  // funnel conversion rates
  leadToBooked: 0.5,
  bookedToShow: 0.7,
  showToClose: 0.5,
}

// Per channel: share of total leads to source here, the native activity unit,
// and how many units of activity it takes to produce one lead.
const channels = [
  { name: 'Warm outreach', share: 0.30, unit: 'conversations', perLead: 5 },
  { name: 'Content', share: 0.20, unit: 'post impressions', perLead: 100 },
  { name: 'Cold outreach', share: 0.20, unit: 'cold outreaches', perLead: 20 },
  { name: 'Paid ads', share: 0.30, unit: 'ad leads (budget in ads skill)', perLead: 1 },
]

const shows = goal.monthlyNewMembers / goal.showToClose
const booked = shows / goal.bookedToShow
const leads = booked / goal.leadToBooked
const ceil = (n) => Math.ceil(n)

console.log('To reach', goal.monthlyNewMembers, 'new members per month you need:')
console.log('  Shows:  ', ceil(shows))
console.log('  Booked: ', ceil(booked))
console.log('  Leads:  ', ceil(leads))
console.log('Daily activity per channel (' + goal.workingDays + ' working days):')
for (const c of channels) {
  const channelLeads = leads * c.share
  const activityPerDay = (channelLeads * c.perLead) / goal.workingDays
  console.log(
    '  ' + c.name.padEnd(15),
    ceil(channelLeads) + ' leads/mo ->',
    ceil(activityPerDay), c.unit + '/day'
  )
}
```

### Worked example output

```
To reach 20 new members per month you need:
  Shows:   40
  Booked:  58
  Leads:   115
Daily activity per channel (22 working days):
  Warm outreach   35 leads/mo -> 8 conversations/day
  Content         23 leads/mo -> 104 post impressions/day
  Cold outreach   23 leads/mo -> 21 cold outreaches/day
  Paid ads        35 leads/mo -> 2 ad leads (budget in ads skill)/day
```

Read it: 20 members a month is 115 leads, which is 8 warm conversations and 21
cold outreaches every working day, content earning about 104 impressions a day,
and ads producing 2 leads a day. Now the goal is a daily checklist. Change the
shares to match the channels the gym can actually run.

## Template: 30-day-lead-plan

```
30-DAY LEAD PLAN. [FILL: gym name]. Goal: [FILL] new members.

CHANNEL          DAILY MINIMUM            LEAD MAGNET            OWNER
Warm outreach    [FILL] conversations     [FILL]                [FILL]
Content          [FILL] posts/week        [FILL]                [FILL]
Cold outreach    [FILL] outreaches        [FILL]                [FILL]
Paid ads         $[FILL]/day              [FILL: challenge]     [FILL]

WEEKLY REVIEW
  Leads target:   [FILL]      Actual: ____
  Booked target:  [FILL]      Actual: ____
  Adjust:         [FILL: which channel to do more / better / add]
```

## references/core-four-grid

The grid:

```
                ONE TO ONE            ONE TO MANY
  WARM (know)   Warm outreach         Content
  COLD (strang) Cold outreach         Paid ads
```

Channel mechanics and gym examples:

- Warm outreach. Direct messages and calls to people who know you. Lead with a
  real check-in, not a pitch. Example: message past challengers who never joined,
  congratulate a recent life event, then invite them to the new cohort.
- Content. Posts, reels, and emails to your following. Show problem and
  transformation. Example: a 30-second client before-and-after with the obstacle
  they overcame.
- Cold outreach. Messages and calls to local strangers. Lead with a free lead
  magnet, not the membership. Example: offer a free InBody scan to a local office.
- Paid ads. Bought reach to strangers. Sell the challenge, not the gym. Depth in
  gym-meta-ads-funnel.

Scaling sequence, applied to each channel before adding the next:

1. More: increase daily volume of what already produces leads.
2. Better: improve the opener, the content, the offer, the targeting.
3. New: add another channel only once the current one is consistent.

## references/lead-magnet-design

A good lead magnet solves one narrow problem completely, is fast to consume,
reveals the bigger problem the paid offer solves, and makes the next step
obvious. Eight gym examples:

1. Free week of training.
2. Free body-composition (InBody) scan and readout.
3. Five-day fat-loss kickstart guide.
4. Macro and calorie target calculator with a sample day.
5. Challenge entry at a low front-end price.
6. Free form-check session for one lift.
7. "Busy parent" 20-minute home workout pack.
8. Local corporate wellness lunch-and-learn.

Each one reveals a gap. A scan reveals body-fat the prospect did not know.
A macro calculator reveals they have been guessing. The reveal creates the desire
the challenge fulfills.

## references/volume-math

Back into activity from the goal. Work the funnel in reverse:

- Members needed equals the monthly goal.
- Shows needed equals members divided by show-to-close rate.
- Booked needed equals shows divided by booked-to-show rate.
- Leads needed equals booked divided by lead-to-booked rate.
- Activity needed per channel equals that channel's lead share times its
  activity-per-lead, divided by working days.

Estimate rates from your own history first. If you have none, start with
lead-to-booked 0.5, booked-to-show 0.7, show-to-close 0.5, and correct them after
two weeks of real data. The exact numbers matter less than running the math and
turning the goal into a daily count you can hit.
