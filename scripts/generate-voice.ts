import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const text =
	"Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?";

function createWavFile(
	pcmData: Buffer,
	sampleRate: number = 24000,
	numChannels: number = 1,
	bitsPerSample: number = 16,
): Buffer {
	const dataSize = pcmData.length;
	const buffer = Buffer.alloc(44 + dataSize);

	// RIFF header
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);

	// fmt subchunk
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16); // Subchunk1Size
	buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE((sampleRate * numChannels * bitsPerSample) / 8, 28); // ByteRate
	buffer.writeUInt16LE((numChannels * bitsPerSample) / 8, 32); // BlockAlign
	buffer.writeUInt16LE(bitsPerSample, 34);

	// data subchunk
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);
	pcmData.copy(buffer, 44);

	return buffer;
}

async function generateVoice() {
	console.log("Generating voice file...");

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

	const base64Audio =
		response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!base64Audio) {
		console.error("No audio data in response");
		process.exit(1);
	}

	const pcmBuffer = Buffer.from(base64Audio, "base64");
	console.log(`PCM data size: ${pcmBuffer.length} bytes`);

	// Wrap in WAV container
	const wavBuffer = createWavFile(pcmBuffer, 24000, 1, 16);

	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/core",
	);
	fs.mkdirSync(outputDir, { recursive: true });

	const outputPath = path.join(outputDir, "onboarding.wav");
	fs.writeFileSync(outputPath, wavBuffer);

	console.log(`Voice file saved to: ${outputPath}`);
	console.log(`File size: ${wavBuffer.length} bytes`);
}

generateVoice().catch(console.error);
