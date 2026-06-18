---
name: Tech Debt Prioritizer
description: Inventories and prioritizes tech debt items using cost-of-delay and leverage scoring. Use during quarterly planning, backlog grooming, or when preparing a debt investment proposal for leadership.
---

# Tech Debt Prioritizer

Tech debt decisions fail when made on vibes ('this code is ugly') or recency bias. This skill applies a lightweight economic frame so the right items get funded and the rest stay parked.

## Step 1 — Build the Inventory

Collect candidate items from three sources: team retros and Slack complaints (friction signals), recent incident post-mortems (reliability signals), and areas with high cycle time or frequent revert rate (velocity signals). Each item needs a one-line description, the system it lives in, and the owner who raised it. Resist the urge to filter at this stage.

## Step 2 — Score Each Item on Two Axes

Use a 1-3 scale for each axis. Cost of delay: how much does leaving this unaddressed cost per sprint in engineer time, incident risk, or opportunity cost? Leverage: how many future features or workflows does fixing this unblock or accelerate? Multiply the two scores to get a priority index. Items scoring 9 are immediate candidates; items scoring 1-2 belong in a parking lot.

## Step 3 — Classify by Quadrant

Plot items on a 2x2: high cost-of-delay / high leverage (do now), high cost-of-delay / low leverage (schedule this quarter), low cost-of-delay / high leverage (opportunistic — fold into adjacent work), low / low (document and defer). Never let the parking lot grow without a quarterly review gate that drops items older than 6 months.

## Step 4 — Size and Assign

For each 'do now' or 'this quarter' item, capture a rough t-shirt size (S / M / L / XL) and a proposed owner. Avoid assigning all debt to the same two senior engineers. Debt work is a career-growth opportunity when scoped well.

## Step 5 — Write the Proposal

When pitching to leadership, lead with business impact, not code quality. Frame it as: 'This item currently costs us X per sprint / caused Y incident / blocks Z initiative. Fixing it takes N engineer-weeks. The expected return is...' Skip the architecture lecture.

## Escape Hatches

If the backlog is enormous, timebox the inventory phase to 60 minutes and cap the list at 20 items. If stakeholders resist all debt investment, propose a 'debt tax': reserve 15-20% of each sprint and never negotiate below 10%.
