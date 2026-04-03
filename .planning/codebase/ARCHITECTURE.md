# Architecture

**Analysis Date:** 2026-04-03

## Pattern Overview

**Overall:** Finite State Machine (FSM) + Custom Hook Composition

**Key Characteristics:**
- Centralized `GameStage` enum + `VALID_TRANSITIONS` map validates all stage changes
- State mutations only via `gameReducer` (useReducer pattern in `useGameState`)
- Custom hooks as domain controllers (swipe, voice, boss fight, roast, pressure, music)
- Barrel exports for module organization
- Role-scoped and personality-scoped content (card decks, endings, feedback keyed by enums)
- Pressure metadata per-card for urgency and team impact
- Branching deck injection based on player history

## Layers

**Presentation (React Components):**
- Purpose: Render UI and wire event handlers
- Location: `components/`
- Contains: Screen components (`IntroScreen`, `GameScreen`, `BossFight`, `DebriefContainer`), composite UI (`CardStack`, `GameHUD`, `FeedbackOverlay`, `RoastTerminal`), layout (`LayoutShell`, `StarfieldBackground`)
- Depends on: Hooks, types, data
- Used by: `App.tsx` orchestrator

**State Management (useGameState + gameReducer):**
- Purpose: Single source of truth for all game state; validates stage transitions
- Location: `hooks/useGameState.ts`, `hooks/useGameState/` (submodules: `deathResolver.ts`, `hydration.ts`)
- Contains: `gameReducer` (switch on action type), action dispatchers, state hydration, death resolution logic, Kirk corruption handling
- Depends on: Types, data (card decks, branching injections)
- Used by: `App.tsx` (root hook initialization)

**Domain Hooks (Custom Hooks):**
- Purpose: Encapsulate subsystem logic
- Location: `hooks/`
- Examples:
  - `useSwipeGestures.ts` - Gesture tracking (offset, direction, threshold, snap-back animation)
  - `useVoicePlayback.ts` - TTS audio playback state and effects
  - `useBossFight.ts` - Boss quiz state machine (question, timer, answer validation)
  - `useRoast.ts` - AI roast generation (input, output, loading state)
  - `useIncidentPressure.ts` - Countdown escalation (urgent, critical, team impact lookup)
  - `useBackgroundMusic.ts` - BGM state (volume control, playlist, track cycling)
  - `useCountdown.ts` - Generic countdown timer
  - `useClock.ts` - Current time for taskbar display
  - `useDebrief.ts` - Debrief page navigation and archetype calculation
  - `useStageReady.ts` - Ghost-click prevention via stage readiness debounce
- Used by: `App.tsx` composes all of them

**Data Layer:**
- Purpose: Immutable content (card decks, personalities, roles, endings, rules, images)
- Location: `data/`
- Contains:
  - `cards/` - Role-specific card decks (Finance, Management, Marketing, HR, Development, Cleaning)
  - `index.ts` - Barrel export of all data
  - `archetypes.ts` - Archetype definitions and calculation logic
  - `bossQuestions.ts` - Boss fight quiz questions
  - `deathEndings.ts` - Failure ending copy
  - `deathVectors.ts` - Death type frequency accumulation
  - `failureLessons.ts` - Failure-specific commentary
  - `imageMap.ts` - Image path resolution for cards, outcomes, archetypes, deaths
  - `incidents.ts` - Real-world incident reference data
  - `kirkCards.ts` - Kirk Easter Egg cards (injected on second refusal)
  - `personalities.ts` - AI companion definitions
  - `pressureScenarios.ts` - Card-level urgency configuration (keyed by card ID)
  - `roles.ts` - Role definitions, icons, descriptions
  - `bgmPlaylist.ts` - Background music tracks
  - `choiceLabels.ts`, `violations.ts`, `sources.ts` - Enum-to-string mappings
- Depends on: Types only
- Used by: State machine (branching injection, death resolution), hooks, components

**Services (Utilities & APIs):**
- Purpose: API calls, audio playback, utility functions
- Location: `services/`, `utils/`, `lib/`
- Key files:
  - `geminiService.ts` - Gemini 2.5 TTS API wrapper
  - `geminiLive.ts` - Live API integration for voice input
  - `roastService.ts` - AI roast generation (calls backend API)
  - `pressureAudio.ts` - Countdown audio beeps and context management
  - `voicePlayback.ts` - Audio element creation and playback
  - `kirkAudio.ts` - Easter egg audio effects (glitch, crash)
  - `radioEffect.ts` - Audio processing effects
  - `lib/deck.ts` - Shuffle (Fisher-Yates) and branch injection algorithms
  - `lib/feedbackAudioChoice.ts` - Audio file path resolution
  - `utils/haptic.ts` - Haptic feedback trigger (vibration API)
  - `utils/kirkText.ts` - Kirk Easter Egg text utilities
- Used by: Hooks and components

## Data Flow

**Game Initialization:**

1. `index.tsx` mounts, renders `<App />`
2. `App.tsx` initializes `useGameState` → `gameReducer` with `initialGameState` (INTRO stage)
3. All domain hooks initialized in composition
4. User clicks "Start" → `handleIntroStart()` → `startGame()` dispatch
5. `gameReducer` validates INTRO→PERSONALITY_SELECT, updates stage
6. `App.tsx` re-renders, switch statement routes to `<PersonalitySelect>`

**Card Swipe Flow:**

1. User touches/clicks card → `useSwipeGestures.onTouchStart()` captures position, sets `isDragging: true`
2. User drags → `onTouchMove()` calculates `deltaX`, updates `offset` and `direction` state
3. Offset exceeds `SWIPE_PREVIEW_THRESHOLD` → card shows visual preview (opacity shift, label hint)
4. Offset exceeds `SWIPE_THRESHOLD` (100px) → `onBeforeSwipe()` callback triggers haptics
5. User releases → `onTouchEnd()` finalizes direction
6. `handleChoice()` (App.tsx) called:
   - Gets current card from `state.effectiveDeck[state.currentCardIndex]`
   - Looks up `card.onLeft` or `card.onRight` based on direction
   - Extracts personality-specific feedback via `feedback[state.personality]`
   - Calls `applyChoice(direction, card)` which:
     - Sets `feedbackOverlay` state (includes lesson, fine, violation, team impact if any)
     - Dispatches `CHOICE_MADE` action with stat deltas
7. `gameReducer` processes `CHOICE_MADE`:
   - Updates `hype = Math.max(0, hype + outcome.hype)`
   - Updates `heat = Math.min(100, heat + outcome.heat)`
   - Updates `budget = budget - outcome.fine`
   - Appends to `history: [{cardId, choice}]`
8. Feedback overlay visible on screen for 2-3 seconds
9. User clicks "Next incident" → `handleNextIncident()`:
   - Clears `feedbackOverlay` state
   - Checks loss conditions:
     - If `budget <= 0` → creates game-over state with BANKRUPT death
     - If `heat >= 100` → creates game-over state with death type resolved via `resolveDeathType()`
   - Else: calls `resolveDeckWithBranching()`:
     - Looks up last history entry: `{cardId, choice}`
     - Constructs branch key: `"cardId:choice"`
     - If key exists in `BRANCH_INJECTIONS`, splices those cards at `currentCardIndex + 1`
   - Increments `currentCardIndex`
   - If `currentCardIndex >= cards.length` → transitions to BOSS_FIGHT, else stays PLAYING
   - Resets swipe gesture state via `swipe.reset()`

**Pressure/Countdown Flow:**

1. Before rendering each card, `useIncidentPressure()` runs:
   - Looks up card ID in `PRESSURE_SCENARIOS` data
   - If found and `urgent: true`:
     - Sets `isUrgent: true`, `countdownSec: X`
     - `timeoutResolvesTo: "LEFT" | "RIGHT"`
     - Optional `criticalForHaptics: true`
2. `useCountdown()` initialized with these values → starts countdown timer
3. `GameHUD` renders timer display (if active)
4. On every second: countdown decrements
5. On expiry (countdown reaches 0):
   - `handleTimerExpiry()` fires
   - Checks locks to prevent race conditions
   - Gets `timeoutResolvesTo` direction from pressure metadata
   - Calls `applyChoice(direction, currentCard)` automatically
   - User sees auto-resolution without any swipe
6. If `criticalForHaptics: true`, swipes also trigger haptic feedback

**Boss Fight Flow:**

1. After deck exhausted (all cards played) → dispatches `STAGE_CHANGE` to BOSS_FIGHT
2. `useBossFight()` hook:
   - Initializes with 5 questions from `BOSS_FIGHT_QUESTIONS`
   - Manages question rotation, timer (30s per question), answer validation
3. `BossFight` component renders current question + 4 answer choices
4. User selects answer → `handleAnswer()`:
   - Checks if correct against `question.correctAnswer`
   - Dispatches `BOSS_ANSWER` action with `isCorrect` boolean
   - `gameReducer` appends to `bossFightAnswers` array, deducts -1M budget if wrong
   - Shows explanation (conditionally)
5. User clicks "Next" → advances to next question or completion
6. After 5 questions → `completeBossFight(success)`:
   - Counts correct answers
   - If `correctCount >= 3` → success, transitions to DEBRIEF_PAGE_1
   - Else → failure, creates game-over state (AUDIT_FAILURE death)

**Debrief/Results Flow:**

1. Stage transitions to DEBRIEF_PAGE_1
2. `useDebrief()` computes archetype on mount:
   - Calls `calculateArchetype(history, budget, heat, hype, role)`
   - Maps choice history to personality traits → determines archetype ID
   - Looks up archetype definition from `ARCHETYPES` data
   - If death type is KIRK → override archetype to KIRK
3. `DebriefContainer` renders current page:
   - PAGE_1: Archetype card with description, resilience score, image badge
   - PAGE_2: Audit trail (list of choices with outcomes)
   - PAGE_3: Verdict page with archetype image and retry prompt
4. User navigates: PAGE_1 → PAGE_2 → PAGE_3 via `nextPage()` calls
5. Final page offers restart → `handleRestart()`:
   - Calls `resetGame()` → dispatches RESET action
   - `gameReducer` returns to initial state (preserves `unlockedEndings`)
   - Returns to INTRO stage

**State Management:**
- All state mutations go through `gameReducer` (pure function, no side effects)
- Actions dispatched via `dispatch()` or helper functions (startGame, makeChoice, etc.)
- Invalid stage transitions logged to console, state unchanged (game continues safely)
- Stage transitions strictly validated via `VALID_TRANSITIONS` map (9 stages, enforced edges)

## Key Abstractions

**GameStage Enum:**
- Purpose: Represents all possible screens/states in a finite state machine
- Values: `INTRO`, `PERSONALITY_SELECT`, `ROLE_SELECT`, `INITIALIZING`, `PLAYING`, `BOSS_FIGHT`, `DEBRIEF_PAGE_1`, `DEBRIEF_PAGE_2`, `DEBRIEF_PAGE_3`
- Pattern: Centralized in `types.ts`, routing logic in `App.tsx` switch statement, transition validation via `VALID_TRANSITIONS` map in `useGameState.ts`

**Card System:**
- Purpose: Represents a decision node (incident/scenario) in gameplay
- Structure: `{id, source, sender, context, storyContext, text, realWorldReference, onLeft, onRight, choiceSidesSwapped?}`
- Each outcome: `{label, hype, heat, fine, violation, lesson, deathVector?, feedback: {ROASTER, ZEN_MASTER, LOVEBOMBER}}`
- Pattern: Outcomes must include all three personality feedback strings (enforced in tests)
- Files: `data/cards/` (role-keyed), `lib/deck.ts` (shuffle + branching)
- Shuffle: Fisher-Yates + random choice swapping (prevents directional bias)
- Branching: Cards injected at specific positions based on prior choices (`BRANCH_INJECTIONS` map)

**PersonalityType Enum:**
- Purpose: AI companion type that personalizes feedback
- Values: `ROASTER` (caustic), `ZEN_MASTER` (calm), `LOVEBOMBER` (supportive)
- Pattern: Every `ChoiceOutcome.feedback` is a `Record<PersonalityType, string>` — must have all three keys
- Usage: Selected at PERSONALITY_SELECT stage, persists through entire game, drives `useVoicePlayback` behavior

**RoleType Enum:**
- Purpose: Player job titles with role-specific card decks and stat tiers
- Values: 10 roles (`CHIEF_SOMETHING_OFFICER` to `AGENTIC_ENGINEER`)
- Pattern: `ROLE_CARDS` map decks keyed by role, `ROLE_FINE_TIERS` for budget scaling, `ROLE_HEAT_SCALES` for heat ranges
- Usage: Selected at ROLE_SELECT stage, controls which deck is played, budget initialization

**DeathType Enum:**
- Purpose: Failure ending types with unique outcomes and lessons
- Values: 7 types (`BANKRUPT`, `KIRK`, `PRISON`, `CONGRESS`, `FLED_COUNTRY`, `REPLACED_BY_SCRIPT`, `AUDIT_FAILURE`)
- Pattern: `DEATH_ENDINGS` map provides failure-specific copy, `DEATH_IMAGES` provides image paths
- Determination: `resolveDeathType()` maps heat/budget/role to death type, or timeout-driven

**Archetype System:**
- Purpose: Classification of player decision-making style (calculated post-game)
- Types: `PRAGMATIST`, `SHADOW_ARCHITECT`, `DISRUPTOR`, `CONSERVATIVE`, `BALANCED`, `CHAOS_AGENT`, `KIRK`
- Calculation: `calculateArchetype(history, budget, heat, hype, role)` maps choice outcomes to traits
- Pattern: Calculated once on DEBRIEF_PAGE_1 entry, cached in debrief hook
- Usage: Drives debrief narrative, image badge selection, resilience score calculation

**Pressure Metadata:**
- Purpose: Card-level configuration for urgency and emotional weight
- Location: `data/pressureScenarios.ts` (keyed by card ID)
- Structure: `{urgent: bool, countdownSec: number, timeoutResolvesTo: "LEFT"|"RIGHT", criticalForHaptics?: bool, outcomes?: {LEFT?: {teamImpact?: string}, RIGHT?: {...}}}`
- Usage: Looked up at PLAYING stage before each card, drives countdown timer and visual stress indicators
- Team Impact: Displayed in feedback overlay if present, shows consequence for team morale/retention

## Entry Points

**Root Mount:**
- Location: `index.tsx`
- Triggers: React app initialization (dev server or build artifact)
- Responsibilities: Imports Vercel Analytics, optional WebMCP polyfill (dev only), renders `<App />` to DOM

**App Component:**
- Location: `App.tsx`
- Triggers: On mount (only once), then on state updates
- Responsibilities:
  - Initializes all custom hooks (state machine, gestures, voice, music, etc.)
  - Implements stage routing via switch statement (lines 453–574)
  - Handles cross-cutting concerns (scroll to top on stage change, Kirk corruption persistence)
  - Wires event handlers from hooks to components
  - Renders `StarfieldBackground` wrapper with BGM state
  - Conditionally renders `FeedbackOverlay` and `PressureCueController` during gameplay
  - Dev-only: Lazy-loads `WebMCPToolsProvider` for MCP tools

**Game Stage Rendering:**
- Switch statement in `App.tsx` (lines 453–574) routes to screen components based on `state.stage`
- Example: `GameStage.PLAYING` → renders `<GameScreen>` + `<PressureCueController>` + optional `<FeedbackOverlay>`

## Error Handling

**Strategy:** Graceful degradation with console logging

**Patterns:**
- **Invalid stage transitions**: Logged via `logInvalidTransition()`, state unchanged (game continues safely)
- **Missing root element**: Throws fatal error (prevents app mount)
- **Personality/role not set before action**: Early return in handler (prevented by stage validation)
- **Budget/heat overflow**: Clamped (budget: `max(0, ...)`, heat: `min(100, ...)`)
- **Deck exhaustion**: Seamlessly transitions to BOSS_FIGHT (no crash)
- **Kirk corruption edge case**: After second refusal, corrupted cards injected, transitions to KIRK death on finale card
- **Pressure audio context errors**: Logged, graceful fallback (silent countdown)
- **Voice playback failure**: Silent (no error thrown), game continues

## Cross-Cutting Concerns

**Logging:**
- Console-based in dev mode only (via `process.env.NODE_ENV !== "production"`)
- Invalid stage transitions logged via `logInvalidTransition()`
- Pressure audio context errors logged in services

**Validation:**
- Stage transitions validated via `isValidStageTransition()` against `VALID_TRANSITIONS` map
- Personality-specific feedback required for all outcomes (enforced in Playwright tests)
- Budget and heat bounds clamped on state updates (0-100 scale for heat)

**Authentication:**
- Not applicable (single-player offline-capable game)

**Performance Optimization:**
- Deck shuffle happens once at INITIALIZING→PLAYING transition (Fisher-Yates, O(n))
- Archetype calculation memoized in `useDebrief()` via `useMemo()` (only recalculates when `state.history` changes)
- Background music managed separately via `useBackgroundMusic()` (decoupled from game state, allows volume control)
- WebMCP dev tools lazy-loaded only in development mode via dynamic import (tree-shaken from production)
- Swipe gesture state reset on card change to prevent animation artifacts
- Feedback overlay state cleared before advancing (prevents double-trigger)
