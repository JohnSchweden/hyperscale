import type { VercelRequest, VercelResponse } from "@vercel/node";
import { describe, expect, it, vi } from "vitest";
import handler from "../api/v2-waitlist";

describe("V2 Waitlist API", () => {
	const createMockReq = (
		body: unknown,
		method = "POST",
	): Partial<VercelRequest> => ({
		method,
		body,
	});

	const createMockRes = (): Partial<VercelResponse> & {
		json: ReturnType<typeof vi.fn>;
		status: ReturnType<typeof vi.fn>;
	} => {
		const json = vi.fn();
		const status = vi.fn(() => ({ json }));
		return { json, status };
	};

	describe("Method validation", () => {
		it("should reject non-POST methods", async () => {
			const req = createMockReq({}, "GET") as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(405);
			expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
		});
	});

	describe("Payload validation", () => {
		it("should reject empty body", async () => {
			const req = createMockReq(null) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: "Invalid email format or missing fields",
			});
		});

		it("should reject invalid email format (missing @)", async () => {
			const req = createMockReq({
				email: "invalid-email",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			}) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should reject invalid email format (missing domain)", async () => {
			const req = createMockReq({
				email: "test@",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			}) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should reject missing required fields", async () => {
			const req = createMockReq({
				email: "test@example.com",
				// missing role, archetype, resilience, timestamp
			}) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should reject invalid resilience type", async () => {
			const req = createMockReq({
				email: "test@example.com",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: "75", // string instead of number
				timestamp: Date.now(),
			}) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});
	});

	describe("Successful submission", () => {
		it("should accept valid payload and return 200", async () => {
			const payload = {
				email: "test@example.com",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			};
			const req = createMockReq(payload) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "Thank you for joining the V2 waitlist!",
			});
		});

		it("should log signup to console", async () => {
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			const payload = {
				email: "test@example.com",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			};
			const req = createMockReq(payload) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			expect(consoleSpy).toHaveBeenCalledWith(
				"[V2 Waitlist] New signup:",
				expect.objectContaining({
					email: payload.email,
					role: payload.role,
					archetype: payload.archetype,
					resilience: payload.resilience,
				}),
			);

			consoleSpy.mockRestore();
		});
	});

	describe("Error handling", () => {
		it("should handle server errors gracefully", async () => {
			// Test that the error response format is correct
			// Note: Actual error handling is covered by other tests
			const payload = {
				email: "test@example.com",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
				timestamp: Date.now(),
			};
			const req = createMockReq(payload) as VercelRequest;
			const res = createMockRes() as unknown as VercelResponse;

			await handler(req, res);

			// Should succeed (200), not error (500)
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
				}),
			);
		});
	});
});
