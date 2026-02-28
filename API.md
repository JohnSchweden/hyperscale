# API Documentation

## Services

### GeminiService

**File:** [`services/geminiService.ts`](services/geminiService.ts)

Text-to-speech integration using Google Gemini 2.5 Flash Preview TTS.

#### Functions

##### `speak(text: string, voiceName?: string): Promise<void>`

Converts text to speech and plays it via the Web Audio API.

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | Required | Text to speak |
| `voiceName` | `string` | `'Kore'` | Voice to use (Puck, Zephyr, Kore) |

**Voice Options:**
| Voice | Personality | Character |
|-------|-------------|-----------|
| `'Puck'` | V.E.R.A. | British, sarcastic |
| `'Zephyr'` | Bamboo | Calm, flowing |
| `'Kore'` | HYPE-BRO | Energetic, enthusiastic |

**Environment Control:**
Set `VITE_ENABLE_SPEECH=false` in `.env.local` to disable TTS globally.

**Example:**
```typescript
import { speak } from './services/geminiService';
import { PERSONALITIES } from './constants';

// Use personality's voice
const personality = PERSONALITIES[PersonalityType.ROASTER];
await speak('Brilliant. You just open-sourced our trade secrets.', personality.voice);
```

**Error Handling:**
- Logs errors to console
- Gracefully fails without throwing (doesn't block game)
- Requires valid `GEMINI_API_KEY` at build time

---

##### `cleanupAudio(): void`

Stops all currently playing audio sources.

**Use Case:** Call on component unmount or when switching stages to prevent audio overlap.

**Example:**
```typescript
import { cleanupAudio } from './services/geminiService';

useEffect(() => {
  return () => {
    cleanupAudio(); // Stop audio on unmount
  };
}, []);
```

---

##### `getRoast(personality: PersonalityType, scenario: string): Promise<string>`

Generates contextual AI commentary using Gemini AI.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `personality` | `PersonalityType` | Which personality style to use |
| `scenario` | `string` | Context for the roast |

**Returns:** `Promise<string>` - Generated commentary

---

## Components

### LayoutShell

**File:** [`components/LayoutShell.tsx`](components/LayoutShell.tsx)

Responsive layout wrapper that provides consistent positioning across all game stages.

#### Props Interface

```typescript
interface LayoutShellProps {
  children: React.ReactNode;    // Main content
  header?: React.ReactNode;     // Optional header element
  footer?: React.ReactNode;     // Optional footer element
  className?: string;           // Additional CSS classes
}
```

#### Behavior

| Viewport | Behavior |
|----------|----------|
| Desktop (≥1024px) | Centers content vertically and horizontally |
| Mobile (<1024px) | Anchors content to top with padding |

#### Styling Features

- `min-h-[100dvh]` - Mobile viewport stability (handles browser chrome)
- `safe-area-top safe-area-bottom` - Notch/device safe area support
- `overflow-y-auto` - Scrollable if content overflows
- Black background (`bg-black`)

#### Usage Example

```typescript
import { LayoutShell } from './components/LayoutShell';

const GameStage = () => (
  <LayoutShell
    header={<GameHUD stats={stats} />}
    className="game-specific-class"
  >
    <GameCard card={currentCard} />
  </LayoutShell>
);
```

#### Test ID

The shell element has `data-testid="layout-shell"` for testing.

---

## Types

**File:** [`types.ts`](types.ts)

### Enums

#### `GameStage`

```typescript
enum GameStage {
  INTRO = 'INTRO',
  PERSONALITY_SELECT = 'PERSONALITY_SELECT',
  ROLE_SELECT = 'ROLE_SELECT',
  INITIALIZING = 'INITIALIZING',
  PLAYING = 'PLAYING',
  BOSS_FIGHT = 'BOSS_FIGHT',
  GAME_OVER = 'GAME_OVER',
  SUMMARY = 'SUMMARY'
}
```

#### `PersonalityType`

```typescript
enum PersonalityType {
  ROASTER = 'ROASTER',
  ZEN_MASTER = 'ZEN_MASTER',
  LOVEBOMBER = 'LOVEBOMBER'
}
```

#### `RoleType`

```typescript
enum RoleType {
  DEVELOPMENT = 'DEVELOPMENT',
  MARKETING = 'MARKETING',
  MANAGEMENT = 'MANAGEMENT',
  HR = 'HR',
  FINANCE = 'FINANCE',
  CLEANING = 'CLEANING'
}
```

#### `AppSource`

```typescript
enum AppSource {
  SLACK = 'SLACK',
  EMAIL = 'EMAIL',
  TERMINAL = 'TERMINAL',
  IDE = 'IDE'
}
```

#### `DeathType`

```typescript
enum DeathType {
  BANKRUPT = 'BANKRUPT',
  REPLACED_BY_SCRIPT = 'REPLACED_BY_SCRIPT',
  CONGRESS = 'CONGRESS',
  FLED_COUNTRY = 'FLED_COUNTRY',
  PRISON = 'PRISON',
  AUDIT_FAILURE = 'AUDIT_FAILURE'
}
```

### Interfaces

#### `Card`

```typescript
interface Card {
  id: string;                    // Unique identifier
  source: AppSource;             // Message source type
  sender: string;                // Sender name
  context: string;               // Subject/context line
  storyContext?: string;         // Optional scene-setting narrative
  text: string;                  // Main dilemma text
  onRight: ChoiceOutcome;        // Right swipe outcome
  onLeft: ChoiceOutcome;         // Left swipe outcome
}
```

#### `ChoiceOutcome`

```typescript
interface ChoiceOutcome {
  label: string;                 // Button text (e.g., "Do it")
  hype: number;                  // Hype stat change
  heat: number;                  // Heat stat change
  fine: number;                  // Budget penalty
  violation: string;             // Legal/compliance violation
  feedback: {                    // AI commentary
    [key in PersonalityType]: string;
  };
  lesson: string;                // Educational takeaway
}
```

#### `GameState`

```typescript
interface GameState {
  hype: number;                  // Current hype (0-100+)
  heat: number;                  // Current heat (0-100)
  budget: number;                // Current budget
  stage: GameStage;              // Current game stage
  personality: PersonalityType | null;
  role: RoleType | null;
  currentCardIndex: number;      // Progress through deck
  history: {                     // Choice history
    cardId: string;
    choice: 'LEFT' | 'RIGHT';
  }[];
  deathReason: string | null;
  deathType: DeathType | null;
  unlockedEndings: DeathType[];
  bossFightAnswers: boolean[];
}
```

#### `BossQuestion`

```typescript
interface BossQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
}
```

---

## Constants

**File:** [`constants.ts`](constants.ts)

### `PERSONALITIES`

Personality configurations including voice, tone, and dialogue.

```typescript
const PERSONALITIES = {
  [PersonalityType.ROASTER]: {
    name: 'V.E.R.A.',
    title: 'The Roaster',
    description: 'British sarcasm, burned-out IT director, cynical.',
    voice: 'Puck',
    onboarding: string,
    victory: string,
    failure: string
  },
  // ... other personalities
};
```

### `ROLE_CARDS`

Card decks organized by role.

```typescript
const ROLE_CARDS: Record<RoleType, Card[]> = {
  [RoleType.DEVELOPMENT]: [...],
  [RoleType.MARKETING]: [...],
  // ... other roles
};
```

### `DEATH_ENDINGS`

Ending configuration for each death type.

```typescript
const DEATH_ENDINGS: Record<DeathType, {
  title: string;
  description: string;
  icon: string;
  color: string;
}> = { ... };
```

### `BOSS_FIGHT_QUESTIONS`

Array of quiz questions for the boss fight.

```typescript
const BOSS_FIGHT_QUESTIONS: BossQuestion[] = [...];
```

---

## Test Helpers

### Navigation

**File:** [`tests/helpers/navigation.ts`](tests/helpers/navigation.ts)

Quick navigation utilities for Playwright tests.

#### `navigateTo.intro(page: Page)`
Navigates to intro stage.

#### `navigateTo.personalitySelect(page: Page)`
Navigates through intro to personality selection.

#### `navigateTo.roleSelect(page: Page, personality?: PersonalityType)`
Navigates to role selection with optional personality pre-selected.

#### `navigateTo.game(page: Page, personality?: PersonalityType, role?: RoleType)`
Navigates to active gameplay with optional pre-selections.

#### `navigateTo.bossFight(page: Page)`
Navigates to boss fight stage.

#### `navigateTo.gameOver(page: Page)`
Navigates to game over screen.

#### `navigateTo.summary(page: Page)`
Navigates to victory summary.

### Selectors

**File:** [`tests/helpers/selectors.ts`](tests/helpers/selectors.ts)

Common element selectors for tests.

| Selector | Value | Element |
|----------|-------|---------|
| `card` | `[data-testid="game-card"]` | Game card |
| `swipeZone` | `[data-testid="swipe-zone"]` | Swipeable area |
| `swipeLeftBtn` | `[data-testid="swipe-left-btn"]` | Left choice button |
| `swipeRightBtn` | `[data-testid="swipe-right-btn"]` | Right choice button |
| `layoutShell` | `[data-testid="layout-shell"]` | Layout container |
| `roastConsole` | `[data-testid="roast-console"]` | AI commentary display |

---

## Game Configuration

### Constants

**File:** [`App.tsx`](App.tsx)

```typescript
const INITIAL_BUDGET = 10000000;        // Starting money
const SWIPE_THRESHOLD = 100;            // Pixels to trigger choice
const SWIPE_PREVIEW_THRESHOLD = 50;     // Pixels to show preview
```

### Stage Transitions

Valid stage transitions are enforced:

```typescript
const STAGE_TRANSITIONS: Record<GameStage, GameStage[]> = {
  [GameStage.INTRO]: [GameStage.PERSONALITY_SELECT],
  [GameStage.PERSONALITY_SELECT]: [GameStage.ROLE_SELECT],
  [GameStage.ROLE_SELECT]: [GameStage.INITIALIZING],
  [GameStage.INITIALIZING]: [GameStage.PLAYING],
  [GameStage.PLAYING]: [GameStage.BOSS_FIGHT, GameStage.GAME_OVER],
  [GameStage.BOSS_FIGHT]: [GameStage.SUMMARY, GameStage.GAME_OVER],
  [GameStage.GAME_OVER]: [GameStage.INTRO],
  [GameStage.SUMMARY]: [GameStage.INTRO]
};
```

---

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GEMINI_API_KEY` | `string` | Required | Google Gemini API key |
| `VITE_ENABLE_SPEECH` | `'true' \| 'false'` | `'true'` | Enable/disable TTS |

**Note:** Environment variables are injected at build time via Vite's `define` config.
