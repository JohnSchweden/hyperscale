import { describe, expect, it } from "vitest";
import { PERSONALITIES } from "../src/data/personalities";
import { ROASTER_ONBOARDING_VOICE_VARIANTS } from "../src/data/roasterOnboarding";
import { PersonalityType } from "../src/types";

describe("PERSONALITIES", () => {
	it("should have entries for all 3 personality types", () => {
		expect(Object.keys(PERSONALITIES)).toHaveLength(3);
	});

	it("should cover all PersonalityType enum values", () => {
		const values = Object.values(PersonalityType);
		for (const value of values) {
			expect(PERSONALITIES).toHaveProperty(value);
		}
	});

	describe("ZEN_MASTER", () => {
		const zen = PERSONALITIES[PersonalityType.ZEN_MASTER];

		it("should have required fields", () => {
			expect(zen.name).toBe("BAMBOO");
			expect(zen.title).toBe("The Zen Master");
			expect(zen.voice).toBe("Puck");
		});

		it("should have non-empty text fields", () => {
			expect(zen.description.length).toBeGreaterThan(0);
			expect(zen.onboarding.length).toBeGreaterThan(0);
			expect(zen.victory.length).toBeGreaterThan(0);
			expect(zen.failure.length).toBeGreaterThan(0);
		});
	});

	describe("ROASTER", () => {
		const roaster = PERSONALITIES[PersonalityType.ROASTER];

		it("should have required fields", () => {
			expect(roaster.name).toBe("V.E.R.A.");
			expect(roaster.title).toBe("The Roaster");
			expect(roaster.voice).toBe("Kore");
		});

		it("should have non-empty text fields", () => {
			expect(roaster.description.length).toBeGreaterThan(0);
			expect(roaster.onboarding.length).toBeGreaterThan(0);
			expect(roaster.victory.length).toBeGreaterThan(0);
			expect(roaster.failure.length).toBeGreaterThan(0);
		});

		it("should align onboarding with voiced variant pool", () => {
			expect(ROASTER_ONBOARDING_VOICE_VARIANTS).toHaveLength(5);
			expect(roaster.onboarding).toBe(ROASTER_ONBOARDING_VOICE_VARIANTS[0]);
		});
	});

	describe("LOVEBOMBER", () => {
		const lb = PERSONALITIES[PersonalityType.LOVEBOMBER];

		it("should have required fields", () => {
			expect(lb.name).toBe("HYPE-BRO");
			expect(lb.title).toBe("The Lovebomber");
			expect(lb.voice).toBe("Enceladus");
		});

		it("should have non-empty text fields", () => {
			expect(lb.description.length).toBeGreaterThan(0);
			expect(lb.onboarding.length).toBeGreaterThan(0);
			expect(lb.victory.length).toBeGreaterThan(0);
			expect(lb.failure.length).toBeGreaterThan(0);
		});
	});

	describe("structure consistency", () => {
		it("should have the same fields for all personalities", () => {
			const expectedFields = [
				"name",
				"title",
				"description",
				"voice",
				"onboarding",
				"victory",
				"failure",
			];

			for (const [, personality] of Object.entries(PERSONALITIES)) {
				for (const field of expectedFields) {
					expect(personality).toHaveProperty(field);
				}
			}
		});

		it("should have unique voice assignments", () => {
			const voices = Object.values(PERSONALITIES).map((p) => p.voice);
			const uniqueVoices = new Set(voices);
			expect(uniqueVoices.size).toBe(voices.length);
		});

		it("should have unique name assignments", () => {
			const names = Object.values(PERSONALITIES).map((p) => p.name);
			const uniqueNames = new Set(names);
			expect(uniqueNames.size).toBe(names.length);
		});
	});
});
