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

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isManualStopRef = useRef(false);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }

    setTranscript('');
    setError(null);
    isManualStopRef.current = false;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[Speech] onstart fired');
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('[Speech] onerror:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[Speech] onend fired, manualStop:', isManualStopRef.current, 'error:', error);
      
      // Only auto-restart if not manually stopped AND we have no error
      if (!isManualStopRef.current && !error) {
        console.log('[Speech] ended without error, auto-restarting...');
        try {
          recognition.start();
        } catch (e) {
          console.log('[Speech] restart error:', e);
          setIsListening(false);
        }
      } else {
        console.log('[Speech] not auto-restarting');
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
      console.log('[Speech] start() called');
    } catch (e) {
      console.log('[Speech] start() threw:', e);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [error]);

  const stopListening = useCallback(() => {
    console.log('[Speech] stopListening called');
    isManualStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[Speech] stop() error:', e);
      }
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      isManualStopRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
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
