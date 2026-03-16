import { expect, test } from "@playwright/test";
import { RoleType } from "../types";
import {
	navigateToPlaying,
	navigateToPlayingWithCardAtIndex,
} from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

/**
 * Voice Playback Integration Tests
 *
 * These tests verify that audio plays at the correct times during gameplay
 * by monitoring console logs from the voice playback system.
 */

test.describe("Voice Playback Integration @integration @area:audio", () => {
	test.describe("Stage Transition Audio", () => {
		test("plays onboarding audio after selecting Roaster personality", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			// Navigate through to role select
			await page.goto("/");
			await page
				.locator('button:has-text("Boot System")')
				.first()
				.waitFor({ state: "visible", timeout: 5000 });
			await page.click('button:has-text("Boot System")');
			await page
				.locator('button:has-text("V.E.R.A")')
				.waitFor({ state: "visible" });
			await page.click('button:has-text("V.E.R.A")');
			await page
				.locator('button:has-text("Software Engineer")')
				.waitFor({ state: "visible", timeout: 5000 });

			// Verify onboarding audio loaded for roaster
			const voiceLoad = consoleMessages.find(
				(msg) =>
					msg.includes("[Voice] Loading:") &&
					msg.includes("roaster/onboarding"),
			);
			expect(voiceLoad).toBeDefined();
		});

		test("plays onboarding audio after selecting Zen Master personality", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			await page.goto("/");
			await page
				.locator('button:has-text("Boot System")')
				.first()
				.waitFor({ state: "visible", timeout: 5000 });
			await page.click('button:has-text("Boot System")');
			await page
				.locator('button:has-text("BAMBOO")')
				.waitFor({ state: "visible" });
			await page.click('button:has-text("BAMBOO")');
			await page
				.locator('button:has-text("Software Engineer")')
				.waitFor({ state: "visible", timeout: 5000 });

			// Verify onboarding audio loaded for zenmaster
			const voiceLoad = consoleMessages.find(
				(msg) =>
					msg.includes("[Voice] Loading:") &&
					msg.includes("zenmaster/onboarding"),
			);
			expect(voiceLoad).toBeDefined();
		});

		test("plays onboarding audio after selecting Lovebomber personality", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			await page.goto("/");
			await page
				.locator('button:has-text("Boot System")')
				.first()
				.waitFor({ state: "visible", timeout: 5000 });
			await page.click('button:has-text("Boot System")');
			await page
				.locator('button:has-text("HYPE-BRO")')
				.waitFor({ state: "visible" });
			await page.click('button:has-text("HYPE-BRO")');
			await page
				.locator('button:has-text("Software Engineer")')
				.waitFor({ state: "visible", timeout: 5000 });

			// Verify onboarding audio loaded for lovebomber
			const voiceLoad = consoleMessages.find(
				(msg) =>
					msg.includes("[Voice] Loading:") &&
					msg.includes("lovebomber/onboarding"),
			);
			expect(voiceLoad).toBeDefined();
		});
	});

	test.describe("Feedback Audio (Roaster Only)", () => {
		test.describe
			.serial("feedback voice triggers", () => {
				test("plays feedback_debug audio when choosing Debug (LEFT)", async ({
					page,
				}) => {
					const consoleMessages: string[] = [];
					page.on("console", (msg) => consoleMessages.push(msg.text()));

					// Use deterministic navigation to ensure dev_1 is first (unshuffled)
					await navigateToPlayingWithCardAtIndex(
						page,
						RoleType.SOFTWARE_ENGINEER,
						0,
					);

					await page
						.locator(SELECTORS.leftButton)
						.first()
						.click({ force: true });
					await expect(page.locator(SELECTORS.nextTicketButton)).toBeVisible({
						timeout: 5000,
					});

					await expect
						.poll(
							() =>
								consoleMessages.some((msg) =>
									msg.includes("[Feedback] Playing voice: feedback_debug"),
								),
							{ timeout: 3000 },
						)
						.toBe(true);

					expect(
						consoleMessages.some(
							(msg) =>
								msg.includes("[Voice] Loading:") &&
								msg.includes("roaster/feedback_debug"),
						),
					).toBe(true);
				});

				test("plays feedback_paste audio when choosing Paste (RIGHT)", async ({
					page,
				}) => {
					const consoleMessages: string[] = [];
					page.on("console", (msg) => consoleMessages.push(msg.text()));

					// Use deterministic navigation to ensure dev_1 is first (unshuffled)
					await navigateToPlayingWithCardAtIndex(
						page,
						RoleType.SOFTWARE_ENGINEER,
						0,
					);

					await page
						.locator(SELECTORS.rightButton)
						.first()
						.click({ force: true });
					await expect(page.locator(SELECTORS.nextTicketButton)).toBeVisible({
						timeout: 5000,
					});

					await expect
						.poll(
							() =>
								consoleMessages.some((msg) =>
									msg.includes("[Feedback] Playing voice: feedback_paste"),
								),
							{ timeout: 3000 },
						)
						.toBe(true);

					expect(
						consoleMessages.some(
							(msg) =>
								msg.includes("[Voice] Loading:") &&
								msg.includes("roaster/feedback_paste"),
						),
					).toBe(true);
				});
			});
	});

	test.describe("Audio File Existence", () => {
		test("successfully loads onboarding audio file (HTTP 200)", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			await page.goto("/");
			await page
				.locator('button:has-text("Boot System")')
				.first()
				.waitFor({ state: "visible", timeout: 5000 });
			await page.click('button:has-text("Boot System")');
			await page
				.locator('button:has-text("V.E.R.A")')
				.waitFor({ state: "visible" });
			await page.click('button:has-text("V.E.R.A")');
			await page
				.locator('button:has-text("Software Engineer")')
				.waitFor({ state: "visible", timeout: 5000 });

			// Onboarding loads when ROLE_SELECT is reached; allow time for fetch + log
			await expect
				.poll(
					() =>
						consoleMessages.some((msg) =>
							msg.includes("[Voice] Response status: 200"),
						),
					{ timeout: 5000 },
				)
				.toBe(true);
		});
	});
});
