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
		test("Software Engineer shows DEVELOPMENT deck (Debug / Paste or Ignore / Install)", async ({
			page,
		}) => {
			await navigateToRoleSelectFast(page);
			await page
				.locator(
					`button:has-text("${ROLE_LABELS[RoleType.SOFTWARE_ENGINEER]}")`,
				)
				.click();
			// DEVELOPMENT deck has 2 cards that can appear in any order due to shuffling
			await page
				.locator('button:has-text("Debug")')
				.or(page.locator('button:has-text("Ignore")'))
				.waitFor({ state: "visible", timeout: 10000 });
			// Check for either card's button pair
			const hasDebugPaste =
				(await page.locator('button:has-text("Debug")').count()) > 0;
			const hasIgnoreInstall =
				(await page.locator('button:has-text("Ignore")').count()) > 0;
			expect(hasDebugPaste || hasIgnoreInstall).toBe(true);
			if (hasDebugPaste) {
				await expect(page.locator('button:has-text("Paste")')).toBeVisible();
			} else {
				await expect(page.locator('button:has-text("Install")')).toBeVisible();
			}
		});

		test("Something Manager shows FINANCE deck (Enable / Disable or Use real data / Generate)", async ({
			page,
		}) => {
			await navigateToRoleSelectFast(page);
			await page
				.locator(
					`button:has-text("${ROLE_LABELS[RoleType.SOMETHING_MANAGER]}")`,
				)
				.click();
			// FINANCE deck has 2 cards that can appear in any order due to shuffling
			await page
				.locator('button:has-text("Enable")')
				.or(page.locator('button:has-text("Use real data")'))
				.waitFor({ state: "visible", timeout: 10000 });
			// Check for either card's button pair
			const hasEnableDisable =
				(await page.locator('button:has-text("Enable")').count()) > 0;
			const hasRealDataGenerate =
				(await page.locator('button:has-text("Use real data")').count()) > 0;
			expect(hasEnableDisable || hasRealDataGenerate).toBe(true);
			if (hasEnableDisable) {
				await expect(page.locator('button:has-text("Disable")')).toBeVisible();
			} else {
				await expect(page.locator('button:has-text("Generate")')).toBeVisible();
			}
		});

		test("Tech/AI Consultant shows MARKETING deck (Launch / Block or Cancel / Post)", async ({
			page,
		}) => {
			await navigateToRoleSelectFast(page);
			await page
				.locator(
					`button:has-text("${ROLE_LABELS[RoleType.TECH_AI_CONSULTANT]}")`,
				)
				.click();
			// MARKETING deck has 2 cards that can appear in any order due to shuffling
			await page
				.locator('button:has-text("Launch")')
				.or(page.locator('button:has-text("Cancel")'))
				.waitFor({ state: "visible", timeout: 10000 });
			// Check for either card's button pair
			const hasLaunchBlock =
				(await page.locator('button:has-text("Launch")').count()) > 0;
			const hasCancelPost =
				(await page.locator('button:has-text("Cancel")').count()) > 0;
			expect(hasLaunchBlock || hasCancelPost).toBe(true);
			if (hasLaunchBlock) {
				await expect(page.locator('button:has-text("Block")')).toBeVisible();
			} else {
				await expect(page.locator('button:has-text("Post")')).toBeVisible();
			}
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
