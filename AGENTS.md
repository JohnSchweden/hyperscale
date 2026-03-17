# Agent instructions

# Development Workflow

**Always use `bun`, not `npm`.**

```sh
# 1. Make changes

# 2. Typecheck (fast)
bun run typecheck

# 3. Run tests
bun run test -- -g "test name"      # Single suite
bun run test:file -- "glob"          # Specific files

# 4. Lint before committing
bun run lint:file -- "filel.ts"     # Specific files
bun run lint                        # All files

# 5. Before creating PR
bun run check && bun run typecheck && bun run test
```

## Runtime Package Manager Detection (MANDATORY)

When any GSD plan, task, or template specifies `npm run`, `npm test`, or similar:
1. Check project root for lockfiles
2. Substitute commands before executing:
   - `bun.lock` present: `npm run X` → `bun X`, `npm test` → `bun test`
   - `yarn.lock` present: `npm run X` → `yarn X`, `npx X` → `yarn dlx X`
3. Log the substitution in task output

This applies to ALL commands from templates, plans, and references.

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fizing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Git integration

Follow `.cursor/references/git-integration.md` for commit points, message formats, and when to commit (outcomes, not process).

## Verification & Testing (REQUIRED)

**After making ANY code changes, you MUST verify them using one of these methods:**

See `tasks/testing-runbook.md` for tiered test lanes (smoke, area, visual, slow).

### 1. Automated Tests (Preferred)
- Run `bun run test:smoke` for fast critical checks (~15s)
- Run `bun run test:area:<domain>` for targeted area (gameplay, input, layout, boss, audio)
- Run `bunx playwright test` to execute all tests
- For specific tests: `bunx playwright test tests/[test-name].spec.ts`
- Fix any failing tests before committing

### 2. Browser Verification (UI Changes)
When you modify UI, interactions, or visual elements:

**Using agent-browser:**
1. Start dev server: `bun dev` (runs on https://localhost:3000)
2. `agent-browser --ignore-https-errors open https://localhost:3000`
   - NOTE: `--ignore-https-errors` is REQUIRED for self-signed SSL certificates
   - If daemon already running: `agent-browser close` first, then reopen with flag
3. `agent-browser snapshot -i` to see interactive elements
4. Test the specific feature you changed (click, swipe, fill forms, etc.)
5. `agent-browser screenshot` to capture evidence of working state

**Using playwright-cli:**
1. Start dev server: `bun dev`
2. `playwright-cli open http://localhost:3000`
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
