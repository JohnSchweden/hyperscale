import { describe, expect, it } from "vitest";
import { BOSS_FIGHT_QUESTIONS } from "../src/data";

describe("Boss Fight Questions Data", () => {
	describe("data integrity", () => {
		it("should have at least 5 questions", () => {
			expect(BOSS_FIGHT_QUESTIONS.length).toBeGreaterThanOrEqual(5);
		});

		it("should have unique IDs for all questions", () => {
			const ids = BOSS_FIGHT_QUESTIONS.map((q) => q.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});
	});

	describe("question structure", () => {
		it("should have required fields for all questions", () => {
			BOSS_FIGHT_QUESTIONS.forEach((question) => {
				expect(question).toHaveProperty("id");
				expect(question).toHaveProperty("question");
				expect(question).toHaveProperty("correctAnswer");
				expect(question).toHaveProperty("wrongAnswers");
				expect(question).toHaveProperty("explanation");
			});
		});

		it("should have non-empty question text", () => {
			BOSS_FIGHT_QUESTIONS.forEach((question) => {
				expect(question.question.length).toBeGreaterThan(0);
			});
		});

		it("should have exactly 3 wrong answers per question", () => {
			BOSS_FIGHT_QUESTIONS.forEach((question) => {
				expect(question.wrongAnswers).toHaveLength(3);
			});
		});

		it("should have non-empty answers", () => {
			BOSS_FIGHT_QUESTIONS.forEach((question) => {
				expect(question.correctAnswer.length).toBeGreaterThan(0);
				question.wrongAnswers.forEach((answer) => {
					expect(answer.length).toBeGreaterThan(0);
				});
			});
		});

		it("should have non-empty explanations", () => {
			BOSS_FIGHT_QUESTIONS.forEach((question) => {
				expect(question.explanation.length).toBeGreaterThan(0);
			});
		});
	});

	describe("content quality", () => {
		it("should cover different security/compliance topics", () => {
			const topics = BOSS_FIGHT_QUESTIONS.map((q) => q.question.toLowerCase());

			// Check that we have questions about different topics (robust matching with multiple keywords)
			// Data leakage / info disclosure topic
			const hasDataLeakage = topics.some(
				(t) =>
					t.includes("leak") ||
					t.includes("public") ||
					t.includes("chatgpt") ||
					t.includes("llm") ||
					t.includes("disclosure") ||
					t.includes("confidential") ||
					t.includes("sensitive"),
			);
			// Bias / discrimination topic
			const hasBias = topics.some(
				(t) =>
					t.includes("bias") ||
					t.includes("candidate") ||
					t.includes("sports") ||
					t.includes("socio") ||
					t.includes("discrimin") ||
					t.includes("fair"),
			);
			// Supply chain / dependency topic
			const hasSupplyChain = topics.some(
				(t) =>
					t.includes("library") ||
					t.includes("supply") ||
					t.includes("package") ||
					t.includes("forum") ||
					t.includes("dependency") ||
					t.includes("vulnerab"),
			);
			// Privacy / surveillance topic
			const hasPrivacy = topics.some(
				(t) =>
					t.includes("privacy") ||
					t.includes("webcam") ||
					t.includes("surveillance") ||
					t.includes("consent") ||
					t.includes("monitor") ||
					t.includes("tracking"),
			);
			// Deepfake / likeness topic
			const hasDeepfake = topics.some(
				(t) =>
					t.includes("deepfake") ||
					t.includes("celebrity") ||
					t.includes("likeness") ||
					t.includes("publicity") ||
					t.includes("impersonat"),
			);

			expect(hasDataLeakage).toBe(true);
			expect(hasBias).toBe(true);
			expect(hasSupplyChain).toBe(true);
			expect(hasPrivacy).toBe(true);
			expect(hasDeepfake).toBe(true);
		});

		it("should have diverse question structures", () => {
			// Verify structural diversity - questions should vary in length and complexity
			const questions = BOSS_FIGHT_QUESTIONS;
			const lengths = questions.map((q) => q.question.length);
			const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

			// Average length should be reasonable (not all short or all long)
			expect(avgLength).toBeGreaterThan(20);

			// Should have some variance in question length (diverse content)
			const variance =
				lengths.reduce((sum, len) => sum + (len - avgLength) ** 2, 0) /
				lengths.length;
			expect(variance).toBeGreaterThan(10);
		});

		it("should have educational explanations", () => {
			BOSS_FIGHT_QUESTIONS.forEach((question) => {
				// Explanations should be informative (at least 20 chars)
				expect(question.explanation.length).toBeGreaterThan(20);
			});
		});
	});
});
