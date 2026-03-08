# Test lane taxonomy

Tag set and mapping for tiered Playwright execution.

## Tag set

| Tag | Purpose |
|-----|---------|
| `@smoke` | Fast critical user journey checks; runs in local dev loop |
| `@area:gameplay` | Stage flows, deck selection, HUD, card content |
| `@area:input` | Keyboard, swipe, drag, button highlight |
| `@area:layout` | Viewport, responsive, overlay, touch |
| `@area:boss` | Boss fight timer, randomization, death types |
| `@area:audio` | Voice playback, audio files |
| `@visual` | Snapshot/visual regression; run separately from functional |
| `@integration` | External/live dependencies, mocked APIs |
| `@api-live` | Live API (excluded from default runs) |
| `@slow` | Timer-heavy or long scenario; excluded from CI gate, run in nightly |

## Spec file → tag mapping

| Spec file | Tags |
|-----------|------|
| keyboard-navigation.spec.ts | @smoke @area:input |
| card-deck-selection.spec.ts | @smoke @area:gameplay |
| game-hud.spec.ts | @smoke @area:gameplay |
| mobile-width.spec.ts | @smoke @area:layout |
| roast-console.spec.ts | @smoke @area:gameplay |
| voice-audio-files.spec.ts | @smoke @area:audio |
| stage-transitions.spec.ts | @area:gameplay @slow |
| stage-snapshots.spec.ts | @visual @area:gameplay @slow |
| death-types.spec.ts | @area:boss @slow |
| boss-fight-timer.spec.ts | @area:boss @slow |
| boss-fight-randomization.spec.ts | @area:boss |
| personality-feedback.spec.ts | @area:gameplay |
| swipe-interactions.spec.ts | @area:input |
| swipe-consistency.spec.ts | @area:input |
| drag-tracking.spec.ts | @area:input |
| snap-back.spec.ts | @area:input |
| exit-animation.spec.ts | @area:input |
| button-highlight.spec.ts | @area:input |
| layout-overlay-touch.spec.ts | @area:layout |
| immersive-pressure-cues.spec.ts | @area:gameplay |
| immersive-pressure-visuals.spec.ts | @area:gameplay |
| voice-playback-integration.spec.ts | @integration @area:audio |
| live-api.spec.ts | @integration @api-live @slow |
