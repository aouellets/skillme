---
name: objection-handling-and-speed-to-lead
description: Use when a gym owner is losing leads to slow follow-up or to objections. Triggers on "respond to leads faster", "speed to lead", "my leads go cold", "follow-up sequence", "handle the price objection", "they want to ask their spouse", "let me think about it", "no-show follow-up". Encodes speed-to-lead, the four-objection response framework, and the multi-touch follow-up cadence.
---

# Objection Handling and Speed to Lead

Two things lose gym leads: contacting them too slowly, and folding at the first
objection. This skill fixes both. It sets the speed-to-lead system that reaches
every lead within minutes, the multi-touch cadence that follows up for days, and
the response framework that dissolves the four objections every gym hears.

It receives leads from gym-meta-ads-funnel and core-four-lead-engine, and it
feeds booked consults into closer-sales-script.

## When to use this skill

Use it when leads go cold, follow-up is slow or inconsistent, or consults stall
on price, time, the spouse, or "let me think about it." Use it to build the
follow-up sequence and to drill the objection responses with the team.

## The operating procedure

### Step 1: Contact every lead within minutes

The single biggest lever in lead conversion is response time. A lead is hottest
the moment they submit. Minutes later they are browsing competitors or back to
their day.

- Target first contact within 5 minutes, every time, during business hours.
- First touch is a call. If no answer, text immediately, then email. All three
  within the first few minutes.
- Use an alert or rotation so a lead never waits. If the owner cannot answer,
  someone owns it.

Run speed_to_lead_impact.js to see what current response time costs in lost
members. See references/followup-cadence for the full sequence.

### Step 2: Run the multi-touch cadence by lead state

Most leads do not convert on the first touch. Persistence, not pressure, wins.
Build a cadence per lead state and run it until they book, buy, or opt out.

- Unbooked lead (submitted, not booked): aggressive first day (call, text,
  email), then daily for several days, then spaced out.
- No-show (booked, did not attend): contact within minutes of the missed time,
  warm and non-judgmental, rebook immediately.
- Unsold (consulted, did not buy): follow up over days with value and a clear
  path back, not just "are you ready yet."

Use the followup-sequence template for ready scripts mapped to each state.

### Step 3: Handle the four objections with one framework

Almost every gym objection is price, time, spouse, or "let me think about it."
Run the same four moves on each: acknowledge, reframe, isolate, close.

- Acknowledge: validate the concern so they feel heard.
- Reframe: shift the frame to the cost of inaction or the real value.
- Isolate: ask the question that confirms it is the only thing in the way.
- Close: once isolated and answered, ask for the decision again.

See references/objection-playbook for the real concern behind each and multiple
scripts. The quick versions:

- Money: acknowledge, reframe price against the cost of staying stuck and the
  value of the result, isolate ("if the investment worked, is this the right
  fit?"), offer a payment plan, close.
- Time: acknowledge, reframe that the program is built for busy people and saves
  time by removing guesswork, isolate, close on a start date.
- Spouse: acknowledge, reframe that their health is a shared win, isolate ("if
  your partner is on board, are you in?"), offer to include the partner in the
  conversation, close.
- Think about it: acknowledge, reframe that "thinking about it" is usually one
  specific unanswered question, isolate that question, answer it, close.

### Step 4: Drill it and put it on the floor

Print objection-cards for quick reference during consults and follow-up. Run the
team through each objection until the responses are natural. A scripted response
delivered warmly beats an improvised one every time.

## Calculator

Self-contained Node script. Save as `speed_to_lead_impact.js` and run with
`node speed_to_lead_impact.js`. The contact-rate assumptions are illustrative;
edit them to match the gym's own data. No dependencies.

```javascript
// Speed-to-lead impact. ILLUSTRATIVE assumptions. Edit to your data.
// Run: node speed_to_lead_impact.js
const inputs = {
  monthlyLeads: 100,
  currentResponseMinutes: 120, // current average first-response time
  targetResponseMinutes: 5,    // the goal
  closeRateOfContacted: 0.30,  // share of contacted leads that join
  membershipLtv: 1558,         // contribution LTV per member
}

// Illustrative contact-rate curve by response time. Edit these buckets.
function contactRate(minutes) {
  if (minutes <= 5) return 0.90
  if (minutes <= 30) return 0.70
  if (minutes <= 60) return 0.55
  if (minutes <= 240) return 0.40
  return 0.25
}

function impact(i) {
  const cur = contactRate(i.currentResponseMinutes)
  const tgt = contactRate(i.targetResponseMinutes)
  const curMembers = i.monthlyLeads * cur * i.closeRateOfContacted
  const tgtMembers = i.monthlyLeads * tgt * i.closeRateOfContacted
  const extraMembers = tgtMembers - curMembers
  const extraValue = extraMembers * i.membershipLtv
  return { cur, tgt, curMembers, tgtMembers, extraMembers, extraValue }
}

const r = impact(inputs)
const pct = (n) => (n * 100).toFixed(0) + '%'
console.log('Current contact rate:  ', pct(r.cur), 'at', inputs.currentResponseMinutes, 'min')
console.log('Target contact rate:   ', pct(r.tgt), 'at', inputs.targetResponseMinutes, 'min')
console.log('Members now / month:   ', r.curMembers.toFixed(1))
console.log('Members faster / month:', r.tgtMembers.toFixed(1))
console.log('Extra members / month: ', r.extraMembers.toFixed(1))
console.log('Extra value / month:   ', '$' + Math.round(r.extraValue).toLocaleString('en-US'))
```

### Worked example output

```
Current contact rate:   40% at 120 min
Target contact rate:    90% at 5 min
Members now / month:    12.0
Members faster / month: 27.0
Extra members / month:  15.0
Extra value / month:    $23,370
```

Read it, with the illustrative numbers: cutting first response from two hours to
five minutes lifts contact rate from 40 to 90 percent, which on 100 leads is 15
extra members a month worth over 23,000 in lifetime contribution. The exact
figures depend on the gym's real contact curve, but the shape always holds:
faster response, more contacted, more members. Replace the buckets with your own
data to make it precise.

## Template: followup-sequence

Ready scripts mapped to the cadence. Replace FILL fields.

```
UNBOOKED LEAD
  Min 0:  CALL. "Hi [name], it's [coach] from [gym]. You just asked about the
          [challenge]. Got two minutes?"
  Min 2:  TEXT. "Just tried you, [name]. Here's the link to grab your spot: [link].
          What's the best time to chat today?"
  Min 5:  EMAIL. Subject "Your spot in the [challenge]". Body: offer + booking link.
  Day 1-3: one call + one text daily.
  Day 4-10: every 2-3 days, lead with value (a tip, a result).

NO-SHOW
  +5 min: TEXT. "Missed you at [time], [name], everything ok? Let's grab another
          time, I held your spot."
  +1 hr:  CALL to rebook.
  Day 1:  EMAIL with the booking link and a short result story.

UNSOLD (consulted, didn't join)
  Day 1:  TEXT. "Great meeting you, [name]. The [result] is absolutely doable.
          Whenever you're ready, your spot's here: [link]."
  Day 3:  value touch (client transformation that matches their goal).
  Day 7:  CALL. "Checking in. What's the one thing still holding you back?"
  Day 14: final offer / deadline reminder.
```

## Template: objection-cards

Quick-reference cards for the sales floor.

```
MONEY
  Acknowledge: "I hear you, it's an investment."
  Reframe:     "What's it costing you to stay where you are?"
  Isolate:     "If the money worked, is this the right program for you?"
  Close:       offer payment plan, then "Let's get you started."

TIME
  Acknowledge: "You're busy, that's exactly who this is built for."
  Reframe:     "We remove the guesswork, so it saves time, not adds it."
  Isolate:     "If it fit your schedule, would you start?"
  Close:       "Here's a session time that works around your week."

SPOUSE
  Acknowledge: "Makes sense to talk it over."
  Reframe:     "Your health is a win for both of you."
  Isolate:     "If your partner's on board, are you in?"
  Close:       "Let's get them on a quick call now so you can decide together."

THINK ABOUT IT
  Acknowledge: "Of course."
  Reframe:     "Usually 'think about it' means one specific question. What is it?"
  Isolate:     [answer that one thing]
  Close:       "Now that that's clear, let's get you going."
```

## references/objection-playbook

The real concern behind each objection and why the framework works:

- Money. The real concern is usually doubt it will work, not the dollars. Raise
  perceived likelihood (proof, guarantee) and the price objection often
  dissolves. If it is truly cash flow, a payment plan solves it. Never discount
  first; that confirms the price was inflated.
- Time. The real concern is fear of one more thing they cannot keep up. Reframe
  the program as the thing that removes effort, with done-for-you plans and short
  sessions. Show how it fits a real week.
- Spouse or partner. Sometimes real, sometimes a soft no. Isolate to find out: if
  partner approval is the only blocker, bring the partner into the conversation.
  If they still hesitate, there is another concern to surface.
- Think about it. Almost always a single unanswered question or unspoken doubt.
  Your job is to find it. "What specifically do you want to think through?"
  surfaces the real objection so you can address it now, while desire is high.

Give two or three scripts per objection so the team can vary tone and not sound
canned. The framework stays constant: acknowledge, reframe, isolate, close.

## references/followup-cadence

The follow-up math: most sales happen after multiple touches, yet most gyms quit
after one or two. The gap between a gym that follows up twice and one that
follows up eight times over two weeks is enormous, and it costs nothing but
discipline.

Build it as a system, not willpower:

- Define the cadence per lead state (unbooked, no-show, unsold) with exact timing
  and channel.
- Make each touch easy to send: pre-written scripts in the followup-sequence
  template.
- Track touches per lead so none falls through.
- Lead with value on later touches, not just "are you ready." A useful tip or a
  matching result keeps the door open without nagging.
- Set an end point and a final-offer touch, then close the loop.

Speed gets the contact; persistence gets the sale. Run both.
