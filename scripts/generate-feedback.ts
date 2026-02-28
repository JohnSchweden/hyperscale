import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const voiceTexts = [
  { filename: "feedback_paste.wav", text: "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'." },
  { filename: "feedback_debug.wav", text: "Slow. Boring. But legal. I suppose I can't fire you for this." },
  { filename: "feedback_install.wav", text: "You just installed a keylogger for a 3ms speed boost. I hope you're happy." },
];

function createWavFile(pcmData: Buffer, sampleRate: number = 24000, numChannels: number = 1, bitsPerSample: number = 16): Buffer {
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28);
  buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);
  
  return buffer;
}

async function generateVoice(text: string): Promise<Buffer> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data in response");
  }

  return Buffer.from(base64Audio, "base64");
}

async function main() {
  const outputDir = path.join(process.cwd(), "public/audio/voices/roaster");
  fs.mkdirSync(outputDir, { recursive: true });

  for (const v of voiceTexts) {
    console.log(`Generating ${v.filename}...`);
    const pcm = await generateVoice(v.text);
    const wav = createWavFile(pcm);
    const outputPath = path.join(outputDir, v.filename);
    fs.writeFileSync(outputPath, wav);
    console.log(`Saved ${outputPath} (${wav.length} bytes)`);
  }
  
  console.log("All 3 files generated!");
}

main().catch(console.error);
