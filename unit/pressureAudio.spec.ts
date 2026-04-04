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

function stubSuspendedContext(): void {
	class SuspendedContext extends MockAudioContextClass {
		state = "suspended";
	}
	vi.stubGlobal("AudioContext", SuspendedContext);
	vi.stubGlobal("window", { AudioContext: SuspendedContext });
}

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
				"../src/services/pressureAudio"
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
				"../src/services/pressureAudio"
			);

			expect(() => createPressureAudioSession()).toThrow(
				"AudioContext not supported",
			);
		});
	});

	describe("HeartbeatConfig validation", () => {
		it("should handle missing config gracefully", async () => {
			const { createPressureAudioSession } = await import(
				"../src/services/pressureAudio"
			);
			const session = createPressureAudioSession();

			// Should not throw - fire and forget
			expect(() => session.startHeartbeat({})).not.toThrow();
			expect(() => session.updateHeartbeat({})).not.toThrow();
		});

		it("should accept valid countdown config", async () => {
			const { createPressureAudioSession } = await import(
				"../src/services/pressureAudio"
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
				"../src/services/pressureAudio"
			);
			const session = createPressureAudioSession();

			// Should not throw - fire and forget
			expect(() => session.startAlert()).not.toThrow();
		});
	});

	describe("stop", () => {
		it("should not throw when stopping without active audio", async () => {
			const { createPressureAudioSession } = await import(
				"../src/services/pressureAudio"
			);
			const session = createPressureAudioSession();

			expect(() => session.stop()).not.toThrow();
		});
	});

	describe("startHeartbeat creates oscillator and gain (running context)", () => {
		it("should create oscillator and gain when context is running", async () => {
			const { createPressureAudioSession } = await import(
				"../src/services/pressureAudio"
			);
			const session = createPressureAudioSession();
			const ctx = session.context as unknown as InstanceType<
				typeof MockAudioContextClass
			>;

			session.startHeartbeat({});
			await vi.waitFor(() => {
				expect(ctx.createOscillator).toHaveBeenCalled();
			});

			expect(ctx.createGain).toHaveBeenCalled();
			const osc = ctx.createOscillator.mock.results[0]?.value;
			expect(osc).toBeDefined();
			expect(osc.start).toHaveBeenCalled();
			expect(osc.stop).toHaveBeenCalled();
		});
	});

	describe("playCountdownBeep", () => {
		beforeEach(async () => {
			vi.resetModules();
		});

		it("should play beep for 3, 2, 1 with ascending frequency", async () => {
			const { playCountdownBeep, getCountdownContext } = await import(
				"../src/services/pressureAudio"
			);

			playCountdownBeep(3);
			playCountdownBeep(2);
			playCountdownBeep(1);

			const ctx = getCountdownContext() as unknown as InstanceType<
				typeof MockAudioContextClass
			>;
			expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
			const osc3 = ctx.createOscillator.mock.results[0]?.value;
			const osc1 = ctx.createOscillator.mock.results[2]?.value;
			expect(osc3.frequency.value).toBe(200); // 3 = low
			expect(osc1.frequency.value).toBe(275); // 1 = high
		});

		it("should no-op when context suspended", async () => {
			stubSuspendedContext();
			const { playCountdownBeep, getCountdownContext } = await import(
				"../src/services/pressureAudio"
			);
			getCountdownContext(); // populate cached ctx
			playCountdownBeep(1);
			const ctx = getCountdownContext() as unknown as InstanceType<
				typeof MockAudioContextClass
			>;
			expect(ctx.createOscillator).not.toHaveBeenCalled();
		});
	});

	describe("playCountdownStart", () => {
		beforeEach(() => vi.resetModules());

		it("should play single soft sine", async () => {
			const { playCountdownStart, getCountdownContext } = await import(
				"../src/services/pressureAudio"
			);
			playCountdownStart();
			const ctx = getCountdownContext() as unknown as InstanceType<
				typeof MockAudioContextClass
			>;
			expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
			const osc = ctx.createOscillator.mock.results[0]?.value;
			expect(osc.frequency.value).toBe(385);
		});

		it("should no-op when context suspended", async () => {
			stubSuspendedContext();
			const { playCountdownStart, getCountdownContext } = await import(
				"../src/services/pressureAudio"
			);
			getCountdownContext();
			playCountdownStart();
			const ctx = getCountdownContext() as unknown as InstanceType<
				typeof MockAudioContextClass
			>;
			expect(ctx.createOscillator).not.toHaveBeenCalled();
		});
	});

	describe("prepareCountdownAudio", () => {
		beforeEach(() => vi.resetModules());

		it("should not throw", async () => {
			const { prepareCountdownAudio } = await import(
				"../src/services/pressureAudio"
			);
			expect(() => prepareCountdownAudio()).not.toThrow();
		});
	});

	describe("playUnlockPulse", () => {
		it("should create oscillator, connect, start(0), stop(0.05)", async () => {
			const { playUnlockPulse } = await import("../src/services/pressureAudio");
			const mockCtx = new MockAudioContextClass();

			playUnlockPulse(mockCtx as unknown as AudioContext);

			expect(mockCtx.createOscillator).toHaveBeenCalled();
			expect(mockCtx.createGain).toHaveBeenCalled();
			const osc = mockCtx.createOscillator.mock.results[0]?.value;
			expect(osc.start).toHaveBeenCalledWith(0);
			expect(osc.stop).toHaveBeenCalledWith(0.05);
		});
	});

	describe("playPulse when context suspended", () => {
		it("should not create oscillators when ctx.state is suspended", async () => {
			const ctx = new MockAudioContextClass();
			ctx.state = "suspended";
			function SuspendedContext() {
				return ctx;
			}
			vi.stubGlobal("AudioContext", SuspendedContext);
			vi.stubGlobal("window", { AudioContext: SuspendedContext });

			const { createPressureAudioSession } = await import(
				"../src/services/pressureAudio"
			);
			const session = createPressureAudioSession();

			session.startHeartbeat({});
			await vi.waitFor(() => {}, { timeout: 50 });

			expect(ctx.createOscillator).not.toHaveBeenCalled();
		});
	});

	describe("startAlert when context running", () => {
		it("should create oscillator for alert", async () => {
			const { createPressureAudioSession } = await import(
				"../src/services/pressureAudio"
			);
			const session = createPressureAudioSession();
			const ctx = session.context as unknown as InstanceType<
				typeof MockAudioContextClass
			>;

			session.startAlert();
			await vi.waitFor(() => {
				expect(ctx.createOscillator).toHaveBeenCalled();
			});

			const osc = ctx.createOscillator.mock.results[0]?.value;
			expect(osc.start).toHaveBeenCalled();
			expect(osc.stop).toHaveBeenCalled();
		});
	});
});
