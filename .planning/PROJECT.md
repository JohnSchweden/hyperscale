# hyperscale

## What This Is

hyperscale is a "Tinder for AI Risk, Governance & Compliance" - a gamified web application where players make quick decisions on AI governance scenarios by swiping left or right on incident cards. Players take on roles (Finance, Marketing, Management) with different AI assistants, managing budget, heat, and hype metrics while navigating through a series of increasingly complex AI risk scenarios.

The game runs entirely in the browser, supporting both desktop (mouse/keyboard) and mobile (touch) gameplay.

## Core Value

Players experience smooth, responsive gameplay with consistent visual design across all 8 game stages.

## Requirements

### Validated

- ✓ Voice files for all 3 personalities — v1.1 (Roaster 7 files, Zen Master 3, Lovebomber 3)
- ✓ Voice playback system — v1.1 (WAV playback, game triggers)
- ✓ Gemini Live API for Roast.exe — v1.1 (streaming audio with TTS fallback)

### Active

- [ ] Visual effects (particles, screen shake, confetti, transitions)
- [ ] Use case and outcome images (memorable, relatable, and humerous)
- [ ] Background audio (ambient, stage music, transitions)
- [ ] Settings integration (sound/voice/music toggles, volume)
- [ ] Feedback messages for Zen Master and Lovebomber

### Out of Scope

| Feature | Reason |
|---------|--------|
| Feedback messages for other roles | Deferred - focus on core gameplay first |
| Mobile native app | Web-first approach sufficient |

## Context

**Shipped:** v1.1 with voice files and Live API (2026-03-03)
**Tech stack:** React, TypeScript, Vite, Playwright
**Tests:** 76 passing

## Key Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Pre-recorded voice samples (not TTS) | Quality - human voices more engaging | ✓ Good |
| WAV format (PCM 16-bit, 24kHz) | Browser compatibility | ✓ Good |
| Direct browser Live API connection | No backend proxy needed | ✓ Good |
| TTS fallback for Live API failures | Reliability - always works | ⚠️ Revisit (orphaned hook) |

## Current Milestone

**Next:** v1.2 — Visual Effects + Background Audio + Settings

**Goal:** Add polish with visual effects, background audio, and settings controls

---

*Last updated: 2026-03-03 after v1.1 milestone complete*
