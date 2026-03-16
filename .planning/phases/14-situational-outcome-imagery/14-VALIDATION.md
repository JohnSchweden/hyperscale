---
phase: 14
slug: situational-outcome-imagery
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright E2E + React Testing Library |
| **Config file** | `playwright.config.ts` (existing) |
| **Quick run command** | `bun run test:area:gameplay` |
| **Full suite command** | `bunx playwright test` |
| **Estimated runtime** | ~30 seconds (quick), ~120 seconds (full) |

---

## Sampling Rate

- **After every task commit:** Run `bun run typecheck && bun run test:area:gameplay`
- **After every plan wave:** Run `bunx playwright test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | IMAGE-01, IMAGE-05 | e2e | `bunx playwright test tests/incident-images.spec.ts` | ❌ W0 | ⬜ pending |
| 14-02-01 | 02 | 2 | IMAGE-02 | e2e | `bunx playwright test tests/outcome-images.spec.ts` | ❌ W0 | ⬜ pending |
| 14-03-01 | 03 | 3 | IMAGE-03 | e2e | `bunx playwright test tests/collapse-images.spec.ts` | ❌ W0 | ⬜ pending |
| 14-04-01 | 04 | 3 | IMAGE-04 | e2e | `bunx playwright test tests/archetype-images.spec.ts` | ❌ W0 | ⬜ pending |
| 14-05-01 | 05 | 4 | IMAGE-06 | e2e | `bunx playwright test tests/image-performance.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/incident-images.spec.ts` — stubs for IMAGE-01, IMAGE-05
- [ ] `tests/outcome-images.spec.ts` — stubs for IMAGE-02
- [ ] `tests/collapse-images.spec.ts` — stubs for IMAGE-03
- [ ] `tests/archetype-images.spec.ts` — stubs for IMAGE-04
- [ ] `tests/image-performance.spec.ts` — stubs for IMAGE-06

*Wave 0 creates test stubs that will initially fail (RED), then pass as features are implemented (GREEN).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Image fade-in smoothness | IMAGE-01 | Visual animation timing | Open incident card, verify 300ms fade-in looks smooth |
| Glitch placeholder aesthetic | IMAGE-05 | Visual design judgment | Disconnect network, verify placeholder looks intentional not broken |
| Lazy load viewport trigger | IMAGE-06 | Scroll behavior timing | Scroll through many cards, verify images load as they enter viewport |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
