---
name: CSAT Root Cause Analysis
description: Analyzes CSAT and NPS verbatims to surface root-cause themes and prioritize fixes by frequency and impact. Use when interpreting customer satisfaction data to inform product or process decisions.
---

# CSAT Root Cause Analysis

Raw CSAT scores tell you that something is wrong. Verbatim comments tell you what and why. The goal of root-cause analysis is to turn hundreds of individual comments into a ranked list of fixable problems.

## Data preparation

Before analyzing, filter the dataset: remove blank verbatims, remove comments that mention only a specific agent by name (these are agent-performance signals, not product/process signals), and separate detractor verbatims (score 0-6 on NPS, 1-3 on CSAT) from promoter verbatims. Analyze detractors first — they drive churn.

## Coding scheme

Apply a two-level coding scheme. Level 1 is the broad category (product bug, slow response time, unclear communication, pricing confusion, onboarding friction, feature gap, policy frustration). Level 2 is the specific sub-theme within that category. Code each verbatim with exactly one Level 1 and one Level 2 code. If a verbatim contains multiple distinct complaints, split it into sub-comments before coding.

## Prioritization matrix

After coding, calculate two numbers for each theme: frequency (what percentage of verbatims mention it) and impact (what is the average CSAT score for tickets that mention it versus those that do not). Plot themes on a 2x2 matrix: high frequency + high impact = fix immediately, high frequency + low impact = quick wins, low frequency + high impact = critical edge cases, low frequency + low impact = monitor.

## Presenting findings

Report findings as: the top three to five themes by priority, with verbatim examples for each, a proposed fix or owner for each theme, and a success metric (what does a fixed version look like in the data). Avoid reporting a theme without a proposed action — analysis without a recommendation is noise.

## Thresholds that signal urgency

Escalate immediately if any single theme appears in more than 15% of detractor verbatims within a 30-day window, or if average CSAT for a theme drops below 2.5/5. These thresholds indicate systemic failure, not statistical noise.

## What to avoid

- Do not present word clouds — they conflate frequency with font size and obscure causality.
- Do not conflate correlation with causation; a theme appearing alongside low scores does not prove it caused the low score without further validation.
- Do not analyze fewer than 30 verbatims; sample size below that produces unreliable theme distributions.
