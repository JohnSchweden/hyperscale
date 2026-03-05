# Project State: hyperscale

**Initialized:** 2026-02-07
**Status:** v1.2 In Progress — Kobayashi Maru Transformation
**Milestone:** v1.2 — Kobayashi Maru: AI Governance Simulator

---

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-03)

**Core value delivered:** Players experience smooth, responsive gameplay with consistent visual design across all 8 game stages + voice files and Live API

**v1.2 goal:** Transform SwipeRisk into the Kobayashi Maru for AI governance — a safe sandbox to experience real AI incidents without real consequences

**v1.1 completed:** 10/10 requirements delivered
**v1.0 completed:** All 12 requirements delivered

---

## Current Status

### Overall Progress

**Milestone:** v1.2 — In Progress
**Status:** Phase 01 complete, Phases 03-08 planned (Phase 02 deferred to 08)
**Research:** Skipped (per config)

### Current Position

**Phase:** 01 - Live API STT Research (Complete)
**Next Phase:** 03 - No-Win Scenario Cards
**Plan:** Not started
**Progress:** █░░░░░░░░░░░░░░░░░░░ 14% (1 of 7 phases)

---

## Milestone v1.2 Summary

**Phase 01 - Live API STT Research:** ✓ Complete
- Speech-to-text via Gemini Live API
- useLiveAPISpeechRecognition hook created
- AudioWorklet for PCM conversion
- Integrated into RoastTerminal
- **Gap closure (01-02):** Added debug logging and fixed sample rate handling
- **Gap closure (01-03):** Fixed WebSocket closing - changed config to use Modality.AUDIO
- Debug logs now show audio capture pipeline

**Phase 03 - No-Win Scenario Cards:** Not started (next)
- Both options bad (tradeoffs, not puzzles)
- 6+ new cards across roles

**Phase 04 - Immersive Pressure Effects:** Not started
- Time pressure, escalating stakes
- Visual/audio stress cues
- Haptic feedback

**Phase 05 - Expanded AI Risk Scenarios:** Not started
- Prompt injection, model drift, explainability
- Shadow AI, synthetic data, copyright

**Phase 06 - Debrief & Replay System:** Not started (extended)
- 3-page Reveal Build-Up: Collapse → Audit Trail → Verdict
- Incident Audit Log + personality sign-off
- Archetype + Resilience Score + LinkedIn share
- V2 waitlist email capture

**Phase 07 - Kirk Easter Egg:** Not started
- Hidden path to "change the conditions of the test"

**Phase 08 - Kobayashi Maru Framing (deferred):** Deferred to end of milestone
- Reframe as no-win experimentation sandbox
- "You will fail. That's the point."
- Update intro, onboarding, messaging

---

## Milestone v1.1 Summary

**Phase 1 - Pre-recorded Voice Files:** ✓ Complete
- 13 voice files (WAV) for all 3 personalities
- Triggers: onboarding, feedback (Roaster only), victory, failure
- Voice playback system integrated with game

**Phase 2 - Live API for Roast.exe:** ✓ Complete
- Direct browser Gemini Live API service created
- useLiveAudio React hook created (orphaned - not used)
- Roast.exe integration with streaming and fallback
- TTS fallback working

---

## Phase Structure

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 01 - Live API STT Research | Speech-to-text for microphone input | STT-01, STT-02 | Complete ✓ |
| 03 - No-Win Scenario Cards | Both options bad | NOWIN-01 to NOWIN-04 | Not started |
| 04 - Immersive Pressure Effects | Psychological pressure + immersion | IMMERSE-01 to IMMERSE-05 | Not started |
| 05 - Expanded AI Risk Scenarios | Day-to-day AI risks | RISK-01 to RISK-06 | Not started |
| 06 - Debrief & Replay System | 3-page debrief + archetype + V2 waitlist | DEBRIEF-01 to DEBRIEF-12 | Not started |
| 07 - Kirk Easter Egg | Hidden "cheat" path | KIRK-01 to KIRK-02 | Not started |
| 08 - Kobayashi Maru Framing | Reframe as no-win sandbox | FRAME-01 to FRAME-03 | Deferred |

---

## Accumulated Context

### Roadmap Evolution
- Phase 01 added: Live API STT Research (STT for microphone input)
- Phase 02 added: Kobayashi Maru Framing (deferred → Phase 08)
- Phase 03 added: No-Win Scenario Cards
- Phase 04 added: Immersive Pressure Effects
- Phase 05 added: Expanded AI Risk Scenarios
- Phase 06 added: Debrief & Replay System
- Phase 06 extended: 3-page Reveal Build-Up, archetype, LinkedIn share, V2 waitlist (06-ARCHITECTURE.md)
- Phase 07 added: Kirk Easter Egg

### Design Decisions
- Pre-recorded voice samples (not TTS) for quality
- WAV format (PCM 16-bit, 24kHz, mono) for browser compatibility
- localStorage for settings persistence
- Volume reduced by 40% (0.6) for comfortable listening
- Direct browser connection using GoogleGenAI SDK (no backend proxy)
- AudioWorklet for 24kHz→48kHz sample rate conversion
- roastService.ts with getRoastWithFallback for automatic Live API → TTS fallback
- **Kobayashi Maru framing:** "You will fail. That's the point." — Safe experimentation sandbox

### Technical Debt
- hooks/useLiveAudio.ts not imported anywhere (functionality in roastService.ts)
- hooks/useLiveAPISpeechRecognition.ts now provides STT functionality via Gemini Live API

### Blockers
- None

---

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Delete orphaned hook | 2026-03-03 | 1e2bf0b | [001-delete-orphaned-hook](./quick/001-delete-orphaned-hook/) |
| 002 | Add microphone button for voice input | 2026-03-03 | c226ac1 | [002-add-microphone-button](./quick/002-add-microphone-button/) |
| 003 | Randomize boss answer positions | 2026-03-03 | 9964a3b | [003-in-the-boss-fight-currently-the-right-an](./quick/003-in-the-boss-fight-currently-the-right-an/) |
| 004 | Focused tests without full navigation | 2026-03-03 | 10f9ef6 | [004-focused-tests-without-full-navigation](./quick/004-focused-tests-without-full-navigation/) |

---

## Session Continuity

**Last action:** 2026-03-04 - Deferred Phase 02 to Phase 08

**Next action:** `/gsd-plan-phase 03` — Break down No-Win Scenario Cards

---

*Last updated: 2026-03-04 — Phase 02 deferred to Phase 08*
