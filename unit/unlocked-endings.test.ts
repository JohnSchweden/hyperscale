import { describe, expect, it } from "vitest";
import { getUnlockProgress } from "../hooks/useUnlockedEndings";
import type { DeathType } from "../types";

describe("getUnlockProgress", () => {
	const totalCount = 6;

	describe("count calculation", () => {
		it("should return 0/6 when no endings unlocked", () => {
			const result = getUnlockProgress([]);
			expect(result.unlockedCount).toBe(0);
			expect(result.totalCount).toBe(totalCount);
		});

		it("should return correct count for single unlocked ending", () => {
			const result = getUnlockProgress(["BANKRUPT"] as DeathType[]);
			expect(result.unlockedCount).toBe(1);
			expect(result.totalCount).toBe(totalCount);
		});

		it("should return correct count for multiple unlocked endings", () => {
			const result = getUnlockProgress([
				"BANKRUPT",
				"PRISON",
				"CONGRESS",
			] as DeathType[]);
			expect(result.unlockedCount).toBe(3);
		});

		it("should return 6/6 when all endings unlocked", () => {
			const result = getUnlockProgress([
				"BANKRUPT",
				"REPLACED_BY_SCRIPT",
				"CONGRESS",
				"FLED_COUNTRY",
				"PRISON",
				"AUDIT_FAILURE",
			] as DeathType[]);
			expect(result.unlockedCount).toBe(6);
		});
	});

	describe("progress text generation", () => {
		it("should show first-time message for 0 unlocked", () => {
			const result = getUnlockProgress([]);
			expect(result.progressText).toContain("1/6");
			expect(result.progressText).toMatch(/first|unlock/i);
		});

		it("should show encouragement for 1 unlocked", () => {
			const result = getUnlockProgress(["BANKRUPT"] as DeathType[]);
			expect(result.progressText).toContain("1/6");
			expect(result.progressText).toMatch(
				/try again|see what else|more to discover/i,
			);
		});

		it("should show progress for 5 unlocked", () => {
			const result = getUnlockProgress([
				"BANKRUPT",
				"REPLACED_BY_SCRIPT",
				"CONGRESS",
				"FLED_COUNTRY",
				"PRISON",
			] as DeathType[]);
			expect(result.progressText).toContain("5/6");
			expect(result.progressText).toMatch(/one more|almost|so close/i);
		});

		it("should show celebration for all 6 unlocked", () => {
			const result = getUnlockProgress([
				"BANKRUPT",
				"REPLACED_BY_SCRIPT",
				"CONGRESS",
				"FLED_COUNTRY",
				"PRISON",
				"AUDIT_FAILURE",
			] as DeathType[]);
			expect(result.progressText).toContain("6/6");
			expect(result.progressText).toMatch(/all|complete|impressive|master/i);
		});
	});

	describe("text characteristics", () => {
		it("should use encouraging, personality-agnostic language", () => {
			const result = getUnlockProgress(["BANKRUPT"] as DeathType[]);
			// Should be positive/encouraging
			expect(result.progressText).not.toMatch(/fail|bad|terrible|awful/i);
			// Should mention trying again
			expect(result.progressText).toMatch(/try|again|replay|discover/i);
		});

		it("should not be empty", () => {
			const result = getUnlockProgress([]);
			expect(result.progressText.length).toBeGreaterThan(0);
		});
	});
});
