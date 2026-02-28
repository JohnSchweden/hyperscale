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

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(ERROR_MESSAGES[personality.toLowerCase()] || "Voice module error");
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioData = new Uint8Array(arrayBuffer);
    const audioBlob = new Blob([audioData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (currentSource) {
      currentSource.pause();
      URL.revokeObjectURL(currentSource.src);
    }

    currentSource = new Audio(audioUrl);
    currentSource.load();
    
    return;
  } catch (error) {
    console.error("[Voice Error]", error);
    throw new Error(ERROR_MESSAGES[personality.toLowerCase()] || "Voice module error");
  }
}

export async function playVoice(): Promise<void> {
  if (!currentSource) {
    throw new Error("No audio loaded");
  }

  return new Promise((resolve, reject) => {
    try {
      currentSource!.onended = () => {
        resolve();
      };
      currentSource!.onerror = (e) => {
        reject(e);
      };
      currentSource!.play();
    } catch (e) {
      reject(e);
    }
  });
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
