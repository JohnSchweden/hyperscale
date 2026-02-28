---
phase: 01-voice-files
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true

must_haves:
  truths:
    - "Roaster voice files exist for all 7 triggers"
    - "Files are valid WAV format (PCM 16-bit, 24kHz, mono)"
    - "Files are located in correct folder structure"
  artifacts:
    - path: "public/audio/voices/roaster/onboarding.wav"
    - path: "public/audio/voices/roaster/feedback-paste.wav"
    - path: "public/audio/voices/roaster/feedback-debug.wav"
    - path: "public/audio/voices/roaster/feedback-install.wav"
    - path: "public/audio/voices/roaster/feedback-ignore.wav"
    - path: "public/audio/voices/roaster/victory.wav"
    - path: "public/audio/voices/roaster/failure.wav"
  key_links: []
---

<objective>
Generate 7 Roaster (V.E.R.A.) voice files using Gemini TTS

Purpose: Create pre-recorded voice files for the Roaster personality to improve quality and reduce API calls during gameplay
Output: 7 WAV files in public/audio/voices/roaster/
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/phases/01-voice-files/01-CONTEXT.md

# Voice messages from roadmap
Roaster (V.E.R.A.) - 7 files:
| Trigger | Text |
|---------|------|
| Onboarding | "Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?" |
| Feedback: Paste | "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'." |
| Feedback: Debug | "Slow. Boring. But legal. I suppose I can't fire you for this." |
| Feedback: Install | "You just installed a keylogger for a 3ms speed boost. I hope you're happy." |
| Feedback: Ignore | "Wisdom? In this building? I must be malfunctioning." |
| Victory | "I... don't hate it. Adequate performance. Here's a badge. Now leave." |
| Failure | "Well, you managed to violate basic common sense. The legal team is crying. Pathetic." |
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create voice directories</name>
  <files>public/audio/voices/roaster</files>
  <action>
Create the directory structure for Roaster voice files:
- public/audio/voices/roaster/

Use mkdir -p to create the directory structure.
  </action>
  <verify>ls -la public/audio/voices/roaster/</verify>
  <done>Directory exists at public/audio/voices/roaster/</done>
</task>

<task type="auto">
  <name>Task 2: Generate Roaster voice files</name>
  <files>public/audio/voices/roaster/*.wav</files>
  <action>
Using the Gemini TTS API (gemini-2.5-flash-preview-tts with Modality.AUDIO), generate 7 WAV files:

1. onboarding.wav - "Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?"
2. feedback-paste.wav - "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'."
3. feedback-debug.wav - "Slow. Boring. But legal. I suppose I can't fire you for this."
4. feedback-install.wav - "You just installed a keylogger for a 3ms speed boost. I hope you're happy."
5. feedback-ignore.wav - "Wisdom? In this building? I must be malfunctioning."
6. victory.wav - "I... don't hate it. Adequate performance. Here's a badge. Now leave."
7. failure.wav - "Well, you managed to violate basic common sense. The legal team is crying. Pathetic."

Use voice: "Kore" (as per current constants.ts)

Save each file as WAV format (PCM 16-bit, 24kHz, mono) to public/audio/voices/roaster/{trigger}.wav

Reference existing geminiService.ts for the TTS implementation pattern (decodeAudioData function, AudioContext usage).
  </action>
  <verify>
ls -la public/audio/voices/roaster/
file public/audio/voices/roaster/*.wav
  </verify>
  <done>7 WAV files exist in public/audio/voices/roaster/</done>
</task>

</tasks>

<verification>
- [ ] Directory public/audio/voices/roaster/ exists
- [ ] 7 WAV files present (onboarding, feedback-paste, feedback-debug, feedback-install, feedback-ignore, victory, failure)
- [ ] Each file is valid audio (can be played)
</verification>

<success_criteria>
7 Roaster voice files exist at correct paths
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-01-SUMMARY.md`
</output>
