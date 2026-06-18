---
name: FP&A Operating Model
description: Builds a driver-based FP&A operating model linking business inputs to P&L, balance sheet, and cash flow outputs. Use when building an annual plan, preparing investor materials, running scenario analysis, or stress-testing the business.
---

# FP&A Operating Model

A driver-based model is built on the belief that financial outputs are the result of measurable business actions. Revenue is not a number pulled from a goal — it is a function of pipeline, conversion rate, average contract value, and sales capacity. Every assumption should be traceable to a business driver, not a wish.

## Model Architecture

Structure the model in four layers. The Assumptions layer holds every input: growth rates, hiring plan, pricing, margins, DSO, and macro variables. The Revenue layer translates demand drivers into recognized revenue. The Expense layer translates the headcount plan and operational drivers into opex and COGS line items. The Output layer assembles the three financial statements automatically from the above. Never hardcode a number in the output layer — it must flow from the assumptions.

## Revenue Build

For SaaS or subscription: start with beginning ARR, add new ARR from new logos (pipeline times close rate times ACV), add expansion ARR, subtract churn ARR (beginning ARR times churn rate), to get ending ARR. Monthly revenue equals ending ARR divided by 12. For transaction businesses: units sold times ASP, by segment. For services: billable headcount times utilization rate times bill rate. Make the revenue build auditable — one row per driver.

## Expense Build

Headcount is the anchor. Build a headcount roster with role, department, start month, fully-loaded cost per head (salary plus benefits plus payroll tax, typically 1.2 to 1.3 times base). Derive compensation expense from the roster. Non-headcount opex should be modeled as either a fixed amount per month or a variable rate tied to a driver (e.g., hosting costs as a percentage of revenue, sales commissions as a percentage of new ARR). Avoid modeling opex as a flat year-over-year growth rate — it obscures the underlying drivers.

## Scenario Framework

Build three scenarios into the assumptions layer: Base (most likely), Bull (upside on revenue drivers, flat costs), Bear (revenue miss, cost reduction response). The model outputs should change automatically when the scenario selector changes. The gap between Bull and Bear operating cash flow in month 18 is your planning uncertainty band. If that band is wider than your cash on hand, you need either a larger reserve or a tighter cost structure.

## Model Hygiene

One formula per row — do not mix hardcoded numbers and formulas in the same column range. Color-code inputs (blue) versus calculated cells (black) so any reviewer can spot manual overrides. Date the version and lock the prior actuals columns. A model that is easy to audit will be used; one that is not will be replaced with a spreadsheet in someone's desktop.

## Key Outputs to Surface

Gross margin percentage by period. Operating margin. Headcount by department end of period. Net new ARR (for SaaS). Operating cash flow. Runway in months. These six metrics should appear on a summary dashboard tab that updates from the model automatically.
