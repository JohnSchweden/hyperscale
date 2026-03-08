import { expect, test } from "@playwright/test";
import { navigateToPlaying } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "http://localhost:3000" });

test.describe("Stage transitions", () => {
	test("from INTRO, click Boot → PERSONALITY_SELECT (personality buttons visible)", async ({
		page,
	}) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const bootButton = page
			.locator(SELECTORS.bootButton)
			.or(page.locator(SELECTORS.bootButtonFallback));
		await bootButton.click();
		await page.waitForTimeout(300);

		const personalityButton = page.locator('button:has-text("V.E.R.A")');
		await expect(personalityButton).toBeVisible({ timeout: 3000 });
	});

	test("select personality → ROLE_SELECT (role buttons visible)", async ({
		page,
	}) => {
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

		const roleButton = page.locator('button:has-text("Software Engineer")');
		await expect(roleButton).toBeVisible({ timeout: 3000 });
	});

	test("select role → INITIALIZING then after countdown PLAYING (Debug button or card)", async ({
		page,
	}) => {
		await navigateToPlaying(page);

		await expect(page.locator(SELECTORS.debugButton)).toBeVisible({
			timeout: 10000,
		});
	});

	test("play to BOSS_FIGHT (swipe through all cards, Next ticket until boss), assert boss question visible; complete boss 3+ correct → SUMMARY", async ({
		page,
	}) => {
		test.setTimeout(60000);
		await navigateToPlaying(page);

		// Development has 2 cards; swipe left (Debug, Ignore) to avoid game over, then Next ticket to boss
		await page.click(SELECTORS.debugButton);
		await page.waitForTimeout(500);
		await page.click(SELECTORS.nextTicketButton);
		await page.waitForTimeout(500);
		await page.click('button:has-text("Ignore")');
		await page.waitForTimeout(500);
		await page.click(SELECTORS.nextTicketButton);
		await page.waitForTimeout(500);

		await page.waitForSelector("text=Boss fight", { timeout: 8000 });
		await expect(page.locator('button:has-text("A.")').first()).toBeVisible({
			timeout: 3000,
		});

		// Answer 5 questions correctly (known answers from stage-snapshots)
		const answers = [
			"Data Leakage",
			"Proxy bias",
			"Supply chain attack",
			"Workplace privacy",
			"Right of publicity",
		];
		for (let i = 0; i < answers.length; i++) {
			await page.click(`button:has-text("${answers[i]}")`);
			await page.waitForTimeout(300);
			const nextLabel =
				i < answers.length - 1
					? SELECTORS.nextQuestionButton
					: SELECTORS.finalResultButton;
			await page.click(nextLabel);
			await page.waitForTimeout(300);
		}
		await page.waitForSelector("text=Quarter survived", { timeout: 15000 });
	});
});
