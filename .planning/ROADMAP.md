# Roadmap: hyperscale v1.1

**Milestone:** v1.1 — Voice Files for All Personalities
**Goal:** Generate and integrate voice files for all 3 personalities (onboarding, victory, failure + Roaster feedback)

---

## Overview

v1.1 implements voice playback for all three personality types:
- **Roaster**: onboarding, 4 feedback messages, victory, failure (7 files)
- **Zen Master**: onboarding, victory, failure (3 files)  
- **Lovebomber**: onboarding, victory, failure (3 files)

**Scope:**
- All 3 personalities for onboarding, victory, failure
- Roaster only for feedback messages (Development role)
- Other personalities' feedback deferred

**Total voice files:** 13

---

## Phase 1: Voice Files for All Personalities

**Goal:** Generate and integrate voice files for all personalities

**Dependencies:** None

**Requirements:**
- VOICE-01: Generate Roaster (V.E.R.A.) voice files (7 total)
- VOICE-02: Generate Zen Master (Bamboo) voice files (3 total)
- VOICE-03: Generate Lovebomber (Hype-Bro) voice files (3 total)
- VOICE-04: Create voice playback system for pre-recorded audio files
- VOICE-05: Integrate voice playback with game triggers
- VOICE-06: Test Roaster voice playback
- VOICE-07: Test Zen Master and Lovebomber voice playback

**Success Criteria:**
1. Audio files exist for all 7 Roaster messages
2. Audio files exist for all 3 Zen Master messages
3. Audio files exist for all 3 Lovebomber messages
4. Voice playback system plays audio files (not TTS)
5. Game triggers voice at correct points based on selected personality
6. Roaster feedback voices work after card swipes
7. All personalities' onboarding, victory, failure work correctly

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

## Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 - Voice Files | 13 voice files + playback system | VOICE-01 to VOICE-07 | Pending |

---

## Coverage

**Requirements mapped:** 7/7 ✓

| Requirement | Phase |
|-------------|-------|
| VOICE-01 | Phase 1 |
| VOICE-02 | Phase 1 |
| VOICE-03 | Phase 1 |
| VOICE-04 | Phase 1 |
| VOICE-05 | Phase 1 |
| VOICE-06 | Phase 1 |
| VOICE-07 | Phase 1 |

---

## Deferred to v1.2

- Feedback voice messages for Zen Master and Lovebomber
- Feedback messages for other roles (Marketing, Management, HR, Finance, Legal)
- Visual effects
- Background audio

---

*Roadmap created: 2026-02-28*
*Last updated: 2026-02-28 after adding Zen Master and Lovebomber*
