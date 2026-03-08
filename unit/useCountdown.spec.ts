import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCountdown } from "../hooks/useCountdown";

describe("useCountdown", () => {
	it("should initialize with startFrom value", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useCountdown({ startFrom: 5, onComplete, isActive: false }),
		);

		expect(result.current.count).toBe(5);
	});

	it("should not start countdown when isActive is false", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useCountdown({ startFrom: 3, onComplete, isActive: false }),
		);

		// Should remain at startFrom
		expect(result.current.count).toBe(3);
	});

	it("should initialize with startFrom when isActive is true", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useCountdown({ startFrom: 5, onComplete, isActive: true }),
		);

		// Initially should be startFrom
		expect(result.current.count).toBe(5);
	});

	it("should decrement count over time when isActive is true", async () => {
		vi.useFakeTimers();
		try {
			const onComplete = vi.fn();
			const { result } = renderHook(() =>
				useCountdown({ startFrom: 3, onComplete, isActive: true }),
			);

			// Initially should be startFrom
			expect(result.current.count).toBe(3);

			// Advance timer by 1 second - should decrement
			await act(async () => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.count).toBe(2);

			// Advance timer by another second
			await act(async () => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.count).toBe(1);

			// Advance timer by another second - should reach 0 and reset
			await act(async () => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.count).toBe(3); // Reset to startFrom after completion
		} finally {
			vi.useRealTimers();
		}
	});

	it("should provide reset function", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useCountdown({ startFrom: 5, onComplete, isActive: true }),
		);

		expect(result.current.reset).toBeDefined();
		expect(typeof result.current.reset).toBe("function");

		// Reset should set count back to startFrom
		act(() => {
			result.current.reset();
		});

		expect(result.current.count).toBe(5);
	});

	it("should reset count when isActive changes to false after countdown started", async () => {
		vi.useFakeTimers();
		try {
			const onComplete = vi.fn();
			const { result, rerender } = renderHook(
				({ isActive }) => useCountdown({ startFrom: 5, onComplete, isActive }),
				{ initialProps: { isActive: true } },
			);

			// Initially active
			expect(result.current.count).toBe(5);

			// Let countdown decrement
			await act(async () => {
				vi.advanceTimersByTime(2000);
			});

			// Verify countdown has actually decremented
			expect(result.current.count).toBeLessThan(5);

			// Deactivate - should reset to startFrom
			rerender({ isActive: false });
			expect(result.current.count).toBe(5);
		} finally {
			vi.useRealTimers();
		}
	});

	it("should reset when startFrom changes", () => {
		const onComplete = vi.fn();
		const { result, rerender } = renderHook(
			({ startFrom }) =>
				useCountdown({ startFrom, onComplete, isActive: false }),
			{ initialProps: { startFrom: 5 } },
		);

		expect(result.current.count).toBe(5);

		// Change startFrom
		rerender({ startFrom: 10 });
		expect(result.current.count).toBe(10);
	});
});
