import { expect, test } from "@playwright/test";
import { DEATH_ENDINGS } from "../data/deathEndings";
import { DeathType } from "../types";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "http://localhost:3000" });

async function bootToRoleSelect(page: import("@playwright/test").Page) {
	await page.goto("/");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	await page.waitForTimeout(300);
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();
	await page.waitForTimeout(300);
}

test.describe("Death types", () => {
	test.describe("BANKRUPT (budget ≤ 0)", () => {
		test("reaches GAME_OVER with Liquidated when budget exhausted", async ({
			page,
		}) => {
			await bootToRoleSelect(page);
			// Tech/AI Consultant uses MARKETING deck; first card has Launch (-15M) → bankrupt
			await page.locator('button:has-text("Tech/AI Consultant")').click();
			await page
				.locator('button:has-text("Launch")')
				.waitFor({ state: "visible", timeout: 10000 });
			await page.locator('button:has-text("Launch")').click();
			await page.waitForTimeout(500);
			await page.locator(SELECTORS.nextTicketButton).click();
			await page.waitForTimeout(500);

			await expect(
				page.getByText(DEATH_ENDINGS[DeathType.BANKRUPT].title),
			).toBeVisible({ timeout: 5000 });
			await expect(
				page.getByText(DEATH_ENDINGS[DeathType.BANKRUPT].description, {
					exact: false,
				}),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Reboot system" }),
			).toBeVisible();
		});
	});

	test.describe("AUDIT_FAILURE (boss fight fail)", () => {
		test("reaches GAME_OVER with Audit catastrophe when boss fight fails", async ({
			page,
		}) => {
			test.setTimeout(60000);
			// Full flow: Boot → personality → Software Engineer (DEVELOPMENT deck, 2 cards) → playing → boss
			await bootToRoleSelect(page);
			await page.locator('button:has-text("Software Engineer")').click();
			await page
				.locator(SELECTORS.debugButton)
				.waitFor({ state: "visible", timeout: 10000 });
			// Exhaust DEVELOPMENT deck (2 cards): Debug → Next, Ignore → Next → Boss
			await page.locator(SELECTORS.debugButton).click();
			await page.waitForTimeout(500);
			await page.locator(SELECTORS.nextTicketButton).click();
			await page.waitForTimeout(500);
			await page.locator('button:has-text("Ignore")').click();
			await page.waitForTimeout(500);
			await page.locator(SELECTORS.nextTicketButton).click();
			await page.waitForTimeout(500);
			await page.waitForSelector("text=Boss fight", { timeout: 8000 });

			// Fail by choosing wrong answers (< 3 correct). Pick wrong-answer text for each question.
			const wrongAnswers = [
				"Copyright infringement only",
				"No bias, it's just data",
				"It might be slower",
				"Only company policy, not law",
				"Fair use if it's 'transformative'",
			];
			for (let i = 0; i < wrongAnswers.length; i++) {
				await page.locator(`button:has-text("${wrongAnswers[i]}")`).click();
				await page.waitForTimeout(400);
				const nextLabel =
					i < wrongAnswers.length - 1
						? SELECTORS.nextQuestionButton
						: SELECTORS.finalResultButton;
				await page.locator(nextLabel).click();
				await page.waitForTimeout(400);
			}

			await expect(
				page.getByText(DEATH_ENDINGS[DeathType.AUDIT_FAILURE].title),
			).toBeVisible({ timeout: 8000 });
			await expect(
				page.getByText(DEATH_ENDINGS[DeathType.AUDIT_FAILURE].description, {
					exact: false,
				}),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Reboot system" }),
			).toBeVisible();
		});
	});

	test.describe("GAME_OVER screen content", () => {
		test("shows death title and Reboot system after BANKRUPT", async ({
			page,
		}) => {
			await bootToRoleSelect(page);
			await page.locator('button:has-text("Tech/AI Consultant")').click();
			await page
				.locator('button:has-text("Launch")')
				.waitFor({ state: "visible", timeout: 10000 });
			await page.locator('button:has-text("Launch")').click();
			await page.waitForTimeout(500);
			await page.locator(SELECTORS.nextTicketButton).click();
			await page.waitForTimeout(500);

			await expect(page.getByText("Liquidated")).toBeVisible({ timeout: 5000 });
			await expect(page.getByText("Reboot system")).toBeVisible();
		});
	});
});
