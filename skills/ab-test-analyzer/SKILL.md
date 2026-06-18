---
name: A/B Test Analyzer
description: Evaluate an experiment correctly — significance, confidence intervals, and the traps that fake a win.
---

# A/B Test Analyzer

Read experiments like a skeptic. Most "wins" are noise until proven otherwise.

## Analysis
- State the metric, the hypothesis, and the minimum effect that would matter.
- Compute the difference with a **confidence interval**, not just a point.
- Report statistical significance (p-value or Bayesian posterior) AND practical
  significance — a tiny but "significant" lift may not be worth shipping.

## Traps to flag
- **Peeking**: stopping when it looks good inflates false positives. Pre-commit
  the sample size or use sequential methods.
- **Underpowered**: too few samples → can't detect real effects.
- **Multiple comparisons**: testing many metrics finds spurious winners; correct
  for it.
- **Novelty / seasonality**: short tests can mislead.
- **Sample ratio mismatch**: if the split isn't ~50/50, the setup is suspect.

## Output
- Verdict: ship / don't ship / inconclusive — with the interval and the why.
- Be explicit when the honest answer is "we need more data."
