
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

// Generate speech from text using gemini-2.5-flash-preview-tts
export const speak = async (text: string, voiceName: string = 'Kore') => {
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
      
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContext,
        24000,
        1,
      );
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

// Generate satirical roast using gemini-3-flash-preview
export const getRoast = async (workflow: string, personalityName: string): Promise<string> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are ${personalityName} from the satirical tech company HyperScale Inc. 
    A user has described their current AI workflow: "${workflow}". 
    Roast this workflow for its security flaws, privacy risks, and lack of governance. 
    Be sarcastic, witty, and cynical. Keep it under 50 words.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    // Access the generated text directly from the response property
    return response.text || "Even for you, this is remarkably insecure.";
  } catch (error) {
    console.error("Roast Error:", error);
    return "The auditors found your workflow so bad they broke my AI.";
  }
};
