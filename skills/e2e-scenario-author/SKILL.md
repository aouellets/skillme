---
name: E2E Scenario Author
description: Converts an acceptance criterion or user story into one maintainable Playwright or Cypress end-to-end test that reads like the journey it covers. Use when turning a Given/When/Then acceptance criterion or user story into a browser test, when asked to "write an E2E test for this AC", or when a feature's critical journey (login, checkout, signup) needs a single automated scenario. Do NOT use when writing general Playwright tests, configuring the runner, or fixing existing test flakiness — use playwright-testing or flaky-test-detangler instead.
---
# E2E Scenario Author

Turn one acceptance criterion into one browser test that reads like the user story it came from and survives every refactor that does not change user-visible behavior.

## Workflow

1. **Pin the journey.** Take the single acceptance criterion and map its Given/When/Then to setup, action, assertion. One scenario covers one journey (e.g. "a returning user checks out a cart with a coupon"). If the AC implies several behaviors, write several tests. Name each test after the behavior, not the page.
2. **Seed state via the back door.** In setup, create the test's own data through an API request or a test-only route — never drive the UI through registration or other flows just to reach the start state. Reset auth and storage so the test owns a fresh, isolated account.
3. **Drive the action through a page object.** Wrap each page or component in a page object exposing intent-level methods (`loginPage.signIn(user)`) so selectors live in one place and the test body speaks the domain. In Playwright, inject the authenticated page and shared setup via fixtures; in Cypress, use custom commands. The test body contains no raw selectors.
4. **Select by role and accessible name.** Inside the page object, use `getByRole('button', { name: 'Place order' })`, `getByLabel`, `getByText` — selectors that mirror how a user finds elements and double as accessibility checks. When a stable hook is genuinely unavoidable, add an explicit `data-testid`.
5. **Assert on user-visible state, waiting on signals.** Assert the outcome the user would see. Rely on auto-waiting: Playwright web-first `expect` assertions and Cypress commands retry until the condition holds. Wait for a real signal — a network response, a URL change, a visible element — never a fixed delay.
6. **Confirm isolation.** Verify the test shares no account or data with any other scenario and can run in parallel.

## Quality bar

- The test passes against the real app and fails only when the journey it names is actually broken.
- A reviewer can read the test body top-to-bottom as the user story, with zero raw selectors visible.
- The test runs in parallel with the rest of the suite with no shared account, fixture data, or ordering dependency.

## Do NOT

- Use `page.waitForTimeout`, `cy.wait(3000)`, or any fixed sleep — wait on the actual signal.
- Use CSS/XPath selectors tied to DOM structure, `nth-child` chains, styling classes, or generated ids.
- Stuff assertions about unrelated features into one scenario — that test is slow, fragile, and uninformative on failure.
- Push edge cases, validation rules, and error states into E2E — those belong in unit/integration tests where they run faster and pinpoint failures. Reserve E2E for a handful of critical, cross-cutting journeys.
- Drive multi-step UI setup to reach the start state — seed it through the back door instead.
- Share an account or rely on another test's leftover data.
