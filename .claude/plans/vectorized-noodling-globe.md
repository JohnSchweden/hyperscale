---
name: Fix 10 remaining swipe gesture test failures
overview: |
  All 10 failures share one root cause: after page.mouse.up(), handleTouchEnd never fires
  (or its state updates never commit), leaving isDragging=true in the rendered DOM permanently.
  The window mouseup listener was added alongside mousemove in attachWindowMouseDrag, and
  mousemove works (transforms update during drag), but mouseup doesn't trigger handleTouchEnd.
todos:
  - id: diagnose-root-cause
    content: Add temporary console.log diagnostic in handleTouchEnd + window up handler to verify execution path
    status: pending
  - id: fix-card-mouseup
    content: Add onMouseUp={onTouchEnd} back to the card element in CardStack.tsx as safety net
    status: pending
  - id: verify-tests
    content: Run failing swipe tests and confirm all 10 pass
    status: pending
  - id: remove-diagnostics
    content: Remove temporary console.log diagnostics once fix is confirmed
    status: pending
  - id: commit
    content: Commit the fix
    status: pending
isProject: false
---

# Fix 10 Remaining Swipe Gesture Test Failures

## Context

The previous fix refactored useSwipeGestures.ts to use:
1. `isDraggingRef` for synchronous drag tracking (fixes stale closure)
2. Window-level mousemove/mouseup listeners via `attachWindowMouseDrag` (fixes off-card drag)
3. Removed `onMouseMove`, `onMouseUp`, `onMouseLeave` from the card element in CardStack.tsx

The refactoring works for mousemove (transform updates during drag), but **mouseup never triggers handleTouchEnd**. After mouse.up(), `isDragging` stays `true` in the DOM permanently (even after 1s+ of polling), meaning the exit/snap-back state transitions never fire.

## Failing Tests (10)

| Test File | Symptom |
|-----------|---------|
| button-highlight.spec.ts (2) | `direction` stays null → `bg-cyan-500` not applied to button |
| snap-back.spec.ts (2) | transition is "none" (isDragging=true) after release; transform never returns to identity |
| exit-animation.spec.ts (2) | transition is "none" (isDragging=true) after release past threshold |
| swipe-consistency.spec.ts (2) | feedback-dialog never appears (swipe never completes) |
| swipe-interactions.spec.ts (2) | preview text not visible; feedback-dialog never appears |

## Root Cause Analysis

Evidence chain:
- `window.addEventListener("mousemove", move)` → fires correctly (drag transforms update) ✓
- `window.addEventListener("mouseup", up)` → added in the same function call ✓
- After `page.mouse.up()`, `isDragging` stays `true` → `handleTouchEnd()` never ran ✗
- Polling for 1000ms+ still sees `isDragging: true` → not a timing/React batching issue ✗

**Most likely cause**: Playwright's CDP `Input.dispatchMouseEvent(type: "mouseReleased")` generates a `mouseup` DOM event that targets the element under the cursor and bubbles up through the DOM. However, `window` is the final bubble target and there may be a headless Chromium edge case where the event doesn't reliably reach `window.addEventListener("mouseup", ...)`. The `mousemove` listener works because Playwright dispatches many moves (via `{ steps: N }`), giving more opportunity for at least one to land.

Alternative theories:
- React synthetic event delegation at root intercepts/consumes the native mouseup before it reaches window
- The mouseup fires on window but `handleTouchEndRef.current` points to a stale/null reference

## Fix

### Step 1: Add `onMouseUp` back to card element (`CardStack.tsx`)

Add `onMouseUp={onTouchEnd}` to the card `<div>` element. This provides a direct React event handler path for mouseup that fires reliably via React's delegation system.

**Do NOT add back `onMouseLeave`** — that caused premature drag termination when the cursor left the card during drag.

```tsx
// CardStack.tsx, on the card div (line ~232)
onMouseDown={onTouchStart}
onMouseUp={onTouchEnd}     // <-- ADD THIS BACK
```

The `isDraggingRef.current` guard at the top of `handleTouchEnd` prevents double-execution if both the card React handler and window listener fire:

```ts
if (!isDraggingRef.current) return;  // Already handled, bail
```

**Keep the window listeners** — they handle the off-card mouseup case (cursor dragged beyond card bounds).

### Step 2: Verify all 10 tests pass

```sh
bunx playwright test tests/button-highlight.spec.ts tests/snap-back.spec.ts tests/swipe-interactions.spec.ts tests/swipe-consistency.spec.ts tests/exit-animation.spec.ts --reporter=list
```

### Files to modify

- `components/game/CardStack.tsx` — add `onMouseUp={onTouchEnd}` to card div (1 line)

## Verification

```sh
# Run the 10 failing tests
bunx playwright test tests/button-highlight.spec.ts tests/snap-back.spec.ts tests/swipe-interactions.spec.ts tests/swipe-consistency.spec.ts tests/exit-animation.spec.ts --reporter=list

# Run full test suite to confirm no regressions
bun run test
```
