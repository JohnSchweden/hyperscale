import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

interface UseLiveAPISpeechRecognitionOptions {
  /**
   * Callback for streaming transcription updates
   */
  onTranscript?: (text: string, isFinal: boolean) => void;
  
  /**
   * System instruction for the transcription session
   */
  systemInstruction?: string;
}

interface UseLiveAPISpeechRecognitionReturn {
  /**
   * Start recording and transcribing speech
   */
  startRecording: () => Promise<void>;
  
  /**
   * Stop recording and close the session
   */
  stopRecording: () => Promise<void>;
  
  /**
   * Current accumulated transcript
   */
  transcript: string;
  
  /**
   * Whether recording is in progress
   */
  isRecording: boolean;
  
  /**
   * Error message if any
   */
  error: string | null;
}

/**
 * AudioWorklet code for converting Float32 to Int16 PCM
 */
const audioWorkletCode = `
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

/**
 * Start microphone capture and return audio chunks
 */
async function startMicCapture(
  onAudioChunk: (base64: string, sampleRate: number) => void
): Promise<{ stop: () => void }> {
  // Request mic at 16kHz (browser may not honor, typically gives 48kHz)
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 16000,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  console.log('[STT DEBUG] getUserMedia success');

  // Get actual sample rate from the stream
  const actualSampleRate = stream.getAudioTracks()[0].getSettings().sampleRate || 48000;
  console.log('[STT DEBUG] Requested sampleRate: 16000, Actual sampleRate:', actualSampleRate);

  // Create AudioContext at the actual sample rate from the stream
  const audioCtx = new AudioContext({ sampleRate: actualSampleRate });
  console.log('[STT DEBUG] AudioContext created at:', audioCtx.sampleRate, 'Hz');

  // Inline AudioWorklet - converts Float32 to Int16 PCM
  const blob = new Blob([audioWorkletCode], { type: 'application/javascript' });
  const workletUrl = URL.createObjectURL(blob);
  await audioCtx.audioWorklet.addModule(workletUrl);

  console.log('[STT DEBUG] AudioWorklet module loaded');

  const source = audioCtx.createMediaStreamSource(stream);
  const worklet = new AudioWorkletNode(audioCtx, 'pcm-processor');

  let chunkCount = 0;
  worklet.port.onmessage = (event) => {
    chunkCount++;
    const bytes = new Uint8Array(event.data.buffer);
    console.log('[STT DEBUG] AudioWorklet received chunk:', chunkCount, 'size:', bytes.length, 'bytes');
    
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    console.log('[STT DEBUG] Sending base64 audio chunk:', base64.substring(0, 50) + '...');
    onAudioChunk(base64, actualSampleRate);
  };

  source.connect(worklet);
  // Don't connect to destination (avoids feedback)

  console.log('[STT DEBUG] Audio pipeline connected');

  return {
    stop: () => {
      console.log('[STT DEBUG] Stopping microphone capture');
      stream.getTracks().forEach((t) => t.stop());
      worklet.disconnect();
      audioCtx.close();
      URL.revokeObjectURL(workletUrl);
    },
  };
}

/**
 * Custom hook for speech recognition using Gemini Live API
 * 
 * Provides real-time transcription of microphone input
 */
export function useLiveAPISpeechRecognition(
  options: UseLiveAPISpeechRecognitionOptions = {}
): UseLiveAPISpeechRecognitionReturn {
  const { onTranscript, systemInstruction } = options;
  
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const transcriptBufferRef = useRef('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      transcriptBufferRef.current = '';

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY not set');
      }

      // Create the AI client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { apiVersion: 'v1alpha' as const },
      });

      // Connect to Live API with input transcription enabled
      const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-latest',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
          },
          systemInstruction: 'You are a speech transcription service. Only transcribe user audio. Do not generate any response.',
        },
        callbacks: {
          onmessage: (message) => {
            // Handle input transcription
            const inputText = message.serverContent?.inputTranscription?.text;
            if (inputText) {
              transcriptBufferRef.current += inputText;
              
              // Call the immediate callback for streaming
              if (onTranscript) {
                onTranscript(transcriptBufferRef.current.trim(), false);
              }
              
              // Update state for UI
              setTranscript(transcriptBufferRef.current.trim());
              
              // Debounce final transcript
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }
              debounceTimerRef.current = setTimeout(() => {
                if (onTranscript) {
                  onTranscript(transcriptBufferRef.current.trim(), true);
                }
              }, 1500);
            }
            
            // Handle turn complete
            if (message.serverContent?.turnComplete) {
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }
              if (onTranscript) {
                onTranscript(transcriptBufferRef.current.trim(), true);
              }
            }
          },
          onerror: (err) => {
            console.error('[Live API STT] Error:', err);
            setError(err instanceof Error ? err.message : String(err));
          },
          onclose: () => {
            console.log('[Live API STT] Connection closed');
          },
        },
      });

      sessionRef.current = session;
      console.log('[STT DEBUG] Session connected successfully');
      
      // Start microphone capture
      const mic = await startMicCapture((base64, sampleRate) => {
        if (sessionRef.current) {
          console.log('[STT DEBUG] Calling sendRealtimeInput with audio chunk, size:', base64.length, 'chars, sampleRate:', sampleRate);
          try {
            sessionRef.current.sendRealtimeInput({
              audio: {
                data: base64,
                mimeType: 'audio/pcm;rate=' + sampleRate,
              },
            });
            console.log('[STT DEBUG] sendRealtimeInput completed successfully');
          } catch (err) {
            console.error('[STT DEBUG] sendRealtimeInput error:', err);
          }
        }
      });
      
      micRef.current = mic;
      setIsRecording(true);
      
    } catch (err) {
      console.error('[Live API STT] Failed to start:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [onTranscript, systemInstruction]);

  const stopRecording = useCallback(async () => {
    try {
      // Stop microphone capture
      if (micRef.current) {
        micRef.current.stop();
        micRef.current = null;
      }

      // Send audio stream end signal
      if (sessionRef.current) {
        sessionRef.current.sendRealtimeInput({ audioStreamEnd: true });
        
        // Wait briefly for final transcription
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Close the session
        sessionRef.current.close();
        sessionRef.current = null;
      }

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      setIsRecording(false);
      
    } catch (err) {
      console.error('[Live API STT] Failed to stop:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  return {
    startRecording,
    stopRecording,
    transcript,
    isRecording,
    error,
  };
}
