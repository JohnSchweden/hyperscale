import { expect, test } from "@playwright/test";
import { navigateToBossFightFast } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Boss Fight Answer Randomization", () => {
	test("answers are randomized in different positions across reloads", async ({
		page,
	}) => {
		await navigateToBossFightFast(page);

		const getAnswerPositions = async () => {
			const allButtons = page.locator(
				'button:has-text("A."), button:has-text("B."), button:has-text("C."), button:has-text("D.")',
			);
			const positions: string[] = [];
			const count = await allButtons.count();
			for (let i = 0; i < count; i++) {
				const text = await allButtons.nth(i).textContent();
				if (text && text.length > 0) positions.push(text);
			}
			return positions;
		};

		await page.waitForSelector("text=A.");
		const positions1 = await getAnswerPositions();
		expect(positions1.length).toBe(4);

		await page.reload();
		await navigateToBossFightFast(page);
		const positions2 = await getAnswerPositions();

		const isDifferent = positions1.some((p, i) => p !== positions2[i]);
		expect(isDifferent).toBe(true);
	});

	test("same question within same session keeps same answer positions", async ({
		page,
	}) => {
		await navigateToBossFightFast(page);

		const getAnswerTexts = async () => {
			const allButtons = page.locator(
				'button:has-text("A."), button:has-text("B."), button:has-text("C."), button:has-text("D.")',
			);
			const texts: string[] = [];
			const count = await allButtons.count();
			for (let i = 0; i < count; i++) {
				const text = await allButtons.nth(i).textContent();
				if (text) texts.push(text);
			}
			return texts;
		};

		await page.waitForSelector("text=A.");
		const answers1 = await getAnswerTexts();
		const answers2 = await getAnswerTexts();

		expect(answers1).toEqual(answers2);
	});
});
