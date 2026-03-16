import * as fs from "node:fs";
import * as path from "node:path";
import { expect, test } from "@playwright/test";

test.describe("Debrief Navigation @area:gameplay", () => {
	test("DEBRIEF_PAGE_1 transition exists and maps to DEBRIEF_PAGE_2", () => {
		// Verify the transition map includes DEBRIEF_PAGE_1 → DEBRIEF_PAGE_2
		// This test verifies the bug fix is in place
		const useDebriefPath = path.join(process.cwd(), "hooks", "useDebrief.ts");
		const content = fs.readFileSync(useDebriefPath, "utf-8");

		// Verify DEBRIEF_PAGE_1 maps to DEBRIEF_PAGE_2 (not null)
		const debriefPage1Match = content.match(
			/\[GameStage\.DEBRIEF_PAGE_1\]:\s*(GameStage\.DEBRIEF_PAGE_2|null)/,
		);
		expect(debriefPage1Match).toBeTruthy();
		expect(debriefPage1Match?.[1]).toBe("GameStage.DEBRIEF_PAGE_2");
	});

	test("all debrief transitions are properly configured", () => {
		// Verify all expected transitions exist in useDebrief.ts
		const useDebriefPath = path.join(process.cwd(), "hooks", "useDebrief.ts");
		const content = fs.readFileSync(useDebriefPath, "utf-8");

		// Expected transitions:
		// GAME_OVER → DEBRIEF_PAGE_2
		// SUMMARY → DEBRIEF_PAGE_1
		// DEBRIEF_PAGE_1 → DEBRIEF_PAGE_2
		// DEBRIEF_PAGE_2 → DEBRIEF_PAGE_3
		// DEBRIEF_PAGE_3 → null (end of flow)

		expect(content).toMatch(
			/\[GameStage\.GAME_OVER\]:\s*GameStage\.DEBRIEF_PAGE_2/,
		);
		expect(content).toMatch(
			/\[GameStage\.SUMMARY\]:\s*GameStage\.DEBRIEF_PAGE_1/,
		);
		expect(content).toMatch(
			/\[GameStage\.DEBRIEF_PAGE_1\]:\s*GameStage\.DEBRIEF_PAGE_2/,
		);
		expect(content).toMatch(
			/\[GameStage\.DEBRIEF_PAGE_2\]:\s*GameStage\.DEBRIEF_PAGE_3/,
		);
		expect(content).toMatch(/\[GameStage\.DEBRIEF_PAGE_3\]:\s*null/);
	});

	test("transitions map is complete for all GameStage values", () => {
		// Verify the transitions map includes entries for all GameStage enum values
		const useDebriefPath = path.join(process.cwd(), "hooks", "useDebrief.ts");
		const content = fs.readFileSync(useDebriefPath, "utf-8");

		// Extract the transitions object
		const transitionsMatch = content.match(
			/const transitions: Record<GameStage, GameStage \| null> = \{([^}]+)\}/s,
		);
		expect(transitionsMatch).toBeTruthy();

		const transitionsBlock = transitionsMatch?.[1] || "";

		// Check that all relevant stages are covered
		expect(transitionsBlock).toContain("GAME_OVER");
		expect(transitionsBlock).toContain("SUMMARY");
		expect(transitionsBlock).toContain("DEBRIEF_PAGE_1");
		expect(transitionsBlock).toContain("DEBRIEF_PAGE_2");
		expect(transitionsBlock).toContain("DEBRIEF_PAGE_3");
		expect(transitionsBlock).toContain("INTRO");
		expect(transitionsBlock).toContain("PLAYING");
	});
});
