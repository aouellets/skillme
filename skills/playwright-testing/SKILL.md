---
name: Playwright Testing
description: Write end-to-end Playwright tests that are resilient, readable, and free of flakiness.
---

# Playwright Testing

Tests should fail only when the app is broken — never because of timing.

## Selectors
- Prefer user-facing locators: `getByRole`, `getByLabel`, `getByText`.
- Use `data-testid` only when semantics aren't enough.
- Avoid brittle CSS/XPath tied to layout.

## No flaky waits
- Never `waitForTimeout` with a magic number.
- Rely on Playwright's auto-waiting and web-first assertions
  (`await expect(locator).toBeVisible()`), which retry until true.
- Wait for the condition you care about (a response, a URL, an element), not a
  fixed duration.

## Structure
- One behavior per test; arrange-act-assert.
- Isolate state: reset/seed data so tests don't depend on order.
- Use fixtures for shared setup (auth, base URL).

## Rules
- Make tests deterministic — mock network where the backend is out of scope.
- Name tests by user intent ("user can reset password"), not implementation.
- Run headed locally to debug, headless in CI with traces on failure.
