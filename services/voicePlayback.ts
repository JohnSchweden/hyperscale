let currentSource: HTMLAudioElement | null = null;

const ERROR_MESSAGES = {
  roaster: "V.E.R.A. voice module malfunctioned",
  zenmaster: "The silence of the spreadsheets is deafening",
  lovebomber: "OMG the audio broke!! But we still love you!!",
};

export async function loadVoice(personality: string, trigger: string): Promise<void> {
  const basePath = '/audio/voices';
  const personalityDir = `${basePath}/${personality.toLowerCase()}`;
  const filename = trigger.replace(/_/g, '-') + '.wav';
  const filePath = `${personalityDir}/${filename}`;

  console.log('[Voice] Loading:', filePath);

  try {
    const response = await fetch(filePath);
    console.log('[Voice] Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${ERROR_MESSAGES[personality.toLowerCase()] || "Voice module error"}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('[Voice] Buffer size:', arrayBuffer.byteLength);
    
    const audioData = new Uint8Array(arrayBuffer);
    const audioBlob = new Blob([audioData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (currentSource) {
      currentSource.pause();
      URL.revokeObjectURL(currentSource.src);
    }

    currentSource = new Audio(audioUrl);
    
    currentSource.oncanplaythrough = () => {
      console.log('[Voice] Audio can play through');
    };
    
    currentSource.onerror = (e) => {
      console.error('[Voice] Audio error:', e);
    };
    
    await currentSource.play();
    console.log('[Voice] Play started');
    
    return;
  } catch (error) {
    console.error("[Voice Error]", error);
    throw new Error(ERROR_MESSAGES[personality.toLowerCase()] || "Voice module error");
  }
}

export async function playVoice(): Promise<void> {
  if (!currentSource) {
    console.log('[Voice] No source to play');
    return;
  }

  try {
    await currentSource.play();
    console.log('[Voice] Play resumed');
  } catch (e) {
    console.error("[Voice] Play error:", e);
  }
}

export function stopVoice(): void {
  if (currentSource) {
    try {
      currentSource.pause();
      currentSource.currentTime = 0;
    } catch (e) {
      console.error("Error stopping voice:", e);
    }
    currentSource = null;
  }
}

export function isPlaying(): boolean {
  return currentSource !== null && !currentSource.paused;
}
