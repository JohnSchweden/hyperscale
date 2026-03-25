#!/usr/bin/env bun

/**
 * Run tests relevant to changed files.
 * Maps source paths to @area:* tags and runs matching tests.
 * Falls back to smoke if no mapping or no changes.
 *
 * Usage:
 *   bun run test:changed
 *   bun run test:changed -- --staged   # only staged files
 *   COMMIT_RANGE=main bun run test:changed  # diff against main (e.g. for PR)
 */

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_COMMIT = "HEAD";

type Area = "gameplay" | "input" | "layout" | "boss" | "audio" | "visual";

const PATH_TO_AREAS: Array<{ pattern: RegExp; areas: Area[] }> = [
	{
		pattern: /hooks\/useGameState|gameReducer|data\/(cards|roles)/,
		areas: ["gameplay", "boss"],
	},
	{
		pattern: /components\/.*Game|GameHUD|GameOver|BossFight/,
		areas: ["gameplay", "boss"],
	},
	{ pattern: /deathTypes|determineDeathType/, areas: ["boss"] },
	{
		pattern:
			/IncidentCard|SwipeCard|CardStack|swipe|drag|spring|exitAnimation|buttonHighlight/,
		areas: ["input"],
	},
	{
		pattern: /LayoutShell|layout|viewport|feedback.*overlay|overlay/,
		areas: ["layout"],
	},
	{
		pattern: /voice|audio|VoicePlayback|roastService|geminiService/,
		areas: ["audio"],
	},
	{ pattern: /\.css|tailwind|styles/, areas: ["layout"] },
];

function getChangedFiles(commitRange?: string, stagedOnly?: boolean): string[] {
	let cmd: string;
	if (stagedOnly) {
		cmd = "git diff --cached --name-only";
	} else {
		const ref = commitRange ?? process.env.COMMIT_RANGE ?? DEFAULT_COMMIT;
		const target = ref === "HEAD" ? "HEAD" : ref;
		cmd = `git diff --name-only ${target}`;
	}
	const out = execSync(cmd, { encoding: "utf-8" });
	return out.trim() ? out.trim().split("\n") : [];
}

function filesToAreas(files: string[]): Set<Area> {
	const areas = new Set<Area>();
	for (const file of files) {
		for (const { pattern, areas: a } of PATH_TO_AREAS) {
			if (pattern.test(file)) {
				for (const area of a) areas.add(area);
			}
		}
	}
	return areas;
}

function main(): void {
	const args = process.argv.slice(2);
	const stagedOnly = args.includes("--staged");

	const files = getChangedFiles(undefined, stagedOnly);

	if (files.length === 0) {
		console.log("No changed files; running smoke tests.");
		execSync("bun run test -- --grep @smoke", {
			stdio: "inherit",
			cwd: REPO_ROOT,
		});
		return;
	}

	const areas = filesToAreas(files);
	const grepPattern =
		areas.size > 0
			? Array.from(areas)
					.map((a) => `@area:${a}`)
					.join("|")
			: "@smoke";
	const areasLabel = areas.size > 0 ? Array.from(areas).join(", ") : "smoke";

	console.log(`Changed files: ${files.length}`);
	console.log(`Areas: ${areasLabel}`);
	console.log(`Running: grep ${grepPattern}\n`);

	execSync(`bun run test -- --grep "${grepPattern}"`, {
		stdio: "inherit",
		cwd: REPO_ROOT,
	});
}

main();
