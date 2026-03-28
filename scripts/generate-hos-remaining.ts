import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import { delay, generateVoiceFile, initializeClient } from "./tts-utils";

const ai = initializeClient();

/**
 * The 10 remaining Head of Something cards that need voice feedback audio.
 * Each card has LEFT and RIGHT feedback text with label-slug filenames.
 */
const REMAINING_HOS_CARDS: Array<{
	id: string;
	leftSlug: string;
	rightSlug: string;
	leftText: string;
	rightText: string;
}> = [
	{
		id: "hos_prompt_injection_blame",
		leftSlug: "take-the-blame",
		rightSlug: "name-the-engineer",
		leftText:
			"Noble. Your team will work harder for you now. The VP will also blame you.",
		rightText:
			"Sacrificing your engineer to save yourself. Your team will remember this at their exit interviews.",
	},
	{
		id: "hos_model_drift_budget_conflict",
		leftSlug: "fight-for-budget",
		rightSlug: "ship-without-retraining",
		leftText: "Fighting the CFO. Brave. Possibly career-limiting. But brave.",
		rightText:
			"Your team knows you sold them out. The CFO owes you. Everyone loses.",
	},
	{
		id: "hos_delegation_gone_wrong",
		leftSlug: "defend-delegation",
		rightSlug: "admit-oversight-failure",
		leftText:
			"Taking the L. Your delegation authority will shrink. But you're honest.",
		rightText: "Denial is a strategy. Not a good one. But a strategy.",
	},
	{
		id: "hos_promotion_politics",
		leftSlug: "promote-best-performer",
		rightSlug: "promote-politically-connected",
		leftText: "Merit wins. Politics loses. Your VP is taking notes.",
		rightText:
			"Your best performer just learned meritocracy is a myth. The VP owes you.",
	},
	{
		id: "hos_prompt_injection_copilot_team",
		leftSlug: "pull-for-patching",
		rightSlug: "continue-development",
		leftText:
			"Deadline missed. Team secure. Product is angry. You sleep better.",
		rightText:
			"Friday release with vulnerable tools. What could go wrong? (Everything.)",
	},
	{
		id: "hos_model_drift_retrain_delay",
		leftSlug: "start-immediately",
		rightSlug: "delay-until-next-quarter",
		leftText:
			"Over budget now. Review at risk. But problem solved. Long-term thinking.",
		rightText:
			"Budget looks good this quarter. Model rots. Next quarter's problem!",
	},
	{
		id: "explainability_hos_1",
		leftSlug: "side-with-auditors",
		rightSlug: "side-with-engineering",
		leftText:
			"Engineering will resent you. Auditors will forget you. Compliance win.",
		rightText: "Better accuracy now. Better fines later. Engineering owes you.",
	},
	{
		id: "shadow_ai_hos_1",
		leftSlug: "shield-the-team",
		rightSlug: "give-names-to-compliance",
		leftText:
			"Team hero. Management headache. The loyalty is worth it until they fire you.",
		rightText:
			"Compliance is happy. Your team is updating LinkedIn. Management material right here.",
	},
	{
		id: "synthetic_data_hos_1",
		leftSlug: "take-the-blame",
		rightSlug: "name-the-data-scientist",
		leftText:
			"Noble. Your team will work harder for you now. The VP will also blame you.",
		rightText:
			"Sacrificing your best performer to save yourself. Your team will remember this at their exit interviews.",
	},
	{
		id: "synthetic_data_hos_2",
		leftSlug: "provide-full-documentation",
		rightSlug: "claim-poor-record-keeping",
		leftText:
			"Your team is exposed. But legal can actually defend you. There's a strategy here.",
		rightText:
			"'We didn't keep records' meets 'we have something to hide.' Prosecutors love this.",
	},
];

const OUTPUT_DIR = path.join(
	process.cwd(),
	"public/audio/voices/roaster/feedback",
);

async function generateAll() {
	console.log("=".repeat(60));
	console.log("Generating voice audio for 10 remaining HoS cards");
	console.log("=".repeat(60));
	console.log(`\nOutput directory: ${OUTPUT_DIR}`);
	console.log(`Cards to process: ${REMAINING_HOS_CARDS.length}`);
	console.log(
		`Total audio files: ${REMAINING_HOS_CARDS.length * 2} (LEFT + RIGHT each)\n`,
	);

	fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	let generatedCount = 0;
	let skippedCount = 0;
	let errorCount = 0;

	for (let i = 0; i < REMAINING_HOS_CARDS.length; i++) {
		const card = REMAINING_HOS_CARDS[i];
		console.log(`\n[${i + 1}/${REMAINING_HOS_CARDS.length}] ${card.id}`);

		try {
			// Generate LEFT feedback
			const leftFilename = `feedback_${card.id}_${card.leftSlug}.wav`;
			try {
				await generateVoiceFile(leftFilename, card.leftText, OUTPUT_DIR, ai, {
					skipExisting: true,
				});
				generatedCount++;
				await delay(500); // Small delay between API calls
			} catch {
				skippedCount++;
			}

			// Generate RIGHT feedback
			const rightFilename = `feedback_${card.id}_${card.rightSlug}.wav`;
			try {
				await generateVoiceFile(rightFilename, card.rightText, OUTPUT_DIR, ai, {
					skipExisting: true,
				});
				generatedCount++;
			} catch {
				skippedCount++;
			}
		} catch (error) {
			console.error(`  ❌ Error processing ${card.id}:`, error);
			errorCount++;
			// Continue with next card despite error
		}

		// Delay between cards to avoid rate limits
		if (i < REMAINING_HOS_CARDS.length - 1) {
			await delay(1000);
		}
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log("Generation complete!");
	console.log("=".repeat(60));
	console.log(`Generated: ${generatedCount} files`);
	console.log(`Skipped (existing): ${skippedCount} files`);
	console.log(`Errors: ${errorCount} files`);
}

generateAll().catch((error) => {
	console.error("Generation failed:", error);
	process.exit(1);
});
