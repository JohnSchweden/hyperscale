# Code Optimization Plan

This document outlines 15 refactoring opportunities identified across 8 components, prioritized by impact and effort.

---

## Priority Overview

| Priority | Count | Focus |
|----------|-------|-------|
| **P1** | 8 | Component extraction, eliminate duplication |
| **P2** | 4 | Logic consolidation, declarative patterns |
| **P3** | 3 | Prop interface optimization |

---

## P1: High Impact / Low-Medium Effort (Do First)

### 1. FeedbackOverlay.tsx - Extract `OutcomeImage` Component
- **Location:** Lines 165-212 (inline IIFE)
- **Est. LOC Reduction:** ~48 lines
- **Approach:** Extract to pure component taking `outcome` and `variant` props
- **Dependencies:** None
- **Priority Score:** 10/10

### 2. CardStack.tsx - Extract `CardHeaderBar` Sub-component
- **Location:** Lines 220-238, 316-334 (duplicated)
- **Est. LOC Reduction:** ~30 lines (2 instances → 1 component)
- **Approach:** Create `CardHeaderBar` accepting `title`, `subtitle`, `icon` props
- **Dependencies:** None
- **Priority Score:** 10/10

### 3. CardStack.tsx - Extract `CardBody` Sub-component
- **Location:** Lines 240-379 (shared structure)
- **Est. LOC Reduction:** ~60 lines
- **Approach:** Extract to `CardBody` with `children`, `variant`, `actionLabel` props
- **Dependencies:** #2 first (reuse CardHeaderBar inside CardBody)
- **Priority Score:** 9/10

### 4. FeedbackOverlay.tsx - Extract `EscalationBadge` Component
- **Location:** Lines 131-161
- **Est. LOC Reduction:** ~30 lines
- **Approach:** Extract to `EscalationBadge` with `level`, `label` props
- **Dependencies:** None (can parallel with #1, #5)
- **Priority Score:** 9/10

### 5. FeedbackOverlay.tsx - Extract `DeltaStat` Component
- **Location:** Lines 298-330
- **Est. LOC Reduction:** ~30 lines
- **Approach:** Extract to `DeltaStat` with `type` (heat/hype), `value`, `label` props
- **Dependencies:** None (can parallel with #1, #4)
- **Priority Score:** 8/10

### 6. StarfieldBackground.tsx - Extract `BgmControls` Sub-component
- **Location:** Lines 243-309
- **Est. LOC Reduction:** ~66 lines
- **Approach:** Extract to `BgmControls` with `isPlaying`, `volume`, `onToggle`, `onVolumeChange` props
- **Dependencies:** None
- **Priority Score:** 8/10

### 7. GameHUD.tsx - Extract `HUDMeter` Sub-component
- **Location:** Duplicated meter JSX (Budget/Risk/Hype)
- **Est. LOC Reduction:** ~40 lines
- **Approach:** Create `HUDMeter` with `label`, `value`, `max`, `color`, `icon` props
- **Dependencies:** None
- **Priority Score:** 8/10

### 8. DebriefPage1Collapse.tsx - Extract `ExplanationCard` Component
- **Location:** Lines 292-335 (duplicated JSX)
- **Est. LOC Reduction:** ~30 lines
- **Approach:** Extract to `ExplanationCard` with `title`, `content`, `variant` props
- **Dependencies:** None
- **Priority Score:** 8/10

---

## P2: Medium Impact / Medium Effort (Do Next)

### 9. DebriefPage1Collapse.tsx - Merge KIRK/Regular Failure Lesson Rendering
- **Location:** Conditional rendering for KIRK vs regular cards
- **Est. LOC Reduction:** ~15 lines
- **Approach:** Unify into single conditional with polymorphic `lessonType` prop
- **Dependencies:** #8 (use ExplanationCard)
- **Priority Score:** 7/10

### 10. DebriefPage2AuditTrail.tsx - Merge Switch Statements
- **Location:** `getPersonalityComment` and `getKirkPersonalityBreak` functions
- **Est. LOC Reduction:** ~25 lines
- **Approach:** Consolidate into single `getPersonalityComment(type, isKirk)` function
- **Dependencies:** None
- **Priority Score:** 7/10

### 11. DebriefPage3Verdict.tsx - Extract `KirkVerdict` Component
- **Location:** ~10 nested ternaries
- **Est. LOC Reduction:** ~35 lines
- **Approach:** Create `KirkVerdict` component with `verdict`, `kirkMood`, `explanation` props
- **Dependencies:** None
- **Priority Score:** 6/10

### 12. DebriefPage3Verdict.tsx - Replace DOM Manipulation with Declarative Meta
- **Location:** `updateMetaTags` function
- **Est. LOC Reduction:** ~20 lines
- **Approach:** Use React state + effect to manage meta tags declaratively via document head
- **Dependencies:** #11 (component extraction provides natural home for meta logic)
- **Priority Score:** 6/10

---

## P3: Lower Impact / Higher Effort (Later)

### 13. DebriefPage1Collapse.tsx - Reorganize Deep Kirk Nesting
- **Location:** Kirk-specific rendering section
- **Est. LOC Reduction:** ~20 lines (readability gain)
- **Approach:** Break into separate `KirkSection` and `RegularSection` components
- **Dependencies:** #9 (unified lesson rendering first)
- **Priority Score:** 5/10

### 14. GameScreen.tsx - Group Swipe/Roast Props
- **Location:** 26-prop interface
- **Est. LOC Reduction:** ~15 lines (interface only)
- **Approach:** Create `SwipeState` and `RoastState` interfaces, group related props
- **Dependencies:** #15 (App.tsx change)
- **Priority Score:** 4/10

### 15. App.tsx - Bundle Swipe-Related Props
- **Location:** GameScreen prop passing
- **Est. LOC Reduction:** ~10 lines
- **Approach:** Create `swipeState` object to pass to GameScreen
- **Dependencies:** #14 (GameScreen interface change)
- **Priority Score:** 4/10

---

## Execution Order

```
Phase 1 (P1 - Immediate)
├── 1. FeedbackOverlay - OutcomeImage
├── 2. FeedbackOverlay - EscalationBadge  
├── 3. FeedbackOverlay - DeltaStat
├── 4. CardStack - CardHeaderBar
├── 5. CardStack - CardBody
├── 6. GameHUD - HUDMeter
├── 7. StarfieldBackground - BgmControls
└── 8. DebriefPage1Collapse - ExplanationCard

Phase 2 (P2 - After P1)
├── 9. DebriefPage1Collapse - Merge lesson cards
├── 10. DebriefPage2AuditTrail - Merge switch
├── 11. DebriefPage3Verdict - KirkVerdict extract
└── 12. DebriefPage3Verdict - Declarative meta

Phase 3 (P3 - Last)
├── 13. DebriefPage1Collapse - Reorganize Kirk sections
├── 14. GameScreen - Prop grouping
└── 15. App.tsx - Swipe state object
```

---

## Estimated Totals

| Metric | Value |
|--------|-------|
| Total LOC Reduction | ~519 lines |
| Components Created | 11 |
| Interfaces Refactored | 2 |
| Files Modified | 8 |

---

## Notes

- **Parallel Work:** P1 items 1,4,5,6,7,8 have no dependencies and can be done in parallel
- **Sequential Dependencies:** #2 → #3, #8 → #9 → #13, #14 → #15, #11 → #12
- **Testing:** Run `bun run test:smoke` after each phase to verify no regressions
- **Review:** Consider pairing #14/#15 since they depend on each other
