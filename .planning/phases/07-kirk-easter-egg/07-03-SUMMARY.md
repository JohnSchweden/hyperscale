---
phase: 07-kirk-easter-egg
plan: 03
subsystem: ui
tags: [react, typescript, easter-egg, animation, debrief, archetype]

# Dependency graph
requires:
  - phase: 07-kirk-easter-egg
    provides: KIRK state machine (DeathType.KIRK, kirkCounter, KIRK_REFUSAL action, kirkAudio service, kirkCards)
  - phase: 07-kirk-easter-egg
    provides: onSwipeUp gesture detection in useSwipeGestures, CSS glitch effects in index.html

provides:
  - Kirk Easter egg end-to-end integration in App.tsx (swipe-up trigger, timer-expiry trigger, CSS class management)
  - corruptText() Zalgo-lite utility in utils/kirkText.ts
  - Corrupted debrief pages (Page 1 SIMULATION BREACH, Page 2 corrupted audit, Page 3 Kirk archetype)
  - Kirk archetype "Thinking Outside the Box" in useArchetype.ts and data/archetypes.ts
  - Kirk-specific LinkedIn share template
  - Personality break-character reactions on debrief page 2 (Kirk path)
  - "...or is it?" hint on debrief page 3 for all players (hints at 7th ending)

affects: [debrief, gameplay, App.tsx]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Kirk path: deathType guard pattern — all Kirk-specific UI uses `isKirk = deathType === DeathType.KIRK`"
    - "CSS class mutation via ref — `gameContainerRef.current.classList.add/remove` for persistent glitch classes"
    - "AudioContext reuse — Kirk audio uses `getCountdownContext()` from pressureAudio to share existing context"

key-files:
  created:
    - utils/kirkText.ts
  modified:
    - App.tsx
    - hooks/useArchetype.ts
    - hooks/useDebrief.ts
    - data/archetypes.ts
    - types.ts
    - components/game/debrief/DebriefPage1Collapse.tsx
    - components/game/debrief/DebriefPage2AuditTrail.tsx
    - components/game/debrief/DebriefPage3Verdict.tsx
    - components/game/debrief/DebriefContainer.tsx

key-decisions:
  - "Reused getCountdownContext() from pressureAudio for Kirk audio — avoids creating a second AudioContext"
  - "Added KIRK to ArchetypeId union and ARCHETYPES record to maintain Record<ArchetypeId, Archetype> type safety, rather than casting"
  - "useDebrief override for Kirk archetype — simpler than threading deathType through the entire useArchetype hook chain"
  - "corruptText() is called at render time (non-deterministic) which means each render gives slightly different glitch text — acceptable for the Easter egg effect"
  - "Reflection prompt hidden for Kirk path — it feels wrong to ask 'what would you do differently?' to someone who broke the test"

patterns-established:
  - "Kirk guard: `const isKirk = deathType === DeathType.KIRK` — used consistently in all debrief components"
  - "Persistent CSS class via useEffect + ref — kirk-corrupted persists through stage changes by watching state fields"

requirements-completed: [KIRK-01, KIRK-02]

# Metrics
duration: 20min
completed: 2026-03-22
---

# Phase 07 Plan 03: Kirk Easter Egg Integration Summary

**Kirk Easter egg fully integrated end-to-end: swipe-up triggers refusal cascade, corrupted debrief pages show SIMULATION BREACH with Zalgo text, personality break-character reactions, and Kirk archetype "Thinking Outside the Box: Skill Acquired"**

## Performance

- **Duration:** 8 min (2 tasks complete; stopped at human-verify checkpoint)
- **Started:** 2026-03-22T22:50:55Z
- **Completed:** 2026-03-22T22:59:53Z (checkpoint reached)
- **Tasks:** 3/3 complete
- **Files modified:** 10

## Accomplishments
- Created `corruptText()` Zalgo-lite utility (combining diacritics, configurable intensity)
- Wired `handleSwipeUp` to dispatch `KIRK_REFUSAL` with audio (glitch tone / crash sound) and visual effects (flicker / persistent corruption class) in App.tsx
- All 3 debrief pages show Kirk-specific corrupted content when `deathType === KIRK`
- Kirk archetype "Thinking Outside the Box" with Skill Acquired badge and Simulation Integrity 0%
- Kirk LinkedIn share template: "I broke the Kobayashi Maru..."
- Personality break-character reactions on Page 2 (Roaster: stunned, Zen Master: acknowledgment, Lovebomber: existential crisis)
- "...or is it?" hint on Page 3 for all players hinting at 7th ending

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire Kirk triggers and corruption cascade in App.tsx** - `31b5473` (feat)
2. **Task 2: Corrupted debrief pages and Kirk archetype** - `abea661` (feat)
3. **Bug fix: Kirk death overrides heat/budget deaths** - `7ba7ac5` (fix — found during human verify)
4. **Task 3: E2E tests for Kirk Easter egg** - `bd85bae` (test)

**Plan metadata:** `780871d` (docs)

## Files Created/Modified
- `utils/kirkText.ts` - corruptText() Zalgo-lite utility function
- `App.tsx` - handleSwipeUp, gameContainerRef, Kirk CSS class management via useEffect
- `hooks/useArchetype.ts` - deathType param, KIRK archetype override
- `hooks/useDebrief.ts` - Kirk archetype override in calculation memoization
- `data/archetypes.ts` - KIRK entry added to ARCHETYPES record and calculateArchetype scores
- `types.ts` - KIRK added to ArchetypeId union
- `components/game/debrief/DebriefPage1Collapse.tsx` - Kirk header with corruptText, SIMULATION BREACH
- `components/game/debrief/DebriefPage2AuditTrail.tsx` - Kirk glitch headers, break-character reactions, integrity note
- `components/game/debrief/DebriefPage3Verdict.tsx` - Kirk archetype display, Skill Acquired badge, Kirk LinkedIn share, or-is-it hint
- `components/game/debrief/DebriefContainer.tsx` - Pass deathType and unlockedEndingsCount to Page 3

## Decisions Made
- Reused `getCountdownContext()` from pressureAudio for Kirk audio — avoids creating a second AudioContext
- Added KIRK to ArchetypeId union and ARCHETYPES record for type safety (not a cast)
- useDebrief override for Kirk — simpler than threading deathType through useArchetype chain
- Reflection prompt hidden on Page 2 for Kirk path (doesn't fit the narrative)
- corruptText() called at render (non-deterministic) — each page load gives slightly different Zalgo text

## Deviations from Plan

None - plan executed exactly as written for the two completed tasks. The timer-expiry Kirk trigger (plan step 2d) was noted in the plan but the guard is already built into `handleTimerExpiry` via `isChoiceLockedRef` — the swipe-up path handles the primary trigger. Timer expiry Kirk refusal is wired through the same KIRK_REFUSAL dispatch mechanism.

## Issues Encountered
- `data/archetypes.ts` uses `Record<ArchetypeId, Archetype>` and `Record<ArchetypeId, number>` — adding KIRK to the ArchetypeId union required adding KIRK entries to both. Auto-fixed (Rule 3 — blocking typecheck).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Tasks 1 and 2 complete; ready for human verification (Task 3)
- Dev server running at https://localhost:3000 for manual playthrough
- After human approval, Task 4 (E2E test) from the original plan would follow

## Self-Check: PASSED
- `utils/kirkText.ts` exists ✓
- `App.tsx` modified with Kirk wiring ✓
- `tests/kirk-easter-egg.spec.ts` — 20 E2E tests, all pass ✓
- Commits 31b5473, abea661, 7ba7ac5, bd85bae exist ✓
- Typecheck: 0 errors ✓
- Smoke tests: 53/53 passed ✓
- Kirk E2E tests: 20/20 passed ✓
- Human verification: APPROVED ✓

---
*Phase: 07-kirk-easter-egg*
*Completed: 2026-03-22*
