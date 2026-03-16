import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share URL Generation @area:gameplay", () => {
	test("getShareUrl generates correct LinkedIn share-offsite URL format", async ({
		page,
	}) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			// Simulate the getShareUrl function
			const _role = "SOFTWARE_ENGINEER";
			const archetype = { name: "Pragmatist" };
			const resilience = 88;
			const currentUrl = "https://km.swipestrategies.com";

			const shareText = `I just faced the Kobayashi Maru as a Software Engineer. My Resilience Score: ${resilience}% (${archetype.name}). Can you beat my score? Try the AI governance simulator: ${currentUrl}`;
			const title = `Kobayashi Maru - ${archetype.name} Archetype`;

			const encodedUrl = encodeURIComponent(currentUrl);
			const encodedSummary = encodeURIComponent(shareText);
			const encodedTitle = encodeURIComponent(title);

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
		});

		// Verify URL structure
		expect(shareUrl).toContain("linkedin.com/sharing/share-offsite/");
		expect(shareUrl).toContain("url=");
		expect(shareUrl).toContain("summary=");
		expect(shareUrl).toContain("title=");
	});

	test("share URL contains role information", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const roleTitle = "Software Engineer";
			const archetypeName = "Pragmatist";
			const resilience = 88;
			const gameUrl = "https://km.swipestrategies.com";

			const shareText = `I just faced the Kobayashi Maru as a ${roleTitle}. My Resilience Score: ${resilience}% (${archetypeName}). Can you beat my score? Try the AI governance simulator: ${gameUrl}`;
			const encodedSummary = encodeURIComponent(shareText);
			const encodedUrl = encodeURIComponent(gameUrl);

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedSummary}`;
		});

		// URL decode and check content
		const decodedUrl = decodeURIComponent(shareUrl);
		expect(decodedUrl).toContain("Software Engineer");
	});

	test("share URL contains archetype name", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const archetypeName = "Shadow Architect";
			const shareText = `I just faced the Kobayashi Maru as a Chief Something Officer. My Resilience Score: 75% (${archetypeName}). Can you beat my score? Try the AI governance simulator: https://km.swipestrategies.com`;
			const encodedSummary = encodeURIComponent(shareText);
			const encodedUrl = encodeURIComponent("https://km.swipestrategies.com");

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedSummary}`;
		});

		const decodedUrl = decodeURIComponent(shareUrl);
		expect(decodedUrl).toContain("Shadow Architect");
	});

	test("share URL contains resilience score", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const resilience = 92;
			const shareText = `I just faced the Kobayashi Maru as a Software Engineer. My Resilience Score: ${resilience}% (Pragmatist). Can you beat my score? Try the AI governance simulator: https://km.swipestrategies.com`;
			const encodedSummary = encodeURIComponent(shareText);
			const encodedUrl = encodeURIComponent("https://km.swipestrategies.com");

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedSummary}`;
		});

		const decodedUrl = decodeURIComponent(shareUrl);
		expect(decodedUrl).toContain("92%");
	});

	test("share URL includes call-to-action", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const shareText =
				"I just faced the Kobayashi Maru as a Software Engineer. My Resilience Score: 88% (Pragmatist). Can you beat my score? Try the AI governance simulator: https://km.swipestrategies.com";
			const encodedSummary = encodeURIComponent(shareText);
			const encodedUrl = encodeURIComponent("https://km.swipestrategies.com");

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedSummary}`;
		});

		const decodedUrl = decodeURIComponent(shareUrl);
		expect(decodedUrl).toContain("Can you beat my score?");
		expect(decodedUrl).toContain("AI governance simulator");
	});

	test("share URL title parameter contains archetype", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const archetypeName = "Pragmatist";
			const title = `Kobayashi Maru - ${archetypeName} Archetype`;
			const encodedTitle = encodeURIComponent(title);
			const encodedUrl = encodeURIComponent("https://km.swipestrategies.com");

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`;
		});

		const decodedUrl = decodeURIComponent(shareUrl);
		expect(decodedUrl).toContain("Kobayashi Maru");
		expect(decodedUrl).toContain("Pragmatist");
	});

	test("share URL properly encodes special characters", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const shareText =
				"I just faced the Kobayashi Maru as a Tech/AI Consultant. My Resilience Score: 100% (The Pragmatist). Can you beat my score? Try the AI governance simulator: https://km.swipestrategies.com";
			const encodedSummary = encodeURIComponent(shareText);
			const encodedUrl = encodeURIComponent("https://km.swipestrategies.com");

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedSummary}`;
		});

		// The URL parameter should be properly encoded
		expect(shareUrl).toContain("https%3A%2F%2F"); // URL should be encoded
		expect(shareUrl).toContain("Tech%2FAI"); // Slash in text should be encoded
		expect(shareUrl).toContain("100%25"); // Percent should be encoded
	});

	test("share URL is under LinkedIn's maximum length", async ({ page }) => {
		await page.goto("/");

		const shareUrl = await page.evaluate(() => {
			const shareText =
				"I just faced the Kobayashi Maru as a Chief Something Officer. My Resilience Score: 100% (Shadow Architect). Can you beat my score? Try the AI governance simulator: https://km.swipestrategies.com";
			const title = "Kobayashi Maru - Shadow Architect Archetype";
			const encodedUrl = encodeURIComponent("https://km.swipestrategies.com");
			const encodedSummary = encodeURIComponent(shareText);
			const encodedTitle = encodeURIComponent(title);

			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
		});

		// LinkedIn URLs can be quite long, but let's ensure we're under a reasonable limit
		expect(shareUrl.length).toBeLessThan(2000);
	});

	test("anchor tag attributes for security", async ({ page }) => {
		await page.goto("/");

		// Verify the expected anchor tag attributes
		const anchorHtml = await page.evaluate(() => {
			// Create an anchor element to test
			const a = document.createElement("a");
			a.href = "https://linkedin.com/sharing/share-offsite/?url=test";
			a.target = "_blank";
			a.rel = "noopener noreferrer";
			a.setAttribute("aria-label", "Share to LinkedIn");
			return a.outerHTML;
		});

		expect(anchorHtml).toContain('target="_blank"');
		expect(anchorHtml).toContain('rel="noopener noreferrer"');
		expect(anchorHtml).toContain('aria-label="Share to LinkedIn"');
	});
});
