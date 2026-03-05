import type { Page } from "@playwright/test";

/** Mock roast text - must include >>> as tests assert on it */
const MOCK_ROAST =
	">>> Mock roast response. Your workflow is remarkably insecure.";

/** Minimal silent WAV-like PCM (24kHz mono, ~2ms) - base64 of 96 zero bytes */
const MOCK_AUDIO_BASE64 = "A".repeat(128);

/**
 * Intercept API routes and Gemini external calls; return dummy responses.
 * Use in tests that trigger roast to avoid real Gemini API usage.
 */
export function mockRoastApi(page: Page): void {
	// Mock /api/roast
	page.route("**/api/roast", async (route) => {
		if (route.request().method() === "POST") {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ text: MOCK_ROAST }),
			});
		} else {
			await route.continue();
		}
	});

	// Mock /api/speak - return minimal silent audio
	page.route("**/api/speak", async (route) => {
		if (route.request().method() === "POST") {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ audio: MOCK_AUDIO_BASE64 }),
			});
		} else {
			await route.continue();
		}
	});

	// Block Live API so app falls back to mocked TTS
	page.route("**/*generativelanguage.googleapis.com*", (route) =>
		route.abort(),
	);
}
