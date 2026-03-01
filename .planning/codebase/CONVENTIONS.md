# Coding Conventions

**Analysis Date:** 2026-03-01

## Naming Patterns

**Files:**
- PascalCase for components: `App.tsx`, `LayoutShell.tsx`, `voicePlayback.ts`
- camelCase for utilities and helpers: `navigation.ts`, `selectors.ts`, `geminiService.ts`
- Test files use kebab-case: `swipe-interactions.spec.ts`, `stage-snapshots.spec.ts`

**Functions:**
- camelCase: `loadVoice()`, `playVoice()`, `handleChoice()`, `navigateToPlaying()`
- Action handlers prefixed with `handle`: `handleTouchStart`, `handleBossAnswer`, `handleSwipeChoice`
- Helper functions prefixed with action: `getCard()`, `getLeftButton()`, `getRightButton()`

**Variables:**
- camelCase: `roastInput`, `swipeOffset`, `feedbackOverlay`
- Refs use descriptive names with `Ref` suffix: `cardRef`, `touchStartX`, `stageRef`, `feedbackOverlayRef`
- Boolean flags: `isDragging`, `isSnappingBack`, `hasDragged`, `isFirstCard`
- Constants: SCREAMING_SNAKE_CASE for truly global constants: `INITIAL_BUDGET`, `SWIPE_THRESHOLD`

**Types/Interfaces:**
- PascalCase: `PersonalityType`, `RoleType`, `GameState`, `BossQuestion`, `GameAction`
- Enums use PascalCase with values in UPPER_SNAKE_CASE: `PersonalityType.ROASTER`, `GameStage.PLAYING`
- Interface naming: `GameHUDProps`, `Card`, `BossQuestion`

## Code Style

**Formatting:**
- No explicit formatter configured (no Prettier)
- 2-space indentation
- Single quotes for strings in JSX, double quotes elsewhere
- Trailing commas in objects/arrays

**Linting:**
- No ESLint configuration detected
- Relies on TypeScript strict mode and editor defaults

**TypeScript Configuration:**
- Target: ES2022
- JSX: react-jsx
- Module resolution: bundler
- Path alias: `@/*` maps to project root

## Import Organization

**Order:**
1. React imports (internal): `React, { useState, useEffect, useRef, useCallback, useReducer }`
2. Type imports (local): `GameStage, PersonalityType, RoleType... from './types'`
3. Constants imports (local): `PERSONALITIES, ROLE_CARDS... from './constants'`
4. Service imports (local): `loadVoice, playVoice... from './services/voicePlayback'`
5. Component imports (local): `LayoutShell from './components/LayoutShell'`

**Path Aliases:**
- `@/*` is configured for absolute imports from project root
- Relative imports preferred for local files within same directory

**Grouping in App.tsx:**
```typescript
// React hooks (first)
import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';

// Types and constants (internal modules)
import { GameStage, PersonalityType, RoleType, GameState, AppSource, DeathType } from './types';
import { PERSONALITIES, ROLE_CARDS, DEATH_ENDINGS, BOSS_FIGHT_QUESTIONS } from './constants';

// Services (external functionality)
import { loadVoice, playVoice, stopVoice } from './services/voicePlayback';
import { getRoast } from './services/geminiService';

// Components
import LayoutShell from './components/LayoutShell';
```

## Error Handling

**Patterns:**
- try/catch with console.error for recoverable errors
- Throw new Error for fatal failures
- Graceful degradation: voice playback failures logged but don't crash app

**Service Layer (`services/voicePlayback.ts`):**
```typescript
try {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${ERROR_MESSAGES[personalityKey]}`);
  }
  // ... rest of logic
} catch (error) {
  console.error("[Voice Error]", error);
  throw new Error(ERROR_MESSAGES[personalityKey] || "Voice module error");
}
```

**Service Layer (`services/geminiService.ts`):**
- API key validation at start: returns fallback message if missing
- Fallback models tried in sequence
- Final fallback returns satirical error message instead of throwing

**App Layer (`App.tsx`):**
- Async error handling with try/catch and user-facing error states
- Stage transition validation with console.error in development only:
```typescript
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.error(`Invalid stage transition: ${state.stage} → ${action.stage}`);
}
```

## Logging

**Framework:** console methods only (no structured logging library)

**Patterns:**
- Feature-specific prefixes: `[Voice]`, `[Feedback]`, `[Voice Error]`
- Development-only logging in production checks
- Voice service detailed logging for debugging playback issues
- Key user actions logged: `console.log('[Feedback] Playing voice:', trigger, ...)`

**Console methods used:**
- `console.log` - Informational (loading states, success)
- `console.error` - Errors (API failures, unexpected states)
- `console.warn` - Warnings (fallback behavior)

## Comments

**When to Comment:**
- Complex business logic: `determineDeathType()` has clear if/else structure for death conditions
- Design system patterns: Extensive JSDoc blocks explaining button variants, container width strategy
- Non-obvious decisions: Why certain voice triggers map to certain feedback
- Card mapping logic in feedback overlay useEffect

**JSDoc/TSDoc:**
- Used for design system documentation in `App.tsx` (button patterns, container widths)
- TSDoc comments on interface properties: `/** Optional scene-setting line to immerse the user before the main ask */`
- Function-level comments on utility files: `/** Navigate from intro to the playing stage */`

**Code block headers in App.tsx:**
```typescript
/**
 * BUTTON VARIANT PATTERNS (established design system)
 * ...
 */

/**
 * CONTAINER WIDTH STRATEGY
 * ...
 */
```

## Function Design

**Size:** Large main component (App.tsx ~1400 lines) contains all game logic. Consider extracting to custom hooks for better organization.

**Parameters:**
- Event handlers use explicit types: `handleTouchStart(e: React.TouchEvent | React.MouseEvent)`
- Callbacks typed in component props: `formatBudget: (amount: number) => string`

**Return Values:**
- Void for event handlers: `handleChoice(direction: 'LEFT' | 'RIGHT'): void`
- Promise for async: `loadVoice(personality: string, trigger: string): Promise<void>`
- Typed state updates: `dispatch({ type: 'CHOICE_MADE', direction, outcome: {...} })`

**React Component Patterns:**
- Memoized components: `React.memo(function GameHUD({...}) {...})`
- Functional components with hooks: `const App: React.FC = () => {...}`
- Early returns for conditionals in render functions

## Module Design

**Exports:**
- Named exports for utilities: `export async function loadVoice(...)`
- Default exports for pages/components: `export default LayoutShell`
- Constants exported from `constants.ts`: `export const PERSONALITIES = {...}`
- Types exported from `types.ts`: `export enum GameStage {...}`

**Barrel Files:** Not used - imports go directly to source files

**Service Pattern:**
- Single responsibility services: `voicePlayback.ts`, `geminiService.ts`
- Error handling contained within services
- Console-based logging from services

---

*Convention analysis: 2026-03-01*
