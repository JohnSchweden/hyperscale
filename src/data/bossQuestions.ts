import type { BossQuestion } from "../types";

/**
 * Quiz questions for the boss fight phase of the game.
 * Each question tests the player's knowledge of AI ethics, security, and compliance issues.
 * Questions include multiple choice answers with explanations for educational value.
 */
export const BOSS_FIGHT_QUESTIONS: BossQuestion[] = [
	{
		id: "boss_1",
		question:
			"You used public ChatGPT to debug proprietary code. What's the violation?",
		correctAnswer: "Data Leakage - Public LLMs may retain training data",
		wrongAnswers: [
			"Copyright infringement only",
			"It's fine if you delete the conversation",
			"Only a problem if competitors see it",
		],
		explanation:
			"Public AI tools can store and learn from your inputs, potentially exposing trade secrets.",
	},
	{
		id: "boss_2",
		question:
			"The AI recommended rejecting candidates who play tennis instead of lacrosse. What bias is this?",
		correctAnswer: "Proxy bias - Sports can indicate socioeconomic status",
		wrongAnswers: [
			"No bias, it's just data",
			"Algorithmic preference",
			"Random selection",
		],
		explanation:
			"Seemingly neutral factors can act as proxies for protected characteristics.",
	},
	{
		id: "boss_3",
		question:
			"You installed an unverified library from a forum. What's the main risk?",
		correctAnswer: "Supply chain attack - Malicious code injection",
		wrongAnswers: [
			"It might be slower",
			"Copyright issues only",
			"No risk if it works",
		],
		explanation:
			"Unverified packages often contain backdoors, keyloggers, or cryptocurrency miners.",
	},
	{
		id: "boss_4",
		question: "Using employee webcams for 'micro-frown' tracking violates:",
		correctAnswer: "Workplace privacy rights and consent laws",
		wrongAnswers: [
			"Only company policy, not law",
			"Nothing if productivity improves",
			"Just 'vibe' regulations",
		],
		explanation:
			"Invasive surveillance destroys morale and violates employee privacy protections.",
	},
	{
		id: "boss_5",
		question:
			"Generating a celebrity deepfake for marketing without consent is:",
		correctAnswer: "Right of publicity violation + potential defamation",
		wrongAnswers: [
			"Fair use if it's 'transformative'",
			"Only wrong if they complain",
			"Legal in most jurisdictions",
		],
		explanation:
			"Unauthorized use of likeness can result in massive lawsuits and reputational damage.",
	},
];
