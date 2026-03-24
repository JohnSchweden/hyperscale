import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Death Ending Voice Audio Files Existence Tests
 *
 * These tests verify that all death ending audio files exist on disk.
 * Validates the 21 death audio files (7 deaths × 3 personalities).
 */

const VOICES_DIR = path.join(process.cwd(), "public/audio/voices");

const PERSONALITIES = ["roaster", "zenmaster", "lovebomber"] as const;

// All 7 death types (including KIRK)
const DEATH_FILES = [
	"death_bankrupt.wav",
	"death_replaced_by_script.wav",
	"death_congress.wav",
	"death_fled_country.wav",
	"death_prison.wav",
	"death_audit_failure.wav",
	"death_kirk.wav",
];

test.describe("Death ending audio files @smoke @area:audio", () => {
	test.describe("All personalities have all 7 death ending files", () => {
		for (const personality of PERSONALITIES) {
			for (const file of DEATH_FILES) {
				test(`${personality}/death/${file} exists`, () => {
					const filePath = path.join(VOICES_DIR, personality, "death", file);
					expect(
						fs.existsSync(filePath),
						`Missing required death audio file: ${personality}/death/${file}`,
					).toBe(true);
				});
			}
		}
	});

	test.describe("KIRK death has voice files (not just synthesized glitch)", () => {
		for (const personality of PERSONALITIES) {
			test(`${personality}/death/death_kirk.wav exists as voice file`, () => {
				const filePath = path.join(
					VOICES_DIR,
					personality,
					"death",
					"death_kirk.wav",
				);
				expect(
					fs.existsSync(filePath),
					`${personality} should have death/death_kirk.wav voice file`,
				).toBe(true);

				// Verify it's not empty (should be > 50KB for valid audio)
				const stats = fs.statSync(filePath);
				expect(
					stats.size,
					`${personality}/death/death_kirk.wav appears to be empty or corrupt`,
				).toBeGreaterThan(50000);
			});
		}
	});

	test.describe("All death files have valid audio content", () => {
		for (const personality of PERSONALITIES) {
			for (const file of DEATH_FILES) {
				test(`${personality}/death/${file} has valid file size`, () => {
					const filePath = path.join(VOICES_DIR, personality, "death", file);
					const stats = fs.statSync(filePath);
					expect(
						stats.size,
						`${personality}/death/${file} appears to be empty or corrupt`,
					).toBeGreaterThan(50000);
				});
			}
		}
	});

	test("Total death ending file count is 21 (7 × 3)", () => {
		let count = 0;
		for (const personality of PERSONALITIES) {
			for (const file of DEATH_FILES) {
				const filePath = path.join(VOICES_DIR, personality, "death", file);
				if (fs.existsSync(filePath)) {
					count++;
				}
			}
		}
		expect(count).toBe(21);
	});
});
