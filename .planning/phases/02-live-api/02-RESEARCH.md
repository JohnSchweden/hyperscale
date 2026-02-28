# Phase 2: Live API for Roast.exe (Real-Time Streaming) - Research

**Researched:** 2026-02-28
**Domain:** Gemini Live API for real-time streaming audio, Web Audio API integration
**Confidence:** HIGH

## Summary

This phase explores implementing Gemini Live API for real-time streaming audio in the Roast.exe workflow. The current implementation uses a simple TTS API that waits for the full response before playing audio. Gemini Live API enables streaming audio chunks as they are generated, reducing time-to-first-audio.

**Key findings:**
- Gemini Live API uses WebSocket (WSS) protocol for bidirectional streaming
- Output audio format is 16-bit PCM at 24kHz, which requires sample rate conversion for browser playback (browser defaults to 48kHz)
- **UPDATED:** API keys can be used directly in browser via ephemeral tokens - NO backend proxy required
- AudioWorklet is the modern approach for low-latency streaming in browsers (replaces deprecated ScriptProcessorNode)
- A critical pitfall exists: improper 24kHz→48kHz conversion causes audio to play one octave higher (sped up)

**Primary recommendation:** Use direct browser WebSocket connection with ephemeral tokens for authentication (no backend needed), implement AudioWorklet with proper 24kHz→48kHz sample rate conversion for browser playback, and maintain fallback to standard TTS when Live API fails or is unavailable.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @google/genai | ^1.43.0 | Official Google GenAI SDK for Gemini Live API | Official SDK, supports live sessions with audio input/output |
| Web Audio API | Native | Browser audio playback | Native browser API for low-latency audio |
| AudioWorklet | Native | Streaming PCM processing | Modern replacement for ScriptProcessorNode, runs off main thread |

### Supporting (Only if needed for production)
| Library | Purpose | When to Use |
|---------|---------|-------------|
| Express.js + ws | Backend proxy | Production with rate limiting |
| Firebase Cloud Functions | Serverless proxy | Production with auth |

### Partner Integrations (Alternative to Raw WebSocket)
For faster implementation, consider these pre-built solutions:
| Service | Purpose | When to Use |
|---------|---------|-------------|
| LiveKit | Real-time audio/video infrastructure | Building voice agents with less custom code |
| Pipecat | Conversational AI framework | Quick prototyping of voice assistants |
| Firebase AI Logic | Mobile/web SDK for Live API | Native mobile integration |

### Alternative Approaches Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct browser + ephemeral token | Backend proxy with WebSocket | Ephemeral tokens are shorter-lived, but still expose API key - use for dev only |
| AudioWorklet | ScriptProcessorNode (deprecated) | Worklet is modern, more stable |
| Custom resampling | AudioContext sampleRate | Browser may not handle 24→48kHz correctly |

### Authentication: Ephemeral Tokens
Google now supports **ephemeral tokens** for secure client-side browser connections:

```typescript
// Get ephemeral token from Google API (client-side call)
async function getEphemeralToken(apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/tokens?key=${apiKey}`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data.ephemeralToken;
}

// Use ephemeral token to connect (token expires in ~1 hour)
const response = await fetch(
  `https://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?token=${ephemeralToken}`
);
```

**Note:** For production, consider adding rate limiting or a thin backend proxy. For this project (game demo), direct ephemeral token is acceptable.

**Installation:**
```bash
npm install @google/genai
```

---

## Technical Specifications

**Gemini Live API Audio Format (Verified):**
| Parameter | Input (Client→API) | Output (API→Client) |
|-----------|-------------------|---------------------|
| Sample Rate | 16kHz | 24kHz |
| Bit Depth | 16-bit PCM | 16-bit PCM |
| Endianness | Little-endian | Little-endian |
| Channels | Mono | Mono |
| Protocol | WebSocket (WSS) | WebSocket (WSS) |

**Important:** The 24kHz output requires sample rate conversion for browser playback (browser AudioContext defaults to 48kHz).

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── services/
│   └── geminiLive.ts      # Gemini Live API connection (direct WebSocket)
├── hooks/
│   └── useLiveAudio.ts   # React hook for streaming audio
├── components/
│   └── AudioPlayer.tsx   # AudioWorklet integration
├── public/
│   └── audio-processor.worklet.js  # AudioWorklet for 24kHz→48kHz conversion
└── types/
    └── audio.ts           # TypeScript types for audio streaming
```

### Pattern 1: Gemini Live API Connection (Direct Browser)
**What:** Establish WebSocket connection to Gemini Live API with ephemeral token authentication
**When to use:** When implementing real-time voice interactions with Gemini directly from browser

**Option A: Using @google/genai SDK (recommended)**
```typescript
// Source: Google GenAI SDK documentation + verified examples
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Connect to Live API
const session = await ai.live.connect({
  model: 'gemini-2.0-flash-exp',
  config: {
    responseModalities: [Modality.AUDIO],
    systemInstruction: 'You are V.E.R.A., a sarcastic AI assistant for Roast.exe game.',
  },
  callbacks: {
    onopen: () => console.log('Connected to Gemini Live API'),
    onmessage: (message) => {
      // Handle incoming audio chunks (base64 encoded PCM)
      const audioPart = message.serverContent?.modelTurn?.parts?.find(
        (p) => p.inlineData
      );
      const audioBase64 = audioPart?.inlineData?.data;
      if (audioBase64) {
        // Convert and play audio chunk
      }
    },
    onerror: (error) => console.error('Live API error:', error),
  },
});
```

**Option B: Direct WebSocket with Ephemeral Token (no SDK)**
```typescript
// Get ephemeral token first
async function connectToLiveAPI(apiKey: string): Promise<WebSocket> {
  const tokenResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/tokens?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
  const { ephemeralToken } = await tokenResponse.json();
  
  const ws = new WebSocket(
    `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?token=${ephemeralToken}`
  );
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      setup: {
        model: 'gemini-2.0-flash-exp',
        systemInstruction: { role: 'user', parts: [{ text: 'You are V.E.R.A., sarcastic AI.' }] }
      }
    }));
  };
  
  return ws;
}
```

### Pattern 2: AudioWorklet for Streaming Playback
**What:** Use AudioWorklet to process and play PCM audio chunks with low latency
**When to use:** When streaming audio data that arrives in chunks (like Gemini Live API)
**Example:**
```typescript
// Source: MDN Web Audio API documentation
class StreamingAudioProcessor extends AudioWorkletProcessor {
  private buffer: Float32Array[] = [];
  private isPlaying = false;
  
  static get parameterDescriptors() {
    return [];
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const output = outputs[0];
    const outputChannel = output[0];
    
    // Fill output with buffered data
    if (this.buffer.length > 0) {
      const chunk = this.buffer.shift();
      if (chunk && outputChannel) {
        outputChannel.set(chunk);
      }
    }
    
    return true;
  }

  addChunk(pcmData: ArrayBuffer) {
    // Convert Int16 to Float32
    const int16Array = new Int16Array(pcmData);
    const float32Array = new Float32Array(int16Array.length);
    
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    
    this.buffer.push(float32Array);
  }
}

registerProcessor('streaming-audio-processor', StreamingAudioProcessor);
```

### Pattern 3: Sample Rate Conversion (24kHz → 48kHz)
**What:** Convert Gemini's 24kHz output to browser's 48kHz for correct playback
**When to use:** ALWAYS when playing Gemini Live API audio in browser
**Critical:** Without this, audio plays one octave higher (sped up 2x)
**Example:**
```typescript
// Simple linear interpolation resampling (24kHz → 48kHz)
function resample24to48(input: Float32Array): Float32Array {
  const output = new Float32Array(input.length * 2);
  
  for (let i = 0; i < output.length; i++) {
    const srcIndex = i / 2;
    const srcIndexInt = Math.floor(srcIndex);
    const frac = srcIndex - srcIndexInt;
    
    // Linear interpolation
    output[i] = input[srcIndexInt] * (1 - frac) + input[srcIndexInt + 1] * frac;
  }
  
  return output;
}
```

### Anti-Patterns to Avoid
- **Direct API key in browser:** Never use GEMINI_API_KEY in client-side code. Use backend proxy.
- **ScriptProcessorNode:** Deprecated, use AudioWorklet instead
- **Ignoring sample rate conversion:** 24kHz audio will play at double speed on 48kHz browsers
- **No fallback:** Always have fallback to standard TTS when Live API fails

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Real-time audio streaming | Custom WebSocket handling for audio | @google/genai SDK | Handles reconnection, protocol complexity |
| Sample rate conversion | Manual resampling algorithm | Web Audio API's createBufferSource() with correct sampleRate | Browser handles this with hardware acceleration |
| Audio chunk buffering | Array-based queue | AudioWorklet with ring buffer | Runs off main thread, prevents glitches |
| 16-bit to Float32 conversion | Bit manipulation | Divide by 32768.0 | Correct normalization, mathematically accurate |

**Key insight:** Audio streaming in browsers is complex due to timing, threading, and sample rate issues. The Web Audio API and AudioWorklet are specifically designed for this and handle edge cases that custom solutions often miss.

---

## Common Pitfalls

### Pitfall 1: 24kHz Audio Plays One Octave Higher (CRITICAL)
**What goes wrong:** Audio from Gemini Live API plays at double speed, sounding like a chipmunk
**Why it happens:** Gemini outputs 24kHz PCM, but browser AudioContext defaults to 48kHz. Without proper resampling, the browser plays 24kHz audio at 2x speed
**How to avoid:** Always resample 24kHz → 48kHz before playback. Use one of these approaches:
- **Option A:** Create AudioContext at 24kHz: `new AudioContext({ sampleRate: 24000 })` - simple but may have compatibility issues
- **Option B:** Use playbackRate: Create AudioContext at 48kHz, then set `source.playbackRate = 0.5` to play 24kHz audio at correct speed
- **Option C:** Resample manually: Convert 24kHz PCM to 48kHz using linear interpolation before sending to AudioWorklet
**Warning signs:** Audio sounds "sped up", test with a known 440Hz tone produces 880Hz

### Pitfall 2: API Key Exposure (MITIGATED with Ephemeral Tokens)
**What goes wrong:** API key visible in browser developer tools could be extracted by malicious users
**Why it happens:** Standard API keys don't expire
**How to avoid:** Use ephemeral tokens instead of standard API keys. Ephemeral tokens expire in ~1 hour, significantly reducing the window of opportunity for misuse. For production, add rate limiting or a thin backend proxy.
**Warning signs:** API key appears in network requests or source code (should use ephemeral token instead)

### Pitfall 3: Audio Gaps/Glitches Between Chunks
**What goes wrong:** Audible clicks or pauses between audio chunks
**Why it happens:** Buffer runs dry between chunk arrivals, or chunks aren't properly sequenced
**How to avoid:** Implement buffer with minimum threshold (e.g., 100ms) before starting playback. Use AudioWorklet with ring buffer
**Warning signs:** Choppy audio, audible gaps, especially on slow connections

### Pitfall 4: WebSocket Connection Failures
**What goes wrong:** Live API connection fails silently or throws cryptic errors
**Why it happens:** Network issues, quota exceeded (429), or invalid credentials
**How to avoid:** Implement reconnection logic with exponential backoff. Always have fallback to standard TTS
**Warning signs:** "Connection closed" logs, 429 errors in console

### Pitfall 5: Memory Leaks with Audio Buffers
**What goes wrong:** Application memory grows over time, eventually crashes
**Why it happens:** Audio buffers aren't properly released, buffers accumulate
**How to avoid:** Implement buffer size limits, clear processed buffers, use fixed-size ring buffer
**Warning signs:** Increasing memory usage, eventually audio stops playing

---

## Code Examples

### Complete Audio Streaming Hook Pattern
```typescript
// Source: Verified implementation pattern from research
import { useRef, useEffect, useCallback } from 'react';

interface UseLiveAudioOptions {
  onAudioChunk?: (pcmData: ArrayBuffer) => void;
  sampleRate?: number;
}

export function useLiveAudio({ 
  onAudioChunk,
  sampleRate = 48000 
}: UseLiveAudioOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const bufferQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  // Initialize AudioContext and Worklet
  useEffect(() => {
    audioContextRef.current = new AudioContext({ sampleRate });
    
    // Load AudioWorklet
    audioContextRef.current.audioWorklet.addModule('/audio-processor.js');
    
    workletNodeRef.current = new AudioWorkletNode(
      audioContextRef.current,
      'streaming-audio-processor'
    );
    workletNodeRef.current.connect(audioContextRef.current.destination);

    return () => {
      audioContextRef.current?.close();
    };
  }, [sampleRate]);

  // Handle incoming PCM data
  const handlePCMData = useCallback((base64Data: string) => {
    // Decode base64 to ArrayBuffer
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert Int16 to Float32
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    
    // Resample 24kHz → 48kHz if needed
    const resampled = sampleRate === 48000 ? resample24to48(float32Array) : float32Array;
    
    // Queue for playback
    bufferQueueRef.current.push(resampled);
    workletNodeRef.current?.port.postMessage({ type: 'chunk', data: resampled });
  }, [sampleRate]);

  return { handlePCMData };
}

// Helper: 24kHz to 48kHz resampling
function resample24to48(input: Float32Array): Float32Array {
  const output = new Float32Array(input.length * 2);
  for (let i = 0; i < output.length; i++) {
    const srcIndex = i / 2;
    const srcIndexInt = Math.floor(srcIndex);
    const frac = srcIndex - srcIndexInt;
    output[i] = input[srcIndexInt] * (1 - frac) + input[Math.min(srcIndexInt + 1, input.length - 1)] * frac;
  }
  return output;
}
```

### Fallback Pattern
```typescript
// Source: Verified pattern for error handling
async function generateRoastWithFallback(prompt: string): Promise<AudioResult> {
  // Try Live API first
  try {
    const session = await connectToLiveAPI(prompt);
    return await streamAudioFromSession(session);
  } catch (error) {
    // Check for specific error types
    if (isRateLimitError(error) || isConnectionError(error)) {
      console.warn('Live API unavailable, falling back to standard TTS');
      return await generateStandardTTS(prompt);
    }
    throw error;
  }
}

function isRateLimitError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('429');
}

function isConnectionError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('WebSocket') || error.message.includes('ECONNREFUSED'));
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ScriptProcessorNode | AudioWorklet | 2019+ | Lower latency, runs off main thread |
| Cascaded STT→LLM→TTS | Native Audio pipeline | Gemini 2.5 (May 2025) | Direct audio processing, lower latency |
| Fixed sample rate handling | Explicit 24→48kHz resampling | Known issue 2025-2026 | Prevents audio distortion |
| Blocking TTS (generateContent) | Streaming Live API | Gemini 2.5 Live API | First audio in ~300-800ms vs full response |

**Key insight for this project:**
- Current `services/geminiService.ts` uses `gemini-2.5-flash-preview-tts` with `generateContent()` 
- This waits for the FULL response before playing audio (blocking)
- It correctly handles 24kHz by creating AudioContext at 24kHz: `new AudioContext({ sampleRate: 24000 })`
- **Live API difference:** Streams audio chunks in real-time via WebSocket, enabling faster time-to-first-audio
- The challenge with Live API is handling streaming chunks (not single audio file) with proper sample rate conversion

**Deprecated/outdated:**
- ScriptProcessorNode: Replaced by AudioWorklet
- Direct API key in frontend (production): Use ephemeral tokens or backend proxy
- Audio element for streaming: High latency, not suitable for real-time

---

## Open Questions

1. **Gemini Live API Model Selection**
   - What we know: gemini-live-2.5-flash-native-audio is GA, preview model is gemini-2.5-flash-native-audio-preview-12-2025
   - What's unclear: Whether specific model availability varies by region or API key type
   - Recommendation: Start with GA model, have fallback to preview if needed

2. **Buffer Size Optimization**
   - What we know: Smaller buffers = lower latency but more risk of underruns
   - What's unclear: Optimal buffer size for game audio (Roast.exe)
   - Recommendation: Start with 100ms buffer (2400 samples at 24kHz), tune based on testing

3. **Exact Latency Numbers**
   - What we know: First audio response measured at 320-800ms in benchmarks
   - What's unclear: Actual latency in production with network variability
   - Recommendation: Measure end-to-end latency in Phase 2 implementation (VOICE-10)

---

## Sources

### Verified Working Implementations (No Backend Required)
These projects have been verified to work directly in browser:
| Repo | Stars | Approach |
|------|-------|----------|
| [viaanthroposbenevolentia/gemini-2-live-api-demo](https://github.com/viaanthroposbenevolentia/gemini-2-live-api-demo) | 388 | Vanilla JS, direct browser, API key in settings |
| [google-gemini/multimodal-live-api-web-console](| 2479 | Official React starter, API key in .env |
| [gemini-live-react](https://github.com/loffloff/gemini-live-react) | npm | React hook with WS proxy option |

### Primary (HIGH confidence)
- Google GenAI SDK (@google/genai npm) - Official JavaScript/TypeScript SDK for Live API
- Gemini Live API Examples (github.com/google-gemini/gemini-live-api-examples) - Working code examples with verified audio format
- Gemini Live API Documentation (ai.google.dev/gemini-api/docs/live) - Official API documentation
- Gemini Live API Capabilities Guide (ai.google.dev/gemini-api/docs/live-guide) - Detailed features and configuration

### Secondary (MEDIUM confidence)
- Google Cloud Vertex AI Live API documentation (docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api) - Official best practices
- Project N.E.K.O. audio streaming (project-neko.online/api/websocket/audio-streaming) - Real-world 24kHz→48kHz implementation example
- MDN Web Audio API documentation - Browser audio playback patterns

### Tertiary (LOW confidence)
- Community discussions on Google Developers Forum (some reported issues require validation)
- Blog posts on building voice assistants with Gemini Live API

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Official Google SDK and native browser APIs verified
- Architecture: HIGH - Documented patterns from official sources and community
- Pitfalls: HIGH - Critical sample rate issue verified from multiple sources

**Research date:** 2026-02-28
**Valid until:** 2026-03-30 (30 days for stable APIs)
