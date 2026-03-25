# Phase 17 — Technical research

**Status:** Complete (sourced from implementation plan + code read)  
**Date:** 2026-03-25

## Problem statement

1. **`shuffleDeck`** ([`lib/deck.ts`](../../../lib/deck.ts)) may swap `onLeft`/`onRight` per card. [`useVoicePlayback`](../../../hooks/useVoicePlayback.ts) builds triggers as `feedback_${cardId}_${uiSwipeLower}` — filenames were generated from **canonical** left/right text. After swap, UI swipe and canonical side diverge → **wrong clip**.

2. **`App.tsx`** derives `currentCard` from `ROLE_CARDS[role][index]` while [`GameScreen`](../../../components/game/GameScreen.tsx) uses `effectiveDeck` → **pressure / countdown / team impact** can target the wrong card or ignore swap state.

3. **Duplicate cards** in [`data/cards/head-of-something.ts`](../../../data/cards/head-of-something.ts): `hos_shadow_ai_team_discovery` and `shadow_ai_hos_1` — identical player-facing copy, different ids and audio pairs.

4. **Roast cadence:** [`geminiLive.ts`](../../../services/geminiLive.ts) system instruction forces "1-3 sentences"; [`api/roast.ts`](../../../api/roast.ts) caps at 50 words.

## Validation Architecture

| Dimension | Approach |
|-----------|----------|
| **Unit** | Vitest: `shuffleDeck` sets `choiceSidesSwapped`; `canonicalFeedbackAudioSide` inverts when swapped; pure trigger string matches expected file stem. |
| **Integration** | Existing Playwright `@smoke` / `@area:audio` after wiring; optional assert console `[Voice] Loading` path includes correct trigger. |
| **Manual** | Spot-check HoS + Roaster: swipe after forced swap (debug seed or repeated runs) — audio matches overlay text. |
| **Regression** | No change to `history` choice semantics (still UI LEFT/RIGHT); debrief and archetype logic unchanged. |

## Key files

- [`types.ts`](../../../types.ts) — `Card`
- [`lib/deck.ts`](../../../lib/deck.ts) — shuffle + swap
- [`App.tsx`](../../../App.tsx) — `applyChoice`, `FeedbackOverlayState`, `currentCard`
- [`hooks/useVoicePlayback.ts`](../../../hooks/useVoicePlayback.ts) — `feedbackVoiceTrigger`
- [`hooks/useIncidentPressure.ts`](../../../hooks/useIncidentPressure.ts) — consumes `currentCard`
- [`tests/voice-hos-critical-audio.spec.ts`](../../../tests/voice-hos-critical-audio.spec.ts)

## RESEARCH COMPLETE
