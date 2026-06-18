---
name: TypeScript Strict Mode
description: Write TypeScript as if strict:true is enforced. No escape hatches.
---
# TypeScript Strict Mode
Strict TypeScript or nothing. Every `any` is a bug waiting to happen.
## Banned patterns
- `any` — use `unknown` and narrow, or define the type
- `as SomeType` — use type guards or narrowing instead
- `!.property` — handle null/undefined explicitly
- `@ts-ignore` — fix the type error, don't suppress it
- Implicit `any` in function parameters
## Required patterns
- Explicit return types on public functions
- `unknown` over `any` for truly unknown data (then narrow)
- `satisfies` over `as` for type assertions
- Discriminated unions over optional properties
- `const` assertions for literal types
- Exhaustive switches with `never` checks
## Narrowing toolkit
```typescript
// Type guard
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x
}
// Exhaustive switch
function handle(action: Action): never {
  switch (action.type) {
    case 'A': return handleA(action)
    case 'B': return handleB(action)
    default: const _exhaustive: never = action; throw new Error()
  }
}
```
## Config
tsconfig.json must have: `"strict": true` — this enables all strict checks.
