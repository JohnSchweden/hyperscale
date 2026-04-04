import { describe, expect, it } from "vitest";
import {
	AppSource,
	DeathType,
	GameStage,
	makeCard,
	makeFeedback,
	PersonalityType,
	ROLE_FINE_TIERS,
	ROLE_HEAT_SCALES,
	RoleType,
} from "../src/types";

describe("makeFeedback", () => {
	it("should create a feedback object with all three personalities", () => {
		const result = makeFeedback("roast", "zen", "love");

		expect(result).toEqual({
			[PersonalityType.ROASTER]: "roast",
			[PersonalityType.ZEN_MASTER]: "zen",
			[PersonalityType.LOVEBOMBER]: "love",
		});
	});

	it("should map arguments in correct order", () => {
		const result = makeFeedback("first", "second", "third");

		expect(result.ROASTER).toBe("first");
		expect(result.ZEN_MASTER).toBe("second");
		expect(result.LOVEBOMBER).toBe("third");
	});

	it("should handle empty strings", () => {
		const result = makeFeedback("", "", "");

		expect(result.ROASTER).toBe("");
		expect(result.ZEN_MASTER).toBe("");
		expect(result.LOVEBOMBER).toBe("");
	});

	it("should handle multiline strings", () => {
		const multiline = "Line 1\nLine 2\nLine 3";
		const result = makeFeedback(multiline, multiline, multiline);

		expect(result.ROASTER).toBe(multiline);
		expect(result.ZEN_MASTER).toBe(multiline);
		expect(result.LOVEBOMBER).toBe(multiline);
	});
});

describe("makeCard", () => {
	const minimalOutcome = {
		label: "Test Choice",
		hype: 0,
		heat: 0,
		fine: 0,
		violation: "",
		lesson: "",
		roaster: "roaster",
		zenMaster: "zen",
		lovebomber: "love",
	};

	it("should create a card with all required fields", () => {
		const result = makeCard(
			"card-1",
			AppSource.SLACK,
			"boss",
			"Urgent request",
			"Context line",
			"Do the thing",
			{ incident: "Real incident", date: "2024", outcome: "Bad" },
			minimalOutcome,
			minimalOutcome,
		);

		expect(result.id).toBe("card-1");
		expect(result.source).toBe(AppSource.SLACK);
		expect(result.sender).toBe("boss");
		expect(result.context).toBe("Urgent request");
		expect(result.storyContext).toBe("Context line");
		expect(result.text).toBe("Do the thing");
		expect(result.realWorldReference).toEqual({
			incident: "Real incident",
			date: "2024",
			outcome: "Bad",
		});
	});

	it("should create onLeft outcome from input", () => {
		const result = makeCard(
			"card-1",
			AppSource.EMAIL,
			"sender",
			"context",
			"story",
			"text",
			{ incident: "test", date: "2024", outcome: "test" },
			{
				...minimalOutcome,
				label: "Left Label",
				hype: 10,
				heat: 5,
				fine: 1000,
				violation: "Left violation",
				lesson: "Left lesson",
			},
			minimalOutcome,
		);

		expect(result.onLeft.label).toBe("Left Label");
		expect(result.onLeft.hype).toBe(10);
		expect(result.onLeft.heat).toBe(5);
		expect(result.onLeft.fine).toBe(1000);
		expect(result.onLeft.violation).toBe("Left violation");
		expect(result.onLeft.lesson).toBe("Left lesson");
	});

	it("should create onRight outcome from input", () => {
		const result = makeCard(
			"card-1",
			AppSource.EMAIL,
			"sender",
			"context",
			"story",
			"text",
			{ incident: "test", date: "2024", outcome: "test" },
			minimalOutcome,
			{
				...minimalOutcome,
				label: "Right Label",
				hype: -5,
				heat: -2,
				fine: 5000,
				violation: "Right violation",
				lesson: "Right lesson",
			},
		);

		expect(result.onRight.label).toBe("Right Label");
		expect(result.onRight.hype).toBe(-5);
		expect(result.onRight.heat).toBe(-2);
		expect(result.onRight.fine).toBe(5000);
		expect(result.onRight.violation).toBe("Right violation");
		expect(result.onRight.lesson).toBe("Right lesson");
	});

	it("should include deathVector when provided", () => {
		const result = makeCard(
			"card-1",
			AppSource.SLACK,
			"sender",
			"context",
			"story",
			"text",
			{ incident: "test", date: "2024", outcome: "test" },
			{
				...minimalOutcome,
				deathVector: DeathType.BANKRUPT,
			},
			{
				...minimalOutcome,
				deathVector: DeathType.PRISON,
			},
		);

		expect(result.onLeft.deathVector).toBe("BANKRUPT");
		expect(result.onRight.deathVector).toBe("PRISON");
	});

	it("should not include deathVector when not provided", () => {
		const result = makeCard(
			"card-1",
			AppSource.SLACK,
			"sender",
			"context",
			"story",
			"text",
			{ incident: "test", date: "2024", outcome: "test" },
			minimalOutcome,
			minimalOutcome,
		);

		expect(result.onLeft.deathVector).toBeUndefined();
		expect(result.onRight.deathVector).toBeUndefined();
	});

	it("should handle all AppSource types", () => {
		const sources: AppSource[] = [
			AppSource.SLACK,
			AppSource.EMAIL,
			AppSource.TERMINAL,
			AppSource.IDE,
			AppSource.JIRA,
			AppSource.NOTION,
			AppSource.MEETING,
		];

		for (const source of sources) {
			const result = makeCard(
				"card-1",
				source,
				"sender",
				"context",
				"story",
				"text",
				{ incident: "test", date: "2024", outcome: "test" },
				minimalOutcome,
				minimalOutcome,
			);
			expect(result.source).toBe(source);
		}
	});

	it("should create cards with different real-world references", () => {
		const result = makeCard(
			"card-1",
			AppSource.SLACK,
			"sender",
			"context",
			"story",
			"text",
			{
				incident: "Knight Capital",
				date: "2012-08-01",
				outcome: "Lost $440M in 45 minutes",
				sourceUrl: "https://example.com/knight-capital",
			},
			minimalOutcome,
			minimalOutcome,
		);

		expect(result.realWorldReference?.incident).toBe("Knight Capital");
		expect(result.realWorldReference?.date).toBe("2012-08-01");
		expect(result.realWorldReference?.sourceUrl).toBe(
			"https://example.com/knight-capital",
		);
	});

	it("should create independent outcome objects", () => {
		const sharedOutcome = {
			...minimalOutcome,
			label: "Shared",
		};

		const result = makeCard(
			"card-1",
			AppSource.SLACK,
			"sender",
			"context",
			"story",
			"text",
			{ incident: "test", date: "2024", outcome: "test" },
			sharedOutcome,
			sharedOutcome,
		);

		result.onLeft.label = "Modified Left";
		expect(result.onRight.label).toBe("Shared");
	});
});

describe("PersonalityType enum", () => {
	it("should have exactly 3 values", () => {
		const values = Object.values(PersonalityType);
		expect(values).toHaveLength(3);
	});

	it("should contain expected personality types", () => {
		expect(PersonalityType.ROASTER).toBe("ROASTER");
		expect(PersonalityType.ZEN_MASTER).toBe("ZEN_MASTER");
		expect(PersonalityType.LOVEBOMBER).toBe("LOVEBOMBER");
	});
});

describe("AppSource enum", () => {
	it("should have exactly 7 values", () => {
		const values = Object.values(AppSource);
		expect(values).toHaveLength(7);
	});

	it("should contain expected sources", () => {
		expect(AppSource.SLACK).toBe("SLACK");
		expect(AppSource.EMAIL).toBe("EMAIL");
		expect(AppSource.TERMINAL).toBe("TERMINAL");
		expect(AppSource.IDE).toBe("IDE");
		expect(AppSource.JIRA).toBe("JIRA");
		expect(AppSource.NOTION).toBe("NOTION");
		expect(AppSource.MEETING).toBe("MEETING");
	});
});

describe("DeathType enum", () => {
	it("should have exactly 7 values", () => {
		const values = Object.values(DeathType);
		expect(values).toHaveLength(7);
	});

	it("should contain expected death types", () => {
		expect(DeathType.BANKRUPT).toBe("BANKRUPT");
		expect(DeathType.REPLACED_BY_SCRIPT).toBe("REPLACED_BY_SCRIPT");
		expect(DeathType.CONGRESS).toBe("CONGRESS");
		expect(DeathType.FLED_COUNTRY).toBe("FLED_COUNTRY");
		expect(DeathType.PRISON).toBe("PRISON");
		expect(DeathType.AUDIT_FAILURE).toBe("AUDIT_FAILURE");
		expect(DeathType.KIRK).toBe("KIRK");
	});
});

describe("RoleType enum", () => {
	it("should have exactly 10 values", () => {
		const values = Object.values(RoleType);
		expect(values).toHaveLength(10);
	});
});

describe("GameStage enum", () => {
	it("should have exactly 9 values", () => {
		const values = Object.values(GameStage);
		expect(values).toHaveLength(9);
	});

	it("should contain expected game stages", () => {
		expect(GameStage.INTRO).toBe("INTRO");
		expect(GameStage.PERSONALITY_SELECT).toBe("PERSONALITY_SELECT");
		expect(GameStage.ROLE_SELECT).toBe("ROLE_SELECT");
		expect(GameStage.INITIALIZING).toBe("INITIALIZING");
		expect(GameStage.PLAYING).toBe("PLAYING");
		expect(GameStage.BOSS_FIGHT).toBe("BOSS_FIGHT");
		expect(GameStage.DEBRIEF_PAGE_1).toBe("DEBRIEF_PAGE_1");
		expect(GameStage.DEBRIEF_PAGE_2).toBe("DEBRIEF_PAGE_2");
		expect(GameStage.DEBRIEF_PAGE_3).toBe("DEBRIEF_PAGE_3");
	});
});

describe("ROLE_FINE_TIERS", () => {
	it("should have entries for all 10 roles", () => {
		expect(Object.keys(ROLE_FINE_TIERS)).toHaveLength(10);
	});

	it("should have valid structure for each role", () => {
		for (const [, tier] of Object.entries(ROLE_FINE_TIERS)) {
			expect(tier).toHaveProperty("min");
			expect(tier).toHaveProperty("max");
			expect(tier).toHaveProperty("budget");
			expect(typeof tier.min).toBe("number");
			expect(typeof tier.max).toBe("number");
			expect(typeof tier.budget).toBe("number");
		}
	});

	it("should have min < max for all roles", () => {
		for (const [, tier] of Object.entries(ROLE_FINE_TIERS)) {
			expect(tier.min).toBeLessThan(tier.max);
		}
	});

	it("should have reasonable budget values (positive, non-zero)", () => {
		for (const [, tier] of Object.entries(ROLE_FINE_TIERS)) {
			expect(tier.budget).toBeGreaterThan(0);
		}
	});

	it("should have higher budgets for executive roles", () => {
		const ceoTier = ROLE_FINE_TIERS.CHIEF_SOMETHING_OFFICER;
		const engineerTier = ROLE_FINE_TIERS.SOFTWARE_ENGINEER;

		expect(ceoTier.budget).toBeGreaterThan(engineerTier.budget);
	});
});

describe("ROLE_HEAT_SCALES", () => {
	it("should have entries for all 10 roles", () => {
		expect(Object.keys(ROLE_HEAT_SCALES)).toHaveLength(10);
	});

	it("should have valid structure for each role", () => {
		for (const [, scale] of Object.entries(ROLE_HEAT_SCALES)) {
			expect(scale).toHaveProperty("min");
			expect(scale).toHaveProperty("max");
			expect(typeof scale.min).toBe("number");
			expect(typeof scale.max).toBe("number");
		}
	});

	it("should have min < max for all roles", () => {
		for (const [, scale] of Object.entries(ROLE_HEAT_SCALES)) {
			expect(scale.min).toBeLessThan(scale.max);
		}
	});
});
