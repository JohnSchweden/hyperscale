import { expect, test } from "@playwright/test";
import { navigateToPlaying, navigateToPlayingFast } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Stage transitions", () => {
	test("from INTRO, click Boot → PERSONALITY_SELECT (personality buttons visible)", async ({
		page,
	}) => {
		await page.goto("/");
		const bootButton = page
			.locator(SELECTORS.bootButton)
			.or(page.locator(SELECTORS.bootButtonFallback));
		await bootButton.first().waitFor({ state: "visible", timeout: 5000 });
		await bootButton.click();

		const personalityButton = page.locator('button:has-text("V.E.R.A")');
		await expect(personalityButton).toBeVisible({ timeout: 3000 });
	});

	test("select personality → ROLE_SELECT (role buttons visible)", async ({
		page,
	}) => {
		await page.goto("/");
		const bootButton = page
			.locator(SELECTORS.bootButton)
			.or(page.locator(SELECTORS.bootButtonFallback));
		await bootButton.first().waitFor({ state: "visible", timeout: 5000 });
		await bootButton.click();

		const personalityButton = page.locator('button:has-text("V.E.R.A")');
		await personalityButton.waitFor({ state: "visible" });
		await personalityButton.click();

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
		await navigateToPlayingFast(page);

		// Development has 2 cards; swipe left (Debug, Ignore) to avoid game over, then Next ticket to boss
		await page.locator(SELECTORS.debugButton).click({ force: true });
		const nextBtn = page.locator(SELECTORS.nextTicketButton);
		await nextBtn.waitFor({ state: "visible", timeout: 5000 });
		await nextBtn.click({ force: true });

		await page
			.locator('button:has-text("Ignore")')
			.waitFor({ state: "visible", timeout: 5000 });
		await page.locator('button:has-text("Ignore")').click({ force: true });
		await nextBtn.waitFor({ state: "visible", timeout: 5000 });
		await nextBtn.click({ force: true });

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
			const nextLabel =
				i < answers.length - 1
					? SELECTORS.nextQuestionButton
					: SELECTORS.finalResultButton;
			await page
				.locator(nextLabel)
				.waitFor({ state: "visible", timeout: 3000 });
			await page.click(nextLabel);
		}
		await page.waitForSelector("text=Quarter survived", { timeout: 15000 });
	});
});
