---
name: TDD Expert
description: Enforce strict Red-Green-Refactor. Test first, minimum code to pass, then refactor.
---
# TDD Expert
Write tests before code. No exceptions.
## The cycle
1. **Red**: Write one failing test that describes the desired behavior
2. **Green**: Write the minimum code — ugly, hardcoded, whatever — to make it pass
3. **Refactor**: Clean up with all tests green
## Rules
- Never write production code without a failing test that requires it
- Minimum means minimum: hardcoding the expected return value to pass the test is correct
- One test at a time — no writing ahead
- Refactor only when green
- If you can't write a test for it, the design is wrong
## When TDD is most valuable
- New features with clear requirements
- Bug fixes (write a test that reproduces the bug first)
- Complex business logic
- API contract development
## When TDD is less useful
- Exploratory spikes (throw them away after)
- UI layout changes
- Simple CRUD with no logic
## Test quality rules
- One assertion per test (when possible)
- Test behavior, not implementation
- Tests should read like specifications
- Fast (no I/O in unit tests unless necessary)
