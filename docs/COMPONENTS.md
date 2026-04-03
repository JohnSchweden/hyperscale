# Component Documentation

K-Maru: The Hyperscale Chronicles -- React component reference.

## 1. Component Tree Overview

```
App.tsx (root, state machine)
├── StarfieldBackground (canvas + speed UI context)
│   └── LayoutShell (responsive layout wrapper)
│       │
│       ├── IntroScreen (stage: INTRO)
│       ├── PersonalitySelect (stage: PERSONALITY_SELECT)
│       ├── RoleSelect (stage: ROLE_SELECT)
│       ├── InitializingScreen (stage: INITIALIZING)
│       ├── GameScreen (stage: PLAYING)
│       │   ├── GameHUD
│       │   ├── CardStack
│       │   │   ├── CardHeaderBar
│       │   │   ├── CardBody
│       │   │   └── SwipePreview
│       │   ├── RoastTerminal
│       │   │   └── RoastTerminalInner
│       │   ├── Taskbar
│       │   │   └── TaskbarFlySpeedBurger
│       │   └── PressureCueController (renders null)
│       ├── BossFight (stage: BOSS_FIGHT)
│       └── DebriefContainer (stages: DEBRIEF_PAGE_1/2/3)
│           ├── DebriefPage1Collapse
│           │   ├── StatsGrid / StatCard
│           │   ├── EndingIconGrid
│           │   ├── KirkBreachHeader
│           │   ├── DeathEndingCard
│           │   ├── FailureLessonCard
│           │   └── ExplanationCard
│           ├── DebriefPage2AuditTrail
│           │   ├── AuditEntry
│           │   └── ForkSegment
│           └── DebriefPage3Verdict
├── FeedbackOverlay (modal, rendered conditionally by App)
├── ImageWithFallback (shared utility)
└── WebMCPToolsProvider (dev-only, renders null)
```

## 2. Component Categories

| Category | Components |
|----------|------------|
| **Layout** | `LayoutShell`, `StarfieldBackground` |
| **Stage Screens** | `IntroScreen`, `PersonalitySelect`, `RoleSelect`, `InitializingScreen`, `GameScreen`, `BossFight` |
| **Game UI** | `CardStack`, `GameHUD`, `Taskbar`, `RoastTerminal`, `PressureCueController` |
| **Card Internals** | `CardHeaderBar`, `CardBody`, `SwipePreview` |
| **Feedback** | `FeedbackOverlay` |
| **Debrief** | `DebriefContainer`, `DebriefPage1Collapse`, `DebriefPage2AuditTrail`, `DebriefPage3Verdict`, `ExplanationCard`, `EmailCaptureForm` |
| **Shared** | `ImageWithFallback` |
| **Dev** | `WebMCPToolsProvider` |
| **Styles** | `selectionStageStyles.ts` (shared constants) |

## 3. Individual Component Documentation

### LayoutShell

**File:** `components/LayoutShell.tsx`

Responsive layout wrapper that provides consistent positioning across all game stages.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | -- | Stage content |
| `header` | `ReactNode` | -- | Optional header slot |
| `footer` | `ReactNode` | -- | Optional footer slot |
| `className` | `string` | `""` | Additional classes |

**Behavior:**
- Desktop (`>=1024px`): centers content vertically and horizontally
- Mobile: anchors content to top with safe-area padding
- Uses `min-h-[100dvh]` for mobile viewport stability
- Memoized with `React.memo`

**Composition:** Used by every stage screen component. Receives stage-specific class overrides (e.g., `!bg-transparent` for GameScreen, `LAYOUT_SHELL_CENTERED_CLASS` for debrief pages).

---

### StarfieldBackground

**File:** `components/game/StarfieldBackground.tsx`

Animated starfield canvas background with speed controls and optional background music UI.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `flySpeedMenuOnly` | `boolean` | `false` | Hide desktop inline panel; show only burger menu |
| `taskbarHostsSpeedBurger` | `boolean` | `false` | Let Taskbar host the burger button on mobile |
| `bgm` | `StarfieldBgmMenuProps` | -- | Background music controls (optional) |
| `children` | `ReactNode` | -- | Content rendered above the canvas |

**Exports:**
- `StarfieldBackground` -- main component
- `useStarfieldSpeedUIBurger()` -- hook to access speed UI context from consumers (used by Taskbar)
- `StarfieldBackgroundProps`, `StarfieldBgmMenuProps` -- type exports

**Behavior:**
- Canvas-based 3D star projection with configurable speed
- Respects `prefers-reduced-motion` (reduces speed, increases trail alpha)
- Speed scale persisted to `localStorage`
- Provides `StarfieldSpeedUIContext` for burger menu coordination with Taskbar
- Desktop: inline panel in top-right corner
- Mobile: burger button (corner or taskbar-hosted) with flyout panel

---

### IntroScreen

**File:** `components/game/IntroScreen.tsx`

Title screen with game premise and boot button.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `onStart` | `() => void` | Triggers transition to PERSONALITY_SELECT |

**Renders:** Game title with glitch effect, premise text, "Boot system" CTA, warning footer.

**Composition:** Wrapped in `LayoutShell` with `LAYOUT_SHELL_CENTERED_CLASS`.

---

### PersonalitySelect

**File:** `components/game/PersonalitySelect.tsx`

Card grid for selecting the AI companion personality (V.E.R.A., Bamboo, HYPE-BRO).

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isReady` | `boolean` | Whether selection is interactive (pointer events) |
| `hoverEnabled` | `boolean` | Whether hover effects are active |
| `onSelect` | `(personality: PersonalityType) => void` | Selection callback |

**Behavior:**
- Renders 3 cards in a responsive grid (1 column mobile, 3 on desktop)
- Cards use shared styles from `selectionStageStyles.ts`
- Voice hint shown only for ROASTER when speech is enabled
- Staggered animation delay per card

**Composition:** Uses `LayoutShell`, shared `SELECT_CARD_BASE` / `SELECT_CARD_HOVER` classes.

---

### RoleSelect

**File:** `components/game/RoleSelect.tsx`

Card grid for selecting the player's department role.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isReady` | `boolean` | Whether selection is interactive |
| `hoverEnabled` | `boolean` | Whether hover effects are active |
| `onSelect` | `(role: RoleType) => void` | Selection callback |

**Behavior:**
- Renders all `RoleType` enum values as selectable cards
- Each card shows role icon, label, description, and starting budget
- Budget sourced from `ROLE_FINE_TIERS`
- Same grid layout and styling as PersonalitySelect

---

### InitializingScreen

**File:** `components/game/InitializingScreen.tsx`

Terminal-style boot sequence with progress bar and countdown.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `role` | `RoleType \| null` | Selected role (displayed in boot messages) |
| `personality` | `PersonalityType \| null` | Selected personality (displayed in secure link label) |
| `countdown` | `number` | Current countdown value (3, 2, 1, 0) |

**Behavior:**
- Shows themed terminal messages ("Bypassing ethical safeguards... warning")
- Progress bar animates based on countdown progress
- Large pulsing countdown number transitions to "Start"

---

### GameScreen

**File:** `components/game/GameScreen.tsx`

Main gameplay interface orchestrating all interactive game elements.

**Props (key subset):**

| Prop | Type | Description |
|------|------|-------------|
| `state` | `GameState` | Full game state |
| `isFirstCard` | `boolean` | Triggers ticket animation on first card |
| `cardRef` | `RefObject<HTMLDivElement>` | Ref for swipe gesture container |
| `swipeOffset` | `number` | Horizontal drag offset |
| `swipeDirection` | `"LEFT" \| "RIGHT" \| null` | Current swipe direction |
| `isDragging` | `boolean` | Active drag state |
| `cardExitDirection` | `"LEFT" \| "RIGHT" \| null` | Exit animation direction |
| `exitPosition` | `{x, rotate} \| null` | Exit animation transform |
| `onSwipeLeft` / `onSwipeRight` | `() => void` | Swipe completion callbacks |
| `roastInput` / `roastOutput` | `string` / `string \| null` | Roast terminal state |
| `isRoasting` | `boolean` | Loading state for roast generation |
| `countdownValue` | `number` | Urgent countdown seconds |
| `isCountdownActive` | `boolean` | Whether countdown is ticking |
| `isCritical` | `boolean` | Whether state is critical |
| `swipeThreshold` / `swipePreviewThreshold` | `number` | Gesture configuration |

**Composition:**
- Wraps `GameHUD` (absolute positioned at top)
- Renders `CardStack` with full swipe state
- Renders `RoastTerminal` below card stack
- Renders `Taskbar` at bottom
- Shows urgent countdown overlay when active
- Uses `LayoutShell` with `!bg-transparent` to let starfield show through

---

### CardStack

**File:** `components/game/CardStack.tsx`

Swipeable card display with gesture handling, preview overlays, and exit animations.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `role` | `RoleType` | Current player role |
| `cards` | `Card[]` | Deck of cards to display |
| `currentCardIndex` | `number` | Index of active card |
| `isFirstCard` | `boolean` | Triggers entrance animation |
| `cardRef` | `RefObject<HTMLDivElement>` | Ref for gesture container |
| `offset` | `number` | Horizontal drag offset (px) |
| `verticalOffset` | `number` | Vertical drag offset (px) |
| `direction` | `"LEFT" \| "RIGHT" \| null` | Current swipe direction |
| `isDragging` | `boolean` | Active drag state |
| `hasDragged` | `boolean` | Whether user has dragged at least once |
| `exitDirection` | `"LEFT" \| "RIGHT" \| null` | Card exit animation direction |
| `exitPosition` | `{x, rotate} \| null` | Exit transform values |
| `isSnappingBack` | `boolean` | Spring-back animation state |
| `onTouchStart` / `onTouchMove` / `onTouchEnd` | handlers | Pointer event handlers |
| `onSwipeLeft` / `onSwipeRight` | `() => void` | Swipe completion callbacks |
| `swipeThreshold` | `number` | Distance to complete swipe |
| `swipePreviewThreshold` | `number` | Distance to show preview |
| `isUrgent` | `boolean` | Enables pressure visual effects |

**Behavior:**
- Renders current card on top, next card behind (scaled down, lower opacity)
- Applies transform based on drag offset with slight rotation (`offset * 0.05deg`)
- Shows `SwipePreview` overlay when direction is detected
- Exit animation: translates card off-screen with rotation, fades to 0 opacity
- Snap-back animation uses CSS `spring-snap-back` class
- Preloads next card's incident image via `<link rel="preload">`
- Urgent mode: adds `pressure-shake` class to container, `pressure-flicker` to card, pulse overlay

**Composition:** Uses `CardHeaderBar`, `CardBody`, and `SwipePreview` internally.

---

### CardHeaderBar

**File:** `components/game/CardStackComponents.tsx`

Top bar of an incident card showing source icon and context.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `source` | `string` | App source label (SLACK, EMAIL, etc.) |
| `context` | `string` | Context/subject line |

**Renders:** Source icon from `SOURCE_ICONS`, source name, context text, and macOS-style window dots.

---

### CardBody

**File:** `components/game/CardStackComponents.tsx`

Main content area of an incident card.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `card` | `Card` | The card data object |
| `incidentNumber` | `number` | Displayed incident number |
| `variant` | `"preview" \| "full"` | Rendering mode |
| `onSwipeLeft` / `onSwipeRight` | `() => void` | Button click handlers (full mode only) |
| `leftLabel` / `rightLabel` | `string` | Button text labels |
| `currentDirection` | `"LEFT" \| "RIGHT" \| null` | Highlights active button |
| `isUrgent` | `boolean` | Enables pressure shake on content |

**Behavior:**
- Preview variant: truncated text, no buttons, muted colors
- Full variant: complete text, swipe buttons with keyboard hint ("Swipe or use arrow keys")
- Buttons highlight when swipe direction matches
- Responsive: shows arrow key hint on desktop, swipe hint on mobile

---

### SwipePreview

**File:** `components/game/CardStack.tsx`

Overlay that shows the chosen action label and edge tint during a swipe gesture.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `direction` | `"LEFT" \| "RIGHT"` | Swipe direction |
| `offset` | `number` | Current drag distance |
| `swipePreviewThreshold` | `number` | Min offset to show preview |
| `swipeThreshold` | `number` | Max offset (100%) |
| `card` | `Card` | Card for label text |

**Behavior:**
- Edge wash gradient: cyan for right, orange for left
- Label scales from 0.5 to 1.0 as swipe progresses
- Opacity ramps from 0.3 to 1.0 based on swipe progress

---

### GameHUD

**File:** `components/game/GameHUD.tsx`

Heads-up display showing Budget, Risk (Heat), and Hype metrics.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `budget` | `number` | -- | Current budget |
| `heat` | `number` | -- | Current risk level (0-100) |
| `hype` | `number` | -- | Current hype level (0-100) |
| `countdownValue` | `number \| undefined` | -- | Active countdown seconds |
| `startingBudget` | `number` | `10000000` | Budget for progress bar scaling |

**Thresholds:**

| Metric | Warning | Critical |
|--------|---------|----------|
| Budget | < 3,000,000 | < 2,000,000 |
| Heat | >= 70 | >= 85 |
| Hype | -- | < 20 |

**Behavior:**
- Progress bars visible on desktop only (`hidden md:block`)
- Color coding: green/amber/red for budget, orange/yellow/red for heat, cyan/red for hype
- Critical values trigger `animate-pulse`
- Under-pressure state (any critical or active countdown) applies `pressure-hud-intense` class
- Memoized with `React.memo`

---

### FeedbackOverlay

**File:** `components/game/FeedbackOverlay.tsx`

Modal dialog shown after each card choice with governance feedback.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `personality` | `PersonalityType \| null` | Personality providing feedback |
| `text` | `string` | Personality's feedback quote |
| `lesson` | `string` | Educational takeaway |
| `choice` | `"LEFT" \| "RIGHT"` | Which swipe was chosen |
| `fine` | `number` | Budget penalty amount |
| `heatDelta` | `number \| undefined` | Risk change |
| `hypeDelta` | `number \| undefined` | Hype change |
| `violation` | `string` | Violation description |
| `teamImpact` | `string \| null` | Optional team impact text |
| `budget` / `heat` / `hype` | `number \| undefined` | Current stat values for escalation display |
| `realWorldReference` | `{incident, date, outcome} \| null` | Real-world incident context |
| `outcomeLabel` | `string` | Label for outcome image lookup |
| `onNext` | `() => void` | Proceed to next card |

**Behavior:**
- Fixed-position modal with `role="dialog"` and `aria-modal="true"`
- Shows escalation warnings when any stat hits critical threshold
- Renders outcome image via `ImageWithFallback` (with Kirk-corrupted placeholder support)
- Violation displayed as badge + classification + theme (split on ` - ` separator)
- Inline stats row: fine, heat delta, hype delta with color coding
- "Learning moment" section with lesson text
- Optional "Team impact" and "Real Case" sections
- Keyboard navigation: Escape, Space, or Enter triggers `onNext`

---

### RoastTerminal

**File:** `components/game/RoastTerminal.tsx`

Terminal-style interface for AI-powered governance review with voice input.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `personality` | `PersonalityType \| null` | Current personality (null = renders nothing) |
| `input` | `string` | Current input text |
| `output` | `string \| null` | Generated roast output |
| `isLoading` | `boolean` | Generation in progress |
| `outputRef` | `RefObject<HTMLDivElement>` | Ref for auto-scroll |
| `onInputChange` | `(value: string) => void` | Input change handler |
| `onSubmit` | `() => void` | Submit handler |

**Behavior:**
- Terminal chrome with personality-specific console name (`roast_con.exe`, `zen_con.exe`, `hype_con.exe`)
- Textarea with Enter-to-submit (Shift+Enter for newline)
- Microphone button toggles speech recognition via `useLiveAPISpeechRecognition`
- Submit button with spinner during loading
- Auto-scrolls to output when it appears
- Inner component is memoized to prevent re-render issues with speech recognition

**Composition:** `RoastTerminal` (wrapper with auto-scroll) -> `RoastTerminalInner` (memoized UI).

---

### BossFight

**File:** `components/game/BossFight.tsx`

Final boss fight -- timed multiple-choice quiz against the External Auditor.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `question` | `BossQuestion` | Current question object |
| `fixedAnswers` | `string[]` | Shuffled answer options |
| `currentQuestion` | `number` | 0-based question index |
| `totalQuestions` | `number` | Total question count |
| `timeLeft` | `number` | Seconds remaining |
| `showExplanation` | `boolean` | Whether to show explanation |
| `hasAnswered` | `boolean` | Whether current question is answered |
| `isCorrect` | `boolean` | Whether the answer was correct |
| `correctCount` | `number` | Correct answers so far |
| `totalAnswered` | `number` | Total questions answered |
| `onAnswer` | `(isCorrect: boolean) => void` | Answer selection callback |
| `onNext` | `() => void` | Proceed to next question or results |

**Behavior:**
- Timer bar with 30-second countdown (turns red under 5s)
- Answer buttons disabled after selection
- Explanation shown after answer with correct/incorrect styling
- Score display at bottom
- "Next question" button changes to "Final result" on last question

**Composition:** Wrapped in `LayoutShell` with `!bg-transparent`.

---

### Taskbar

**File:** `components/game/Taskbar.tsx`

Bottom taskbar with personality indicator, time, and menu controls.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `personality` | `PersonalityType \| null` | Current personality |
| `currentTime` | `string` | Formatted time display |

**Renders:**
- Start button with atom icon
- Chat/terminal icon buttons (decorative)
- Starfield speed burger (mobile, via context)
- Personality icon + name
- Current time + version string

**Behavior:**
- Fixed to bottom with safe-area padding
- Glass header styling with shadow
- Burger menu coordinates with `StarfieldBackground` via `useStarfieldSpeedUIBurger()` context
- Mobile-only burger; desktop shows inline panel

---

### PressureCueController

**File:** `components/game/PressureCueController.tsx`

Renders null. Drives heartbeat audio and haptics from pressure state.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isUrgent` | `boolean` | From `useIncidentPressure` |
| `isCritical` | `boolean` | From `useIncidentPressure` |
| `countdownValue` | `number` | Current countdown seconds |
| `countdownSec` | `number` | Total countdown duration |
| `isCountdownActive` | `boolean` | Whether countdown is ticking |

**Behavior:** Delegates to `usePressureAudio` hook. No visual output.

---

### DebriefContainer

**File:** `components/game/debrief/DebriefContainer.tsx`

Router component that renders the appropriate debrief page based on game stage.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `state` | `GameState` | Full game state |
| `archetype` | `Archetype \| null` | Computed player archetype |
| `archetypeDescription` | `string` | Archetype description text |
| `resilienceScore` | `number` | Computed resilience percentage |
| `onNextPage` | `() => void` | Advance to next debrief page |
| `onRestart` | `() => void` | Restart the game |

**Routing:**

| Stage | Component |
|-------|-----------|
| `DEBRIEF_PAGE_1` | `DebriefPage1Collapse` |
| `DEBRIEF_PAGE_2` | `DebriefPage2AuditTrail` |
| `DEBRIEF_PAGE_3` | `DebriefPage3Verdict` |

---

### DebriefPage1Collapse

**File:** `components/game/debrief/DebriefPage1Collapse.tsx`

First debrief page -- game over or victory summary.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `state` | `GameState` | Full game state |
| `onNext` | `() => void` | Advance to audit log |

**Internal components:**

| Component | Props | Purpose |
|-----------|-------|---------|
| `StatsGrid` | `{budget, heat, hype}` | Three-column stat display |
| `StatCard` | `{label, value, color}` | Individual stat cell |
| `EndingIconGrid` | `{unlockedEndings}` | Grid of ending icons (unlocked/locked) |
| `KirkBreachHeader` | `{corruptedText}` | Glitch-text header for KIRK death |
| `DeathEndingCard` | `{ending, deathType}` | Death ending title + image |
| `FailureLessonCard` | `{lesson}` | Random failure lesson with real-world example |

**Behavior:**
- Victory path (deathType === null): "Quarter survived" with success lesson
- KIRK path: glitch header, corrupted image, special audio effects
- Regular death: death ending card + explanation + failure lesson
- Always shows: stats grid, unlocked endings collection, "Debrief me" button
- Plays KIRK glitch/crash audio on mount (once)

---

### DebriefPage2AuditTrail

**File:** `components/game/debrief/DebriefPage2AuditTrail.tsx`

Second debrief page -- complete audit log of all player decisions.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `state` | `GameState` | Full game state |
| `onNext` | `() => void` | Advance to verdict |

**Internal components:**

| Component | Props | Purpose |
|-----------|-------|---------|
| `AuditEntry` | `{entry, index, card}` | Single decision with both fork options |
| `ForkSegment` | `{label, hype, heat, fine, violation, isChosen, direction}` | One side of a decision fork |

**Behavior:**
- Lists all history entries with full card context (storyContext, text)
- T-junction visual on desktop showing both left/right options
- Chosen option highlighted with colored badge
- Consequence format: `$X fine • +Y% heat • +Z% hype`
- Personality sign-off with character-specific commentary
- KIRK path: "Corrupted Audit Log" header + integrity warning footer

---

### DebriefPage3Verdict

**File:** `components/game/debrief/DebriefPage3Verdict.tsx`

Final debrief page -- archetype classification, resilience score, and sharing.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `archetype` | `Archetype \| null` | Player's archetype |
| `archetypeDescription` | `string` | Archetype description |
| `resilienceScore` | `number` | Resilience percentage |
| `role` | `RoleType \| null` | Player's role |
| `personality` | `PersonalityType \| null` | Player's personality |
| `deathType` | `DeathType \| null` | Death type (for KIRK detection) |
| `onRestart` | `() => void` | Restart the game |

**Behavior:**
- Archetype badge image with 1:1 aspect ratio
- Resilience score with contextual description
- KIRK path: "SIMULATION HIJACKED", 0% integrity, "Skill Acquired" badge
- Normal path: archetype-colored border based on score tier
- Share buttons: copy to clipboard, LinkedIn share
- Updates `og:title` and `og:description` meta tags for social sharing
- Voice playback for archetype reveal via `useVoicePlayback`
- V2 waitlist section with LinkedIn CTA

**Score tiers:**

| Score | Color | Context |
|-------|-------|---------|
| >= 80 | Emerald | Exceptional |
| >= 60 | Cyan | Solid |
| >= 40 | Amber | Concerning |
| < 40 | Red | Critical |

---

### ExplanationCard

**File:** `components/game/debrief/ExplanationCard.tsx`

Simple card explaining why a specific ending was reached.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `explanation` | `string` | Death explanation text |
| `className` | `string` | Additional classes |

---

### EmailCaptureForm

**File:** `components/game/debrief/EmailCaptureForm.tsx`

Email capture form for V2 waitlist.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `role` | `string` | Player's role label |
| `archetype` | `string` | Player's archetype name |
| `resilience` | `number` | Resilience score |

**Behavior:** Uses `useEmailCapture` hook for submission state management. Validates email format. Shows success/error states.

---

### ImageWithFallback

**File:** `components/ImageWithFallback.tsx`

Reusable image component with glitch placeholder fallback.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | -- | Image source path |
| `alt` | `string` | -- | Alt text |
| `aspectRatio` | `"video" \| "square" \| "auto"` | `"video"` | Aspect ratio variant |
| `className` | `string` | `""` | Image element classes |
| `containerClassName` | `string` | `""` | Container classes |

**Behavior:**
- Native lazy loading
- `img.decode()` API to prevent jank
- Glitch placeholder with scanline effect while loading
- Smooth 300ms fade-in transition
- Fallback placeholder on load error

---

### WebMCPToolsProvider

**File:** `components/dev/WebMCPToolsProvider.tsx`

Dev-only component that registers WebMCP game control tools. Renders null.

**Props:** Accepts `UseWebMCPToolsDeps` (spread). Mounted conditionally via `import.meta.env.DEV`.

---

## 4. Component Composition Patterns

### Stage Routing Pattern

`App.tsx` owns the game state machine and renders stage components based on `state.stage`:

```
INTRO -> PERSONALITY_SELECT -> ROLE_SELECT -> INITIALIZING -> PLAYING -> BOSS_FIGHT -> DEBRIEF_PAGE_1 -> DEBRIEF_PAGE_2 -> DEBRIEF_PAGE_3
```

Each stage component is wrapped in `LayoutShell`, which is itself wrapped in `StarfieldBackground` at the App level.

### Shared Style Constants

`selectionStageStyles.ts` provides shared Tailwind class strings used across selection and debrief stages:

| Constant | Usage |
|----------|-------|
| `LAYOUT_SHELL_CLASS` | Horizontal/bottom padding for selection stages |
| `LAYOUT_SHELL_CENTERED_CLASS` | Centered variant for intro/debrief |
| `STAGE_CONTAINER_CLASS` | `max-w-4xl` content wrapper |
| `STAGE_HEADER_CLASS` | Centered header with bottom margin |
| `STAGE_GRID_CLASS` | Responsive 1/3 column grid |
| `GLASS_PANEL_DEFAULT` | `glass-card` base class |
| `GLASS_FILL_STRONG` | `glass-strong shadow-lg` for filled panels |
| `SELECT_CARD_BASE` | Selection card base styles |
| `SELECT_CARD_HOVER` | Unlayered hover class (avoids Tailwind specificity conflict) |

### Glass Card System

All panels use CSS classes defined in `index.html`:
- `glass-card` -- frosted glass panel with border
- `glass-strong` -- stronger frosted fill
- `glass-header` -- frosted header (taskbar)
- `glass-card-modal` -- modal-specific glass styling

### Pressure System

Three layers of pressure effects work together:

1. **Visual** -- CSS animations (`pressure-shake`, `pressure-flicker`, `pressure-pulse-overlay`, `pressure-hud-intense`) triggered by `isUrgent` / `isCritical` props
2. **Audio** -- `PressureCueController` -> `usePressureAudio` hook drives heartbeat and alert tones
3. **Haptic** -- Mobile vibration via the same hook

The `CardStack` receives `isUrgent` and applies shake/flicker classes. The `GameHUD` receives countdown values and applies pressure styling.

### Debrief Flow

The three-page debrief is managed by `DebriefContainer` switching on `GameStage`:

```
DebriefContainer
  DEBRIEF_PAGE_1 -> DebriefPage1Collapse (outcome + endings)
    onNext -> DEBRIEF_PAGE_2
  DEBRIEF_PAGE_2 -> DebriefPage2AuditTrail (decision history)
    onNext -> DEBRIEF_PAGE_3
  DEBRIEF_PAGE_3 -> DebriefPage3Verdict (archetype + share)
    onRestart -> INTRO
```

### Context Providers

| Context | Provider | Consumers |
|---------|----------|-----------|
| `StarfieldSpeedUIContext` | `StarfieldBackground` | `Taskbar` (via `useStarfieldSpeedUIBurger`) |

### Button Patterns

Three button variants used throughout:

| Pattern | Classes | Used In |
|---------|---------|---------|
| Primary CTA | `bg-white text-black hover:bg-cyan-400` | Boot, Reboot, Debrief, Next |
| Card Selection | `glass-card` + `selection-stage-card` | Personality, Role select |
| Swipe Action | `border-white/35 hover:bg-cyan-500` | Card swipe buttons |
