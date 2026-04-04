import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { triggerHaptic } from "../src/utils/haptic";

describe("triggerHaptic", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("should call navigator.vibrate with duration when available", () => {
		const vibrate = vi.fn();
		vi.stubGlobal("navigator", { vibrate });

		triggerHaptic();

		expect(vibrate).toHaveBeenCalledTimes(1);
		expect(vibrate).toHaveBeenCalledWith(1001);
	});

	it("should schedule vibrate cancellation after 80ms", () => {
		const vibrate = vi.fn();
		vi.stubGlobal("navigator", { vibrate });

		triggerHaptic();

		expect(vibrate).toHaveBeenCalledTimes(1);
		expect(vibrate).toHaveBeenCalledWith(1001);

		vi.advanceTimersByTime(80);

		expect(vibrate).toHaveBeenCalledTimes(2);
		expect(vibrate).toHaveBeenNthCalledWith(2, 0);
	});

	it("should do nothing when navigator is undefined", () => {
		vi.stubGlobal("navigator", undefined);

		expect(() => triggerHaptic()).not.toThrow();
	});

	it("should do nothing when vibrate is not in navigator", () => {
		vi.stubGlobal("navigator", {});

		expect(() => triggerHaptic()).not.toThrow();
	});

	it("should do nothing when vibrate is not a function", () => {
		vi.stubGlobal("navigator", { vibrate: "not a function" });

		expect(() => triggerHaptic()).not.toThrow();
	});

	it("should use correct duration constants", () => {
		const vibrate = vi.fn();
		vi.stubGlobal("navigator", { vibrate });

		triggerHaptic();
		expect(vibrate).toHaveBeenCalledWith(1001);

		vi.advanceTimersByTime(80);
		expect(vibrate).toHaveBeenCalledWith(0);
	});
});
