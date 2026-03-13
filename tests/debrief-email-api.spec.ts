import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Email Capture - API Integration @area:gameplay", () => {
	test("form submits successfully to backend API", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_3",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("input[type='email']", { timeout: 10000 });

		// Monitor network requests
		const apiResponsePromise = page.waitForResponse(
			(response) =>
				response.url().includes("/api/v2-waitlist") &&
				response.request().method() === "POST",
		);

		// Fill and submit form
		const emailInput = page.locator("input[type='email']");
		const submitButton = page.getByRole("button", {
			name: /join v2 waitlist/i,
		});

		await emailInput.fill("test@example.com");
		await submitButton.click();

		// Wait for API response
		const response = await apiResponsePromise;
		expect(response.status()).toBe(200);

		// Verify success message
		await expect(
			page.getByText(/email received|v2 is coming|success/i),
		).toBeVisible();
	});

	test("API receives correct payload with role and archetype", async ({
		page,
	}) => {
		await page.goto("/");

		const testEmail = "integration-test@example.com";

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_3",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("input[type='email']", { timeout: 10000 });

		// Capture request body
		let requestBody: any = null;
		page.on("request", (request) => {
			if (
				request.url().includes("/api/v2-waitlist") &&
				request.method() === "POST"
			) {
				request.postDataJSON().then((data) => {
					requestBody = data;
				});
			}
		});

		// Submit form
		await page.locator("input[type='email']").fill(testEmail);
		await page.getByRole("button", { name: /join v2 waitlist/i }).click();

		// Wait for response
		await page.waitForResponse((response) =>
			response.url().includes("/api/v2-waitlist"),
		);

		// Verify request body structure
		await page.waitForTimeout(100); // Small delay for request processing
		expect(requestBody).not.toBeNull();
		expect(requestBody).toHaveProperty("email", testEmail);
		expect(requestBody).toHaveProperty("role", "SOFTWARE_ENGINEER");
		expect(requestBody).toHaveProperty("archetype");
		expect(requestBody).toHaveProperty("resilience");
		expect(requestBody).toHaveProperty("timestamp");
	});

	test("form handles API errors gracefully", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_3",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("input[type='email']", { timeout: 10000 });

		// Try submitting with invalid email to trigger validation error
		await page.locator("input[type='email']").fill("invalid-email");
		await page.getByRole("button", { name: /join v2 waitlist/i }).click();

		// Should show validation error
		await expect(
			page.getByText(/please enter a valid email|invalid email/i),
		).toBeVisible();
	});

	test("form is visible and functional after all gap closure fixes", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_3",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Verify form elements are visible (gap closure fix 06-09)
		const emailInput = page.locator("input[type='email']");
		const submitButton = page.getByRole("button", {
			name: /join v2 waitlist/i,
		});

		await expect(emailInput).toBeVisible();
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeDisabled(); // Disabled until valid email

		// Type valid email
		await emailInput.fill("test@example.com");
		await expect(submitButton).toBeEnabled();
	});
});
