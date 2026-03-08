import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock AudioContext for radio effect testing
class MockAudioContext {
	state = "running";
	sampleRate = 24000;
	currentTime = 0;
	createBiquadFilter = vi.fn(() => ({
		type: "highpass",
		frequency: { value: 0 },
		connect: vi.fn(),
	}));
	createBuffer = vi.fn((_ch: number, length: number, _sr?: number) => ({
		numberOfChannels: 1,
		length,
		sampleRate: 24000,
		getChannelData: () => new Float32Array(length),
	}));
	createBufferSource = vi.fn(() => ({
		buffer: null,
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
		loop: false,
	}));
	createGain = vi.fn(() => ({
		connect: vi.fn(),
		gain: { value: 0 },
	}));
	createOscillator = vi.fn(() => ({
		type: "sine",
		frequency: { value: 0 },
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
		onended: null,
	}));
}

const mockAudioContext = new MockAudioContext() as unknown as AudioContext;

describe("Radio Effect System", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createRadioSession", () => {
		it("should create a session with required properties", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			const session = createRadioSession(mockAudioContext, {
				delaySeconds: 0.5,
			});

			expect(session).toHaveProperty("voiceInput");
			expect(session).toHaveProperty("start");
			expect(session).toHaveProperty("scheduleChunk");
			expect(session).toHaveProperty("stop");
			expect(session).toHaveProperty("end");
			expect(session).toHaveProperty("context");
		});

		it("should create voice filter chain (highpass + lowpass)", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			createRadioSession(mockAudioContext, { delaySeconds: 0 });

			// Should create filters: 2 for voice (highpass + lowpass) + 2 for noise = 4 total
			expect(mockAudioContext.createBiquadFilter).toHaveBeenCalledTimes(4);
		});

		it("should create noise buffer", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			createRadioSession(mockAudioContext, { delaySeconds: 0 });

			// Should create buffer for noise
			expect(mockAudioContext.createBuffer).toHaveBeenCalled();
		});
	});

	describe("start()", () => {
		it("should schedule intro tone and noise", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			const session = createRadioSession(mockAudioContext, {
				delaySeconds: 0.5,
			});

			const voiceStartTime = session.start();

			// Should return time when voice can start (after intro)
			expect(typeof voiceStartTime).toBe("number");
			expect(voiceStartTime).toBeGreaterThan(0);

			// Should start noise source
			expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
		});
	});

	describe("scheduleChunk()", () => {
		it("should return valid chunk start time", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			const session = createRadioSession(mockAudioContext, { delaySeconds: 0 });

			const chunkTime = session.scheduleChunk(1.0);

			expect(typeof chunkTime).toBe("number");
			expect(chunkTime).toBeGreaterThanOrEqual(0);
		});
	});

	describe("stop()", () => {
		it("should not throw when stopping", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			const session = createRadioSession(mockAudioContext, { delaySeconds: 0 });

			expect(() => session.stop()).not.toThrow();
		});
	});

	describe("end()", () => {
		it("should return a promise", async () => {
			const { createRadioSession } = await import("../services/radioEffect");
			const session = createRadioSession(mockAudioContext, { delaySeconds: 0 });

			const result = session.end();

			expect(result).toBeInstanceOf(Promise);
		});
	});
});
