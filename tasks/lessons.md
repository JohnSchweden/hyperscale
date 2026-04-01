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

<!-- Captured 2026-03-25 via post-commit analysis -->
- [RULE] Audio file size thresholds are codec-specific and must be recalibrated during format migrations — Different codecs compress dramatically differently (WAV uncompressed ~50KB vs Opus at 96kbps ~4KB minimum for same duration). Tests with stale thresholds fail silently or produce false positives. Always document the codec/bitrate when changing formats and recalculate minimum sizes accordingly.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] In card decks with narrative violations, verify each card's deathVector semantically matches its violation/lesson. Reuse of the same death ending across multiple semantically different violations indicates incomplete content needing review — Narrative coherence breaks when outcomes don't match the failure mode (e.g., optimization loophole → CONGRESS/governance vs singularity risk → PRISON/legal consequences). Repeated generic values suggest placeholder data left in.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] When state lookups reference a computed override value, use the same fallback sequence everywhere to prevent divergence — Different patterns (one using direct lookup, one using computed ?? default) reference different data when the override differs, causing state sync bugs between components. Enforce consistency across all paths and document the synchronization requirement ("same instance as X") in comments.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] When selecting pre-baked side-specific assets (audio, graphics, text), resolve through a helper that accounts for card variants (choiceSidesSwapped), not the raw screen choice — Screen position diverges from authoring intent when cards are flipped, causing wrong assets to play or display.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] When exposing state objects with side-specific fields through tool APIs, include semantic metadata (like feedbackAuthoringStem) alongside presence flags — Tools need both "does feedback exist?" and "which side was it authored for?" to make correct decisions. Exposing only boolean presence is incomplete and forces consumers to guess intent.

<!-- Captured 2026-03-28 via post-commit analysis -->
- [RULE] When exposing game state through tool APIs (WebMCP, etc.), audit all tool consumer code to ensure every referenced field is included in the state payload — Missing fields cause silent failures where tools cannot access state they need, and no error is raised.

<!-- Captured 2026-03-28 via post-commit analysis -->
- [RULE] Audio playback effects coordinating on the same behavior (death audio, victory audio) must reference the same canonical GameStage value across all effects. Outcome screens use `DEBRIEF_PAGE_1` (death when `deathType` is set, victory when null); keep triggers aligned with that stage and `deathType`, not split legacy stages.

<!-- Captured 2026-03-29 via post-commit analysis -->
- [RULE] Don't use Playwright's `page.mouse.move/down/up` for testing card drag interactions; use DOM-level synthetic event dispatch instead — Playwright's synthetic mouse events don't reliably fire window-level listeners in this architecture's gesture detection, causing flaky tests. Create helper functions (`syntheticDragOnCard`, `syntheticMouseUpAtCard`) that dispatch events directly on the target element.

<!-- Captured 2026-03-30 via post-commit analysis -->
- [RULE] Extract formatting/calculation utilities to shared modules immediately when found duplicated across components — parallel implementations diverge in precision/rounding (RoleSelect's `formatBudget` used `.toFixed(0)` while GameHUD used `.toFixed(1)` for millions), causing silent display inconsistencies in the UI.
- [RULE] Test files should import and use actual utility functions from src/, not redefine them locally — test redefinitions create silent divergence where tests pass but real code behaves differently (game-hud.spec.ts had `formatBudgetMillion` instead of importing the actual `formatBudget`).

<!-- Captured 2026-03-30 via post-commit analysis -->
- [RULE] When card types require special asset handling (like Kirk-breach cards), provide type-specific fallback UI (e.g., glitch placeholder) instead of generic null returns — preserves narrative identity and prevents UI gaps when specialized assets are missing or delayed. Check the card's identifying pattern (slug prefix) and render accordingly, not just `return null` for all missing images.

<!-- Captured 2026-03-30 via post-commit analysis -->
- [RULE] When rendering type-specific content (explanation, lesson blocks for different death endings), always gate each piece with its type discriminator (isKirk, regularDeathType), not just the content presence check — Multiple death types may have the same fields populated, and absence of the type guard causes content to render for the wrong ending type

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] When a function formats data that appears visually (consequences, stats, etc.), match its parameter order to the visual display order — mismatched parameter order causes bugs where formatting logic diverges from the display sequence and makes it harder to verify consistency across components.

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] When exposing stat deltas to components that display them, include all three deltas (fine, heat, hype) together in the state object, not piecemeal — The feedback overlay needs fine, heat, and hype impacts to render a complete display. Exposing only one forces downstream components to either recalculate the others or silently omit them from the UI.

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] Use data attributes (not CSS class selectors or nth position) for Playwright test selectors in responsive components — Layout structure changes between breakpoints (flex direction, class distribution), breaking selectors that depend on these specifics; data attributes remain stable across responsive refactors and prevent silent selector failures after restructuring.

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] Layout tests checking CSS constraints should assert all Tailwind utility classes that together produce the feature, not just the primary one — missing secondary constraints like max-width hide responsive bugs that only surface under specific viewport conditions

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] When sizing images in flex containers, use width-based responsive constraints with breakpoints (sm:, md:) rather than max-height, and ensure the parent container uses flex properties (flex-col items-center) for centering — `mx-auto` centering is unreliable in flex contexts with `shrink-0`; height-only constraints don't scale responsively across viewport widths. Width-responsive + flex centering is more robust.

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] Parameter order bugs with same-type arguments escape type checking — TypeScript allows arguments of the same type to swap without error (e.g., fine/heat/hype are all numbers). Always verify the order against the function signature when calling utilities with multiple same-type parameters; visual inspection is the only safeguard.

<!-- Captured 2026-03-31 via post-commit analysis -->
- [RULE] When testing lazy-loaded images, scroll them into view before checking load completion — `loading="lazy"` prevents download/decode until element enters viewport, causing `waitForFunction` to timeout without the scroll
- [RULE] Navigate tests to the exact screen/context where the component being tested exists; testing in a different screen means you're not verifying the real component's actual behavior

<!-- Captured 2026-04-01 via post-commit analysis -->
- [RULE] Don't animate opacity on parent elements that have `backdrop-filter` descendants — opacity < 1 converts the element to a backdrop root, breaking the filter on children. Use a `::before` pseudo-element overlay animated instead, and position descendants above it with z-index — preserves the window-level backdrop root where filters sample correctly.
