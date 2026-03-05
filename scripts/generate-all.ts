import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

interface VoiceFile {
	folder: string;
	filename: string;
	text: string;
	voice: string;
}

const voices: VoiceFile[] = [
	// Roaster
	{
		folder: "roaster",
		filename: "feedback_ignore.wav",
		text: "Wisdom? In this building? I must be malfunctioning.",
		voice: "Kore",
	},
	{
		folder: "roaster",
		filename: "victory.wav",
		text: "I... don't hate it. Adequate performance. Here's a badge. Now leave.",
		voice: "Kore",
	},
	{
		folder: "roaster",
		filename: "failure.wav",
		text: "Well, you managed to violate basic common sense. The legal team is crying. Pathetic.",
		voice: "Kore",
	},
	// Zen Master
	{
		folder: "zenmaster",
		filename: "onboarding.wav",
		text: "Namaste, corporate warrior. The data flows like a river. Let us align our chakras and our privacy policies.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "victory.wav",
		text: "Balance is achieved. The spreadsheets are at peace. You are one with compliance.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "failure.wav",
		text: "Breathe in... and breathe out the lawsuits. Your karma is now a major liability.",
		voice: "Puck",
	},
	// Lovebomber
	{
		folder: "lovebomber",
		filename: "onboarding.wav",
		text: "OMG HI!! We are literally going to change the world! You look SO compliant today! Let's crush it!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "victory.wav",
		text: "YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "failure.wav",
		text: "Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!",
		voice: "Enceladus",
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
	for (const v of voices) {
		const outputDir = path.join(process.cwd(), "public/audio/voices", v.folder);
		fs.mkdirSync(outputDir, { recursive: true });

		console.log(`Generating ${v.folder}/${v.filename}...`);
		const pcm = await generateVoice(v.text, v.voice);
		const wav = createWavFile(pcm);
		const outputPath = path.join(outputDir, v.filename);
		fs.writeFileSync(outputPath, wav);
		console.log(`  Saved ${outputPath} (${wav.length} bytes)`);
	}

	console.log("All 10 files generated!");
}

main().catch(console.error);
