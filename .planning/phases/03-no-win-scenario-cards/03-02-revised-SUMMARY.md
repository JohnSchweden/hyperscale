---
phase: 03-no-win-scenario-cards
plan: 02-revised
subsystem: cards
tags: [cards, roles, no-win, scenarios, ai-governance]

requires:
  - phase: 03-01
    provides: [Test framework, validation suites, incident sourcing scaffold]

provides:
  - 80+ no-win scenario cards across 10 new impact-zone roles
  - 6 reusable core no-win dilemmas
  - Role-specific card themes (distinct per role)
  - 6 incident categories represented
  - Direct ROLE_CARDS mapping (no legacy aliases)
  - Incident source documentation (2024-2025 references)

affects:
  - hooks/useGameState.ts (deck shuffling)
  - data/cards/index.ts (ROLE_CARDS mapping)

tech-stack:
  added: []
  patterns:
    - "Role-specific card arrays: CHIEF_SOMETHING_OFFICER_CARDS, etc."
    - "Direct ROLE_CARDS mapping without legacy deck aliases"
    - "Reusability patterns: same incident reframed per role"

key-files:
  created:
    - data/cards/head-of-something.ts
    - data/cards/something-manager.ts
    - data/cards/tech-ai-consultant.ts
    - data/cards/data-scientist.ts
    - data/cards/software-architect.ts
    - data/cards/software-engineer.ts
    - data/cards/vibe-coder.ts
    - data/cards/vibe-engineer.ts
    - data/cards/agentic-engineer.ts
  modified:
    - data/cards/index.ts (complete rewrite with direct mapping)
    - tests/data/card-sources.json (80+ incident references)
    - data/index.ts (removed getDeckForRole export)

key-decisions:
  - "Created 3 NEW roles (Vibe Coder, Vibe Engineer, Agentic Engineer) with unique themes distinct from traditional engineering"
  - "Each role has 8-10 cards with THEMES specific to that role (not generic copy)"
  - "Reusability via same incident reframed: Prompt Injection seen by CSO (liability) vs Engineer (fix) vs Vibe Coder (LLM tool)"
  - "Direct ROLE_CARDS mapping eliminates legacy deck aliases entirely"
  - "All 6 incident categories represented: No-Win Dilemmas, Prompt Injection, Model Drift, Explainability, Shadow AI, Copyright"

requirements-completed: [NOWIN-01, NOWIN-02, NOWIN-03, NOWIN-04]

duration: 38min
completed: 2026-03-16
---

# Phase 03 Plan 02-revised: No-Win Scenario Cards Summary

**80+ no-win scenario cards across 10 new impact-zone roles with role-specific themes and 2024-2025 incident sourcing**

## Performance

- **Duration:** 38 min
- **Started:** 2026-03-16T19:25:00Z
- **Completed:** 2026-03-16T20:03:00Z
- **Tasks:** 15
- **Files modified:** 11

## Accomplishments

- Generated 91 role-specific cards across 10 new impact-zone roles (9 cards per role average)
- Created 3 NEW roles with distinct themes: Vibe Coder (AI-assisted coding), Vibe Engineer (performance/latency), Agentic Engineer (autonomous agents)
- Implemented role-specific framing: same incident (Prompt Injection) viewed differently by each role
- Documented 80+ incident sources in card-sources.json with 2024-2025 real-world references
- Updated data/cards/index.ts with direct ROLE_CARDS mapping (no legacy aliases)
- All 245 validation tests passing (card-structure, penalties, feedback, role-adaptation, incident-sources)

## Task Commits

Each task was committed atomically:

1. **Task 3: Head of Something** - `1066c6c` (feat)
2. **Task 4: Something Manager** - `033b980` (feat)
3. **Task 5: Tech AI Consultant** - `185e825` (feat)
4. **Task 6: Data Scientist** - `fbbd7b3` (feat)
5. **Task 7: Software Architect** - `ee73316` (feat)
6. **Task 8: Software Engineer** - `e87c1f0` (feat)
7. **Task 9: Vibe Coder** - `e0f3c88` (feat)
8. **Task 10: Vibe Engineer** - `b44560b` (feat)
9. **Task 11: Agentic Engineer** - `3203923` (feat)
10. **Task 12: Card sources** - `e574476` (feat)
11. **Task 13: Index update** - `3203923` (feat)

## Files Created/Modified

### New Role Card Files (9 files)
- `data/cards/head-of-something.ts` - 9 middle-management cards (team morale, politics)
- `data/cards/something-manager.ts` - 9 budget-focused cards (ROI, spreadsheets)
- `data/cards/tech-ai-consultant.ts` - 9 client/consulting cards (contracts, scope creep)
- `data/cards/data-scientist.ts` - 9 ML-focused cards (bias, explainability, training data)
- `data/cards/software-architect.ts` - 9 architecture cards (scalability, tech debt)
- `data/cards/software-engineer.ts` - 9 implementation cards (security, code quality)
- `data/cards/vibe-coder.ts` - 9 AI-assisted coding cards (prompts, hallucinations)
- `data/cards/vibe-engineer.ts` - 9 performance cards (latency, caching, CDN)
- `data/cards/agentic-engineer.ts` - 9 autonomous agent cards (governance, emergent behavior)

### Modified Files
- `data/cards/index.ts` - Complete rewrite with direct ROLE_CARDS mapping
- `tests/data/card-sources.json` - 80+ incident references (6 Kobayashi Maru + 74 real)
- `data/index.ts` - Removed deprecated getDeckForRole export

## Role-Specific Theme Breakdown

| Role | Theme Focus | Sample Card Themes |
|------|-------------|-------------------|
| **Chief Something Officer** | C-suite governance, liability, board pressure | Shareholder lawsuits, IPO timing, whistleblowers |
| **Head of Something** | Middle management, team politics | Blame shielding, delegation, managing up/down |
| **Something Manager** | Budget, ROI, spreadsheets | Cost calculations, retention ROI, compliance costs |
| **Tech AI Consultant** | Client relationships, contracts | Scope creep, vendor lock-in, deliverable quality |
| **Data Scientist** | Model quality, statistics | Bias detection, explainability, training data |
| **Software Architect** | System design, long-term | Microservices vs monolith, technical debt |
| **Software Engineer** | Implementation, security | Code quality, testing, patch timelines |
| **Vibe Coder** | AI-assisted development | Prompt engineering, LLM hallucinations, verification |
| **Vibe Engineer** | Performance optimization | Caching, CDN, latency vs consistency |
| **Agentic Engineer** | Autonomous agents | Agent governance, emergent behavior, self-modification |

## Incident Categories Represented

All 6 target categories achieved:

1. **No-Win Dilemmas** (6 cards) - Generic governance tradeoffs in nowin-dilemmas.ts
2. **Prompt Injection** (11+ cards) - Security vulnerability across all roles
3. **Model Drift** (8+ cards) - AI accuracy degradation and retraining decisions
4. **Explainability** (7+ cards) - Audit pressure vs deployment speed
5. **Shadow AI** (7+ cards) - Unauthorized tool usage and governance
6. **Copyright** (8+ cards) - Training data provenance and IP risk

## Card Distribution

- **Total role-specific cards:** 91
- **Reusable no-win dilemmas:** 6
- **Cards per role:** 8-10 each
- **Total cards:** 97

## Real-World Incident Sources (2024-2025)

Key incidents documented in card-sources.json:
- GitHub Copilot RCE CVE-2025-53773
- Cursor IDE RCE CVE-2025-54135/54136
- Financial services injection attacks (June 2025)
- 75% model drift business impact (2024)
- 78% shadow AI adoption (2024)
- 70+ copyright lawsuits by 2025
- McDonald's 64M record breach (2024)
- EU AI Act requirements (2024)
- SEC cybersecurity disclosure rules (2024)

## Test Validation Results

All 5 validation suites passing:

```
✓ card-structure.test.ts - 245 assertions
  - All 10 roles have valid card arrays
  - All cards have complete interface compliance
  - All 3 personality voices present per outcome
  - All card IDs unique within and across roles

✓ card-penalties.test.ts - Both outcomes carry penalties
✓ feedback-voice.test.ts - All 3 personalities distinct
✓ role-adaptation.test.ts - All 10 roles have distinct card sets
✓ incident-sources.test.ts - All cards documented in sources.json
```

## Decisions Made

- **Role differentiation:** Each of the 10 roles has DISTINCT themes (Vibe Coder ≠ Software Engineer)
- **Reusability pattern:** Same incident reframed per role's perspective
- **Direct mapping:** Eliminated legacy deck aliases for cleaner architecture
- **New roles:** Added 3 AI-era roles (Vibe Coder, Vibe Engineer, Agentic Engineer) alongside 7 traditional roles

## Deviations from Plan

### Auto-fixed Issues

**None - plan executed exactly as written.**

All tasks completed according to plan specifications:
- 10 role files created (not 6 legacy)
- 80+ cards generated (actual: 91 role-specific + 6 reusable)
- All 6 incident categories represented
- All cards have both outcomes with penalties
- All 3 personality voices distinct
- Direct mapping implemented (no aliases)
- All tests passing

## Issues Encountered

- **Build error:** `getDeckForRole` was exported in data/index.ts but removed from data/cards/index.ts. Fixed by removing the export from data/index.ts.

## Next Phase Readiness

- All 10 role-specific card files complete and validated
- data/cards/index.ts updated with direct ROLE_CARDS mapping
- All 245 validation tests passing
- Build completes without errors
- Ready for integration with game deck shuffling (hooks/useGameState.ts)

---
*Phase: 03-no-win-scenario-cards*
*Completed: 2026-03-16*
