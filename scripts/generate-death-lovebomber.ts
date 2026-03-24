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
	// Lovebomber death endings
	{
		folder: "lovebomber",
		filename: "death_bankrupt.wav",
		text: "Liquidated! The VCs pulled out but you LEARNED so much! Startup life, bestie!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "death_replaced_by_script.wav",
		text: "Replaced by a script! But Python is SO elegant! 12 lines! Efficiency WIN, bestie!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "death_congress.wav",
		text: "Testifying before Congress! You're FAMOUS now! So much PUBLICITY! Legend status, bestie!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "death_fled_country.wav",
		text: "Fled the country! International opportunities! So much ADVENTURE! New chapter, bestie!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "death_prison.wav",
		text: "Federal prison! Orange is the new BLACK! Fashion FORWARD! So trendy, bestie!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "death_audit_failure.wav",
		text: "Audit catastrophe! You're a CASE STUDY now! Famous in ACCOUNTING circles! Impact, bestie!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "death_kirk.wav",
		text: "OH MY! You BROKE the SIMULA-tion! So CREATIVE! Bestie you're LEGEND-ary!",
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
		const outputDir = path.join(
			process.cwd(),
			"public/audio/voices",
			v.folder,
			"death",
		);
		fs.mkdirSync(outputDir, { recursive: true });

		console.log(`Generating ${v.folder}/${v.filename}...`);
		const pcm = await generateVoice(v.text, v.voice);
		const wav = createWavFile(pcm);
		const outputPath = path.join(outputDir, v.filename);
		fs.writeFileSync(outputPath, wav);
		console.log(`  Saved ${outputPath} (${wav.length} bytes)`);
	}

	console.log("All 7 Lovebomber death files generated!");
}

main().catch(console.error);
