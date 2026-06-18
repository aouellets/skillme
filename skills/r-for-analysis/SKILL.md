---
name: R for Analysis
description: Idiomatic tidyverse R for wrangling, visualization, and statistics.
---

# R for Analysis

Write clear, reproducible R using the tidyverse for data analysis tasks.

## Setup

```r
library(tidyverse)
library(lubridate)
library(broom)
```

Always set a seed for any stochastic operation: `set.seed(42)`.

## Reading data

```r
sales <- read_csv("sales.csv", col_types = cols(
  date = col_date(),
  amount = col_double(),
  region = col_character()
))
```

Specify `col_types` explicitly to avoid surprises with type inference.

## Wrangling with dplyr

Chain transformations with the pipe. Each verb does one thing:

```r
summary_tbl <- sales %>%
  filter(amount > 0) %>%
  mutate(month = floor_date(date, "month")) %>%
  group_by(region, month) %>%
  summarise(
    total = sum(amount),
    n = n(),
    .groups = "drop"
  ) %>%
  arrange(region, month)
```

Always pass `.groups = "drop"` to summarise to avoid silently grouped output.

## Reshaping

```r
wide <- summary_tbl %>%
  pivot_wider(names_from = region, values_from = total)

long <- wide %>%
  pivot_longer(-month, names_to = "region", values_to = "total")
```

## Joining

Use explicit `by` and the right join type:

```r
result <- left_join(orders, customers, by = "customer_id")
```

Check for unexpected row multiplication after joins with `nrow()` before and after.

## Visualization with ggplot2

```r
ggplot(summary_tbl, aes(month, total, color = region)) +
  geom_line(linewidth = 1) +
  scale_y_continuous(labels = scales::comma) +
  labs(title = "Monthly sales by region", x = NULL, y = "Total") +
  theme_minimal()
```

Build plots in layers; map variables inside `aes()`, set constants outside it.

## Statistics

Fit models and tidy the output for downstream use:

```r
model <- lm(total ~ month + region, data = summary_tbl)
tidy(model, conf.int = TRUE)
glance(model)
```

For group-wise modeling, nest and map:

```r
models <- sales %>%
  group_by(region) %>%
  nest() %>%
  mutate(fit = map(data, ~ lm(amount ~ date, data = .x)),
         tidied = map(fit, tidy)) %>%
  unnest(tidied)
```

## Best practices

- Keep raw data immutable; create new objects for each transformation.
- Use `janitor::clean_names()` to standardize column names.
- Prefer `case_when()` over nested `ifelse()`.
- Document assumptions in comments and validate with `stopifnot()`.
- Render reproducible reports with Quarto or R Markdown.
