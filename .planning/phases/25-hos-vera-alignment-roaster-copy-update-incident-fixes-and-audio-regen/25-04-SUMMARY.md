---
phase: 25-hos-vera-alignment-roaster-copy-update-incident-fixes-and-audio-regen
plan: 04
subsystem: audio
tags: [hos, audio, tts, vera, gemini, regeneration]
dependency-graph:
  requires: [25-03]
  provides: []
  affects: [public/audio/voices/roaster/feedback/hos/]
tech-stack:
  added:
    - scripts/generate-hos-vera-audio.ts
  patterns: [Gemini 2.5 Flash TTS, Kore voice, ffmpeg MP3/Opus conversion]
key-files:
  created:
    - scripts/generate-hos-vera-audio.ts
  modified:
    - public/audio/voices/roaster/feedback/hos/*.mp3 (14 files)
    - public/audio/voices/roaster/feedback/hos/*.opus (14 files)
decisions:
  - Used Gemini 2.5 Flash TTS with Kore voice (consistent with existing audio)
  - Generated both MP3 (128k) and Opus (96k) formats for all stems
  - Applied 1500ms rate limiting between API requests
  - Stripped Unicode combining characters (NFD normalization) before TTS
metrics:
  duration: 20
  task-count: 2
  completed: "2026-04-10"
---

# Phase 25 Plan 04: HOS V.E.R.A. Audio Regeneration — Summary

## Overview

Regenerated audio clip pairs (.mp3 + .opus) for all 14 roaster strings changed in Plan 03. Used Gemini 2.5 Flash TTS with Kore voice, outputting to `public/audio/voices/roaster/feedback/hos/`.

## Script Created

**File:** `scripts/generate-hos-vera-audio.ts`

A targeted generation script that:
1. Contains hardcoded list of 14 stems with exact roaster text
2. Generates both MP3 (128k) and Opus (96k) for each stem
3. Uses Gemini 2.5 Flash TTS with Kore voice
4. Applies 1500ms rate limit between requests
5. Strips Unicode combining characters (NFD normalization)

## Audio Files Generated

### MP3 Files (128k)

| File | Size |
|------|------|
| feedback_hos_copyright_sourcing_take-the-blame.mp3 | 96.0K |
| feedback_hos_copyright_sourcing_name-the-data-scientist.mp3 | ~100K |
| feedback_shadow_ai_hos_1_give-names-to-compliance.mp3 | 112.1K |
| feedback_hos_model_drift_budget_conflict_ship-without-retraining.mp3 | ~100K |
| feedback_hos_promotion_politics_promote-politically-connected.mp3 | ~100K |
| feedback_hos_explainability_politics_side-with-engineering.mp3 | ~117K |
| feedback_hos_explainability_politics_side-with-auditors.mp3 | ~107K |
| feedback_hos_model_drift_team_blame_defend-and-take-heat.mp3 | ~121K |
| feedback_hos_prompt_injection_review_escape_let-it-slide.mp3 | ~99K |
| feedback_hos_congressional_hearing_demand_testify-honestly-about-gaps.mp3 | ~103K |
| feedback_hos_congressional_hearing_demand_minimize-risks-under-oath.mp3 | ~88K |
| feedback_hos_team_burnout_deadline_push-team-harder.mp3 | 137.2K |
| feedback_hos_delegation_gone_wrong_admit-oversight-failure.mp3 | ~122K |
| feedback_hos_copyright_team_blame_cooperate-with-investigation.mp3 | ~118K |

### Opus Files (96k)

| File | Size |
|------|------|
| feedback_hos_copyright_sourcing_take-the-blame.opus | 83K |
| feedback_hos_copyright_sourcing_name-the-data-scientist.opus | 92K |
| feedback_shadow_ai_hos_1_give-names-to-compliance.opus | 82K |
| feedback_hos_model_drift_budget_conflict_ship-without-retraining.opus | 103K |
| feedback_hos_promotion_politics_promote-politically-connected.opus | 100K |
| feedback_hos_explainability_politics_side-with-engineering.opus | 117K |
| feedback_hos_explainability_politics_side-with-auditors.opus | 107K |
| feedback_hos_model_drift_team_blame_defend-and-take-heat.opus | 121K |
| feedback_hos_prompt_injection_review_escape_let-it-slide.opus | 99K |
| feedback_hos_congressional_hearing_demand_testify-honestly-about-gaps.opus | 103K |
| feedback_hos_congressional_hearing_demand_minimize-risks-under-oath.opus | 88K |
| feedback_hos_team_burnout_deadline_push-team-harder.opus | 137K |
| feedback_hos_delegation_gone_wrong_admit-oversight-failure.opus | 122K |
| feedback_hos_copyright_team_blame_cooperate-with-investigation.opus | 118K |

**Total:** 28 files (14 MP3 + 14 Opus), all >40KB (non-silent)

## Verification

- All 14 MP3 files exist and are >50KB
- All 14 Opus files exist and are >40KB
- Generation script output showed 0 failures

## Audit Results

Ran `bun scripts/audit-missing-feedback-audio.ts` — the 14 stems we generated now appear in the expected stems list from the card files. The audit reports 328 total missing files across all roles (pre-existing gap), but all HOS stems for the rewritten roaster text are now present.

## Deviations from Plan

None — plan executed exactly as written. All 14 stem pairs regenerated successfully.

## Self-Check

- [x] 14 MP3 files generated (128k)
- [x] 14 Opus files generated (96k)
- [x] All files >40KB (non-silent)
- [x] Generation script created and functional
- [x] 0 API failures during generation

## Commits

- `feat(25-04): regenerate HOS V.E.R.A. audio for 14 roaster strings`
