# Architecture Documentation

## Overview

K-Maru: The Hyperscale Chronicles is a single-page React application built with TypeScript and Vite. The game uses a state machine pattern for game flow management and implements custom gesture handling for the swipe-based gameplay.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 (with hooks) |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS |
| Testing | Playwright |
| AI Integration | Google GenAI SDK |
| State Management | React useReducer |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                 │
│                    (Main Game Container)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Game State  │  │   Stages     │  │   Card Display       │  │
│  │  (useReducer)│  │  (Components)│  │   (Swipeable)        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                     │               │
│         ▼                  ▼                     ▼               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   types.ts   │  │   constants  │  │   Gesture Handlers   │  │
│  │              │  │   (Cards)    │  │   (Touch/Mouse)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      services/                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              geminiService.ts (TTS)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                   components/                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              LayoutShell.tsx (Responsive)                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Core Systems

### 1. Game State Management

The game uses React's `useReducer` hook for centralized state management, following Redux patterns without the boilerplate.

**File:** [`App.tsx`](App.tsx:81)

```typescript
type GameAction =
  | { type: 'STAGE_CHANGE'; stage: GameStage; personality?: PersonalityType | null; role?: RoleType | null; currentCardIndex?: number }
  | { type: 'CHOICE_MADE'; direction: 'LEFT' | 'RIGHT'; outcome: { hype: number; heat: number; fine: number; cardId: string } }
  | { type: 'NEXT_INCIDENT' }
  | { type: 'BOSS_ANSWER'; isCorrect: boolean }
  | { type: 'BOSS_COMPLETE'; success: boolean }
  | { type: 'RESET' };
```

**State Structure:** [`types.ts`](types.ts:67)

| Field | Type | Description |
|-------|------|-------------|
| `hype` | `number` | Reputation metric (0-100+) |
| `heat` | `number` | Legal risk metric (0-100) |
| `budget` | `number` | Financial resources |
| `stage` | `GameStage` | Current game phase |
| `personality` | `PersonalityType \| null` | Selected AI companion |
| `role` | `RoleType \| null` | Selected department role |
| `currentCardIndex` | `number` | Progress through deck |
| `history` | `Array` | Record of player choices |
| `deathType` | `DeathType \| null` | Ending type if game over |
| `unlockedEndings` | `DeathType[]` | Collection of seen endings |
| `bossFightAnswers` | `boolean[]` | Boss quiz results |

### 2. Stage Management

The game uses a finite state machine for stage transitions. Each stage represents a distinct game phase.

**Stages:** [`types.ts`](types.ts:56)

| Stage | Description |
|-------|-------------|
| `INTRO` | Title screen and game premise |
| `PERSONALITY_SELECT` | Choose AI companion |
| `ROLE_SELECT` | Choose department role |
| `INITIALIZING` | Boot sequence animation |
| `PLAYING` | Main card swiping gameplay |
| `BOSS_FIGHT` | Final quiz challenge |
| `GAME_OVER` | Failure ending screen |
| `SUMMARY` | Victory ending screen |

**Transition Validation:** [`App.tsx`](App.tsx:101)

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

### 3. Gesture System

Custom gesture handling supports both touch and mouse interactions for card swiping.

**Configuration:**

```typescript
const SWIPE_THRESHOLD = 100;        // Pixels to trigger choice
const SWIPE_PREVIEW_THRESHOLD = 50; // Pixels to show preview
```

**Implementation Strategy:**

1. **Pointer Down** - Capture initial position, start tracking
2. **Pointer Move** - Calculate delta, apply transform, show preview indicators
3. **Pointer Up** - Evaluate threshold, trigger choice or snap back

**Visual Feedback:**
- Cards translate based on drag distance
- Opacity changes indicate direction
- Arrow indicators appear when crossing preview threshold

### 4. Audio System

Text-to-speech powered by Gemini 2.5 Flash Preview TTS.

**File:** [`services/geminiService.ts`](services/geminiService.ts:40)

```typescript
export const speak = async (text: string, voiceName: string = 'Kore') => {
  if (import.meta.env.VITE_ENABLE_SPEECH === 'false') return;
  // ... TTS implementation
};
```

**Voice Mapping:**

| Personality | Voice | Character |
|-------------|-------|-----------|
| V.E.R.A. (Roaster) | `Puck` | British, sarcastic |
| Bamboo (Zen Master) | `Zephyr` | Calm, flowing |
| HYPE-BRO (Lovebomber) | `Kore` | Energetic, enthusiastic |

**Audio Pipeline:**
1. Generate speech via Gemini API
2. Decode base64 audio data
3. Convert to AudioBuffer (Int16 PCM → Float32)
4. Play via Web Audio API
5. Track active sources for cleanup

### 5. Card System

Cards are the core content unit. Each role has a unique deck of scenarios.

**Structure:** [`types.ts`](types.ts:24)

```typescript
interface Card {
  id: string;
  source: AppSource;      // IDE, Slack, Email, Terminal
  sender: string;         // Who sent the message
  context: string;          // Subject/context line
  storyContext?: string;    // Immersive scene setting
  text: string;            // The dilemma/question
  onRight: ChoiceOutcome;  // Swipe right results
  onLeft: ChoiceOutcome;   // Swipe left results
}
```

**Choice Outcome:**

```typescript
interface ChoiceOutcome {
  label: string;           // Button text
  hype: number;          // Hype stat change
  heat: number;          // Heat stat change
  fine: number;          // Budget penalty
  violation: string;     // Legal/compliance issue
  feedback: Record<PersonalityType, string>; // AI commentary
  lesson: string;        // Educational takeaway
}
```

### 6. Death/Ending System

Multiple failure endings based on game state and role.

**Logic:** [`App.tsx`](App.tsx:89)

```typescript
function determineDeathType(budget: number, heat: number, hype: number, role: RoleType | null): DeathType {
  if (budget <= 0) return DeathType.BANKRUPT;
  if (heat >= 100) {
    if (hype <= 10) return DeathType.REPLACED_BY_SCRIPT;
    if (role === RoleType.FINANCE) return DeathType.PRISON;
    if (role === RoleType.MARKETING) return DeathType.CONGRESS;
    if (role === RoleType.MANAGEMENT) return DeathType.AUDIT_FAILURE;
    return DeathType.FLED_COUNTRY;
  }
  return DeathType.AUDIT_FAILURE;
}
```

## Design Systems

### Button Variants

Defined in [`App.tsx`](App.tsx:7) comments:

| Variant | Style | Usage |
|---------|-------|-------|
| **Primary CTA** | White bg, black text, cyan hover | Boot, Reboot, Log off buttons |
| **Card Selection** | Slate-900 bg, slate-800 border, cyan hover | Personality, Role selection |
| **Action Button** | Transparent, white border/text, cyan hover | Swipe choice buttons |

### Container Widths

| Width | Value | Usage |
|-------|-------|-------|
| Standard | `max-w-4xl` | Personality Select, Role Select, Game, BossFight |
| Narrow | `max-w-2xl` | Initializing, GameOver, Summary |
| Auto | None | Intro (content-defined) |

## Build Configuration

### Vite Config

**File:** [`vite.config.ts`](vite.config.ts)

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const geminiApiKey = env.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  return {
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(geminiApiKey),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') }
    }
  };
});
```

### TypeScript Config

**File:** [`tsconfig.json`](tsconfig.json)

- Strict mode enabled
- ES2020 target
- Path mapping for `@/` imports
- React JSX transform

## Performance Considerations

1. **Memoization** - Components use `React.memo` where appropriate
2. **Audio Cleanup** - Active audio sources tracked and stopped on unmount
3. **Animation Optimization** - GPU-accelerated transforms only
4. **Image Optimization** - Lighthouse reports generated for monitoring

## Security Notes

1. **API Key Handling** - Key injected at build time, not exposed to client source
2. **Content Sanitization** - Card text is static, no user input rendering
3. **No Data Persistence** - Game state exists only in memory

## Future Architecture Considerations

- **State Persistence** - localStorage for game progress
- **Analytics** - Track choice patterns for balance tuning
- **i18n** - Internationalization structure for card content
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
