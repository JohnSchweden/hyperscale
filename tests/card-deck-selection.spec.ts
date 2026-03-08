import { expect, test } from "@playwright/test";
import { ROLE_DECK_ALIASES, ROLE_LABELS } from "../data/roles";
import { RoleType } from "../types";
import {
	navigateToPlayingWithRoleFast,
	navigateToRoleSelectFast,
} from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Card deck selection @smoke @area:gameplay", () => {
	test.describe("Role → deck mapping", () => {
		test("Software Engineer shows DEVELOPMENT deck (Debug / Paste)", async ({
			page,
		}) => {
			await navigateToRoleSelectFast(page);
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
			await navigateToRoleSelectFast(page);
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
			await navigateToRoleSelectFast(page);
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
				await navigateToPlayingWithRoleFast(page, role);
				await expect(
					page.locator(SELECTORS.card).or(page.locator(SELECTORS.cardFallback)),
				).toHaveCount(1, { timeout: 2000 });
			});
		}
	});
});
