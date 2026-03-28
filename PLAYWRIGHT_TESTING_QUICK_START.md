# Playwright Testing Quick Start

## What We Fixed
The Debrief Me button now works. Tests verify it. Here's how to test it yourself in seconds.

## Run Tests (Non-Interactive)

### Test the button works
```bash
bun run test -- tests/summary-navigation.spec.ts --project=chromium-desktop
```
✓ This runs the 4 navigation tests that verify the button clicks and state changes correctly.

### Test all debrief functionality
```bash
bun run test -- tests/debrief-*.spec.ts tests/summary-*.spec.ts
```

### Run specific test
```bash
bun run test -- tests/summary-navigation.spec.ts:6
```
(runs just the "Debrief Me button navigates to DEBRIEF_PAGE_1" test)

---

## Visual Verification (Headed Mode)

### See the button click in action
```bash
bun run test -- tests/summary-navigation.spec.ts:6 --headed
```

**What you'll see:**
1. Browser opens to the game
2. Test injects DEBRIEF_PAGE_1 (victory: `deathType: null`)
3. Page reloads to Quarter survived / debrief page 1
4. Test clicks "Debrief Me" button
5. Page transitions to Debrief Page 2 (audit trail)
6. Test verifies navigation succeeded
7. Browser closes

**Duration:** ~3 seconds

### Debug mode (step through clicks)
```bash
bun run test -- tests/summary-navigation.spec.ts:6 --debug
```

**What happens:**
1. Browser + Playwright Inspector opens side-by-side
2. Inspector shows the test code
3. Use play/step buttons to advance through each action
4. Inspect DOM and network requests between steps
5. Pause/resume as needed

This is the BEST way to verify a button works - you watch it click.

---

## Understanding the Tests

### Test Structure
Tests follow this pattern:

```typescript
// 1. Inject game state via localStorage
await page.evaluate(() => {
  localStorage.setItem("km-debug-state", JSON.stringify({
    stage: "DEBRIEF_PAGE_1",
    hype: 75,
    // ... other game state
  }));
});

// 2. Reload page (app hydrates to DEBRIEF_PAGE_1)
await page.reload();

// 3. Find and click button
const button = page.getByRole("button", { name: /debrief me/i });
await button.click();

// 4. Verify navigation happened (check localStorage)
const state = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("km-debug-state")).stage
);
expect(state).toBe("DEBRIEF_PAGE_2");

// 5. Verify content rendered (audit trail)
await expect(page.getByText(/complete record|governance decisions/i)).toBeVisible();
```

### Key Files Tested
- `components/game/debrief/DebriefPage1Collapse.tsx` - The collapsed ending page
- `components/game/debrief/DebriefContainer.tsx` - Renders the correct debrief page
- `hooks/useDebrief.ts` - Navigation state machine (PAGE_1 → PAGE_2 → PAGE_3)
- `hooks/useGameState.ts` - Game state management and validation

---

## The Bugs We Fixed (For Reference)

If you want to understand what was broken, see: `DEBRIEF_BUTTON_INVESTIGATION.md`

**TL;DR:**
1. Reducer / debrief transitions were inconsistent with the intended linear debrief flow
2. Tests used wrong localStorage key (`km-game-state` vs `gameState`)
3. App couldn't hydrate to arbitrary debrief stages
4. DebriefContainer returned `null` for PAGE_1 (component never rendered)
5. Tests checked source code instead of runtime behavior

All 4 bugs are now fixed.

---

## Playwright CLI Commands Reference

| Command | Purpose |
|---------|---------|
| `bun run test` | Run all tests |
| `bun run test -- --headed` | See browser during test |
| `bun run test -- --debug` | Step through test with Inspector |
| `bun run test -- --ui` | Interactive dashboard |
| `bun run test -- FILE` | Run specific file |
| `bun run test -- FILE:LINE` | Run specific test |
| `bun run test -- --project=chromium-desktop` | Desktop only (not mobile) |
| `bun run playwright:show-report` | View HTML report after run |
| `bun run playwright:show-trace -- trace.zip` | View action trace |

---

## Quick Health Check

Run this to verify the debrief system is working:

```bash
# Navigation tests
bun run test -- tests/debrief-navigation.spec.ts tests/summary-navigation.spec.ts

# Expected: All pass ✓
```

If these pass, the debrief button is working correctly.

---

## Debugging Failed Tests

If a test fails, run it in debug mode:

```bash
bun run test -- tests/summary-navigation.spec.ts:6 --debug
```

Then:
1. Use Inspector to pause before the click
2. Manually inspect the button with dev tools
3. Check the `data-testid` or role attributes
4. Look at console for any errors
5. Step through the click to see what happens

---

## Recording New Tests (Codegen)

If you need to record a new interaction:

```bash
bun run playwright:codegen -- https://localhost:3000
```

This opens your app + Inspector side-by-side. Every action you perform gets recorded as test code.
