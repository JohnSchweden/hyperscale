# Phase 27 — Open Issue Log

## Issue 2: Voice muted when BGM paused — FIXED

**Root cause:** `el.pause()` on an HTMLAudioElement routed through `createMediaElementSource()` triggers an iOS OS-level audio session interruption. iOS then suspends ALL AudioContexts on the page, including the separate voice AudioContext in `voicePlayback.ts`.

**Fix attempts:**
1. Phase 27-01: Added `statechange` keepalive on BGM AudioContext → infinite suspend/resume loop → audio lags. Reverted.
2. Added silent OscillatorNode (1Hz, gain 0.0001) to BGM AudioContext → stutter on BGM pause/resume. Research confirmed: oscillator in same context as MediaElementSource doesn't prevent iOS session suspension; the stall buffer causes audible glitch on resume. Removed.
3. **WORKING FIX (current):** Never call `el.pause()`. When BGM is toggled off, set `gainRef.current.gain.value = 0` (silence via gain). MediaElement keeps playing silently; iOS audio session is never interrupted; voice AudioContext stays running. All volume/ducking effects guard `if (!enabledRef.current) return` to prevent accidentally overriding the 0 gain.

**Files:** `src/hooks/useBackgroundMusic.ts` — `useEffect([enabled])`, `syncVolumeUnlessRamping`, `useEffect([userVolume])`, `useEffect([voiceDucking])`

---

## Issue 3: BGM autoplay doesn't start on swipe — UNRESOLVED

**Root cause:** iOS Safari autoplay policy — `HTMLMediaElement.play()` requires a "trusted user activation." Only `click` and `touchend`-after-tap qualify. A swipe gesture (touchstart → touchmove → touchend with significant movement) does NOT fire `click` and its `touchend` is NOT trusted for `el.play()` by iOS.

**Fix attempts:**
1. `touchstart`-based unlock — iOS 9+ explicitly excludes touchstart ("possibly a scroll start"). `el.play()` rejected silently.
2. `touchend`-based unlock — works for taps (which also fire `click`), but fails for swipes. Confirmed by Phaser docs and WebKit behavior.
3. Play/pause primer trick: call `el.play()` (muted) from touchend, then `el.pause()`, reset, unmute, `tryPlay()` — theory: activation persists. `el.pause()` may revoke iOS trusted-media status, breaking subsequent play.
4. Simplified primer (no pause): call `el.play()` (muted) from touchend, on success just unmute. Removed el.pause(). Still fails for swipe because `el.play()` itself fails from swipe touchend.
5. All-events unlock (touchstart + touchend + click + pointerdown + keydown) — current state. Tap works via `click`; swipe still fails.

**Platform constraint confirmed:** iOS Safari only grants HTMLMediaElement autoplay trust from `click` and short-tap `touchend`. Swipe gestures (touchend with prior movement) do not satisfy the policy in any tested iOS version.

**Paths forward (not yet tried):**
- **Option A — BGM via AudioBufferSourceNode instead of HTMLAudioElement:** Fetch music file, `decodeAudioData`, play via `AudioBufferSourceNode.start()`. Once AudioContext is resumed (which works from touchstart), `bufferSource.start()` needs no gesture. Downside: loads full music file into memory (~10–30MB per track).
- **Option B — Early unlock via pre-game tap:** The game requires taps before card swiping (Boot system → personality → role). If the `click` event on those buttons successfully calls `el.play()` (it should), music is already playing before first swipe. Investigate whether `el.play()` is actually failing on those earlier taps or succeeding silently without audio.
- **Option C — "Tap to start audio" overlay on iOS mobile only:** Show once, auto-dismiss on tap. Industry-standard iOS pattern.

**Files:** `src/hooks/useBackgroundMusic.ts` — autoplay unlock `useEffect`

---

## Issue: Flying speed slower on mobile than desktop — PARTIALLY FIXED

**Root cause (1) — refresh rate:** Animation loop had no delta time. Fixed-step-per-frame means 120Hz runs 2× faster than 60Hz. **Fixed** via delta time normalization in `requestAnimationFrame` callback.

**Root cause (2) — field of view (not yet fixed):** Stars initialized with fixed x∈[-800,800], y∈[-600,600]. On mobile (canvas ~375px, centerX≈187px), only stars near center-axis are ever on-screen — those have small `|x|` and appear to move slowly (little lateral sweep). On desktop (canvas ~1440px, centerX≈720px), stars with large `|x|` are visible and produce dramatic lateral motion. The fix is to initialize x/y relative to screen size so mobile gets the same visual spread as desktop.

**Fix needed:** Change `Star.reset()` to accept `halfW` / `halfH` params:
```typescript
reset(halfW: number, halfH: number) {
    const xRange = (halfW * Z_MAX) / FOCAL_LENGTH; // fills visible cone
    const yRange = (halfH * Z_MAX) / FOCAL_LENGTH;
    this.x = Math.random() * xRange * 2 - xRange;
    this.y = Math.random() * yRange * 2 - yRange;
    this.z = Math.random() * Z_MAX;
}

update(speed: number, halfW: number, halfH: number) {
    this.z -= speed;
    if (this.z < 1) { this.reset(halfW, halfH); this.z = Z_MAX; }
}
```
Pass `centerX, centerY` from animate loop to `star.update(step, centerX, centerY)` and initial `s.reset(w/2, h/2)`.

**Files:** `src/components/game/StarfieldBackground.tsx` — `Star` class, animate loop
