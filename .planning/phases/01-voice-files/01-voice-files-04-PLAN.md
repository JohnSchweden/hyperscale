---
phase: 01-voice-files
plan: 04
type: execute
wave: 2
depends_on: [01-voice-files-01, 01-voice-files-02, 01-voice-files-03]
files_modified: ["services/voicePlayer.ts"]
autonomous: true

must_haves:
  truths:
    - "playVoice function can load and play WAV files from public/audio/voices/"
    - "Error handling shows in-game narrative message if file fails to load"
    - "Function works with all 3 personalities"
  artifacts:
    - path: "services/voicePlayer.ts"
      provides: "playVoice function for pre-recorded audio"
      exports: ["playVoice", "cleanupVoiceAudio"]
  key_links:
    - from: "services/voicePlayer.ts"
      to: "public/audio/voices/"
      via: "fetch + AudioContext.decodeAudioData"
      pattern: "fetch.*voices.*\\.wav"
---

<objective>
Create voice playback system for pre-recorded audio files

Purpose: Implement a new function that plays pre-recorded WAV files instead of generating TTS on-the-fly. This improves quality and reduces API latency.
Output: services/voicePlayer.ts with playVoice function
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/phases/01-voice-files/01-CONTEXT.md
@services/geminiService.ts

# Key context from CONTEXT.md:
- Use Web Audio API for playback (existing pattern in geminiService.ts)
- If audio file fails to load: show subtle error message framed as in-game narrative
- Error message: "V.E.R.A. voice module malfunctioned" or similar corporate/sci-fi themed
- Game continues silently after error

# Voice file locations:
- public/audio/voices/roaster/{trigger}.wav
- public/audio/voices/zenmaster/{trigger}.wav
- public/audio/voices/lovebomber/{trigger}.wav
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create voicePlayer.ts service</name>
  <files>services/voicePlayer.ts</files>
  <action>
Create a new service file services/voicePlayer.ts that:

1. Exports a `playVoice(personality: string, trigger: string)` function that:
   - Constructs the file path: `/audio/voices/{personality}/{trigger}.wav`
   - Fetches the WAV file using fetch()
   - Decodes the audio using AudioContext.decodeAudioData()
   - Plays using AudioBufferSourceNode connected to AudioContext.destination
   - Handles cleanup of previous audio sources

2. Exports a `cleanupVoiceAudio()` function to stop any playing audio and close the AudioContext

3. Implements error handling:
   - If fetch or decode fails, log to console but don't crash
   - Show a subtle toast/notification with in-game narrative: "V.E.R.A. voice module malfunctioned. Continuing in silent mode." (or personality-appropriate message)
   - Game continues silently after error

Use the same AudioContext pattern as geminiService.ts (single shared context, handle suspended state).

Example personality folder names:
- "roaster" for ROASTER personality
- "zenmaster" for ZEN_MASTER personality  
- "lovebomber" for LOVEBOMBER personality
  </action>
  <verify>
cat services/voicePlayer.ts
  </verify>
  <done>services/voicePlayer.ts exists with playVoice and cleanupVoiceAudio exports</done>
</task>

</tasks>

<verification>
- [ ] services/voicePlayer.ts created
- [ ] playVoice(personality, trigger) function exported
- [ ] cleanupVoiceAudio() function exported
- [ ] Error handling shows narrative message
- [ ] Uses Web Audio API (AudioContext)
</verification>

<success_criteria>
Voice playback system can load and play any of the 13 voice files
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-04-SUMMARY.md`
</output>
