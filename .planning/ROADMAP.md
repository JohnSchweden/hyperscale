# Roadmap: hyperscale v1.1

**Milestone:** v1.1 — Voice Files + Live API
**Goal:** Generate 13 voice files for all 3 personalities + explore Gemini Live API for real-time streaming in Roast.exe

---

## Overview

v1.1 implements two voice-related features:

**Phase 1: Pre-recorded Voice Files** ✓ Complete
- **Roaster**: onboarding, 4 feedback messages, victory, failure (7 files)
- **Zen Master**: onboarding, victory, failure (3 files)  
- **Lovebomber**: onboarding, victory, failure (3 files)

**Phase 2: Live API for Roast.exe** Pending
- Research Gemini Live API for real-time streaming
- Implement streaming audio for Roast.exe workflow
- Faster time-to-first-audio by streaming chunks as generated

**Scope:**
- All 3 personalities for onboarding, victory, failure
- Roaster only for feedback messages (Development role)
- Other personalities' feedback deferred

**Total voice files:** 13

---

## Phase 1: Voice Files for All Personalities

**Goal:** Generate and integrate voice files for all personalities

**Dependencies:** None

**Plans:** 6 plans in 6 waves (incremental auto-testing)

**Plan list:**
- [x] 01-01-PLAN.md — Generate 1 voice file (test pipeline) + AUTO-TEST
- [x] 01-02-PLAN.md — Generate 3 Roaster files + AUTO-TEST each
- [x] 01-03-PLAN.md — Generate remaining 10 files + AUTO-TEST
- [x] 01-04-PLAN.md — Create voice playback system (TDD)
- [x] 01-05-PLAN.md — Integrate with game triggers
- [x] 01-06-PLAN.md — Final human verification

**Requirements:**
- VOICE-01: Generate Roaster (V.E.R.A.) voice files (7 total) ✓
- VOICE-02: Generate Zen Master (Bamboo) voice files (3 total) ✓
- VOICE-03: Generate Lovebomber (Hype-Bro) voice files (3 total) ✓
- VOICE-04: Create voice playback system for pre-recorded audio files ✓
- VOICE-05: Integrate voice playback with game triggers ✓
- VOICE-06: Test Roaster voice playback ✓
- VOICE-07: Test Zen Master and Lovebomber voice playback ✓

**Status:** Complete ✓

**Success Criteria:**
1. Audio files exist for all 7 Roaster messages ✓
2. Audio files exist for all 3 Zen Master messages ✓
3. Audio files exist for all 3 Lovebomber messages ✓
4. Voice playback system plays audio files (not TTS) ✓
5. Game triggers voice at correct points based on selected personality ✓
6. Roaster feedback voices work after card swipes ✓
7. All personalities' onboarding, victory, failure work correctly ✓

---

## Voice Messages Inventory

### Roaster (V.E.R.A.) - 7 files
| Trigger | Text |
|---------|------|
| Onboarding | "Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?" |
| Feedback: Paste | "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'." |
| Feedback: Debug | "Slow. Boring. But legal. I suppose I can't fire you for this." |
| Feedback: Install | "You just installed a keylogger for a 3ms speed boost. I hope you're happy." |
| Feedback: Ignore | "Wisdom? In this building? I must be malfunctioning." |
| Victory | "I... don't hate it. Adequate performance. Here's a badge. Now leave." |
| Failure | "Well, you managed to violate basic common sense. The legal team is crying. Pathetic." |

### Zen Master (Bamboo) - 3 files
| Trigger | Text |
|---------|------|
| Onboarding | "Namaste, corporate warrior. The data flows like a river. Let us align our chakras and our privacy policies." |
| Victory | "Balance is achieved. The spreadsheets are at peace. You are one with compliance." |
| Failure | "Breathe in... and breathe out the lawsuits. Your karma is now a major liability." |

### Lovebomber (Hype-Bro) - 3 files
| Trigger | Text |
|---------|------|
| Onboarding | "OMG HI!! We are literally going to change the world! You look SO compliant today! Let's crush it!" |
| Victory | "YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!" |
| Failure | "Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!" |

---

## Phase 2: Live API for Roast.exe (Real-Time Streaming)

**Goal:** Implement Gemini Live API for real-time streaming audio in Roast.exe workflow

**Dependencies:** Phase 1 complete

**Plans:** 4 plans in 4 waves

**Plan list:**
- [ ] 02-01-PLAN.md — Backend proxy + AudioWorklet foundation
- [ ] 02-02-PLAN.md — Live audio hook
- [ ] 02-03-PLAN.md — Roast.exe integration + fallback
- [ ] 02-04-PLAN.md — Latency testing

**Requirements:**
- VOICE-08: Research Gemini Live API integration
- VOICE-09: Implement streaming audio for Roast.exe
- VOICE-10: Test real-time audio latency

**Success Criteria:**
1. Research completed on Gemini Live API vs current implementation
2. Streaming audio implemented for Roast.exe workflow
3. First token audio plays faster than current approach
4. Fallback to current TTS if Live API unavailable

**Status:** Pending

---

## Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 - Voice Files | 13 voice files + playback system | VOICE-01 to VOICE-07 | Complete ✓ |
| 2 - Live API | Real-time streaming for Roast.exe | VOICE-08 to VOICE-10 | Pending |

---

## Coverage

**Requirements mapped:** 10/10 ✓

| Requirement | Phase |
|-------------|-------|
| VOICE-01 | Phase 1 ✓ |
| VOICE-02 | Phase 1 ✓ |
| VOICE-03 | Phase 1 ✓ |
| VOICE-04 | Phase 1 ✓ |
| VOICE-05 | Phase 1 ✓ |
| VOICE-06 | Phase 1 ✓ |
| VOICE-07 | Phase 1 ✓ |
| VOICE-08 | Phase 2 |
| VOICE-09 | Phase 2 |
| VOICE-10 | Phase 2 |

---

## Deferred to v1.2

- Feedback voice messages for Zen Master and Lovebomber
- Feedback messages for other roles (Marketing, Management, HR, Finance, Legal)
- Visual effects
- Background audio

---

*Roadmap created: 2026-02-28*
*Last updated: 2026-03-01 — Phase 1 complete*