---
phase: 01-live-api-stt-research
plan: 03
subsystem: stt
tags:
  - Gemini Live API
  - WebSocket
  - Speech-to-text
  - Modality.AUDIO
  - AudioWorklet
requires: []
provides:
  - Fixed Live API session config for STT-only mode
affects: []
tech-stack:
  added: []
  patterns:
    - Gemini Live API with audio modality for STT
key-files:
  created: []
  modified:
    - hooks/useLiveAPISpeechRecognition.ts
key-decisions: []
---

# Phase 01 Plan 03: Fix WebSocket Closing Gap Summary

**Gap closure:** Fix WebSocket closing issue by matching working voice config pattern

## Success Criteria

- [x] Config changed to use Modality.AUDIO instead of Modality.TEXT
- [x] Added outputAudioTranscription: {} to config
- [x] Added speechConfig with voiceConfig to config  
- [x] Simplified system instruction
- [x] Build passes

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix Live API session config for STT-only mode | c7d7edc | hooks/useLiveAPISpeechRecognition.ts |

## What Was Done

Fixed the WebSocket closing issue in the Live API STT hook by correcting the session configuration:

1. **Changed responseModalities** from `TEXT` to `AUDIO` - TEXT was causing the session to immediately complete turns, killing the connection

2. **Added outputAudioTranscription: {}** - Required for audio modality mode

3. **Added speechConfig with voiceConfig** - Required for audio modality, included prebuilt voice 'Aoede'

4. **Simplified system instruction** - Changed from "Transcribe user speech only. No response needed." to "You are a speech transcription service. Only transcribe user audio. Do not generate any response." - removes confusing "No response needed" which was confusing the model

The config now matches the working pattern from geminiLive.ts (lines 127-138).

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- Build passes: ✓
- Code changes match success criteria: ✓

## Next Step

Ready for testing in browser to verify WebSocket stays open during recording and real-time transcription works.

---

## Metrics

**Duration:** Less than 1 minute
**Started:** 2026-03-04
**Completed:** 2026-03-04
**Tasks completed:** 1/1
**Files modified:** 1
