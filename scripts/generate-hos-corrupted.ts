import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";
import { compressAudioFile } from "./compress-audio";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const CORRUPTED_HOS_FILES = [
	{
		filename: "feedback_explainability_hos_2_left.wav",
		text: "The regulators win. The timeline loses. But you avoid a consent decree.",
	},
	{
		filename: "feedback_explainability_hos_2_right.wav",
		text: "Taking on the federal government to protect your black box. David versus Goliath, if David was completely wrong.",
	},
	{
		filename: "feedback_hos_copyright_team_blame_left.wav",
		text: "Team loves you. Legal is suspicious. Career roulette.",
	},
	{
		filename: "feedback_hos_copyright_team_blame_right.wav",
		text: "Legal is happy. Your team is polishing resumes. Management approved.",
	},
	{
		filename: "feedback_hos_explainability_politics_left.wav",
		text: "Better accuracy now. Better fines later. Engineering owes you.",
	},
	{
		filename: "feedback_hos_explainability_politics_right.wav",
		text: "Engineering will resent you. Auditors will forget you. Compliance win.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_left.wav",
		text: "Career-limiting. Noble. Your team will follow you anywhere. VP less so.",
	},
	{
		filename: "feedback_hos_model_drift_team_blame_right.wav",
		text: "They warned you. You ignored it. Now you blame them. Classic management.",
	},
	{
		filename: "feedback_hos_prompt_injection_review_escape_left.wav",
		text: "VP annoyed. Senior resentful. But code is secure. Pick your pain.",
	},
	{
		filename: "feedback_hos_prompt_injection_review_escape_right.wav",
		text: "Senior owes you. Breach later will blame you. Lose-lose. Nice.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_left.wav",
		text: "Product will hate you. Your team will stay. Sometimes that's the win.",
	},
	{
		filename: "feedback_hos_team_burnout_deadline_right.wav",
		text: "Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_left.wav",
		text: "Great, now everyone wants their favorite AI tool. Governance is optional now.",
	},
	{
		filename: "feedback_shadow_ai_hos_2_right.wav",
		text: "Your best engineer just resigned. Compliance preserved. Output cratered.",
	},
];

function createWavFile(pcmData: Buffer): Buffer {
	const dataSize = pcmData.length;
	const buffer = Buffer.alloc(44 + dataSize);
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(24000, 24);
	buffer.writeUInt32LE(48000, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
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
	if (!base64Audio) throw new Error(`No audio data for ${filename}`);
	const pcmBuffer = Buffer.from(base64Audio, "base64");
	const wavBuffer = createWavFile(pcmBuffer);
	const outputPath = path.join(outputDir, filename);
	fs.writeFileSync(outputPath, wavBuffer);
	console.log(`Saved: ${filename} (${wavBuffer.length} bytes)`);
	await compressAudioFile(outputPath);
}

async function main() {
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices/roaster/feedback",
	);
	fs.mkdirSync(outputDir, { recursive: true });
	console.log("=== Regenerating Corrupted HoS Feedback Files ===\n");
	let success = 0,
		failed = 0;
	for (const file of CORRUPTED_HOS_FILES) {
		try {
			if (success > 0) await new Promise((r) => setTimeout(r, 1000));
			await generateVoiceFile(file.filename, file.text, outputDir);
			success++;
		} catch (e) {
			console.error(`Failed: ${file.filename}`, e);
			failed++;
		}
	}
	console.log(`\nDone: ${success} success, ${failed} failed`);
	if (failed > 0) process.exit(1);
}

main().catch(console.error);
