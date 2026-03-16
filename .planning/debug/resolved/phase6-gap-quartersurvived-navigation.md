# Debug Session: Quarter Survived Navigation Failure

## Problem
When clicking [Debrief Me] button on "Quarter Survived" screen (SUMMARY stage), nothing happens.

## Root Cause
In `hooks/useDebrief.ts`, the `nextPage()` function's transitions map has `DEBRIEF_PAGE_1` mapped to `null`:

```typescript
const transitions: Record<GameStage, GameStage | null> = {
  [GameStage.GAME_OVER]: GameStage.DEBRIEF_PAGE_2,
  [GameStage.DEBRIEF_PAGE_2]: GameStage.DEBRIEF_PAGE_3,
  [GameStage.DEBRIEF_PAGE_3]: null,
  // ...
  [GameStage.SUMMARY]: GameStage.DEBRIEF_PAGE_1,
  [GameStage.DEBRIEF_PAGE_1]: null,  // ← BUG: Should be DEBRIEF_PAGE_2
};
```

When user clicks [Debrief Me]:
1. SUMMARY → DEBRIEF_PAGE_1 ✓
2. DEBRIEF_PAGE_1 → null (no navigation) ✗

## Fix
Change line 91 in `hooks/useDebrief.ts`:
```typescript
[GameStage.DEBRIEF_PAGE_1]: GameStage.DEBRIEF_PAGE_2,
```

## Verification
Test the full flow:
1. Play game, survive quarter
2. Click [Debrief Me] on Quarter Survived → Page 1
3. Click [Debrief Me] on Page 1 → Page 2
4. Click [Generate Psych Evaluation] → Page 3
5. Click [Reboot System] → Intro

## Files
- Fix: `hooks/useDebrief.ts` (line 91)
- Tests: `tests/debrief-navigation.spec.ts`

## Related
- Plan: `.planning/phases/06-debrief-and-replay-system/06-17-PLAN.md`
- UAT: `.planning/phases/06-debrief-and-replay-system/06-UAT.md` (Test 1)
