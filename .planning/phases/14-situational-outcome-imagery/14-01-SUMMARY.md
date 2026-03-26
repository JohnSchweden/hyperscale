---
phase: 14-situational-outcome-imagery
plan: 01
status: complete
completed_at: 2026-03-26T21:42:00Z
execution_duration: 7 minutes
subsystem: image-infrastructure
tags: [imageWithFallback, glitch-placeholder, lazy-loading, archetype-image]
dependency_graph:
  requires: []
  provides: [image-rendering-component, archetype-image-field, image-test-scaffolding]
  affects: [debrief-verdict-page, incident-card-display, outcome-overlay, game-over-page]
tech_stack:
  added: [lazy-loading-img, css-scanline-animation, aspect-ratio-utilities]
  patterns: [placeholder-fallback, native-lazy-loading, glitch-aesthetic]
key_files:
  created:
    - components/ImageWithFallback.tsx (image component with placeholder)
    - tests/image-fallback.spec.ts (placeholder behavior tests)
    - tests/image-incident-card.spec.ts (incident card image tests)
  modified:
    - types.ts (Archetype interface extended with optional image field)
---

# Phase 14 Plan 01: Situational & Outcome Imagery Foundation - Complete

**Executive Summary:** Created foundational image infrastructure for Phase 14 with ImageWithFallback component, extended Archetype type, and test scaffolding. All path resolution delegates to Phase 13's imageMap.ts — no separate imagePaths.ts file created. Component uses native lazy loading (no IntersectionObserver) with glitch placeholder aesthetic.

---

## Completed Tasks

| Task | Name | Status | Commit |
|------|------|--------|--------|
| 1 | Create ImageWithFallback component with glitch placeholder | ✓ Complete | 6f5110e |
| 2 | Extend Archetype interface with optional image field | ✓ Complete | 6f5110e |
| 3 | Create test stubs for incident images and fallback (HOS pilot) | ✓ Complete | 6f5110e |

---

## Task Details

### Task 1: ImageWithFallback Component

**Created:** `components/ImageWithFallback.tsx`

**Implementation:**
- Reusable component accepting `src`, `alt`, `aspectRatio`, `className`, `containerClassName` props
- State management: `isLoaded` and `hasError` flags
- Container styling: rounded-lg, border, overflow-hidden, aspect-ratio support (video 16:9, square 1:1, auto)
- Glitch placeholder with:
  - Dark slate gradient background (slate-800 to slate-900)
  - Cyan icon (fa-image) with animate-pulse
  - Scanline effect via repeating linear gradient
  - CSS animation: `glitch-scan` (4px vertical movement at 0.15s intervals)
- Image element:
  - Native `loading="lazy"` for performance (no IntersectionObserver)
  - `object-cover` for consistent aspect ratio display
  - Fade-in transition: opacity 0 → 100 over 300ms ease-out
  - `onLoad` and `onError` handlers for state management
- Font Awesome icons loaded via CDN (no npm package needed)

**Architecture Decision:** Uses Font Awesome icons via HTML class names (`<i class="fa-solid fa-image" />`) matching project pattern in debrief components, avoiding unnecessary npm dependencies.

---

### Task 2: Archetype Interface Extension

**Modified:** `types.ts`

**Change:**
```typescript
export interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  icon: string;
  color: string;
  traits: string[];
  /** Optional image path for archetype badge (verdict page) */
  image?: string;  // NEW FIELD
}
```

**Rationale:**
- Archetype is a small fixed set (7 entries including KIRK)
- Image field is optional and backward compatible
- Card and ChoiceOutcome interfaces left unchanged — they resolve images via imageMap.ts lookup using `realWorldReference.incident` slug, not via fields

---

### Task 3: Test Scaffolding

**Created:**
- `tests/image-fallback.spec.ts` (4 test stubs, @area:layout tag)
- `tests/image-incident-card.spec.ts` (5 test stubs, @area:layout tag)

**Coverage:**

**image-fallback.spec.ts:**
1. Glitch placeholder shown while image loads (checks fa-image icon visibility)
2. Glitch placeholder shown when image fails (validates repeating-linear-gradient styling)
3. Image fades in over 300ms when loaded (verifies transition-opacity and duration-300 classes)
4. Placeholder has glitch aesthetic (validates scanline animation and gradients)

**image-incident-card.spec.ts:**
1. HOS incident card displays image with 16:9 aspect ratio (aspect-video class verification)
2. HOS card image resolves via realWorldReference.incident slug (imageMap.ts lookup)
3. Image moves with card during swipe gesture (card-contained positioning, not parallax)
4. Image lazy loads with loading='lazy' attribute (native lazy loading verification)
5. Non-HOS role shows placeholder when image missing (fallback behavior for pilot outside scope)

**Test Scope:** Tests use `navigateToPlayingWithRoleFast()` to bootstrap HOS (pilot scope) and SOFTWARE_ENGINEER (fallback path). Initially failing tests — this is intentional Wave 0 RED phase for image integration tasks.

---

## Verification

- [x] `bun run typecheck` passes without errors
- [x] ImageWithFallback component renders and exports correctly
- [x] Only Archetype interface extended with `image?: string` field
- [x] Card and ChoiceOutcome interfaces unchanged
- [x] No `utils/imagePaths.ts` created — all path resolution via `data/imageMap.ts`
- [x] Two test files created with comprehensive test stubs
- [x] Tests scoped to HOS pilot with fallback assertions for other roles
- [x] Tests follow project conventions and can run (currently intentionally failing)
- [x] All files formatted by Biome and lint-staged hooks

---

## Success Criteria Met

✓ ImageWithFallback component exists with glitch placeholder and native lazy loading (no IntersectionObserver)
✓ No utils/imagePaths.ts file created — all path resolution via data/imageMap.ts from Phase 13
✓ types.ts has optional image field on Archetype only (not Card or ChoiceOutcome)
✓ tests/image-incident-card.spec.ts scoped to HOS pilot role
✓ tests/image-fallback.spec.ts covers placeholder behavior
✓ All tests can be run (even if failing as intentional Wave 0 RED)
✓ TypeScript compilation passes

---

## Deviations from Plan

None — plan executed exactly as written. All must-haves satisfied, success criteria met.

---

## Design Decisions Applied

1. **Font Awesome via CDN** — Used existing HTML class pattern (`<i class="fa-solid fa-icon" />`) instead of React component imports, matching project conventions seen in DebriefPage1Collapse
2. **Inline CSS for animations** — Glitch animation defined in component's `<style>` tag for scoped CSS
3. **Native lazy loading only** — Decision from 14-CONTEXT.md implemented: no IntersectionObserver complexity
4. **Archetype image field** — Optional field on small fixed set; Card/ChoiceOutcome use imageMap lookup pattern instead

---

## Next Steps (Phase 14-02 onwards)

- Image integration into UI surfaces (incident cards, outcome overlay, debrief pages)
- Implement imageMap.ts helpers from Phase 13 (getIncidentImagePath, getOutcomeImagePath, etc.)
- Wire ImageWithFallback component into CardStack, FeedbackOverlay, DebriefPage1Collapse, DebriefPage3Verdict
- Finalize test implementations (currently stubs) as UI surfaces are integrated
- Handle next-card preloading for smooth swipe transitions

---

*Execution complete: 2026-03-26 21:42 UTC*
*Commit: 6f5110e (feat(14-01): create ImageWithFallback component and image infrastructure)*
