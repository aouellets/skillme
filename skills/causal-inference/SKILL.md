---
name: Causal Inference
description: Estimate causal effects from observational data with DiD, RDD, and IV.
---

# Causal Inference

Move from correlation to causation using credible identification strategies. Always state assumptions explicitly.

## Frame the question

Define the treatment, the outcome, the unit, and the counterfactual. Draw a DAG to encode assumptions about confounders, mediators, and colliders. Never condition on a collider or a post-treatment variable.

## Difference-in-Differences (DiD)

Compares the change in outcomes over time between a treated and control group.

Key assumption: parallel trends. Absent treatment, both groups would have moved together.

```python
import statsmodels.formula.api as smf
model = smf.ols("y ~ treated * post", data=df).fit(
    cov_type="cluster", cov_kwds={"groups": df["unit"]}
)
```

The interaction coefficient `treated:post` is the average treatment effect on the treated. Validate parallel trends by plotting pre-period trends and running an event-study with leads and lags.

## Regression Discontinuity (RDD)

When treatment is assigned by a threshold on a running variable, units just above and below are comparable.

```python
# Local linear regression within a bandwidth around the cutoff
band = df[(df.x > cutoff - h) & (df.x < cutoff + h)].copy()
band["above"] = (band.x >= cutoff).astype(int)
smf.ols("y ~ above * I(x - @cutoff)", data=band).fit()
```

- Choose bandwidth with a data-driven method (Imbens-Kalyanaraman).
- Run a McCrary density test to check for manipulation of the running variable.
- Plot the discontinuity; the jump at the cutoff is the local effect.

## Instrumental Variables (IV)

Use when treatment is endogenous and you have an instrument that affects the outcome only through the treatment.

Requirements: relevance (instrument predicts treatment) and exclusion (no direct path to outcome).

```python
from linearmodels.iv import IV2SLS
res = IV2SLS.from_formula("y ~ 1 + controls + [treatment ~ instrument]", df).fit()
```

Check the first-stage F-statistic; weak instruments (F < 10) produce biased estimates.

## Common pitfalls

- Controlling for a mediator absorbs the effect you want to measure.
- Selection on the dependent variable biases estimates.
- Standard errors must account for clustering and serial correlation.
- A robustness section should test placebo cutoffs, alternative bandwidths, and sensitivity to confounders.

## Reporting

State the estimand, the identifying assumption, the threats, and the falsification tests you ran. Causal claims are only as strong as the design that supports them.
