---
status: diagnosed
phase: 15-voice-files-expanded
source:
  - 15-01-SUMMARY.md
  - 15-01.1-SUMMARY.md
  - 15-02-SUMMARY.md
  - 15-03-SUMMARY.md
  - 15-04-SUMMARY.md
  - 15-05-SUMMARY.md
started: 2026-03-24T22:10:00Z
updated: 2026-03-24T22:25:00Z
---

## Current Test

[testing complete - issues found]

## Tests

### 1. Archetype Reveal Voice Audio
expected: Debrief page 3 plays archetype voice audio with radio effects once per visit. All 3 personalities have distinct voices.
result: [pending user confirmation]

### 2. Death Ending Voice Audio
expected: Death screen plays voice narration matching death type (bankrupt, congress, prison, etc.) with radio effects. KIRK death has glitch effects layered with voice.
result: [pending user confirmation]

### 3. Head of Something Critical Card Feedback
expected: When playing as Head of Something and selecting critical cards (Tier 1-3), Roaster provides voice feedback on your choice (LEFT or RIGHT) with radio effects.
result: [pending user confirmation]

### 4. Voice File Organization
expected: Voice files are organized in subfolders by content type (archetype/, death/, feedback/, core/). No broken audio references.
result: pass
verified: Files organized in subfolders (archetype/, death/, feedback/, core/) as expected

### 5. Audio Compression (Opus/MP3)
expected: Modern browsers receive Opus format audio (~4MB total), older browsers get MP3 fallback (~8MB). 81% bandwidth savings for most users. Console shows format being loaded.
result: pass
verified: Opus and MP3 files exist, voicePlayback.ts uses getAudioExtension() for format selection

### 6. Music Opus Support
expected: Background music plays in Opus format on supported browsers (Chrome, Firefox, Edge, Safari 15+). Check Network tab shows .opus files for music tracks.
result: pass
verified: Music files converted to Opus (Chromed Rainfall Cover.opus, Quiet Apogee - AI Music.opus)

### 7. Voice Playback Deduplication
expected: Audio only plays once even if component re-renders. Navigating away and back resets the "played" flag so audio can play again.
result: [pending user confirmation]

### 8. Cold Start Smoke Test
expected: Kill any running dev server, clear caches, start fresh with `bun run dev`. Game loads, personality selection works, and voice audio plays without errors on first attempt.
result: pass
verified: Game loaded successfully, played through to completion

### 9. Head of Something Complete Audio Coverage (CRITICAL ISSUE)
expected: ALL Head of Something cards play dedicated voice feedback (not generic). 19 HoS cards should each have LEFT and RIGHT audio files.
result: issue
reported: "Only 8 out of 19 HoS cards have audio. The other 11 fall back to generic 'Wisdom...' message. I played 7 cards and none had dedicated audio - statistically impossible if coverage was complete."
severity: blocker
verified_via: |
  Code analysis confirmed:
  - CRITICAL_HOS_CARDS set has only 8 cards mapped
  - head-of-something.ts has 19 total cards
  - Only 16 audio files exist (8 cards × 2 choices)
  - Missing: 22 audio files (11 cards × 2 choices)

## Summary

total: 9
passed: 4
issues: 1
pending: 4
skipped: 0

## Gaps

- truth: "All 19 Head of Something cards have dedicated voice feedback audio"
  status: failed
  reason: "CRITICAL_HOS_CARDS only maps 8 cards but Head of Something role has 19 total cards. 11 cards have no audio files and fall back to generic feedback_ignore.wav."
  severity: blocker
  test: 9
  root_cause: |
    Phase 15-03 created audio for only 8 "critical" HoS cards (Tier 1-3) but there are 19 total HoS cards.
    The CRITICAL_HOS_CARDS set in useVoicePlayback.ts only contains 8 card IDs:
    - hos_managing_up_down ✓
    - hos_copyright_team_blame ✓
    - hos_team_burnout_deadline ✓
    - hos_explainability_politics ✓
    - hos_model_drift_team_blame ✓
    - hos_prompt_injection_review_escape ✓
    - explainability_hos_2 ✓
    - shadow_ai_hos_2 ✓
    
    Missing audio for 11 HoS cards:
    - hos_prompt_injection_blame
    - hos_model_drift_budget_conflict
    - hos_shadow_ai_team_discovery
    - hos_delegation_gone_wrong
    - hos_promotion_politics
    - hos_prompt_injection_copilot_team
    - hos_model_drift_retrain_delay
    - explainability_hos_1
    - shadow_ai_hos_1
    - synthetic_data_hos_1
    - synthetic_data_hos_2
    
    When any of these 11 cards are played, feedbackVoiceTrigger() returns 'feedback_ignore'
    which plays the generic 'Wisdom? In this building? I must be malfunctioning.' audio.
  artifacts:
    - path: hooks/useVoicePlayback.ts
      issue: CRITICAL_HOS_CARDS set only contains 8 card IDs, missing 11 HoS cards
    - path: data/cards/head-of-something.ts
      issue: 19 cards defined but only 8 have audio mappings
    - path: public/audio/voices/roaster/feedback/
      issue: Only 16 HoS audio files exist (8 cards × 2 choices), missing 22 files (11 cards × 2)
  missing:
    - "Audio files for 11 HoS cards (22 files: LEFT and RIGHT for each)"
    - "Add remaining 11 card IDs to CRITICAL_HOS_CARDS or create new HEAD_OF_SOMETHING_CARDS set"
    - "Update feedbackVoiceTrigger() to map all 19 HoS cards to their audio files"
    - "Scripts to generate missing audio files with Roaster personality"
  debug_session: ""
  proposed_solution: |
    Generate audio for remaining 11 HoS cards:
    1. Create scripts/generate-hos-remaining.ts for the 11 missing cards
    2. Generate 22 audio files (11 cards × LEFT/RIGHT choices)
    3. Add all 19 HoS card IDs to feedbackVoiceTrigger() mapping
    4. Update CRITICAL_HOS_CARDS to include all HoS cards OR rename to HEAD_OF_SOMETHING_CARDS
    
    Estimated work: 1 plan, 2-3 tasks, ~15 minutes
