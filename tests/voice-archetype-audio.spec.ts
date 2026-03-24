import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Archetype Reveal Audio Files Existence Tests
 *
 * These tests verify that all required archetype reveal audio files exist on disk.
 * 21 files total: 7 archetypes × 3 personalities
 */

const VOICES_DIR = path.join(process.cwd(), "public/audio/voices");

const PERSONALITIES = ["roaster", "zenmaster", "lovebomber"] as const;

const ARCHETYPES = [
	"pragmatist",
	"shadow_architect",
	"disruptor",
	"conservative",
	"balanced",
	"chaos_agent",
	"kirk",
] as const;

test.describe("Archetype reveal audio files @smoke @area:audio", () => {
	test.describe("All archetype reveal files exist", () => {
		for (const personality of PERSONALITIES) {
			for (const archetype of ARCHETYPES) {
				const filename = `archetype_${archetype}.wav`;
				test(`${personality}/${filename} exists`, () => {
					const filePath = path.join(VOICES_DIR, personality, filename);
					expect(
						fs.existsSync(filePath),
						`Missing archetype reveal file: ${personality}/${filename}`,
					).toBe(true);
				});
			}
		}
	});

	test.describe("Archetype reveal files have reasonable file sizes", () => {
		for (const personality of PERSONALITIES) {
			for (const archetype of ARCHETYPES) {
				const filename = `archetype_${archetype}.wav`;
				test(`${personality}/${filename} has valid content`, () => {
					const filePath = path.join(VOICES_DIR, personality, filename);

					// Skip if file doesn't exist (may be pending generation)
					if (!fs.existsSync(filePath)) {
						test.skip(
							true,
							`File ${personality}/${filename} not yet generated`,
						);
						return;
					}

					const stats = fs.statSync(filePath);
					// WAV files should be at least 10KB (not empty/corrupted)
					// and at most 5MB (reasonable upper bound)
					expect(stats.size).toBeGreaterThan(10 * 1024);
					expect(stats.size).toBeLessThan(5 * 1024 * 1024);
				});
			}
		}
	});

	test.describe("Archetype reveal files are valid WAV format", () => {
		for (const personality of PERSONALITIES) {
			for (const archetype of ARCHETYPES) {
				const filename = `archetype_${archetype}.wav`;
				test(`${personality}/${filename} starts with RIFF header`, () => {
					const filePath = path.join(VOICES_DIR, personality, filename);

					// Skip if file doesn't exist
					if (!fs.existsSync(filePath)) {
						test.skip(
							true,
							`File ${personality}/${filename} not yet generated`,
						);
						return;
					}

					// Read first 4 bytes - should be "RIFF" for WAV files
					const fd = fs.openSync(filePath, "r");
					const buffer = Buffer.alloc(4);
					fs.readSync(fd, buffer, 0, 4, 0);
					fs.closeSync(fd);

					const header = buffer.toString("ascii");
					expect(header).toBe("RIFF");
				});
			}
		}
	});
});
