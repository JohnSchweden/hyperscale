import { expect, test } from "@playwright/test";
import { navigateToPlaying } from "./helpers/navigation";

/**
 * Voice Playback Integration Tests
 *
 * These tests verify that audio plays at the correct times during gameplay
 * by monitoring console logs from the voice playback system.
 */

test.describe("Voice Playback Integration", () => {
	test.describe("Stage Transition Audio", () => {
		test("plays onboarding audio after selecting Roaster personality", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			// Navigate through to role select
			await page.goto("/");
			await page.waitForLoadState("networkidle");
			await page.click('button:has-text("Boot System")');
			await page.waitForTimeout(300);
			await page.click('button:has-text("V.E.R.A")');
			await page.waitForTimeout(500);

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
			await page.waitForLoadState("networkidle");
			await page.click('button:has-text("Boot System")');
			await page.waitForTimeout(300);
			await page.click('button:has-text("BAMBOO")');
			await page.waitForTimeout(500);

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
			await page.waitForLoadState("networkidle");
			await page.click('button:has-text("Boot System")');
			await page.waitForTimeout(300);
			await page.click('button:has-text("HYPE-BRO")');
			await page.waitForTimeout(500);

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
		test("plays feedback_debug audio when choosing Debug (LEFT)", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			// Navigate to playing stage (Roaster + Development)
			await navigateToPlaying(page);

			// Click Debug (left choice for dev_1 card)
			await page.click('button:has-text("Debug")');
			await page.waitForTimeout(1000);

			// Verify feedback audio loaded
			const feedbackLog = consoleMessages.find((msg) =>
				msg.includes("[Feedback] Playing voice: feedback_debug"),
			);
			expect(feedbackLog).toBeDefined();

			const voiceLoad = consoleMessages.find(
				(msg) =>
					msg.includes("[Voice] Loading:") &&
					msg.includes("roaster/feedback_debug"),
			);
			expect(voiceLoad).toBeDefined();
		});

		test("plays feedback_paste audio when choosing Paste (RIGHT)", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			await navigateToPlaying(page);

			// Click Paste (right choice for dev_1 card)
			await page.click('button:has-text("Paste")');
			await page.waitForTimeout(1000);

			// Verify feedback audio loaded
			const feedbackLog = consoleMessages.find((msg) =>
				msg.includes("[Feedback] Playing voice: feedback_paste"),
			);
			expect(feedbackLog).toBeDefined();

			const voiceLoad = consoleMessages.find(
				(msg) =>
					msg.includes("[Voice] Loading:") &&
					msg.includes("roaster/feedback_paste"),
			);
			expect(voiceLoad).toBeDefined();
		});
	});

	test.describe("Audio File Existence", () => {
		test("successfully loads onboarding audio file (HTTP 200)", async ({
			page,
		}) => {
			const consoleMessages: string[] = [];
			page.on("console", (msg) => consoleMessages.push(msg.text()));

			await page.goto("/");
			await page.waitForLoadState("networkidle");
			await page.click('button:has-text("Boot System")');
			await page.waitForTimeout(300);
			await page.click('button:has-text("V.E.R.A")');
			await page.waitForTimeout(1000);

			// Verify audio file was found (HTTP 200)
			const responseLog = consoleMessages.find((msg) =>
				msg.includes("[Voice] Response status: 200"),
			);
			expect(responseLog).toBeDefined();
		});
	});
});
