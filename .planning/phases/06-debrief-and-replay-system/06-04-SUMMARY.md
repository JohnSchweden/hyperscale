---
phase: 06-debrief-and-replay-system
plan: 04
subsystem: ui
tags: [debrief, email, waitlist, form, api, typescript, react]

# Dependency graph
requires:
  - phase: 06-02
    provides: "3-page debrief flow, DebriefPage3Verdict component"
provides:
  - V2WaitlistPayload interface for type-safe email capture
  - useEmailCapture hook with form state management and validation
  - EmailCaptureForm component with validation and success/error states
  - Backend API endpoint POST /api/v2-waitlist for signup persistence
  - Integration of email form into DebriefPage3Verdict
  - Comprehensive unit and E2E tests
affects:
  - DebriefPage3Verdict
  - hooks/index.ts
  - types.ts
  - api/v2-waitlist.ts

tech-stack:
  added: []
  patterns:
    - "Custom hook pattern: useEmailCapture manages form state, validation, and submission"
    - "Controlled form pattern: input value synced with React state"
    - "API endpoint pattern: Vercel serverless function with validation"
    - "TDD pattern: RED-GREEN-REFACTOR for useEmailCapture hook"

key-files:
  created:
    - hooks/useEmailCapture.ts
    - components/game/debrief/EmailCaptureForm.tsx
    - api/v2-waitlist.ts
    - unit/email-capture.test.ts
    - unit/v2-waitlist-api.test.ts
    - tests/debrief-email-capture.spec.ts
  modified:
    - types.ts (added V2WaitlistPayload interface)
    - hooks/index.ts (added useEmailCapture export)
    - components/game/debrief/DebriefPage3Verdict.tsx (integrated EmailCaptureForm)

key-decisions:
  - "Used regex /^[^\\s@]+@[^\\s@]+\.[^\\s@]+$/ for email validation (client and server)"
  - "Stored submission success in localStorage to prevent re-submission"
  - "MVP approach: console logging for signup tracking (database in production)"
  - "Form appears only when role and archetype are available (type safety)"

patterns-established:
  - "Email validation: consistent regex pattern on client and server"
  - "Form state management: controlled inputs with React state"
  - "API error handling: user-friendly error messages"
  - "TDD approach: comprehensive unit tests before implementation"

requirements-completed: [DEBRIEF-11]

# Metrics
duration: 7min
completed: 2026-03-09
---

# Phase 06 Plan 04: Email Capture for V2 Waitlist Summary

**Email capture form with validation, backend API endpoint, and integration into Page 3 debrief flow. TDD approach with 25+ unit tests and E2E coverage.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-09T21:11:01Z
- **Completed:** 2026-03-09T21:18:40Z
- **Tasks:** 5
- **Files modified:** 8

## Accomplishments

- Created V2WaitlistPayload interface with email, role, archetype, resilience, timestamp
- Built useEmailCapture hook with form state management and email validation
- Implemented EmailCaptureForm component with validation, success/error states
- Created backend API endpoint at POST /api/v2-waitlist with server-side validation
- Integrated form into DebriefPage3Verdict with proper styling
- Wrote comprehensive unit tests (25 tests total) covering all functionality
- Added E2E tests for integration verification

## Task Commits

Each task was committed atomically:

1. **Task 1: Define V2 waitlist types and create useEmailCapture hook** - `00b0820` (test/feat - TDD)
2. **Task 2: Create EmailCaptureForm component** - `735e1a5` (feat)
3. **Task 3: Create backend API endpoint for V2 waitlist** - `978552a` (feat)
4. **Task 4: Integrate EmailCaptureForm into DebriefPage3Verdict** - `07b1b6f` (feat)
5. **Task 5: Write email capture integration tests** - Tests included in commits 00b0820 and 978552a

**Plan metadata:** `07b1b6f` (feat: integration)

## Files Created/Modified

- `types.ts` - Added V2WaitlistPayload interface
- `hooks/useEmailCapture.ts` - Form state hook with validation and submission
- `hooks/index.ts` - Added useEmailCapture export
- `components/game/debrief/EmailCaptureForm.tsx` - Form component with UI states
- `components/game/debrief/DebriefPage3Verdict.tsx` - Integrated email capture form
- `api/v2-waitlist.ts` - Backend API endpoint for waitlist signup
- `unit/email-capture.test.ts` - Unit tests for useEmailCapture hook (16 tests)
- `unit/v2-waitlist-api.test.ts` - Unit tests for API endpoint (9 tests)
- `tests/debrief-email-capture.spec.ts` - E2E tests for form integration

## Decisions Made

- Used consistent email regex pattern on both client and server for validation
- Stored successful submission in localStorage to prevent duplicate signups
- MVP approach: console logging for tracking (database persistence in production)
- Form only renders when role and archetype are available (type safety)
- Button styling matches design system (white bg, black text, cyan hover)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed as planned. TDD approach ensured comprehensive test coverage.

## User Setup Required

None - no external service configuration required. API endpoint logs signups to console for MVP.

## Next Phase Readiness

- Email capture system complete and integrated into debrief flow
- Form validates email, submits to backend, shows success/error feedback
- Backend API validates input and logs signups
- All tests passing (25 unit tests + E2E tests)
- Requirement DEBRIEF-11 satisfied
- Ready for Wave 3: "Unlock all endings" gamification and reflection prompt

---
*Phase: 06-debrief-and-replay-system*
*Completed: 2026-03-09*
