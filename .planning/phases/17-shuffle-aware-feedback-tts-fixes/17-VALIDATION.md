---
phase: 17
slug: shuffle-aware-feedback-tts-fixes
status: draft
nyquist_compliant: true
wave_0_complete: true
created: "2026-03-25"
---

# Phase 17 — Validation Strategy

> Validation contract for shuffle-aware TTS, deck sync, content, and roast prompts.

## Test infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit), Playwright (E2E) |
| **Config** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run** | `bun run test:smoke` |
| **Full suite** | `bun run test` |
| **Targeted audio** | `bun run test:area:audio` |
| **Estimated runtime** | Smoke ~15s; full suite minutes |

## Sampling rate

- After each plan wave: `bun run test:smoke` minimum
- Before phase verify: `bun run test:smoke && bun run test:area:audio`
- After content/audio file deletes: `bun run test:area:audio` + voice file existence tests

## Per-task verification map

| Task ID | Plan | Wave | Requirement | Test type | Command | Status |
|---------|------|------|---------------|-----------|---------|--------|
| 17-01 T1 | 01 | 1 | FA-01 | unit | `bun run vitest:run -- lib/deck.test.ts` | pending |
| 17-01 T2 | 01 | 1 | FA-01 | unit | `bun run vitest:run -- unit/feedbackAudioChoice.test.ts` | pending |
| 17-02 T1 | 02 | 2 | FA-02 | types | `bun run typecheck` | pending |
| 17-02 T2 | 02 | 2 | FA-02 | smoke+audio | `test:smoke` + `test:area:audio` | pending |
| 17-02 T3 | 02 | 2 | FA-02 | unit | `bun run vitest:run -- unit/feedbackOverlay.spec.tsx` | pending |
| 17-03 T1 | 03 | 3 | FA-03 | data | `bun run test:data` | pending |
| 17-03 T2 | 03 | 3 | FA-03 | audio | `bun run test:area:audio` | pending |
| 17-03 T3 | 03 | 3 | FA-04 | unit | `bun run vitest:run -- unit/roastPromptCopy.test.ts` | pending |
| 17-04 T1 | 04 | 3 | FA-01 | unit | `bun run test:unit -- unit/feedbackAudioChoice.test.ts` | pending |
| 17-04 T2 | 04 | 3 | FA-02 | types | `bun run typecheck` | pending |
| 17-05 T1 | 05 | 4 | FA-01 | file-check | `ls public/audio/voices/roaster/feedback/ \| grep -E '_left\\.\|_right\\.' \| wc -l` (expect 0) | pending |
| 17-05 T2 | 05 | 4 | FA-03 | audio | `bun run test:area:audio` | pending |

## Wave 0

Existing infrastructure covers requirements — no new framework install.

## Manual-only verifications

| Behavior | Why manual | Steps |
|----------|------------|-------|
| Roast cadence variety | Subjective copy quality | Generate 5 roasts; confirm not identical rhythm |

## Validation sign-off

- [x] All tasks have automated verify or noted manual row
- [x] Sampling: smoke between waves
- [ ] `nyquist_compliant: true` after execution green

**Approval:** pending execution
