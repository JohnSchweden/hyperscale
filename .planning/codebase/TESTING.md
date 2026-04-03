# Testing Patterns

**Analysis Date:** 2026-04-03

## Test Framework

**Runner:**
- Vitest for unit tests (vitest run unit/)
- Playwright for integration/E2E tests (playwright test)
- Config: `vitest.config.ts`, `playwright.config.ts`

**Assertion Library:**
- @testing-library/jest-dom for DOM assertions in unit tests
- Playwright's built-in assertions for E2E tests

**Run Commands:**
```bash
bun run test:unit              # Run unit tests
bun run test:unit:watch        # Watch mode for unit tests
bun run test                   # Run all Playwright tests
bun run test:smoke             # Run smoke tests only
bun run test:area:gameplay     # Run gameplay area tests
```

## Test File Organization

**Location:**
- Unit tests: `unit/` directory with .spec.ts/.spec.tsx files
- Integration tests: `tests/` directory with .spec.ts files
- Test helpers: `tests/helpers/` directory

**Naming:**
- Unit tests: camelCase with .spec.ts/.spec.tsx (`useCountdown.spec.ts`)
- Integration tests: kebab-case with .spec.ts (`stage-transitions.spec.ts`)

**Structure:**
```
unit/                    # Unit tests
├── useCountdown.spec.ts
├── deck.test.ts
└── ...

tests/                   # Integration/E2E tests
├── helpers/
│   ├── selectors.ts
│   └── navigation.ts
├── stage-transitions.spec.ts
├── swipe-interactions.spec.ts
└── ...
```

## Test Structure

**Suite Organization:**
```typescript
describe("useCountdown", () => {
  it("should initialize with startFrom value", () => {
    // test implementation
  });
});
```

**Patterns:**
- Setup: use `renderHook` from @testing-library/react for hooks
- Teardown: automatic cleanup via Vitest
- Async testing: `vi.useFakeTimers()` for time-based logic

## Mocking

**Framework:** vitest (vi)

**Patterns:**
```typescript
import { vi } from "vitest";

const onComplete = vi.fn();
const { result } = renderHook(() =>
  useCountdown({ startFrom: 5, onComplete, isActive: false }),
);
```

**What to Mock:**
- External dependencies (API calls, timers)
- Callback functions for verification
- Browser APIs when needed

**What NOT to Mock:**
- React hooks (useState, useEffect)
- DOM APIs (use @testing-library/react instead)

## Fixtures and Factories

**Test Data:**
- Direct object creation for simple cases
- No complex factory patterns observed
- Environment variables defined in vitest config

**Location:**
- Test data created inline within test files
- No separate fixtures directory

## Coverage

**Requirements:** Configured but no explicit target mentioned

**View Coverage:**
```bash
# Coverage included in unit test runs
# HTML report generated to coverage/ directory
```

## Test Types

**Unit Tests:**
- Focus on individual functions/hooks
- Mock external dependencies
- Test edge cases and error conditions
- Example: `useCountdown.spec.ts` tests timer logic

**Integration Tests:**
- Full application flow testing with Playwright
- Tagged with areas: @area:gameplay, @area:input, @area:layout
- Test user interactions end-to-end
- Example: `stage-transitions.spec.ts` tests navigation flows

**E2E Tests:**
- Full browser automation via Playwright
- Test complete user journeys
- Use helper functions for complex interactions

## Common Patterns

**Async Testing:**
```typescript
vi.useFakeTimers({ shouldAdvanceTime: true });
try {
  // test logic with fake timers
} finally {
  vi.useRealTimers();
}
```

**Error Testing:**
- Test error conditions and edge cases
- Verify error messages and recovery behavior

---

*Testing analysis: 2026-04-03*