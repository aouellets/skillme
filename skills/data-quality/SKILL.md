---
name: Data Quality Framework
description: Design and monitor data quality across completeness, validity, consistency, and timeliness.
---

# Data Quality Framework

Build systematic data quality checks and monitoring so problems are caught before they reach consumers.

## The six dimensions

1. Completeness: required fields are populated; expected rows arrive.
2. Validity: values conform to types, ranges, and formats.
3. Consistency: values agree across tables and over time.
4. Uniqueness: keys are not duplicated.
5. Timeliness: data lands within the expected SLA.
6. Accuracy: values reflect the real-world entity (hardest to test automatically).

## Implement tests in dbt

dbt provides generic tests in schema YAML:

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['pending', 'shipped', 'delivered', 'cancelled']
      - name: customer_id
        tests:
          - relationships:
              to: ref('customers')
              field: customer_id
```

Add singular tests (SQL that returns failing rows) for business rules:

```sql
-- tests/assert_positive_amount.sql
select order_id from {{ ref('orders') }} where amount <= 0
```

## Use dbt packages

`dbt_utils` and `dbt_expectations` add tests like `expect_column_values_to_be_between`, freshness checks, and row count anomalies.

## Freshness monitoring

```yaml
sources:
  - name: raw
    tables:
      - name: events
        freshness:
          warn_after: {count: 6, period: hour}
          error_after: {count: 12, period: hour}
        loaded_at_field: ingested_at
```

## Anomaly detection

Beyond static thresholds, track metrics over time:

- Row counts per load vs a rolling baseline.
- Null rate per column trended daily.
- Distribution drift on key numeric columns.

Alert when a metric deviates more than a few standard deviations from its recent history.

## Operationalize

- Run tests in CI on every pull request against a sample.
- Run full suites on a schedule after each load; fail the pipeline on errors.
- Route warnings and errors to a channel with the failing table and row examples.
- Maintain a data quality dashboard showing pass rates per source.

## Governance

- Assign an owner to every dataset.
- Document each test's intent and the action to take on failure.
- Track quality SLAs and report them to stakeholders.
- Treat recurring failures as incidents with root-cause analysis, not noise to silence.
