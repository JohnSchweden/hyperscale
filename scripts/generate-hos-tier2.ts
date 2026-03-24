import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Tier 2: Massive sacrifice moments
const TIER_2_FILES = [
	{
		filename: "feedback_hos_copyright_team_blame_right.wav",
		text: "Legal is happy. Your team is polishing resumes. Management approved.",
	},
	{
		filename: "feedback_hos_copyright_team_blame_left.wav",
		text: "Taking a thirty-five million dollar bullet for your team. Noble. Expensive. Probably career-limiting.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_right.wav",
		text: "Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_left.wav",
		text: "Product will hate you. Your team will stay. Sometimes that's the win.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_right.wav",
		text: "Your best engineer just resigned. Compliance preserved. Output cratered.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_left.wav",
		text: "Great, now everyone wants their favorite AI tool. Governance is optional now.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_right.wav",
		text: "They warned you. You ignored it. Now you blame them. Classic management.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_left.wav",
		text: "Career-limiting. Noble. Your team will follow you anywhere. The VP less so.",
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

async function generateTier2() {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/feedback",
	);
	fs.mkdirSync(outputDir, { recursive: true });

	console.log("=== Generating Tier 2: Sacrifice moment cards ===\n");

	for (const file of TIER_2_FILES) {
		try {
			await generateVoiceFile(file.filename, file.text, outputDir);
		} catch (error) {
			console.error(`✗ Failed to generate ${file.filename}:`, error);
			process.exit(1);
		}
	}

	console.log("\n=== Tier 2 complete ===");
}

generateTier2().catch(console.error);
