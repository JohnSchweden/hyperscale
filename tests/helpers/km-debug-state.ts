import type { Page } from "@playwright/test";

export type KmDebugHistoryEntry = { cardId: string; choice: "LEFT" | "RIGHT" };

export type KmDebugStateFixture = {
	stage: string;
	hype?: number;
	heat?: number;
	budget?: number;
	personality?: string;
	role?: string | null;
	currentCardIndex?: number;
	history?: KmDebugHistoryEntry[];
	deathReason?: string;
	deathType?: string;
	unlockedEndings?: string[];
	bossFightAnswers?: unknown[];
	effectiveDeck?: unknown | null;
	kirkCounter?: number;
	kirkCorruptionActive?: boolean;
};

const DEFAULT_KM_DEBUG_STATE = {
	hype: 50,
	heat: 100,
	budget: 500000,
	personality: "ROASTER",
	role: "SOFTWARE_ENGINEER",
	currentCardIndex: 0,
	history: [] as KmDebugHistoryEntry[],
	deathReason: "Heat exceeded 100%",
	deathType: "REPLACED_BY_SCRIPT",
	unlockedEndings: ["REPLACED_BY_SCRIPT"],
	bossFightAnswers: [] as unknown[],
	effectiveDeck: null as unknown | null,
};

/** Sets `km-debug-state` after navigation and reloads so the app boots into the fixture. */
export async function gotoWithKmDebugState(
	page: Page,
	overrides: KmDebugStateFixture,
): Promise<void> {
	const state = {
		stage: overrides.stage,
		...DEFAULT_KM_DEBUG_STATE,
		...overrides,
	};
	await page.goto("/");
	await page.evaluate((payload: string) => {
		localStorage.setItem("km-debug-state", payload);
	}, JSON.stringify(state));
	await page.reload();
}
