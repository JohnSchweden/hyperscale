import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function createRecognitionInstance(
  onstart: () => void,
  onresult: (transcript: string) => void,
  onerror: (error: string) => void,
  onend: () => void
): SpeechRecognition {
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = onstart;
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    for (let i = 0; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i].transcript + ' ';
      }
    }
    if (finalTranscript) {
      onresult(finalTranscript);
    }
  };
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.log('[Speech] error:', event.error);
    onerror(event.error);
  };
  recognition.onend = onend;

  return recognition;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldBeListeningRef = useRef(false);
  const transcriptRef = useRef('');

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setTranscript('');
    transcriptRef.current = '';
    setError(null);
    shouldBeListeningRef.current = true;

    const recognition = createRecognitionInstance(
      () => {
        console.log('[Speech] started');
        setIsListening(true);
      },
      (newTranscript) => {
        console.log('[Speech] got transcript:', newTranscript);
        transcriptRef.current += newTranscript;
        setTranscript(transcriptRef.current);
      },
      (err) => {
        console.log('[Speech] error:', err);
        setError(err);
        setIsListening(false);
        shouldBeListeningRef.current = false;
      },
      () => {
        console.log('[Speech] ended, shouldBeListening:', shouldBeListeningRef.current);
        
        if (shouldBeListeningRef.current) {
          // Create NEW recognition instance for restart
          console.log('[Speech] creating new instance and restarting...');
          const newRecognition = createRecognitionInstance(
            () => {
              console.log('[Speech] restarted');
              setIsListening(true);
            },
            (newTranscript) => {
              transcriptRef.current += newTranscript;
              setTranscript(transcriptRef.current);
            },
            (err) => {
              setError(err);
              setIsListening(false);
              shouldBeListeningRef.current = false;
            },
            () => {
              // Recursive: check again
              if (shouldBeListeningRef.current) {
                // Stop the endless loop - give up after one restart
                console.log('[Speech] giving up on auto-restart');
                shouldBeListeningRef.current = false;
              }
              setIsListening(false);
            }
          );
          recognitionRef.current = newRecognition;
          try {
            newRecognition.start();
          } catch (e) {
            console.log('[Speech] restart failed:', e);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      }
    );

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (e) {
      console.log('[Speech] start error:', e);
      setError('Failed to start speech recognition');
      shouldBeListeningRef.current = false;
    }
  }, []);

  const stopListening = useCallback(() => {
    console.log('[Speech] manual stop');
    shouldBeListeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
  };
}
