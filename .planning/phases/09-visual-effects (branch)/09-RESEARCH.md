# Phase 09: Visual Effects — Research

**Researched:** 2026-03-06
**Domain:** React/Vite game VFX — particles, trails, transitions, feedback bursts
**Confidence:** HIGH

---

## Summary

Phase 09 adds general polish (VFX-01 through VFX-05) to the K-Maru React/Vite game: card swipe flourishes, stage transitions, ambient animations, and outcome feedback micro-effects. The project has **no animation libraries** (package.json: React 19, Vite 6, no framer-motion/tsParticles).

**Primary recommendation:** Use **CSS + bounded DOM** for swipe trails and commit bursts (aligns with 09-01-PLAN: no new animation dependency). Use **canvas-confetti** for outcome feedback bursts in `FeedbackOverlay` — `confetti({ origin: { x, y } })` at ~3KB is a one-shot util, not a full animation lib. Use a hand-rolled `usePrefersReducedMotion` hook (`matchMedia`) to gate optional flourishes. Do **not** add Motion or tsParticles — Phase 09 plans constrain against new animation deps; CSS keyframes + transform/opacity achieve 60fps without bundle bloat.

For stage transitions: keep the existing `stage-transition` + `fadeSlideIn` CSS; optionally wrap `dispatch({ type: "STAGE_CHANGE" })` in `document.startViewTransition()` with a Safari &lt;18 fallback.

---

## Standard Stack

| Need | Solution | Version | Why |
|------|----------|---------|-----|
| Swipe trails, commit burst | CSS `@keyframes` + bounded DOM | — | RAF-throttled gesture already runs at 60fps; divs with `transform`/`opacity` only; no new deps (09-01 constraint). |
| Outcome feedback bursts | **canvas-confetti** | ^1.9.x | 4.6M weekly; `confetti({ origin: { x, y }, colors, particleCount })`; ~3KB; one-shot util, not animation lib. |
| Stage transitions | CSS `fadeSlideIn` | Existing | `.stage-transition` in index.html; optional `document.startViewTransition()` with Safari 18+ fallback. |
| Reduced motion | `usePrefersReducedMotion` hook | Hand-rolled | `matchMedia('(prefers-reduced-motion: reduce)')`; 5-line hook; no library. |
| Easing & timing | `--anim-quick`, `--anim-medium`, `cubic-bezier` | Existing | Already in index.html. |

**Do not add:** Motion, framer-motion, tsParticles, react-spring (09-01 forbids new animation dependency; CSS suffices).

---

## Architecture Patterns

1. **VFX layer separation**
   - `SwipeFxLayer`: Sibling to `CardStack`; receives `{ offset, direction, exitDirection, exitPosition }` from `useSwipeGestures`. Renders capped trail (max 15 segments) + burst (max 12 particles) via `transform`/`opacity` keyframes; `pointer-events: none`.
   - `FeedbackOverlay`: Add CSS scale/glow keyframe on outcome icon; trigger `canvas-confetti` on mount when `fine > 0` (success) or `fine === 0` (fail) at overlay center.
   - Stage wrapper: Keep `App.tsx` `<div className="stage-transition" data-stage={state.stage}>`; optionally enhance with View Transitions API.

2. **Effect metadata flow**
   ```
   useSwipeGestures (offset, direction, exitDirection, exitPosition, isDragging)
        ↓
   GameScreen (passes through)
        ↓
   CardStack + SwipeFxLayer (sibling; both receive same state)
   ```

3. **Bounded effect lifecycle**
   - Trail: Spawn segment every ~40px or 50ms during drag; cap at 15; remove when opacity → 0 or after 300ms.
   - Burst: On `exitDirection` set, spawn 8–12 divs (CSS) or call `confetti()` once (canvas-confetti); animate via keyframes; cleanup after 400ms.

4. **File layout**
   - `components/game/SwipeFxLayer.tsx` — swipe trails (CSS divs) + commit burst (CSS or confetti)
   - `components/game/FeedbackOverlay.tsx` — micro-effect wrapper + `canvas-confetti` call
   - `hooks/usePrefersReducedMotion.ts` — `matchMedia` hook; gate SwipeFxLayer and confetti
   - `index.html` — keyframes for `burstSuccess`, `burstFail`, `trailFade`

---

## Don't Hand-Roll

| Problem | Use instead | Reason |
|---------|-------------|--------|
| Particle physics engine | CSS keyframes + fixed radial trajectories | Full physics = overkill; `scale` + `opacity` radial burst is enough. |
| Spring simulation | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Already in `.spring-snap-back`. |
| Reduced-motion detection | `matchMedia('(prefers-reduced-motion: reduce)')` | Standard; 5-line hook; no library. |
| One-off celebration confetti | `canvas-confetti` | 4.6M weekly; `confetti({ origin, particleCount, spread })`; don't hand-roll canvas particle loop. |
| View transition coordination | `document.startViewTransition(callback)` | Native; fallback: run callback directly. |

Do not hand-roll a particle engine, trail renderer with unbounded nodes, or reduced-motion detection (use library or 5-line hook).

---

## Common Pitfalls

1. **Layout thrash:** Animating `width`, `height`, `left`, `top`, `box-shadow`, or `background` triggers layout. Use only `transform` and `opacity`. [web.dev]

2. **`will-change` abuse:** Apply only to actively animating elements. Remove when animation ends. Existing `.swipe-card` usage is correct.

3. **Unbounded DOM growth:** Rapid swipes must not spawn unlimited trail/particle nodes. Enforce hard caps (15 trail, 12 burst) and evict oldest.

4. **React animation:** Key changes cause remounts; `key={currentCardIndex}` is already correct. Avoid animating in `useEffect` without cleanup — prefer CSS-driven animations.

5. **Stage transition vs swipe:** Do not use left/right motion for stage transitions; `fadeSlideIn` uses `translateY` + `scale` to avoid competing with swipe semantics.

6. **`prefers-reduced-motion`:** Gate optional flourishes (trails, bursts, confetti). Core UX (card exit, feedback text) must work without motion. Use `usePrefersReducedMotion()` and skip `SwipeFxLayer` / confetti when `true`.

---

## Code Examples

### 1. usePrefersReducedMotion hook — Josh Comeau pattern

```typescript
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReducedMotion;
}
// In SwipeFxLayer: if (usePrefersReducedMotion()) return null;
```

### 2. canvas-confetti burst at position — npm/canvas-confetti

```typescript
import confetti from "canvas-confetti";

// Success burst (green tint) at overlay center
confetti({
  particleCount: 50,
  spread: 70,
  origin: { x: 0.5, y: 0.5 },
  colors: ["#22c55e", "#10b981", "#34d399"],
});

// Fail burst (red tint)
confetti({
  particleCount: 30,
  spread: 50,
  origin: { x: 0.5, y: 0.5 },
  colors: ["#ef4444", "#dc2626"],
});
```

### 3. View Transition API with fallback — MDN (optional)

```typescript
function handleStageChange(stage: GameStage) {
  if (document.startViewTransition) {
    document.startViewTransition(() => dispatch({ type: "STAGE_CHANGE", stage }));
  } else {
    dispatch({ type: "STAGE_CHANGE", stage });
  }
}
```

### 4. Bounded trail spawn (throttle by distance)

```typescript
const lastSpawnX = useRef(0);
const MAX_TRAIL = 15;
if (Math.abs(clientX - lastSpawnX.current) > 40) {
  setTrail((prev) => {
    const next = [...prev, { x: clientX, y: clientY, id: Date.now() }];
    return next.slice(-MAX_TRAIL);
  });
  lastSpawnX.current = clientX;
}
```

### 5. CSS burst keyframes (index.html)

```css
@keyframes burstOut {
  from { opacity: 1; transform: scale(0.3); }
  to { opacity: 0; transform: scale(1.2); }
}
.burst-particle {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  pointer-events: none;
  animation: burstOut 0.4s ease-out forwards;
}
```

### 6. Existing stage transition (index.html) — reuse

```css
.stage-transition {
  animation: fadeSlideIn var(--anim-medium) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## Sources

| Source | Confidence | Notes |
|--------|------------|-------|
| [Josh W. Comeau: usePrefersReducedMotion](https://www.joshwcomeau.com/snippets/react-hooks/use-prefers-reduced-motion/) | HIGH | Standard React pattern; `matchMedia` + listener |
| [canvas-confetti npm](https://www.npmjs.com/package/canvas-confetti) | HIGH | 4.6M weekly; `confetti({ origin, particleCount, colors })` |
| [tsParticles Fireworks](https://particles.js.org/docs/modules/tsParticles_Fireworks_Bundle.html) | MEDIUM | `fireworks()` for ambient; not for on-demand positional burst |
| [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) | HIGH | `startViewTransition` fallback pattern |
| [web.dev High-performance CSS animations](https://web.dev/articles/animations-guide) | HIGH | transform/opacity, will-change, compositor-only |
| [Phase 04 Research](../04-immersive-pressure-effects/04-RESEARCH.md) | HIGH | prefers-reduced-motion; CSS keyframes for stress |
| [Phase 09-01-PLAN](09-01-PLAN.md) | HIGH | SwipeFxLayer, bounded effects, no new animation dep |
| motion.dev / framer-motion docs | MEDIUM | Verified APIs; not recommended due to 09-01 constraint |
