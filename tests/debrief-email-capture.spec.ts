import { expect, test } from "@playwright/test";

test.describe("Email Capture Form @smoke", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the debrief page 3 where email form appears
		// This assumes we can navigate to the debrief state directly or through gameplay
		await page.goto("/");
		// Set up game state to reach debrief page 3
		await page.evaluate(() => {
			localStorage.setItem(
				"gameState",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_3",
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					hype: 50,
					heat: 30,
					budget: 50000,
					currentCardIndex: 0,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});
		await page.reload();
	});

	test("renders email form on debrief page 3", async ({ page }) => {
		// Wait for the email form to be visible
		const emailInput = page.locator('input[type="email"]');
		await expect(emailInput).toBeVisible();

		// Check for submit button
		const submitButton = page.locator('button:has-text("Join V2 Waitlist")');
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeDisabled();
	});

	test("enables submit button when valid email is entered", async ({
		page,
	}) => {
		const emailInput = page.locator('input[type="email"]');
		const submitButton = page.locator('button:has-text("Join V2 Waitlist")');

		// Initially disabled
		await expect(submitButton).toBeDisabled();

		// Enter valid email
		await emailInput.fill("test@example.com");

		// Button should now be enabled
		await expect(submitButton).toBeEnabled();
	});

	test("shows validation error for invalid email", async ({ page }) => {
		const emailInput = page.locator('input[type="email"]');
		const submitButton = page.locator('button:has-text("Join V2 Waitlist")');

		// Enter invalid email and try to submit
		await emailInput.fill("invalid-email");

		// Click submit (if somehow enabled) or use keyboard
		await emailInput.press("Enter");

		// Wait a moment for validation
		await page.waitForTimeout(100);

		// Should show error message
		const errorMessage = page.locator("text=Please enter a valid email");
		await expect(errorMessage).toBeVisible();
	});

	test("displays success message after valid submission", async ({ page }) => {
		// Mock the API endpoint
		await page.route("/api/v2-waitlist", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ success: true }),
			});
		});

		const emailInput = page.locator('input[type="email"]');
		const submitButton = page.locator('button:has-text("Join V2 Waitlist")');

		// Enter valid email and submit
		await emailInput.fill("test@example.com");
		await submitButton.click();

		// Wait for success message
		const successMessage = page.locator("text=Email received. V2 is coming.");
		await expect(successMessage).toBeVisible();

		// Email input should be read-only
		await expect(emailInput).toHaveAttribute("readonly", "");

		// Button should show "Joined"
		const joinedButton = page.locator('button:has-text("Joined")');
		await expect(joinedButton).toBeVisible();
	});

	test("displays error message on API failure", async ({ page }) => {
		// Mock the API endpoint to fail
		await page.route("/api/v2-waitlist", async (route) => {
			await route.fulfill({
				status: 500,
				contentType: "application/json",
				body: JSON.stringify({ error: "Server error" }),
			});
		});

		const emailInput = page.locator('input[type="email"]');
		const submitButton = page.locator('button:has-text("Join V2 Waitlist")');

		// Enter valid email and submit
		await emailInput.fill("test@example.com");
		await submitButton.click();

		// Wait for error message
		const errorMessage = page.locator("text=Something went wrong");
		await expect(errorMessage).toBeVisible();
	});

	test("shows loading state during submission", async ({ page }) => {
		// Mock the API endpoint with delay
		await page.route("/api/v2-waitlist", async (route) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ success: true }),
			});
		});

		const emailInput = page.locator('input[type="email"]');
		const submitButton = page.locator('button:has-text("Join V2 Waitlist")');

		// Enter valid email and submit
		await emailInput.fill("test@example.com");
		await submitButton.click();

		// Button should show loading text
		const loadingButton = page.locator('button:has-text("Joining...")');
		await expect(loadingButton).toBeVisible();
		await expect(loadingButton).toBeDisabled();
	});
});
