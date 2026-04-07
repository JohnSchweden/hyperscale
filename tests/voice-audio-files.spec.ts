import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { BGM_SOURCE_STEMS } from "../src/data/bgmPlaylist";

/**
 * Voice Audio Files Existence Tests
 *
 * These tests verify that all required audio files exist on disk.
 * This catches issues where the code expects a file but it doesn't exist.
 */

const VOICES_DIR = path.join(process.cwd(), "public/audio/voices");
const STRESS_DIR = path.join(process.cwd(), "public/audio/stress");
const BGM_DIR = path.join(process.cwd(), "public/audio/music");

const PERSONALITIES = ["roaster", "zenmaster", "lovebomber"] as const;

const CORE_EXCEPT_ONBOARDING = [
	"core/victory.opus",
	"core/failure.opus",
] as const;

const ZEN_LOVE_ONBOARDING = ["core/onboarding.opus"] as const;

const ROASTER_ONBOARDING_FILES = [
	"core/onboarding_1.opus",
	"core/onboarding_2.opus",
	"core/onboarding_3.opus",
	"core/onboarding_4.opus",
	"core/onboarding_5.opus",
] as const;

// Only roaster has feedback files (per design decision) - now in feedback/ subfolder
const ROASTER_FEEDBACK_FILES = [
	"feedback/feedback_debug.opus",
	"feedback/feedback_paste.opus",
	"feedback/feedback_install.opus",
	"feedback/feedback_ignore.opus",
];

test.describe("Voice Audio Files @smoke @area:audio", () => {
	test.describe("Stress audio (Android heartbeat sample)", () => {
		test("heartbeat.mp3 exists", () => {
			const filePath = path.join(STRESS_DIR, "heartbeat.mp3");
			expect(
				fs.existsSync(filePath),
				"Missing Android heartbeat sample: public/audio/stress/heartbeat.mp3",
			).toBe(true);
		});
	});

	test.describe("Core voice files (all personalities)", () => {
		for (const personality of PERSONALITIES) {
			for (const file of CORE_EXCEPT_ONBOARDING) {
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

	test.describe("Onboarding voice files", () => {
		for (const personality of ["zenmaster", "lovebomber"] as const) {
			for (const file of ZEN_LOVE_ONBOARDING) {
				test(`${personality}/${file} exists`, () => {
					const filePath = path.join(VOICES_DIR, personality, file);
					expect(
						fs.existsSync(filePath),
						`Missing required file: ${personality}/${file}`,
					).toBe(true);
				});
			}
		}
		for (const file of ROASTER_ONBOARDING_FILES) {
			test(`roaster/${file} exists`, () => {
				const filePath = path.join(VOICES_DIR, "roaster", file);
				expect(
					fs.existsSync(filePath),
					`Missing required file: roaster/${file}`,
				).toBe(true);
			});
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

	test.describe("Background music (burger menu)", () => {
		for (const stem of BGM_SOURCE_STEMS) {
			for (const ext of [".opus", ".mp3"]) {
				test(`${stem}${ext} exists`, () => {
					const filePath = path.join(BGM_DIR, `${stem}${ext}`);
					expect(
						fs.existsSync(filePath),
						`Missing BGM file: public/audio/music/${stem}${ext}`,
					).toBe(true);
				});
			}
		}
	});

	const NO_FEEDBACK_PERSONALITIES = ["zenmaster", "lovebomber"] as const;
	for (const personality of NO_FEEDBACK_PERSONALITIES) {
		test.describe(`${personality} does NOT have feedback files`, () => {
			for (const file of ROASTER_FEEDBACK_FILES) {
				test(`${personality}/${file} does NOT exist`, () => {
					const filePath = path.join(VOICES_DIR, personality, file);
					expect(
						fs.existsSync(filePath),
						`${personality} should NOT have ${file} (per design)`,
					).toBe(false);
				});
			}
		});
	}
});
