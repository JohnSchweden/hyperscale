# SwipeRisk Project Structure

> Complete directory and file organization reference

## Table of Contents

- [Directory Overview](#directory-overview)
- [Directory Tree](#directory-tree)
- [Source Files](#source-files)
- [Component Organization](#component-organization)
- [Hooks Organization](#hooks-organization)
- [Services Layer](#services-layer)
- [API Routes](#api-routes)
- [Testing Structure](#testing-structure)
- [Public Assets](#public-assets)
- [Configuration Files](#configuration-files)
- [Scripts & Tools](#scripts--tools)

---

## Directory Overview

```
swiperisk/
├── Root Config & Entry Points
│   ├── index.tsx          # React application entry
│   ├── App.tsx            # Root component with stage routing
│   ├── types.ts           # Shared TypeScript definitions
│   └── constants.ts       # Game data (cards, personalities, etc.)
│
├── components/            # React components
│   ├── LayoutShell.tsx    # Responsive layout wrapper
│   └── game/              # Game stage components
│
├── hooks/                 # Custom React hooks
│   ├── index.ts           # Barrel export
│   └── use[Name].ts       # Individual hooks
│
├── services/              # Business logic & external APIs
│   ├── geminiService.ts   # Google Gemini integration
│   └── voicePlayback.ts   # Audio playback management
│
├── api/                   # Vercel serverless functions
│   ├── roast.ts           # /api/roast endpoint
│   └── speak.ts           # /api/speak endpoint
│
├── tests/                 # Playwright E2E tests
│   ├── *.spec.ts          # Test suites
│   └── helpers/           # Test utilities
│
├── unit/                  # Unit tests
│   └── *.spec.ts          # Jest/Vitest unit tests
│
├── scripts/               # Development utilities
│   ├── generate-all.ts    # Master content generator
│   ├── generate-feedback.ts
│   └── generate-voice.ts
│
├── public/                # Static assets
│   └── audio/voices/      # Pre-recorded voice files
│
└── Configuration Files
    ├── package.json       # Dependencies & scripts
    ├── tsconfig.json      # TypeScript configuration
    ├── vite.config.ts     # Build tool configuration
    └── playwright.config.ts # Test runner config
```

---

## Directory Tree

```
swiperisk/
│
├── .agents/                    # AI agent configurations
│   └── (agent instructions)
│
├── .claude/                    # Claude-specific settings
│   └── (claude config)
│
├── .cursor/                    # Cursor IDE settings
│   └── references/
│       └── git-integration.md
│
├── .planning/                  # Project planning docs
│   └── codebase/
│       ├── ARCHITECTURE.md     # This document
│       ├── INTEGRATIONS.md     # External service docs
│       ├── STACK.md            # Tech stack reference
│       ├── STRUCTURE.md        # This document
│       └── (other planning docs)
│
├── api/                        # Vercel API routes
│   ├── roast.ts                # POST /api/roast - AI roast generation
│   └── speak.ts                # POST /api/speak - TTS synthesis
│
├── components/                 # React components
│   ├── LayoutShell.tsx         # Responsive layout wrapper
│   └── game/                   # Game stage components
│       ├── index.ts            # Barrel export
│       ├── BossFight.tsx       # Boss quiz stage
│       ├── CardStack.tsx       # Swipeable cards
│       ├── FeedbackOverlay.tsx # Choice feedback modal
│       ├── GameHUD.tsx         # Metrics display
│       ├── GameOver.tsx        # Death screen
│       ├── GameScreen.tsx      # Main gameplay stage
│       ├── InitializingScreen.tsx # Countdown stage
│       ├── IntroScreen.tsx     # Entry screen
│       ├── PersonalitySelect.tsx # Personality choice
│       ├── RoleSelect.tsx      # Role choice
│       ├── RoastTerminal.tsx   # AI chat input
│       ├── SummaryScreen.tsx   # Victory screen
│       └── Taskbar.tsx         # Status bar
│
├── hooks/                      # Custom React hooks
│   ├── index.ts                # Barrel export
│   ├── useBossFight.ts         # Boss fight state mgmt
│   ├── useClock.ts             # Real-time clock
│   ├── useCountdown.ts         # Countdown timer
│   ├── useGameState.ts         # Core game state reducer
│   ├── useRoast.ts             # AI roast feature
│   ├── useStageReady.ts        # Click debouncing
│   ├── useSwipeGestures.ts     # Touch/mouse gestures
│   └── useVoicePlayback.ts     # Voice audio management
│
├── public/                     # Static assets
│   └── audio/
│       └── voices/
│           ├── lovebomber/     # HYPE-BRO voice files
│           │   ├── failure.wav
│           │   ├── onboarding.wav
│           │   └── victory.wav
│           ├── roaster/        # V.E.R.A. voice files
│           │   ├── failure.wav
│           │   ├── feedback_debug.wav
│           │   ├── feedback_ignore.wav
│           │   ├── feedback_install.wav
│           │   ├── feedback_paste.wav
│           │   ├── onboarding.wav
│           │   └── victory.wav
│           └── zenmaster/      # BAMBOO voice files
│               ├── failure.wav
│               ├── onboarding.wav
│               └── victory.wav
│
├── scripts/                    # Development utilities
│   ├── generate-all.ts         # Master generator script
│   ├── generate-feedback.ts    # Feedback text generator
│   ├── generate-voice.ts       # Voice line script
│   └── local-api.ts            # Local dev API server
│
├── services/                   # Business logic layer
│   ├── geminiService.ts        # Gemini API client
│   └── voicePlayback.ts        # Audio playback service
│
├── tasks/                      # Task tracking
│   ├── lessons.md              # Learned lessons
│   └── todo.md                 # Active tasks
│
├── test-results/               # Playwright output
│   └── .last-run.json          # Last test run metadata
│
├── tests/                      # E2E test suites
│   ├── button-highlight.spec.ts
│   ├── drag-tracking.spec.ts
│   ├── exit-animation.spec.ts
│   ├── layout-overlay-touch.spec.ts
│   ├── mobile-width.spec.ts
│   ├── roast-console.spec.ts
│   ├── snap-back.spec.ts
│   ├── stage-snapshots.spec.ts
│   ├── swipe-consistency.spec.ts
│   ├── swipe-interactions.spec.ts
│   ├── helpers/
│   │   ├── navigation.ts       # Test navigation utils
│   │   └── selectors.ts        # Test selectors
│   └── stage-snapshots.spec.ts-snapshots/  # Visual regression
│       ├── boss-fight-*.png
│       ├── feedback-overlay-*.png
│       ├── game-over-*.png
│       ├── initializing-*.png
│       ├── intro-*.png
│       ├── personality-select-*.png
│       ├── playing-*.png
│       ├── role-select-*.png
│       └── summary-*.png
│
├── unit/                       # Unit tests
│   └── voicePlayback.spec.ts   # Voice service tests
│
├── App.tsx                     # Root component
├── constants.ts                # Game data constants
├── index.html                  # HTML entry point
├── index.tsx                   # React entry point
├── metadata.json               # Project metadata
├── types.ts                    # TypeScript definitions
│
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── .kilocodemodes              # KiloCode mode config
│
├── AGENTS.md                   # Agent instructions
├── API.md                      # API documentation
├── ARCHITECTURE.md             # Architecture doc
├── CLAUDE.md                   # Claude instructions
├── CONTRIBUTING.md             # Contribution guidelines
├── GAME_DESIGN.md              # Game design doc
├── README.md                   # Project readme
├── STACK.md                    # Tech stack doc
├── TESTING.md                  # Testing documentation
│
├── bun.lock                    # Bun lockfile
├── lighthouse-report*.html     # Lighthouse reports
├── lighthouse-report*.json     # Lighthouse data
├── package-lock.json           # NPM lockfile
├── package.json                # Package manifest
├── playwright.config.ts        # Playwright config
├── tsconfig.json               # TypeScript config
└── vite.config.ts              # Vite config
```

---

## Source Files

### Entry Points

| File | Lines | Purpose |
|------|-------|---------|
| [`index.html`](index.html:1) | ~450 | HTML shell with font preloads, meta tags |
| [`index.tsx`](index.tsx:1) | ~15 | React root mounting |
| [`App.tsx`](App.tsx:1) | ~350 | Root component, stage routing, state orchestration |

### Core Definitions

| File | Lines | Purpose |
|------|-------|---------|
| [`types.ts`](types.ts:1) | ~100 | Enums, interfaces, type definitions |
| [`constants.ts`](constants.ts:1) | ~600 | Game data: cards, personalities, death endings |

---

## Component Organization

### Component Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| **PascalCase** | `GameScreen.tsx` | All component files |
| **Screen suffix** | `IntroScreen.tsx` | Full-stage components |
| **Noun descriptors** | `CardStack.tsx` | UI building blocks |
| **index.ts barrel** | `components/game/index.ts` | Public API exports |

### Component Categories

#### 1. Screen Components (Stage Renderers)
Located in `components/game/`, each maps to a [`GameStage`](types.ts:56):

| Component | Stage | Purpose |
|-----------|-------|---------|
| [`IntroScreen.tsx`](components/game/IntroScreen.tsx:1) | `INTRO` | Landing page with CTA |
| [`PersonalitySelect.tsx`](components/game/PersonalitySelect.tsx:1) | `PERSONALITY_SELECT` | AI personality choice |
| [`RoleSelect.tsx`](components/game/RoleSelect.tsx:1) | `ROLE_SELECT` | Corporate role choice |
| [`InitializingScreen.tsx`](components/game/InitializingScreen.tsx:1) | `INITIALIZING` | Countdown transition |
| [`GameScreen.tsx`](components/game/GameScreen.tsx:1) | `PLAYING` | Main gameplay container |
| [`BossFight.tsx`](components/game/BossFight.tsx:1) | `BOSS_FIGHT` | Quiz challenge |
| [`GameOver.tsx`](components/game/GameOver.tsx:1) | `GAME_OVER` | Death screen |
| [`SummaryScreen.tsx`](components/game/SummaryScreen.tsx:1) | `SUMMARY` | Victory screen |

#### 2. Gameplay Sub-components

| Component | Parent | Purpose |
|-----------|--------|---------|
| [`CardStack.tsx`](components/game/CardStack.tsx:1) | GameScreen | Swipeable card display |
| [`GameHUD.tsx`](components/game/GameHUD.tsx:1) | GameScreen | Hype/heat/budget display |
| [`RoastTerminal.tsx`](components/game/RoastTerminal.tsx:1) | GameScreen | AI chat interface |
| [`Taskbar.tsx`](components/game/Taskbar.tsx:1) | GameScreen | Windows 95-style bar |
| [`FeedbackOverlay.tsx`](components/game/FeedbackOverlay.tsx:1) | App (modal) | Choice consequence modal |

#### 3. Layout Components

| Component | Purpose |
|-----------|---------|
| [`LayoutShell.tsx`](components/LayoutShell.tsx:1) | Responsive wrapper with safe areas |

### Component Export Pattern

```typescript
// components/game/index.ts - Barrel exports
export { GameHUD } from './GameHUD';
export { IntroScreen } from './IntroScreen';
// ... etc

// Usage in App.tsx
import { GameScreen, BossFight, GameOver } from './components/game';
```

---

## Hooks Organization

### Hook Naming Conventions

| Pattern | Example | Returns |
|---------|---------|---------|
| `use[Feature]` | `useGameState` | State + actions |
| `use[Event]` | `useSwipeGestures` | Event handlers + state |
| `use[Service]` | `useVoicePlayback` | Service integration |

### Hook Inventory

| Hook | Lines | Purpose |
|------|-------|---------|
| [`useGameState.ts`](hooks/useGameState.ts:1) | ~190 | Central game state reducer |
| [`useSwipeGestures.ts`](hooks/useSwipeGestures.ts:1) | ~223 | Touch/mouse swipe physics |
| [`useVoicePlayback.ts`](hooks/useVoicePlayback.ts:1) | ~91 | Voice audio lifecycle |
| [`useRoast.ts`](hooks/useRoast.ts:1) | ~38 | AI roast chat feature |
| [`useBossFight.ts`](hooks/useBossFight.ts:1) | ~77 | Quiz state management |
| [`useStageReady.ts`](hooks/useStageReady.ts:1) | ~60 | Click debounce + hover delay |
| [`useCountdown.ts`](hooks/useCountdown.ts:1) | ~28 | Timer countdown |
| [`useClock.ts`](hooks/useClock.ts:1) | ~19 | Real-time clock |

### Hook Export Pattern

```typescript
// hooks/index.ts - Centralized exports
export { useGameState, type GameAction } from './useGameState';
export { useSwipeGestures } from './useSwipeGestures';
// ... etc

// Usage in components
import { useGameState, useSwipeGestures } from './hooks';
```

---

## Services Layer

### Service Organization

Services encapsulate external API calls and complex business logic:

| Service | Lines | Purpose |
|---------|-------|---------|
| [`geminiService.ts`](services/geminiService.ts:1) | ~120 | Google Gemini API client |
| [`voicePlayback.ts`](services/voicePlayback.ts:1) | ~91 | WAV file playback manager |

### Service Responsibilities

```
services/
├── geminiService.ts
│   ├── speak(text, voiceName) → Promise<void>
│   │   └── POST /api/speak → AudioBuffer → Web Audio API
│   ├── getRoast(workflow, personality) → Promise<string>
│   │   └── POST /api/roast → Generated text
│   └── cleanupAudio() → void
│       └── Stop all sources, close AudioContext
│
└── voicePlayback.ts
    ├── loadVoice(personality, trigger) → Promise<void>
    │   └── Fetch /audio/voices/{personality}/{trigger}.wav
    ├── playVoice() → Promise<void>
    ├── stopVoice() → void
    └── isPlaying() → boolean
```

---

## API Routes

### Serverless Function Structure

Located in `/api/` directory for Vercel deployment:

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/roast` | [`roast.ts`](api/roast.ts:1) | Generate personality-based roasts |
| `POST /api/speak` | [`speak.ts`](api/speak.ts:1) | Text-to-speech synthesis |

### API Request/Response Patterns

**POST /api/roast**
```typescript
// Request
{ workflow: string, personality: PersonalityType }

// Response
{ text: string } | { error: string }
```

**POST /api/speak**
```typescript
// Request
{ text: string, voiceName?: string }

// Response
{ audio: base64String } | { error: string }
```

---

## Testing Structure

### Test Organization

```
tests/
├── E2E Tests (Playwright)
│   ├── button-highlight.spec.ts    # Button hover states
│   ├── drag-tracking.spec.ts       # Swipe gesture tracking
│   ├── exit-animation.spec.ts      # Card exit animations
│   ├── layout-overlay-touch.spec.ts # Mobile touch handling
│   ├── mobile-width.spec.ts        # Responsive breakpoints
│   ├── roast-console.spec.ts       # AI roast feature
│   ├── snap-back.spec.ts           # Card snap-back behavior
│   ├── stage-snapshots.spec.ts     # Visual regression
│   ├── swipe-consistency.spec.ts   # Gesture consistency
│   └── swipe-interactions.spec.ts  # Full swipe flow
│
├── Test Helpers
│   ├── helpers/navigation.ts       # Page navigation utils
│   └── helpers/selectors.ts        # Element selectors
│
├── Snapshots
│   └── stage-snapshots.spec.ts-snapshots/
│       └── [platform]-[viewport]-[stage].png
│
└── Screenshots (Generated)
    └── screenshot-*.png

unit/
└── voicePlayback.spec.ts           # Voice service unit tests
```

### Test Naming Convention

| Pattern | Example |
|---------|---------|
| `*.spec.ts` | Playwright/Vitest test files |
| `[feature].spec.ts` | Feature-focused tests |
| `*-snapshots/` | Visual regression baselines |

---

## Public Assets

### Asset Organization

```
public/
└── audio/
    └── voices/                       # Pre-recorded voice lines
        ├── lovebomber/               # HYPE-BRO personality
        │   ├── failure.wav           # Game over voice
        │   ├── onboarding.wav        # Welcome voice
        │   └── victory.wav           # Win voice
        ├── roaster/                  # V.E.R.A. personality
        │   ├── failure.wav
        │   ├── feedback_debug.wav    # Card-specific feedback
        │   ├── feedback_ignore.wav
        │   ├── feedback_install.wav
        │   ├── feedback_paste.wav
        │   ├── onboarding.wav
        │   └── victory.wav
        └── zenmaster/                # BAMBOO personality
            ├── failure.wav
            ├── onboarding.wav
            └── victory.wav
```

### Voice Asset Naming

| Pattern | Example | Usage |
|---------|---------|-------|
| `{trigger}.wav` | `onboarding.wav` | Stage entry voices |
| `feedback_{action}.wav` | `feedback_paste.wav` | Card-specific reactions |
| `{outcome}.wav` | `victory.wav`, `failure.wav` | End game voices |

---

## Configuration Files

### Build & Development

| File | Purpose |
|------|---------|
| [`package.json`](package.json:1) | NPM manifest, scripts, dependencies |
| [`tsconfig.json`](tsconfig.json:1) | TypeScript compiler options |
| [`vite.config.ts`](vite.config.ts:1) | Vite bundler configuration |
| [`playwright.config.ts`](playwright.config.ts:1) | E2E test runner config |

### Key Configuration Details

**TypeScript (`tsconfig.json`)**
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled

**Vite (`vite.config.ts`)**
- Port: 5173 (dev)
- Tailwind CSS integration
- TypeScript path aliases

**Playwright (`playwright.config.ts`)**
- Projects: Chromium (desktop + mobile)
- Snapshots: Platform-specific
- TestDir: `./tests`

### Environment Variables

| File | Variables |
|------|-----------|
| [`.env.example`](.env.example:1) | `VITE_ENABLE_SPEECH`, `GEMINI_API_KEY` |

---

## Scripts & Tools

### Development Scripts

Located in `scripts/` directory:

| Script | Purpose |
|--------|---------|
| [`generate-all.ts`](scripts/generate-all.ts:1) | Master content generation |
| [`generate-feedback.ts`](scripts/generate-feedback.ts:1) | Generate card feedback text |
| [`generate-voice.ts`](scripts/generate-voice.ts:1) | Voice line scripts |
| [`local-api.ts`](scripts/local-api.ts:1) | Local API server for dev |

### NPM Scripts (`package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run Playwright tests |
| `npm run test:ui` | Run tests with UI mode |

---

## File Line Count Summary

### Source Code

| Category | Files | Total Lines |
|----------|-------|-------------|
| Components | 14 | ~2,800 |
| Hooks | 8 | ~740 |
| Services | 2 | ~210 |
| API Routes | 2 | ~100 |
| Types/Constants | 2 | ~700 |
| **Total Source** | **28** | **~4,550** |

### Configuration & Documentation

| Category | Files | Total Lines |
|----------|-------|-------------|
| Root Config | 6 | ~800 |
| Documentation | 8 | ~12,000 |
| Tests | 12 | ~4,500 |
| **Total Config/Docs** | **26** | **~17,300** |

---

## Import Patterns

### Absolute Imports (Preferred)

```typescript
// From root
import { GameStage } from './types';
import { useGameState } from './hooks';
import { GameScreen } from './components/game';
```

### Relative Imports (Within module)

```typescript
// Within components/game/
import { GameHUD } from './GameHUD';
import { CardStack } from './CardStack';

// Parent import
import { PERSONALITIES } from '../../constants';
import { GameState } from '../../types';
```

### Barrel Import Pattern

```typescript
// hooks/index.ts aggregates all hooks
export { useGameState } from './useGameState';
export { useSwipeGestures } from './useSwipeGestures';

// Consumer imports from single entry
import { useGameState, useSwipeGestures } from './hooks';
```

---

*Document generated for SwipeRisk codebase analysis*
