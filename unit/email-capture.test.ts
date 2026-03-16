import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEmailCapture } from "../hooks/useEmailCapture";
import type { V2WaitlistPayload } from "../types";

describe("V2WaitlistPayload Type", () => {
	it("should define V2WaitlistPayload interface correctly", () => {
		const payload: V2WaitlistPayload = {
			email: "test@example.com",
			role: "SOFTWARE_ENGINEER",
			archetype: "PRAGMATIST",
			resilience: 75,
			timestamp: Date.now(),
		};

		expect(payload.email).toBe("test@example.com");
		expect(payload.role).toBe("SOFTWARE_ENGINEER");
		expect(payload.archetype).toBe("PRAGMATIST");
		expect(payload.resilience).toBe(75);
		expect(typeof payload.timestamp).toBe("number");
	});
});

describe("useEmailCapture Hook", () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
		// Reset fetch mock
		global.fetch = vi.fn();
	});

	it("should return initial state correctly", () => {
		const { result } = renderHook(() =>
			useEmailCapture({
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
			}),
		);

		expect(result.current.email).toBe("");
		expect(result.current.isSubmitting).toBe(false);
		expect(result.current.error).toBeNull();
		expect(result.current.success).toBe(false);
		expect(typeof result.current.setEmail).toBe("function");
		expect(typeof result.current.submit).toBe("function");
	});

	it("should update email state via setEmail", () => {
		const { result } = renderHook(() =>
			useEmailCapture({
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
			}),
		);

		act(() => {
			result.current.setEmail("test@example.com");
		});

		expect(result.current.email).toBe("test@example.com");
	});

	describe("Email Validation", () => {
		it("should reject empty email", async () => {
			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.error).toBe("Please enter a valid email address");
			expect(result.current.success).toBe(false);
		});

		it("should reject email without @", async () => {
			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("invalid-email");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.error).toBe("Please enter a valid email address");
			expect(result.current.success).toBe(false);
		});

		it("should reject email without domain", async () => {
			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.error).toBe("Please enter a valid email address");
			expect(result.current.success).toBe(false);
		});

		it("should reject email without dot in domain", async () => {
			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.error).toBe("Please enter a valid email address");
			expect(result.current.success).toBe(false);
		});

		it("should accept valid email format", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.error).toBeNull();
			expect(mockFetch).toHaveBeenCalled();
		});
	});

	describe("Form Submission", () => {
		it("should POST to /api/v2-waitlist with correct payload", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(mockFetch).toHaveBeenCalledWith("/api/v2-waitlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: expect.stringContaining("test@example.com"),
			});

			const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
			expect(callBody).toMatchObject({
				email: "test@example.com",
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
			});
			expect(typeof callBody.timestamp).toBe("number");
		});

		it("should set isSubmitting during submission", async () => {
			const mockFetch = vi
				.fn()
				.mockImplementation(
					() =>
						new Promise((resolve) =>
							setTimeout(
								() => resolve({ ok: true, json: () => ({ success: true }) }),
								100,
							),
						),
				);
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			let submitPromise: Promise<void>;
			act(() => {
				submitPromise = result.current.submit();
			});

			// Should be submitting immediately
			expect(result.current.isSubmitting).toBe(true);

			await act(async () => {
				await submitPromise;
			});

			// Should not be submitting after completion
			expect(result.current.isSubmitting).toBe(false);
		});

		it("should set success=true on successful submission", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.success).toBe(true);
			expect(result.current.error).toBeNull();
		});

		it("should clear email on success", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.email).toBe("");
		});

		it("should store success in localStorage", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(localStorage.getItem("v2-waitlist-submitted")).toBe("true");
		});

		it("should handle network errors", async () => {
			const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.success).toBe(false);
			expect(result.current.error).toBe(
				"Something went wrong. Please try again.",
			);
		});

		it("should handle 4xx/5xx responses", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ error: "Invalid email" }),
			});
			global.fetch = mockFetch;

			const { result } = renderHook(() =>
				useEmailCapture({
					role: "SOFTWARE_ENGINEER",
					archetype: "PRAGMATIST",
					resilience: 75,
				}),
			);

			act(() => {
				result.current.setEmail("test@example.com");
			});

			await act(async () => {
				await result.current.submit();
			});

			expect(result.current.success).toBe(false);
			expect(result.current.error).toBe(
				"Something went wrong. Please try again.",
			);
		});
	});

	describe("Memoization", () => {
		it("should return same functions on re-render with same props", () => {
			const { result, rerender } = renderHook(
				(props) => useEmailCapture(props),
				{
					initialProps: {
						role: "SOFTWARE_ENGINEER",
						archetype: "PRAGMATIST",
						resilience: 75,
					},
				},
			);

			const firstSetEmail = result.current.setEmail;
			const firstSubmit = result.current.submit;

			rerender({
				role: "SOFTWARE_ENGINEER",
				archetype: "PRAGMATIST",
				resilience: 75,
			});

			expect(result.current.setEmail).toBe(firstSetEmail);
			expect(result.current.submit).toBe(firstSubmit);
		});
	});
});
