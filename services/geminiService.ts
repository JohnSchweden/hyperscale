
import { GoogleGenAI, Modality } from "@google/genai";

// Audio context utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let audioContext: AudioContext | null = null;
let activeSources: AudioBufferSourceNode[] = [];

// Generate speech from text using gemini-2.5-flash-preview-tts
// Set VITE_ENABLE_SPEECH=false in .env to disable TTS
export const speak = async (text: string, voiceName: string = 'Kore') => {
  if (import.meta.env.VITE_ENABLE_SPEECH === 'false') return;
  try {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContext,
        24000,
        1,
      );

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      activeSources.push(source);
      source.onended = () => {
        const index = activeSources.indexOf(source);
        if (index > -1) {
          activeSources.splice(index, 1);
        }
      };

      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

export const cleanupAudio = () => {
  activeSources.forEach((source) => {
    try {
      if (source.playbackState !== 'finished') {
        source.stop();
      }
    } catch {
      // Source may already be stopped
    }
  });
  activeSources = [];

  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(console.error);
    audioContext = null;
  }
};

// Generate satirical roast using Gemini text models
const ROAST_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"] as const;

export const getRoast = async (workflow: string, personalityName: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Roast Error: GEMINI_API_KEY not set in .env.local");
    return "Roast disabled: Set GEMINI_API_KEY in .env.local to enable.";
  }

  const prompt = `
You are ${personalityName} from the satirical tech company HyperScale Inc.
A user has described their current AI workflow: "${workflow}".

**Step 1:** Analyze the workflow. Is it using public tools (high privacy risk) or enterprise/in-house tools (low privacy risk)?
**Step 2:** Roast them based on that analysis.
*   If **Public**: Roast them for leaking IP and causing a data breach.
*   If **Private/In-house**: Roast them for blindly trusting AI code, creating "secure" garbage, or believing that a firewall fixes bad engineering.

Be sarcastic, witty, and cynical. Keep it under 50 words.
`;

  const ai = new GoogleGenAI({ apiKey });

  for (const model of ROAST_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text || "Even for you, this is remarkably insecure.";
    } catch (error) {
      console.warn(`Roast Error (${model}):`, error);
      // Try next model
    }
  }

  console.error("Roast Error: All models failed");
  return "The auditors found your workflow so bad they broke my AI.";
};
