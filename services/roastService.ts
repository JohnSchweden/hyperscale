import { PersonalityType } from '../types';
import { getRoast, speak, cleanupAudio } from './geminiService';
import { connectToLiveSession } from './geminiLive';

/**
 * Voice mapping for TTS fallback
 * Maps personality to voice names used by the TTS API
 */
const VOICE_MAP: Record<PersonalityType, string> = {
  [PersonalityType.ROASTER]: 'Kore',
  [PersonalityType.ZEN_MASTER]: 'Puck',
  [PersonalityType.LOVEBOMBER]: 'Enceladus',
};

/**
 * Error types that should trigger fallback to standard TTS
 */
const FALLBACK_ERROR_CODES = [
  'WebSocket connection error',
  '401',
  '403',
  '429',
  'rate limit',
  'timeout',
  'network error',
  'fetch failed',
  'token',
  'authentication',
  'not authenticated',
  'api key',
  'ephemeral',
];

/**
 * Check if an error should trigger fallback to TTS
 */
function shouldFallback(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();
  
  return FALLBACK_ERROR_CODES.some(code => 
    lowerMessage.includes(code.toLowerCase())
  );
}

/**
 * Play streaming audio from Live API
 * Handles audio context, AudioWorklet, and playback
 */
async function playStreamingAudio(
  prompt: string,
  personality: PersonalityType
): Promise<void> {
  // Initialize AudioContext at 48kHz for browser playback
  const audioContext = new AudioContext({ sampleRate: 48000 });
  
  // Load the AudioWorklet processor for 24kHz → 48kHz conversion
  await audioContext.audioWorklet.addModule('/audio-processor.worklet.js');
  
  // Create AudioWorkletNode connected to speakers
  const workletNode = new AudioWorkletNode(
    audioContext,
    'streaming-audio-processor'
  );
  workletNode.connect(audioContext.destination);
  
  // Connect to Gemini Live API
  const stream = await connectToLiveSession(prompt, personality);
  const reader = stream.getReader();
  
  // Convert Int16 PCM to Float32 and send to worklet
  const convertToFloat32 = (buffer: ArrayBuffer): Float32Array => {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    return float32Array;
  };
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      // Handle audio chunks
      if (value && 'data' in value && value.data.byteLength > 0) {
        const float32Data = convertToFloat32(value.data);
        workletNode.port.postMessage({
          type: 'chunk',
          data: float32Data,
        });
      }
      
      // Log text chunks for debugging
      if (value && 'text' in value) {
        console.log('[roastService] Text response:', value.text);
      }
    }
  } finally {
    // Cleanup
    workletNode.port.postMessage({ type: 'flush' });
    workletNode.disconnect();
    await audioContext.close();
  }
}

/**
 * Get roast with streaming audio via Live API
 * 
 * First generates the roast text, then plays it using streaming audio
 * from the Gemini Live API (direct browser connection).
 * 
 * @param workflow - The workflow/context for the roast
 * @param personality - The personality type
 * @returns The roast text that was generated
 */
export async function getRoastWithStreaming(
  workflow: string,
  personality: PersonalityType
): Promise<string> {
  // First get the roast text
  const roastText = await getRoast(workflow, personality);
  
  // Then stream the audio
  await playStreamingAudio(roastText, personality);
  
  return roastText;
}

/**
 * Get roast with automatic fallback to standard TTS
 * 
 * Attempts to use Live API for streaming audio first.
 * If that fails (connection error, rate limit, timeout, etc.),
 * falls back to standard TTS playback.
 * 
 * @param workflow - The workflow/context for the roast
 * @param personality - The personality type
 * @returns The roast text that was generated
 */
export async function getRoastWithFallback(
  workflow: string,
  personality: PersonalityType
): Promise<string> {
  // First get the roast text
  const roastText = await getRoast(workflow, personality);
  
  try {
    // Try streaming audio first
    await playStreamingAudio(roastText, personality);
  } catch (error) {
    // Log warning and fallback to standard TTS
    console.warn('[roastService] Live API unavailable, falling back to standard TTS:', error);
    
    // Fallback to standard TTS
    const voiceName = VOICE_MAP[personality];
    await speak(roastText, voiceName);
  }
  
  return roastText;
}

/**
 * Simple get roast without audio (for when audio is disabled)
 */
export async function getRoastTextOnly(
  workflow: string,
  personality: PersonalityType
): Promise<string> {
  return getRoast(workflow, personality);
}
