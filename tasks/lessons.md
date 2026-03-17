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
