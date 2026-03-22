---
phase: 07-kirk-easter-egg
plan: 01
subsystem: game-state
tags: [kirk, easter-egg, reducer, audio, state-machine]
dependency-graph:
  requires: []
  provides: [DeathType.KIRK, kirkCounter, kirkCorruptionActive, KIRK_REFUSAL, KIRK_CORRUPTED_CARDS, playKirkGlitchTone, playKirkCrashSound]
  affects: [hooks/useGameState.ts, types.ts, data/deathEndings.ts]
tech-stack:
  added: []
  patterns: [useReducer state machine extension, Web Audio API oscillator synthesis, TDD with Vitest]
key-files:
  created:
    - data/kirkCards.ts
    - services/kirkAudio.ts
    - unit/kirkRefusal.test.ts
  modified:
    - types.ts
    - hooks/useGameState.ts
    - data/deathEndings.ts
decisions:
  - Kirk death uses createGameOverState guard to skip unlockedEndings — DeathType.KIRK !== any normal ending
  - NEXT_INCIDENT triggers Kirk ending when corruption active and nextIndex >= effectiveDeck.length
  - kirkCounter resets per game on RESET action (not cross-session)
  - Both onLeft and onRight outcomes are identical for corrupted cards (simulation offers no real choice)
metrics:
  duration: "~6 minutes"
  tasks_completed: 2
  files_created: 3
  files_modified: 3
  tests_added: 10
  completed_date: "2026-03-22"
---

# Phase 07 Plan 01: Kirk Easter Egg — State Foundation Summary

**One-liner:** DeathType.KIRK enum value, kirkCounter state machine, KIRK_CORRUPTED_CARDS injection, and Web Audio glitch/crash synthesis.

## What Was Built

### Task 1: Kirk state types, reducer logic, and corrupted cards (TDD)

Established all data contracts the gesture detection (plan 02) and ending UI (plan 03) depend on.

**types.ts changes:**
- Added `KIRK = "KIRK"` to `DeathType` enum
- Added `kirkCounter: number` and `kirkCorruptionActive: boolean` to `GameState` interface

**hooks/useGameState.ts changes:**
- `initialGameState` includes `kirkCounter: 0, kirkCorruptionActive: false`
- New `KIRK_REFUSAL` case in `gameReducer`: increments counter; at count 2 splices `KIRK_CORRUPTED_CARDS` into `effectiveDeck` after `currentCardIndex`
- `NEXT_INCIDENT` checks `kirkCorruptionActive && nextIndex >= effectiveDeck.length` to trigger Kirk game over
- `createGameOverState` guards Kirk from `unlockedEndings`: the secret ending exists outside the normal 6
- `RESET` restores `kirkCounter: 0, kirkCorruptionActive: false`

**data/kirkCards.ts** (new file):
- 3 corrupted "good news" cards with escalating absurdity: 200% raise, CEO promotion, Nobel Prize
- Sender: `S̶Y̶S̷T̶E̶M̴` (strikethrough Unicode combining characters)
- All feedback keys present for all 3 PersonalityTypes (garbled, personalities bleeding together)
- Both onLeft and onRight are identical — the simulation offers no real choice
- Zero stat impact (hype: 0, heat: 0, fine: 0) — numbers are meaningless at this point

**data/deathEndings.ts**:
- Added `[DeathType.KIRK]` entry: title "SIMULATION BREACH DETECTED", description "You changed the conditions of the test."

**unit/kirkRefusal.test.ts** (new file, 10 tests — all green):
- `KIRK_REFUSAL` increments counter 0→1
- At `kirkCounter=1`, activates corruption and injects cards at correct position
- At `kirkCounter>=2`, no-ops
- `NEXT_INCIDENT` on last corrupted card triggers `DeathType.KIRK` game over
- `RESET` zeroes out kirk fields
- `DEATH_ENDINGS[DeathType.KIRK]` has valid title + description
- `KIRK_CORRUPTED_CARDS` has exactly 3 cards with valid Card shape and all personality keys
- Cards have `kirk-` id prefix
- Kirk game over does NOT add to `unlockedEndings`

### Task 2: Kirk audio synthesis functions

**services/kirkAudio.ts** (new file):
- `playKirkGlitchTone(ctx)`: sawtooth oscillator sweeping 200→800→100Hz over 120ms at gain 0.06 — subtle "something happened" cue for first refusal
- `playKirkCrashSound(ctx)`: white noise buffer (exponential decay) + square oscillator descending 1200→40Hz over 0.8s — intense crash for second refusal
- Both functions guard `ctx.state === "suspended"` (mobile AudioContext unlock pattern)
- Both are fire-and-forget (oscillators auto-stop at scheduled time)
- Follows `pressureAudio.ts` patterns exactly: same oscillator creation, gain scheduling, connection topology

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `data/kirkCards.ts` created and exports `KIRK_CORRUPTED_CARDS`
- [x] `services/kirkAudio.ts` created and exports `playKirkGlitchTone`, `playKirkCrashSound`
- [x] `unit/kirkRefusal.test.ts` created with 10 passing tests
- [x] `types.ts` contains `DeathType.KIRK`, `kirkCounter`, `kirkCorruptionActive`
- [x] `hooks/useGameState.ts` contains `KIRK_REFUSAL` case
- [x] `data/deathEndings.ts` contains `DeathType.KIRK` entry
- [x] Commits `4d30f5e` and `d423878` exist

## Self-Check: PASSED
