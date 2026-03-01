# SwipeRisk Architecture

> High-level system design and architectural overview of the SwipeRisk AI Governance Simulator

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Game Loop & Stage Flow](#game-loop--stage-flow)
- [Integration Points](#integration-points)

---

## Overview

SwipeRisk is a React-based single-page application (SPA) that simulates AI governance decisions through a card-swiping interface. Players assume corporate roles and make choices that affect hype, heat, and budget metrics, learning about AI compliance through satirical gameplay.

**Key Architectural Decisions:**
- **State Management**: Centralized reducer pattern with `useGameState` hook
- **UI Pattern**: Stage-based rendering with switch statement routing
- **Interaction Model**: Touch/mouse swipe gestures with keyboard support
- **Styling**: Tailwind CSS with custom design system tokens
- **Audio**: Web Audio API with pre-recorded voice assets
- **AI Integration**: Google Gemini API for dynamic content generation

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SWIPERISK ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────────────────────────────────────────────┐ │
│  │   Client    │    │                   React Application                  │ │
│  │   Browser   │───▶│                                                      │ │
│  │             │    │  ┌──────────┐   ┌────────────┐   ┌───────────────┐  │ │
│  └─────────────┘    │  │   App    │──▶│ GameStage  │──▶│   Components  │  │ │
│                     │  │  (Root)  │   │  Router    │   │  (Screens)    │  │ │
│                     │  └──────────┘   └────────────┘   └───────────────┘  │ │
│                     │         │                                            │ │
│                     │         ▼                                            │ │
│                     │  ┌─────────────────────────────────────────────────┐ │ │
│                     │  │           Custom Hooks (Business Logic)          │ │ │
│                     │  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │ │
│                     │  │ │useGameState│ │useSwipe  │ │ useVoicePlayback │ │ │ │
│                     │  │ │ (Reducer) │  │Gestures  │ │   (Audio Mgmt)   │ │ │ │
│                     │  │ └──────────┘ └──────────┘ └──────────────────┘ │ │ │
│                     │  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │ │
│                     │  │ │useBossFight│ │useRoast  │ │  useStageReady   │ │ │ │
│                     │  │ │(Quiz Mgmt)│  │(AI Chat) │ │ (Click Debounce) │ │ │ │
│                     │  │ └──────────┘ └──────────┘ └──────────────────┘ │ │ │
│                     │  └─────────────────────────────────────────────────┘ │ │
│                     │         │                                            │ │
│                     │         ▼                                            │ │
│                     │  ┌─────────────────────────────────────────────────┐ │ │
│                     │  │              Services Layer                      │ │ │
│                     │  │  ┌───────────────┐    ┌───────────────────────┐ │ │ │
│                     │  │ │geminiService.ts│    │   voicePlayback.ts    │ │ │ │
│                     │  │ │  (API Client)  │    │    (Audio Player)     │ │ │ │
│                     │  │ └───────────────┘    └───────────────────────┘ │ │ │
│                     │  └─────────────────────────────────────────────────┘ │ │
│                     └──────────────────────────────────────────────────────┘ │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         API Routes (Serverless)                          │ │
│  │  ┌─────────────────┐              ┌─────────────────────────────────┐  │ │
│  │  │  /api/roast     │              │         /api/speak              │  │ │
│  │  │  (Gemini API)   │              │    (Text-to-Speech)             │  │ │
│  │  │                 │              │                                 │  │ │
│  │  │ • Workflow roast│              │ • Gemini TTS API                │  │ │
│  │  │ • Personality   │              │ • Voice synthesis               │  │ │
│  │  │   adaptation    │              │ • Audio streaming               │  │ │
│  │  └─────────────────┘              └─────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                      External Services                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │ │
│  │  │                     Google Gemini API                            │    │ │
│  │  │  • Text Generation (Roasts)  • Text-to-Speech                    │    │ │
│  │  └─────────────────────────────────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Core State Flow

```
┌──────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Input │────▶│  useGameState   │────▶│  gameReducer    │
│  (Swipe/Click)│     │   (Hook API)    │     │  (State Logic)  │
└──────────────┘     └─────────────────┘     └────────┬────────┘
                                                      │
                                                      ▼
┌──────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  UI Update   │◀────│  Stage Router   │◀────│  GameState Obj  │
│ (Re-render)  │     │  (App.tsx)      │     │  (Immutable)    │
└──────────────┘     └─────────────────┘     └─────────────────┘
```

### Card Decision Flow

```
User swipes card (or clicks button)
           │
           ▼
┌───────────────────────┐
│  useSwipeGestures     │──▶ Calculates drag offset & direction
│  (Gesture handling)   │──▶ Determines if threshold met
└───────────┬───────────┘
            │
            ▼ (if threshold met)
┌───────────────────────┐
│    handleChoice()     │──▶ Retrieves current card data
│     (App.tsx)         │──▶ Looks up outcome (LEFT/RIGHT)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   makeChoice() call   │──▶ Dispatches CHOICE_MADE action
│   (useGameState API)  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    gameReducer        │──▶ Updates: hype, heat, budget
│   (State mutation)    │──▶ Appends to history array
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  setFeedbackOverlay   │──▶ Shows personality feedback
│   (Local UI state)    │──▶ Triggers voice playback
└───────────┬───────────┘
            │
            ▼
User clicks "Next ticket"
            │
            ▼
┌───────────────────────┐
│   handleNextIncident  │──▶ Dispatches NEXT_INCIDENT action
│                       │──▶ Hides overlay, advances card
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    gameReducer        │──▶ Checks death conditions
│  (Death detection)    │──▶ OR advances to boss fight
│                       │──▶ OR moves to next card
└───────────────────────┘
```

### Voice Playback Flow

```
Stage changes OR feedback shown
           │
           ▼
┌───────────────────────┐
│   useVoicePlayback    │──▶ Determines trigger type:
│      (Effect)         │    • 'onboarding' (ROLE_SELECT)
└───────────┬───────────┘    • 'failure' (GAME_OVER)
            │                • 'victory' (SUMMARY)
            │                • 'feedback_*' (card-specific)
            ▼
┌───────────────────────┐
│    loadVoice()        │──▶ Constructs path: /audio/voices/{personality}/{trigger}.wav
│  (voicePlayback.ts)   │──▶ Fetches audio file
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    playVoice()        │──▶ Creates HTMLAudioElement
│                       │──▶ Plays at 60% volume (VOLUME = 0.6)
└───────────────────────┘
```

---

## State Management

### GameState Interface

```typescript
interface GameState {
  // Core metrics (0-100 scale for hype/heat)
  hype: number;           // Public perception & excitement
  heat: number;           // Regulatory/legal pressure
  budget: number;         // Starting: $10,000,000

  // Progress tracking
  stage: GameStage;       // Current game stage
  personality: PersonalityType | null;
  role: RoleType | null;
  currentCardIndex: number;
  history: Array<{ cardId: string; choice: 'LEFT' | 'RIGHT' }>;

  // End game tracking
  deathReason: string | null;
  deathType: DeathType | null;
  unlockedEndings: DeathType[];
  bossFightAnswers: boolean[];
}
```

### State Transitions (Finite State Machine)

```
                    ┌─────────────┐
         ┌─────────▶│    INTRO    │◀────────────────┐
         │          └──────┬──────┘                 │
         │                 │ startGame()            │
         │                 ▼                        │
         │          ┌─────────────┐                 │
         │          │ PERSONALITY │                 │
         │          │   SELECT    │                 │
         │          └──────┬──────┘                 │
         │                 │ selectPersonality()    │
         │                 ▼                        │
         │          ┌─────────────┐                 │
         │          │ ROLE SELECT │                 │
         │          └──────┬──────┘                 │
         │                 │ selectRole()           │
         │                 ▼                        │
         │          ┌─────────────┐                 │
         │          │ INITIALIZING│ (3s countdown)  │
         │          └──────┬──────┘                 │
         │                 │                        │
         │                 ▼                        │
    resetGame()     ┌─────────────┐                 │
         │          │   PLAYING   │◀───────────────┤
         │          │  (Card loop)│                │
         │          └──────┬──────┘                │
         │                 │                        │
         │     ┌───────────┴───────────┐           │
         │     │                       │           │
         │     ▼                       ▼           │
         │  ┌─────────┐          ┌──────────┐      │
         └──│BOSS_FIGHT│         │ GAME_OVER│──────┘
            └────┬────┘          │(death)   │
                 │               └──────────┘
        completeBossFight()
                 │
                 ▼
            ┌─────────┐
            │ SUMMARY │
            │(success)│
            └────┬────┘
                 │
                 └────────────────▶ (reset to INTRO)
```

### Action Types

| Action | Payload | Description |
|--------|---------|-------------|
| `STAGE_CHANGE` | `stage`, `personality?`, `role?` | Transition between game stages |
| `CHOICE_MADE` | `direction`, `outcome` | Record user card decision |
| `NEXT_INCIDENT` | - | Advance to next card or trigger endgame |
| `BOSS_ANSWER` | `isCorrect` | Record boss fight answer |
| `BOSS_COMPLETE` | `success` | Finish boss fight, determine outcome |
| `RESET` | - | Reset to initial state (preserve unlocked endings) |

---

## Component Architecture

### Component Hierarchy

```
App.tsx (Root Container)
│
├─ LayoutShell (Responsive wrapper)
│  │
│  ├─ renderStage() switches on state.stage:
│  │  │
│  │  ├─ IntroScreen
│  │  ├─ PersonalitySelect
│  │  ├─ RoleSelect
│  │  ├─ InitializingScreen
│  │  ├─ GameScreen (Complex nested structure)
│  │  │  ├─ GameHUD (hype/heat/budget display)
│  │  │  ├─ CardStack (swipeable cards)
│  │  │  │  ├─ Next Card (behind)
│  │  │  │  └─ Current Card (front, interactive)
│  │  │  ├─ RoastTerminal (AI chat input)
│  │  │  └─ Taskbar (time/personality display)
│  │  ├─ BossFight (quiz interface)
│  │  ├─ GameOver
│  │  └─ SummaryScreen
│  │
│  └─ FeedbackOverlay (Modal - conditionally rendered)
│
└─ (Background audio/voice management)
```

### Component Responsibilities

| Component | Responsibility | Key Props |
|-----------|---------------|-----------|
| `IntroScreen` | Game entry, start CTA | `onStart` |
| `PersonalitySelect` | AI personality choice | `onSelect`, `isReady`, `hoverEnabled` |
| `RoleSelect` | Corporate role choice | `onSelect`, `isReady`, `hoverEnabled` |
| `InitializingScreen` | Countdown transition | `role`, `personality`, `countdown` |
| `GameScreen` | Main gameplay orchestration | `state`, swipe handlers, roast props |
| `CardStack` | Swipe gesture visualization | `offset`, `direction`, `onTouchStart/Move/End` |
| `GameHUD` | Metrics display | `hype`, `heat`, `budget` |
| `RoastTerminal` | AI workflow analysis | `input`, `output`, `isLoading` |
| `Taskbar` | Windows 95-style status bar | `personality`, `currentTime` |
| `BossFight` | Final quiz challenge | `question`, `timeLeft`, `onAnswer` |
| `FeedbackOverlay` | Choice consequence modal | `text`, `lesson`, `fine`, `onNext` |
| `GameOver` | Death screen | `state`, `onRestart` |
| `SummaryScreen` | Victory screen | `state`, `onRestart` |

---

## Game Loop & Stage Flow

### The Card Loop (Core Gameplay)

```
┌─────────────────────────────────────────────────────────────┐
│                      CARD LOOP CYCLE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐                                          │
│   │ Card Stack   │  ← User sees current card with scenario  │
│   │ (Visual)     │                                          │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ▼ Swipe/Click                                       │
│   ┌──────────────┐                                          │
│   │   Choice     │  ← LEFT or RIGHT option selected        │
│   │  (Outcome)   │                                          │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ▼ Calculate                                         │
│   ┌──────────────┐                                          │
│   │   Update     │  ← hype += outcome.hype                 │
│   │   Metrics    │     heat += outcome.heat                │
│   │              │     budget -= outcome.fine              │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ▼ Show                                              │
│   ┌──────────────┐                                          │
│   │   Feedback   │  ← Personality-specific commentary       │
│   │   Overlay    │     + Governance lesson                  │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ▼ Click "Next"                                      │
│   ┌──────────────┐                                          │
│   │  Check End   │  ← budget <= 0 ? BANKRUPT               │
│   │ Conditions   │     heat >= 100 ? DEATH                 │
│   │              │     last card ? BOSS_FIGHT              │
│   └──────┬───────┘                                          │
│          │                                                   │
│          └─────────── No ───────▶ Next Card (loop back)    │
│                     (Yes triggers endgame)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Death Condition Matrix

```typescript
function determineDeathType(budget, heat, hype, role): DeathType {
  if (budget <= 0) 
    → BANKRUPT
  
  if (heat >= 100) {
    if (hype <= 10) 
      → REPLACED_BY_SCRIPT
    if (role === FINANCE) 
      → PRISON
    if (role === MARKETING) 
      → CONGRESS
    if (role === MANAGEMENT) 
      → AUDIT_FAILURE
    else 
      → FLED_COUNTRY
  }
}
```

### Boss Fight Mechanics

```
Playing stage ends (all cards completed)
           │
           ▼
┌───────────────────────┐
│     BOSS_FIGHT        │
│  (5 quiz questions)   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  For each question:   │
│  • 30s timer          │
│  • 4 answer choices   │
│  • Correct: continue  │
│  • Wrong: -$1M budget │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   After 5 questions   │
│  correct >= 3 ?       │
└───────────┬───────────┘
        Yes │ No
           ▼ ▼
     ┌─────────┐ ┌──────────┐
     │ SUMMARY │ │ GAME_OVER│
     │Victory  │ │(Audit    │
     │         │ │ Failure) │
     └─────────┘ └──────────┘
```

---

## Integration Points

### External API Dependencies

| Service | Endpoint | Purpose | Fallback Behavior |
|---------|----------|---------|-------------------|
| **Google Gemini** | `/api/roast` | Dynamic roast generation | "Roast service unavailable" message |
| **Gemini TTS** | `/api/speak` | Real-time voice synthesis | Silent (graceful degradation) |

### Browser APIs Used

| API | Usage |
|-----|-------|
| `Web Audio API` | Voice playback from WAV files |
| `Touch Events` | Mobile swipe gestures |
| `Pointer Events` | Unified mouse/touch handling |
| `requestAnimationFrame` | Smooth card drag animations |
| `localStorage` | (Reserved for future progress persistence) |

### Environment Variables

```bash
VITE_ENABLE_SPEECH=true|false    # Toggle TTS generation
GEMINI_API_KEY=xxx               # Google AI API access
```

---

## File Dependencies

```
App.tsx
├── hooks/
│   ├── useGameState.ts ─────▶ types.ts, constants.ts
│   ├── useSwipeGestures.ts ─▶ (self-contained)
│   ├── useVoicePlayback.ts ─▶ services/voicePlayback.ts
│   ├── useRoast.ts ─────────▶ services/geminiService.ts
│   ├── useBossFight.ts ─────▶ constants.ts
│   ├── useStageReady.ts ────▶ types.ts
│   ├── useCountdown.ts ─────▶ (self-contained)
│   └── useClock.ts ─────────▶ (self-contained)
│
├── components/
│   ├── LayoutShell.tsx
│   └── game/
│       ├── GameScreen.tsx ──▶ CardStack, GameHUD, RoastTerminal, Taskbar
│       ├── CardStack.tsx ───▶ constants.ts, types.ts
│       ├── FeedbackOverlay.tsx ─▶ constants.ts
│       ├── BossFight.tsx ───▶ constants.ts
│       └── [Other screens] ─▶ constants.ts, types.ts
│
├── services/
│   ├── geminiService.ts ────▶ types.ts
│   └── voicePlayback.ts ────▶ (self-contained)
│
└── [types.ts, constants.ts] ◀── Shared across all
```

---

## Performance Considerations

1. **State Updates**: Immutable updates via spread operator, React's built-in optimization
2. **Animations**: `requestAnimationFrame` for swipe physics, CSS transitions for card exit
3. **Audio**: Pre-loaded voice assets, single Audio instance management
4. **Rendering**: `React.memo` on LayoutShell, selective re-renders via stage switching
5. **Bundle**: Code-splitting ready (currently single-bundle SPA)

---

*Document generated for SwipeRisk codebase analysis*
