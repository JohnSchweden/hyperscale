---
phase: 21
slug: refactor-the-glassmorphism-design
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + playwright |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `bun run typecheck` |
| **Full suite command** | `bun run test:smoke` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run typecheck`
- **After every plan wave:** Run `bun run test:smoke`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | GLASS-01 | typecheck | `bun run typecheck` | ✅ | ⬜ pending |
| 21-01-02 | 01 | 1 | GLASS-02 | typecheck | `bun run typecheck` | ✅ | ⬜ pending |
| 21-01-03 | 01 | 1 | GLASS-03 | smoke + manual | `bun run test:smoke` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing infrastructure covers all phase requirements (typecheck + smoke tests)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Starfield visible through glass surfaces | GLASS-03 | Visual verification requires human eye | Open app on desktop Safari + mobile Safari, verify starfield bleeds through CardStack, FeedbackOverlay, Taskbar, and all glass panels |
| Glass blur renders correctly | GLASS-03 | Backdrop-filter rendering varies by browser | Confirm blur effect visible, text remains readable, no artifacts |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<verify>` with automated command or manual instructions
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
