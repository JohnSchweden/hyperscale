# Codebase Structure

**Analysis Date:** 2026-04-03

## Directory Layout

```
swiperisk/
├── Root Files
│   ├── index.tsx              # React entry point
│   ├── index.html             # HTML template
│   ├── App.tsx                # Root component (stage router)
│   ├── types.ts               # All shared TypeScript definitions
│   └── styles.css             # Global CSS (minimal, mostly Tailwind)
│
├── components/                # React components
│   ├── index.ts               # (Not exported; components in subdirs)
│   ├── LayoutShell.tsx        # Responsive layout wrapper
│   ├── ImageWithFallback.tsx  # Image component with fallback
│   ├── game/                  # Game screen components
│   │   ├── index.ts           # Barrel export of game components
│   │   ├── IntroScreen.tsx    # Welcome/start screen
│   │   ├── PersonalitySelect.tsx
│   │   ├── RoleSelect.tsx
│   │   ├── InitializingScreen.tsx
│   │   ├── GameScreen.tsx     # Main gameplay orchestration
│   │   ├── CardStack.tsx      # Swipeable card stack component
│   │   ├── GameHUD.tsx        # Hype/heat/budget display
│   │   ├── FeedbackOverlay.tsx # Modal overlay for choice consequences
│   │   ├── RoastTerminal.tsx  # AI roast chat input
│   │   ├── Taskbar.tsx        # Windows 95-style status bar
│   │   ├── PressureCueController.tsx
│   │   ├── StarfieldBackground.tsx # Starfield animation + BGM UI
│   │   ├── BossFight.tsx      # Boss quiz interface
│   │   ├── debrief/           # Debrief page components
│   │   │   ├── DebriefContainer.tsx
│   │   │   ├── DebriefPage1Collapse.tsx
│   │   │   ├── DebriefPage2AuditTrail.tsx
│   │   │   └── DebriefPage3Verdict.tsx
│   │   └── selectionStageStyles.ts
│   └── dev/
│       └── WebMCPToolsProvider.tsx # Dev-only MCP tools (lazy-loaded)
│
├── hooks/                     # Custom React hooks
│   ├── index.ts               # Barrel export
│   ├── useGameState.ts        # Core state machine (useReducer)
│   ├── useGameState/          # Game state submodules
│   │   ├── index.ts
│   │   ├── deathResolver.ts   # Death type determination
│   │   └── hydration.ts       # State persistence/loading
│   ├── useSwipeGestures.ts    # Touch/mouse gesture tracking
│   ├── useVoicePlayback.ts    # TTS audio playback management
│   ├── useBossFight.ts        # Boss quiz state machine
│   ├── useRoast.ts            # AI roast generation
│   ├── useIncidentPressure.ts # Countdown + urgency logic
│   ├── useBackgroundMusic.ts  # BGM playlist + volume control
│   ├── useCountdown.ts        # Generic countdown timer
│   ├── useClock.ts            # Current time display
│   ├── useDebrief.ts          # Debrief navigation + archetype calc
│   ├── useStageReady.ts       # Ghost-click prevention
│   ├── useArchetype.ts        # (Unused; logic in useDebrief)
│   ├── useEmailCapture.ts     # V2 waitlist email capture
│   ├── useUnlockedEndings.ts
│   ├── useLiveAPISpeechRecognition.ts
│   ├── usePressureAudio.ts
│   ├── useSpeechRecognition.ts
│   └── useWebMCPTools.ts      # Dev: WebMCP tool registration
│
├── services/                  # Business logic & API wrappers
│   ├── geminiService.ts       # Gemini 2.5 TTS API
│   ├── geminiLive.ts          # Live API integration
│   ├── roastService.ts        # AI roast generation
│   ├── voicePlayback.ts       # Web Audio API wrapper
│   ├── pressureAudio.ts       # Countdown audio + context
│   ├── kirkAudio.ts           # Easter egg audio effects
│   ├── radioEffect.ts         # Audio processing
│   └── audioUtils.ts          # Audio utilities
│
├── lib/                       # Pure algorithms & utilities
│   ├── deck.ts                # Shuffle (Fisher-Yates) + branching
│   ├── deck.test.ts           # Deck algorithm tests
│   ├── feedbackAudioChoice.ts # Feedback audio path resolution
│   ├── formatting.ts          # String formatting
│   ├── slugify.ts             # URL slug generation
│   ├── safeCoercion.ts        # Type coercion utilities
│   ├── audio.ts               # Audio utility functions
│   └── gif-overlay.ts         # GIF overlay rendering
│
├── utils/                     # Frontend utilities
│   ├── haptic.ts              # Haptic feedback (vibration)
│   ├── kirkText.ts            # Kirk Easter Egg text helpers
│   └── linkedin-share.ts      # Social sharing utilities
│
├── data/                      # Immutable game content
│   ├── index.ts               # Barrel export (all data exports)
│   ├── cards/                 # Role-specific card decks
│   │   ├── index.ts           # Barrel export + ROLE_CARDS map
│   │   ├── manager.ts         # MANAGEMENT_CARDS deck
│   │   ├── finance.ts         # FINANCE_CARDS deck
│   │   ├── marketing.ts       # MARKETING_CARDS deck
│   │   ├── hr.ts              # HR_CARDS deck
│   │   ├── dev.ts             # DEVELOPMENT_CARDS deck
│   │   ├── cleaning.ts        # CLEANING_CARDS deck
│   │   └── templates/         # Card authoring templates
│   ├── archetypes.ts          # Archetype definitions + calculation
│   ├── bossQuestions.ts       # Boss fight quiz questions
│   ├── bgmPlaylist.ts         # Background music tracks
│   ├── choiceLabels.ts        # Enum-to-label mappings
│   ├── deathEndings.ts        # Failure ending copy
│   ├── deathVectors.ts        # Death type frequency accumulation
│   ├── deckDeathTypes.ts      # Deck-specific death types
│   ├── failureLessons.ts      # Failure screen commentary
│   ├── incidents.ts           # Real-world incident references
│   ├── kirkCards.ts           # Kirk Easter Egg cards
│   ├── personalities.ts       # AI personality definitions
│   ├── pressureScenarios.ts   # Card-level urgency config
│   ├── roles.ts               # Role definitions + icons
│   ├── sources.ts             # Message source enums
│   ├── violations.ts          # Violation type mappings
│   ├── voiceUiCopy.ts         # Voice UI hint text
│   ├── imageMap.ts            # Image path resolution
│   └── (templates, branch injections)
│
├── contexts/                  # React context (if any)
│   └── (currently empty)
│
├── api/                       # Vercel serverless API routes
│   ├── roast.ts               # POST /api/roast (AI roast generation)
│   └── speak.ts               # POST /api/speak (TTS synthesis)
│
├── tests/                     # Playwright E2E tests
│   ├── *.spec.ts              # Test suites
│   ├── audio-archive-baseline.spec.ts
│   ├── image-*.spec.ts        # Image-related tests
│   ├── snap-back.spec.ts
│   ├── swipe-interactions.spec.ts
│   ├── kirk-easter-egg.spec.ts
│   ├── summary-debrief.spec.ts
│   └── helpers/               # Test utilities
│
├── unit/                      # Vitest unit tests
│   ├── archetypes.spec.ts
│   ├── [...other unit tests]
│
├── scripts/                   # Dev/build scripts
│   ├── generate-all.ts        # Master content generator
│   ├── generate-feedback.ts
│   ├── generate-voice.ts
│   └── test-changed.ts        # Run tests for changed files
│
├── public/                    # Static assets (served as-is)
│   ├── audio/                 # Audio files
│   │   ├── bgm/               # Background music tracks
│   │   ├── voices/            # Pre-recorded personality voiceovers
│   │   ├── effects/           # Sound effects
│   │   └── pressure/          # Countdown audio
│   ├── images/                # Card/archetype images
│   │   ├── incidents/
│   │   ├── outcomes/
│   │   ├── archetypes/
│   │   └── deaths/
│   └── (other assets)
│
├── Configuration Files
│   ├── package.json           # Dependencies, scripts, metadata
│   ├── bun.lock               # Lockfile (bun package manager)
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite build config
│   ├── vitest.config.ts       # Vitest unit test config
│   ├── vitest.setup.ts        # Vitest setup
│   ├── playwright.config.ts   # Playwright E2E config
│   ├── biome.json             # Biome linter/formatter config
│   ├── .eslintrc              # (Legacy; biome now used)
│   ├── .prettierrc             # (Legacy; biome now used)
│   └── vercel.json            # Vercel deployment config
│
├── Git/Repo Config
│   ├── .git/                  # Git repository
│   ├── .gitignore             # Ignored paths
│   ├── .husky/                # Git hooks (lint-staged, post-commit)
│   ├── .github/               # GitHub workflows/templates
│   └── AGENTS.md              # Agent (Claude/Cursor) instructions
│
 ├── Planning/Docs
 │   ├── .planning/codebase/    # This codebase analysis
 │   │   ├── ARCHITECTURE.md
 │   │   ├── STRUCTURE.md       # This file
 │   │   ├── CONVENTIONS.md
 │   │   ├── TESTING.md
 │   │   ├── STACK.md
 │   │   ├── INTEGRATIONS.md
 │   │   └── CONCERNS.md
 │   ├── README.md              # Project overview
 │   ├── docs/                  # Documentation directory
 │   │   ├── ARCHITECTURE.md    # Technical architecture
 │   │   ├── GAME_DESIGN.md     # Game mechanics and content design
 │   │   ├── TESTING.md         # Testing strategy and guidelines
 │   │   ├── API.md             # API documentation for services and components
 │   │   ├── CONTRIBUTING.md    # Contributor guide
 │   │   ├── ONBOARDING.md      # Developer onboarding guide
 │   │   ├── DEPLOYMENT.md      # Deployment and operations guide
 │   │   └── (more...)
 │   └── CONTRIBUTING.md        # Contributor guide
│
└── Ignores (not committed)
    ├── node_modules/          # Dependencies
    ├── dist/                  # Build output
    ├── test-results/          # Test artifacts
    ├── playwright-report/     # Playwright HTML report
    ├── .env, .env.local       # Secrets
    └── (other gitignored paths)
```

## Directory Purposes

**components/:**
- Purpose: React UI components organized by screen/feature
- Exports: Barrel exports (`index.ts`) for clean imports
- Naming: PascalCase files, `.tsx` extension
- Nested: `game/` for screen components, `dev/` for dev-only tools, `debrief/` for debrief pages

**hooks/:**
- Purpose: Custom React hooks encapsulating domain logic
- Exports: Barrel export at `hooks/index.ts`
- Naming: `use[Feature].ts` (e.g., `useGameState.ts`, `useSwipeGestures.ts`)
- Submodules: `useGameState/` contains death resolver and hydration logic

**services/:**
- Purpose: API wrappers, audio playback, service integrations
- Examples: Gemini TTS, Web Audio API, voice synthesis
- No React hooks here (utilities only)

**lib/:**
- Purpose: Pure algorithms and utilities (no side effects, testable)
- Examples: Deck shuffling, branching injection, slug generation
- Includes tests (`deck.test.ts`)

**data/:**
- Purpose: Immutable game content (card decks, metadata, configurations)
- Organization: `cards/` for role decks, root level for metadata
- Exports: Barrel export at `data/index.ts` (single import point)
- Naming: Enum-based keys (RoleType, PersonalityType, DeathType)

**tests/:**
- Purpose: Playwright E2E tests
- Organization: One `.spec.ts` file per feature/area
- Tagging: `@smoke` for critical tests, `@area:*` for domain, `@visual` for visual regression
- Run: `bun run test`, `bun run test:smoke`, `bun run test:file`

**unit/:**
- Purpose: Vitest unit tests for pure functions
- Organization: Mirrored to source structure
- Examples: `archetypes.spec.ts` tests `data/archetypes.ts`

**scripts/:**
- Purpose: Dev/build automation
- Examples: Content generators, test runners
- Run: `bun run [script-name]`

**public/:**
- Purpose: Static assets served as-is by Vite
- Organization: Subdirs by asset type (audio, images)
- Subdir purposes:
  - `audio/bgm/` - Background music tracks (mp3/wav)
  - `audio/voices/` - Personality voice files (wav)
  - `audio/pressure/` - Countdown beeps
  - `audio/effects/` - Sound effects (Kirk audio, etc.)
  - `images/incidents/` - Card scenario images (role-scoped)
  - `images/outcomes/` - Outcome/consequence images
  - `images/archetypes/` - Archetype badge images (7 archetypes)
  - `images/deaths/` - Death ending screen images

## Key File Locations

**Entry Points:**
- `index.tsx` - React app entry (mounts `<App />`)
- `App.tsx` - Root component (stage router, hook composition)
- `index.html` - HTML template with `<div id="root">`

**Configuration:**
- `package.json` - Dependencies, scripts, build config
- `vite.config.ts` - Vite build + dev server
- `tsconfig.json` - TypeScript compiler options
- `biome.json` - Linter/formatter config
- `playwright.config.ts` - E2E test runner
- `vitest.config.ts` - Unit test runner

**Core Logic:**
- `App.tsx` - Stage routing, hook orchestration
- `hooks/useGameState.ts` - State machine (useReducer)
- `hooks/useSwipeGestures.ts` - Gesture handling
- `components/game/GameScreen.tsx` - Main gameplay view
- `components/game/CardStack.tsx` - Card swipe interaction

**State & Types:**
- `types.ts` - All TypeScript definitions (GameState, Card, GameStage, enums)
- `hooks/useGameState/` - State machine submodules

**Data & Content:**
- `data/cards/` - Role-specific card decks (6 roles)
- `data/index.ts` - Barrel export (import from here)
- `data/archetypes.ts` - Archetype system
- `data/deathEndings.ts` - Failure outcomes
- `data/pressureScenarios.ts` - Urgency config (keyed by card ID)

**Testing:**
- `tests/` - Playwright E2E tests
- `unit/` - Vitest unit tests
- `playwright.config.ts` - E2E config
- `vitest.config.ts` - Unit test config

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `GameScreen.tsx`, `CardStack.tsx`)
- Hooks: `use` prefix + camelCase (e.g., `useGameState.ts`, `useSwipeGestures.ts`)
- Utilities: camelCase (e.g., `haptic.ts`, `deck.ts`)
- Data files: camelCase (e.g., `bossQuestions.ts`, `archetypes.ts`)
- Tests: Same as source + `.spec.ts` suffix (e.g., `deck.spec.ts`)

**Directories:**
- Components: PascalCase or lowercase dash-separated (e.g., `game/`, `debrief/`)
- Hooks: lowercase (e.g., `hooks/`)
- Services: lowercase (e.g., `services/`)
- Data: lowercase (e.g., `data/cards/`)

**Exports:**
- Barrel exports at `index.ts` in each module (e.g., `components/game/index.ts`)
- Import from directory, not individual files: `import { CardStack } from "@/components/game"`

## Where to Add New Code

**New Feature/Card Deck:**
- Card data: `data/cards/[role].ts` (add to existing role deck or create new deck)
- Death ending: Add to `data/deathEndings.ts`
- Boss question: Add to `data/bossQuestions.ts`
- Archetype: Add to `data/archetypes.ts` (if new archetype type)
- Tests: `tests/[feature].spec.ts` or existing test file if related

**New Component/Screen:**
- Implementation: `components/game/[ComponentName].tsx`
- Export: Add to `components/game/index.ts` barrel
- Route: Add case in `App.tsx` switch statement (if new stage)
- Types: Add to `types.ts` if needed (new enum, interface, etc.)
- Tests: `tests/[feature].spec.ts`

**New Hook:**
- Implementation: `hooks/use[Feature].ts`
- Export: Add to `hooks/index.ts` barrel
- Usage: Call from `App.tsx` or other hooks
- Tests: `unit/[feature].spec.ts`

**New Utility/Service:**
- Utility function: `lib/[name].ts` (if pure) or `services/[name].ts` (if stateful/API)
- Tests: `lib/[name].test.ts` (unit tests)

**Styling:**
- Classes: Tailwind CSS (no custom CSS unless necessary)
- Custom CSS: `styles.css` (global only)
- Per-component: Inline Tailwind classNames (no separate CSS files)

## Special Directories

**contexts/:**
- Purpose: React context API usage
- Current: Empty (state managed via useReducer in `useGameState.ts`)
- Usage: Add if cross-cutting concern needs context

**api/:**
- Purpose: Vercel serverless functions (deployed to `/api/*`)
- Organization: One function per file
- Examples: `roast.ts` (→ `/api/roast`), `speak.ts` (→ `/api/speak`)

**.planning/codebase/:**
- Purpose: Project analysis documents (ARCHITECTURE.md, CONVENTIONS.md, etc.)
- Generated: By GSD codebase mapper
- Committed: Yes (consumed by `/gsd:plan-phase` and `/gsd:execute-phase`)

**.husky/**:
- Purpose: Git hooks
- Setup: `npm install husky` + `npx husky install`
- Hooks: `pre-commit` (lint-staged), `post-commit` (optional analysis)

**.claude/, .cursor/, .agents/**:
- Purpose: IDE/agent configuration
- Not committed: Some files gitignored
- Usage: For local development setup

**dist/, test-results/, playwright-report/**:
- Purpose: Build and test artifacts
- Gitignored: Yes
- Auto-generated: On build/test runs

## Import Paths

**Alias:**
- `@/` → Root of `src/` (configured in `tsconfig.json` and `vite.config.ts`)
- Usage: `import { useGameState } from "@/hooks"`

**Barrel Exports:**
- `@/components/game` → All game screen components
- `@/hooks` → All custom hooks
- `@/data` → All game content
- `@/lib` → Pure utilities
- `@/services` → API wrappers

**Relative imports:**
- Avoid; use aliases for clarity and refactoring safety
- Exception: Sibling modules in same directory may use relative imports

## Build & Output

**Dev Server:**
- Command: `bun dev`
- URL: `http://localhost:3000`
- Hot reload: On file changes

**Production Build:**
- Command: `bun run build`
- Output: `dist/` directory
- Artifacts: Single-page app (index.html + bundled JS/CSS)

**Type Checking:**
- Command: `bun run typecheck`
- Tool: `tsc --noEmit`

**Linting/Formatting:**
- Command: `bun run check` (check both) or `bun run lint` (lint only)
- Tool: Biome (replaces eslint + prettier)
- Config: `biome.json`

**Testing:**
- E2E: `bun run test` (Playwright)
- Unit: `bun run test:unit` (Vitest)
- Smoke: `bun run test:smoke` (critical tests, ~15s)
