# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

<!-- AUTO-MANAGED: project-description -->
## Overview

**Swipe Risk: The Hyperscale Chronicles** — a single-page React card-swiping game about AI/tech ethics. Players choose a role (Finance, Marketing, Management) and AI personality, then swipe through workplace dilemma cards that affect Hype, Heat, and Budget stats. Ends in a boss fight quiz or one of several failure endings.

Key features: gesture-based card swiping, TTS via Gemini 2.5 Flash, multiple endings, Playwright E2E test suite.
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: build-commands -->
## Build & Development Commands

```sh
bun dev                          # Dev server on http://localhost:3000
bun run build                    # Production build
bun run typecheck                # tsc --noEmit (fast type check)
bun run lint                     # Biome lint all files
bun run lint:fix                 # Biome lint --write
bun run check                    # Biome check (lint + format)
bun run fix                      # Biome check --write
bun run test                     # All Playwright tests
bun run test:smoke               # Fast critical checks (~15s, @smoke tag)
bun run test:area:gameplay       # Gameplay area tests
bun run test:area:input          # Input area tests
bun run test:area:layout         # Layout area tests
bun run test:area:boss           # Boss fight tests
bun run test:area:audio          # Audio tests
bun run test:unit                # Vitest unit tests (unit/ dir)
bun run test:unit:watch          # Vitest watch mode
```
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
App.tsx                    # Root — mounts game, wires hooks to components
index.tsx                  # Entry point
types.ts                   # All shared types (GameState, Card, GameStage, etc.)

components/
  LayoutShell.tsx           # Responsive container wrapper
  game/                     # All game screen components
    IntroScreen, PersonalitySelect, RoleSelect, InitializingScreen
    GameScreen, CardStack, GameHUD, FeedbackOverlay
    BossFight, GameOver, SummaryScreen, RoastTerminal, Taskbar

hooks/
  useGameState.ts           # Core useReducer state machine
  useSwipeGestures.ts       # Touch/mouse gesture handling
  useVoicePlayback.ts       # TTS playback state
  useBossFight.ts           # Boss quiz logic
  useRoast.ts               # AI roast commentary
  useSpeechRecognition.ts   # Voice input

services/
  geminiService.ts          # Gemini 2.5 TTS API
  geminiLive.ts             # Live API integration
  pressureAudio.ts          # Ambient pressure audio
  roastService.ts           # AI roast generation
  voicePlayback.ts          # Audio playback utilities

data/
  cards/                    # Role-specific card decks
  personalities.ts          # AI companion definitions
  roles.ts                  # Role definitions
  deathEndings.ts           # Failure ending content
  bossQuestions.ts          # Boss fight quiz data

lib/
  deck.ts                   # Deck resolution with branching logic

utils/
  haptic.ts                 # Haptic feedback utilities
```

**State flow**: `useGameState` (useReducer) → dispatches actions → components re-render. Stage transitions validated against `STAGE_TRANSITIONS` map.
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

- **Components**: PascalCase files, `.tsx` extension, `components/game/` for game screens
- **Hooks**: `use` prefix, camelCase, one concern per hook (`useSwipeGestures`, `useVoicePlayback`)
- **Imports**: `import type` for type-only imports; `@/` alias for root-relative paths
- **Formatting**: Biome — tabs, double quotes in TSX, no trailing semicolons enforced by linter
- **Types**: Centralized in `types.ts`; enums for `GameStage`, `DeathType`, `RoleType`, `PersonalityType`
- **Testing**: Playwright E2E tagged with `@smoke`, `@area:*`, `@visual`, `@slow`; Vitest for unit tests in `unit/`
- **Linting**: Run `bun run check` before committing; husky + lint-staged auto-runs Biome on staged files
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: patterns -->
## Detected Patterns

- **Finite state machine**: `GameStage` enum + `STAGE_TRANSITIONS` map validates all stage changes; illegal transitions are blocked
- **Custom hooks as controllers**: Each major subsystem (swipe, voice, boss fight, roast) is a custom hook; `App.tsx` composes them
- **Barrel exports**: `components/game/index.ts`, `data/index.ts`, `hooks/index.ts` — import from directory, not individual files
- **Role-scoped content**: Card decks, death endings, and boss questions are keyed by `RoleType` — add new content by extending the role map
- **Personality-scoped feedback**: Each `ChoiceOutcome` contains a `feedback: Record<PersonalityType, string>` — all three personalities must have entries
- **Env-gated features**: `VITE_ENABLE_SPEECH=false` disables TTS; `GEMINI_API_KEY` injected at build time via Vite define
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: git-insights -->
## Gitignored Paths
- `.claude/auto-memory/dirty-files` — transient hook-managed file, never commit
- `test-results/`, `playwright-report/`, `reports/` — test and report artifacts, never commit

## Post-Commit Hook System
- `.husky/post-commit` — runs two background scripts after every commit (detached, never blocks workflow)
- `~/.claude/hooks/claude-analyze.sh` — diffs `HEAD~1..HEAD`, extracts lessons via Claude CLI (haiku), appends to `tasks/lessons.md`
- `~/.claude/hooks/claude-simplify.sh` — reviews committed `.ts/.tsx` files for quality issues via Claude CLI (haiku), writes to `.planning/logs/simplify-latest.md`
- Both scripts live globally (work in any repo); logs go to `.planning/logs/`
<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
See AGENTS.md for all behavioral rules, workflow orchestration, and core principles.
Those sections are human-owned and never auto-updated.

## Additional Test Commands

```sh
bun run test:data            # Vitest data-layer validation tests (tests/data/)
bun run test:visual          # Playwright visual regression tests (@visual tag)
bun run test:changed         # Run tests for changed files only (scripts/test-changed.ts)
bun run test:file -- "glob"  # Run specific Playwright test file(s) by glob
```

## Commit Message Format

Format: `{type}({phase}-{plan}): {description}`

Types: `feat`, `fix`, `test`, `refactor`, `perf`, `chore`, `docs`

Example: `feat(03-01): add no-win scenario card deck`

One commit per completed task. Plan completion gets a separate `docs(phase-plan): complete [plan-name] plan` metadata commit. See `.cursor/references/git-integration.md` for full reference.
<!-- END MANUAL -->
