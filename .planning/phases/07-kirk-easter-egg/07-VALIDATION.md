---
phase: 07
slug: kirk-easter-egg
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 07 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (E2E) + Vitest (unit) |
| **Config file** | `playwright.config.ts` / `vitest.config.ts` |
| **Quick run command** | `bun run test:smoke` |
| **Full suite command** | `bun run test` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run test:smoke`
- **After every plan wave:** Run `bun run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | KIRK-01 | unit | `bun run test:unit -- --run kirkRefusal` | No - W0 | pending |
| 07-01-02 | 01 | 1 | KIRK-01 | unit | `bun run test:unit -- --run useSwipeGestures` | Partial | pending |
| 07-02-01 | 02 | 1 | KIRK-01 | E2E | `bun run test -- tests/kirk-easter-egg.spec.ts` | No - W0 | pending |
| 07-03-01 | 03 | 2 | KIRK-02 | E2E | `bun run test -- tests/kirk-debrief.spec.ts` | No - W0 | pending |
| 07-03-02 | 03 | 2 | KIRK-02 | unit | `bun run test:unit -- --run archetype` | Partial | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `unit/kirkRefusal.test.ts` — stubs for KIRK-01 (gameReducer KIRK_REFUSAL action, kirkCounter logic)
- [ ] `tests/kirk-easter-egg.spec.ts` — E2E stubs for KIRK-01c (swipe-up triggers glitch, 2nd triggers corruption)
- [ ] `tests/kirk-debrief.spec.ts` — E2E stubs for KIRK-02a (Kirk debrief pages render corrupted content)
- [ ] Add Kirk cases to `unit/archetype.test.ts` — KIRK-02b
- [ ] Add Kirk cases to `unit/unlocked-endings.test.ts` — KIRK-02c (Kirk NOT in unlockedEndings)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Glitch visual quality (flicker, corruption) | KIRK-01 | Visual aesthetics require human judgment | Play through Kirk path, verify Level 1 flicker is subtle, Level 2 corruption is intense |
| Audio crash/buzz quality | KIRK-01 | Audio quality requires human judgment | Listen to both Kirk audio cues, verify Level 1 is subtle, Level 2 sounds like digital crash |
| prefers-reduced-motion behavior | KIRK-01 | Accessibility setting testing | Enable reduced motion in OS, play Kirk path, verify no rapid flicker/animation |
| Corrupted debrief visual coherence | KIRK-02 | Visual corruption readability | Play through Kirk debrief, verify text is corrupted but still readable enough |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
