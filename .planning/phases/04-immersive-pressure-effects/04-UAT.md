---
status: diagnosed
phase: 04-immersive-pressure-effects
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md]
started: "2026-03-06T00:00:00Z"
updated: "2026-03-06T12:00:00Z"
---

## Current Test

[testing complete]

## Tests

### 1. Urgent countdown visibility
expected: Start a game with Dev role. First card (dev_1) is urgent. A visible countdown appears with stakes messaging like "Decide now or the choice is made for you." The timer counts down from 15.
result: issue
reported: "not visible, also not visible on screenshots"
severity: major

### 2. Timer expiry auto-resolves
expected: On an urgent card, let the countdown reach zero without swiping. The incident resolves automatically to a configured left/right outcome. No undo or revert control is offered — you proceed to next incident.
result: issue
reported: "As the countdown is not visible, it's also not applied to the card to expire and auto resolve. Or it's actually working, and instantly after the game started or the simulation has started, I instantly see an answer to a question, which should happen after either swiping or the countdown runs down."
severity: major

### 3. HUD escalation
expected: Make choices that raise heat or drain budget. As heat gets high or budget gets low, the HUD shows intensified visuals: Critical labels, amber/red color shifts, and a pressure-hud-intense state. The screen should feel increasingly stressed.
result: issue
reported: "nothing visible"
severity: major

### 4. Card stress visuals
expected: When the countdown is active or heat is critical, the incident card shows visible stress effects: shake on the container, flicker and/or pulse on the card. Effects stop when pressure drops (e.g. after you swipe or resolve).
result: issue
reported: "not happening, not visible"
severity: major

### 5. Stress audio
expected: With high heat (bad choices), heartbeat/alert audio plays. When you leave the playing screen or pressure drops, the audio stops. No overlapping duplicate loops.
result: issue
reported: "nothing to hear"
severity: major

### 6. Feedback overlay — team-impact and finality
expected: After choosing an outcome that has team-impact metadata (e.g. certain fin_insider_bot outcomes), the feedback overlay shows the team consequence text. Every outcome shows "Decision logged — no undo. Proceed when ready." There is no Undo or Revert button.
result: pass

### 7. Haptic on critical (mobile)
expected: On a real mobile device with vibration enabled, when entering critical state or when the timer expires, the device vibrates briefly. (Skip if testing on desktop.)
result: issue
reported: "no haptic on mobile"
severity: major

## Summary

total: 7
passed: 1
issues: 6
pending: 0
skipped: 0

## Gaps

- truth: "Urgent incidents show a visible countdown with stakes messaging (e.g. 'Decide now or the choice is made for you') while the player is deciding"
  status: failed
  reason: "User reported: not visible, also not visible on screenshots"
  severity: major
  test: 1
  root_cause: "useCountdown does not re-initialize count to startFrom when isActive switches from false to true. On activation, count stays 0, effect sees count <= 0 and calls onComplete immediately."
  artifacts:
    - path: "hooks/useCountdown.ts"
      issue: "Missing logic to set count to startFrom when isActive transitions from false to true"
  missing:
    - "When isActive becomes true, set count to startFrom before starting tick loop; do not call onComplete when count is 0 but startFrom > 0"
  debug_session: .planning/debug/urgent-countdown-not-visible.md

- truth: "Timer expiry resolves incident after countdown reaches zero; or user swipes. Feedback/answer should not appear instantly at game start before either action."
  status: failed
  reason: "User reported: As the countdown is not visible, it's also not applied to the card to expire and auto resolve. Or it's actually working, and instantly after the game started or the simulation has started, I instantly see an answer to a question, which should happen after either swiping or the countdown runs down."
  severity: major
  test: 2
  root_cause: "Same as gap 1: useCountdown never re-initializes count when switching from inactive to active. count stays 0, onComplete runs immediately on first active frame."
  artifacts:
    - path: "hooks/useCountdown.ts"
      issue: "Effect should set count to startFrom when isActive goes false→true and count===0, instead of calling onComplete"
  missing:
    - "Treat count===0 with startFrom>0 as fresh activation: setCount(startFrom), do not call onComplete"
  debug_session: .planning/debug/timer-expiry-instant-feedback.md

- truth: "High heat and low budget visibly intensify the play screen (Critical labels, color shifts, pressure-hud-intense)"
  status: failed
  reason: "User reported: nothing visible"
  severity: major
  test: 3
  root_cause: "Game flow and deck design: Development deck never allows viewing playing screen in escalated state. Feedback overlay covers HUD; GAME_OVER triggers before next card. Escalation logic in GameHUD is correct."
  artifacts:
    - path: "components/game/GameHUD.tsx"
      issue: "Logic correct but never visible in default path"
    - path: "data/cards/development.ts"
      issue: "Outcomes never allow viewing playing screen in escalated state"
  missing:
    - "Adjust Development deck outcomes or thresholds so escalation is viewable; or show escalation in/alongside feedback overlay when critical"
  debug_session: .planning/debug/hud-escalation-not-visible.md

- truth: "Stress effects (shake, flicker, pulse) activate on card when pressure state is active and relax when pressure drops"
  status: failed
  reason: "User reported: not happening, not visible"
  severity: major
  test: 4
  root_cause: "Same as gap 1/2: useCountdown triggers onComplete immediately on activation. Feedback overlay shows before any frame where stress visuals would be visible."
  artifacts:
    - path: "hooks/useCountdown.ts"
      issue: "count not reset on activation; onComplete runs before stress visuals can render"
  missing:
    - "Fix useCountdown so count resets to startFrom when isActive goes false→true"
  debug_session: .planning/debug/card-stress-not-visible.md

- truth: "High-pressure states trigger audible stress cues (heartbeat/alert) without flooding the user"
  status: failed
  reason: "User reported: nothing to hear"
  severity: major
  test: 5
  root_cause: "pressureAudio.ts calls ctx.resume() but never awaits it. Oscillators start while context still suspended; Web Audio spec: scheduled audio only plays when context is running."
  artifacts:
    - path: "services/pressureAudio.ts"
      issue: "playPulse and startAlert call ctx.resume() without awaiting before starting oscillators"
  missing:
    - "Await ctx.resume() before creating and starting oscillators"
  debug_session: .planning/debug/stress-audio-not-playing.md

- truth: "Critical moments trigger haptic feedback (vibration) on supported mobile devices"
  status: failed
  reason: "User reported: no haptic on mobile"
  severity: major
  test: 7
  root_cause: "navigator.vibrate called from async callbacks (useEffect, setTimeout) outside user gesture. Chrome blocks Vibration API when not triggered by direct user activation."
  artifacts:
    - path: "hooks/usePressureAudio.ts"
      issue: "triggerHaptic runs from useEffect, not user gesture"
    - path: "App.tsx"
      issue: "handleTimerExpiry haptic runs from countdown setTimeout, no user gesture"
  missing:
    - "Call vibrate only from sync handlers attached to user events (swipe, tap); accept timer-expiry haptics may not work on mobile"
  debug_session: .planning/debug/haptic-not-on-mobile.md
