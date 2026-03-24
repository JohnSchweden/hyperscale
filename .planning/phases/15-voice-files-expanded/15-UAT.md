---
status: testing
phase: 15-voice-files-expanded
source:
  - 15-01-SUMMARY.md
  - 15-01.1-SUMMARY.md
  - 15-02-SUMMARY.md
  - 15-03-SUMMARY.md
  - 15-04-SUMMARY.md
  - 15-05-SUMMARY.md
started: 2026-03-24T22:10:00Z
updated: 2026-03-24T22:10:00Z
---

## Current Test

number: 1
name: Archetype Reveal Voice Audio
expected: |
  After completing a game, on the debrief page 3 (Verdict), you hear your archetype 
  announced with voice audio and radio effects. The audio plays once per visit and 
  should match the archetype shown (e.g., "Shadow Architect", "Pragmatist", etc.).
  
  Test with all 3 personalities: Roaster (sharp/witty), ZenMaster (calm/measured), 
  Lovebomber (enthusiastic/supportive).
awaiting: user response

## Tests

### 1. Archetype Reveal Voice Audio
expected: Debrief page 3 plays archetype voice audio with radio effects once per visit. All 3 personalities have distinct voices.
result: [pending]

### 2. Death Ending Voice Audio
expected: Death screen plays voice narration matching death type (bankrupt, congress, prison, etc.) with radio effects. KIRK death has glitch effects layered with voice.
result: [pending]

### 3. Head of Something Critical Card Feedback
expected: When playing as Head of Something and selecting critical cards (Tier 1-3), Roaster provides voice feedback on your choice (LEFT or RIGHT) with radio effects.
result: [pending]

### 4. Voice File Organization
expected: Voice files are organized in subfolders by content type (archetype/, death/, feedback/, core/). No broken audio references.
result: [pending]

### 5. Audio Compression (Opus/MP3)
expected: Modern browsers receive Opus format audio (~4MB total), older browsers get MP3 fallback (~8MB). 81% bandwidth savings for most users. Console shows format being loaded.
result: [pending]

### 6. Music Opus Support
expected: Background music plays in Opus format on supported browsers (Chrome, Firefox, Edge, Safari 15+). Check Network tab shows .opus files for music tracks.
result: [pending]

### 7. Voice Playback Deduplication
expected: Audio only plays once even if component re-renders. Navigating away and back resets the "played" flag so audio can play again.
result: [pending]

### 8. Cold Start Smoke Test
expected: Kill any running dev server, clear caches, start fresh with `bun run dev`. Game loads, personality selection works, and voice audio plays without errors on first attempt.
result: [pending]

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0

## Gaps

[none yet]
