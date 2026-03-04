# Gemini Live API Speech-to-Text Research

## Executive Summary

Use Gemini Live API's `inputAudioTranscription` config to enable browser-based speech-to-text. The pattern is:
1. Capture mic via `getUserMedia`
2. Convert 48kHz → 16kHz PCM via AudioWorklet
3. Stream via `session.sendRealtimeInput({ audio: { data, mimeType } })`
4. Receive transcription via `serverContent.inputTranscription.text`

This approach reuses the existing `@google/genai` SDK and API key infrastructure.

---

## Standard Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Mic capture | `navigator.mediaDevices.getUserMedia` | Request mono, 16kHz preferred (browser may give 48kHz) |
| Resampling | `AudioWorklet` (inline Blob URL) | No external library needed |
| Encoding | `Int16Array` → base64 | Manual conversion in worklet |
| Transport | `@google/genai` SDK `live.connect()` | Existing SDK v1.40.0+ |
| Transcription | `inputAudioTranscription: {}` config | Enabled at session setup |

---

## Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser                                      │
│                                                                      │
│  ┌─────────┐    48kHz     ┌──────────────┐    16kHz PCM    ┌──────┐ │
│  │   Mic   │ ──────────► │ AudioWorklet │ ──────────────► │ SDK  │ │
│  │ Stream  │   Float32    │  Resampler   │    Int16/b64    │ WS   │ │
│  └─────────┘              └──────────────┘                 └───┬──┘ │
│                                                                │    │
│  ┌─────────────────────────────────────────────────────────────┴──┐ │
│  │                    onmessage callback                          │ │
│  │   serverContent.inputTranscription.text → UI update            │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WSS
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Gemini Live API                                  │
│   • VAD (Voice Activity Detection) built-in                        │
│   • Returns inputTranscription chunks during speech                 │
│   • Returns model response after VAD detects end of speech          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## LiveConnectConfig for Transcription

### Transcription-Only Mode (No Model Audio Response)

```typescript
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  httpOptions: { apiVersion: 'v1alpha' as const },
});

const session = await ai.live.connect({
  model: 'gemini-2.5-flash-native-audio-latest',
  config: {
    // TEXT only - no AUDIO response = no spoken model response
    responseModalities: [Modality.TEXT],
    
    // Enable input (user) speech transcription
    inputAudioTranscription: {},
    
    // System instruction to minimize model response
    systemInstruction: 'Acknowledge silently. Do not respond verbally.',
  },
  callbacks: {
    onmessage: (message) => {
      // User speech transcription
      const inputText = message.serverContent?.inputTranscription?.text;
      if (inputText) {
        console.log('[User]', inputText);
      }
    },
  },
});
```

### Full Bidirectional (Transcription + Model Response)

```typescript
const session = await ai.live.connect({
  model: 'gemini-2.5-flash-native-audio-latest',
  config: {
    responseModalities: [Modality.AUDIO],
    speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
    },
    inputAudioTranscription: {},   // User speech → text
    outputAudioTranscription: {},  // Model speech → text
    systemInstruction: 'You are a helpful assistant.',
  },
  callbacks: {
    onmessage: (message) => {
      // User speech transcription
      if (message.serverContent?.inputTranscription?.text) {
        handleUserTranscript(message.serverContent.inputTranscription.text);
      }
      
      // Model speech transcription
      if (message.serverContent?.outputTranscription?.text) {
        handleModelTranscript(message.serverContent.outputTranscription.text);
      }
      
      // Audio playback
      const parts = message.serverContent?.modelTurn?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          playAudio(part.inlineData.data); // base64 PCM 24kHz
        }
      }
    },
  },
});
```

---

## Audio Pipeline Implementation

### 1. Mic Capture with Resampling AudioWorklet

```typescript
async function startMicCapture(onAudioChunk: (base64: string) => void) {
  // Request mic at 16kHz (browser may not honor, typically gives 48kHz)
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 16000,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  // Create AudioContext at 16kHz for processing
  const audioCtx = new AudioContext({ sampleRate: 16000 });

  // Inline AudioWorklet - converts Float32 to Int16 PCM
  const workletCode = `
    class PCMProcessor extends AudioWorkletProcessor {
      process(inputs) {
        const input = inputs[0];
        if (input && input[0]) {
          const float32 = input[0];
          const int16 = new Int16Array(float32.length);
          for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          this.port.postMessage({ buffer: int16.buffer }, [int16.buffer]);
        }
        return true;
      }
    }
    registerProcessor('pcm-processor', PCMProcessor);
  `;

  const blob = new Blob([workletCode], { type: 'application/javascript' });
  const workletUrl = URL.createObjectURL(blob);
  await audioCtx.audioWorklet.addModule(workletUrl);

  const source = audioCtx.createMediaStreamSource(stream);
  const worklet = new AudioWorkletNode(audioCtx, 'pcm-processor');

  worklet.port.onmessage = (event) => {
    const bytes = new Uint8Array(event.data.buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    onAudioChunk(base64);
  };

  source.connect(worklet);
  // Don't connect to destination (avoids feedback)

  return {
    stop: () => {
      stream.getTracks().forEach(t => t.stop());
      worklet.disconnect();
      audioCtx.close();
    },
  };
}
```

### 2. Sending Audio Chunks

```typescript
// In your session message loop
startMicCapture((base64) => {
  session.sendRealtimeInput({
    audio: {
      data: base64,
      mimeType: 'audio/pcm;rate=16000',
    },
  });
});
```

### 3. Signal End of Audio Stream

```typescript
// When mic stops (user clicks stop button)
session.sendRealtimeInput({
  audioStreamEnd: true,
});
```

---

## Message Flow Details

### Transcription Delivery

| Event | Timing | Content |
|-------|--------|---------|
| `inputTranscription` | **Streaming** during speech | Partial/incremental text chunks |
| `turnComplete` | After VAD detects silence | Signals end of user turn |

**Important**: `inputTranscription` arrives incrementally. Chunks are NOT complete sentences — they're word/phrase fragments as the model processes audio. Buffer and debounce:

```typescript
let transcriptBuffer = '';
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 1500;

function handleInputTranscription(text: string) {
  transcriptBuffer += text;
  
  // Update streaming UI immediately
  setStreamingText(transcriptBuffer.trim());
  
  // Debounce final transcript
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    setFinalTranscript(transcriptBuffer.trim());
    transcriptBuffer = '';
    setStreamingText(null);
  }, DEBOUNCE_MS);
}
```

### No Interim vs Final Distinction

Unlike Web Speech API, Live API **does not** have explicit interim/final states. All `inputTranscription` chunks are equal. Use:
- **Debouncing** (1-2 seconds silence) for final transcript
- **turnComplete** event as hard boundary

---

## Session Lifecycle

### Option A: Per-Recording Session (Recommended for STT-only)

```typescript
async function recordSpeech(): Promise<string> {
  let transcript = '';
  
  const session = await ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-latest',
    config: {
      responseModalities: [Modality.TEXT],
      inputAudioTranscription: {},
      systemInstruction: 'Transcribe only. No response needed.',
    },
    callbacks: {
      onmessage: (msg) => {
        if (msg.serverContent?.inputTranscription?.text) {
          transcript += msg.serverContent.inputTranscription.text;
        }
      },
    },
  });

  const mic = await startMicCapture((base64) => {
    session.sendRealtimeInput({ audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
  });

  // Wait for user to stop recording
  await waitForStopSignal();

  mic.stop();
  session.sendRealtimeInput({ audioStreamEnd: true });
  
  // Wait briefly for final transcription
  await sleep(500);
  session.close();

  return transcript;
}
```

### Option B: Persistent Session

Keep session open for multiple interactions. Use `audioStreamEnd: true` between recording sessions:

```typescript
// Session persists
let session: LiveSession;

async function initSession() {
  session = await ai.live.connect({ /* config */ });
}

async function startRecording() {
  return startMicCapture((base64) => {
    session.sendRealtimeInput({ audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
  });
}

async function stopRecording(mic: MicHandle) {
  mic.stop();
  session.sendRealtimeInput({ audioStreamEnd: true });
  // Session stays open for next recording
}
```

### Session Limits

| Constraint | Value |
|------------|-------|
| Audio-only session timeout | 15 minutes |
| Audio+video session timeout | 2 minutes |
| Context window | ~32K tokens |

Enable compression for longer sessions:
```typescript
config: {
  contextWindowCompression: {
    slidingWindow: {},
  },
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `WebSocket closed` | API timeout/network | Reconnect with new session |
| `Invalid audio format` | Wrong sample rate/encoding | Ensure PCM 16kHz little-endian |
| `Permission denied` | Mic access blocked | Handle `getUserMedia` rejection |
| `Session expired` | 15-min timeout | Create new session |

### Reconnection Pattern

```typescript
async function connectWithRetry(maxAttempts = 3): Promise<LiveSession> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const session = await ai.live.connect({ /* config */ });
      return session;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) throw error;
      await sleep(1000 * attempt); // Exponential backoff
    }
  }
  throw new Error('Connection failed');
}
```

---

## Common Pitfalls

### 1. Wrong Sample Rate
**Problem**: Sending 48kHz audio as 16kHz.
**Fix**: AudioContext must be created at 16kHz to resample:
```typescript
const audioCtx = new AudioContext({ sampleRate: 16000 });
```

### 2. Endianness
**Problem**: Int16Array uses platform-native byte order.
**Fix**: This is fine — Gemini expects little-endian and x86/ARM browsers are little-endian.

### 3. Missing inputAudioTranscription Config
**Problem**: No transcription received.
**Fix**: Must include `inputAudioTranscription: {}` in config (empty object enables it).

### 4. Not Handling Streaming Chunks
**Problem**: Showing fragmented/incomplete text.
**Fix**: Buffer and debounce transcription chunks (see Message Flow section).

### 5. AudioContext Not Resumed
**Problem**: No audio captured (autoplay policy).
**Fix**: Resume on user interaction:
```typescript
await audioCtx.resume();
```

### 6. Forgetting audioStreamEnd
**Problem**: Model waits indefinitely for more audio.
**Fix**: Send `audioStreamEnd: true` when recording stops.

---

## Implementation Steps

### Phase 1: LiveConnectConfig Update
1. Modify `services/geminiLive.ts` to accept optional `inputAudioTranscription` config
2. Add callback handler for `inputTranscription` in `onmessage`

### Phase 2: Mic Capture Hook
1. Create `hooks/useLiveAPISpeechRecognition.ts`
2. Implement:
   - `startRecording()` — creates session, starts mic capture
   - `stopRecording()` — sends audioStreamEnd, returns transcript
   - `transcript` — current accumulated text
   - `isRecording` — boolean state

### Phase 3: RoastTerminal Integration
1. Replace `useSpeechRecognition` with `useLiveAPISpeechRecognition`
2. Wire up existing mic button to new hook
3. Show streaming transcript in UI

### Phase 4: Testing
1. Unit test: AudioWorklet PCM conversion
2. Integration test: Full mic → transcript flow
3. E2E test: RoastTerminal voice input

---

## Code References

### gemini-live-react AudioWorklet (lines 441-475)

```typescript
await ctx.audioWorklet.addModule(
  URL.createObjectURL(
    new Blob([`
      class AudioProcessor extends AudioWorkletProcessor {
        process(inputs, outputs, parameters) {
          const input = inputs[0];
          if (input && input[0]) {
            const float32 = input[0];
            const int16 = new Int16Array(float32.length);
            for (let i = 0; i < float32.length; i++) {
              const s = Math.max(-1, Math.min(1, float32[i]));
              int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            this.port.postMessage({ audioBuffer: int16.buffer }, [int16.buffer]);
          }
          return true;
        }
      }
      registerProcessor('audio-processor', AudioProcessor);
    `], { type: 'application/javascript' })
  )
);
```

### Official SDK sendRealtimeInput Shape

From `@google/genai` types:
```typescript
interface LiveSendRealtimeInputParameters {
  media?: BlobImageUnion;
  audio?: Blob;         // { data: string, mimeType: string }
  audioStreamEnd?: boolean;
}
```

### Server Response Structure

```typescript
interface LiveServerContent {
  inputTranscription?: {
    text?: string;      // User speech transcription
  };
  outputTranscription?: {
    text?: string;      // Model speech transcription
  };
  modelTurn?: {
    parts: Array<{
      inlineData?: {
        data: string;   // base64 PCM 24kHz
        mimeType: string;
      };
      text?: string;    // Thinking text (ignore for audio)
    }>;
  };
  turnComplete?: boolean;
  interrupted?: boolean;
}
```

---

## SDK Version Note

This research is based on `@google/genai` v1.40.0. Key types exist:
- `inputAudioTranscription: AudioTranscriptionConfig` (empty interface)
- `serverContent.inputTranscription: Transcription`
- `Transcription: { text?: string }`

Verify your installed version matches:
```bash
bun pm ls @google/genai
```
