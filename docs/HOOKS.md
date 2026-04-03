# Custom Hooks Documentation

## Overview

K-Maru uses a modular custom hook architecture to encapsulate game logic, audio systems, gesture handling, and external integrations. All hooks are exported from `hooks/index.ts` as the public API.

Hooks fall into three categories:

| Category | Hooks | Purpose |
|----------|-------|---------|
| **Core Game** | `useGameState`, `useArchetype`, `useBossFight`, `useDebrief`, `useCountdown` | State machine, scoring, progression |
| **Sensory/Audio** | `useBackgroundMusic`, `usePressureAudio`, `useVoicePlayback`, `useSpeechRecognition`, `useLiveAPISpeechRecognition` | Audio playback, voice input, ambient effects |
| **UI/UX** | `useSwipeGestures`, `useStageReady`, `useIncidentPressure`, `useRoast`, `useEmailCapture`, `useUnlockedEndings`, `useClock`, `useWebMCPTools` | Interaction, readiness, meta-features |

## Hook Dependency Graph

```
useGameState ─────────────────────────────┐
  │                                       │
  ├── useArchetype ◄── history, budget, heat, hype, role, deathType
  ├── useDebrief ◄── state, dispatch
  ├── useIncidentPressure ◄── state, currentCard, isChoiceResolving
  ├── useUnlockedEndings ◄── unlockedEndings
  ├── useStageReady ◄── stage, targetStage
  ├── useBossFight ◄── isActive, onAnswer, onComplete, currentAnswers
  ├── useVoicePlayback ◄── stage, personality, feedbackCardId, deathType, archetypeId
  ├── useWebMCPTools ◄── state, swipe, bossFight, feedbackOverlay, handlers
  │                                       │
useSwipeGestures ────────────────────────┤
  │                                       │
  ├── useIncidentPressure (consumes swipe context)
  ├── useWebMCPTools (wraps swipe controls)
  │                                       │
useBackgroundMusic ──────────────────────┤
  │                                       │
  └── usePressureAudio (subscribes to voice activity from voicePlayback service)
                                          │
usePressureAudio ◄── hasHighPressure, isCritical, countdownValue, countdownSec
  │                                       │
  └── useIncidentPressure (provides isCritical, countdownSec)
```

### Submodule Structure

`useGameState` has internal submodules:

```
hooks/useGameState/
  index.ts          — re-exports from submodules
  hydration.ts      — localStorage restore (debug state > saved state > default)
  deathResolver.ts  — death type resolution, game-over state creation
```

---

## Individual Hook Documentation

### useArchetype

Calculates the player's leadership archetype and resilience score from gameplay history.

| Property | Details |
|----------|---------|
| **File** | `hooks/useArchetype.ts` |
| **Purpose** | Compute archetype identity (PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, etc.) and resilience score (0-100) |
| **Pure** | Yes — memoized, no side effects |

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `history` | `{ cardId: string; choice: "LEFT" | "RIGHT" }[]` | Decision history from game state |
| `finalBudget` | `number` | Final budget at game end |
| `finalHeat` | `number` | Final heat at game end |
| `finalHype` | `number` | Final hype at game end |
| `role` | `RoleType \| null` | Selected role type |
| `deathType` | `string \| null` (optional) | Death type; `KIRK` overrides normal calculation |

**Return Value**

```typescript
interface UseArchetypeResult {
  archetype: Archetype | null;
  resilience: number;
}
```

**Dependencies**

- `data/archetypes` — `ARCHETYPES` constant and `calculateArchetype()` function
- `types.ts` — `Archetype`, `DeathType`, `RoleType`

**Important Notes**

- Uses `useMemo` — calculates once when dependencies change, not on every render
- `DeathType.KIRK` short-circuits to `ARCHETYPES.KIRK` with resilience 0
- Return `archetype` is `null` if calculation returns nothing

**Usage**

```typescript
const { archetype, resilience } = useArchetype(
  state.history,
  state.budget,
  state.heat,
  state.hype,
  state.role,
  state.deathType,
);
```

---

### useBackgroundMusic

Manages background music playback with volume control, track skipping, voice ducking, and session persistence.

| Property | Details |
|----------|---------|
| **File** | `hooks/useBackgroundMusic.ts` |
| **Purpose** | Playlist-based BGM with user preferences, voice ducking, and session resume |
| **Side Effects** | Creates `HTMLAudioElement`, subscribes to voice activity, writes to `sessionStorage` and `localStorage` |

**Parameters**

None.

**Return Value**

```typescript
interface UseBackgroundMusicResult {
  currentTrackTitle: string;
  userVolume: number;
  setUserVolume: (v: number) => void;
  enabled: boolean;
  toggleEnabled: () => void;
  skipNext: () => void;
  bgmVolumeMin: number;    // 0
  bgmVolumeMax: number;    // 1
  bgmVolumeStep: number;   // 0.05
}
```

**Side Effects**

- Creates and manages an `HTMLAudioElement` via `useLayoutEffect`
- Subscribes to voice activity via `subscribeVoiceActivity()` for ducking
- Persists volume and enabled state to `localStorage`
- Persists track index and playback time to `sessionStorage` (flushed every 2s and on `pagehide`)
- Auto-advances to next track on `ended` event

**Important Notes**

- Default volume is `0.2`, stored under key `k-maru-bgm-volume`
- Enabled state stored under `k-maru-bgm-enabled`
- Session progress (`k-maru-bgm-session-track`, `k-maru-bgm-session-time`) is cleared when BGM is disabled
- Voice ducking reduces volume to 20% during voice activity, then ramps back over 1200ms using easeOutCubic
- Playlist loops: `(trackIndex + 1) % BGM_TRACKS.length`
- `playinline` and `webkit-playsinline` attributes set for iOS compatibility

**Usage**

```typescript
const {
  currentTrackTitle,
  userVolume,
  setUserVolume,
  enabled,
  toggleEnabled,
  skipNext,
} = useBackgroundMusic();
```

---

### useBossFight

Manages the boss fight quiz mechanics with timed questions and scoring.

| Property | Details |
|----------|---------|
| **File** | `hooks/useBossFight.ts` |
| **Purpose** | Question progression, 30-second timer, answer validation, completion logic |
| **Side Effects** | Timer via `setTimeout` |

**Parameters**

```typescript
interface UseBossFightOptions {
  isActive: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onComplete: (success: boolean) => void;
  currentAnswers: boolean[];
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `isActive` | `boolean` | Whether the boss fight is currently active |
| `onAnswer` | `(isCorrect: boolean) => void` | Callback when a question is answered |
| `onComplete` | `(success: boolean) => void` | Callback when all questions are answered; `success` is `true` if >= 3 correct |
| `currentAnswers` | `boolean[]` | Array of answer results accumulated so far |

**Return Value**

```typescript
interface UseBossFightResult {
  currentQuestion: number;
  timeLeft: number;
  showExplanation: boolean;
  hasAnswered: boolean;
  question: BossQuestion | undefined;
  fixedAnswers: string[];
  correctCount: number;
  totalAnswered: number;
  handleAnswer: (isCorrect: boolean) => void;
  nextQuestion: () => void;
}
```

**Dependencies**

- `data` — `BOSS_FIGHT_QUESTIONS` array
- `types.ts` — `BossQuestion`

**Important Notes**

- Timer is 30 seconds per question, auto-fails on timeout
- Answers are shuffled using a seeded random (seed regenerated on each activation)
- Completion requires >= 3 correct answers out of total questions
- Reset occurs when `isActive` transitions to `true`

**Usage**

```typescript
const {
  currentQuestion,
  timeLeft,
  question,
  fixedAnswers,
  hasAnswered,
  showExplanation,
  handleAnswer,
  nextQuestion,
} = useBossFight({
  isActive: state.stage === GameStage.BOSS_FIGHT,
  onAnswer: (correct) => dispatch({ type: "BOSS_ANSWER", isCorrect: correct }),
  onComplete: (success) => dispatch({ type: "BOSS_COMPLETE", success }),
  currentAnswers: state.bossFightAnswers,
});
```

---

### useClock

Provides the current time as a formatted string.

| Property | Details |
|----------|---------|
| **File** | `hooks/useClock.ts` |
| **Purpose** | Display real-time clock in UI |
| **Pure** | No — uses `setInterval` |

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `updateInterval` | `number` | `10000` | Milliseconds between updates |

**Return Value**

`string` — Current time formatted as `HH:MM` (locale-aware, 2-digit hour/minute).

**Usage**

```typescript
const time = useClock(10000); // "14:32"
```

---

### useCountdown

Manages a countdown timer with completion and expiry callbacks.

| Property | Details |
|----------|---------|
| **File** | `hooks/useCountdown.ts` |
| **Purpose** | Generic countdown with activation gating, reset, and dual callbacks |
| **Side Effects** | Timer via `setTimeout` |

**Parameters**

```typescript
interface UseCountdownOptions {
  startFrom: number;
  onComplete: () => void;
  onExpire?: () => void;
  isActive: boolean;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `startFrom` | `number` | Starting value for the countdown |
| `onComplete` | `() => void` | Fired when countdown reaches 0 |
| `onExpire` | `() => void` (optional) | Fired on natural expiry (after ticking) |
| `isActive` | `boolean` | Whether the countdown is currently running |

**Return Value**

```typescript
interface UseCountdownResult {
  count: number;
  reset: () => void;
}
```

**Important Notes**

- Distinguishes between fresh activation (resets to `startFrom`) and natural expiry (fires `onExpire` then `onComplete`)
- Uses `hasTickedWhileActive` ref to track whether a tick occurred during the active period
- Resets to `startFrom` and clears tick flag when `isActive` becomes `false`
- If `startFrom` is 0 and `isActive` is true, fires `onComplete` immediately

**Usage**

```typescript
const { count, reset } = useCountdown({
  startFrom: 5,
  onComplete: () => dispatch({ type: "STAGE_CHANGE", stage: GameStage.PLAYING }),
  isActive: state.stage === GameStage.INITIALIZING,
});
```

---

### useDebrief

Manages debrief page navigation and archetype calculation.

| Property | Details |
|----------|---------|
| **File** | `hooks/useDebrief.ts` |
| **Purpose** | Archetype calculation on debrief entry, validated page progression |
| **Pure** | No — dispatches stage changes |

**Parameters**

```typescript
interface UseDebriefOptions {
  state: GameState;
  dispatch: React.Dispatch<
    | { type: "STAGE_CHANGE"; stage: GameStage; archetypeId?: string | null }
    | { type: "RESET" }
  >;
}
```

**Return Value**

```typescript
interface DebriefResult {
  archetype: Archetype | null;
  resilienceScore: number;
  nextPage: () => void;
  restart: () => void;
}
```

**Side Effects**

- Dispatches `STAGE_CHANGE` to advance debrief pages
- Dispatches `RESET` to restart the game

**Important Notes**

- Calculates archetype only when stage is `DEBRIEF_PAGE_1`, `DEBRIEF_PAGE_2`, or `DEBRIEF_PAGE_3`
- `nextPage` enforces strict progression: Page 1 -> Page 2 -> Page 3 (returns null for invalid transitions)
- `restart` dispatches `RESET` which preserves `unlockedEndings`
- Kirk death overrides archetype to `ARCHETYPES.KIRK`

**Usage**

```typescript
const { archetype, resilienceScore, nextPage, restart } = useDebrief({
  state,
  dispatch,
});
```

---

### useEmailCapture

Manages email capture and submission to the V2 waitlist.

| Property | Details |
|----------|---------|
| **File** | `hooks/useEmailCapture.ts` |
| **Purpose** | Email validation, API submission, and state management for waitlist signup |
| **Side Effects** | POST to `/api/v2-waitlist`, writes `v2-waitlist-submitted` to `localStorage` |

**Parameters**

```typescript
interface UseEmailCaptureOptions {
  role: string;
  archetype: string;
  resilience: number;
}
```

**Return Value**

```typescript
interface UseEmailCaptureReturn {
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  submit: () => Promise<void>;
}
```

**Important Notes**

- Email validated against `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- On success, clears email input and sets `v2-waitlist-submitted` flag in `localStorage`
- Error messages are user-friendly: "Please enter a valid email address" or "Something went wrong. Please try again."
- Return value is memoized via `useMemo`

**Usage**

```typescript
const { email, setEmail, isSubmitting, error, success, submit } = useEmailCapture({
  role: state.role ?? "",
  archetype: archetype?.name ?? "",
  resilience: resilienceScore,
});
```

---

### useGameState

Central game state management via `useReducer`. The primary state hook for the entire application.

| Property | Details |
|----------|---------|
| **File** | `hooks/useGameState.ts` |
| **Purpose** | State machine for game flow, score tracking, death resolution, Kirk easter egg |
| **Side Effects** | Debug state sync to `localStorage` (when `km-debug-state` key exists) |

**Parameters**

None.

**Return Value**

```typescript
interface UseGameStateResult {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  startGame: () => void;
  selectPersonality: (personality: PersonalityType) => void;
  selectRole: (role: RoleType) => void;
  makeChoice: (direction: "LEFT" | "RIGHT", outcome: { hype: number; heat: number; fine: number; cardId: string }) => void;
  nextIncident: () => void;
  answerBossQuestion: (isCorrect: boolean) => void;
  completeBossFight: (success: boolean) => void;
  resetGame: () => void;
}
```

**GameAction Types**

| Action | Payload | Effect |
|--------|---------|--------|
| `STAGE_CHANGE` | `stage`, optional `personality`, `role`, `currentCardIndex`, `shuffledDeck` | Validates transition, updates stage and related fields |
| `CHOICE_MADE` | `direction`, `outcome` | Updates hype, heat, budget, appends to history |
| `NEXT_INCIDENT` | none | Advances card index, checks for boss fight or game over |
| `BOSS_ANSWER` | `isCorrect` | Deducts 1M budget on wrong answer, records answer |
| `BOSS_COMPLETE` | `success` | Transitions to debrief (success) or game over (failure) |
| `KIRK_REFUSAL` | none | Increments Kirk counter, activates corruption on 2nd refusal |
| `RESET` | none | Returns to initial state, preserves `unlockedEndings` |

**Stage Transition Map**

```
INTRO -> PERSONALITY_SELECT
PERSONALITY_SELECT -> ROLE_SELECT
ROLE_SELECT -> INITIALIZING
INITIALIZING -> PLAYING
PLAYING -> BOSS_FIGHT | DEBRIEF_PAGE_1
BOSS_FIGHT -> DEBRIEF_PAGE_1
DEBRIEF_PAGE_1 -> DEBRIEF_PAGE_2
DEBRIEF_PAGE_2 -> DEBRIEF_PAGE_3
DEBRIEF_PAGE_3 -> INTRO
```

**Hydration Priority**

On initialization, state is restored in this order:
1. Debug state (`km-debug-state` in localStorage)
2. Saved state (`gameState` in localStorage)
3. Default initial state

**Important Notes**

- Invalid stage transitions are rejected silently (logged in dev mode)
- `NEXT_INCIDENT` checks budget <= 0 and heat >= 100 for game over before advancing
- Kirk corruption: after 2 refusals, inserts `KIRK_CORRUPTED_CARDS` into the deck
- Budget is role-dependent via `ROLE_FINE_TIERS`
- `useDebugStateSync` only writes when `km-debug-state` key already exists

**Usage**

```typescript
const {
  state,
  dispatch,
  startGame,
  selectPersonality,
  selectRole,
  makeChoice,
  nextIncident,
  answerBossQuestion,
  completeBossFight,
  resetGame,
} = useGameState();
```

**Submodule Exports**

```typescript
// From hooks/useGameState/index.ts
export { initialGameState } from "../useGameState";
export {
  createGameOverState,
  type DeathResolution,
  getRoleDeck,
  getUnlockedEndings,
  resolveDeathType,
} from "./deathResolver";
export {
  getDebugState,
  getHydratedState,
  getPlayingState,
  getRoleSelectState,
  getSavedState,
  type HydratedStateData,
} from "./hydration";
```

---

### useIncidentPressure

Calculates pressure metadata for the current card (urgency, countdown, criticality).

| Property | Details |
|----------|---------|
| **File** | `hooks/useIncidentPressure.ts` |
| **Purpose** | Determine if current card has time pressure, countdown, or warrants haptic/audio escalation |
| **Pure** | Yes — memoized, side-effect-free except optional callback |

**Parameters**

```typescript
interface UseIncidentPressureOptions {
  onCriticalChange?: (isCritical: boolean) => void;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | `GameState` | Current game state |
| `currentCard` | `Card \| null` | The card being displayed |
| `isChoiceResolving` | `boolean` | Whether a choice is currently being resolved |
| `options` | `UseIncidentPressureOptions` (optional) | Callback for critical state transitions |

**Return Value**

```typescript
interface IncidentPressureState {
  activeScenario: PressureScenarioMetadata | null;
  isUrgent: boolean;
  countdownSec: number;
  timeoutResolvesTo: "LEFT" | "RIGHT" | null;
  isCritical: boolean;
  getTeamImpact: (direction: "LEFT" | "RIGHT") => string | null;
}
```

**Dependencies**

- `data` — `PRESSURE_SCENARIOS` map keyed by card ID
- `types.ts` — `Card`, `GameState`, `PressureScenarioMetadata`

**Important Notes**

- `isCritical` is true when `scenario.criticalForHaptics` is true OR `state.heat >= 70`
- `isUrgent` is true when scenario is urgent AND choice is not currently resolving
- `onCriticalChange` fires only on transition into critical state (not on every render)
- Return value is fully memoized via `useMemo`

**Usage**

```typescript
const pressure = useIncidentPressure(state, currentCard, isChoiceResolving, {
  onCriticalChange: (isCritical) => {
    if (isCritical) triggerHaptic();
  },
});
```

---

### useLiveAPISpeechRecognition

Real-time speech transcription using the Google Gemini Live API.

| Property | Details |
|----------|---------|
| **File** | `hooks/useLiveAPISpeechRecognition.ts` |
| **Purpose** | Streaming microphone transcription via Gemini 2.5 Flash Native Audio |
| **Side Effects** | Microphone access, AudioWorklet creation, WebSocket session with Gemini API |

**Parameters**

```typescript
interface UseLiveAPISpeechRecognitionOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  systemInstruction?: string;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `onTranscript` | `(text: string, isFinal: boolean) => void` (optional) | Callback for streaming transcription updates |
| `systemInstruction` | `string` (optional) | System instruction for the transcription session |

**Return Value**

```typescript
interface UseLiveAPISpeechRecognitionReturn {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  transcript: string;
  isRecording: boolean;
  error: string | null;
}
```

**Dependencies**

- `@google/genai` — `GoogleGenAI`, `Modality`
- Environment variable: `VITE_GEMINI_API_KEY`
- Optional: `VITE_STT_LOW_LATENCY` (disables echo cancellation and noise suppression)

**Side Effects**

- Requests microphone access via `getUserMedia`
- Creates `AudioContext` and `AudioWorkletNode` for Float32-to-Int16 PCM conversion
- Opens a persistent WebSocket session with Gemini Live API
- Streams audio chunks as base64-encoded PCM in real-time

**Important Notes**

- Requires HTTPS and a modern browser (microphone API constraint)
- Audio sample rate: requests 16kHz, falls back to browser default (typically 48kHz)
- Transcript is debounced: final transcript fires 1500ms after last update
- `stopRecording` sends `audioStreamEnd` signal, waits 500ms for final transcription, then closes session
- Model: `gemini-2.5-flash-native-audio-latest`
- Voice: `Aoede`

**Usage**

```typescript
const { startRecording, stopRecording, transcript, isRecording, error } =
  useLiveAPISpeechRecognition({
    onTranscript: (text, isFinal) => {
      console.log(isFinal ? "Final:" : "Streaming:", text);
    },
  });
```

---

### usePressureAudio

React lifecycle wrapper around the pressure audio session (heartbeat, countdown tick sounds).

| Property | Details |
|----------|---------|
| **File** | `hooks/usePressureAudio.ts` |
| **Purpose** | Play heartbeat audio during high-pressure moments, countdown tick sounds |
| **Side Effects** | Creates `AudioContext`, plays audio, triggers haptic feedback |

**Parameters**

```typescript
interface UsePressureAudioOptions {
  hasHighPressure: boolean;
  isCritical: boolean;
  countdownValue?: number;
  countdownSec?: number;
  isCountdownActive?: boolean;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `hasHighPressure` | `boolean` | Whether pressure is high enough to trigger stress cues |
| `isCritical` | `boolean` | Whether we're in a critical moment (haptic pulse) |
| `countdownValue` | `number` (optional) | Current countdown value |
| `countdownSec` | `number` (optional) | Total countdown length in seconds |
| `isCountdownActive` | `boolean` (optional) | Whether countdown is ticking |

**Return Value**

`void` — This hook has no return value; it manages audio side effects only.

**Dependencies**

- `services/pressureAudio` — `createPressureAudioSession`, `playUnlockPulse`
- `utils/haptic` — `triggerHaptic`

**Side Effects**

- Creates `AudioContext` on first render (lazy, only in browser)
- Resumes AudioContext on first user gesture (touchend/click) — required for Chrome Android
- Plays heartbeat audio when `hasHighPressure` is true
- Triggers haptic feedback on transition into critical state
- Stops audio session on unmount

**Important Notes**

- AudioContext creation is guarded by `typeof window !== "undefined"`
- `resumeOnFirstGesture` attaches one-time listeners for `touchend` and `click`
- Haptic fallback: primary path is `App.tsx` on swipe; this hook provides a secondary trigger
- Session is cleaned up on unmount

**Usage**

```typescript
usePressureAudio({
  hasHighPressure: state.heat >= 70,
  isCritical: pressure.isCritical,
  countdownValue: countdown.count,
  countdownSec: 10,
  isCountdownActive: countdownActive,
});
```

---

### useRoast

Handles AI-powered roast generation with optional speech synthesis.

| Property | Details |
|----------|---------|
| **File** | `hooks/useRoast.ts` |
| **Purpose** | Generate personality-based roast text with streaming and optional TTS |
| **Side Effects** | Calls roast service API |

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `personality` | `PersonalityType \| null` | The AI personality type |

**Return Value**

```typescript
type RoastStatus = "idle" | "loading" | "streaming" | "speaking" | "complete";

interface UseRoastReturn {
  input: string;
  setInput: (input: string) => void;
  output: string | null;
  outputRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  status: RoastStatus;
  handleRoast: () => Promise<void>;
  reset: () => void;
}
```

**Dependencies**

- `services/roastService` — `getRoastTextOnly`, `getRoastWithFallback`
- Environment variable: `VITE_ENABLE_SPEECH` (default: enabled)

**Important Notes**

- When speech is enabled, uses streaming `getRoastWithFallback` with chunk callbacks
- When speech is disabled, uses `getRoastTextOnly` for text-only response
- Errors are caught and displayed as "Roast service unavailable. {message}"
- `outputRef` is provided for auto-scrolling the output container

**Usage**

```typescript
const { input, setInput, output, isLoading, status, handleRoast, reset } =
  useRoast(state.personality);
```

---

### useSpeechRecognition

Speech recognition using the Web Speech API (browser-native).

| Property | Details |
|----------|---------|
| **File** | `hooks/useSpeechRecognition.ts` |
| **Purpose** | Browser-native speech-to-text via `SpeechRecognition` / `webkitSpeechRecognition` |
| **Side Effects** | Microphone access via Web Speech API |

**Parameters**

None.

**Return Value**

```typescript
interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}
```

**Side Effects**

- Creates `SpeechRecognition` instance on `startListening`
- Aborts recognition on unmount

**Important Notes**

- Uses `webkitSpeechRecognition` fallback for Chrome/Safari
- `continuous: true`, `interimResults: true`, `lang: "en-US"`
- No auto-restart on `onend` — user must manually restart
- `isManualStopRef` tracks whether stop was user-initiated (used for logging)
- Cleans up via `abort()` in the unmount effect

**Usage**

```typescript
const { isListening, transcript, startListening, stopListening, error } =
  useSpeechRecognition();
```

---

### useStageReady

Manages UI readiness after stage transitions to prevent ghost clicks and premature interactions.

| Property | Details |
|----------|---------|
| **File** | `hooks/useStageReady.ts` |
| **Purpose** | Delay click/hover enablement after stage change to prevent accidental interactions |
| **Side Effects** | Sets timeouts, attaches `mousemove`/`touchstart` listeners |

**Parameters**

```typescript
interface UseStageReadyOptions {
  stage: GameStage;
  targetStage: GameStage;
  delay?: number;
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `stage` | `GameStage` | — | Current game stage |
| `targetStage` | `GameStage` | — | Stage to watch for |
| `delay` | `number` | `100` | Milliseconds before `isReady` becomes true |

**Return Value**

```typescript
interface UseStageReadyResult {
  isReady: boolean;
  hoverEnabled: boolean;
}
```

**Side Effects**

- Sets a `setTimeout` to enable `isReady` after `delay` ms
- Attaches one-time `mousemove` and `touchstart` listeners to enable hover on first pointer move

**Important Notes**

- `isReady` blocks clicks; `hoverEnabled` blocks hover effects
- Both reset to `false` when `stage !== targetStage`
- Hover is only enabled after the first `mousemove` or `touchstart` event (prevents stale hover states on mobile)
- Timeout is cleared on stage change or unmount

**Usage**

```typescript
const { isReady, hoverEnabled } = useStageReady({
  stage: state.stage,
  targetStage: GameStage.PLAYING,
  delay: 100,
});
```

---

### useSwipeGestures

Handles swipe gestures for card interactions (touch and mouse).

| Property | Details |
|----------|---------|
| **File** | `hooks/useSwipeGestures.ts` |
| **Purpose** | Touch/mouse swipe detection with preview, snap-back, and programmatic swipe support |
| **Side Effects** | Attaches window-level mouse listeners during drag |

**Parameters**

```typescript
interface UseSwipeGesturesOptions {
  enabled: boolean;
  onSwipe: (direction: "LEFT" | "RIGHT") => void;
  onBeforeSwipe?: (direction: "LEFT" | "RIGHT") => void;
  onSwipeUp?: () => void;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `enabled` | `boolean` | Whether swipe gestures are currently enabled |
| `onSwipe` | `(direction: "LEFT" | "RIGHT") => void` | Called when a swipe crosses the threshold |
| `onBeforeSwipe` | `(direction: "LEFT" | "RIGHT") => void` (optional) | Called synchronously before swipe fires (while still in user gesture context) |
| `onSwipeUp` | `() => void` (optional) | Called on upward swipe gesture |

**Return Value**

```typescript
interface SwipeState {
  offset: number;
  verticalOffset: number;
  direction: "LEFT" | "RIGHT" | null;
  isDragging: boolean;
  exitDirection: "LEFT" | "RIGHT" | null;
  exitPosition: { x: number; rotate: number } | null;
  isSnappingBack: boolean;
  hasDragged: boolean;
  isSwipeUp: boolean;
}

interface UseSwipeGesturesReturn extends SwipeState {
  reset: () => void;
  onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd: () => void;
  swipeProgrammatically: (direction: "LEFT" | "RIGHT") => void;
  SWIPE_THRESHOLD: number;     // 100
  SWIPE_PREVIEW_THRESHOLD: number; // 50
}
```

**Constants**

| Constant | Value | Purpose |
|----------|-------|---------|
| `SWIPE_THRESHOLD` | `100` | Pixels to trigger a committed swipe |
| `SWIPE_PREVIEW_THRESHOLD` | `50` | Pixels to show preview indicators |
| `VERTICAL_DOMINANCE_RATIO` | `1.5` | Ratio for vertical-dominant swipe-up detection |

**Side Effects**

- Attaches `mousemove`/`mouseup` listeners on `window` during mouse drag
- Uses `requestAnimationFrame` for smooth drag updates
- Uses `setTimeout` for exit animation (350ms) and snap-back animation (600ms)

**Important Notes**

- Supports both touch (`TouchEvent`) and mouse (`MouseEvent`) via `onTouchStart`/`onTouchMove`/`onTouchEnd`
- Mouse drag uses window-level listeners to handle off-card mouseup
- `onBeforeSwipe` is called synchronously to ensure it runs within the user gesture context (important for audio/haptic APIs blocked outside gestures)
- `swipeProgrammatically` is guarded: does nothing if `exitDirection` is already set
- Vertical swipe-up requires: `!isHorizontalSwipe && deltaY < -100 && |deltaY| > |deltaX| * 1.5`
- All refs (`isDraggingRef`, `enabledRef`, etc.) avoid stale closure issues

**Usage**

```typescript
const {
  offset,
  direction,
  isDragging,
  exitDirection,
  exitPosition,
  isSnappingBack,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  swipeProgrammatically,
  reset,
} = useSwipeGestures({
  enabled: stageReady.isReady && !feedbackOverlay,
  onSwipe: (dir) => {
    const outcome = dir === "LEFT" ? card.onLeft : card.onRight;
    makeChoice(dir, { hype: outcome.hype, heat: outcome.heat, fine: outcome.fine, cardId: card.id });
  },
  onBeforeSwipe: (dir) => {
    // Synchronous — safe for audio/haptic
    playFeedbackAudio(card.id, dir);
  },
  onSwipeUp: () => showCheatSheet(),
});
```

---

### useUnlockedEndings

Calculates unlock progress and generates encouragement text for the endings collection.

| Property | Details |
|----------|---------|
| **File** | `hooks/useUnlockedEndings.ts` |
| **Purpose** | Track how many of 6 death endings the player has discovered |
| **Pure** | Yes — no side effects |

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `unlockedEndings` | `DeathType[]` | Array of already-unlocked death types |

**Return Value**

```typescript
interface UnlockProgress {
  unlockedCount: number;
  totalCount: number;  // always 6
  progressText: string;
}
```

**Progress Text Variants**

| Unlocked | Text |
|----------|------|
| 0 | "You've unlocked your first ending (1/6). Try again to discover more outcomes." |
| 1 | "You've unlocked 1/6 endings. Try again to see what else happens." |
| 2-4 | "You've unlocked {n}/6 endings. Try again to see what else happens." |
| 5 | "You've unlocked 5/6 endings. Just one more to discover!" |
| 6 | "You've unlocked all 6/6 endings! You've experienced the full Kobayashi Maru." |

**Important Notes**

- The pure function `getUnlockProgress()` is also exported for use in tests
- Total count is hardcoded as 6 (matching `DeathType` enum minus `KIRK`)

**Usage**

```typescript
const { unlockedCount, totalCount, progressText } = useUnlockedEndings(
  state.unlockedEndings,
);
```

---

### useVoicePlayback

Manages voice playback during different game stages (onboarding, feedback, death endings, archetype reveal).

| Property | Details |
|----------|---------|
| **File** | `hooks/useVoicePlayback.ts` |
| **Purpose** | Play personality-specific voice clips at appropriate game moments |
| **Side Effects** | Loads and plays audio files via `voicePlayback` service |

**Parameters**

```typescript
interface UseVoicePlaybackOptions {
  stage: GameStage;
  personality: PersonalityType | null;
  feedbackCardId?: string | null;
  feedbackAuthoringStem?: string | null;
  feedbackSelectedSlot?: PresentationChoiceSlot | null;
  deathType?: DeathType | null;
  archetypeId?: ArchetypeId | null;
}
```

**Return Value**

`void` — This hook has no return value; it manages audio side effects only.

**Dependencies**

- `services/voicePlayback` — `loadVoice`, `playVoice`, `stopVoice`, `subscribeVoiceActivity`
- `types.ts` — `ArchetypeId`, `DeathType`, `GameStage`, `PersonalityType`

**Side Effects**

- Loads and plays voice clips on stage/personality/deathType changes
- Stops voice playback on unmount
- Resets audio flags when leaving relevant stages

**Voice Trigger Mapping**

| Stage | Trigger | Condition |
|-------|---------|-----------|
| `ROLE_SELECT` | `onboarding` | Personality is set |
| `DEBRIEF_PAGE_1` (no death) | `victory` | Personality is set |
| `DEBRIEF_PAGE_1` (with death) | `death_{type}` | e.g., `death_bankrupt` |
| `DEBRIEF_PAGE_3` (with archetype) | `archetype_{id}` | e.g., `archetype_pragmatist` |
| Card feedback (Roaster only) | `feedback_{cardId}_{stem}` or `feedback_install`/`feedback_ignore` | Card has feedback audio |

**Important Notes**

- Death and archetype audio play only once per stage entry (guarded by `hasPlayedDeathAudio` / `hasPlayedArchetypeAudio` refs)
- Feedback audio only plays for `PersonalityType.ROASTER`
- Critical "Head of Something" cards use per-choice label slugs; other cards use generic install/ignore clips
- `stopVoice()` is called on unmount to prevent lingering audio
- Audio flags reset when leaving `DEBRIEF_PAGE_1` (death) and `DEBRIEF_PAGE_3` (archetype)

**Usage**

```typescript
useVoicePlayback({
  stage: state.stage,
  personality: state.personality,
  feedbackCardId: currentCard?.id,
  feedbackAuthoringStem: feedbackOverlay?.feedbackAuthoringStem,
  feedbackSelectedSlot: presentationSlot,
  deathType: state.deathType,
  archetypeId: archetype?.id,
});
```

---

### useWebMCPTools

Registers WebMCP tools for AI-assisted game interaction during development and testing.

| Property | Details |
|----------|---------|
| **File** | `hooks/useWebMCPTools.ts` |
| **Purpose** | Expose game controls as MCP tools for external AI agents |
| **Side Effects** | Registers tools with `@mcp-b/react-webmcp` |

**Parameters**

```typescript
interface UseWebMCPToolsDeps {
  state: GameState;
  startGame: () => void;
  selectPersonality: (personality: PersonalityType) => void;
  handleSelectRole: (role: RoleType) => void;
  swipe: SwipeControls;
  feedbackOverlay: WebMCPFeedbackOverlay;
  handleNextIncident: () => void;
  bossFight: BossFightControls;
  handleRestart: () => void;
  currentCard: { id: string } | null;
}
```

**Return Value**

`void` — Registers tools as a side effect.

**Registered MCP Tools**

| Tool | Description | Input |
|------|-------------|-------|
| `get_game_state` | Returns current game state | none |
| `get_current_screen` | Human-readable screen description | none |
| `start_game` | Starts game from intro (INTRO only) | none |
| `select_personality` | Selects personality (PERSONALITY_SELECT only) | `personality: "ROASTER" | "ZEN_MASTER" | "LOVEBOMBER"` |
| `select_role` | Selects role (ROLE_SELECT only) | `role: string` (10 valid roles) |
| `swipe_card` | Swipes card (PLAYING only, no feedback overlay) | `direction: "LEFT" | "RIGHT"` |
| `dismiss_feedback` | Dismisses feedback overlay | none |
| `answer_boss_question` | Answers boss quiz question (BOSS_FIGHT only) | `answerIndex: 0-3` |
| `advance_boss` | Advances to next boss question | none |
| `restart_game` | Restarts game (always available) | none |

**Dependencies**

- `@mcp-b/react-webmcp` — `useWebMCP`
- `types.ts` — `BossQuestion`, `GameState`, `RoleType`, `GameStage`, `PersonalityType`
- `useSwipeGestures` — `SwipeState` type

**Important Notes**

- All tools validate current stage before executing
- `swipe_card` is blocked when feedback overlay is showing
- `answer_boss_question` maps answer index to `fixedAnswers` array and validates correctness
- `restart_game` has no stage restrictions
- Valid personalities: `ROASTER`, `ZEN_MASTER`, `LOVEBOMBER`
- Valid roles: 10 roles including `CHIEF_SOMETHING_OFFICER`, `SOFTWARE_ENGINEER`, `VIBE_CODER`, etc.

**Usage**

```typescript
useWebMCPTools({
  state,
  startGame,
  selectPersonality,
  handleSelectRole: selectRole,
  swipe: swipeControls,
  feedbackOverlay,
  handleNextIncident: nextIncident,
  bossFight: bossFightControls,
  handleRestart: resetGame,
  currentCard,
});
```

---

## Hook Testing Patterns

### Unit Testing Pure Hooks

Hooks with no side effects (`useArchetype`, `useUnlockedEndings`) can be tested directly:

```typescript
// unit/archetype.test.ts
import { useArchetype } from "../hooks/useArchetype";
import { renderHook } from "@testing-library/react";

test("calculates archetype from history", () => {
  const { result } = renderHook(() =>
    useArchetype(history, 5000000, 30, 70, RoleType.SOFTWARE_ENGINEER),
  );
  expect(result.current.archetype).toBeDefined();
  expect(result.current.resilience).toBeGreaterThanOrEqual(0);
});
```

### Testing Hooks with Side Effects

Hooks with timers, audio, or DOM effects require mocking:

```typescript
// unit/useCountdown.spec.ts
import { useCountdown } from "../hooks/useCountdown";
import { renderHook, act } from "@testing-library/react";

test("calls onComplete when countdown reaches zero", () => {
  const onComplete = vi.fn();
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useCountdown({ startFrom: 2, onComplete, isActive: true }),
  );

  expect(result.current.count).toBe(2);

  act(() => jest.advanceTimersByTime(2000));
  expect(onComplete).toHaveBeenCalled();

  jest.useRealTimers();
});
```

### Testing the Game Reducer

The `gameReducer` is a pure function and can be tested without React:

```typescript
// unit/gameReducer.spec.ts
import { gameReducer, initialGameState } from "../hooks/useGameState";
import { GameStage, RoleType } from "../types";

test("STAGE_CHANGE transitions from INTRO to PERSONALITY_SELECT", () => {
  const nextState = gameReducer(initialGameState, {
    type: "STAGE_CHANGE",
    stage: GameStage.PERSONALITY_SELECT,
  });
  expect(nextState.stage).toBe(GameStage.PERSONALITY_SELECT);
});

test("invalid transitions are rejected", () => {
  const nextState = gameReducer(initialGameState, {
    type: "STAGE_CHANGE",
    stage: GameStage.PLAYING, // invalid from INTRO
  });
  expect(nextState.stage).toBe(GameStage.INTRO); // unchanged
});
```

### Testing Email Capture

```typescript
// unit/email-capture.test.ts
import { useEmailCapture } from "../hooks/useEmailCapture";
import { renderHook, act } from "@testing-library/react";

test("validates email format", async () => {
  const { result } = renderHook(() =>
    useEmailCapture({ role: "ENGINEER", archetype: "PRAGMATIST", resilience: 75 }),
  );

  act(() => {
    result.current.setEmail("invalid");
  });

  await act(async () => {
    await result.current.submit();
  });

  expect(result.current.error).toBe("Please enter a valid email address");
});
```

---

## Quick Reference Table

| Hook | Params | Returns | Side Effects | Pure |
|------|--------|---------|--------------|------|
| `useArchetype` | 6 params | `{ archetype, resilience }` | None | Yes |
| `useBackgroundMusic` | none | `{ currentTrackTitle, userVolume, setUserVolume, enabled, toggleEnabled, skipNext, ... }` | Audio element, storage, voice subscription | No |
| `useBossFight` | `UseBossFightOptions` | `UseBossFightResult` | Timer | No |
| `useClock` | `updateInterval?` | `string` | Interval | No |
| `useCountdown` | `UseCountdownOptions` | `{ count, reset }` | Timer | No |
| `useDebrief` | `{ state, dispatch }` | `{ archetype, resilienceScore, nextPage, restart }` | Dispatch | No |
| `useEmailCapture` | `{ role, archetype, resilience }` | `{ email, setEmail, isSubmitting, error, success, submit }` | Fetch, localStorage | No |
| `useGameState` | none | `UseGameStateResult` | Debug localStorage sync | No |
| `useIncidentPressure` | `state, card, resolving, options?` | `IncidentPressureState` | Optional callback | Yes |
| `useLiveAPISpeechRecognition` | `options?` | `{ startRecording, stopRecording, transcript, isRecording, error }` | Mic, AudioWorklet, Gemini API | No |
| `usePressureAudio` | `UsePressureAudioOptions` | `void` | AudioContext, haptics | No |
| `useRoast` | `personality` | `{ input, setInput, output, outputRef, isLoading, status, handleRoast, reset }` | API call | No |
| `useSpeechRecognition` | none | `{ isListening, transcript, startListening, stopListening, error }` | Web Speech API | No |
| `useStageReady` | `{ stage, targetStage, delay? }` | `{ isReady, hoverEnabled }` | Timeout, event listeners | No |
| `useSwipeGestures` | `UseSwipeGesturesOptions` | `SwipeState + handlers` | Window listeners, RAF, timeouts | No |
| `useUnlockedEndings` | `DeathType[]` | `UnlockProgress` | None | Yes |
| `useVoicePlayback` | `UseVoicePlaybackOptions` | `void` | Audio load/play | No |
| `useWebMCPTools` | `UseWebMCPToolsDeps` | `void` | MCP tool registration | No |
