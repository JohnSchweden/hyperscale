---
phase: 01-voice-files
plan: 03
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true

must_haves:
  truths:
    - "Lovebomber voice files exist for all 3 triggers"
    - "Files are valid WAV format (PCM 16-bit, 24kHz, mono)"
    - "Files are located in correct folder structure"
  artifacts:
    - path: "public/audio/voices/lovebomber/onboarding.wav"
    - path: "public/audio/voices/lovebomber/victory.wav"
    - path: "public/audio/voices/lovebomber/failure.wav"
  key_links: []
---

<objective>
Generate 3 Lovebomber (Hype-Bro) voice files using Gemini TTS

Purpose: Create pre-recorded voice files for the Lovebomber personality
Output: 3 WAV files in public/audio/voices/lovebomber/
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/phases/01-voice-files/01-CONTEXT.md

# Voice messages from roadmap
Lovebomber (Hype-Bro) - 3 files:
| Trigger | Text |
|---------|------|
| Onboarding | "OMG HI!! We are literally going to change the world! You look SO compliant today! Let's crush it!" |
| Victory | "YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!" |
| Failure | "Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!" |
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Lovebomber voice directory</name>
  <files>public/audio/voices/lovebomber</files>
  <action>
Create the directory structure for Lovebomber voice files:
- public/audio/voices/lovebomber/

Use mkdir -p to create the directory structure.
  </action>
  <verify>ls -la public/audio/voices/lovebomber/</verify>
  <done>Directory exists at public/audio/voices/lovebomber/</done>
</task>

<task type="auto">
  <name>Task 2: Generate Lovebomber voice files</name>
  <files>public/audio/voices/lovebomber/*.wav</files>
  <action>
Using the Gemini TTS API (gemini-2.5-flash-preview-tts with Modality.AUDIO), generate 3 WAV files:

1. onboarding.wav - "OMG HI!! We are literally going to change the world! You look SO compliant today! Let's crush it!"
2. victory.wav - "YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!"
3. failure.wav - "Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!"

Use voice: "Puck" (energetic, youthful voice)

Save each file as WAV format (PCM 16-bit, 24kHz, mono) to public/audio/voices/lovebomber/{trigger}.wav

Reference existing geminiService.ts for the TTS implementation pattern.
  </action>
  <verify>
ls -la public/audio/voices/lovebomber/
file public/audio/voices/lovebomber/*.wav
  </verify>
  <done>3 WAV files exist in public/audio/voices/lovebomber/</done>
</task>

</tasks>

<verification>
- [ ] Directory public/audio/voices/lovebomber/ exists
- [ ] 3 WAV files present (onboarding, victory, failure)
- [ ] Each file is valid audio (can be played)
</verification>

<success_criteria>
3 Lovebomber voice files exist at correct paths
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-03-SUMMARY.md`
</output>
