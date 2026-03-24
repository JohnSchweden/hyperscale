import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { BGM_SOURCE_STEMS } from "../data/bgmPlaylist";

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

// All personalities have these files (now in core/ subfolder)
const COMMON_VOICE_FILES = [
	"core/onboarding.wav",
	"core/victory.wav",
	"core/failure.wav",
];

// Only roaster has feedback files (per design decision) - now in feedback/ subfolder
const ROASTER_FEEDBACK_FILES = [
	"feedback/feedback_debug.wav",
	"feedback/feedback_paste.wav",
	"feedback/feedback_install.wav",
	"feedback/feedback_ignore.wav",
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
