import { useCallback, useEffect, useRef, useState } from 'react';
import { PersonalityType } from '../types';
import { connectToLiveSession } from '../services/geminiLive';

interface UseLiveAudioReturn {
  startSession: (prompt: string, personality: PersonalityType) => Promise<void>;
  stopSession: () => void;
  isPlaying: boolean;
  error: string | null;
}

/**
 * React hook for streaming audio with Gemini Live API
 * 
 * Enables real-time audio playback by:
 * 1. Connecting directly to Gemini Live API (no backend proxy)
 * 2. Receiving streaming audio chunks
 * 3. Playing audio as chunks arrive (not waiting for full response)
 * 
 * Uses AudioWorklet for 24kHz → 48kHz sample rate conversion
 */
export function useLiveAudio(): UseLiveAudioReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<ReadableStream | null>(null);
  const readerRef = useRef<ReadableStreamReader<unknown> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize AudioContext and AudioWorklet
   * Must be called after user interaction (browser requirement)
   */
  const initializeAudio = useCallback(async () => {
    if (audioContextRef.current) {
      return;
    }

    // Create AudioContext at 48kHz for browser playback
    const audioContext = new AudioContext({ sampleRate: 48000 });
    audioContextRef.current = audioContext;

    // Load the AudioWorklet processor
    await audioContext.audioWorklet.addModule('/audio-processor.worklet.js');

    // Create AudioWorkletNode connected to speakers
    const workletNode = new AudioWorkletNode(
      audioContext,
      'streaming-audio-processor'
    );
    workletNode.connect(audioContext.destination);
    workletNodeRef.current = workletNode;

    console.log('[useLiveAudio] AudioContext initialized at 48kHz');
  }, []);

  /**
   * Convert Int16 PCM ArrayBuffer to Float32Array
   */
  const convertToFloat32 = useCallback((buffer: ArrayBuffer): Float32Array => {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);

    // Convert Int16 [-32768, 32767] to Float32 [-1, 1]
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    return float32Array;
  }, []);

  /**
   * Stop the current live audio session
   */
  const stopSession = useCallback(() => {
    // Abort the stream reader
    if (readerRef.current) {
      readerRef.current.cancel();
      readerRef.current = null;
    }

    // Clear the stream reference
    if (streamRef.current) {
      streamRef.current.cancel();
      streamRef.current = null;
    }

    // Abort any pending operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear the audio buffer
    if (workletNodeRef.current) {
      try {
        workletNodeRef.current.port.postMessage({ type: 'flush' });
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    setIsPlaying(false);
    console.log('[useLiveAudio] Session stopped');
  }, []);

  /**
   * Start a live audio session with Gemini Live API
   */
  const startSession = useCallback(async (prompt: string, personality: PersonalityType) => {
    try {
      // Clean up any existing session
      stopSession();

      setError(null);
      setIsPlaying(true);

      // Initialize audio (must be called after user interaction)
      await initializeAudio();

      // Create abort controller for cancellation
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Connect to Gemini Live API (direct browser connection)
      const stream = await connectToLiveSession(prompt, personality);
      streamRef.current = stream;
      const reader = stream.getReader();
      readerRef.current = reader;

      console.log('[useLiveAudio] Starting live session');

      // Process audio chunks as they arrive
      while (!abortController.signal.aborted) {
        const { done, value } = await reader.read();

        if (done || abortController.signal.aborted) {
          break;
        }

        // Handle audio chunks
        if (value && 'data' in value) {
          const audioChunk = value;
          
          // Skip empty chunks or final chunks
          if (audioChunk.data.byteLength === 0) {
            continue;
          }

          // Convert Int16 to Float32
          const float32Data = convertToFloat32(audioChunk.data);

          // Send to AudioWorklet for playback
          // The worklet handles 24kHz → 48kHz conversion internally
          if (workletNodeRef.current) {
            workletNodeRef.current.port.postMessage({
              type: 'chunk',
              data: float32Data,
            });
          }
        }

        // Handle text chunks (for logging/debugging)
        if (value && 'text' in value) {
          console.log('[useLiveAudio] Text response:', value.text);
        }
      }

      console.log('[useLiveAudio] Session ended');
      setIsPlaying(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useLiveAudio] Error:', errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
    }
  }, [initializeAudio, convertToFloat32, stopSession]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    stopSession();

    // Close AudioWorkletNode
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [stopSession]);

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    startSession,
    stopSession,
    isPlaying,
    error,
  };
}

// Export for convenience
export type { UseLiveAudioReturn };
