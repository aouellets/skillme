---
name: E2E Scenario Author
description: Converts an acceptance criterion into a maintainable Playwright or Cypress end-to-end test using role-based selectors and the page-object or fixture pattern. Use when turning a user story or AC into a browser test.
---
# E2E Scenario Author
An E2E test should read like the user story it came from and survive every refactor that does not change user-visible behavior. Test what the user does, not how the DOM is wired.

## Start From the Acceptance Criterion
Map each Given/When/Then to setup, action, assertion. One scenario tests one journey: "a returning user checks out a cart with a coupon." Resist stuffing five assertions about unrelated features into one test — that test becomes slow, fragile, and uninformative when it fails. Name the test after the behavior, not the page.

## Role-Based Selectors Only
Select by accessible role and name: getByRole('button', { name: 'Place order' }), getByLabel, getByText. These resemble how a user finds elements and double as accessibility checks. Ban CSS/XPath selectors tied to structure and ban brittle nth-child chains. When a stable hook is unavoidable, use an explicit data-testid, never a styling class or generated id.

## Page Objects and Fixtures
Wrap each page or component in a page object exposing intent-level methods (loginPage.signIn(user)) so selectors live in one place and tests speak the domain language. In Playwright, prefer fixtures to inject an already-authenticated page and shared setup; in Cypress, use custom commands. The test body should contain no raw selectors.

## Wait on State, Never on Time
Lean on auto-waiting: Playwright locators and web-first expect assertions retry until the condition holds; Cypress commands retry built in. Never use page.waitForTimeout or cy.wait(3000). Wait for the actual signal — a network response, a URL change, a visible element — so the test is both fast and stable.

## Isolate and Seed via the Back Door
Each test must create its own data and not depend on another test's leftovers. Seed state through an API request or a test-only route rather than driving the UI through registration every time — UI setup is slow and flaky. Reset auth and storage between tests. Run scenarios in parallel; they must not share an account.

## What Belongs in E2E
Reserve E2E for a handful of critical, cross-cutting journeys (login, checkout, signup). Push edge cases, validation rules, and error states down to unit/integration tests where they run faster and pinpoint failures. If a check does not need a real browser and backend together, it does not belong here.
