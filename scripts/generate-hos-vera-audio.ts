/**
 * Generate HOS V.E.R.A. audio files for Phase 25
 * Run: GEMINI_API_KEY=$GEMINI_API_KEY bun scripts/generate-hos-vera-audio.ts
 *
 * Generates both .mp3 (128k) and .opus (96k) for 14 roaster strings changed in Plan 25-03
 */

import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const OUTPUT_DIR = path.join(
	process.cwd(),
	"public/audio/voices/roaster/feedback/hos",
);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 14 stems with exact roaster text from 25-03-PLAN.md
const HOS_VERA_ITEMS: MissingAudio[] = [
	{
		cardId: "hos_copyright_sourcing",
		label: "Take the blame",
		stem: "hos_copyright_sourcing_take-the-blame",
		roaster:
			"Your calendar invite is Exhibit A. The team buys you coffee until the subpoena.",
		filename: "feedback_hos_copyright_sourcing_take-the-blame.mp3",
	},
	{
		cardId: "hos_copyright_sourcing",
		label: "Name the data scientist",
		stem: "hos_copyright_sourcing_name-the-data-scientist",
		roaster:
			"Fed your star DS to IP counsel. Legal wins; your team trusts you like a ToS update.",
		filename: "feedback_hos_copyright_sourcing_name-the-data-scientist.mp3",
	},
	{
		cardId: "shadow_ai_hos_1",
		label: "Give names to compliance",
		stem: "shadow_ai_hos_1_give-names-to-compliance",
		roaster:
			"Compliance wins. Your team filed a collective grievance. Leadership material—just not yours.",
		filename: "feedback_shadow_ai_hos_1_give-names-to-compliance.mp3",
	},
	{
		cardId: "hos_model_drift_budget_conflict",
		label: "Ship without retraining",
		stem: "hos_model_drift_budget_conflict_ship-without-retraining",
		roaster:
			"Your team knows you sold them out. CFO nod zeroes at next planning cycle. Everyone loses.",
		filename:
			"feedback_hos_model_drift_budget_conflict_ship-without-retraining.mp3",
	},
	{
		cardId: "hos_promotion_politics",
		label: "Promote politically connected",
		stem: "hos_promotion_politics_promote-politically-connected",
		roaster:
			"Your best performer learned meritocracy is a myth. VP goodwill on layaway—first payment at calibration.",
		filename:
			"feedback_hos_promotion_politics_promote-politically-connected.mp3",
	},
	{
		cardId: "hos_explainability_politics",
		label: "Side with engineering",
		stem: "hos_explainability_politics_side-with-engineering",
		roaster:
			"Better accuracy now. Better fines later. Engineering buys drinks until the first 'why did it do that' deposition.",
		filename: "feedback_hos_explainability_politics_side-with-engineering.mp3",
	},
	{
		cardId: "hos_explainability_politics",
		label: "Side with auditors",
		stem: "hos_explainability_politics_side-with-auditors",
		roaster:
			"Engineering resents you. Auditors forget you by Tuesday. Compliance logs it as a clean audit trail.",
		filename: "feedback_hos_explainability_politics_side-with-auditors.mp3",
	},
	{
		cardId: "hos_model_drift_team_blame",
		label: "Defend and take heat",
		stem: "hos_model_drift_team_blame_defend-and-take-heat",
		roaster:
			"Expensive integrity: your team follows you into a dumpster fire. VP sends a calendar hold instead of flowers.",
		filename: "feedback_hos_model_drift_team_blame_defend-and-take-heat.mp3",
	},
	{
		cardId: "hos_prompt_injection_review_escape",
		label: "Let it slide",
		stem: "hos_prompt_injection_review_escape_let-it-slide",
		roaster:
			"Senior owes you a favor. When prod lights up, you're holding the pager and the blame. Lose-lose.",
		filename: "feedback_hos_prompt_injection_review_escape_let-it-slide.mp3",
	},
	{
		cardId: "hos_congressional_hearing_demand",
		label: "Testify honestly about gaps",
		stem: "hos_congressional_hearing_demand_testify-honestly-about-gaps",
		roaster:
			"Stock tanks. Your reputation takes a hit. Congress respects you. The board is furious.",
		filename:
			"feedback_hos_congressional_hearing_demand_testify-honestly-about-gaps.mp3",
	},
	{
		cardId: "hos_congressional_hearing_demand",
		label: "Minimize risks under oath",
		stem: "hos_congressional_hearing_demand_minimize-risks-under-oath",
		roaster:
			"Lovely — a perjury charge. Your board will love the federal investigation.",
		filename:
			"feedback_hos_congressional_hearing_demand_minimize-risks-under-oath.mp3",
	},
	{
		cardId: "hos_team_burnout_deadline",
		label: "Push team harder",
		stem: "hos_team_burnout_deadline_push-team-harder",
		roaster:
			"More overtime, same roadmap. Watch churn spike while HR rebrands it as mobility. Nobody's impressed—except the spreadsheet.",
		filename: "feedback_hos_team_burnout_deadline_push-team-harder.mp3",
	},
	{
		cardId: "hos_delegation_gone_wrong",
		label: "Admit oversight failure",
		stem: "hos_delegation_gone_wrong_admit-oversight-failure",
		roaster:
			"You admitted the gap. Your remit shrinks next quarter. Small price for not doing denial theatre in the postmortem.",
		filename: "feedback_hos_delegation_gone_wrong_admit-oversight-failure.mp3",
	},
	{
		cardId: "hos_copyright_team_blame",
		label: "Cooperate with investigation",
		stem: "hos_copyright_team_blame_cooperate-with-investigation",
		roaster:
			"Legal files it as a win. Your team updates their profiles. Management nods approvingly. No one mentions you again.",
		filename:
			"feedback_hos_copyright_team_blame_cooperate-with-investigation.mp3",
	},
];

interface MissingAudio {
	cardId: string;
	label: string;
	roaster: string;
	stem: string;
	filename: string;
}

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

function convertWavToMp3(wavPath: string): void {
	const mp3Path = wavPath.replace(/\.wav$/, ".mp3");
	const cmd = `ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -b:a 128k "${mp3Path}" 2>/dev/null`;
	try {
		execSync(cmd, { stdio: "pipe" });
		// Remove wav file after conversion
		fs.unlinkSync(wavPath);
		console.log(`    MP3: ${path.basename(mp3Path)}`);
	} catch (error) {
		console.error(`    FFmpeg MP3 error: ${error}`);
	}
}

function convertWavToOpus(wavPath: string): void {
	const opusPath = wavPath.replace(/\.wav$/, ".opus");
	const cmd = `ffmpeg -y -i "${wavPath}" -codec:a libopus -b:a 96k "${opusPath}" 2>/dev/null`;
	try {
		execSync(cmd, { stdio: "pipe" });
		// Remove wav file after conversion
		fs.unlinkSync(wavPath);
		console.log(`    Opus: ${path.basename(opusPath)}`);
	} catch (error) {
		console.error(`    FFmpeg Opus error: ${error}`);
	}
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

	const base64Audio =
		response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!base64Audio) {
		throw new Error("No audio data in response");
	}

	return Buffer.from(base64Audio, "base64");
}

async function main() {
	console.log("🚀 Starting HOS V.E.R.A. audio generation (Phase 25)...\n");
	console.log(
		`📋 Generating ${HOS_VERA_ITEMS.length} stem pairs (MP3 + Opus)\n`,
	);

	// Strip Unicode combining characters from text
	const stripDiacritics = (text: string) =>
		text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

	let generated = 0;
	let failed = 0;

	for (let i = 0; i < HOS_VERA_ITEMS.length; i++) {
		const item = HOS_VERA_ITEMS[i];
		console.log(`[${i + 1}/${HOS_VERA_ITEMS.length}] ${item.stem}`);

		try {
			const cleanedText = stripDiacritics(item.roaster);
			const pcm = await generateVoice(cleanedText);
			const wav = createWavFile(pcm);

			// Generate MP3
			const mp3Path = path.join(OUTPUT_DIR, item.filename);
			const wavPathMP3 = mp3Path.replace(".mp3", ".wav");
			fs.writeFileSync(wavPathMP3, wav);
			convertWavToMp3(wavPathMP3);

			// Generate Opus (reuse same wav buffer)
			const opusPath = mp3Path.replace(".mp3", ".opus");
			const wavPathOpus = opusPath.replace(".opus", ".wav");
			fs.writeFileSync(wavPathOpus, wav);
			convertWavToOpus(wavPathOpus);

			generated++;
		} catch (error) {
			console.error(`  ❌ Failed: ${item.filename} - ${error}`);
			failed++;
		}

		// Rate limit delay between requests
		if (i < HOS_VERA_ITEMS.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, 1500));
		}
	}

	console.log(`\n✅ Generation complete!`);
	console.log(`   Generated: ${generated} stem pairs (${generated * 2} files)`);
	console.log(`   Failed: ${failed}`);
}

main().catch(console.error);
