# K-Maru Onboarding Guide

Welcome to K-Maru: The Hyperscale Chronicles. This guide will get you productive in this codebase as quickly as possible.

## 1. Welcome & Project Overview

### What Is K-Maru?

K-Maru is an AI-powered compliance and cybersecurity education game. It plays like "Tinder for AI Risk, Governance & Compliance" -- you swipe through ethical dilemma cards as an executive at a hyperscale tech company, managing three stats (Hype, Heat, Budget) while facing realistic scenarios drawn from real-world tech controversies.

### Key Features

- Swipe-based card gameplay (touch and mouse)
- 10 playable roles with unique card decks (80+ cards per role)
- 3 AI personalities with voice commentary (V.E.R.A. the Roaster, Bamboo the Zen Master, HYPE-BRO the Lovebomber)
- 7 death endings driven by decision patterns (death vectors)
- Boss fight quiz with AI safety questions
- 3-page debrief system with archetype reveal and LinkedIn sharing
- AI-generated incident and outcome images
- Procedural background music and pressure audio
- WebMCP tools for dev-time game control

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Linting | Biome 2 |
| E2E Testing | Playwright 1.58 |
| Unit Testing | Vitest 4 |
| Package Manager | bun |
| AI Integration | Google GenAI SDK |
| State Management | React useReducer |
| Audio | Web Audio API + Gemini TTS |

### Current Milestone

**v1.2: Kobayashi Maru -- AI Governance Simulator** -- transforming the game into a no-win experimentation sandbox. 21 phases planned, most complete. See `.planning/ROADMAP.md` for full status.

---

## 2. Development Environment Setup

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 24.x | Enforced in `package.json` engines |
| bun | latest | Required -- do not use npm |
| Git | any | For version control |

### Step-by-Step Setup

**1. Clone and install dependencies:**

```bash
git clone <repository-url>
cd k-maru-the-hyperscale-chronicles
bun install
```

**2. Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key (client-side) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key (server-side/API routes) | Yes |
| `RESEND_API_KEY` | Resend email API key | No |
| `VITE_ENABLE_SPEECH` | Set to `false` to disable TTS | No |
| `VITE_TTS_FALLBACK_ENABLED` | Enable TTS fallback when Live API fails | No |
| `VITE_STT_LOW_LATENCY` | Set to `true` for faster STT (reduced quality) | No |

**3. Install Playwright browsers:**

```bash
bun run playwright:install
```

**4. Start the dev server:**

```bash
bun run dev
```

Open `https://localhost:3000` in your browser. The dev server uses self-signed SSL (required for audio transcription).

**5. Verify everything works:**

```bash
bun run typecheck
bun run test:smoke
```

---

## 3. Project Structure Overview

### Top-Level Directories

| Directory | Purpose |
|-----------|---------|
| `components/` | React UI components |
| `data/` | Game data: cards, roles, personalities, archetypes, death vectors |
| `hooks/` | Custom React hooks |
| `lib/` | Shared utilities (deck shuffling, formatting, audio, slugify) |
| `services/` | External service integrations (Gemini, audio, roast) |
| `scripts/` | Build/automation scripts (voice generation, image generation, compression) |
| `tests/` | Playwright E2E test specs |
| `unit/` | Vitest unit tests |
| `api/` | Vercel serverless API routes |
| `public/` | Static assets (audio, images, fonts) |
| `utils/` | Test utilities |
| `.planning/` | GSD framework: phases, research, debug logs, project docs |
| `.cursor/skills/` | AI agent skill definitions |
| `.agents/skills/` | Additional agent skills |
| `tasks/` | Task tracking, lessons learned, testing runbooks |

### Components (`components/`)

| Path | Purpose |
|------|---------|
| `LayoutShell.tsx` | Responsive layout wrapper |
| `ImageWithFallback.tsx` | Image component with glitch placeholder fallback |
| `game/` | All game-screen components |
| `game/debrief/` | Debrief page components (3-page flow) |
| `game/dev/` | Dev-only components |

Key game components:

| Component | Purpose |
|-----------|---------|
| `IntroScreen.tsx` | Title screen |
| `PersonalitySelect.tsx` | AI companion selection |
| `RoleSelect.tsx` | Role/department selection |
| `InitializingScreen.tsx` | Boot sequence animation |
| `GameScreen.tsx` | Main gameplay container |
| `CardStack.tsx` | Swipeable card display |
| `GameHUD.tsx` | Stats display (Hype, Heat, Budget) |
| `FeedbackOverlay.tsx` | Post-swipe feedback display |
| `BossFight.tsx` | Final quiz challenge |
| `RoastTerminal.tsx` | AI commentary terminal |
| `PressureCueController.tsx` | Stress indicator controller |
| `StarfieldBackground.tsx` | Animated starfield |
| `Taskbar.tsx` | Bottom taskbar |

### Data (`data/`)

Game content lives here. This is where you add new cards, roles, or game content.

| File | Purpose |
|------|---------|
| `cards/` | Role-specific card decks (10 files, one per role) |
| `cards/index.ts` | Card exports and ROLE_CARDS mapping |
| `roles.ts` | RoleType enum and ROLE_DESCRIPTIONS |
| `personalities.ts` | Personality definitions |
| `archetypes.ts` | Player archetype system |
| `deathEndings.ts` | Death ending definitions |
| `deathVectors.ts` | Death vector types and mappings |
| `failureLessons.ts` | Educational failure lessons per death type |
| `bossQuestions.ts` | Boss fight quiz questions |
| `incidents.ts` | Incident card data |
| `imageMap.ts` | Image slug-to-path mapping |
| `pressureScenarios.ts` | Timed/pressure card metadata |
| `sources.ts` | AppSource enum (IDE, Slack, Email, etc.) |
| `voiceUiCopy.ts` | Voice-related UI text |
| `bgmPlaylist.ts` | Background music playlist |
| `kirkCards.ts` | Kirk easter egg card definitions |

### Hooks (`hooks/`)

| Hook | Purpose |
|------|---------|
| `useGameState.ts` | Core game state management |
| `useSwipeGestures.ts` | Touch/mouse gesture handling |
| `useBossFight.ts` | Boss fight logic |
| `useArchetype.ts` | Player archetype calculation |
| `useDebrief.ts` | Debrief page state |
| `useIncidentPressure.ts` | Timer/pressure on cards |
| `usePressureAudio.ts` | Stress audio cues |
| `useVoicePlayback.ts` | Voice clip playback |
| `useBackgroundMusic.ts` | BGM management |
| `useRoast.ts` | AI roast commentary |
| `useLiveAPISpeechRecognition.ts` | STT via Gemini Live API |
| `useWebMCPTools.ts` | Dev-time game control tools |

### Services (`services/`)

| File | Purpose |
|------|---------|
| `geminiService.ts` | Gemini TTS (text-to-speech) |
| `geminiLive.ts` | Gemini Live API (streaming audio) |
| `roastService.ts` | AI roast generation |
| `voicePlayback.ts` | Voice file loading and playback |
| `radioEffect.ts` | Audio post-processing |
| `pressureAudio.ts` | Stress audio (heartbeat, alerts) |
| `kirkAudio.ts` | Kirk easter egg audio |
| `audioUtils.ts` | Shared audio utilities |

---

## 4. Understanding the GSD Framework

### What Is GSD?

GSD (Goal-Scoped Development) is a planning framework that breaks large features into phases, each with detailed implementation plans. All planning lives in `.planning/`.

### Directory Structure

```
.planning/
  PROJECT.md          # Project overview, current milestone
  ROADMAP.md          # All phases, status, requirements
  STATE.md            # Current state tracking
  MILESTONES.md       # Milestone definitions
  config.json         # GSD configuration
  phases/             # Phase directories (01-21+)
    01-live-api-stt-research/
      01-01-PLAN.md   # Individual implementation plans
      01-02-PLAN.md
      ...
    02-new-role-set-impact-zones/
    03-no-win-scenario-cards/
      03-REVISION-NOTES.md  # Plan revision history
    ...
  research/           # Technical research docs
  debug/              # Debug logs and investigation notes
  quick/              # Quick-reference docs
  codebase/           # Codebase analysis docs
  milestones/         # Milestone tracking
```

### How to Navigate 200+ Planning Files

1. **Start with ROADMAP.md** -- it lists every phase, its status, and links to plans
2. **Find your phase** -- look for the phase number in the roadmap table
3. **Read the phase directory** -- each has numbered PLAN.md files in execution order
4. **Check for revisions** -- look for `*-revised-PLAN.md` or `*REVISION-NOTES.md` files; these supersede original plans
5. **Never use deprecated plans** -- they are marked with `DEPRECATED` or `DO NOT USE`

### Phase File Naming

| Pattern | Meaning |
|---------|---------|
| `03-01-PLAN.md` | Original plan, phase 03, step 01 |
| `03-02-revised-PLAN.md` | Revised plan (supersedes `03-02-PLAN.md`) |
| `03-REVISION-NOTES.md` | Explanation of why plans were revised |

### Using `/gsd-plan-phase`

When working with AI agents, use the `/gsd-plan-phase` command to break down a phase into actionable steps. The agent will:

1. Read the phase requirements from ROADMAP.md
2. Check existing plans in the phase directory
3. Create or update PLAN.md files with implementation details
4. Track requirements and gap closure

### Phase Status Indicators

| Status | Meaning |
|--------|---------|
| Complete (X/X) | All plans executed |
| Not started | No plans executed yet |
| Deferred | Intentionally postponed |
| In progress | Some plans complete, some pending |

---

## 5. Development Workflow

### Package Manager

**Always use `bun`, never `npm`.** The project has a `bun.lock` file and all scripts are tested with bun.

### Standard Workflow

```bash
# 1. Make changes

# 2. Typecheck (fast)
bun run typecheck

# 3. Run tests
bun run test -- -g "test name"      # Single suite
bun run test:file -- "glob"          # Specific files

# 4. Lint before committing
bun run lint:file -- "file.ts"      # Specific file
bun run lint                        # All files

# 5. Before creating PR
bun run check && bun run typecheck && bun run test
```

### Available Scripts

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server (https://localhost:3000) |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run typecheck` | TypeScript type checking (no emit) |
| `bun run lint` | Lint all files with Biome |
| `bun run lint:file -- "file.ts"` | Lint specific file |
| `bun run lint:fix` | Lint and auto-fix all files |
| `bun run format` | Format all files with Biome |
| `bun run format:file` | Format specific file |
| `bun run check` | Biome check (lint + format) |
| `bun run fix` | Biome check + auto-fix |

### Git Workflow

Follow `.cursor/references/git-integration.md` for commit conventions. Key principles:

- Commit outcomes, not process
- One logical change per commit
- Run tests before committing

### Runtime Package Manager Detection

When any GSD plan, task, or template specifies `npm run`, `npm test`, or similar, you MUST substitute:

| Lockfile Found | Substitution |
|----------------|-------------|
| `bun.lock` | `npm run X` -> `bun X`, `npm test` -> `bun test` |
| `yarn.lock` | `npm run X` -> `yarn X`, `npx X` -> `yarn dlx X` |

---

## 6. Testing Guide

### Test Types

This project uses two test runners:

| Runner | Purpose | Location |
|--------|---------|----------|
| Playwright | E2E, visual regression, integration | `tests/` |
| Vitest | Unit tests, data validation | `unit/`, `tests/data/` |

### Playwright Test Commands

| Command | What It Runs | Approx Time |
|---------|-------------|-------------|
| `bun run test:smoke` | @smoke tags (~6 specs, 46 tests) | ~15-20s |
| `bun run test:area:gameplay` | @area:gameplay | ~5-15s |
| `bun run test:area:input` | @area:input (20 tests) | ~10s |
| `bun run test:area:layout` | @area:layout | ~5-15s |
| `bun run test:area:boss` | @area:boss | ~5-15s |
| `bun run test:area:audio` | @area:audio | ~5-15s |
| `bun run test:visual` | @visual (12 snapshot tests) | ~30-40s |
| `bun run test:slow` | @slow (excluded from CI) | varies |
| `bun run test` | Full suite (excludes @slow, @api-live) | ~30s (88 tests) |
| `bun run test:all` | Vitest + Playwright full | varies |
| `bun run test:changed` | Tests for changed files | varies |

### When to Run What

| Phase | Command |
|-------|---------|
| During coding | `test:area:<domain>` + `test:smoke` if touching critical path |
| Before push | `test:smoke` + impacted areas; add `test:visual` if UI changed |
| Pre-merge CI | Full suite (`bun run test`) |
| Nightly | Full + @slow; optionally `test:live-api` |

### Vitest Commands

| Command | Purpose |
|---------|---------|
| `bun run test:unit` | Run all unit tests |
| `bun run test:unit:watch` | Run unit tests in watch mode |
| `bun run test:data` | Run data validation tests |

### Writing New Tests

- Use `@smoke` for critical user journey checks
- Use `@area:<domain>` for domain-specific tests
- Use `@visual` for snapshot/visual regression tests
- Use `@slow` for timer-heavy or long scenario tests
- Use data attributes (not CSS classes or nth position) for selectors in responsive components
- Wait for specific elements with `.waitFor({ state: "visible" })` instead of generic `page.waitForSelector()`
- Do NOT use `.click({ force: true })` -- use `.dispatchEvent("click")` or regular `.click()`
- Do NOT use `page.mouse.move/down/up` for card drag tests -- use synthetic event dispatch helpers

### Test File Organization

```
tests/
  helpers/          # Test utilities and shared helpers
  utils/            # Test utility functions
  *.spec.ts         # Test spec files
  stage-snapshots.spec.ts-snapshots/  # Visual snapshot baselines
  screenshots/      # Test screenshots
  data/             # Data validation tests (Vitest)
```

---

## 7. Working with AI Agents

### Agent Configuration Files

| File | Scope |
|------|-------|
| `AGENTS.md` | Project-specific agent instructions (workflow, testing, git) |
| `CLAUDE.md` | Global Claude Code rules (memory system, learning, decisions) |

### Available Agent Skills

Located in `.cursor/skills/` and `.agents/skills/`:

| Skill | Purpose |
|-------|---------|
| `webmcp-game` | WebMCP game control tools (10 tools for dev-time game manipulation) |
| `agent-browser` | Browser automation CLI for interactive testing |
| `playwright-mcp-dev` | Playwright MCP tool debugging |

### WebMCP Tools

When the dev server is running, 10 tools are registered via `navigator.modelContext` for direct game control:

| Tool | Purpose |
|------|---------|
| `get_game_state` | Read current game state |
| `get_current_screen` | Get current screen/stage |
| `start_game` | Start a new game |
| `select_personality` | Select AI personality |
| `select_role` | Select role |
| `swipe_card` | Swipe left or right |
| `dismiss_feedback` | Dismiss feedback overlay |
| `answer_boss_question` | Answer boss fight question |
| `advance_boss` | Advance boss fight |
| `restart_game` | Restart the game |

Full reference: `.cursor/skills/webmcp-game/SKILL.md`

**Prefer WebMCP for game logic verification** -- direct React function calls, zero DOM flakiness, structured state. Fall back to DOM tools only for visual verification. Never use WebMCP inside `.spec.ts` files.

### Browser Automation

**agent-browser:**

```bash
# IMPORTANT: Close existing daemon first if running without flag
agent-browser close
agent-browser --ignore-https-errors open https://localhost:3000
agent-browser snapshot -i        # Get interactive elements with refs
agent-browser click @e1          # Click element by ref
agent-browser fill @e2 "text"    # Fill input by ref
```

**playwright-cli:**

```bash
playwright-cli open https://localhost:3000
playwright-cli snapshot          # Get interactive elements (e1, e2, ...)
playwright-cli click e1
playwright-cli fill e2 "text"
playwright-cli close
```

### Workflow Principles for Agents

1. **Plan first** -- enter plan mode for any non-trivial task (3+ steps)
2. **Verify before done** -- never mark complete without proving it works
3. **Capture lessons** -- update `tasks/lessons.md` after any correction
4. **Demand elegance** -- pause and ask if there's a simpler way
5. **Fix autonomously** -- when given a bug report, fix it without asking

---

## 8. Common Pitfalls

### HTTPS and SSL

The dev server uses self-signed SSL (required for audio transcription). Always use `--ignore-https-errors` with browser tools. If the daemon is already running without this flag, close it first:

```bash
agent-browser close
agent-browser --ignore-https-errors open https://localhost:3000
```

### Test Flakiness

| Issue | Cause | Fix |
|-------|-------|-----|
| Card swipe tests fail | CSS animation completion time | Use 500ms+ timeouts |
| Playwright picks up Vitest files | Shared tests/ directory | Use explicit `testIgnore` patterns |
| Drag gesture goes wrong direction | Signed distance (negative=left, positive=right) | Verify sign matches intended direction |
| Lazy image tests timeout | `loading="lazy"` prevents download until in viewport | Scroll into view before checking |

### State and Data

| Issue | Cause | Fix |
|-------|-------|-----|
| Wrong audio/asset plays for card | Card sides swapped during shuffle | Use `authoringFeedbackStem` helper, not raw screen choice |
| Missing fields in WebMCP state | Tool state payload incomplete | Audit all referenced fields when exposing state |
| Stat display inconsistency | Duplicate formatting utilities with different precision | Extract to shared module immediately |
| Death ending mismatch | deathVector doesn't match card violation | Verify semantic match between violation and ending |

### Audio

| Issue | Cause | Fix |
|-------|-------|-----|
| Audio file size test fails | Codec-specific thresholds changed during migration | Recalculate minimum sizes per codec/bitrate |
| Audio doesn't play on DEBRIEF_PAGE_1 | Stage mismatch between effects | Use `DEBRIEF_PAGE_1` with `deathType` check consistently |
| Backdrop-filter broken | Opacity < 1 on parent converts to backdrop root | Use `::before` pseudo-element overlay instead |

### Planning

| Issue | Cause | Fix |
|-------|-------|-----|
| Working on wrong role's cards | Plans written for old 6 roles, not new 10 | Check `03-REVISION-NOTES.md`, use revised plans |
| Using deprecated plan file | Original plan superseded by revised version | Look for `-revised-` suffix in plan filenames |

---

## 9. Where to Find Things

### Documentation

| Document | Location |
|----------|----------|
| Project overview | `.planning/PROJECT.md` |
| Full roadmap | `.planning/ROADMAP.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| Game design | `docs/GAME_DESIGN.md` |
| Testing guide | `docs/TESTING.md` |
| Testing runbook | `tasks/testing-runbook.md` |
| Test taxonomy | `tasks/test-lane-taxonomy.md` |
| CI test lanes | `tasks/ci-test-lanes.md` |
| Lessons learned | `tasks/lessons.md` |
| Contributing | `CONTRIBUTING.md` |
| API docs | `docs/API.md` |
| Agent instructions | `AGENTS.md` |

### Game Content

| Content | Location |
|---------|----------|
| Card decks | `data/cards/` (10 role-specific files) |
| Boss questions | `data/bossQuestions.ts` |
| Roles | `data/roles.ts` |
| Personalities | `data/personalities.ts` |
| Archetypes | `data/archetypes.ts` |
| Death endings | `data/deathEndings.ts` |
| Death vectors | `data/deathVectors.ts` |
| Failure lessons | `data/failureLessons.ts` |
| Image mappings | `data/imageMap.ts` |

### Audio Assets

| Type | Location |
|------|----------|
| Voice files | `public/audio/voices/{personality}/{type}/` |
| Voice subfolders | `archetype/`, `death/`, `feedback/`, `core/` |
| Background music | `public/audio/music/` |
| Sound effects | `public/audio/sfx/` |

### Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-voice.ts` | Generate voice files via Gemini TTS |
| `scripts/generate-images.ts` | Generate images via Gemini |
| `scripts/compress-audio.ts` | Compress audio to Opus/MP3 |
| `scripts/compress-existing-audio.ts` | Batch compress existing audio |
| `scripts/export-card-content-audit.ts` | Export card content audit |
| `scripts/benchmark-tests.ts` | Performance benchmarks |
| `scripts/test-live-api.ts` | Test live API connectivity |
| `scripts/find-slow-test-files.ts` | Identify slow test files |

### Planning

| Resource | Location |
|----------|----------|
| Phase plans | `.planning/phases/{NN-name}/` |
| Research docs | `.planning/research/` |
| Debug logs | `.planning/debug/` |
| Revision notes | `.planning/phases/{NN-name}/*REVISION*.md` |

---

## 10. Suggested First Tasks

### Good Starting Points

1. **Read the game** -- Play through the game yourself. Run `bun run dev`, go through personality select, role select, and swipe a few cards. Understanding the player experience is the fastest way to understand the codebase.

2. **Run the test suite** -- `bun run test:smoke` to verify your setup works, then `bun run test` for the full suite. Read a few test files to understand the testing patterns.

3. **Explore a phase directory** -- Pick a completed phase (Phase 06 Debrief or Phase 16 Ending Variety are good examples) and read through its PLAN.md files to understand how GSD plans map to code changes.

4. **Add a card to an existing deck** -- The simplest code contribution. Pick a role in `data/cards/`, add a new card following the existing pattern, and run `bun run test:data` to validate.

5. **Fix a small bug** -- Check `tasks/todo.md` for open items or look for `TODO`/`FIXME` comments in the codebase.

### Areas to Explore

| Area | Why It's Interesting |
|------|---------------------|
| `hooks/useSwipeGestures.ts` | Custom gesture handling -- core gameplay mechanic |
| `App.tsx` | Main game reducer and state machine |
| `data/cards/` | Game content -- where the writing lives |
| `services/geminiLive.ts` | Real-time streaming audio with Gemini |
| `hooks/useIncidentPressure.ts` | Timer and pressure system |
| `components/game/debrief/` | 3-page debrief flow |
| `tests/stage-snapshots.spec.ts` | Visual regression testing |

### What to Avoid as a Newcomer

- **Phase 08 (Kobayashi Maru Framing)** -- Deferred, no active plans
- **Phase 11 (Settings Integration)** -- Deferred, no active plans
- **Deprecated plan files** -- Any file marked `DEPRECATED` or `DO NOT USE`
- **Old branch work** -- Branches like `gsd/phase-03-no-win-scenario-cards` contain superseded work
- **Audio generation scripts** -- Complex, require API keys and careful setup

---

## Quick Reference

### Essential Commands

```bash
bun run dev                    # Start dev server
bun run typecheck              # Type check (fast)
bun run test:smoke             # Smoke tests (~15s)
bun run test                   # Full test suite
bun run lint                   # Lint all files
bun run check                  # Lint + format check
```

### Essential Files

```
App.tsx                        # Main app + game reducer
types.ts                       # All TypeScript types
.planning/ROADMAP.md           # Phase status and links
AGENTS.md                      # Agent workflow rules
tasks/lessons.md               # Lessons from past mistakes
```

### Key Conventions

- Use `bun`, never `npm`
- Plan before implementing (3+ steps = plan mode)
- Verify before marking done
- Commit outcomes, not process
- Update lessons.md after corrections
- Use data attributes for test selectors
- Prefer WebMCP for game logic, DOM tools for visuals
