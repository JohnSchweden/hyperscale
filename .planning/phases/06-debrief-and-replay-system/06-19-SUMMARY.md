---
phase: 06-debrief-and-replay-system
plan: 19
subsystem: Debrief UI
tags:
  - linkedin-integration
  - email-form-removal
  - e2e-testing
  - cta-replacement
dependency_graph:
  requires:
    - 06-01 (Archetype system)
    - 06-02 (Debrief UI flow)
    - 06-03 (LinkedIn share functionality)
  provides:
    - LinkedIn profile CTA on debrief page 3
    - Commented out email form code for future re-enablement
    - LinkedIn CTA E2E test suite
  affects:
    - Debrief page 3 verdict display
    - V2 waitlist signup flow
tech_stack:
  added: []
  patterns:
    - E2E testing with Playwright
    - Block comment preservation for code re-enablement
key_files:
  created:
    - tests/debrief-linkedin-cta.spec.ts
  modified:
    - components/game/debrief/DebriefPage3Verdict.tsx
    - tests/debrief-email-form.spec.ts
    - tests/debrief-email-capture.spec.ts
decisions:
  - LinkedIn profile link preferred over email form due to POC constraints
  - Email form code preserved as comments for future re-enablement
  - 7 E2E tests created to verify LinkedIn CTA functionality
metrics:
  duration: 15 minutes
  tasks_completed: 3
  tests_created: 7
  tests_passing: 7
---

# Phase 06 Plan 19: Replace Email Form with LinkedIn CTA Summary

Replace V2 Waitlist email form with LinkedIn profile link on debrief page 3—same "Get early access" framing with zero infrastructure cost.

## Objective

The debrief page 3 previously ended with a V2 Waitlist section containing an email input form (EmailCaptureForm component) backed by a Resend API integration. Since this is a POC and buying a custom domain for Resend email delivery isn't worthwhile, we replaced the email form UI with a simple LinkedIn profile link—same "Get early access to V2" framing, different contact mechanism.

## Execution Summary

All tasks completed successfully. 3 tasks executed, 3 commits created, 7 tests created and passing.

### Task Completion

| Task | Name | Status | Commit |
|------|------|--------|--------|
| 1 | Replace email form with LinkedIn CTA in DebriefPage3Verdict.tsx | DONE | 9bb3764 |
| 2 | Comment out email form E2E tests | DONE | 6fef0d2 |
| 3 | Create LinkedIn CTA E2E tests | DONE | 93c9845 |

## Changes Made

### Task 1: LinkedIn CTA Component (9bb3764)

**File:** `components/game/debrief/DebriefPage3Verdict.tsx`

- Commented out EmailCaptureForm import (line 7)
- Replaced email input form with LinkedIn profile link to https://www.linkedin.com/in/schwedeny/
- Link opens in new tab (target="_blank") with proper rel="noopener noreferrer"
- Link text: "Connect with Yevgen Schweden"
- Changed icon from fa-envelope to fa-brands fa-linkedin
- Maintained cyan color scheme matching page design
- Preserved email form code as comments (lines 185-191) for future re-enablement
- Updated copy to reference LinkedIn connection instead of email signup

### Task 2: Disable Email Form Tests (6fef0d2)

**Files:** `tests/debrief-email-form.spec.ts`, `tests/debrief-email-capture.spec.ts`

- Wrapped entire debrief-email-form.spec.ts in block comment (/* ... */)
- Wrapped entire debrief-email-capture.spec.ts in block comment (/* ... */)
- Email form is no longer rendered, so these tests would fail without the form UI
- Tests preserved for future re-enablement when form is restored
- `bunx playwright test tests/debrief-email-form.spec.ts tests/debrief-email-capture.spec.ts --list` now returns "No tests found" (correct behavior)

### Task 3: LinkedIn CTA E2E Tests (93c9845)

**File:** `tests/debrief-linkedin-cta.spec.ts` (NEW)

Created 7 comprehensive E2E tests:

1. **LinkedIn CTA section visible on debrief page 3** — Verifies LinkedIn link is visible
2. **LinkedIn icon is visible** — Checks icon displays with cyan styling in CTA section
3. **Get early access to V2 header text visible** — Confirms V2 framing text appears
4. **LinkedIn profile link visible with correct href** — Validates link URL and attributes
5. **Link text is Yevgen Schweden** — Verifies button text
6. **CTA visible when role is null (edge case)** — Ensures CTA shows even without role
7. **Description text mentions LinkedIn and adaptive version** — Confirms copy text

All 7 tests passing.

## Verification

### TypeScript Compilation
- `bun run typecheck`: PASSED (no errors)

### E2E Test Results
- LinkedIn CTA tests: **7/7 PASSED**
  - 3 tests verify visibility and content
  - 2 tests verify link properties
  - 2 tests verify edge cases and copy

### No Regression
- Email API tests: **5/5 PASSED**
  - V2 waitlist API endpoints still functional
  - All validation tests passing
  - Success case confirmed

## Success Criteria Met

- [x] LinkedIn CTA visible on debrief page 3
- [x] Link points to https://www.linkedin.com/in/schwedeny/ with target="_blank"
- [x] "Get early access to V2" header preserved
- [x] Email form code preserved as comments for future re-enablement
- [x] Email UI tests commented out (form no longer rendered)
- [x] LinkedIn CTA E2E tests pass (7/7)
- [x] TypeScript compiles without errors
- [x] Email API and unit tests still pass (no regression)

## Deviations from Plan

None - plan executed exactly as written.

## Files Modified Summary

| File | Changes | Lines |
|------|---------|-------|
| components/game/debrief/DebriefPage3Verdict.tsx | Replace email form with LinkedIn CTA | +17, -5 |
| tests/debrief-email-form.spec.ts | Comment out entire test file | +2, -0 |
| tests/debrief-email-capture.spec.ts | Comment out entire test file | +2, -0 |
| tests/debrief-linkedin-cta.spec.ts | New E2E test file | +243 |

## Test Coverage

### New Tests Added
- **File:** tests/debrief-linkedin-cta.spec.ts
- **Count:** 7 tests
- **Coverage:**
  - Visibility of LinkedIn CTA section
  - Icon styling and appearance
  - Link href, target, and rel attributes
  - Link text and label
  - Edge case: null role doesn't hide CTA
  - Description copy validation

### Tests Commented (No Longer Run)
- debrief-email-form.spec.ts (6 tests)
- debrief-email-capture.spec.ts (7 tests)
- Total: 13 tests commented (form no longer rendered)

### Tests Verified as Still Passing
- debrief-email-api.spec.ts (5/5 passing)
- V2 waitlist API functionality unaffected

## Code Quality

- All changes follow project TypeScript conventions
- HTML attributes properly structured (href, target, rel)
- CSS classes maintain design consistency
- Test patterns match existing Playwright test suite
- Comment preservation enables future feature restoration

## Notes for Future

If the email form needs to be re-enabled in the future:

1. Uncomment lines 7 in DebriefPage3Verdict.tsx (import)
2. Replace lines 160-190 with the commented email form code (lines 185-191)
3. Uncomment the test files: debrief-email-form.spec.ts, debrief-email-capture.spec.ts
4. Comment out or remove debrief-linkedin-cta.spec.ts

The email form component and API route are still functional and untouched.
