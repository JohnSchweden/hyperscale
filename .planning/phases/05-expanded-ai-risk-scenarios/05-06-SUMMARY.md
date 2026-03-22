---
phase: 05-expanded-ai-risk-scenarios
plan: 06
subsystem: content-audit
tags: [audit, death-endings, personalities, archetypes, gap-analysis]

requires:
  - phase: 05-01
    provides: Test scaffold foundation for Phase 05

provides:
  - Complete audit of 6 death endings against 10 roles
  - Affinity matrix showing coverage gaps
  - Personality distinctiveness assessment
  - 3 new personality proposals with full specifications
  - Implementation scope estimate for future phase

affects:
  - phase-08-kobayashi-maru-framing
  - phase-13-image-asset-pipeline

tech-stack:
  added: []
  patterns:
    - "Document-only audit (no code changes)"
    - "Affinity matrix analysis methodology"

key-files:
  created:
    - .planning/phases/05-expanded-ai-risk-scenarios/05-06-AUDIT-REPORT.md
  modified: []

key-decisions:
  - "Keep existing 6 death endings — they work well for leadership roles"
  - "Consider adding 2-3 technical death endings for IC roles in future phase"
  - "Add THE_ANALYST personality as high priority (fills analytical gap)"
  - "Add THE_MENTOR personality as medium priority (universal appeal)"
  - "Defer THE_PARANOID to Phase 08 (niche appeal)"
  - "Implementation recommended for Phase 13 or Phase 08"

patterns-established:
  - "Audit methodology: role × content affinity matrix"
  - "Personality voice specification template"
  - "Implementation scope estimation framework"

requirements-completed: []

duration: 6min
completed: 2026-03-22
---

# Phase 05 Plan 06: Archetype & Death Ending Audit Summary

**Complete audit of 6 death endings and 3 personality archetypes across 10 roles with gap analysis and 3 new personality proposals**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-22T22:02:55Z
- **Completed:** 2026-03-22T22:09:04Z
- **Tasks:** 4
- **Files created:** 1

## Accomplishments

- Created death ending affinity matrix (10 roles × 6 death types)
- Identified coverage gaps: technical IC roles (DS, Arch, Eng, VC, VE, AE) have only 1-2 strong fits vs 4-6 for leadership
- Assessed personality distinctiveness across 10-role playthroughs
- Discovered ROASTER dominates 6/10 roles, creating imbalance
- Proposed 3 new personalities: THE_ANALYST (Quant), THE_PARANOID (Watcher), THE_MENTOR (Professor)
- Estimated implementation scope: 6-8 hours per personality (~400 feedback strings each)

## Task Commits

Each task was committed atomically:

1. **Task 1: Death ending affinity matrix audit** - `0c7b35d` (docs)
2. **Task 2: Personality archetype distinctiveness audit** - (analysis only, no commit needed)
3. **Task 3: New personality proposals** - `d8db57c` (docs)
4. **Task 4: Write audit report** - `09d9605` (docs)

**Plan metadata:** `09d9605` (docs: complete plan)

## Files Created/Modified

- `.planning/phases/05-expanded-ai-risk-scenarios/05-06-AUDIT-REPORT.md` - Complete audit report with death ending matrix, personality analysis, 3 proposals, and implementation recommendations

## Decisions Made

1. **Keep existing 6 death endings** — They work well for leadership roles. Consider adding 2-3 technical endings (AGENT_UPRISING, TECHNICAL_DEBT_COLLAPSE, DATA_POISONING) for IC roles in future phase.

2. **Add THE_ANALYST (QUANT) as high priority** — Fills the biggest gap (analytical/data-driven commentary). Strong affinity with Data Scientist role. Uses Charon voice.

3. **Add THE_MENTOR (PROFESSOR) as medium priority** — Universal appeal across all roles through historical case references. Educational value reinforces K-Maru learning goals. Uses Aoede voice.

4. **Defer THE_PARANOID (WATCHER) to Phase 08** — Niche appeal (surveillance/conspiracy theme). Fits Agentic Engineer well but less universal. Uses Fenrir voice.

5. **Recommended implementation phase: Phase 13 or Phase 08** — Phase 05 cards must be finalized first. Adding personalities is content-heavy, not code-heavy.

## Deviations from Plan

None - plan executed exactly as written. This was a document-only audit with no code changes required.

## Issues Encountered

- Pre-existing TypeScript errors in `data/cards/chief-something-officer.ts` (lines 655+) — Not related to this audit work; pre-existing issue in codebase

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Audit report available for future planning
- Personality proposals ready for Phase 08 or Phase 13 implementation
- Implementation scope estimated: 6-8 hours per personality
- Dependencies identified: Phase 05 cards must be finalized first

---
*Phase: 05-expanded-ai-risk-scenarios*  
*Plan: 06*  
*Completed: 2026-03-22*
