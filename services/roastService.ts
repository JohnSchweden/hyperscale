import { PersonalityType } from '../types';
import { getRoast, speak } from './geminiService';
import { connectToLiveSession } from './geminiLive';

const TTS_FALLBACK_ENABLED =
  import.meta.env.VITE_TTS_FALLBACK_ENABLED === 'true';

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
 * Stream text and audio simultaneously from Live API.
 * User workflow is sent as prompt; Live API generates roast text + audio together.
 */
async function streamFromLiveAPI(
  workflow: string,
  personality: PersonalityType,
  onTextChunk: (text: string) => void
): Promise<string> {
  console.log(`[roastService] streamFromLiveAPI called with personality: ${personality}`);
  const audioContext = new AudioContext({ sampleRate: 24000 });
  let nextStartTime = 0;

  const stream = await connectToLiveSession(workflow, personality);
  const reader = stream.getReader();

  const playAudioChunk = async (buffer: ArrayBuffer) => {
    if (buffer.byteLength === 0) return;

    // Convert PCM16 to Float32
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    const currentTime = audioContext.currentTime;
    if (nextStartTime < currentTime) {
      nextStartTime = currentTime;
    }

    source.start(nextStartTime);
    nextStartTime += audioBuffer.duration;
  };

  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value && 'text' in value && value.text) {
        fullText += value.text;
        onTextChunk(value.text);
      }

      if (value && 'data' in value && value.data.byteLength > 0) {
        await playAudioChunk(value.data);
      }
    }
  } finally {
    await audioContext.close();
  }

  return fullText;
}

/**
 * Get roast with streaming text + audio via Live API.
 */
export async function getRoastWithStreaming(
  workflow: string,
  personality: PersonalityType,
  onTextChunk: (text: string) => void
): Promise<string> {
  return streamFromLiveAPI(workflow, personality, onTextChunk);
}

/**
 * Get roast with automatic fallback to standard TTS
 */
export async function getRoastWithFallback(
  workflow: string,
  personality: PersonalityType,
  onTextChunk: (text: string) => void
): Promise<string> {
  try {
    return await streamFromLiveAPI(workflow, personality, onTextChunk);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    console.warn(
      '[roastService] Live API unavailable, falling back to TTS. Error:',
      errMsg,
      errStack ? `\n${errStack}` : ''
    );

    if (TTS_FALLBACK_ENABLED && shouldFallback(error)) {
      const roastText = await getRoast(workflow, personality);
      const voiceName = VOICE_MAP[personality];
      await speak(roastText, voiceName);
      return roastText;
    }
    throw error;
  }
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
