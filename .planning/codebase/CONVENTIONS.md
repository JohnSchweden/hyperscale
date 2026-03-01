# SwipeRisk Code Conventions

This document defines the coding standards, patterns, and conventions used throughout the SwipeRisk codebase.

---

## TypeScript Patterns and Types

### Type Definitions Location
All shared types are defined in [`types.ts`](types.ts:1) at the project root:

```typescript
// enums for fixed value sets
export enum PersonalityType {
  ROASTER = 'ROASTER',
  ZEN_MASTER = 'ZEN_MASTER',
  LOVEBOMBER = 'LOVEBOMBER'
}

export enum GameStage {
  INTRO = 'INTRO',
  PERSONALITY_SELECT = 'PERSONALITY_SELECT',
  // ...
}

// Interfaces for data structures
export interface Card {
  id: string;
  source: AppSource;
  sender: string;
  context: string;
  storyContext?: string;  // Optional fields marked with ?
  text: string;
  onRight: CardOutcome;
  onLeft: CardOutcome;
}

// Complex nested types with mapped types
export interface CardOutcome {
  label: string;
  hype: number;
  heat: number;
  fine: number;
  violation: string;
  feedback: {
    [key in PersonalityType]: string;  // Mapped type
  };
  lesson: string;
}
```

### Discriminated Unions for Actions
Use discriminated unions with a `type` property for action types:

```typescript
export type GameAction =
  | { type: 'STAGE_CHANGE'; stage: GameStage; personality?: PersonalityType | null }
  | { type: 'CHOICE_MADE'; direction: 'LEFT' | 'RIGHT'; outcome: ChoiceOutcome }
  | { type: 'NEXT_INCIDENT' }
  | { type: 'BOSS_ANSWER'; isCorrect: boolean }
  | { type: 'RESET' };
```

### Type Exports
Export types explicitly when needed by consumers:

```typescript
export { useGameState, type GameAction } from './useGameState';
export { useSwipeGestures, type SwipeState } from './useSwipeGestures';
```

---

## Naming Conventions

### Files
| Pattern | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `CardStack.tsx`, `GameScreen.tsx` |
| Hooks | camelCase with `use` prefix | `useGameState.ts`, `useSwipeGestures.ts` |
| Constants | camelCase descriptive | `constants.ts` |
| Types | camelCase | `types.ts` |
| Tests | kebab-case with `.spec.ts` suffix | `swipe-interactions.spec.ts` |

### Variables and Functions
| Pattern | Convention | Example |
|---------|-----------|---------|
| Constants | UPPER_SNAKE_CASE | `SWIPE_THRESHOLD`, `INITIAL_BUDGET` |
| Enums | PascalCase + UPPER_SNAKE_CASE members | `PersonalityType.ROASTER` |
| Functions | camelCase | `handleTouchStart`, `navigateToPlaying` |
| Boolean variables | Prefix with is/has/should | `isDragging`, `hasDragged`, `enabled` |
| React refs | Suffix with `Ref` | `cardRef`, `rafRef` |

### Component Props
Props interfaces use `{ComponentName}Props` naming:

```typescript
interface CardStackProps {
  role: RoleType;
  currentCardIndex: number;
  isFirstCard: boolean;
  cardRef: RefObject<HTMLDivElement>;
  // ...
}
```

---

## Component Structure Patterns

### Functional Component Pattern
All components use functional components with explicit `React.FC` type:

```typescript
import React, { RefObject } from 'react';
import { Card, RoleType } from '../../types';

interface CardStackProps {
  role: RoleType;
  currentCardIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const CardStack: React.FC<CardStackProps> = ({
  role,
  currentCardIndex,
  onSwipeLeft,
  onSwipeRight
}) => {
  // Component logic here
  
  return (
    <div data-testid="incident-card-container">
      {/* JSX */}
    </div>
  );
};
```

### Props Organization
Group related props with comments:

```typescript
interface SwipeGestureProps {
  // Swipe state
  offset: number;
  direction: 'LEFT' | 'RIGHT' | null;
  isDragging: boolean;
  
  // Event handlers
  onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd: () => void;
  
  // Actions
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  
  // Thresholds
  swipeThreshold: number;
}
```

### Data Test IDs
Components include `data-testid` attributes for E2E testing:

```tsx
<div data-testid="incident-card-container">
  <div data-testid="incident-card">...</div>
  <button data-testid="swipe-left-button">...</button>
  <button data-testid="swipe-right-button">...</button>
</div>
```

---

## Import/Export Patterns

### Barrel Exports
Both [`hooks/index.ts`](hooks/index.ts:1) and [`components/game/index.ts`](components/game/index.ts:1) use barrel export patterns:

```typescript
// hooks/index.ts
export { useGameState, type GameAction } from './useGameState';
export { useSwipeGestures } from './useSwipeGestures';
export { useVoicePlayback } from './useVoicePlayback';

// components/game/index.ts
export { GameHUD } from './GameHUD';
export { IntroScreen } from './IntroScreen';
export { CardStack } from './CardStack';
```

### Named Exports
Prefer named exports over default exports:

```typescript
// Good
export const CardStack: React.FC<CardStackProps> = (props) => { ... }
export { useGameState } from './useGameState';

// Avoid
export default CardStack;
```

### Import Organization
Imports are grouped in this order:
1. React imports
2. Third-party libraries
3. Absolute project imports (types, constants)
4. Relative imports (sibling components)

```typescript
import React, { useState, useCallback } from 'react';
import { Page } from '@playwright/test';

import { GameStage, PersonalityType } from '../types';
import { ROLE_CARDS } from '../constants';

import { GameHUD } from './GameHUD';
import { CardStack } from './CardStack';
```

---

## Error Handling Approaches

### Development-Only Errors
Use environment checks for development warnings that don't impact production:

```typescript
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.error(`Invalid stage transition: ${state.stage} → ${action.stage}`);
}
```

### Narrative Error Messages
User-facing errors match the game's personality/voice:

```typescript
// Roaster personality error
if (personality === 'roaster') {
  throw new Error('V.E.R.A. is disappointed. Voice module not found.');
}

// Zen Master personality error
if (personality === 'zenmaster') {
  throw new Error('The spreadsheets are not at peace. Audio unavailable.');
}
```

### Type Guards
Use strict type checking with early returns:

```typescript
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'STAGE_CHANGE': {
      const allowed = STAGE_TRANSITIONS[state.stage];
      if (allowed != null && !allowed.includes(action.stage)) {
        // Invalid transition - return unchanged state
        return state;
      }
      // ...
    }
  }
}
```

---

## Constants Organization

Constants are organized in [`constants.ts`](constants.ts:1) by feature:

### Record Types for Mapped Data
Use `Record` types for data keyed by enums:

```typescript
export const PERSONALITIES = {
  [PersonalityType.ROASTER]: {
    name: 'V.E.R.A.',
    title: 'The Roaster',
    description: 'British sarcasm, burned-out IT director, cynical.',
    voice: 'Puck',
    onboarding: "Oh, look. Another 'Visionary'...",
  },
  [PersonalityType.ZEN_MASTER]: {
    name: 'BAMBOO',
    // ...
  }
};

export const DEATH_ENDINGS: Record<DeathType, { 
  title: string; 
  description: string; 
  icon: string; 
  color: string 
}> = {
  [DeathType.BANKRUPT]: {
    title: "Liquidated",
    description: "The VCs pulled out...",
    icon: "fa-file-invoice-dollar",
    color: "text-red-600"
  },
  // ...
};
```

### Feature-Based Arrays
Arrays of complex objects use explicit typing:

```typescript
export const BOSS_FIGHT_QUESTIONS: BossQuestion[] = [
  {
    id: "boss_1",
    question: "You used public ChatGPT to debug proprietary code...",
    correctAnswer: "Data Leakage - Public LLMs may retain training data",
    wrongAnswers: [
      "Copyright infringement only",
      "It's fine if you delete the conversation"
    ],
    explanation: "Public AI tools can store and learn from your inputs..."
  }
];
```

### Role-Based Card Data
Cards are organized by role using `Record<RoleType, Card[]>`:

```typescript
export const ROLE_CARDS: Record<RoleType, Card[]> = {
  [RoleType.DEVELOPMENT]: [
    { id: 'dev_1', source: AppSource.IDE, /* ... */ },
  ],
  [RoleType.MARKETING]: [
    { id: 'mkt_1', source: AppSource.SLACK, /* ... */ },
  ]
};
```

---

## Hook Patterns

### State Management with useReducer
Complex state uses `useReducer` with typed actions:

```typescript
const [state, dispatch] = useReducer(gameReducer, initialGameState);

// Dispatch pattern
dispatch({ 
  type: 'STAGE_CHANGE', 
  stage: GameStage.PLAYING,
  personality: selectedPersonality 
});
```

### Custom Hook Pattern
Hooks return state and handlers:

```typescript
interface UseSwipeGesturesOptions {
  enabled: boolean;
  onSwipe: (direction: 'LEFT' | 'RIGHT') => void;
}

export function useSwipeGestures({ enabled, onSwipe }: UseSwipeGesturesOptions) {
  const [state, setState] = useState<SwipeState>({ ... });
  
  const handleTouchStart = useCallback((clientX: number, clientY: number) => {
    // ...
  }, [enabled]);
  
  return {
    ...state,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    reset
  };
}
```

---

## CSS/Tailwind Conventions

### Responsive Design
Use mobile-first breakpoints:
- Base: Mobile (default)
- `md:`: 768px+
- `lg:`: 1024px+

### Common Patterns
```tsx
// Container with responsive max-width
<div className="w-full max-w-full lg:max-w-[43rem]">

// Padding that scales
<div className="p-4 md:p-6">

// Typography that scales
<h1 className="text-lg md:text-xl font-bold">
```

### Animation Classes
Custom animation classes are defined inline or in the HTML template:
```css
.spring-snap-back {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```
