import * as fs from "node:fs";
import * as path from "node:path";
import { expect, test } from "@playwright/test";

test.describe("Debrief Navigation @area:gameplay", () => {
	test("DEBRIEF_PAGE_1 maps to DEBRIEF_PAGE_2 in nextPage", () => {
		const useDebriefPath = path.join(process.cwd(), "hooks", "useDebrief.ts");
		const content = fs.readFileSync(useDebriefPath, "utf-8");

		const debriefPage1Match = content.match(
			/\[GameStage\.DEBRIEF_PAGE_1\]:\s*(GameStage\.[^\s,]+|null)/,
		);
		expect(debriefPage1Match).toBeTruthy();
		expect(debriefPage1Match?.[1]).toBe("GameStage.DEBRIEF_PAGE_2");
	});

	test("all debrief transitions are properly configured", () => {
		const useDebriefPath = path.join(process.cwd(), "hooks", "useDebrief.ts");
		const content = fs.readFileSync(useDebriefPath, "utf-8");

		// Expected: linear debrief 1 → 2 → 3; null ends flow
		expect(content).toMatch(
			/\[GameStage\.DEBRIEF_PAGE_1\]:\s*GameStage\.DEBRIEF_PAGE_2/,
		);
		expect(content).toMatch(
			/\[GameStage\.DEBRIEF_PAGE_2\]:\s*GameStage\.DEBRIEF_PAGE_3/,
		);
		expect(content).toMatch(/\[GameStage\.DEBRIEF_PAGE_3\]:\s*null/);
	});

	test("transitions map is complete for all GameStage values", () => {
		const useDebriefPath = path.join(process.cwd(), "hooks", "useDebrief.ts");
		const content = fs.readFileSync(useDebriefPath, "utf-8");

		const transitionsMatch = content.match(
			/const transitions: Record<GameStage, GameStage \| null> = \{([^}]+)\}/s,
		);
		expect(transitionsMatch).toBeTruthy();

		const transitionsBlock = transitionsMatch?.[1] || "";

		expect(transitionsBlock).toContain("DEBRIEF_PAGE_1");
		expect(transitionsBlock).toContain("DEBRIEF_PAGE_2");
		expect(transitionsBlock).toContain("DEBRIEF_PAGE_3");
		expect(transitionsBlock).toContain("INTRO");
		expect(transitionsBlock).toContain("PLAYING");
	});
});
