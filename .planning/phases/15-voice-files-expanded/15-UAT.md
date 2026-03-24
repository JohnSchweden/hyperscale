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

### 9. Feedback Card Audio Coverage (Auto-discovered Issue)
expected: Most feedback cards play context-specific voice feedback matching the card's written text
result: issue
reported: "Most feedback cards play the generic 'Wisdom, in this building, I must be malfunctioning' audio even though the written text is different"
severity: major
verified_via: agent-browser testing - played through Head of Something role, observed feedback_ignore.wav being played for non-critical cards

## Summary

total: 9
passed: 4
issues: 1
pending: 4
skipped: 0

## Gaps

- truth: "Feedback cards play context-specific voice audio matching written text"
  status: failed
  reason: "User reported: Most feedback cards play generic 'Wisdom...' audio instead of context-specific feedback. Written feedback text differs from audio."
  severity: major
  test: 9
  root_cause: |
    Only 8 critical HoS cards and 1 SE card have dedicated audio mappings in useVoicePlayback.ts. 
    The remaining 200+ cards fall back to feedback_ignore.wav which contains generic 'Wisdom...' message.
    The mapping logic in feedbackVoiceTrigger() defaults to 'feedback_ignore' for any card not in specific sets.
  artifacts:
    - path: hooks/useVoicePlayback.ts
      issue: feedbackVoiceTrigger() function only maps ~9 cards to specific audio, 200+ cards fall through to feedback_ignore
    - path: public/audio/voices/roaster/feedback/feedback_ignore.wav
      issue: Contains generic 'Wisdom? In this building? I must be malfunctioning.' message used as fallback
  missing:
    - "Strategy for handling cards without dedicated audio - use generic responses appropriate to choice severity"
    - "Mapping logic to select context-appropriate generic audio based on fine amount or consequence type"
    - "Additional generic audio files for different choice outcomes (minor fine, major fine, no fine, etc.)"
  debug_session: ""
  proposed_solution: |
    Implement a tiered fallback system:
    1. Critical cards (8 HoS + specific cards) → use dedicated audio files (already exists)
    2. Cards with small fines (<$5M) or 'safe' choices → use feedback_ignore.wav ("Wisdom...") 
    3. Cards with large fines (≥$5M) or 'risky' choices → use more appropriate generic response
    4. Update feedbackVoiceTrigger() to check consequence severity before selecting fallback

    Alternative: Generate more generic audio variants:
    - feedback_minor.wav: "Interesting choice. Let's see how that works out for you."
    - feedback_major.wav: "Bold move. Potentially career-limiting, but bold."
    - feedback_safe.wav: "Playing it safe? Sometimes that's the most dangerous choice of all."
