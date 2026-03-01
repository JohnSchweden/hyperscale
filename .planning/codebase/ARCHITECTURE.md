# Architecture

**Analysis Date:** 2026-03-01

## Pattern Overview

**Overall:** Single-Page Application (SPA) with React, using a centralized state machine pattern for game flow

**Key Characteristics:**
- React 19 with functional components and hooks
- useReducer for centralized game state management
- Stage-based game flow with deterministic transitions
- Client-side only (no backend API, external services for TTS/AI via client SDKs)

## Layers

### UI Layer (Components)
- **Location:** `components/LayoutShell.tsx`
- **Purpose:** Responsive layout wrapper that handles desktop centering vs mobile top-anchor positioning
- **Contains:** Single reusable layout component with header/footer slots
- **Used by:** All stage renderers in `App.tsx`

### Application Layer (Main Component)
- **Location:** `App.tsx` (1499 lines)
- **Purpose:** Central orchestrator for entire game experience
- **Contains:**
  - Game state management via useReducer
  - All stage render functions (renderIntro, renderPersonalitySelect, renderRoleSelect, renderGame, renderBossFight, renderGameOver, renderSummary)
  - Swipe gesture handling
  - Audio playback integration
- **Depends on:** `types.ts`, `constants.ts`, `services/voicePlayback.ts`, `services/geminiService.ts`, `components/LayoutShell.tsx`

### Domain Layer (Types & Constants)
- **Location:** `types.ts`, `constants.ts`
- **Purpose:** Game domain models and static data
- **Contains:**
  - `types.ts`: Enums (PersonalityType, RoleType, AppSource, GameStage, DeathType) and interfaces (Card, GameState, BossQuestion)
  - `constants.ts`: Static game content (PERSONALITIES, DEATH_ENDINGS, BOSS_FIGHT_QUESTIONS, ROLE_CARDS)
- **Used by:** App.tsx, services

### Service Layer (External Integrations)
- **Location:** `services/geminiService.ts`, `services/voicePlayback.ts`
- **Purpose:** Abstract external API calls and audio playback
- **Contains:**
  - `geminiService.ts`: Gemini AI integration for TTS (speak function) and satirical roast generation (getRoast)
  - `voicePlayback.ts`: Audio loading and playback utilities
- **Used by:** App.tsx

### Entry Point
- **Location:** `index.tsx`
- **Purpose:** React DOM root mounting
- **Triggers:** Browser loads index.html which loads index.tsx via Vite
- **Responsibilities:** Find #root element, create React root, render App component

## Data Flow

**Game State Flow:**

1. User clicks "Boot system" → dispatch STAGE_CHANGE → INTRO → PERSONALITY_SELECT
2. User selects personality → dispatch STAGE_CHANGE → PERSONALITY_SELECT → ROLE_SELECT
3. User selects role → dispatch STAGE_CHANGE → ROLE_SELECT → INITIALIZING
4. Countdown completes → dispatch STAGE_CHANGE → INITIALIZING → PLAYING
5. User makes swipe choice → dispatch CHOICE_MADE → updates hype/heat/budget
6. User clicks "Next ticket" → dispatch NEXT_INCIDENT → increments card index or triggers BOSS_FIGHT/GAME_OVER
7. Boss fight answers → dispatch BOSS_ANSWER → updates budget
8. Boss fight completes → dispatch BOSS_COMPLETE → SUMMARY or GAME_OVER

**State Management:**
- Single useReducer hook with GameState
- State shape: { hype, heat, budget, stage, personality, role, currentCardIndex, history, deathReason, deathType, unlockedEndings, bossFightAnswers }
- Actions dispatched for all state changes
- Derived state computed in render functions

## Key Abstractions

**GameStage State Machine:**
- Purpose: Control game flow through discrete stages
- Examples: `App.tsx` lines 102-111 define STAGE_TRANSITIONS map
- Pattern: useReducer with explicit transition validation

**Card Decision System:**
- Purpose: Each card has left/right outcomes with hype/heat/fine values
- Examples: `constants.ts` ROLE_CARDS record contains all game scenarios
- Pattern: Static data-driven, no dynamic content

**Personality Feedback System:**
- Purpose: Different AI personalities provide unique commentary
- Examples: Card.onRight.onLeft feedback objects keyed by PersonalityType
- Pattern: Enum-keyed static feedback lookup

## Entry Points

**index.tsx:**
- Location: `/Users/yevgenschweden/swiperisk/index.tsx`
- Triggers: Browser loads bundled JS
- Responsibilities: Mount React root, render App

**App Component:**
- Location: `/Users/yevgenschweden/swiperisk/App.tsx`
- Triggers: index.tsx renders it
- Responsibilities: All game logic, UI rendering, state management

## Error Handling

**Strategy:** Minimal error boundaries, graceful degradation

**Patterns:**
- Console errors for invalid state transitions (lines 117-121)
- Try/catch in service calls with fallback messages
- Graceful TTS disable via VITE_ENABLE_SPEECH env var

## Cross-Cutting Concerns

**Validation:** Stage transitions validated against STAGE_TRANSITIONS map before applying

**Authentication:** Not applicable (single-player game)

**Logging:** console.log/warn/error for debugging, no structured logging

---

*Architecture analysis: 2026-03-01*
