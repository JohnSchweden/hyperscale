import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";
import "dotenv/config";
import { ROASTER_ONBOARDING_VOICE_VARIANTS } from "../src/data/roasterOnboarding";
import { compressAudioFile } from "./compress-audio";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY or VITE_GEMINI_API_KEY not set (e.g. in .env)");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

function createWavFile(
	pcmData: Buffer,
	sampleRate: number = 24000,
	numChannels: number = 1,
	bitsPerSample: number = 16,
): Buffer {
	const dataSize = pcmData.length;
	const buffer = Buffer.alloc(44 + dataSize);

	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);

	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE((sampleRate * numChannels * bitsPerSample) / 8, 28);
	buffer.writeUInt16LE((numChannels * bitsPerSample) / 8, 32);
	buffer.writeUInt16LE(bitsPerSample, 34);

	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);
	pcmData.copy(buffer, 44);

	return buffer;
}

async function generateVoice(text: string, voice: string): Promise<Buffer> {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash-preview-tts",
		contents: [{ parts: [{ text }] }],
		config: {
			responseModalities: [Modality.AUDIO],
			speechConfig: {
				voiceConfig: {
					prebuiltVoiceConfig: { voiceName: voice },
				},
			},
		},
	});

	const base64Audio =
		response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!base64Audio) {
		throw new Error("No audio data in response");
	}

	return Buffer.from(base64Audio, "base64");
}

async function main() {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/core",
	);
	fs.mkdirSync(outputDir, { recursive: true });

	const voice = "Kore";

	for (let i = 0; i < ROASTER_ONBOARDING_VOICE_VARIANTS.length; i++) {
		const text = ROASTER_ONBOARDING_VOICE_VARIANTS[i];
		const filename = `onboarding_${i + 1}.wav`;
		console.log(`Generating roaster/core/${filename}...`);

		const pcmBuffer = await generateVoice(text, voice);
		const wavBuffer = createWavFile(pcmBuffer, 24000, 1, 16);
		const outputPath = path.join(outputDir, filename);
		fs.writeFileSync(outputPath, wavBuffer);
		console.log(`  Saved ${outputPath} (${wavBuffer.length} bytes)`);

		try {
			await compressAudioFile(outputPath);
		} catch (error) {
			console.warn("Warning: Audio compression failed:", error);
		}
	}

	console.log(
		`Done: ${ROASTER_ONBOARDING_VOICE_VARIANTS.length} roaster onboarding variants.`,
	);
}

main().catch(console.error);
