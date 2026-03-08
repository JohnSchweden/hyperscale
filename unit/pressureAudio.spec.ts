import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock AudioContext for pressure audio testing
const createMockOscillator = () => ({
	type: "sine",
	frequency: { value: 0 },
	connect: vi.fn(),
	start: vi.fn(),
	stop: vi.fn(),
	onended: null,
});

const createMockGain = () => ({
	connect: vi.fn(),
	gain: {
		value: 0,
		setValueAtTime: vi.fn(),
		linearRampToValueAtTime: vi.fn(),
	},
});

class MockAudioContext {
	state = "running";
	sampleRate = 24000;
	currentTime = 0;
	createOscillator = vi.fn(createMockOscillator);
	createGain = vi.fn(createMockGain);
	resume = vi.fn(() => Promise.resolve());
}

// Store reference to mock class for constructor
const MockAudioContextClass = MockAudioContext;

describe("Pressure Audio System", () => {
	beforeEach(() => {
		vi.stubGlobal("AudioContext", MockAudioContextClass);
		vi.stubGlobal("window", {
			AudioContext: MockAudioContextClass,
		});
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("createPressureAudioSession", () => {
		it("should create a session with required methods", async () => {
			const { createPressureAudioSession } = await import(
				"../services/pressureAudio"
			);
			const session = createPressureAudioSession();

			expect(session).toHaveProperty("startHeartbeat");
			expect(session).toHaveProperty("updateHeartbeat");
			expect(session).toHaveProperty("startAlert");
			expect(session).toHaveProperty("stop");
			expect(session).toHaveProperty("context");
		});

		it("should throw when AudioContext is not available", async () => {
			vi.unstubAllGlobals();
			// Stub window with no AudioContext
			vi.stubGlobal("window", { AudioContext: undefined });

			// Need to re-import after clearing stubs
			const { createPressureAudioSession } = await import(
				"../services/pressureAudio"
			);

			expect(() => createPressureAudioSession()).toThrow(
				"AudioContext not supported",
			);
		});
	});

	describe("HeartbeatConfig validation", () => {
		it("should handle missing config gracefully", async () => {
			const { createPressureAudioSession } = await import(
				"../services/pressureAudio"
			);
			const session = createPressureAudioSession();

			// Should not throw - fire and forget
			expect(() => session.startHeartbeat({})).not.toThrow();
			expect(() => session.updateHeartbeat({})).not.toThrow();
		});

		it("should accept valid countdown config", async () => {
			const { createPressureAudioSession } = await import(
				"../services/pressureAudio"
			);
			const session = createPressureAudioSession();

			expect(() =>
				session.startHeartbeat({ countdownValue: 5, countdownSec: 10 }),
			).not.toThrow();
		});
	});

	describe("startAlert", () => {
		it("should not throw when starting alert", async () => {
			const { createPressureAudioSession } = await import(
				"../services/pressureAudio"
			);
			const session = createPressureAudioSession();

			// Should not throw - fire and forget
			expect(() => session.startAlert()).not.toThrow();
		});
	});

	describe("stop", () => {
		it("should not throw when stopping without active audio", async () => {
			const { createPressureAudioSession } = await import(
				"../services/pressureAudio"
			);
			const session = createPressureAudioSession();

			expect(() => session.stop()).not.toThrow();
		});
	});
});
