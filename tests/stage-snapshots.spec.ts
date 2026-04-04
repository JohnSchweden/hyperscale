import { expect, type Page, test } from "@playwright/test";
import { DeathType } from "../src/types";
import { mockRoastApi } from "./helpers/mockApi";
import {
	navigateToBossFightFast,
	navigateToGameOverFast,
	navigateToPersonalitySelect,
	navigateToPlayingFast,
	navigateToRoleSelectFast,
} from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

/** Playing screen: open feedback if needed, then advance with Next ticket (no Debug button). */
async function openFeedbackThenClickNextTicket(page: Page) {
	const feedbackDialog = page
		.locator(SELECTORS.feedbackDialog)
		.or(page.locator(SELECTORS.feedbackDialogFallback));
	const nextBtn = page.locator(SELECTORS.nextTicketButton);
	const swipeLeft = page.getByTestId("swipe-left-button");
	const feedbackOrSwipe = feedbackDialog.or(swipeLeft);
	await feedbackOrSwipe.first().waitFor({ state: "visible", timeout: 12000 });
	if (await feedbackDialog.isVisible()) {
		await nextBtn.click({ force: true });
	} else {
		await swipeLeft.click({ force: true });
		await feedbackDialog.waitFor({ state: "visible", timeout: 15000 });
		await nextBtn.click({ force: true });
	}
	await swipeLeft.waitFor({ state: "visible", timeout: 10000 });
}

async function navigateToIntro(page: Page) {
	await page.goto("/");
}

async function navigateToInitializing(page: Page) {
	await page.goto("/");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();
	const roleButton = page.locator('button:has-text("Software Engineer")');
	await roleButton.waitFor({ state: "visible" });
	await roleButton.click();
	await page
		.getByText(/^[123]$|^Start$/)
		.waitFor({ state: "visible", timeout: 5000 });
}

/** Injected Kirk debrief page 3 — fast path for visual baseline (no boss fight). */
function kirkDebriefPage3DebugState() {
	return {
		stage: "DEBRIEF_PAGE_3",
		personality: "ROASTER",
		role: "SOFTWARE_ENGINEER",
		currentCardIndex: 3,
		hype: 50,
		heat: 30,
		budget: 5000000,
		history: [
			{ cardId: "kirk-raise", choice: "RIGHT" },
			{ cardId: "kirk-ceo", choice: "RIGHT" },
			{ cardId: "kirk-nobel", choice: "RIGHT" },
		],
		deathReason: "You changed the conditions of the test.",
		deathType: DeathType.KIRK,
		unlockedEndings: [],
		bossFightAnswers: [],
		effectiveDeck: null,
		kirkCounter: 2,
		kirkCorruptionActive: true,
	};
}

async function navigateToDebriefPage3Verdict(page: Page) {
	await page.addInitScript((stateStr: string) => {
		window.localStorage.removeItem("gameState");
		window.localStorage.setItem("km-debug-state", stateStr);
	}, JSON.stringify(kirkDebriefPage3DebugState()));
	await page.goto("/");
	await expect(page.getByText(/simulation hijacked/i)).toBeVisible({
		timeout: 8000,
	});
}

async function navigateToSummary(page: Page) {
	await navigateToBossFightFast(page);
	// Answer all 5 questions correctly to reach summary
	const answers = [
		"Data Leakage",
		"Proxy bias",
		"Supply chain attack",
		"Workplace privacy",
		"Right of publicity",
	];
	for (let i = 0; i < answers.length; i++) {
		await page.click(`button:has-text("${answers[i]}")`);
		const isLast = i === answers.length - 1;
		const nextLabel = isLast
			? SELECTORS.finalResultButton
			: SELECTORS.nextQuestionButton;
		await page.locator(nextLabel).waitFor({ state: "visible", timeout: 3000 });
		await page.click(nextLabel);
	}
	await page.waitForSelector("text=Quarter survived", { timeout: 8000 });
}

async function navigateToFeedbackOverlay(page: Page) {
	await navigateToPlayingFast(page);
	await page.getByTestId("swipe-right-button").click({ force: true });
	const feedbackDialog = page
		.locator(SELECTORS.feedbackDialog)
		.or(page.locator(SELECTORS.feedbackDialogFallback));
	await feedbackDialog.waitFor({ state: "visible", timeout: 8000 });
}

async function navigateToPlayingWithRoastAnswer(page: Page) {
	mockRoastApi(page);
	await navigateToPlayingFast(page);
	await openFeedbackThenClickNextTicket(page);
	const textarea = page.getByLabel(
		"Describe your use case / workflow for governance review",
	);
	await textarea.fill(
		"I paste production secrets into random AI tools without reading the terms.",
	);
	await page.getByRole("button", { name: /Send roast|Scanning/i }).click();
	await page
		.getByTestId("roast-output")
		.waitFor({ state: "attached", timeout: 20000 });
	await expect(page.getByTestId("roast-output")).toContainText(">>>", {
		timeout: 10000,
	});
}

test.describe("Stage visual snapshots @visual @area:gameplay @slow", () => {
	test("intro", async ({ page }) => {
		await navigateToIntro(page);
		await expect(page).toHaveScreenshot("intro.png", {
			mask: [page.getByTestId("starfield-canvas")],
		});
	});

	test("personality-select", async ({ page }) => {
		await navigateToPersonalitySelect(page);
		await expect(page).toHaveScreenshot("personality-select.png", {
			maxDiffPixelRatio: 0.03, // fade-in animation variance
		});
	});

	test("role-select", async ({ page }) => {
		await navigateToRoleSelectFast(page);
		await page
			.locator('button:has-text("Software Engineer")')
			.first()
			.waitFor({ state: "visible", timeout: 5000 });
		await expect(page).toHaveScreenshot("role-select.png", {
			maxDiffPixelRatio: 0.03, // Allow some variance for animations
		});
	});

	test("initializing", async ({ page }) => {
		await navigateToInitializing(page);
		await expect(page).toHaveScreenshot("initializing.png", {
			mask: [
				page.getByText(/^[123]$|^Start$/),
				page.locator('[style*="width"][class*="progress-shine"]'),
				page.locator(".cursor-blink"),
			],
			maxDiffPixelRatio: 0.02,
		});
	});

	test("playing", async ({ page }) => {
		await navigateToPlayingFast(page);
		await expect(page).toHaveScreenshot("playing.png", {
			mask: [
				page.getByTestId("starfield-canvas"),
				page.locator("text=/\\d{1,2}:\\d{2}/"),
				page.locator("[data-testid=urgent-countdown]"),
			],
		});
	});

	test("playing-roast-after", async ({ page }) => {
		await navigateToPlayingWithRoastAnswer(page);
		await page.getByTestId("roast-terminal").scrollIntoViewIfNeeded();
		await expect(page).toHaveScreenshot("playing-roast-after.png", {
			mask: [
				page.getByTestId("starfield-canvas"),
				page.locator("text=/\\d{1,2}:\\d{2}/"),
				page.getByTestId("roast-terminal"),
			],
			maxDiffPixelRatio: 0.15, // AI response varies; mask entire roast terminal
		});
	});

	test("playing roast con before and after", async ({ page }) => {
		mockRoastApi(page);
		await navigateToPlayingFast(page);
		await openFeedbackThenClickNextTicket(page);
		await page.getByTestId("roast-terminal").scrollIntoViewIfNeeded();
		await expect(page).toHaveScreenshot("playing-roast-before.png", {
			mask: [
				page.getByTestId("starfield-canvas"),
				page.locator("text=/\\d{1,2}:\\d{2}/"),
			],
		});
		const textarea = page.getByLabel(
			"Describe your use case / workflow for governance review",
		);
		await textarea.fill(
			"I paste production secrets into random AI tools without reading the terms.",
		);
		await page.getByRole("button", { name: /Send roast|Scanning/i }).click();
		await page
			.getByTestId("roast-output")
			.waitFor({ state: "visible", timeout: 15000 });
		await expect(page.getByTestId("roast-output")).toContainText(">>>", {
			timeout: 5000,
		});
		await page.getByTestId("roast-terminal").scrollIntoViewIfNeeded();
		await expect(page).toHaveScreenshot("playing-roast-after.png", {
			mask: [
				page.getByTestId("starfield-canvas"),
				page.locator("text=/\\d{1,2}:\\d{2}/"),
				page.getByTestId("roast-terminal"),
			],
			maxDiffPixelRatio: 0.15, // AI response varies; mask entire roast terminal
		});
	});

	test("feedback-overlay", async ({ page }) => {
		await navigateToFeedbackOverlay(page);
		await page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback))
			.first()
			.waitFor({ state: "visible", timeout: 3000 });
		await expect(page).toHaveScreenshot("feedback-overlay.png", {
			mask: [
				page.getByTestId("starfield-canvas"),
				page.locator("text=/\\d{1,2}:\\d{2}/"),
			],
			maxDiffPixelRatio: 0.02, // Allow some variance for animations
		});
	});

	test("boss-fight", async ({ page }) => {
		await navigateToBossFightFast(page);
		await page
			.locator('button:has-text("A.")')
			.first()
			.waitFor({ state: "visible", timeout: 5000 });
		await expect(page).toHaveScreenshot("boss-fight.png", {
			mask: [page.locator("text=/\\d{1,2}:\\d{2}/"), page.getByText(/\d+s/)],
			maxDiffPixelRatio: 0.05, // Allow more variance for boss fight dynamic content
		});
	});

	test("game-over", async ({ page }) => {
		await navigateToGameOverFast(page);
		await expect(page).toHaveScreenshot("game-over.png", {
			maxDiffPixelRatio: 0.05, // animate-pulse and layout variance
		});
	});

	test("summary @slow", async ({ page }) => {
		test.slow();
		test.setTimeout(180000); // Boss fight timer (30s × 5 questions + buffer)
		await navigateToSummary(page);
		await expect(page).toHaveScreenshot("summary.png", {
			mask: [page.getByTestId("starfield-canvas")],
		});
	});

	test("debrief-page-3-verdict", async ({ page }) => {
		await navigateToDebriefPage3Verdict(page);
		await expect(page).toHaveScreenshot("debrief-page-3-verdict.png", {
			mask: [page.getByTestId("starfield-canvas")],
			maxDiffPixelRatio: 0.04, // glitch text / kirk styling variance
		});
	});
});
