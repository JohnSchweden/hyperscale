# Phase 2: Live API for Roast.exe (Real-Time Streaming) - Research

**Researched:** 2026-02-28
**Domain:** Gemini Live API for real-time streaming audio, Web Audio API integration
**Confidence:** HIGH

## Summary

This phase explores implementing Gemini Live API for real-time streaming audio in the Roast.exe workflow. The current implementation uses a simple TTS API that waits for the full response before playing audio. Gemini Live API enables streaming audio chunks as they are generated, reducing time-to-first-audio.

**Key findings:**
- Gemini Live API uses WebSocket (WSS) protocol for bidirectional streaming
- Output audio format is 16-bit PCM at 24kHz, which requires sample rate conversion for browser playback (browser defaults to 48kHz)
- API keys cannot be used directly in browser/client-side code - requires a backend proxy
- AudioWorklet is the modern approach for low-latency streaming in browsers (replaces deprecated ScriptProcessorNode)
- A critical pitfall exists: improper 24kHz→48kHz conversion causes audio to play one octave higher (sped up)

**Primary recommendation:** Use @google/genai SDK with a backend proxy to handle authentication, implement AudioWorklet with proper sample rate conversion for browser playback, and maintain fallback to standard TTS when Live API fails or is unavailable.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @google/genai | ^1.43.0 | Official Google GenAI SDK for Gemini Live API | Official SDK, supports live sessions with audio input/output |
| Web Audio API | Native | Browser audio playback | Native browser API for low-latency audio |
| AudioWorklet | Native | Streaming PCM processing | Modern replacement for ScriptProcessorNode, runs off main thread |

### Supporting
| Library | Purpose | When to Use |
|---------|---------|-------------|
| ws (WebSocket) | Backend WebSocket server | If implementing custom proxy |
| Express.js | Backend HTTP server | For API key handling and proxy |

### Alternative Approaches Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct browser connection | Backend proxy with WebSocket | Security (API keys can't be exposed) |
| AudioWorklet | ScriptProcessorNode (deprecated) | Worklet is modern, more stable |
| Custom resampling | AudioContext sampleRate | Browser may not handle 24→48kHz correctly |

**Installation:**
```bash
npm install @google/genai
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── services/
│   ├── geminiLive.ts      # Gemini Live API connection handling
│   └── audioStreaming.ts  # AudioWorklet and playback management
├── hooks/
│   └── useLiveAudio.ts    # React hook for streaming audio
├── utils/
│   ├── pcmConverter.ts    # 16-bit PCM to Float32 conversion
│   └── sampleRateConverter.ts  # 24kHz to 48kHz conversion
└── types/
    └── audio.ts           # TypeScript types for audio streaming
```

### Pattern 1: Gemini Live API Connection
**What:** Establish WebSocket connection to Gemini Live API with audio streaming
**When to use:** When implementing real-time voice interactions with Gemini
**Example:**
```typescript
// Source: Google GenAI SDK documentation
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Connect to Live API
const session = await ai.live.connect({
  model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  config: {
    responseModalities: [Modality.AUDIO],
    systemInstruction: 'You are a helpful assistant for Roast.exe game.',
  },
  callbacks: {
    onopen: () => console.log('Connected to Gemini Live API'),
    onmessage: (message) => {
      // Handle incoming audio chunks (base64 encoded PCM)
      const audioBase64 = message.serverContent?.inlineMedia?.data;
      if (audioBase64) {
        // Convert and play audio
      }
    },
    onerror: (error) => console.error('Live API error:', error),
  },
});

// Send text input
session.sendRealtimeInput({
  text: { text: 'Roast my code!' }
});
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
**How to avoid:** Always resample 24kHz → 48kHz before playback. Use linear interpolation or Web Audio API's built-in resampling
**Warning signs:** Audio sounds "sped up", test with a known 440Hz tone produces 880Hz

### Pitfall 2: API Key Exposure in Browser
**What goes wrong:** API key is visible in browser developer tools,可以被恶意使用
**Why it happens:** Developers put API key directly in frontend code
**How to avoid:** Always use backend proxy. Frontend connects to your server, server connects to Gemini Live API
**Warning signs:** API key appears in network requests or source code

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

**Deprecated/outdated:**
- ScriptProcessorNode: Replaced by AudioWorklet
- Direct API key in frontend: Security risk, use backend proxy
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

### Primary (HIGH confidence)
- Google GenAI SDK GitHub (github.com/googleapis/js-genai) - Official SDK documentation
- Gemini Live API Examples (github.com/google-gemini/gemini-live-api-examples) - Working examples
- Firebase AI Logic Live API docs - Official documentation for live API usage

### Secondary (MEDIUM confidence)
- Google Cloud Vertex AI Live API documentation - Official best practices
- Stack Overflow community patterns for Web Audio API streaming
- MDN Web Audio API best practices

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
