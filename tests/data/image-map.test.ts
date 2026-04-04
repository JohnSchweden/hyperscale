import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { HEAD_OF_SOMETHING_CARDS } from "../../src/data/cards/head-of-something";
import {
	ARCHETYPE_IMAGES,
	DEATH_IMAGES,
	getArchetypeImagePath,
	getDeathImagePath,
	getIncidentImagePath,
	getOutcomeImagePath,
	INCIDENT_IMAGES,
	OUTCOME_IMAGES,
	slugify,
} from "../../src/data/imageMap";
import { type ArchetypeId, DeathType } from "../../src/types";

describe("Image Map Contract Validation", () => {
	describe("INCIDENT_IMAGES — dynamic contract", () => {
		// Extract all unique incidents from card data
		const allCards = Object.values(ROLE_CARDS).flat();
		const uniqueIncidents = new Set<string>();

		for (const card of allCards) {
			if (card.realWorldReference?.incident) {
				uniqueIncidents.add(card.realWorldReference.incident);
			}
		}

		const incidents = Array.from(uniqueIncidents);

		it("every card with realWorldReference has a corresponding INCIDENT_IMAGES entry", () => {
			for (const incident of incidents) {
				const slug = slugify(incident);
				expect(
					INCIDENT_IMAGES[slug],
					`Missing image entry for incident: ${incident} (slug: ${slug})`,
				).toBeDefined();
			}
		});

		it("no duplicate incident slugs", () => {
			const slugs = incidents.map(slugify);
			const uniqueSlugs = new Set(slugs);
			expect(
				slugs.length,
				`Found duplicate incident slugs: ${slugs.filter((s, i) => slugs.indexOf(s) !== i).join(", ")}`,
			).toBe(uniqueSlugs.size);
		});

		it("cards sharing same incident reference same image path", () => {
			const incidentToPath = new Map<string, string>();

			for (const card of allCards) {
				if (!card.realWorldReference?.incident) continue;

				const incident = card.realWorldReference.incident;
				const slug = slugify(incident);
				const path = INCIDENT_IMAGES[slug];

				if (incidentToPath.has(incident)) {
					const existingPath = incidentToPath.get(incident);
					expect(
						path,
						`Cards with incident "${incident}" reference different paths: ${existingPath} vs ${path}`,
					).toBe(existingPath);
				} else {
					incidentToPath.set(incident, path);
				}
			}
		});
	});

	// Extract unique HOS incidents and their labels for use in multiple tests
	const hosOutcomes = new Map<string, Set<string>>(); // incidentSlug -> labelSlugs
	for (const card of HEAD_OF_SOMETHING_CARDS) {
		if (!card.realWorldReference?.incident) continue;

		const incident = card.realWorldReference.incident;
		const incidentSlug = slugify(incident);

		if (!hosOutcomes.has(incidentSlug)) {
			hosOutcomes.set(incidentSlug, new Set());
		}

		// Add left label
		const leftLabelSlug = slugify(card.onLeft.label);
		hosOutcomes.get(incidentSlug)?.add(leftLabelSlug);

		// Add right label
		const rightLabelSlug = slugify(card.onRight.label);
		hosOutcomes.get(incidentSlug)?.add(rightLabelSlug);
	}

	describe("OUTCOME_IMAGES — per-incident label-based pairs", () => {
		it("has entries for each unique incident+label combination", () => {
			let expectedCount = 0;
			for (const labelSlugs of hosOutcomes.values()) {
				expectedCount += labelSlugs.size;
			}
			const keys = Object.keys(OUTCOME_IMAGES);
			expect(
				keys.length,
				`Expected ${expectedCount} outcome entries (unique incident+label combinations), got ${keys.length}`,
			).toBe(expectedCount);
		});

		it("all keys follow pattern", () => {
			// Build a lookup: verify each OUTCOME_IMAGES key matches actual card data
			for (const key of Object.keys(OUTCOME_IMAGES)) {
				// Find if this key exists in any HOS card's incident+label combo
				let found = false;
				for (const card of HEAD_OF_SOMETHING_CARDS) {
					if (!card.realWorldReference?.incident) continue;

					const incidentSlug = slugify(card.realWorldReference.incident);
					const leftLabelSlug = slugify(card.onLeft.label);
					const rightLabelSlug = slugify(card.onRight.label);

					if (
						`${incidentSlug}-${leftLabelSlug}` === key ||
						`${incidentSlug}-${rightLabelSlug}` === key
					) {
						found = true;
						break;
					}
				}

				expect(
					found,
					`Key "${key}" does not correspond to actual incident+label combination in HOS cards`,
				).toBe(true);
			}
		});

		it("all values start with /images/outcomes/ and end with .webp", () => {
			for (const [key, path] of Object.entries(OUTCOME_IMAGES)) {
				expect(
					path.startsWith("/images/outcomes/"),
					`Path for "${key}" does not start with /images/outcomes/: ${path}`,
				).toBe(true);
				expect(
					path.endsWith(".webp"),
					`Path for "${key}" does not end with .webp: ${path}`,
				).toBe(true);
			}
		});

		it("all HOS incidents have corresponding outcome entries for their labels", () => {
			for (const [incidentSlug, labelSlugs] of hosOutcomes.entries()) {
				for (const labelSlug of labelSlugs) {
					const key = `${incidentSlug}-${labelSlug}`;
					expect(
						OUTCOME_IMAGES[key],
						`Missing outcome for incident "${incidentSlug}" and label "${labelSlug}"`,
					).toBeDefined();
				}
			}
		});

		it("no duplicate incident+label combinations", () => {
			const keys = Object.keys(OUTCOME_IMAGES);
			const uniqueKeys = new Set(keys);
			expect(keys.length).toBe(uniqueKeys.size);
		});
	});
});

describe("ARCHETYPE_IMAGES", () => {
	it("has entries for all 7 archetypes (including KIRK)", () => {
		const expectedArchetypes: ArchetypeId[] = [
			"PRAGMATIST",
			"SHADOW_ARCHITECT",
			"DISRUPTOR",
			"CONSERVATIVE",
			"BALANCED",
			"CHAOS_AGENT",
			"KIRK",
		];

		for (const archetype of expectedArchetypes) {
			expect(
				ARCHETYPE_IMAGES[archetype],
				`Missing archetype image entry for: ${archetype}`,
			).toBeDefined();
		}

		// Verify we have exactly 7 entries
		const keys = Object.keys(ARCHETYPE_IMAGES);
		expect(keys.length).toBe(7);
	});
});

describe("DEATH_IMAGES", () => {
	it("has entries for all 7 death types (including KIRK)", () => {
		const expectedDeathTypes = Object.values(DeathType);
		expect(expectedDeathTypes).toHaveLength(7);

		for (const deathType of expectedDeathTypes) {
			expect(
				DEATH_IMAGES[deathType],
				`Missing death image entry for: ${deathType}`,
			).toBeDefined();
		}

		// Verify we have exactly 7 entries
		const keys = Object.keys(DEATH_IMAGES);
		expect(keys.length).toBe(7);
	});
});

describe("path format", () => {
	const allImageMaps = {
		INCIDENT_IMAGES,
		OUTCOME_IMAGES,
		ARCHETYPE_IMAGES,
		DEATH_IMAGES,
	};

	it("all paths start with /images/ and end with .webp", () => {
		for (const imageMap of Object.values(allImageMaps)) {
			for (const path of Object.values(imageMap)) {
				expect(
					path.startsWith("/images/"),
					`Path does not start with /images/: ${path}`,
				).toBe(true);
				expect(
					path.endsWith(".webp"),
					`Path does not end with .webp: ${path}`,
				).toBe(true);
			}
		}
	});

	it("no duplicate paths across all maps", () => {
		const allPaths = Object.values(allImageMaps).flatMap(Object.values);
		const uniquePaths = new Set(allPaths);
		expect(
			allPaths.length,
			`Found duplicate paths: ${allPaths.filter((p, i) => allPaths.indexOf(p) !== i).join(", ")}`,
		).toBe(uniquePaths.size);
	});
});

describe("helper functions", () => {
	it("getIncidentImagePath returns correct path for known slug", () => {
		// Get first incident and verify the path
		const firstSlug = Object.keys(INCIDENT_IMAGES)[0];
		if (firstSlug) {
			const path = getIncidentImagePath(firstSlug);
			expect(path).toBe(INCIDENT_IMAGES[firstSlug]);
		}
	});

	it("getOutcomeImagePath returns correct path for known incident and label slug", () => {
		// Get first outcome key and extract incident/label slug
		const firstKey = Object.keys(OUTCOME_IMAGES)[0];
		if (firstKey) {
			const match = firstKey.match(/^([a-z0-9-]+)-([a-z0-9-]+)$/);
			if (match) {
				const [, incidentSlug, labelSlug] = match;
				const path = getOutcomeImagePath(incidentSlug, labelSlug);
				expect(path).toBe(OUTCOME_IMAGES[firstKey]);
			}
		}
	});

	it("getOutcomeImagePath returns undefined for missing keys", () => {
		const path = getOutcomeImagePath(
			"nonexistent-incident",
			"nonexistent-label",
		);
		expect(path).toBeUndefined();
	});

	it("getArchetypeImagePath returns correct path for known id", () => {
		const id: ArchetypeId = "PRAGMATIST";
		const path = getArchetypeImagePath(id);
		expect(path).toBe(ARCHETYPE_IMAGES[id]);
	});

	it("getDeathImagePath returns correct path for known type", () => {
		const deathType = DeathType.BANKRUPT;
		const path = getDeathImagePath(deathType);
		expect(path).toBe(DEATH_IMAGES[deathType]);
	});

	describe("slugify", () => {
		it("slugify produces consistent slugs", () => {
			expect(slugify("Take the blame")).toBe("take-the-blame");
			expect(slugify("Name the engineer")).toBe("name-the-engineer");
			expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
			expect(slugify("Special!@#$%^&*()Chars")).toBe("special-chars");
			expect(slugify("CamelCaseWord")).toBe("camelcaseword");
			expect(slugify("")).toBe("");
			expect(slugify("---")).toBe("");
		});
	});
});
