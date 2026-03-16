import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("V2 Waitlist API @area:gameplay", () => {
	test("POST /api/v2-waitlist returns 200 for valid payload", async ({
		request,
	}) => {
		const response = await request.post("/api/v2-waitlist", {
			data: {
				email: "test@example.com",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			},
		});

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.success).toBe(true);
		expect(body.message).toContain("Thank you for joining");
	});

	test("POST /api/v2-waitlist returns 400 for invalid email", async ({
		request,
	}) => {
		const response = await request.post("/api/v2-waitlist", {
			data: {
				email: "invalid-email",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			},
		});

		expect(response.status()).toBe(400);
		const body = await response.json();
		expect(body.error).toContain("Invalid email");
	});

	test("POST /api/v2-waitlist returns 405 for GET requests", async ({
		request,
	}) => {
		const response = await request.get("/api/v2-waitlist");
		expect(response.status()).toBe(405);
		const body = await response.json();
		expect(body.error).toContain("Method not allowed");
	});

	test("POST /api/v2-waitlist returns 400 for missing required fields", async ({
		request,
	}) => {
		const response = await request.post("/api/v2-waitlist", {
			data: {
				email: "test@example.com",
				// Missing role, archetype, resilience, timestamp
			},
		});

		expect(response.status()).toBe(400);
	});

	test("POST /api/v2-waitlist accepts different archetypes", async ({
		request,
	}) => {
		const archetypes = ["PRAGMATIST", "IDEALIST", "SURVIVOR", "PRINCIPLED"];

		for (const archetype of archetypes) {
			const response = await request.post("/api/v2-waitlist", {
				data: {
					email: `test-${archetype.toLowerCase()}@example.com`,
					role: "SOFTWARE_ENGINEER",
					archetype,
					resilience: 75,
					timestamp: Date.now(),
				},
			});

			expect(response.status()).toBe(200);
			const body = await response.json();
			expect(body.success).toBe(true);
		}
	});
});
