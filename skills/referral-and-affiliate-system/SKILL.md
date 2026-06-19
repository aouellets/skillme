---
name: referral-and-affiliate-system
description: Use when a gym owner wants others to bring in members. Triggers on "get more referrals", "set up a referral program", "bring a friend", "affiliate partners for my gym", "partner with local businesses", "incentivize referrals", "who can send me leads". Encodes the four lead-getters (customers, affiliates, agencies, employees) from $100M Leads, with referral mechanics and partner outreach.
---

# Referral and Affiliate System

Beyond the four ways you get leads yourself, there are four kinds of people who
get leads for you: your customers (referrals), affiliates, agencies, and
employees. This skill turns members into a referral engine and builds local
affiliate partnerships, then folds both into the gym's monthly cadence so they
run on schedule instead of by accident.

Referrals are the highest-trust, lowest-cost leads a gym can get, so this is
often the fastest growth lever once the gym delivers real results. It pairs with
retention-and-churn-killer, because the win that earns a referral is the same
win that keeps a member.

## When to use this skill

Use it when the owner wants more referrals, asks how to set up a referral
program, wants to partner with local businesses, or asks who else could send
leads. If results are weak, fix delivery first with retention-and-churn-killer;
nobody refers a gym that did not work for them.

## The operating procedure

### Step 1: Build a referral mechanism members actually use

Most referral programs fail because they ask at the wrong time and reward only
one side.

- Ask right after a win. The moment a member hits a result (a scan improvement, a
  personal record, a goal reached) is when they are proudest and most likely to
  refer. Train coaches to ask then, not on a random Tuesday.
- Reward both sides. The member gets something for referring and the friend gets
  something for joining. Dual-sided incentives convert far better than one-sided.
- Make the buddy challenge the default mechanic. "Bring a friend to the next
  6-week challenge and you both get [reward]." A friend lowers the friend's
  friction and raises the member's attendance.

See references/referral-mechanics for ask scripts, timing, and incentive design.

### Step 2: Build local affiliate partnerships

Affiliates are local businesses that serve the same avatar without competing.
Partner on a clear value exchange.

- Targets: physiotherapists, chiropractors, nutritionists and dietitians,
  physical therapists, corporate HR and wellness leads, running and sports clubs.
- The exchange: they refer clients to your challenge; you refer members to their
  service, run a joint event, or pay a referral fee per joined member. Keep it
  clear and tracked.
- Tracking: a unique code or link per partner, or a simple "who referred you"
  field at signup, so you know which partners produce and can double down.

Use affiliate-outreach for the first message and the partnership terms.

### Step 3: Use employees and agencies as lead-getters

- Employees: coaches and front-desk staff can each own a small referral and
  reactivation target. Align with a clear incentive tied to joined members, not
  raw leads. Never outsource the actual consult and the member relationship;
  those stay in-house.
- Agencies: a marketing agency can run paid ads at scale once the offer and
  funnel are proven. Use them to scale a working channel, never to invent the
  offer. Keep ownership of the strategy and the data.

See references/four-lead-getters for when to use each and how to align
incentives.

### Step 4: Put it in the monthly cadence

A referral program is not a poster on the wall. Schedule it:

- Each challenge cohort includes a buddy-referral push in week 5, at peak
  results.
- Coaches ask for a referral at every logged win.
- One affiliate outreach or check-in per week.
- Review referred-member counts monthly in the kpi-scoreboard-and-cadence review.

Fill referral-program-sheet to define the program and assign owners.

### Step 5: Project the volume

Run referral_projection.js to estimate referred members per month from the member
base, the referral rate, and the close rate. Use it to set a realistic target and
to size the incentive against the value of a member.

## Calculator

Self-contained Node script. Save as `referral_projection.js` and run with
`node referral_projection.js`. No dependencies.

```javascript
// Referral projection. Edit inputs, then: node referral_projection.js
const inputs = {
  memberCount: 150,            // active members
  referralsPerMemberMonth: 0.15, // referred leads each member sends per month
  closeRate: 0.5,             // share of referred leads that join
  membershipLtv: 1558,        // contribution LTV per member (from money model)
}

function project(i) {
  const referredLeads = i.memberCount * i.referralsPerMemberMonth
  const newMembersMonth = referredLeads * i.closeRate
  const newMembersYear = newMembersMonth * 12
  const annualValue = newMembersYear * i.membershipLtv
  return { referredLeads, newMembersMonth, newMembersYear, annualValue }
}

const r = project(inputs)
console.log('Referred leads / month:   ', r.referredLeads.toFixed(1))
console.log('New members / month:      ', r.newMembersMonth.toFixed(1))
console.log('New members / year:       ', Math.round(r.newMembersYear))
console.log('Projected annual value:   ', '$' + Math.round(r.annualValue).toLocaleString('en-US'))
```

### Worked example output

```
Referred leads / month:    22.5
New members / month:       11.3
New members / year:        135
Projected annual value:    $210,330
```

Read it: a 150-member gym where each member refers just 0.15 friends a month
produces about 22 referred leads, 11 new members a month, and 135 a year, worth
roughly 210,000 in lifetime contribution. Referrals at near-zero acquisition cost
can rival paid ads. Raise the referral rate with the buddy-challenge push and the
ask-after-a-win habit, and this number climbs.

## Template: referral-program-sheet

```
REFERRAL PROGRAM. [FILL: gym name]

OFFER (dual-sided)
  Member who refers gets:   [FILL: e.g. one month free / store credit]
  Friend who joins gets:    [FILL: e.g. challenge at member rate]

ASK SCRIPT (used at a logged win)
  "[FILL: You just hit X. Who do you know who'd want this too?
   Bring them to the next challenge and you both get Y.]"

TIMING
  Trigger:                  [FILL: scan win, PR, goal reached]
  Cohort push:              week 5 of every challenge
TRACKING
  Mechanism:                [FILL: code / link / "who referred you" field]
  Owner:                    [FILL]
  Monthly target:           [FILL] referred members
```

## Template: affiliate-outreach

```
AFFILIATE OUTREACH. [FILL: partner type, e.g. local physio]

OPENER (message)
  "Hi [FILL name], I run [FILL gym] nearby. We work with a lot of the same
   people you do. I'd like to send my members to you for [FILL service], and
   offer your clients a free [FILL: InBody scan / week of training] to get
   started. Open to a quick chat?"

PARTNERSHIP TERMS
  They send us:             [FILL: client referrals to the challenge]
  We send them:             [FILL: member referrals / joint event / fee]
  Referral reward:          [FILL: $X per joined member, or reciprocal]
  Tracking:                 [FILL: unique code per partner]
  Review cadence:           [FILL: monthly check-in]
```

## references/four-lead-getters

The four people who get leads for you, with mechanics and incentive alignment:

- Customers (referrals). Mechanics: members refer friends. Incentive: dual-sided
  reward, asked at a win. Highest trust, lowest cost. The first lead-getter every
  gym should build.
- Affiliates. Mechanics: complementary local businesses refer their clients.
  Incentive: reciprocal referrals, joint events, or a per-member fee. Aligns when
  both sides clearly gain and tracking is honest.
- Agencies. Mechanics: a vendor runs a channel (usually paid ads) for you.
  Incentive: paid per result or retainer. Use only to scale a proven offer and
  funnel; align on cost per member, not on leads or impressions.
- Employees. Mechanics: coaches and staff drive referrals and reactivations.
  Incentive: bonus tied to joined members. Align by rewarding members, not
  activity. Never outsource the consult or the member relationship.

What to never outsource: the offer, the consult conversation, the member
relationship, and the data. Outsource reach, not the core of the business.

## references/referral-mechanics

Timing is the whole game. A referral asked at a peak result converts several
times better than the same ask sent cold. Train coaches to ask the instant a
member hits a win, in person, specifically: "Who do you know who would want this
too?" A specific ask beats "tell your friends."

Dual-sided incentives: reward the referrer and lower the friend's friction at
once. A member who gets a month free and a friend who joins at the member rate
both have a reason to act now. Size the reward against member value: the
projection shows a member is worth over a thousand dollars in contribution, so a
month of dues as a referral reward is cheap.

The buddy challenge: the strongest gym referral mechanic. In week 5 of every
cohort, when results are visible, invite each challenger to bring a friend to the
next cohort for a shared reward. The friend gets a built-in training partner,
which also raises attendance and retention for both.
