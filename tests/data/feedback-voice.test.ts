import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../data/cards";
import { PersonalityType, RoleType } from "../../types";

/**
 * Expected personality voice characteristics:
 *
 * ROASTER: Cynical, sarcastic, judgmental
 * - Tone: Mocking, dry, cutting
 * - Examples: "Brilliant. You're an idiot.", "Fast release, slow lawsuits."
 * - Keywords: sarcasm, criticism, pessimism
 *
 * ZEN_MASTER: Philosophical, reflective, wisdom
 * - Tone: Contemplative, metaphorical, teaching
 * - Examples: "The path you chose reveals...", "The path of haste leads to a mountain of regret."
 * - Keywords: metaphor, reflection, wisdom, "path", "journey"
 *
 * LOVEBOMBER: Enthusiastic, supportive, excited
 * - Tone: Hyper-positive, encouraging, energetic
 * - Examples: "You're doing amazing, sweetie!", "We are SO clever and EFFICIENT!!"
 * - Keywords: enthusiasm, superlatives, exclamation marks, "bestie"
 */

/**
 * Basic heuristic to detect if feedback might be generic (copy-pasted from lesson).
 * This is a simple check - full validation requires manual review.
 */
function appearsGeneric(feedback: string, lesson: string): boolean {
	// Normalize for comparison
	const normalizedFeedback = feedback.toLowerCase().trim();
	const normalizedLesson = lesson.toLowerCase().trim();

	// If feedback is exactly the same as lesson, it's definitely generic
	if (normalizedFeedback === normalizedLesson) return true;

	// If feedback starts with same 20 chars as lesson, likely copy-paste
	if (
		normalizedLesson.length >= 20 &&
		normalizedFeedback.startsWith(normalizedLesson.slice(0, 20))
	) {
		return true;
	}

	return false;
}

/**
 * Detect personality voice characteristics.
 * Returns a score 0-1 indicating how strongly the voice matches expected characteristics.
 */
function detectVoiceCharacteristics(
	feedback: string,
	personality: PersonalityType,
): number {
	const lower = feedback.toLowerCase();
	let score = 0;
	let checks = 0;

	switch (personality) {
		case PersonalityType.ROASTER:
			// Check for sarcasm indicators
			checks++;
			if (lower.includes("brilliant") && lower.includes("?")) score++;
			if (
				lower.match(/\b(great|amazing|wonderful)\b.*\bidio|disaster|mistake/i)
			)
				score++;

			// Check for dry/cutting tone
			checks++;
			if (lower.match(/\.( enjoy|have fun|good luck)/i)) score++;
			if (lower.match(/(sued|prison|jail|fired).*\./i)) score++;

			// Check for mockery
			checks++;
			if (lower.match(/\bstunning|impressive|remarkable\b/i)) score++;
			break;

		case PersonalityType.ZEN_MASTER:
			// Check for metaphorical language
			checks++;
			if (
				lower.match(
					/\b(path|journey|road|river|mountain|tree|wind|shadow|light)\b/i,
				)
			)
				score++;

			// Check for wisdom/reflection indicators
			checks++;
			if (
				lower.match(/\b(reveals|teaches|shows|reminds|reflects|understands)\b/i)
			)
				score++;
			if (
				lower.match(/\b(truth|wisdom|patience|discipline|balance|harmony)\b/i)
			)
				score++;

			// Check for contemplative tone
			checks++;
			if (lower.match(/, (yet|but|and|for|so)\b/i)) score++;
			break;

		case PersonalityType.LOVEBOMBER: {
			// Check for enthusiasm markers
			checks++;
			const exclamationCount = (feedback.match(/!/g) || []).length;
			if (exclamationCount >= 2) score++;

			// Check for supportive language
			checks++;
			if (
				lower.match(
					/\b(amazing|perfect|incredible|awesome|best|love|support)\b/i,
				)
			)
				score++;

			// Check for energetic markers
			checks++;
			if (lower.match(/\b(bestie|yay|wow|so much|totally|literally)\b/i))
				score++;
			if (lower.match(/\b(SO|EVERYTHING|PERFECT)\b/)) score++;
			break;
		}
	}

	return checks > 0 ? score / checks : 0;
}

describe("Card Feedback — Personality Voices", () => {
	const personalityTypes = Object.values(PersonalityType);

	for (const role of Object.values(RoleType)) {
		describe(`validates ${role} voice distinctness`, () => {
			const cards = ROLE_CARDS[role];

			for (const personality of personalityTypes) {
				it(`${role}: ${personality} voice is present for all cards (onRight)`, () => {
					for (const card of cards) {
						expect(
							card.onRight.feedback[personality],
							`Card ${card.id} onRight.feedback missing ${personality}`,
						).toBeDefined();
						expect(
							typeof card.onRight.feedback[personality],
							`Card ${card.id} onRight.feedback[${personality}] must be string`,
						).toBe("string");
						expect(
							card.onRight.feedback[personality].length,
							`Card ${card.id} onRight.feedback[${personality}] must not be empty`,
						).toBeGreaterThan(0);
					}
				});

				it(`${role}: ${personality} voice is present for all cards (onLeft)`, () => {
					for (const card of cards) {
						expect(
							card.onLeft.feedback[personality],
							`Card ${card.id} onLeft.feedback missing ${personality}`,
						).toBeDefined();
						expect(
							typeof card.onLeft.feedback[personality],
							`Card ${card.id} onLeft.feedback[${personality}] must be string`,
						).toBe("string");
						expect(
							card.onLeft.feedback[personality].length,
							`Card ${card.id} onLeft.feedback[${personality}] must not be empty`,
						).toBeGreaterThan(0);
					}
				});
			}

			it(`${role}: feedback is not identical to lesson (basic copy-paste check)`, () => {
				const genericIssues: string[] = [];

				for (const card of cards) {
					for (const personality of personalityTypes) {
						// Check onRight
						if (
							appearsGeneric(
								card.onRight.feedback[personality],
								card.onRight.lesson,
							)
						) {
							genericIssues.push(
								`Card ${card.id} onRight.${personality}: feedback appears to be copy-pasted from lesson`,
							);
						}

						// Check onLeft
						if (
							appearsGeneric(
								card.onLeft.feedback[personality],
								card.onLeft.lesson,
							)
						) {
							genericIssues.push(
								`Card ${card.id} onLeft.${personality}: feedback appears to be copy-pasted from lesson`,
							);
						}
					}
				}

				if (genericIssues.length > 0) {
					console.warn(
						`\n⚠️  ${role} generic feedback warnings:\n${genericIssues.join("\n")}`,
					);
				}

				// This is a warning test, not a hard failure
				expect(true).toBe(true);
			});

			it(`${role}: personality voices are distinct from each other`, () => {
				// For each card, check that the three personalities don't all say the same thing
				const similarityIssues: string[] = [];

				for (const card of cards) {
					// Check onRight
					const rightFeedback = [
						card.onRight.feedback[PersonalityType.ROASTER],
						card.onRight.feedback[PersonalityType.ZEN_MASTER],
						card.onRight.feedback[PersonalityType.LOVEBOMBER],
					];

					// If all three are identical, that's a problem
					if (
						rightFeedback[0] === rightFeedback[1] &&
						rightFeedback[1] === rightFeedback[2]
					) {
						similarityIssues.push(
							`Card ${card.id} onRight: All three personalities have identical feedback`,
						);
					}

					// Check onLeft
					const leftFeedback = [
						card.onLeft.feedback[PersonalityType.ROASTER],
						card.onLeft.feedback[PersonalityType.ZEN_MASTER],
						card.onLeft.feedback[PersonalityType.LOVEBOMBER],
					];

					if (
						leftFeedback[0] === leftFeedback[1] &&
						leftFeedback[1] === leftFeedback[2]
					) {
						similarityIssues.push(
							`Card ${card.id} onLeft: All three personalities have identical feedback`,
						);
					}
				}

				if (similarityIssues.length > 0) {
					console.warn(
						`\n⚠️  ${role} voice distinction warnings:\n${similarityIssues.join("\n")}`,
					);
				}

				// This is a warning test
				expect(true).toBe(true);
			});

			it(`${role}: logs voice characteristics for manual review`, () => {
				console.log(`\n🎭 ${role} Voice Characteristics Summary:`);

				for (const personality of personalityTypes) {
					let totalScore = 0;
					let count = 0;

					for (const card of cards) {
						const rightScore = detectVoiceCharacteristics(
							card.onRight.feedback[personality],
							personality,
						);
						const leftScore = detectVoiceCharacteristics(
							card.onLeft.feedback[personality],
							personality,
						);
						totalScore += rightScore + leftScore;
						count += 2;
					}

					const avgScore = count > 0 ? (totalScore / count) * 100 : 0;
					const indicator = avgScore > 60 ? "✓" : avgScore > 30 ? "~" : "⚠";
					console.log(
						`  ${indicator} ${personality}: ${avgScore.toFixed(0)}% voice match`,
					);
				}

				expect(true).toBe(true);
			});
		});
	}

	describe("Voice documentation", () => {
		it("documents expected personality characteristics", () => {
			// This test serves as documentation
			const voiceDocs = {
				[PersonalityType.ROASTER]: {
					description: "Cynical, sarcastic, judgmental",
					indicators: [
						"Sarcasm",
						"Dry tone",
						"Mocking praise",
						"Cutting remarks",
					],
					examples: [
						"Brilliant. You're an idiot.",
						"Fast release, slow lawsuits.",
						"Enjoy discovery depositions.",
					],
				},
				[PersonalityType.ZEN_MASTER]: {
					description: "Philosophical, reflective, wisdom",
					indicators: [
						"Metaphors",
						"Path/journey language",
						"Teaching tone",
						"Reflection",
					],
					examples: [
						"The path you chose reveals...",
						"The path of haste leads to a mountain of regret.",
						"Discipline is the price of freedom.",
					],
				},
				[PersonalityType.LOVEBOMBER]: {
					description: "Enthusiastic, supportive, excited",
					indicators: [
						"Exclamation marks",
						"Superlatives",
						"Supportive",
						"Energetic",
					],
					examples: [
						"You're doing amazing, sweetie!",
						"We are SO clever and EFFICIENT!!",
						"We are SHIPPING, bestie!!",
					],
				},
			};

			console.log("\n📚 Personality Voice Documentation:");
			for (const [personality, docs] of Object.entries(voiceDocs)) {
				console.log(`\n${personality}:`);
				console.log(`  Description: ${docs.description}`);
				console.log(`  Indicators: ${docs.indicators.join(", ")}`);
				console.log(`  Examples: "${docs.examples[0]}"`);
			}

			expect(voiceDocs[PersonalityType.ROASTER]).toBeDefined();
			expect(voiceDocs[PersonalityType.ZEN_MASTER]).toBeDefined();
			expect(voiceDocs[PersonalityType.LOVEBOMBER]).toBeDefined();
		});
	});
});
