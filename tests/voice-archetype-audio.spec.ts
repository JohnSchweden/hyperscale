import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Archetype Reveal Audio Files Existence Tests
 *
 * These tests verify that all required archetype reveal audio files exist on disk.
 * 21 files total: 7 archetypes × 3 personalities
 * Files are in Opus format (.opus) with MP3 fallback (.mp3).
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
				const filename = `archetype_${archetype}.opus`;
				test(`${personality}/archetype/${filename} exists`, () => {
					const filePath = path.join(
						VOICES_DIR,
						personality,
						"archetype",
						filename,
					);
					expect(
						fs.existsSync(filePath),
						`Missing archetype reveal file: ${personality}/archetype/${filename}`,
					).toBe(true);
				});
			}
		}
	});

	test.describe("Archetype reveal files have reasonable file sizes", () => {
		for (const personality of PERSONALITIES) {
			for (const archetype of ARCHETYPES) {
				const filename = `archetype_${archetype}.opus`;
				test(`${personality}/archetype/${filename} has valid content`, () => {
					const filePath = path.join(
						VOICES_DIR,
						personality,
						"archetype",
						filename,
					);

					// Skip if file doesn't exist (may be pending generation)
					if (!fs.existsSync(filePath)) {
						test.skip(
							true,
							`File ${personality}/${filename} not yet generated`,
						);
						return;
					}

					const stats = fs.statSync(filePath);
					// Opus at 96kbps: ~12KB/s — minimum 4KB, maximum 500KB
					expect(stats.size).toBeGreaterThan(4 * 1024);
					expect(stats.size).toBeLessThan(500 * 1024);
				});
			}
		}
	});

	test.describe("Archetype reveal files are valid Opus format", () => {
		for (const personality of PERSONALITIES) {
			for (const archetype of ARCHETYPES) {
				const filename = `archetype_${archetype}.opus`;
				test(`${personality}/archetype/${filename} starts with OggS header`, () => {
					const filePath = path.join(
						VOICES_DIR,
						personality,
						"archetype",
						filename,
					);

					// Skip if file doesn't exist
					if (!fs.existsSync(filePath)) {
						test.skip(
							true,
							`File ${personality}/${filename} not yet generated`,
						);
						return;
					}

					// Read first 4 bytes - should be "OggS" for Opus-in-OGG container
					const fd = fs.openSync(filePath, "r");
					const buffer = Buffer.alloc(4);
					fs.readSync(fd, buffer, 0, 4, 0);
					fs.closeSync(fd);

					const header = buffer.toString("ascii");
					expect(header).toBe("OggS");
				});
			}
		}
	});
});
