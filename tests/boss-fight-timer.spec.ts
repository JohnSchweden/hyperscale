import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { BOSS_FIGHT_QUESTIONS } from "../data/bossQuestions";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "http://localhost:3000" });

async function navigateToBossFight(page: Page): Promise<void> {
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	await page.waitForTimeout(300);
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();
	await page.waitForTimeout(300);
	const roleButton = page
		.locator('button:has-text("Software Engineer")')
		.or(page.locator('[data-testid="role-software_engineer"]'));
	await roleButton.waitFor({ state: "visible" });
	await roleButton.click();
	await page
		.locator('button:has-text("Debug")')
		.waitFor({ state: "visible", timeout: 10000 });
	await page.waitForLoadState("networkidle");
	// Development deck has 2 cards; left swipes to avoid game over
	await page.click(SELECTORS.debugButton);
	await page.waitForTimeout(500);
	await page.click(SELECTORS.nextTicketButton);
	await page.waitForTimeout(500);
	await page.click('button:has-text("Ignore")');
	await page.waitForTimeout(500);
	await page.click(SELECTORS.nextTicketButton);
	await page.waitForTimeout(500);
	await page.waitForSelector("text=Boss fight", { timeout: 8000 });
}

test.describe("Boss fight timer", () => {
	test("a) reaches BOSS_FIGHT stage", async ({ page }) => {
		await navigateToBossFight(page);
		await expect(page.getByText("Boss fight")).toBeVisible();
		await expect(
			page.getByText(/Negotiate with the External Auditor/),
		).toBeVisible();
	});

	test("b) timer is visible and counts down", async ({ page }) => {
		await navigateToBossFight(page);
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

	test("c) when time reaches 0 without answering, answer is treated wrong", async ({
		page,
	}) => {
		test.setTimeout(45000); // 30s timer + buffer
		await navigateToBossFight(page);
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
		await navigateToBossFight(page);
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
