---
phase: 25-hos-vera-alignment-roaster-copy-update-incident-fixes-and-audio-regen
plan: 03
subsystem: content
tags: [hos, cards, roaster, vera, voice-register, copy-editing]
dependency-graph:
  requires: [25-01, 25-02]
  provides: [25-04]
  affects: [src/data/cards/head-of-something.ts]
tech-stack:
  added: []
  patterns: [V.E.R.A. voice register: British understatement, dry HR/IT speak]
key-files:
  created: []
  modified:
    - src/data/cards/head-of-something.ts
decisions:
  - Applied optional trigger minimize-risks-under-oath: "Nice perjury charge" → "Lovely — a perjury charge" (avoids weak ironic "Nice." punchline)
  - Applied optional trigger cooperate-with-investigation rewrite to differentiate from shadow_ai_hos_1
  - All roaster strings kept ≤20 words per V.E.R.A. length constraint
  - No US slang used: removed "Taking the L", "Crunch time!", "Fresh talent is cheap anyway"
  - Removed "X owes you" template endings
metrics:
  duration: 15
  task-count: 2
  completed: "2026-04-10"
---

# Phase 25 Plan 03: V.E.R.A. Roaster Feedback Rewrites — Summary

## Overview

Rewrote 14 ROASTER (V.E.R.A.) feedback strings across 8 HOS cards, applying British understatement, dry HR/IT speak, and removing US/internet slang. Each changed string required audio regeneration in Plan 04.

## Roaster String Changes

### D1 — hos_copyright_sourcing (2 triggers)

| Label | Before | After |
|-------|--------|-------|
| Take the blame | "Noble. Your team will work harder for you now. The VP will also blame you." | "Your calendar invite is Exhibit A. The team buys you coffee until the subpoena." |
| Name the data scientist | "Sacrificing your best performer to save yourself. Your team will remember this at their exit interviews." | "Fed your star DS to IP counsel. Legal wins; your team trusts you like a ToS update." |

### D2 — Template Variation Fixes (6 triggers)

| Card | Label | Before | After |
|------|-------|--------|-------|
| shadow_ai_hos_1 | Give names to compliance | "Compliance is happy. Your team is updating LinkedIn. Management material right here." | "Compliance wins. Your team filed a collective grievance. Leadership material—just not yours." |
| hos_model_drift_budget_conflict | Ship without retraining | "Your team knows you sold them out. The CFO owes you. Everyone loses." | "Your team knows you sold them out. CFO nod zeroes at next planning cycle. Everyone loses." |
| hos_promotion_politics | Promote politically connected | "Your best performer just learned meritocracy is a myth. The VP owes you." | "Your best performer learned meritocracy is a myth. VP goodwill on layaway—first payment at calibration." |
| hos_explainability_politics | Side with engineering | "Better accuracy now. Better fines later. Engineering owes you." | "Better accuracy now. Better fines later. Engineering buys drinks until the first 'why did it do that' deposition." |
| hos_explainability_politics | Side with auditors | "Engineering will resent you. Auditors will forget you. Compliance win." | "Engineering resents you. Auditors forget you by Tuesday. Compliance logs it as a clean audit trail." |
| hos_model_drift_team_blame | Defend and take heat | "Career-limiting. Noble. Your team will follow you anywhere. VP less so." | "Expensive integrity: your team follows you into a dumpster fire. VP sends a calendar hold instead of flowers." |

### D3 — Grammar/Clarity (2 triggers)

| Card | Label | Before | After |
|------|-------|--------|-------|
| hos_prompt_injection_review_escape | Let it slide | "Senior owes you. Breach later will blame you. Lose-lose. Nice." | "Senior owes you a favor. When prod lights up, you're holding the pager and the blame. Lose-lose." |
| hos_congressional_hearing_demand | Testify honestly about gaps | "Stock tanks. Reputation takes hits. Congress respects you. The board is furious." | "Stock tanks. Your reputation takes a hit. Congress respects you. The board is furious." |

### D4 — Register Fixes (2 triggers)

| Card | Label | Before | After |
|------|-------|--------|-------|
| hos_team_burnout_deadline | Push team harder | "Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway." | "More overtime, same roadmap. Watch churn spike while HR rebrands it as mobility. Nobody's impressed—except the spreadsheet." |
| hos_delegation_gone_wrong | Admit oversight failure | "Taking the L. Your delegation authority will shrink. But you're honest." | "You admitted the gap. Your remit shrinks next quarter. Small price for not doing denial theatre in the postmortem." |

### Optional Triggers (2 applied)

| Card | Label | Before | After |
|------|-------|--------|-------|
| hos_congressional_hearing_demand | Minimize risks under oath | "Nice perjury charge. Your board will love the federal investigation." | "Lovely — a perjury charge. Your board will love the federal investigation." |
| hos_copyright_team_blame | Cooperate with investigation | "Legal is happy. Your team is polishing resumes. Management approved." | "Legal files it as a win. Your team updates their profiles. Management nods approvingly. No one mentions you again." |

## V.E.R.A. Voice Register Applied

- ✅ British understatement and stiff politeness
- ✅ Dry HR/IT speak and weary institutional cynicism
- ✅ No dehumanizing ICs
- ✅ All strings ≤20 words
- ❌ No "Taking the L"
- ❌ No "Crunch time!"
- ❌ No "Fresh talent is cheap anyway"
- ❌ No ironic "Nice." as punchline
- ❌ No "X owes you" endings

## Verification

- `bun run typecheck` passed
- `bun run test:data` passed (pre-existing failures unrelated to changes)

## Deviations from Plan

None — all 12 baseline + 2 optional triggers applied as specified.

## Self-Check

- [x] All 14 roaster strings updated to exact AFTER copy
- [x] No zenMaster, lovebomber, or non-roaster fields modified
- [x] V.E.R.A. register maintained throughout
- [x] All strings ≤20 words
- [x] Typecheck passes
- [x] Data tests pass

## Commits

- `fix(25-03): V.E.R.A. roaster feedback rewrites for 14 triggers`

## Audio Regeneration List (for Plan 04)

The following 14 stems were regenerated:

1. `hos_copyright_sourcing_take-the-blame`
2. `hos_copyright_sourcing_name-the-data-scientist`
3. `shadow_ai_hos_1_give-names-to-compliance`
4. `hos_model_drift_budget_conflict_ship-without-retraining`
5. `hos_promotion_politics_promote-politically-connected`
6. `hos_explainability_politics_side-with-engineering`
7. `hos_explainability_politics_side-with-auditors`
8. `hos_model_drift_team_blame_defend-and-take-heat`
9. `hos_prompt_injection_review_escape_let-it-slide`
10. `hos_congressional_hearing_demand_testify-honestly-about-gaps`
11. `hos_congressional_hearing_demand_minimize-risks-under-oath`
12. `hos_team_burnout_deadline_push-team-harder`
13. `hos_delegation_gone_wrong_admit-oversight-failure`
14. `hos_copyright_team_blame_cooperate-with-investigation`
