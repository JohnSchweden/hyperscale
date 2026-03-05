import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Voice Audio Files Existence Tests
 *
 * These tests verify that all required audio files exist on disk.
 * This catches issues where the code expects a file but it doesn't exist.
 */

const VOICES_DIR = path.join(process.cwd(), "public/audio/voices");

const PERSONALITIES = ["roaster", "zenmaster", "lovebomber"] as const;

// All personalities have these files
const COMMON_VOICE_FILES = ["onboarding.wav", "victory.wav", "failure.wav"];

// Only roaster has feedback files (per design decision)
const ROASTER_FEEDBACK_FILES = [
	"feedback_debug.wav",
	"feedback_paste.wav",
	"feedback_install.wav",
	"feedback_ignore.wav",
];

test.describe("Voice Audio Files", () => {
	test.describe("Common voice files (all personalities)", () => {
		for (const personality of PERSONALITIES) {
			for (const file of COMMON_VOICE_FILES) {
				test(`${personality}/${file} exists`, () => {
					const filePath = path.join(VOICES_DIR, personality, file);
					expect(
						fs.existsSync(filePath),
						`Missing required file: ${personality}/${file}`,
					).toBe(true);
				});
			}
		}
	});

	test.describe("Roaster feedback files (Development role only)", () => {
		for (const file of ROASTER_FEEDBACK_FILES) {
			test(`roaster/${file} exists`, () => {
				const filePath = path.join(VOICES_DIR, "roaster", file);
				expect(
					fs.existsSync(filePath),
					`Missing required file: roaster/${file}`,
				).toBe(true);
			});
		}
	});

	test.describe("Zen Master does NOT have feedback files", () => {
		for (const file of ROASTER_FEEDBACK_FILES) {
			test(`zenmaster/${file} does NOT exist`, () => {
				const filePath = path.join(VOICES_DIR, "zenmaster", file);
				expect(
					fs.existsSync(filePath),
					`zenmaster should NOT have ${file} (per design)`,
				).toBe(false);
			});
		}
	});

	test.describe("Lovebomber does NOT have feedback files", () => {
		for (const file of ROASTER_FEEDBACK_FILES) {
			test(`lovebomber/${file} does NOT exist`, () => {
				const filePath = path.join(VOICES_DIR, "lovebomber", file);
				expect(
					fs.existsSync(filePath),
					`lovebomber should NOT have ${file} (per design)`,
				).toBe(false);
			});
		}
	});
});
