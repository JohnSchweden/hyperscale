# Phase 17: Shuffle-aware feedback TTS & content integrity

**Gathered:** 2026-03-25  
**Status:** Ready for execution  
**Source:** Cursor plan `fix_hos_audio_and_content` + codebase analysis

## Phase boundary

Deliver **correct Roaster feedback audio** for card choices after `shuffleDeck` randomly swaps `onLeft`/`onRight`, fix **incident pressure / countdown** using the same card instance as `CardStack` (`effectiveDeck`), remove **duplicate Head of Something** shadow-AI card, and **vary roast LLM prompts** so output is not locked to the same 1–3 sentence cadence.

Out of scope: regenerating all HoS audio; per-card TTS for every non-critical card; Phase 16 death-vector work.

## Locked decisions

- **Audio mapping:** Pre-baked files `feedback_${cardId}_left|right` remain keyed to **authoring** `onLeft` / `onRight`. At runtime, compute a **canonical audio side** from UI swipe + `choiceSidesSwapped` before calling `feedbackVoiceTrigger`.
- **Flag placement:** Optional `choiceSidesSwapped` on `Card`; set explicitly `true`/`false` on every shuffled deck copy in `shuffleDeck`.
- **Pressure source:** `currentCard` in `App.tsx` during `PLAYING` must resolve from `state.effectiveDeck ?? ROLE_CARDS[role]` at `currentCardIndex`, matching `handleChoice`.
- **HoS duplicate:** Remove one of `hos_shadow_ai_team_discovery` vs `shadow_ai_hos_1` (same copy); prune `CRITICAL_HOS_CARDS`, generation scripts, tests, and **delete** orphan `public/audio/voices/roaster/feedback/feedback_<id>_*.{opus,mp3}` for removed id. Prefer keeping **`shadow_ai_hos_1`** and dropping **`hos_shadow_ai_team_discovery`** unless product prefers `hos_*` naming (document in commit).
- **Roast prompts:** Edit copy only in `services/geminiLive.ts` and `api/roast.ts` — no new APIs.

## Claude's discretion

- Exact wording of `canonicalFeedbackAudioSide` helper location (`lib/feedbackAudioDirection.ts` vs inline).
- Whether to add a dedicated unit file for the helper vs `lib/deck.test.ts` only.
- E2E vs unit-only proof for voice path (prefer unit test on trigger string + existing `@area:audio` smoke).

## Deferred

- Replacing generic `feedback_ignore` / `feedback_install` for all decks with bespoke clips.

---

*Phase: 17-shuffle-aware-feedback-tts-fixes*
