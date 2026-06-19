---
name: retention-and-churn-killer
description: Use when a gym owner is losing members or wants to keep them longer. Triggers on "reduce churn", "members are quitting", "improve retention", "onboarding for new members", "first 100 days", "win back cancelled members", "save a member who wants to quit". Encodes onboarding, results delivery, churn-signal saves, and community mechanics that extend membership tenure.
---

# Retention and Churn Killer

Acquisition fills the gym; retention is what makes it worth filling. Every month
a member stays raises their lifetime value and lowers the pressure on the
acquisition engine. This skill engineers the first 100 days, makes results
visible, catches members before they quit, and builds the community that raises
the cost of leaving.

It is tied to gym-money-model, because tenure is a direct input to LTV, and to
referral-and-affiliate-system, because the win that retains a member is the win
that earns a referral.

## When to use this skill

Use it when members are quitting, retention is weak, onboarding is ad hoc, or the
owner wants to win back cancelled members. If acquisition economics look broken,
check here first; low tenure is often the real leak, not high CAC.

## The operating procedure

### Step 1: Engineer the onboarding sprint

The first 100 days decide whether a member stays for years or quits in a quarter.
The more a member uses the gym early, the more they value it. Design the start.

- First session: a guaranteed win. A baseline scan, a clear plan, a coach who
  knows their name and goal. They should leave proud they came.
- First week: three sessions booked, the plan in hand, an intro to the group, one
  early measurable result. Frequency builds the habit.
- First 30 days: a check-in at day 7, 14, and 30. A visible result by day 30.
  This is the window where the habit either forms or breaks.

Use the onboarding-runbook template to make the journey a checklist with owners
and timing, not a hope.

### Step 2: Deliver and show results

Members churn when they stop feeling the outcome they bought. Make progress
visible.

- Track it: scans, measurements, lifts, attendance. What gets measured gets felt.
- Check in on a schedule: short, regular coach conversations about progress and
  obstacles, not just "how's it going."
- Make progress visible: show the member their own trend. A graph of their scan
  results or a personal-record board turns effort into evidence.

A member who can see they are winning does not quit.

### Step 3: Catch churn signals and run saves

Most members signal before they quit. The strongest signal is attendance
dropping off. Build triggers and a save play. See references/churn-signals.

- Attendance trigger: no visit in 7 to 10 days fires a save outreach. Earlier is
  better; a member who has drifted two weeks is half gone.
- The save conversation: warm, curious, not desperate. Find out what changed,
  remove the obstacle, rebook the next session. Often it is a schedule change or
  a life event, not the gym.
- Win-back: for members who already cancelled, a respectful sequence over weeks
  with a clear reason to return (a new challenge, a check-in offer).

Use save-and-winback-scripts for the conversations and messages.

### Step 4: Build community and accountability

Community raises switching cost. A member who would cancel a service will not
abandon friends and a coach who knows them.

- Accountability: pair members, run small same-goal groups, set shared targets.
- Belonging: member events, a private group, milestone celebrations, branded
  moments. Make the gym part of their identity and their week.
- Recognition: celebrate results publicly. Recognition retains the recognized
  member and shows everyone else the path.

### Step 5: Quantify the prize

Run churn_model.js to show what a small churn improvement is worth. It usually
dwarfs the cost of the onboarding and save work, which makes the case to invest
in retention.

## Calculator

Self-contained Node script. Save as `churn_model.js` and run with
`node churn_model.js`. No dependencies.

```javascript
// Churn improvement impact. Edit inputs, then: node churn_model.js
const inputs = {
  memberCount: 150,
  currentChurnRate: 0.06,  // monthly
  improvedChurnRate: 0.04, // monthly, the target
  avgMembershipValue: 159, // monthly dues per member
}

function model(i) {
  const curTenure = 1 / i.currentChurnRate
  const newTenure = 1 / i.improvedChurnRate
  const lostNow = i.memberCount * i.currentChurnRate
  const lostNew = i.memberCount * i.improvedChurnRate
  const savedPerMonth = lostNow - lostNew
  const monthlyRevenueRetained = savedPerMonth * i.avgMembershipValue
  const annualRevenueRetained = monthlyRevenueRetained * 12
  const ltvCur = i.avgMembershipValue * curTenure
  const ltvNew = i.avgMembershipValue * newTenure
  return {
    curTenure, newTenure, savedPerMonth, monthlyRevenueRetained,
    annualRevenueRetained, ltvCur, ltvNew,
  }
}

const r = model(inputs)
const m = (n) => '$' + Math.round(n).toLocaleString('en-US')
console.log('Current avg tenure:    ', r.curTenure.toFixed(1), 'months')
console.log('Improved avg tenure:   ', r.newTenure.toFixed(1), 'months')
console.log('Members saved / month: ', r.savedPerMonth.toFixed(1))
console.log('Monthly revenue kept:  ', m(r.monthlyRevenueRetained))
console.log('Annual revenue kept:   ', m(r.annualRevenueRetained))
console.log('LTV per member:        ', m(r.ltvCur), '->', m(r.ltvNew))
```

### Worked example output

```
Current avg tenure:     16.7 months
Improved avg tenure:    25.0 months
Members saved / month:  3.0
Monthly revenue kept:   $477
Annual revenue kept:    $5,724
LTV per member:         $2,650 -> $3,975
```

Read it: dropping monthly churn from 6 to 4 percent stretches average tenure from
17 to 25 months. On 150 members that keeps 3 members and 477 dollars every month,
about 5,700 a year, and raises each member's lifetime value by over 1,300. That
return usually beats spending the same effort on more ads, which is why retention
is a growth lever, not just a defense.

## Template: onboarding-runbook

```
NEW-MEMBER ONBOARDING RUNBOOK. [FILL: gym name]

DAY 0 (owner: [FILL])
  [ ] Welcome message, first session booked, plan sent
DAY 1 / FIRST SESSION (owner: [FILL])
  [ ] Baseline scan, goal confirmed, a guaranteed early win
WEEK 1 (owner: [FILL])
  [ ] 3 sessions attended, group intro, first measurable result
DAY 7 CHECK-IN (owner: [FILL])
  [ ] Coach conversation: progress, obstacles, rebook
DAY 14 CHECK-IN (owner: [FILL])
  [ ] Adjust plan, confirm habit forming
DAY 30 CHECK-IN (owner: [FILL])
  [ ] Visible result reviewed, next goal set, referral ask if a win
DAY 60 / 100 (owner: [FILL])
  [ ] Re-scan, celebrate progress, set the next milestone
```

## Template: save-and-winback-scripts

```
SAVE (attendance dropped, still a member)
  Trigger: no visit in [FILL: 7-10] days
  TEXT:  "Hi [name], missed you this week. Everything ok? Let's get your next
          session on the calendar, what day works?"
  CALL (if no reply): warm check-in, find the obstacle, rebook on the call.
  IN-PERSON save: "What changed since you started? Let's fix that together."

WIN-BACK (already cancelled)
  Week 1:  "Hi [name], no pressure at all, just checking in. How are you doing
            with your training since you left?"
  Week 2:  value or result story matching their old goal.
  Week 4:  "We're starting a new [challenge] on [date]. I'd love to have you
            back, here's a spot if you want it: [link]."
```

## references/first-100-days

The onboarding and habit-formation sequence, with milestones:

- Day 0 to 1: the strong start. A booked first session, a plan in hand, a coach
  who knows the member's name and goal, and a baseline measurement. The first
  session must end in a win, even a small one.
- Week 1: frequency. Three sessions in the first week build the habit faster than
  anything else. Introduce the member to the group so they have a face besides
  the coach.
- Days 7, 14, 30: scheduled check-ins. These are the moments members decide to
  stay or drift. A short, specific conversation about their progress keeps them
  engaged and surfaces problems early.
- Day 30 result: a visible, measured result by the first month. This is the proof
  that the program works for them, which converts a trial mindset into a member
  mindset.
- Days 60 to 100: re-scan, celebrate the trend, and set the next goal. A member
  with a next goal has a reason to keep going.

The principle: usage drives value. Every action that gets a member training more
in the first month raises the odds they stay for years.

## references/churn-signals

Leading indicators and the intervention for each:

- Attendance drop. The clearest signal. No visit in 7 to 10 days. Intervention: a
  warm save outreach and a rebook, fast. The sooner the better.
- Missed check-ins or ghosted messages. Intervention: switch channel (call
  instead of text) and a direct, caring "what changed?"
- Stalled results. A member not seeing progress will quit. Intervention: a coach
  resets the plan and finds a fresh win.
- Life events (new job, baby, injury, move). Intervention: flexibility, a hold
  option instead of a cancel, or a modified plan. Often saves the member who would
  otherwise quit outright.
- Payment failures. Intervention: a prompt, friendly fix before it becomes a
  silent cancel.

The save conversation is curious, not desperate: find what changed, remove the
obstacle, book the next session. Most "I want to quit" conversations are really
"something got in the way," and the gym can fix the something.
