---
phase: 01-voice-files
plan: 05
type: execute
wave: 3
depends_on: [01-voice-files-04]
files_modified: ["App.tsx"]
autonomous: true

must_haves:
  truths:
    - "Onboarding voice plays pre-recorded file instead of TTS"
    - "Victory voice plays pre-recorded file instead of TTS"
    - "Failure voice plays pre-recorded file instead of TTS"
    - "Feedback voices (Roaster only) play pre-recorded files"
    - "Roast.exe (boss fight) still uses real-time TTS"
  artifacts:
    - path: "App.tsx"
      provides: "Game with integrated voice playback"
      modifies: "speak() calls replaced with playVoice() for non-Roast.exe flows"
  key_links:
    - from: "App.tsx"
      to: "services/voicePlayer.ts"
      via: "import { playVoice, cleanupVoiceAudio }"
      pattern: "playVoice.*onboarding|playVoice.*victory|playVoice.*failure|playVoice.*feedback"
---

<objective>
Integrate voice playback with game triggers

Purpose: Replace TTS calls (speak()) with pre-recorded voice file playback (playVoice()) for onboarding, feedback, victory, and failure. Keep TTS for Roast.exe boss fight.
Output: Updated App.tsx with voice file integration
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/phases/01-voice-files/01-CONTEXT.md
@App.tsx
@services/voicePlayer.ts
@types.ts

# Integration points in App.tsx (from grep results):
- Line 430: speak(PERSONALITIES[state.personality].onboarding, ...) - onboarding
- Line 433: speak(PERSONALITIES[state.personality].failure, ...) - failure  
- Line 436: speak(PERSONALITIES[state.personality].victory, ...) - victory
- Line 621: speak(outcome.feedback[state.personality], ...) - feedback after card swipe
- Line 712: speak(roast, ...) - Roast.exe boss fight (KEEP TTS)

# Personality folder mapping:
- PersonalityType.ROASTER -> "roaster"
- PersonalityType.ZEN_MASTER -> "zenmaster"
- PersonalityType.LOVEBOMBER -> "lovebomber"

# Trigger mapping:
- Onboarding -> "onboarding"
- Victory -> "victory"
- Failure -> "failure"
- Feedback: Use the card's feedback text key or generate trigger name from outcome type
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update App.tsx imports and integrate playVoice</name>
  <files>App.tsx</files>
  <action>
Update App.tsx to integrate voice file playback:

1. Add import at top of file:
   import { playVoice, cleanupVoiceAudio } from './services/voicePlayer';
   
2. Add a helper function to get personality folder name:
   const getPersonalityFolder = (personality: PersonalityType): string => {
     switch(personality) {
       case PersonalityType.ROASTER: return 'roaster';
       case PersonalityType.ZEN_MASTER: return 'zenmaster';
       case PersonalityType.LOVEBOMBER: return 'lovebomber';
     }
   };

3. Replace speak() calls for non-Roast.exe flows:
   - Onboarding (around line 430): Replace with playVoice(getPersonalityFolder(state.personality), 'onboarding')
   - Failure (around line 433): Replace with playVoice(getPersonalityFolder(state.personality), 'failure')
   - Victory (around line 436): Replace with playVoice(getPersonalityFolder(state.personality), 'victory')
   - Feedback after card swipe (around line 621): Determine trigger name based on the outcome type (paste, debug, install, ignore) and call playVoice with that trigger

4. KEEP speak() for Roast.exe (line 712) - this is the real-time TTS that should remain

5. Add cleanupVoiceAudio() call in the existing cleanupAudio() or useEffect cleanup for game state changes

6. Ensure error handling from voicePlayer.ts takes over (narrative error messages)
</action>
<parameter name="verify">
grep -n "playVoice" App.tsx
grep -n "cleanupVoiceAudio" App.tsx
  </verify>
  <done>App.tsx uses playVoice for onboarding, feedback, victory, failure; keeps speak() for Roast.exe</done>
</task>

</tasks>

<verification>
- [ ] App.tsx imports playVoice and cleanupVoiceAudio
- [ ] Onboarding uses playVoice (not speak)
- [ ] Victory uses playVoice (not speak)
- [ ] Failure uses playVoice (not speak)
- [ ] Feedback (card swipe) uses playVoice (not speak)
- [ ] Roast.exe (line ~712) still uses speak() for real-time TTS
- [ ] cleanupVoiceAudio called on game state cleanup
</verification>

<success_criteria>
Game plays pre-recorded voice files for onboarding, feedback, victory, failure; keeps real-time TTS for Roast.exe boss fight
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-05-SUMMARY.md`
</output>
