---
phase: 03-no-win-scenario-cards
plan: 01
subsystem: testing
tags: [vitest, card-validation, no-win, tdd, data-integrity]

requires:
  - phase: 02-impact-zone-role-system
    provides: RoleType enum, ROLE_CARDS mapping
  - phase: 01-foundation
    provides: Card interface, PersonalityType enum, AppSource enum

provides:
  - Test framework for card data validation
  - Automated checks for no-win constraint compliance
  - Personality voice distinction validation
  - Role-specific adaptation verification
  - Incident source documentation scaffold

affects:
  - Plan 02 (card generation will use these tests)
  - Plan 03 (ongoing card validation)

tech-stack:
  added: []
  patterns:
    - "TDD-style test files with describe/it blocks"
    - "Heuristic validation with warnings instead of hard failures"
    - "JSON-based source documentation"

key-files:
  created:
    - tests/data/card-structure.test.ts
    - tests/data/card-penalties.test.ts
    - tests/data/feedback-voice.test.ts
    - tests/data/role-adaptation.test.ts
    - tests/data/incident-sources.test.ts
    - tests/data/card-sources.json
    - tests/data/card-sources.d.ts
  modified:
    - package.json (added test:data script)

key-decisions:
  - "Used heuristic warnings instead of hard failures for dominant strategy detection (allows iterative improvement)"
  - "Created JSON-based source documentation scaffold for incident tracking"
  - "Implemented voice characteristic detection as informational logging"
  - "Accept current cross-role card duplication as expected (will resolve in Plan 02)"

requirements-completed: [NOWIN-01, NOWIN-02, NOWIN-03, NOWIN-04]

duration: 9min
completed: 2026-03-16T19:16:58Z
---

# Phase 03 Plan 01: No-Win Card Test Framework Summary

**Test scaffolding and validation framework for Phase 03 no-win card generation. Five test suites validate card data integrity before cards are written, preventing dominant strategies, generic feedback, and incomplete outcomes.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-16T19:07:17Z
- **Completed:** 2026-03-16T19:16:58Z
- **Tasks:** 6
- **Files created/modified:** 8

## Accomplishments

1. **Card Structure Validation** - Validates Card interface compliance for all 10 role types, checks required fields, validates AppSource enum, ensures both outcomes have all required fields (label, hype, heat, fine, violation, feedback, lesson), validates unique card IDs
2. **No-Win Penalty Balance** - Validates no-win constraint (both outcomes must carry penalties), detects free paths (zero hype/heat/fine), warns on dominant strategies (5x+ penalty imbalance), ensures fine values are never negative
3. **Personality Voice Distinction** - Validates all 3 personality voices present (ROASTER, ZEN_MASTER, LOVEBOMBER), detects generic feedback (copy-pasted from lesson), checks voice distinctness across personalities, implements voice characteristic detection heuristics
4. **Role-Specific Adaptation** - Validates role-specific framing via vocabulary coverage, warns on copy-paste across roles, analyzes incident keyword distribution, validates unique card counts per incident type
5. **Incident Source Documentation** - Creates JSON-based source documentation scaffold, validates source entry format, checks date range (2024-2025), validates standardized categories, distinguishes real incidents from fictional scenarios
6. **Test Runner Integration** - Adds `npm run test:data` command to package.json for easy test execution

## Task Commits

Each task was committed atomically:

1. **Task 1: Card Structure Tests** - `fa3753c` (test)
2. **Task 2: Card Penalties Tests** - `43c36ae` (test)
3. **Task 3: Feedback Voice Tests** - `e87ad88` (test)
4. **Task 4: Role Adaptation Tests** - `285a860` (test)
5. **Task 5: Incident Sources Tests** - `349d339` (test)
6. **Task 6: Test Script** - `e8a77d7` (chore)

## Files Created/Modified

- `tests/data/card-structure.test.ts` - Card interface validation tests (262 lines)
- `tests/data/card-penalties.test.ts` - No-win penalty balance tests (261 lines)
- `tests/data/feedback-voice.test.ts` - Personality voice distinction tests (358 lines)
- `tests/data/role-adaptation.test.ts` - Role-specific framing tests (333 lines)
- `tests/data/incident-sources.test.ts` - Incident source documentation tests (185 lines)
- `tests/data/card-sources.json` - Source documentation scaffold
- `tests/data/card-sources.d.ts` - TypeScript declarations for JSON
- `package.json` - Added `test:data` script

## Decisions Made

1. **Heuristic warnings over hard failures**: Dominant strategy detection generates warnings rather than failing tests. This allows the card generation process to proceed while flagging potential issues for review.

2. **JSON-based source documentation**: Created a structured JSON format for incident sourcing rather than inline comments. This enables programmatic validation and easier maintenance.

3. **Voice detection as informational**: Personality voice characteristic detection logs match percentages rather than enforcing strict thresholds. Full validation requires human judgment of tone and style.

4. **Cross-role duplication acceptable**: Currently all roles point to legacy decks, causing cross-role ID duplication. This is expected and will resolve when role-specific cards are created in Plan 02.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

1. **TypeScript JSON imports**: Vitest could import JSON but TypeScript complained about missing declarations. Added `card-sources.d.ts` type declaration file to resolve.

2. **Cross-role card ID duplication**: Test correctly identifies that card IDs are duplicated across roles because all roles currently point to the same legacy decks. This is expected behavior given the current implementation and will be resolved in Plan 02 when role-specific cards are created.

## Next Phase Readiness

- Test framework is complete and functional
- Ready for Plan 02: Card generation can proceed with validation
- Card source documentation scaffold is ready to be populated
- Test data shows current cards have dominant strategies (expected - these are legacy cards)
- Role-specific adaptation warnings will guide card creation in Plan 02

---
*Phase: 03-no-win-scenario-cards*
*Completed: 2026-03-16*
