import { useState, useRef, useCallback } from 'react';
import { PersonalityType } from '../types';
import { getRoastWithFallback, getRoastTextOnly } from '../services/roastService';

export type RoastStatus = 'idle' | 'loading' | 'streaming' | 'speaking' | 'complete';

export function useRoast(personality: PersonalityType | null) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<RoastStatus>('idle');
  const outputRef = useRef<HTMLDivElement>(null);

  const handleRoast = useCallback(async () => {
    if (!input || !personality) return;
    setIsLoading(true);
    setStatus('loading');
    try {
      // Check if speech is enabled
      const speechEnabled = import.meta.env.VITE_ENABLE_SPEECH !== 'false';
      
      let roast: string;
      if (speechEnabled) {
        // Use streaming with fallback - shows 'streaming' or 'speaking' status
        setStatus('streaming');
        roast = await getRoastWithFallback(input, personality);
        setStatus('speaking');
      } else {
        // Text-only mode
        roast = await getRoastTextOnly(input, personality);
      }
      
      setOutput(roast);
      setStatus('complete');
    } catch (e) {
      setOutput("Roast service unavailable. The auditors are busy.");
      setStatus('idle');
    }
    setIsLoading(false);
  }, [input, personality]);

  const reset = useCallback(() => {
    setInput('');
    setOutput(null);
    setIsLoading(false);
    setStatus('idle');
  }, []);

  return {
    input,
    setInput,
    output,
    outputRef,
    isLoading,
    status,
    handleRoast,
    reset
  };
}
