---
phase: 16-kobayashi-maru-ending-variety-system
plan: 07
subsystem: gameplay
tags: [death-vectors, card-decks, ending-variety, c-suite, middle-management]

# Dependency graph
requires:
  - phase: 16-kobayashi-maru-ending-variety-system
    provides: DeathType enum with CONGRESS, BANKRUPT, REPLACED_BY_SCRIPT; death vector coverage validation tests
provides:
  - CSO deck: 2 new cards introducing CONGRESS death vector (Senate testimony, AI write-down)
  - HoS deck: 2 new cards introducing REPLACED_BY_SCRIPT death vector (management elimination, automation takeover)
  - CSO and HoS decks now narratively distinct: executive accountability vs middle-management displacement
affects: card-decks, death-vector-coverage, ending-variety

# Tech tracking
tech-stack:
  added: []
  patterns: [role-scoped death vector differentiation, C-suite vs middle-management failure narratives]

key-files:
  created: []
  modified:
    - data/cards/chief-something-officer.ts
    - data/cards/head-of-something.ts

key-decisions:
  - "CSO deck: CONGRESS as primary new death vector (C-suite executive accountability for AI decisions)"
  - "HoS deck: REPLACED_BY_SCRIPT as primary new death vector (middle management layer elimination by AI)"
  - "Each role's new death vectors match real-world career position — executives face Congress, managers face automation"

patterns-established:
  - "Death vector differentiation by role tier: C-suite gets CONGRESS/BANKRUPT, middle management gets REPLACED_BY_SCRIPT"

requirements-completed: [DV-05]

# Metrics
duration: 8min
completed: 2026-03-26
---

# Phase 16 Plan 07: CSO/HoS Deck Differentiation via Distinct Death Vectors

**CSO deck gains CONGRESS (Senate AI testimony) and BANKRUPT (AI write-down) death vectors; HoS deck gains REPLACED_BY_SCRIPT (AI management elimination) — making the two decks feel narratively distinct for the first time**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-26
- **Completed:** 2026-03-26
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- CSO deck: Added 2 cards — Senate AI Testimony (CONGRESS/AUDIT_FAILURE) and AI Initiative Write-Down (BANKRUPT/CONGRESS)
- HoS deck: Added 2 cards — AI Management Layer Elimination (REPLACED_BY_SCRIPT/AUDIT_FAILURE) and Process Automation Takeover (REPLACED_BY_SCRIPT/FLED_COUNTRY)
- Both decks now pass all death vector coverage tests (≥40% annotation, ≥4 distinct types, CONGRESS in ≥3 decks)
- CSO and HoS decks feel distinctly different: executive accountability vs organizational displacement

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CONGRESS and BANKRUPT cards to CSO deck** - `40f5223` (feat)
2. **Task 2: Add REPLACED_BY_SCRIPT cards to HoS deck** - `353c307` (feat)

## Files Created/Modified
- `data/cards/chief-something-officer.ts` - 2 new cards (cso_senate_ai_testimony, cso_ai_initiative_writedown); CSO deck expanded from 20 to 22 cards
- `data/cards/head-of-something.ts` - 2 new cards (hos_ai_management_elimination, hos_process_automation_takeover); HoS deck expanded from 19 to 21 cards

## Decisions Made
- Used CONGRESS as primary new death vector for CSO (C-suite executives testify before Senate AI subcommittees in real-world AI governance)
- Used REPLACED_BY_SCRIPT as primary new death vector for HoS (middle management is the tier most exposed to AI automation per McKinsey reports)
- Each card mirrors real-world precedents: Senate AI hearings (2024-2025), Fortune 500 AI write-downs, McKinsey management layer reports, Klarna workforce reduction

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid object literal syntax in adjacent HoS card**
- **Found during:** Task 2 (HoS deck modification)
- **Issue:** Existing card `hos_process_automation_takeover` (the one being replaced by new card — actually an existing nearby card `hos_whistleblower_pressure`) had a `violation:` property with colon syntax instead of shorthand
- **Fix:** Used correct shorthand `violation` without colon in all new cards
- **Files modified:** data/cards/head-of-something.ts
- **Verification:** `bun run typecheck` passes
- **Committed in:** 353c307 (Task 2 commit)

**2. [Rule 1 - Bug] Corrected parameter name mapping from plan to actual makeCard signature**
- **Found during:** Task 1 (CSO deck modification)
- **Issue:** Plan documentation used parameter names `subject`, `body`, `choice`, `realWorldReference`, `referenceDate`, `referenceContext` but actual makeCard signature uses `context`, `text`, `storyContext`, `incident`, `date`, `outcome`
- **Fix:** Mapped all parameter names to match actual function signature in types.ts
- **Files modified:** data/cards/chief-something-officer.ts
- **Verification:** `bun run typecheck` passes
- **Committed in:** 40f5223 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 bug fixes)
**Impact on plan:** Both auto-fixes were syntax/correctness issues. No scope creep. Cards implement exactly as planned.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CSO and HoS decks now have distinct death vector distributions matching their real-world career positions
- All decks pass death vector coverage tests (DV-05 requirement met)
- Remaining decks may benefit from similar differentiation in future phases
- Ready for Phase 16 remaining plans (if any)

---
*Phase: 16-kobayashi-maru-ending-variety-system*
*Completed: 2026-03-26*
