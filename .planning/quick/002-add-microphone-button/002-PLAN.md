---
phase: quick
plan: 002
type: execute
wave: 1
depends_on: []
files_modified:
  - hooks/useSpeechRecognition.ts
  - components/game/RoastTerminal.tsx
autonomous: true
user_setup: []
must_haves:
  truths:
    - "User can click microphone button to start voice recording"
    - "Speech is transcribed to text automatically"
    - "Transcribed text appears in the input textarea"
    - "Visual feedback shows when recording is active"
  artifacts:
    - path: "hooks/useSpeechRecognition.ts"
      provides: "Speech-to-text hook using Web Speech API"
      exports: ["useSpeechRecognition"]
    - path: "components/game/RoastTerminal.tsx"
      provides: "Microphone button for voice input"
      adds: "onMicrophoneClick prop, microphone button UI"
  key_links:
    - from: "RoastTerminal.tsx"
      to: "useSpeechRecognition"
      via: "onMicrophoneClick handler"
      pattern: "useSpeechRecognition"
---

<objective>
Add a microphone button to RoastTerminal that allows users to record their voice and transcribe it into the chat input.
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@components/game/RoastTerminal.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create useSpeechRecognition hook</name>
  <files>hooks/useSpeechRecognition.ts</files>
  <action>
    Create a new hook `useSpeechRecognition` that:
    - Uses Web Speech API (webkitSpeechRecognition for Chrome/Safari)
    - Exposes: isListening (boolean), transcript (string), startListening(), stopListening(), error (string|null)
    - On start: clears previous transcript, sets isListening=true
    - On result: accumulates transcript with spaces between words
    - On end: sets isListening=false
    - On error: sets error state, stops listening
    - Returns transcript directly to be used as input value
  </action>
  <verify>File created with valid TypeScript exports</verify>
  <done>Hook exports useSpeechRecognition with isListening, transcript, startListening, stopListening, error</done>
</task>

<task type="auto">
  <name>Task 2: Add microphone button to RoastTerminal</name>
  <files>components/game/RoastTerminal.tsx</files>
  <action>
    Modify RoastTerminal to:
    - Import and use useSpeechRecognition hook
    - Add onMicrophoneClick prop (or internal handler using the hook)
    - Add microphone button next to send button (before send button)
    - Button shows microphone icon (fa-microphone) when idle, stop icon (fa-stop) when listening
    - When clicked: if not listening, start listening; if listening, stop
    - When transcript updates, call onInputChange with new transcript value
    - Add pulsing animation class when recording (animate-pulse or custom)
  </action>
  <verify>Build passes, microphone button visible in UI</verify>
  <done>Microphone button appears next to send button, clicking it starts/stops recording, transcript populates textarea</done>
</task>

</tasks>

<verification>
- [ ] Build succeeds: `bun run build`
- [ ] Microphone button renders in RoastTerminal
- [ ] Clicking microphone starts speech recognition
- [ ] Speaking produces text in textarea
- [ ] Visual feedback shows during recording
</verification>

<success_criteria>
User can click microphone button, speak, and see transcribed text in the input field ready to submit.
</success_criteria>

<output>
After completion, create `.planning/quick/002-add-microphone-button/002-SUMMARY.md`
</output>
