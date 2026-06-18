---
name: Spark & PySpark
description: Write optimized PySpark jobs with partitioning, caching, and join strategies.
---

# Spark & PySpark

Author PySpark jobs that scale, avoid shuffles where possible, and use cluster resources efficiently.

## SparkSession

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = (
    SparkSession.builder
    .appName("etl")
    .config("spark.sql.shuffle.partitions", "200")
    .config("spark.sql.adaptive.enabled", "true")
    .getOrCreate()
)
```

Enable Adaptive Query Execution (AQE); it coalesces shuffle partitions and optimizes joins at runtime.

## Prefer the DataFrame API over RDDs

DataFrame operations go through Catalyst and Tungsten, giving query optimization and off-heap memory. Drop to RDDs only when no DataFrame primitive exists.

## Avoid Python UDFs

Python UDFs serialize each row to the Python worker and back, breaking codegen. Order of preference:

1. Built-in `pyspark.sql.functions` (e.g. `F.regexp_extract`, `F.when`).
2. Pandas (vectorized) UDFs when you must use Python.
3. Scalar Python UDFs only as a last resort.

```python
from pyspark.sql.functions import pandas_udf

@pandas_udf("double")
def normalize(s):
    return (s - s.mean()) / s.std()
```

## Joins and shuffles

- Broadcast the smaller side when it fits in memory:

```python
from pyspark.sql.functions import broadcast
result = large.join(broadcast(small), "key")
```

- Filter and project columns before joining to shrink the shuffle.
- Watch for skew; salt heavily skewed keys or rely on AQE skew join handling.

## Partitioning

- `repartition(n, col)` does a full shuffle to balance data; use before wide writes.
- `coalesce(n)` reduces partitions without a shuffle; use to avoid tiny output files.
- Partition output by low-cardinality columns:

```python
df.write.partitionBy("dt").mode("overwrite").parquet("/data/out")
```

## Caching

Cache only when a DataFrame is reused multiple times in the DAG:

```python
df.cache()
df.count()  # materialize
```

Unpersist when done to free memory. Caching a once-used DataFrame wastes memory.

## Performance checklist

- Read columnar formats (Parquet, ORC) with predicate pushdown.
- Avoid `collect()` on large data; it pulls everything to the driver.
- Inspect plans with `df.explain(True)`.
- Tune `spark.sql.shuffle.partitions` to roughly match cluster cores for the data size.
- Use `F.col` references rather than string columns when chaining for clarity.
