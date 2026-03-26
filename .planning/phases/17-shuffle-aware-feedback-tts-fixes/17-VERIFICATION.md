---
phase: 17-shuffle-aware-feedback-tts-fixes
verified: 2026-03-27T00:44:00Z
status: passed
score: 6/6 must-haves verified
re_verification:
  previous_status: passed
  previous_score: 4/4
  previous_verified: 2026-03-26T23:45:00Z
  gaps_closed: []
  gaps_remaining: []
  regressions: []
  note: "Previous verification covered 17-01 through 17-03 (4 must-haves). This re-verification covers all 5 plans including 17-04 (slug migration) and 17-05 (audio rename), expanding to 6 must-haves."
---

# Phase 17: Shuffle-aware feedback TTS & content integrity — Verification Report

**Phase Goal:** Fix Roaster feedback audio desync when `shuffleDeck` swaps card sides; align incident pressure with `effectiveDeck`; remove duplicate HoS shadow-AI card and orphan audio; vary roast LLM cadence in prompts.

**Verified:** 2026-03-27T00:44:00Z
**Status:** passed
**Re-verification:** Yes — expanded scope to include 17-04 (slug migration) and 17-05 (audio rename)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Shuffled deck cards record whether onLeft/onRight payloads were swapped from authoring order | ✓ VERIFIED | `types.ts:140` — `choiceSidesSwapped?: boolean` on `Card`. `lib/deck.ts:18-30` — `shuffleDeck` sets `true`/`false` on every card. `lib/deck.test.ts:96-138` — deterministic `Math.random` mocks confirm swap/no-swap. |
| 2 | `authoringFeedbackStem` maps the chosen presentation slot to the authoring label slug for that outcome | ✓ VERIFIED | `lib/feedbackAudioChoice.ts:22-34` — returns `slugify(card.onLeft.label)` or `slugify(card.onRight.label)`, inverted when `choiceSidesSwapped === true`. `unit/feedbackAudioChoice.test.ts` — 6 table-driven cases all pass. |
| 3 | Feedback overlay carries the authoring stem; `useVoicePlayback` uses it for per-card feedback trigger | ✓ VERIFIED | `App.tsx:113` — `feedbackAuthoringStem: string` in `FeedbackOverlayState`. `App.tsx:210` — `authoringFeedbackStem(card, direction)` called in `applyChoice`. `hooks/useVoicePlayback.ts:101-106` — `feedbackVoiceTrigger` uses slug for `CRITICAL_HOS_CARDS`: `` `feedback_${cardId}_${authoringStem}` ``. |
| 4 | Incident pressure sees the same `Card` instance as CardStack during PLAYING | ✓ VERIFIED | `App.tsx:180-183` — `currentCard` derived from `state.effectiveDeck ?? ROLE_CARDS[state.role]`. `App.tsx:358-360` — incident timer uses same `effectiveDeck` path. |
| 5 | Only one of the duplicate shadow-AI HoS cards remains; `CRITICAL_HOS_CARDS`, scripts, tests, and audio assets synced | ✓ VERIFIED | `data/cards/head-of-something.ts:95` — only `shadow_ai_hos_1` present (no `hos_shadow_ai_team_discovery`). `hooks/useVoicePlayback.ts:76-97` — `CRITICAL_HOS_CARDS` set has `shadow_ai_hos_1`, not the old id. Grep `*.{ts,tsx,mjs}` — zero `hos_shadow_ai_team_discovery` references. Grep `*.json` — zero references. |
| 6 | `geminiLive` + `api/roast` prompts encourage varied length/rhythm instead of rigid cadence | ✓ VERIFIED | `services/geminiLive.ts:284-288` — all 3 personalities use "Vary length and rhythm" / "vary pacing and rhythm" / "vary rhythm". `api/roast.ts:45` — "vary pacing and structure". `unit/roastPromptCopy.test.ts` — asserts `1-3 sentences` absent, `rhythm`/`vary`/`pacing` present. |
| 7 | `authoringFeedbackStem` returns slugified labels (not `"left"`/`"right"`); types widened to `string` throughout | ✓ VERIFIED | `lib/feedbackAudioChoice.ts:25` — return type `string`. `App.tsx:113` — `feedbackAuthoringStem: string`. `hooks/useVoicePlayback.ts:16` — `feedbackAuthoringStem?: string \| null`. `hooks/useVoicePlayback.ts:99-102` — `feedbackVoiceTrigger(cardId: string, authoringStem: string, selectedSlot)`. Non-critical fallbacks use `selectedSlot === "RIGHT"` not `authoringStem === "right"`. |
| 8 | Zero `_left`/`_right` audio files remain; all renamed to label-slug names; E2E test + generation scripts use slugs | ✓ VERIFIED | `ls feedback/ \| grep '_left\.\|_right\.'` — 0 files. Slug files exist (e.g., `feedback_shadow_ai_hos_1_shield-the-team.opus`). `tests/voice-hos-critical-audio.spec.ts` — 18 cards with `leftSlug`/`rightSlug` objects. `scripts/generate-hos-remaining.ts:21-22` — `leftSlug`/`rightSlug` fields. Zero `_left`/`_right` in `generate-hos-*.ts` scripts. |

**Score:** 6/6 must-haves verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `types.ts` | `choiceSidesSwapped?: boolean` on `Card` | ✓ VERIFIED | Line 140 |
| `lib/deck.ts` | `shuffleDeck` sets flag true/false on every card | ✓ VERIFIED | Lines 18-30 |
| `lib/feedbackAudioChoice.ts` | `authoringFeedbackStem(card, slot)` returning label slug + `slugify` export | ✓ VERIFIED | 34 lines, exports `slugify`, `authoringFeedbackStem`, `PresentationChoiceSlot` |
| `lib/deck.test.ts` | Deterministic swap/no-swap coverage | ✓ VERIFIED | Lines 96-138, 3 dedicated tests |
| `unit/feedbackAudioChoice.test.ts` | Table-driven slug expectations | ✓ VERIFIED | 90 lines, 6 stem cases + 3 slugify cases |
| `App.tsx` | `effectiveDeck` currentCard, `feedbackAuthoringStem` + `selectedSlot` in overlay, wiring to `useVoicePlayback` | ✓ VERIFIED | Lines 113, 115, 180-183, 210-211, 347-348 |
| `hooks/useVoicePlayback.ts` | `feedbackAuthoringStem: string \| null`, `feedbackSelectedSlot`, slug-based trigger for HoS, slot-based for non-critical | ✓ VERIFIED | Lines 16, 18, 99-120, 144-145, 188-191 |
| `data/cards/head-of-something.ts` | Single `shadow_ai_hos_1`, no `hos_shadow_ai_team_discovery` | ✓ VERIFIED | Line 95 only |
| `services/geminiLive.ts` | Varied rhythm instructions | ✓ VERIFIED | Lines 284-288 |
| `api/roast.ts` | Varied pacing instruction, no rigid cap | ✓ VERIFIED | Line 45 |
| `unit/roastPromptCopy.test.ts` | Guards prompt literal removal | ✓ VERIFIED | 23 lines, 2 tests |
| `tests/voice-hos-critical-audio.spec.ts` | 18 cards, slug-based verification | ✓ VERIFIED | 215 lines, per-card slug objects |
| `scripts/generate-hos-*.ts` (5 files) | Label-slug filenames | ✓ VERIFIED | Zero `_left`/`_right` references |
| `public/audio/voices/roaster/feedback/` | Label-slug .opus/.mp3 files, zero directional files | ✓ VERIFIED | 82 files, 0 with `_left`/`_right` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `lib/deck.ts` | `types.ts` | `Card.choiceSidesSwapped` | ✓ WIRED | `deck.ts:1` imports `Card`, lines 25/28 set the field |
| `App.tsx` | `lib/feedbackAudioChoice.ts` | `authoringFeedbackStem(card, direction)` | ✓ WIRED | `App.tsx:50` imports, line 210 calls with card + direction |
| `App.tsx` | `hooks/useVoicePlayback.ts` | `feedbackAuthoringStem` + `feedbackSelectedSlot` props | ✓ WIRED | `App.tsx:347-348` passes both; `useVoicePlayback.ts:144-145` consumes |
| `api/roast.ts` | Vercel handler | `generateContent` prompt body | ✓ WIRED | Line 45 contains varied pacing instruction in prompt template |
| `services/geminiLive.ts` | `connectToLiveSession` | `getPersonalityInstruction` systemInstruction | ✓ WIRED | Lines 284-288 contain rhythm instructions in personality map |
| `hooks/useVoicePlayback.ts` | `public/audio/voices/roaster/feedback/` | `feedbackVoiceTrigger` → `feedback_${cardId}_${authoringStem}` | ✓ WIRED | Line 106 builds filename from slug; slug-named files exist on disk |

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FA-01 | 17-01, 17-04, 17-05 | `choiceSidesSwapped` + `authoringFeedbackStem` maps chosen slot → authoring label slug | ✓ SATISFIED | `types.ts:140`, `lib/deck.ts:18-30`, `lib/feedbackAudioChoice.ts`, `unit/feedbackAudioChoice.test.ts` |
| FA-02 | 17-02, 17-04, 17-05 | `effectiveDeck` currentCard; overlay stem → voice playback | ✓ SATISFIED | `App.tsx:180-183,210,347-348`, `hooks/useVoicePlayback.ts:99-106,188-191` |
| FA-03 | 17-03, 17-05 | Single HoS shadow card; critical lists/scripts/tests/assets synced | ✓ SATISFIED | `head-of-something.ts:95`, `useVoicePlayback.ts:76-97`, zero `hos_shadow_ai_team_discovery` refs, `voice-hos-critical-audio.spec.ts` 18 cards, slug-named audio files |
| FA-04 | 17-03 | `geminiLive` + `api/roast` varied cadence | ✓ SATISFIED | `geminiLive.ts:284-288`, `api/roast.ts:45`, `unit/roastPromptCopy.test.ts` |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | — | — | No anti-patterns found. No TODO/FIXME/stub/placeholder comments in phase artifacts. |

### Human Verification Required

### 1. Shuffle-swap feedback audio alignment

**Test:** Play the game as Head of Something. When a card appears where `choiceSidesSwapped` is true, swipe on a choice and listen to the Roaster feedback audio.
**Expected:** The audio clip matches the outcome text shown in the chosen slot (not the opposite arm's text).
**Why human:** Cannot verify audio content programmatically — need to confirm the spoken line matches the displayed outcome label.

### 2. Roast cadence variety

**Test:** Play through several cards with Roaster personality, observe feedback text length and rhythm variation.
**Expected:** Roast lengths vary naturally (not always exactly 1-3 sentences of similar length).
**Why human:** Subjective quality assessment — automated tests verify prompt copy changed but not output quality.

### Gaps Summary

No gaps found. All 6 must-haves verified against codebase. All artifacts exist, are substantive (not stubs), and are wired into the application. All key links confirmed. All 4 requirements (FA-01 through FA-04) satisfied.

**Note:** ROADMAP.md line 622 shows `[ ]` (unchecked) for 17-05-PLAN.md, but STATE.md confirms completion on 2026-03-27. The roadmap checkbox is stale.

---

_Verified: 2026-03-27T00:44:00Z_
_Verifier: Claude (gsd-verifier)_
