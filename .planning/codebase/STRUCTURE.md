# Codebase Structure

**Analysis Date:** 2026-03-01

## Directory Layout

```
/Users/yevgenschweden/swiperisk/
├── App.tsx                    # Main application (1499 lines)
├── index.tsx                  # Entry point
├── types.ts                   # Domain types and enums
├── constants.ts               # Static game content (518 lines)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Build config
├── playwright.config.ts       # Test config
├── index.html                 # HTML template
├── .env / .env.local          # Environment variables
├── components/
│   └── LayoutShell.tsx        # Responsive layout wrapper
├── services/
│   ├── geminiService.ts       # AI integration (TTS + roast)
│   └── voicePlayback.ts       # Audio utilities
├── tests/
│   ├── helpers/
│   │   ├── selectors.ts       # Centralized test selectors
│   │   └── navigation.ts      # Test navigation helpers
│   ├── *.spec.ts              # Playwright tests
│   └── stage-snapshots.spec.ts-snapshots/  # Visual snapshots
├── scripts/
│   ├── generate-all.ts        # Generate all content
│   ├── generate-feedback.ts   # Generate feedback text
│   └── generate-voice.ts     # Generate voice audio
└── public/
    └── audio/                 # Static audio assets
```

## Directory Purposes

**Root Level:**
- Purpose: Core application files and configuration
- Contains: Entry points, main components, types, constants, config files

**components/:**
- Purpose: Reusable React components
- Contains: LayoutShell.tsx (only component currently)
- Key files: `LayoutShell.tsx` - responsive wrapper handling desktop/mobile layouts

**services/:**
- Purpose: External service integrations
- Contains: Gemini AI service, voice playback utilities
- Key files: `geminiService.ts` (TTS + roast), `voicePlayback.ts` (audio)

**tests/:**
- Purpose: Playwright end-to-end tests
- Contains: Test specs, helpers, visual snapshots
- Key files: `helpers/selectors.ts`, `helpers/navigation.ts`

**scripts/:**
- Purpose: Build/generation scripts for content
- Contains: TypeScript scripts for generating game content
- Key files: `generate-all.ts`, `generate-feedback.ts`, `generate-voice.ts`

**public/:**
- Purpose: Static assets served directly
- Contains: Audio files (generated voice assets)
- Key files: `audio/` directory

## Key File Locations

**Entry Points:**
- `index.tsx`: React DOM mount, creates root and renders App
- `App.tsx`: Main game component with all stages

**Configuration:**
- `package.json`: Dependencies (React 19, Google GenAI, Playwright, Vite)
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `playwright.config.ts`: Playwright test configuration
- `.env.local`: Environment variables (API keys)

**Core Logic:**
- `App.tsx`: Game state machine, all UI rendering, swipe gestures
- `types.ts`: TypeScript interfaces and enums
- `constants.ts`: Static game content (cards, personalities, questions)

**Testing:**
- `tests/helpers/selectors.ts`: Centralized data-testid selectors
- `tests/helpers/navigation.ts`: navigateToPlaying helper
- `tests/*.spec.ts`: Individual test files

## Naming Conventions

**Files:**
- Components: PascalCase (LayoutShell.tsx, App.tsx)
- Services: camelCase (geminiService.ts, voicePlayback.ts)
- Types: PascalCase (types.ts)
- Constants: camelCase (constants.ts)
- Tests: kebab-case (*.spec.ts)

**Directories:**
- Lowercase with hyphens for compound names (components, services, tests, scripts, public)

**Functions:**
- camelCase: getRoast, loadVoice, navigateToPlaying

**Types/Enums:**
- PascalCase: GameStage, PersonalityType, RoleType, Card

## Where to Add New Code

**New Feature:**
- Primary code: Add to `App.tsx` as new render function or extend existing
- Tests: Add to `tests/` directory following *.spec.ts pattern

**New Component/Module:**
- Implementation: Create in `components/` (for UI) or `services/` (for logic)
- Example: New stage renderer → add to App.tsx, call from renderStage()

**Utilities:**
- Shared helpers: Add to relevant service file or create new service file
- Test helpers: Add to `tests/helpers/`

**Constants/Data:**
- Game content: Add to `constants.ts` in appropriate record
- Types: Add to `types.ts`

## Special Directories

**tests/stage-snapshots.spec.ts-snapshots/:**
- Purpose: Visual regression test snapshots
- Generated: Yes (by Playwright)
- Committed: Yes (version controlled for comparison)

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (by package manager)
- Committed: No (.gitignore)

**dist/:**
- Purpose: Built production files
- Generated: Yes (by Vite)
- Committed: No (.gitignore)

---

*Structure analysis: 2026-03-01*
