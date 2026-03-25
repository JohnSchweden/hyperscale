---
phase: quick
plan: 004
type: execute
wave: 1
depends_on: []
files_modified:
  - tests/helpers/navigation.ts
  - playwright.config.ts
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Tests can run without full homepage-to-playing navigation"
    - "Tests execute faster due to reduced navigation overhead"
    - "CSS/static property tests share browser context"
  artifacts:
    - path: "tests/helpers/navigation.ts"
      provides: "New helper functions for direct navigation"
    - path: "playwright.config.ts"
      provides: "Shared browser context configuration"
  key_links:
    - from: "navigation.ts"
      to: "tests/*.spec.ts"
      via: "import and use in beforeEach/beforeAll"
---

<objective>
Make Playwright tests singularly focused by eliminating redundant full navigation from homepage on every test.

Purpose: Tests should be able to test specific functionality directly without going through the full intro → boot → personality → role → playing flow each time.

Output: Refactored navigation helper with direct-to-playing support and optimized test patterns.
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@tests/helpers/navigation.ts
@playwright.config.ts

# Example test files that use navigateToPlaying (41 calls across 12 files)
@tests/swipe-interactions.spec.ts
@tests/snap-back.spec.ts
</context>

<tasks>

<task type="auto">
  <name>Add direct navigation helper with context reuse support</name>
  <files>tests/helpers/navigation.ts</files>
  <action>
Add two new helper functions to tests/helpers/navigation.ts:

1. `navigateToPlayingFast(page: Page)` - Uses localStorage to set initial game state, then navigates directly to the playing stage via URL. This bypasses the 4-step navigation flow.

2. `getStatefulPage(page: Page)` - Returns a page configured for use with `test.beforeAll` that preserves browser context across tests in the same describe block.

Implementation for navigateToPlayingFast:
- Set localStorage keys: 'gameState' with { state: 'playing', personality: 'vera', role: 'development' }
- Navigate to '/' with the state already in localStorage
- Wait for playing stage to be visible (look for Debug button)
- Add fallback to full navigation if fast approach fails

Implementation for getStatefulPage:
- Wrap the page in a simple object that signals tests should use beforeAll pattern
- This is a documentation/convention helper - actual context reuse comes from Playwright config
</action>
  <verify>
Run: bun run test -- tests/swipe-interactions.spec.ts --grep "spring physics"

This test should complete faster because it uses the new direct navigation.
</verify>
  <done>
navigateToPlayingFast helper exists and can bypass full navigation flow
</done>
</task>

<task type="auto">
  <name>Update CSS/static tests to use beforeAll pattern</name>
  <files>tests/swipe-interactions.spec.ts</files>
  <action>
Refactor tests/swipe-interactions.spec.ts to use `test.beforeAll` instead of `test.beforeEach` for CSS/static property tests.

Tests that check CSS rules, keyframes, and computed styles don't need a fresh page - they only read static properties. Convert:
- "spring physics CSS class exists" - uses beforeAll
- "exit animation keyframes exist" - uses beforeAll  
- "will-change property is set" - uses beforeAll

Keep beforeEach for tests that actually interact with cards:
- "card stack renders next card" - needs beforeEach
- "keyboard navigation works" - needs beforeEach
- "swipe preview text appears" - needs beforeEach
- "card exit animation plays" - needs beforeEach

The beforeAll should call navigateToPlayingFast once per describe block, then all tests in that block share the page.
</action>
  <verify>
Run: bun run test -- tests/swipe-interactions.spec.ts

All 8 tests should pass. Tests using beforeAll should be faster.
</verify>
  <done>
CSS/static tests use beforeAll pattern, interaction tests use beforeEach
</done>
</task>

<task type="auto">
  <name>Add example usage in snap-back test</name>
  <files>tests/snap-back.spec.ts</files>
  <action>
Refactor tests/snap-back.spec.ts to demonstrate the optimized pattern:

1. Use test.describe with beforeAll for both tests (they're both interaction tests but share state nicely)
2. Show how to use navigateToPlayingFast instead of full navigateToPlaying

This serves as a template for refactoring other test files.
</action>
  <verify>
Run: bun run test -- tests/snap-back.spec.ts

Both snap-back tests should pass.
</verify>
  <done>
snap-back.spec.ts demonstrates optimized navigation pattern
</done>
</task>

</tasks>

<verification>
Run the full test suite to ensure no regressions:
bun run test

Test execution time should decrease due to:
1. Direct navigation (fewer page.goto and clicks)
2. Shared browser context for static tests (beforeAll pattern)
</verification>

<success_criteria>
- New navigateToPlayingFast helper exists in navigation.ts
- At least 2 test files refactored to use optimized patterns
- All tests pass
- Tests execute faster than before

After completion, create `.planning/quick/004-focused-tests-without-full-navigation/004-SUMMARY.md`
</success_criteria>

<output>
After completion, create `.planning/quick/004-focused-tests-without-full-navigation/004-SUMMARY.md`
</output>
