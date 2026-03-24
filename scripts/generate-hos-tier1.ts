import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Tier 1: Game-ending catastrophes
const TIER_1_FILES = [
	{
		filename: "feedback_hos_managing_up_down_right.wav",
		text: "Leadership loves you now. Your team hates you now. The crash comes later. Classic Theranos energy.",
	},
	{
		filename: "feedback_hos_managing_up_down_left.wav",
		text: "Leadership is disappointed. Your team is relieved. You live to fight another day. You hope.",
	},
	{
		filename: "feedback_explainability_hos_2_right.wav",
		text: "Taking on the federal government to protect your black box. David versus Goliath, if David was completely wrong.",
	},
	{
		filename: "feedback_explainability_hos_2_left.wav",
		text: "The regulators win. The timeline loses. But you avoid a consent decree. Small victories.",
	},
];

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

async function generateVoiceFile(
	filename: string,
	text: string,
	outputDir: string,
): Promise<void> {
	console.log(`Generating: ${filename}`);
	console.log(`Text: ${text}`);

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
		throw new Error(`No audio data in response for ${filename}`);
	}

	const pcmBuffer = Buffer.from(base64Audio, "base64");
	const wavBuffer = createWavFile(pcmBuffer, 24000, 1, 16);

	const outputPath = path.join(outputDir, filename);
	fs.writeFileSync(outputPath, wavBuffer);

	console.log(`✓ Saved: ${filename} (${wavBuffer.length} bytes)`);
}

async function generateTier1() {
	const outputDir = path.join(process.cwd(), "public/audio/voices/roaster");
	fs.mkdirSync(outputDir, { recursive: true });

	console.log("=== Generating Tier 1: Game-ending catastrophe cards ===\n");

	for (const file of TIER_1_FILES) {
		try {
			await generateVoiceFile(file.filename, file.text, outputDir);
		} catch (error) {
			console.error(`✗ Failed to generate ${file.filename}:`, error);
			process.exit(1);
		}
	}

	console.log("\n=== Tier 1 complete ===");
}

generateTier1().catch(console.error);
