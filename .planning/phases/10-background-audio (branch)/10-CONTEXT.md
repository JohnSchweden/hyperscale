# Phase 10: Background Audio - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add ambient music and non-voice audio to the game. This includes background music loops, minimal sound effects for critical moments, and volume controls. Distinct from Phase 04 stress cues (heartbeat, alerts) and Phase 01 voice playback.

</domain>

<decisions>
## Implementation Decisions

### Music style
- Genre: Dark/suspenseful
- Adaptation: Adaptive to game state (intensity tied to heat, progression, and boss encounters)
- Instrumentation: Synthwave/electronic (recommended over orchestral for glitched corporate aesthetic)
- Claude's Discretion: Exact track selection, intensity transition timing

### Audio delivery
- Source: Royalty-free library
- Delivery: Bundled assets in public folder (no CDN)
- Format: MP3 64kbps

### Volume mixing
- Hierarchy: Voice > Music > SFX
- Controls: Three-channel mixer (separate sliders for voice, music, SFX)
- Implementation: Include volume controls in this phase (not deferred to Phase 11)

### Sound effects
- Scope: Minimal — outcomes only (high-stakes moments)
- Excluded: Card swipe sounds, card flip sounds (would undercut immersive atmosphere)
- Menu sounds: Optional, can be muted

</decisions>

<specifics>
## Specific Ideas

- Background music should escalate with heat level, player progression, and boss encounters
- When voice plays, background music ducks (lowers volume) to prioritize speech clarity
- Feedback sounds only at critical decision outcomes, not every swipe

</specifics>

<deferred>
## Deferred Ideas

- None — all audio decisions captured in this phase

</deferred>

---

*Phase: 10-background-audio*
*Context gathered: 2026-03-06*
