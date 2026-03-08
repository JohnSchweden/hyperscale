import { expect, test } from "@playwright/test";
import { ROLE_DECK_ALIASES, ROLE_LABELS } from "../data/roles";
import { RoleType } from "../types";
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

test.describe("Card deck selection", () => {
	test.describe("Role → deck mapping", () => {
		test("Software Engineer shows DEVELOPMENT deck (Debug / Paste)", async ({
			page,
		}) => {
			await bootToRoleSelect(page);
			await page
				.locator(
					`button:has-text("${ROLE_LABELS[RoleType.SOFTWARE_ENGINEER]}")`,
				)
				.click();
			await page
				.locator('button:has-text("Debug")')
				.waitFor({ state: "visible", timeout: 10000 });
			await expect(page.locator('button:has-text("Paste")')).toBeVisible();
			await expect(page.locator('button:has-text("Debug")')).toBeVisible();
		});

		test("Something Manager shows FINANCE deck (Enable / Disable)", async ({
			page,
		}) => {
			await bootToRoleSelect(page);
			await page
				.locator(
					`button:has-text("${ROLE_LABELS[RoleType.SOMETHING_MANAGER]}")`,
				)
				.click();
			await page
				.locator('button:has-text("Enable")')
				.waitFor({ state: "visible", timeout: 10000 });
			await expect(page.locator('button:has-text("Disable")')).toBeVisible();
			await expect(page.locator('button:has-text("Enable")')).toBeVisible();
		});

		test("Tech/AI Consultant shows MARKETING deck (Launch / Block)", async ({
			page,
		}) => {
			await bootToRoleSelect(page);
			await page
				.locator(
					`button:has-text("${ROLE_LABELS[RoleType.TECH_AI_CONSULTANT]}")`,
				)
				.click();
			await page
				.locator('button:has-text("Launch")')
				.waitFor({ state: "visible", timeout: 10000 });
			await expect(page.locator('button:has-text("Block")')).toBeVisible();
			await expect(page.locator('button:has-text("Launch")')).toBeVisible();
		});
	});

	test.describe("All 10 roles reach PLAYING with card content", () => {
		for (const role of Object.values(RoleType)) {
			const label = ROLE_LABELS[role];
			const deck = ROLE_DECK_ALIASES[role];
			test(`${label} (${deck}) reaches PLAYING with card`, async ({ page }) => {
				await bootToRoleSelect(page);
				await page.locator(`button:has-text("${label}")`).click();
				// Wait for playing: card or primary left swipe button (data-testid only to avoid regex selector)
				await page
					.locator(SELECTORS.card)
					.first()
					.waitFor({ state: "visible", timeout: 10000 });
				await expect(
					page.locator(SELECTORS.card).or(page.locator(SELECTORS.cardFallback)),
				).toHaveCount(1, { timeout: 2000 });
			});
		}
	});
});
