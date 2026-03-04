# Speech-to-Text Implementation Research

## Current Issue

The Web Speech API (`webkitSpeechRecognition`) is failing with "network" error. This is a known issue - it relies on Google's free Chrome service which requires:
- Signed-in Google account in Chrome
- No firewall blocking `speech.googleapis.com`

The Live API (Gemini) works fine because it uses the `@google/genai` SDK with an API key.

---

## Gemini APIs for Speech-to-Text: Options

### Option 1: Live API with Real-Time Audio Input (Recommended)

**Best for:** Mic button in RoastTerminal — real-time voice → text.

The Live API supports bidirectional audio. You send mic chunks via `session.sendRealtimeInput()`, and receive user transcription via `serverContent.inputTranscription`.

**SDK methods (`@google/genai`):**
- `session.sendRealtimeInput({ audio: Blob })` — send PCM chunks
- `session.sendRealtimeInput({ media: Blob })` — alternative (audio or video)
- Config: `inputAudioTranscription: {}` — enables user speech transcription
- Config: `responseModalities: [Modality.AUDIO, Modality.TEXT]` — if you want text alongside audio (transcription needs text)

**Audio format (Vertex AI docs):**
- Input: Raw 16-bit PCM, 16kHz, little-endian, mono
- MIME: `audio/pcm;rate=16000`

**Response handling:**
- `message.serverContent.inputTranscription.text` — transcribed user speech
- `message.serverContent.outputTranscription` — transcribed model output (already used in geminiLive.ts)

**Tradeoffs:**
- Requires a persistent Live API session while recording
- Billed per minute; session lifetime ~10–15 min without compression
- MediaRecorder outputs WebM/Opus by default; must resample to PCM 16kHz for Live API

**Reference:** [Vertex AI: Enable audio transcription](https://cloud.google.com/vertex-ai/generative-ai/docs/live-api/start-manage-session#enable_audio_transcription_for_the_session), [Medium: Multimodal Live API Audio Transcription](https://medium.com/google-cloud/google-multimodal-live-api-audio-transcription-368d4d4e7a7c)

---

### Option 2: Gemini generateContent + Uploaded Audio File

**Best for:** Record → stop → transcribe (no streaming).

Upload an audio file via the Files API, then call `generateContent` with a prompt like "Transcribe this speech." Supports MP3, FLAC, OGG, AAC, AIFF, WAV.

**SDK usage:**
```typescript
const myfile = await ai.files.upload({ file: blob, config: { mimeType: "audio/mp3" } });
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: createUserContent([
    createPartFromUri(myfile.uri, myfile.mimeType),
    "Generate a transcript of the speech."
  ]),
});
```

**Limitations (from Google docs):**
- "As of now the Gemini API doesn't support real-time transcription use cases"
- Must record full clip first, then upload; higher latency
- Request size limit 20MB inline; use Files API for larger

**Reference:** [Audio understanding | Gemini API](https://ai.google.dev/gemini-api/docs/audio)

---

### Option 3: Google Cloud Speech-to-Text API

**Best for:** Dedicated STT, streaming or batch, production workloads.

Separate service from Gemini. Supports real-time streaming, speaker diarization, multiple languages. Different auth (OAuth/ADC) and billing.

**Reference:** [Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)

---

## Recommended Approach for RoastTerminal

**Use Option 1 (Live API with `sendRealtimeInput` + `inputAudioTranscription`).**

Reasons:
1. Already using Live API for roasts; same SDK, same API key
2. Real-time UX matches the current mic-button flow
3. No new services or auth
4. Input transcription is explicitly supported in LiveConnectConfig

### Implementation Outline

1. **Capture mic:** `MediaRecorder` or `AudioWorklet` → produce PCM 16-bit 16kHz
   - MediaRecorder gives WebM/Opus; need to decode and resample (e.g. via Web Audio API or a lib)
   - Alternatively: `getUserMedia` → `AudioContext` → `ScriptProcessorNode`/`AudioWorklet` to get raw PCM

2. **Connect Live session** with:
   ```typescript
   config: {
     responseModalities: [Modality.AUDIO, Modality.TEXT],
     inputAudioTranscription: {},
     outputAudioTranscription: {},
     // ... existing speechConfig, systemInstruction
   }
   ```

3. **Stream audio:** `session.sendRealtimeInput({ audio: { data: base64PCM, mimeType: "audio/pcm;rate=16000" } })`

4. **Listen for transcription:** In `onmessage`, read `serverContent.inputTranscription?.text`

5. **Design choice:** Two modes:
   - **Standalone transcription:** Session only for STT; don’t send a roast prompt, just stream mic and collect transcription
   - **Conversational:** Same session handles both user speech and roast replies; more complex, higher cost

### Files to Modify

- `services/geminiLive.ts` — add transcription-capable session factory or extend `connectToLiveSession`
- New `hooks/useLiveAPISpeechRecognition.ts` — mic capture, PCM conversion, Live session, transcript callback
- `components/game/RoastTerminal.tsx` — swap `useSpeechRecognition` for `useLiveAPISpeechRecognition`

### PCM Conversion Note

Browser mics typically run at 44.1kHz or 48kHz. Live API expects 16kHz. Options:
- Use `AudioContext` + `OfflineAudioContext` to resample
- Use `AudioWorklet` with `Resampler` (e.g. speex-resampler or similar)
- Or: check if SDK/API accepts other sample rates (Vertex docs say 16kHz native, may resample)

---

## What Was Tried (Prior)

- Web Search: webkitSpeechRecognition fails in Electron/embedded browsers
- Code exploration: Reviewed geminiLive.ts, roastService.ts
- Identified Live API transcription via `outputTranscription`
