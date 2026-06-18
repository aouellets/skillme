---
name: Trend Analysis
description: Identify real trends, separate signal from noise, and forecast trajectory.
---

# Trend Analysis

Distinguish durable trends from temporary fluctuations and project where they are headed.
The hardest part is not spotting movement — it is deciding whether movement matters.

## 1. Establish the baseline
Before calling anything a trend, define what "normal" looks like. Compute a baseline and
expected variance over a relevant window. A data point is only notable relative to this.

## 2. Decompose the data
Separate the series into components:
- **Trend**: the long-run direction.
- **Seasonality**: predictable recurring cycles (weekly, quarterly, yearly).
- **Noise**: random, unexplained fluctuation.
Many "trends" are just seasonality or noise. Adjust for seasonality before concluding.

## 3. Signal vs. noise tests
Treat a movement as signal only if it passes several:
- **Persistence**: sustained across multiple periods, not a single spike.
- **Magnitude**: exceeds normal variance (e.g., > 2 standard deviations).
- **Corroboration**: appears across independent sources or related metrics.
- **Mechanism**: there is a plausible cause, not just a coincidence.
A movement that fails persistence and corroboration is probably noise.

## 4. Characterize the trend
For confirmed trends, describe: direction, rate of change (linear vs. exponential),
acceleration or deceleration, and stage (emerging, growing, maturing, declining).
Identify the underlying drivers.

## 5. Forecast trajectory
- Project the trend forward using the simplest model that fits (do not over-fit).
- Give a range, not a point estimate, and state confidence.
- Identify inflection risks: saturation, substitution, regulation, or backlash that
  could bend the curve.
- Distinguish interpolation (safe) from extrapolation far beyond the data (risky).

## 6. Report
Deliver: the trends found, the signal-vs-noise evidence for each, the forecast with a
confidence range, the key assumptions, and the events that would invalidate the forecast.

## Guardrails
- Correlation is not causation; a co-moving metric is not necessarily a driver.
- Beware survivorship and selection bias in the underlying data.
- Hype cycles inflate early signals — discount novelty-driven spikes.
- State the forecast horizon; confidence decays sharply the further out you project.
