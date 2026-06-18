---
name: On-Call Handoff
description: Produces a crisp on-call shift handoff note covering open incidents, watch items, recent changes, and context the incoming engineer needs. Use at the end of each on-call shift to ensure continuity.
---

# On-Call Handoff

A handoff note transfers your mental model, not just your ticket queue. The incoming engineer should be able to respond to the next alert without asking you anything.

## Structure (use this order)

### 1. Shift Summary (2-3 lines)

SEV count by level, total pages received, and one-sentence characterization of the shift. 'Quiet — 2 SEV4 tickets, no pages.' or 'Rough — 1 SEV2 that took 4 hours to resolve, system is stable now.'

### 2. Open Incidents

For each open or partially-resolved incident:
- Ticket or incident ID and title.
- Current status and last action taken.
- What you expect to happen next and by when.
- Who owns it if it is not on-call.

If there are none, say so explicitly. 'No open incidents.'

### 3. Watch Items

Things that are not incidents yet but could become one. Limit to 3-5 items.

For each: describe the signal, why it is concerning, and what threshold should trigger paging. Include the dashboard link.

Example: 'Payment latency at p99 = 820ms, normal is under 400ms. No SLO breach yet. If it crosses 1s for 10 minutes, page the payments team. Link: [dashboard].'

### 4. Recent Changes

Any deploy, config change, migration, or infrastructure change in the last 24 hours. These are the first suspects when the next alert fires.

Format: [Time] [Service] [What changed] [Who made it] [Rollback? Y/N]

### 5. Context and Notes

Anything the incoming engineer needs that does not fit above. Vendor communications in progress, a scheduled maintenance window, a known flaky alert, a fix that is pending review. Keep it to bullet points.

### 6. Escalation Contacts (only if non-standard)

If a vendor ticket is open or an unusual escalation path is active, list the contact and reference number here.

## Do / Don't

- Do: write the handoff before your shift ends, not after the next person has already started.
- Do: link to tickets, dashboards, and Slack threads — do not copy-paste their contents.
- Don't: include solved incidents with no follow-up. Past is past unless a watch item remains.
- Don't: under-communicate a watch item because you think it will probably resolve. If you are watching it, they need to know.
- Don't: use jargon the incoming engineer might not know. If the service has an unusual architecture, add one sentence of context.
