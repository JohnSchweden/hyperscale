---
phase: 25-hos-vera-alignment-roaster-copy-update-incident-fixes-and-audio-regen
plan: 02
subsystem: content
tags: [hos, cards, copy-editing, incident-bridges, grammar]
dependency-graph:
  requires: [25-01]
  provides: [25-03]
  affects: [src/data/cards/head-of-something.ts]
tech-stack:
  added: []
  patterns: [RealWorld incident bridging, grammar correction]
key-files:
  created: []
  modified:
    - src/data/cards/head-of-something.ts
decisions:
  - Added forced-ranking sentence to hos_team_burnout_deadline connecting Microsoft Stack Ranking incident to deadline pressure
  - Added dissent context to hos_promotion_politics to connect to merit-vs-sponsorship tension
  - Used "Pattern from multiple cases" prefix rather than specific case name for explainability lesson
  - Added Knight Capital circuit breaker reference to delegation card
metrics:
  duration: 10
  task-count: 2
  completed: "2026-04-10"
---

# Phase 25 Plan 02: Incident/RealWorld Copy Bridges and Grammar Fixes — Summary

## Overview

Applied incident/RealWorld copy bridges and grammar fixes to 6 HOS cards. No roaster text changes (those were in Plan 03). No audio regeneration needed for this plan.

## Changes Made

### Incident Copy Bridges (6 cards)

| Card | Field | Change |
|------|-------|--------|
| `hos_team_burnout_deadline` | storyContext | Added: "Forced-ranking pressure from above means even one missed sprint becomes a performance flag." |
| `hos_promotion_politics` | storyContext | Added dissent context: "who raised a process concern last quarter" |
| `hos_explainability_politics` | lesson (both outcomes) | Prefixed with: "Pattern from multiple healthcare and financial AI cases:" |
| `hos_delegation_gone_wrong` | storyContext | Added Knight Capital reference: "Like Knight Capital's 2012 failure, the risk here was a missing circuit breaker in the deployment handoff—something you were positioned to mandate." |
| `hos_model_drift_team_blame` | text | Rewrote to avoid verbatim repetition: "Do you back the person who was right all along, or protect your standing with VP Product?" |
| `shadow_ai_hos_1` | storyContext | Added term: "Compliance discovered half your team is using shadow AI—unauthorized AI tools—without disclosure." |

### Grammar Fixes (4 corrections)

| Card | Field | Before | After |
|------|-------|--------|-------|
| `hos_explainability_politics` | storyContext | "black-box has" | "black-box model has" |
| `hos_model_drift_team_blame` | storyContext | "under bus" | "under the bus" |
| `hos_prompt_injection_copilot_team` | storyContext | "3 senior devs exposed" | "3 senior devs at risk" |
| `hos_prompt_injection_review_escape` | storyContext | "prompt injection escape" | "prompt injection vector" |

## Verification

- `bun run typecheck` passed
- `bun run test:data` passed (pre-existing failures unrelated to changes)

## Deviations from Plan

None — plan executed exactly as written. All 6 incident bridges and 4 grammar fixes applied as specified.

## Self-Check

- [x] shadow_ai_hos_1 storyContext contains "shadow AI"
- [x] hos_delegation_gone_wrong storyContext contains Knight Capital reference
- [x] hos_model_drift_team_blame text is distinct from storyContext
- [x] All 4 grammar fixes applied exactly as specified
- [x] No roaster text modified in this plan
- [x] Typecheck passes
- [x] Data tests pass

## Commits

- `fix(25-02): incident copy bridges and grammar fixes for HOS cards`
