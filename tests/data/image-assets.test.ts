import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
	ARCHETYPE_IMAGES,
	DEATH_IMAGES,
	INCIDENT_IMAGES,
	OUTCOME_IMAGES,
} from "../../data/imageMap";

const PUBLIC_DIR = path.join(process.cwd(), "public");

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

describe.skip("Image Asset File Validation", () => {
	describe.each(imageMapTests)("$name images", ({ name, map }) => {
		it("all $name images exist on disk", () => {
			for (const [key, imagePath] of Object.entries(map)) {
				expect(
					imageFileExists(imagePath),
					`${name} image missing for "${key}": ${imagePath}`,
				).toBe(true);
			}
		});
	});

	it("all image files are non-zero size", () => {
		const allPaths = Object.values({
			INCIDENT_IMAGES,
			OUTCOME_IMAGES,
			ARCHETYPE_IMAGES,
			DEATH_IMAGES,
		}).flatMap(Object.values);

		const uniquePaths = new Set(allPaths);

		for (const imagePath of uniquePaths) {
			const size = getImageFileSize(imagePath);
			expect(
				size,
				`Image file is zero-size or missing: ${imagePath}`,
			).toBeGreaterThan(0);
		}
	});
});
