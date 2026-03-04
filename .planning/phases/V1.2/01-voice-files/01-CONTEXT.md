# Phase 1: Voice Files - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate 13 voice files (WAV format) for all 3 personalities and implement file-based voice playback. Keep real-time TTS for Roast.exe workflow only.

</domain>

<decisions>
## Implementation Decisions

### Voice Generation
- Use existing Gemini TTS service (gemini-2.5-flash-preview-tts) to generate audio
- Generate 13 WAV files: 7 for Roaster, 3 for Zen Master, 3 for Lovebomber
- Save files to `public/audio/voices/` folder structure

### Audio Format
- Format: WAV (PCM 16-bit, 24kHz, mono)
- Folder structure: `public/audio/voices/{personality}/{trigger}.wav`
- Example: `public/audio/voices/roaster/onboarding.wav`

### Playback Implementation
- Load pre-recorded WAV files for onboarding, feedback, victory, failure
- Keep real-time TTS (Gemini API) for Roast.exe workflow only
- Use Web Audio API (existing implementation) to play loaded files

### Error Handling
- If audio file fails to load: show subtle error message
- Error message framed as in-game narrative: "V.E.R.A. voice module malfunctioned" or similar
- Game continues silently after error

</decisions>

<specifics>
## Specific Ideas

- Error message should feel like part of the game's sci-fi/corporate theme
- Voice file naming: `{personality}_{trigger}.wav` (e.g., `roaster_onboarding.wav`)

</specifics>

<deferred>
## Deferred Ideas

- None

</deferred>

---

*Phase: 01-voice-files*
*Context gathered: 2026-02-28*
