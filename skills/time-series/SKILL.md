---
name: Time Series Analysis
description: Forecast and decompose time series with ARIMA, Prophet, and proper validation.
---

# Time Series Analysis

Analyze and forecast time-indexed data with sound methodology and honest validation.

## Always start with exploration

1. Plot the raw series. Look for trend, seasonality, level shifts, and outliers.
2. Decompose to separate components:

```python
from statsmodels.tsa.seasonal import STL
result = STL(series, period=12).fit()
result.plot()
```

3. Check stationarity with the ADF test:

```python
from statsmodels.tsa.stattools import adfuller
adfuller(series.dropna())
```

## Make the series stationary

ARIMA assumes stationarity. Difference to remove trend, and seasonally difference to remove seasonality:

```python
diff = series.diff().dropna()
seasonal_diff = series.diff(12).dropna()
```

Inspect ACF and PACF plots to choose AR (p) and MA (q) orders.

## ARIMA / SARIMA

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(series, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
fit = model.fit(disp=False)
forecast = fit.get_forecast(steps=12)
ci = forecast.conf_int()
```

Use `pmdarima.auto_arima` to search orders by AIC, but verify residuals afterward.

## Prophet

Prophet is robust for business series with strong seasonality and holidays:

```python
from prophet import Prophet
m = Prophet(yearly_seasonality=True, weekly_seasonality=True)
m.add_country_holidays(country_name="US")
m.fit(df)  # df has columns ds, y
future = m.make_future_dataframe(periods=90)
fc = m.predict(future)
```

## Validation: never random split

Use rolling or expanding window backtests that respect time order:

```python
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)
```

Report MAPE, MAE, and RMSE on the held-out future windows, not in-sample fit.

## Residual diagnostics

After fitting, residuals should look like white noise:

- Ljung-Box test for autocorrelation.
- Plot residual ACF; no significant lags should remain.
- Check residual histogram for normality if you need prediction intervals.

## Best practices

- Handle missing timestamps by reindexing to a regular frequency before modeling.
- Apply a log transform to stabilize variance for multiplicative seasonality.
- Keep forecast horizons honest; uncertainty grows with distance.
- Compare against a naive seasonal baseline; a model that cannot beat it is not useful.
