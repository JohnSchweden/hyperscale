import { expect, test } from "@playwright/test";
import { DEATH_ENDINGS } from "../src/data/deathEndings";
import { DeathType } from "../src/types";
import {
	navigateToBossFightFast,
	navigateToGameOverFast,
} from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Death types @area:boss @slow", () => {
	test.describe("BANKRUPT (budget ≤ 0)", () => {
		test("reaches debrief page 1 with Liquidated when budget exhausted", async ({
			page,
		}) => {
			await navigateToGameOverFast(page);

			await expect(
				page.getByText(DEATH_ENDINGS[DeathType.BANKRUPT].title),
			).toBeVisible({ timeout: 5000 });
			await expect(
				page.getByText(DEATH_ENDINGS[DeathType.BANKRUPT].description, {
					exact: false,
				}),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Debrief me" }),
			).toBeVisible();
		});
	});

	test.describe
		.skip("AUDIT_FAILURE (boss fight fail)", () => {
			test("reaches debrief page 1 with Audit catastrophe when boss fight fails", async ({
				page,
			}) => {
				test.setTimeout(60000);
				await navigateToBossFightFast(page);

				// Fail by choosing wrong answers (< 3 correct)
				const wrongAnswers = [
					"Copyright infringement only",
					"No bias, it's just data",
					"It might be slower",
					"Only company policy, not law",
					"Fair use if it's 'transformative'",
				];
				for (let i = 0; i < wrongAnswers.length; i++) {
					await page
						.locator(`button:has-text("${wrongAnswers[i]}")`)
						.click({ force: true });
					const isLastAnswer = i === wrongAnswers.length - 1;
					const nextLabel = isLastAnswer
						? SELECTORS.finalResultButton
						: SELECTORS.nextQuestionButton;
					await page
						.locator(nextLabel)
						.waitFor({ state: "visible", timeout: 2000 });
					await page.locator(nextLabel).click({ force: true });
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
					page.getByRole("button", { name: "Debrief me" }),
				).toBeVisible();
			});
		});

	test.describe("Death debrief page 1 content", () => {
		test("shows death title and Debrief Me button after BANKRUPT", async ({
			page,
		}) => {
			await navigateToGameOverFast(page);

			await expect(page.getByText("Liquidated")).toBeVisible({
				timeout: 5000,
			});
			await expect(page.getByText("Debrief me")).toBeVisible();
		});
	});
});
