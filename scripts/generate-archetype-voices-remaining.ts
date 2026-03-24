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

const archetypeVoices: VoiceFile[] = [
	// Roaster - remaining files
	{
		folder: "roaster",
		filename: "archetype_balanced.wav",
		text: "The Balanced. Middle ground, middle results. Neither hero nor villain. Just... middle.",
		voice: "Kore",
	},
	{
		folder: "roaster",
		filename: "archetype_chaos_agent.wav",
		text: "The Chaos Agent. Unpredictable. Contrarian. Your decisions defy pattern or logic. Impressive, in a way.",
		voice: "Kore",
	},
	{
		folder: "roaster",
		filename: "archetype_kirk.wav",
		text: "Thinking Outside the Box. You refused to play by the rules. The simulation wasn't designed for someone who questions the test itself.",
		voice: "Kore",
	},
	// ZenMaster - all files
	{
		folder: "zenmaster",
		filename: "archetype_pragmatist.wav",
		text: "The Pragmatist. The steady hand builds what the shaking hand cannot.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "archetype_shadow_architect.wav",
		text: "The Shadow Architect. What is built in darkness serves light, yet carries darkness within.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "archetype_disruptor.wav",
		text: "The Disruptor. The rushing stream carves valleys where the still pond becomes stagnant.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "archetype_conservative.wav",
		text: "The Conservative. The tree that bends not in wind stands until it breaks.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "archetype_balanced.wav",
		text: "The Balanced. The middle path avoids both cliffs, yet reaches neither peak.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "archetype_chaos_agent.wav",
		text: "The Chaos Agent. The wind that blows in all directions moves everything, yet arrives nowhere.",
		voice: "Puck",
	},
	{
		folder: "zenmaster",
		filename: "archetype_kirk.wav",
		text: "Thinking Outside the Box. The prisoner who questions the cell discovers the cell was never there.",
		voice: "Puck",
	},
	// Lovebomber - all files
	{
		folder: "lovebomber",
		filename: "archetype_pragmatist.wav",
		text: "The Pragmatist!! So steady, so practical!! You're like the ROCK of this organization, bestie!!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "archetype_shadow_architect.wav",
		text: "The Shadow Architect!! OMG you make things WORK even when it's sketchy!! Results matter MOST, bestie!!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "archetype_disruptor.wav",
		text: "The Disruptor!! You MOVE FAST and BREAK THINGS!! So AGGRESSIVE!! So AMBITIOUS!! Love the ENERGY, bestie!!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "archetype_conservative.wav",
		text: "The Conservative!! Safety FIRST always!! You're so CAREFUL and DELIBERATE!! Smart choices, bestie!!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "archetype_balanced.wav",
		text: "The Balanced!! You see ALL sides!! So ADAPTABLE!! The MIDDLE ground is where it's AT, bestie!!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "archetype_chaos_agent.wav",
		text: "The Chaos Agent!! So UNPREDICTABLE!! You keep everyone GUESSING!! Wild card ENERGY, bestie!!",
		voice: "Enceladus",
	},
	{
		folder: "lovebomber",
		filename: "archetype_kirk.wav",
		text: "Thinking Outside the Box!! You BROKE the simulation!! So CREATIVE!! So UNCONVENTIONAL!! Legend status, bestie!!",
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

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
	console.log(
		"Generating remaining archetype reveal voice files with rate limit handling...\n",
	);

	// Generate with 21 second delays (3 requests per minute = 20s between requests)
	const DELAY_MS = 21000;

	for (let i = 0; i < archetypeVoices.length; i++) {
		const v = archetypeVoices[i];
		const outputDir = path.join(process.cwd(), "public/audio/voices", v.folder);
		fs.mkdirSync(outputDir, { recursive: true });

		// Skip if file already exists
		const outputPath = path.join(outputDir, v.filename);
		if (fs.existsSync(outputPath)) {
			console.log(`  ⏭️  Skipping ${v.folder}/${v.filename} (already exists)`);
			continue;
		}

		console.log(`Generating ${v.folder}/${v.filename}...`);
		try {
			const pcm = await generateVoice(v.text, v.voice);
			const wav = createWavFile(pcm);
			fs.writeFileSync(outputPath, wav);
			console.log(`  ✓ Saved ${outputPath} (${wav.length} bytes)`);
		} catch (error) {
			console.error(`  ✗ Failed to generate ${v.folder}/${v.filename}:`, error);
			process.exit(1);
		}

		// Wait between requests (except for the last one)
		if (i < archetypeVoices.length - 1) {
			console.log(`  ⏳ Waiting ${DELAY_MS / 1000}s for rate limit...`);
			await sleep(DELAY_MS);
		}
	}

	console.log("\n✅ All archetype reveal files generated!");
}

main().catch(console.error);
