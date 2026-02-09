# Agent instructions

## Git integration

Follow `.cursor/references/git-integration.md` for commit points, message formats, and when to commit (outcomes, not process).

## Verification & Testing (REQUIRED)

**After making ANY code changes, you MUST verify them using one of these methods:**

### 1. Automated Tests (Preferred)
- Run `bunx playwright test` to execute all tests
- For specific tests: `bunx playwright test tests/[test-name].spec.ts`
- Fix any failing tests before committing

### 2. Browser Verification (UI Changes)
When you modify UI, interactions, or visual elements:

**Using agent-browser:**
1. Start dev server: `npm run dev` (runs on http://localhost:5173)
2. `agent-browser open http://localhost:5173`
3. `agent-browser snapshot -i` to see interactive elements
4. Test the specific feature you changed (click, swipe, fill forms, etc.)
5. `agent-browser screenshot` to capture evidence of working state

**Using playwright-cli:**
1. Start dev server: `npm run dev`
2. `playwright-cli open http://localhost:5173`
3. `playwright-cli snapshot` to see elements
4. Interact with changed features using `click`, `fill`, `press`, etc.
5. `playwright-cli screenshot` to verify
6. `playwright-cli close` when done

### 3. When to Use Each Method
- **Playwright tests**: Always run after changes to verify nothing broke
- **agent-browser**: Quick interactive verification, exploratory testing
- **playwright-cli**: Precise control, debugging specific interactions

**DO NOT commit without verification. If tests fail or browser verification shows issues, fix them first.**

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes

## Playwright CLI

Use `playwright-cli` (via the `playwright-cli` skill) for browser automation when you want direct CLI control instead of `agent-browser`.

Core workflow:
1. `playwright-cli open [url]` - Start a browser (and optionally navigate)
2. `playwright-cli snapshot` - Get interactive elements with refs (e1, e2, ...)
3. Use commands like `playwright-cli click e1`, `playwright-cli fill e2 "text"`, `playwright-cli press Enter` to interact
4. `playwright-cli screenshot` / `pdf` / storage and session commands as needed
5. `playwright-cli close` (or `close-all` / `kill-all`) when finished
