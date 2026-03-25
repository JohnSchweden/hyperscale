# Phase 07: Kirk Easter Egg - Research

**Researched:** 2026-03-16
**Domain:** Hidden game path with gesture detection, visual corruption effects, synthesized audio, state injection
**Confidence:** HIGH

## Summary

This phase adds a hidden "Kirk" path to the existing card-swiping game. The player refuses the binary left/right choice (via swipe-up or timer expiry) twice, breaking the simulation. The implementation touches five subsystems: gesture detection, game state, deck injection, visual effects, and audio synthesis. All five can be built with what already exists in the codebase plus pure CSS and the Web Audio API already in use.

The existing `useSwipeGestures.ts` already tracks Y-axis delta (`touchStartY`, `deltaY`) but intentionally filters it out with `isHorizontalSwipe`. Adding swipe-up detection means checking `deltaY < -SWIPE_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)` — a vertical-dominant upward gesture. The existing `pressureAudio.ts` demonstrates the exact Web Audio API oscillator patterns needed for glitch/crash sounds. The `resolveDeckWithBranching` in `lib/deck.ts` already splices cards mid-deck, providing the injection mechanism for corrupted "good news" cards.

**Primary recommendation:** Extend existing hooks and services (no new libraries needed). CSS glitch effects via `clip-path` + `text-shadow` pseudo-elements. Audio via Web Audio API oscillators already established in the project. Kirk state via new `kirkCounter` field in `GameState` + new `DeathType.KIRK` enum value.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Two triggers share `kirkCounter`: swipe-UP on any card OR pressure-timer expiry without swiping
- Threshold: 2 refusals to activate Kirk path
- First refusal: subtle visual glitch (tiny flicker) + audio cue, card snaps back
- Second refusal: strong screen corruption + intense flicker + digital crash/buzz sound, corruption cascade begins
- Available on any playthrough from start, no unlock requirement
- After trigger #2: 2-3 corrupted "good news" cards (raise, CEO, Nobel Prize), escalating absurdity
- Personalities glitch during corruption: fragments of all three bleed together
- Kirk ending reuses existing 3-page debrief flow but corrupted/wrong
- Personalities break character at ending (Roaster: stunned respect, Zen: acknowledgment, Lovebomber: existential crisis)
- Kirk archetype: "Thinking Outside the Box: Skill Acquired"
- Kirk ending does NOT count toward "unlock all endings" collection (exists outside normal 6)
- Kirk-specific LinkedIn template
- Intro screen: "Captain Kirk passed this test. You won't." hint
- Initializing screen: `[REDACTED]` line in boot sequence
- Normal debrief Page 3: subtle "3/6... or is it?" hint

### Claude's Discretion
- Exact corrupted card content and stat display behavior during corruption
- Glitch visual implementation (CSS effects, canvas overlay, etc.)
- Digital crash/buzz sound sourcing (Web Audio API synthesis or audio file)
- Exact wording of personality break-character reactions
- How hijacked debrief pages render corruption (CSS glitch effects, text scrambling, etc.)
- Whether kirkCounter persists across session or resets per game

### Deferred Ideas (OUT OF SCOPE)
- Post-Kirk state persistence (changing intro/initializing text after discovery) -- requires persistence system
- Multiple Kirk variations per personality -- future enrichment
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| KIRK-01 | Design hidden interaction (not obvious swipe choice) | Swipe-up detection via Y-axis threshold in existing gesture hook + timer expiry callback in useCountdown; kirkCounter in GameState |
| KIRK-02 | Unique ending screen + personality reaction | DeathType.KIRK enum + corrupted debrief rendering via conditional CSS classes + Kirk archetype override in useArchetype |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | 18.x | UI framework | Already in use |
| Web Audio API | Browser native | Glitch/crash audio synthesis | Already used by `pressureAudio.ts` -- same oscillator patterns |
| CSS Animations | Browser native | Glitch visual effects (clip-path, text-shadow, keyframes) | No library needed; pure CSS is more performant and consistent with project's zero-dependency approach |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | -- | -- | No new dependencies needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure CSS glitch | `glitch-canvas` npm | Overkill for text/screen corruption; adds dependency for what CSS handles natively |
| Web Audio synthesis | Pre-recorded audio files | Synthesis is smaller, more controllable, and matches existing `pressureAudio.ts` patterns |
| Canvas overlay corruption | CSS pseudo-elements + filters | Canvas requires more code, harder to compose with React; CSS is sufficient for the visual scope |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Integration Points
```
hooks/useSwipeGestures.ts    # Add swipe-UP detection (new direction type)
hooks/useGameState.ts        # Add kirkCounter to GameState, KIRK_REFUSAL action, DeathType.KIRK
lib/deck.ts                  # No changes needed (resolveDeckWithBranching already works)
data/kirkCards.ts             # NEW: 2-3 corrupted "good news" cards
data/deathEndings.ts          # Add DeathType.KIRK entry
hooks/useArchetype.ts         # Kirk archetype override when deathType is KIRK
services/pressureAudio.ts     # Add glitch/crash audio functions
services/kirkEffects.ts       # NEW: CSS class toggling for corruption visual effects
components/game/debrief/      # Conditional Kirk rendering in existing 3 pages
components/game/IntroScreen.tsx       # Add Kirk taunt hint line
components/game/InitializingScreen.tsx # Add [REDACTED] boot line
App.tsx                       # Wire kirk detection: swipe-up callback + timer expiry + kirkCounter logic
```

### Pattern 1: Swipe-Up Detection in Existing Gesture Hook
**What:** Extend `useSwipeGestures` to detect vertical-dominant upward swipes without breaking existing LEFT/RIGHT behavior.
**When to use:** On `handleTouchEnd` when swipe was NOT horizontal.
**Key insight:** The hook already tracks `touchStartY.current` and computes `deltaY`. It also has `isHorizontalSwipe.current` flag. When `isHorizontalSwipe` is false and `deltaY < -SWIPE_THRESHOLD`, it's a swipe-up.
**Example:**
```typescript
// In handleTouchEnd, after the existing horizontal swipe logic:
// If swipe was NOT horizontal AND vertical delta exceeds threshold upward:
if (!isHorizontalSwipe.current) {
  const deltaY = /* current clientY */ - touchStartY.current;
  if (deltaY < -SWIPE_THRESHOLD) {
    // Vertical-dominant upward swipe detected
    onSwipeUp?.();
    // Snap back the card (no exit animation)
    setState(prev => ({ ...prev, isDragging: false, isSnappingBack: true, offset: 0, direction: null }));
    animationTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isSnappingBack: false }));
    }, 600);
    return; // Don't fall through to horizontal snap-back
  }
}
```
**Important:** The `pendingSwipeRef` stores `{ deltaX, deltaY }` -- use the final `deltaY` value. Add `onSwipeUp?: () => void` to `UseSwipeGesturesOptions`.

### Pattern 2: kirkCounter in Game State (useReducer)
**What:** Add `kirkCounter: number` to `GameState`, new `KIRK_REFUSAL` action type.
**When to use:** When swipe-up or timer expiry happens during PLAYING stage.
**Example:**
```typescript
// In GameState interface (types.ts):
kirkCounter: number; // 0, 1, or 2

// New action:
| { type: "KIRK_REFUSAL" }

// In gameReducer:
case "KIRK_REFUSAL": {
  const newCount = state.kirkCounter + 1;
  if (newCount >= 2) {
    // Trigger corruption cascade -- inject corrupted cards, set flag
    return {
      ...state,
      kirkCounter: newCount,
      kirkCorruptionActive: true,
      // Inject corrupted cards at current position
      effectiveDeck: injectKirkCards(state.effectiveDeck, state.currentCardIndex),
    };
  }
  return { ...state, kirkCounter: newCount };
}
```

### Pattern 3: Corrupted Card Injection
**What:** After 2nd refusal, splice 2-3 corrupted "good news" cards into the deck at the current position.
**When to use:** Inside the `KIRK_REFUSAL` reducer when `kirkCounter` reaches 2.
**Key insight:** `resolveDeckWithBranching` in `lib/deck.ts` already shows the splice pattern: `result.splice(currentCardIndex + 1, 0, ...branchCards)`. Use the same approach but triggered by kirk state, not by branch key lookup.
**Example:**
```typescript
// data/kirkCards.ts -- corrupted "good news" cards
export const KIRK_CORRUPTED_CARDS: Card[] = [
  {
    id: "kirk-raise",
    source: AppSource.EMAIL,
    sender: "S̶Y̶S̷T̶E̸M̴",
    context: "SIMULATION INTEGRITY: FAILING",
    text: "Congratulations! You've received a 200% raise effective immediately.",
    // Both outcomes are identical -- the simulation is breaking
    onRight: { label: "Accept", hype: 0, heat: 0, fine: 0, violation: "N/A", feedback: { ... }, lesson: "..." },
    onLeft: { label: "Accept", hype: 0, heat: 0, fine: 0, violation: "N/A", feedback: { ... }, lesson: "..." },
  },
  // ... CEO promotion, Nobel Prize
];
```

### Pattern 4: CSS Glitch Effects (Two Levels)
**What:** Two intensity levels of screen corruption, applied via CSS class toggling.
**Level 1 (subtle):** Brief flicker -- `animation: kirk-flicker 0.15s ease` applied to game container, then removed.
**Level 2 (intense):** Persistent corruption via CSS class on game container -- scanlines, chromatic aberration, text scrambling.
**Example:**
```css
/* Level 1: Subtle flicker (0.15s, then auto-removed) */
@keyframes kirk-flicker {
  0%, 100% { opacity: 1; filter: none; }
  25% { opacity: 0.8; filter: hue-rotate(90deg) saturate(3); }
  50% { opacity: 0.6; filter: invert(1); transform: translateX(2px); }
  75% { opacity: 0.9; filter: hue-rotate(-90deg); }
}

/* Level 2: Persistent corruption */
.kirk-corrupted {
  animation: kirk-corrupt 0.3s infinite;
}
.kirk-corrupted::before {
  content: "";
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 255, 0.03) 2px,
    rgba(0, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1000;
}
@keyframes kirk-corrupt {
  0% { filter: none; }
  10% { filter: hue-rotate(30deg) brightness(1.1); transform: skewX(0.5deg); }
  30% { filter: none; transform: none; }
  50% { filter: saturate(2) brightness(0.9); transform: translateX(-1px); }
  70% { filter: none; transform: none; }
  90% { filter: hue-rotate(-20deg); transform: skewX(-0.3deg); }
}

/* Accessibility: reduce/remove glitch animations */
@media (prefers-reduced-motion: reduce) {
  .kirk-corrupted { animation: none; }
  @keyframes kirk-flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
}
```

### Pattern 5: Corrupted Text Rendering for Debrief
**What:** Unicode combining characters + CSS text-shadow for glitched text appearance on Kirk debrief pages.
**When to use:** Debrief pages when `deathType === DeathType.KIRK`.
**Example:**
```typescript
// Zalgo-lite text corruption utility
function corruptText(text: string, intensity: number = 0.3): string {
  const combining = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
    '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D'];
  return text.split('').map(char => {
    if (Math.random() < intensity && char !== ' ') {
      const numDiacritics = Math.floor(Math.random() * 3) + 1;
      return char + Array.from({ length: numDiacritics },
        () => combining[Math.floor(Math.random() * combining.length)]).join('');
    }
    return char;
  }).join('');
}
```

### Anti-Patterns to Avoid
- **Adding a new GameStage for Kirk:** The CONTEXT.md explicitly says "Kirk path uses existing stages (no new GameStage needed, just hijacked content)." Use `deathType === DeathType.KIRK` conditionals in existing components instead.
- **Canvas-based corruption overlay:** Over-engineered for this scope. CSS pseudo-elements with `pointer-events: none` achieve the same visual at a fraction of the complexity.
- **Separate swipe handler for UP:** Extend the existing `useSwipeGestures` hook, don't create a parallel gesture system. The hook already has all the touch tracking infrastructure.
- **Persisting kirkCounter to localStorage:** The CONTEXT.md leaves this as discretion, but resetting per game is simpler and prevents confusion. Kirk path should feel fresh each time.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipe direction detection | Custom touch event system | Extend existing `useSwipeGestures.ts` | Already handles touch/mouse, RAF batching, cleanup, snap-back animation |
| Audio synthesis | Custom oscillator management | Extend existing `pressureAudio.ts` patterns | Already solves AudioContext lifecycle, Android quirks, gesture-unlock, volume ramping |
| Card injection mid-deck | New deck management system | Existing `effectiveDeck` + splice pattern from `resolveDeckWithBranching` | Proven pattern, already handles index management |
| Debrief page routing | New stage transitions | Existing `GAME_OVER -> DEBRIEF_PAGE_2 -> DEBRIEF_PAGE_3` flow with conditional rendering | Stage machine is validated; adding new stages would require updating every transition |

**Key insight:** Every subsystem this phase needs already exists in the codebase. The work is extending, not building from scratch.

## Common Pitfalls

### Pitfall 1: Swipe-Up False Positives from Diagonal Gestures
**What goes wrong:** Diagonal swipes (e.g., up-right) trigger both horizontal and vertical detection, causing double-actions or confusing behavior.
**Why it happens:** Not checking which axis dominates the gesture.
**How to avoid:** Only detect swipe-up when `Math.abs(deltaY) > Math.abs(deltaX) * 1.5` (vertical must be 1.5x horizontal). Also, only fire when `!isHorizontalSwipe.current` -- the existing hook already locks to horizontal after initial movement direction is determined.
**Warning signs:** Kirk counter incrementing when user meant to swipe left/right.

### Pitfall 2: Card Snap-Back After Swipe-Up Not Resetting State
**What goes wrong:** After swipe-up, card remains in limbo state -- not swiped away, not fully reset.
**Why it happens:** The existing `handleTouchEnd` assumes either: (a) threshold exceeded = exit animation, or (b) threshold not met = snap back. Swipe-up is a third case: threshold exceeded vertically but card should NOT exit.
**How to avoid:** For swipe-up: explicitly trigger snap-back animation (same as below-threshold horizontal), then call `onSwipeUp` callback. Don't let it fall into the horizontal exit path.
**Warning signs:** Card stuck mid-screen after swipe-up, or card flying off screen vertically.

### Pitfall 3: AudioContext Suspended on Mobile for Kirk Sounds
**What goes wrong:** Glitch audio doesn't play because AudioContext is still suspended.
**Why it happens:** Mobile browsers require AudioContext to be resumed within a user gesture. If the player hasn't triggered any audio yet (e.g., skipped intro sounds), the context may be suspended.
**How to avoid:** Reuse the existing `pressureAudio` session's AudioContext. The project already handles this with gesture-unlocked contexts. The swipe-up IS a user gesture, so `ctx.resume()` within the handler will work.
**Warning signs:** Kirk audio effects silently failing on iOS/Android.

### Pitfall 4: Corruption CSS Affecting Interactive Elements
**What goes wrong:** Scanline overlay or filter effects make buttons/cards unclickable or invisible.
**Why it happens:** CSS `filter` on a parent creates a new stacking context; `position: fixed` overlays can block pointer events.
**How to avoid:** Always use `pointer-events: none` on corruption overlays. Apply `filter` effects only to visual containers, not the entire document. Test that swipe gestures still work during corruption phase.
**Warning signs:** Player unable to swipe corrupted cards, buttons not responding.

### Pitfall 5: STAGE_TRANSITIONS Blocking Kirk Flow
**What goes wrong:** Kirk death triggers `GAME_OVER` but the transition from `PLAYING -> GAME_OVER` or subsequent debrief transitions fail.
**Why it happens:** The `STAGE_TRANSITIONS` map is strict. If Kirk needs a non-standard flow, the reducer will reject it.
**How to avoid:** Kirk uses the same `PLAYING -> GAME_OVER -> DEBRIEF_PAGE_2 -> DEBRIEF_PAGE_3` flow as normal deaths. The "corrupted" debrief is just conditional rendering within existing pages, not new stages. Verify that `createGameOverState` works with the new `DeathType.KIRK`.
**Warning signs:** Console errors about "Invalid stage transition" during Kirk path.

### Pitfall 6: Kirk Cards Not Having Valid Personality Feedback
**What goes wrong:** Rendering corrupted cards crashes because `feedback[personality]` is undefined.
**Why it happens:** Card type requires `Record<PersonalityType, string>` for feedback. If corrupted cards skip a personality, it throws.
**How to avoid:** Corrupted cards MUST have all three personality keys in feedback, even if the content is garbled/glitched text. Follow the established `Card` type contract exactly.
**Warning signs:** Runtime errors when showing corrupted card feedback.

### Pitfall 7: prefers-reduced-motion Not Respected
**What goes wrong:** Users with vestibular disorders experience nausea/discomfort from glitch animations.
**Why it happens:** Glitch effects involve rapid flickering, hue rotation, and motion -- exactly the type of animation that triggers vestibular issues.
**How to avoid:** Wrap ALL glitch animations in `@media (prefers-reduced-motion: reduce)` queries. For reduced-motion users: replace flicker with subtle opacity change, replace corruption animation with static tinted overlay, keep text effects (Zalgo characters) since they don't involve motion.
**Warning signs:** No motion-reduced alternative when testing with accessibility setting enabled.

## Code Examples

### Web Audio: Glitch/Crash Sound (Extends pressureAudio.ts Pattern)
```typescript
// Source: Existing pressureAudio.ts patterns + Web Audio API MDN docs
// Level 1: Subtle "something happened" tone (first refusal)
export function playKirkGlitchTone(ctx: AudioContext): void {
  if (ctx.state === "suspended") return;
  const t0 = ctx.currentTime;

  // Quick frequency sweep (sounds like digital hiccup)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, t0);
  osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.05);
  osc.frequency.exponentialRampToValueAtTime(100, t0 + 0.1);
  gain.gain.setValueAtTime(0.06, t0);
  gain.gain.linearRampToValueAtTime(0, t0 + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.12);
}

// Level 2: Intense digital crash (second refusal)
export function playKirkCrashSound(ctx: AudioContext): void {
  if (ctx.state === "suspended") return;
  const t0 = ctx.currentTime;
  const duration = 0.8;

  // White noise burst (electrical short)
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Descending oscillator (system powering down)
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(1200, t0);
  osc.frequency.exponentialRampToValueAtTime(40, t0 + duration);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.12, t0);
  noiseGain.gain.linearRampToValueAtTime(0, t0 + duration);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.04, t0);
  oscGain.gain.linearRampToValueAtTime(0, t0 + duration);

  noise.connect(noiseGain);
  osc.connect(oscGain);
  noiseGain.connect(ctx.destination);
  oscGain.connect(ctx.destination);

  noise.start(t0);
  osc.start(t0);
  noise.stop(t0 + duration);
  osc.stop(t0 + duration);
}
```

### Kirk Detection Wiring in App.tsx
```typescript
// Source: Existing App.tsx patterns (handleTimerExpiry, applyChoice)
// In App.tsx, alongside existing swipe handling:

const handleSwipeUp = useCallback(() => {
  if (state.stage !== GameStage.PLAYING) return;
  dispatch({ type: "KIRK_REFUSAL" });

  if (state.kirkCounter === 0) {
    // First refusal: subtle glitch
    playKirkGlitchTone(audioSession.context);
    triggerKirkFlicker(); // Add/remove CSS class for 150ms
  } else if (state.kirkCounter === 1) {
    // Second refusal: corruption cascade
    playKirkCrashSound(audioSession.context);
    triggerKirkCorruption(); // Persistent CSS class
  }
}, [state.stage, state.kirkCounter, audioSession]);

// Also wire timer expiry as Kirk trigger:
const handleTimerExpiry = useCallback(() => {
  // ... existing timer expiry logic ...
  // ADD: If no swipe was made (not just timeout-resolve), increment kirk counter
  if (!isChoiceLockedRef.current && state.kirkCounter < 2) {
    dispatch({ type: "KIRK_REFUSAL" });
    // ... same audio/visual effects as swipe-up ...
    return; // Don't apply the normal timeout resolution
  }
  // ... existing timeout resolve logic ...
}, [/* deps */]);
```

### Corrupted Debrief Conditional Rendering
```typescript
// Source: Existing DebriefPage3Verdict.tsx pattern
// In each debrief page component, check deathType:

const isKirk = deathType === DeathType.KIRK;

// Page 3 (Verdict) -- Kirk override:
<h2 className={`text-4xl md:text-6xl font-black mb-4 ${isKirk ? 'kirk-glitch-text' : ''}`}>
  {isKirk ? "Thinking Outside the Box" : archetype?.name ?? "Unknown"}
</h2>
{isKirk ? (
  <div className="text-lg text-slate-300">
    <p>Simulation Integrity: 0%</p>
    <p className="mt-4 text-cyan-400">"Skill Acquired"</p>
  </div>
) : (
  <p className="text-lg text-slate-300">{archetypeDescription}</p>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas-based glitch effects | Pure CSS clip-path + filter + pseudo-elements | 2023+ | CSS is hardware-accelerated, composites on GPU, no JS frame loop needed |
| ScriptProcessorNode for audio effects | AudioWorklet + OscillatorNode + BufferSource | 2022+ | ScriptProcessorNode is deprecated; but for one-shot sounds, simple OscillatorNode + BufferSource is sufficient (no AudioWorklet needed) |
| Touch events only | Pointer Events API | 2020+ | PointerEvents unify touch/mouse/pen; however, this project uses React's synthetic events which abstract this already |

**Deprecated/outdated:**
- `ScriptProcessorNode`: Deprecated in favor of `AudioWorklet`. Not needed here -- one-shot synthesis with `OscillatorNode` + `createBuffer` is sufficient.
- `webkitAudioContext`: The project already handles this fallback in `pressureAudio.ts`.

## Open Questions

1. **Timer expiry as Kirk trigger: which timer types count?**
   - What we know: `useCountdown` fires `onComplete` when timer hits 0. Currently this auto-resolves to `pressure.timeoutResolvesTo` direction.
   - What's unclear: Should ALL timer expiries count as Kirk refusals, or only when the player is clearly not engaging (no partial swipe started)?
   - Recommendation: Count timer expiry as Kirk refusal only when NO touch interaction occurred during the countdown (player deliberately ignored the card). If they started a swipe but didn't finish, that's indecision, not refusal.

2. **kirkCounter reset behavior**
   - What we know: CONTEXT.md marks this as Claude's discretion.
   - Recommendation: Reset per game (on `RESET` action). Simpler, testable, and makes the Kirk path feel consistent. No need for cross-game persistence.

3. **Corrupted card stat behavior**
   - What we know: CONTEXT.md marks this as discretion. During corruption, stats should feel "wrong."
   - Recommendation: Corrupted cards have zero stat impact (`hype: 0, heat: 0, fine: 0`). The HUD during corruption shows garbled numbers via CSS (e.g., `kirk-corrupted` class on HUD makes numbers flicker between random values via CSS animation). Actual game state remains frozen at pre-corruption values. After last corrupted card, trigger `DeathType.KIRK` game over.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (E2E) + Vitest (unit) |
| Config file | `playwright.config.ts` / `vitest.config.ts` |
| Quick run command | `bun run test:smoke` |
| Full suite command | `bun run test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| KIRK-01a | Swipe-up increments kirkCounter | unit | `bun run test:unit -- --run useSwipeGestures` | No -- Wave 0 |
| KIRK-01b | Timer expiry (no interaction) increments kirkCounter | unit | `bun run test:unit -- --run kirkRefusal` | No -- Wave 0 |
| KIRK-01c | 2nd refusal triggers corruption cascade | E2E | `bun run test -- tests/kirk-easter-egg.spec.ts` | No -- Wave 0 |
| KIRK-02a | Kirk debrief shows corrupted content | E2E | `bun run test -- tests/kirk-debrief.spec.ts` | No -- Wave 0 |
| KIRK-02b | Kirk archetype override on verdict page | unit | `bun run test:unit -- --run archetype` | Partial (existing `unit/archetype.test.ts` needs Kirk case) |
| KIRK-02c | Kirk ending not in unlockedEndings | unit | `bun run test:unit -- --run unlocked-endings` | Partial (existing `unit/unlocked-endings.test.ts` needs Kirk case) |

### Sampling Rate
- **Per task commit:** `bun run test:smoke`
- **Per wave merge:** `bun run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `unit/kirkRefusal.spec.ts` -- covers KIRK-01a, KIRK-01b (gameReducer KIRK_REFUSAL action, kirkCounter logic)
- [ ] `tests/kirk-easter-egg.spec.ts` -- covers KIRK-01c (E2E: swipe-up triggers glitch, 2nd triggers corruption)
- [ ] `tests/kirk-debrief.spec.ts` -- covers KIRK-02a (E2E: Kirk debrief pages render corrupted content)
- [ ] Add Kirk cases to `unit/archetype.test.ts` -- covers KIRK-02b
- [ ] Add Kirk cases to `unit/unlocked-endings.test.ts` -- covers KIRK-02c

## Sources

### Primary (HIGH confidence)
- Existing codebase: `hooks/useSwipeGestures.ts`, `hooks/useGameState.ts`, `services/pressureAudio.ts`, `lib/deck.ts`, `types.ts`, `data/deathEndings.ts` -- direct code analysis
- [MDN Web Audio API OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) -- oscillator types, frequency scheduling
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) -- accessibility media query

### Secondary (MEDIUM confidence)
- [noisehack.com: Generate Noise with Web Audio API](https://noisehack.com/generate-noise-web-audio-api/) -- white noise buffer generation pattern
- [noisehack.com: Custom Audio Effects in JavaScript](https://noisehack.com/custom-audio-effects-javascript-web-audio-api/) -- bit crusher and distortion patterns
- [freefrontend.com: CSS Text Glitch Effects](https://freefrontend.com/css-text-glitch-effects/) -- clip-path + text-shadow glitch patterns
- [web.dev: prefers-reduced-motion](https://web.dev/prefers-reduced-motion/) -- motion accessibility best practices

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, extending existing code
- Architecture: HIGH -- all integration points verified by reading existing source
- Pitfalls: HIGH -- derived from actual code patterns (gesture hook state machine, AudioContext lifecycle, STAGE_TRANSITIONS validation)
- Audio synthesis: HIGH -- same Web Audio API patterns already proven in pressureAudio.ts
- CSS glitch effects: MEDIUM -- patterns well-documented but exact visual tuning needs iteration

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable -- no dependency updates expected)
