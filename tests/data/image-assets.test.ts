import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
	ARCHETYPE_IMAGES,
	DEATH_IMAGES,
	INCIDENT_IMAGES,
	OUTCOME_IMAGES,
} from "../../src/data/imageMap";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const HAS_PUBLIC_IMAGES = existsSync(PUBLIC_DIR);

function imageFileExists(imagePath: string): boolean {
	const fullPath = path.join(PUBLIC_DIR, imagePath);
	return existsSync(fullPath);
}

function getImageFileSize(imagePath: string): number {
	const fullPath = path.join(PUBLIC_DIR, imagePath);
	try {
		return statSync(fullPath).size;
	} catch {
		return 0;
	}
}

const imageMapTests = [
	{ name: "incident", map: INCIDENT_IMAGES },
	{ name: "outcome", map: OUTCOME_IMAGES },
	{ name: "archetype", map: ARCHETYPE_IMAGES },
	{ name: "death", map: DEATH_IMAGES },
];

describe.skipIf(!HAS_PUBLIC_IMAGES)("Image Asset File Validation", () => {
	describe.each(imageMapTests)("$name images", ({ name, map }) => {
		it("all $name image paths are valid strings", () => {
			for (const [, imagePath] of Object.entries(map)) {
				expect(typeof imagePath).toBe("string");
				expect(imagePath.length).toBeGreaterThan(0);
				expect(imagePath).toMatch(/^\/images\//);
				expect(imagePath).toMatch(/\.webp$/);
			}
		});

		it("existing $name images are on disk", () => {
			let existingCount = 0;
			let missingCount = 0;

			for (const [, imagePath] of Object.entries(map)) {
				if (imageFileExists(imagePath)) {
					existingCount++;
				} else {
					missingCount++;
				}
			}

			// At least some images should exist (not all missing)
			if (existingCount === 0 && missingCount > 0) {
				throw new Error(
					`No ${name} images found on disk. ${missingCount} images expected but missing.`,
				);
			}
		});
	});

	it("all existing image files are non-zero size", () => {
		const allPaths = Object.values({
			INCIDENT_IMAGES,
			OUTCOME_IMAGES,
			ARCHETYPE_IMAGES,
			DEATH_IMAGES,
		}).flatMap(Object.values);

		const uniquePaths = new Set(allPaths);
		let zeroCount = 0;

		for (const imagePath of uniquePaths) {
			if (!imageFileExists(imagePath)) continue;
			const size = getImageFileSize(imagePath);
			if (size === 0) {
				zeroCount++;
			}
		}

		expect(zeroCount).toBe(0);
	});
});
