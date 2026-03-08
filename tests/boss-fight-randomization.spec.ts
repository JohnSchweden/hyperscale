import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { navigateToBossFightFast } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

const ANSWER_BUTTON_SELECTOR =
	'button:has-text("A."), button:has-text("B."), button:has-text("C."), button:has-text("D.")';

async function getAnswerTexts(page: Page): Promise<string[]> {
	const buttons = page.locator(ANSWER_BUTTON_SELECTOR);
	const texts: string[] = [];
	const count = await buttons.count();
	for (let i = 0; i < count; i++) {
		const text = await buttons.nth(i).textContent();
		if (text) texts.push(text);
	}
	return texts;
}

test.describe("Boss Fight Answer Randomization @area:boss", () => {
	test("answers are randomized in different positions across reloads", async ({
		page,
	}) => {
		await navigateToBossFightFast(page);
		await page.waitForSelector("text=A.");

		const positions1 = await getAnswerTexts(page);
		expect(positions1.length).toBe(4);

		await navigateToBossFightFast(page);
		const positions2 = await getAnswerTexts(page);

		const isDifferent = positions1.some((p, i) => p !== positions2[i]);
		expect(isDifferent).toBe(true);
	});

	test("same question within same session keeps same answer positions", async ({
		page,
	}) => {
		await navigateToBossFightFast(page);
		await page.waitForSelector("text=A.");

		const answers1 = await getAnswerTexts(page);
		const answers2 = await getAnswerTexts(page);

		expect(answers1).toEqual(answers2);
	});
});
