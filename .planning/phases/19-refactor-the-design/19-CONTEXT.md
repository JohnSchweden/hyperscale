# Phase 19: Refactor the Design — Context

**Gathered:** 2026-03-28
**Status:** Ready for planning
**Source:** Conversation UI/UX review session

<domain>
## Phase Boundary

Reduce visual clutter across game screens (FeedbackOverlay, DebriefPage1Collapse, DebriefPage2, CardStack, DebriefPage3) to match the minimalist design DNA established by the selection screens (IntroScreen, RoleSelect, PersonalitySelect).

**Reference standard:** IntroScreen, RoleSelect, PersonalitySelect — these are the target visual register.

**Minimalist DNA to enforce across all screens:**
- One section = one job. No labeled sub-sections inside panels.
- No redundant copy that states what the UI already communicates.
- One accent color at a time (cyan for interaction, red for system warnings).
- Generous whitespace — content breathes.
- No competing dramatic visual elements.

</domain>

<decisions>
## Implementation Decisions

### FeedbackOverlay (`components/game/FeedbackOverlay.tsx`)
Cut the following (confirmed by user):
- Line 153: Remove `{personalityName}'s review` label above the quote — the quote speaks for itself
- Line 164: Remove `Governance alert` section header and its `border-b` divider — labeled sub-section header inside a panel violates the one-section-one-job rule
- Line 192: Remove `"Decision logged — no undo. Proceed when ready."` line — states the obvious, adds noise
- Line 121: Change `containerClassName="max-h-[200px] md:max-h-none"` → `"max-h-[200px] md:max-h-[220px]"` — cap image on desktop (current `md:max-h-none` can consume 40-50% of viewport)
- Collapse `teamImpact` and `realWorldReference` sub-sections — currently rendered as two separate labeled blocks; merge into one unlabeled secondary block

**Target sections after:** `[image] → [icon + fine] → [quote] → [lesson + reference] → [button]`

### DebriefPage1Collapse (`components/game/debrief/DebriefPage1Collapse.tsx`)
This component handles both victory (isVictory=true) and game-over (deathType != null) scenarios. Cut the following (confirmed by user):

- Line 343: Remove the second trophy icon from the Unlocked Endings header — the header currently has two `<i className="fa-solid fa-trophy ...">` flanking the label; remove the trailing one. Keep the leading icon and the label.
- Line 355: Remove `progressText` paragraph — filler content after the death moment.
- Lines 359–363: Remove the `{!isVictory && (<p ...>{retryPrompt || replayLine}</p>)}` block — filler content.
- After removing: also clean up unused variables `progressText` (from `useUnlockedEndings` destructure), `replayLine` const, `getPersonalityReplayLine` function, `retryPrompt` const, `PERSONALITY_REPLAY_LINES` const.
- Line 161 (inside `DeathEndingCard`): Add `max-h-[220px] overflow-hidden` to death image container — unconstrained images can consume excessive viewport height.
- Line 307: Add `max-h-[220px] overflow-hidden` to Kirk image container.

**Note:** The victory icon's `animate-pulse drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]` MUST be kept — for victory there is no competing death image, so the animation is the sole dramatic element and should not be removed.

**Target sections after:** `[death image (constrained)] → [icon + title + description] → [metrics] → [endings: count + icons] → [CTA]`

### DebriefPage2 AuditTrail (`components/game/debrief/DebriefPage2AuditTrail.tsx`)
Cut entirely (confirmed by user):
- Lines 323–388: The entire "What would you do differently?" reflection prompt block. It repeats content the player already processed through the audit log directly above it. The audit log entries already show each choice + its alternative + consequence. Personality sign-off handles the emotional close.

**Target sections after:** `[header] → [audit log entries] → [personality sign-off] → [CTA]`

### CardStack (`components/game/CardStack.tsx`)
Reduce (confirmed by user):
- Line 276: `p-4 md:p-10` → `p-4 md:p-6` — 40px desktop padding is excessive when an image also consumes vertical space
- `storyContext` block (lines 310–313): On mobile with an image present, this adds a third text layer before the actual card question. Add `hidden md:block` (or equivalent) to hide storyContext on mobile when an image is shown, so mobile flow is: image → sender → question → buttons

### DebriefPage3 Verdict (`components/game/debrief/DebriefPage3Verdict.tsx`)
Minor cleanup (confirmed by user):
- Lines 279–283: Remove the `Endings discovered: X/6 ...or is it?` hint — this exact information is already shown on DebriefPage1Collapse (debrief page 1). Duplicate across two screens.

### Claude's Discretion
- Exact JSX restructuring approach within each component
- Whether to use CSS `hidden md:block` or a conditional `{!hasImage && storyContext && ...}` pattern for CardStack
- Minor spacing adjustments to maintain visual rhythm after removals

</decisions>

<specifics>
## Specific References

- Target visual register: `components/game/IntroScreen.tsx`, `components/game/RoleSelect.tsx`, `components/game/PersonalitySelect.tsx`
- Shared styles: `components/game/selectionStageStyles.ts`
- Image component: `components/ImageWithFallback.tsx`
- All changes are subtractive (remove content/styles) — no new features or components
</specifics>

<deferred>
## Deferred

- DebriefPage3 V2 waitlist box style (cyan-600 breaks dark tone) — noted but deferred; serves a conversion purpose
- Complete visual overhaul of audit entry cards — current card design is clean enough; not in scope
</deferred>

---

*Phase: 19-refactor-the-design*
*Context gathered: 2026-03-28 via conversation UI/UX review*
