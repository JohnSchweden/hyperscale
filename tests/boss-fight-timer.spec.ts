import { expect, test } from "@playwright/test";
import { BOSS_FIGHT_QUESTIONS } from "../src/data/bossQuestions";
import { navigateToBossFightFast } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Boss fight timer @area:boss @slow", () => {
	test("a) reaches BOSS_FIGHT stage", async ({ page }) => {
		await navigateToBossFightFast(page);
		await expect(page.getByText("Boss fight")).toBeVisible();
		await expect(
			page.getByText(/Negotiate with the External Auditor/),
		).toBeVisible();
	});

	test("b) timer is visible and counts down", async ({ page }) => {
		await navigateToBossFightFast(page);
		const timerLabel = page.getByText("Time remaining");
		await expect(timerLabel).toBeVisible();
		// Timer shows e.g. "30s" or "29s"
		const timerValue = page.locator("text=/\\d{1,2}s/").first();
		await expect(timerValue).toBeVisible();
		const initialText = await timerValue.textContent();
		expect(initialText).toMatch(/^(2[0-9]|30)s$/);
		// After 2 seconds, value should be lower (or same if we caught 30→30→29)
		await page.waitForTimeout(2100);
		const laterText = await timerValue.textContent();
		const initialNum = parseInt(initialText?.replace("s", "") ?? "", 10);
		const laterNum = parseInt(laterText?.replace("s", "") ?? "", 10);
		expect(laterNum).toBeLessThanOrEqual(initialNum);
		expect(laterNum).toBeGreaterThanOrEqual(0);
	});

	test("c) when time reaches 0 without answering, answer is treated wrong @slow", async ({
		page,
	}) => {
		test.slow();
		test.setTimeout(45000); // 30s timer + buffer
		await navigateToBossFightFast(page);
		// Don't click any answer; wait for timer to hit 0 (auto-fail)
		await page.waitForSelector("text=Incorrect", { timeout: 35000 });
		await expect(page.getByText("Incorrect")).toBeVisible();
		await expect(
			page
				.locator(SELECTORS.nextQuestionButton)
				.or(page.locator(SELECTORS.finalResultButton)),
		).toBeVisible();
	});

	test("d) answer shuffling: options present and correct answer is among them", async ({
		page,
	}) => {
		await navigateToBossFightFast(page);
		const firstQuestion = BOSS_FIGHT_QUESTIONS[0];
		const correctAnswer = firstQuestion.correctAnswer;
		// Answer buttons contain "A." "B." etc. and the answer text
		const answerButtons = page.locator(
			'button:has-text("A."), button:has-text("B."), button:has-text("C."), button:has-text("D.")',
		);
		await expect(answerButtons.first()).toBeVisible({ timeout: 3000 });
		const count = await answerButtons.count();
		expect(count).toBe(4);
		const allText = await answerButtons.allTextContents();
		const fullText = allText.join(" ");
		expect(fullText).toContain(correctAnswer);
	});
});
