---
phase: 01-voice-files
plan: 02
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true

must_haves:
  truths:
    - "Zen Master voice files exist for all 3 triggers"
    - "Files are valid WAV format (PCM 16-bit, 24kHz, mono)"
    - "Files are located in correct folder structure"
  artifacts:
    - path: "public/audio/voices/zenmaster/onboarding.wav"
    - path: "public/audio/voices/zenmaster/victory.wav"
    - path: "public/audio/voices/zenmaster/failure.wav"
  key_links: []
---

<objective>
Generate 3 Zen Master (Bamboo) voice files using Gemini TTS

Purpose: Create pre-recorded voice files for the Zen Master personality
Output: 3 WAV files in public/audio/voices/zenmaster/
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/phases/01-voice-files/01-CONTEXT.md

# Voice messages from roadmap
Zen Master (Bamboo) - 3 files:
| Trigger | Text |
|---------|------|
| Onboarding | "Namaste, corporate warrior. The data flows like a river. Let us align our chakras and our privacy policies." |
| Victory | "Balance is achieved. The spreadsheets are at peace. You are one with compliance." |
| Failure | "Breathe in... and breathe out the lawsuits. Your karma is now a major liability." |
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Zen Master voice directory</name>
  <files>public/audio/voices/zenmaster</files>
  <action>
Create the directory structure for Zen Master voice files:
- public/audio/voices/zenmaster/

Use mkdir -p to create the directory structure.
  </action>
  <verify>ls -la public/audio/voices/zenmaster/</verify>
  <done>Directory exists at public/audio/voices/zenmaster/</done>
</task>

<task type="auto">
  <name>Task 2: Generate Zen Master voice files</name>
  <files>public/audio/voices/zenmaster/*.wav</files>
  <action>
Using the Gemini TTS API (gemini-2.5-flash-preview-tts with Modality.AUDIO), generate 3 WAV files:

1. onboarding.wav - "Namaste, corporate warrior. The data flows like a river. Let us align our chakras and our privacy policies."
2. victory.wav - "Balance is achieved. The spreadsheets are at peace. You are one with compliance."
3. failure.wav - "Breathe in... and breathe out the lawsuits. Your karma is now a major liability."

Use voice: "Aoede" (calm, meditative voice - different from Roaster)

Save each file as WAV format (PCM 16-bit, 24kHz, mono) to public/audio/voices/zenmaster/{trigger}.wav

Reference existing geminiService.ts for the TTS implementation pattern.
  </action>
  <verify>
ls -la public/audio/voices/zenmaster/
file public/audio/voices/zenmaster/*.wav
  </verify>
  <done>3 WAV files exist in public/audio/voices/zenmaster/</done>
</task>

</tasks>

<verification>
- [ ] Directory public/audio/voices/zenmaster/ exists
- [ ] 3 WAV files present (onboarding, victory, failure)
- [ ] Each file is valid audio (can be played)
</verification>

<success_criteria>
3 Zen Master voice files exist at correct paths
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-02-SUMMARY.md`
</output>
