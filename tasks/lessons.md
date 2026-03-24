# Lessons

Patterns to prevent repeat mistakes. Update after corrections from the user.

**Capture process:**
1. Add learnings here after sessions
2. Use format: `- [RULE] — Why this matters`
3. At end of session, promote broad patterns to `memory/*.md`
4. Update `MEMORY.md` index

## Workflow & Process

<!-- Format example:
- [RULE] — Why this prevents mistakes/saves time
  - Context: When did this come up?
  - Fix: What to do differently next time
  - Example: Concrete example
-->

## Code & Architecture

<!-- Patterns about implementation, design decisions, common bugs -->
- [RULE] When condensing AGENTS.md sections, never remove operational details (flags, workarounds, error-prevention notes) — move them to the appropriate section rather than dropping them. These notes exist because something broke without them.

## Testing & Verification

- **[CRITICAL] Use `--ignore-https-errors` flag with agent-browser for self-signed SSL** — Required when dev server uses HTTPS with basicSsl()
  - Context: 2026-03-17 - HTTPS dev server failed certificate validation repeatedly during UAT verification
  - Solution: `agent-browser --ignore-https-errors open https://localhost:3000`
  - Important: Must close existing daemon first: `agent-browser close` then reopen with flag
  - Why this matters: Audio transcription requires HTTPS (browser security), so SSL cannot be removed
  - Full command sequence:
    1. `agent-browser close` (if daemon running)
    2. `agent-browser --ignore-https-errors open https://localhost:3000`
    3. Continue with normal agent-browser commands

## Project-Specific

<!-- Quirks of this codebase, team conventions, integration points -->

<!-- Captured 2026-03-17 via post-commit analysis -->
- [RULE] In financial audit/disclosure UIs, always show monetary amounts including $0 — omitting zero values obscures actual financial impact and violates transparency

<!-- Captured 2026-03-17 via post-commit analysis -->
- [RULE] UAT evidence must cite observed user-facing behavior from testing, not code file references or implementation details — Code existing doesn't prove it works; only browser verification confirms actual behavior matches expected results

<!-- Captured 2026-03-17 via post-commit analysis -->
- [RULE] When multiple test runners share a tests/ directory, use explicit `testIgnore` patterns to prevent cross-runner test discovery — Playwright will pick up files meant for Vitest unless explicitly excluded, wasting time and risking false failures

<!-- Captured 2026-03-17 via post-commit analysis -->
- [RULE] — Card swipe tests need `{ force: true }` on clicks and 500ms+ timeouts to account for CSS animation completion time. Card animations make elements briefly unclickable and transitions need full duration to complete; shorter timeouts and actionability checks cause flakiness.

<!-- Captured 2026-03-17 via post-commit analysis -->
- [RULE] — Never use `.click({ force: true })` in tests; it bypasses visibility/interactivity checks and masks real bugs. Use `.dispatchEvent("click")` or regular `.click()` to ensure tests validate actual user-interaction behavior.
- [RULE] — Drag gesture distance is signed (negative = left, positive = right). When creating drag helpers, verify the sign matches the intended direction; wrong sign won't error but the gesture fails silently.
- [RULE] — Fast-path navigations must not skip critical state transitions (INITIALIZING, shuffling, etc.) even for speed. Verify all necessary state machine steps still run; shortcuts can hide logic bugs that only surface in full flow.

<!-- Captured 2026-03-22 via post-commit analysis -->
- [RULE] In Playwright tests, wait for the specific element directly with `.waitFor({ state: "visible" })` instead of using `page.waitForSelector()` for a generic selector, then asserting the specific element is visible separately — The generic wait may resolve for the wrong element, causing race conditions or masking failures. Targeting the specific element upfront ensures the test waits for the right thing.

<!-- Captured 2026-03-23 via post-commit analysis -->
- [RULE] WebMCP tools with zero parameters still require `inputSchema: { type: "object", properties: {} }` — Framework enforces schema declaration for all tools during registration, even when the handler accepts no arguments; omission silently breaks the tool

<!-- Captured 2026-03-25 via post-commit analysis -->
- [RULE] Utility functions with hardcoded configuration (storage keys, endpoints) silently fail when reused for different purposes. Parameterize all data sources in shared utilities, even if only one use case currently exists — reuse without parameterization causes the caller to read from the wrong source at runtime.
