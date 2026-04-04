import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const connectable = () => ({ connect: vi.fn() });

// Mock AudioContext and related APIs (supports voicePlayback + radioEffect)
class MockAudioContext {
	state = "running";
	sampleRate = 24000;
	currentTime = 0;
	createBufferSource = vi.fn(() => ({
		buffer: null,
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
		onended: null,
	}));
	createBuffer = vi.fn((_ch: number, length: number, _sr?: number) => ({
		numberOfChannels: 1,
		length,
		sampleRate: 24000,
		getChannelData: () => new Float32Array(length),
	}));
	createMediaElementSource = vi.fn(() => connectable());
	createBiquadFilter = vi.fn(() => connectable());
	createGain = vi.fn(() => ({ ...connectable(), gain: { value: 1 } }));
	createOscillator = vi.fn(() => ({
		...connectable(),
		start: vi.fn(),
		stop: vi.fn(),
		frequency: { value: 0 },
		type: "sine",
		onended: null,
	}));
	decodeAudioData = vi.fn();
	close = vi.fn();
	resume = vi.fn(() => Promise.resolve());
}

const mockAudioContext = new MockAudioContext() as unknown as AudioContext;

// Mock fetch for voice loading
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("Voice Playback System", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
		vi.stubGlobal(
			"AudioContext",
			vi.fn(() => mockAudioContext),
		);
		vi.stubGlobal("window", {
			AudioContext: vi.fn(() => mockAudioContext),
		});
		mockFetch.mockReset();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("loadVoice", () => {
		it("should throw narrative error for missing file", async () => {
			// Mock fetch to return 404
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
			});

			const { loadVoice } = await import("../src/services/voicePlayback");
			// Should fail with narrative error message
			await expect(loadVoice("roaster", "nonexistent")).rejects.toThrow(
				"V.E.R.A.",
			);
		});

		it("should throw for invalid personality", async () => {
			mockFetch.mockResolvedValue({ ok: false, status: 404 });
			const { loadVoice } = await import("../src/services/voicePlayback");
			// Should fail with generic error
			await expect(loadVoice("invalid", "test")).rejects.toThrow();
		});
	});

	describe("error messages", () => {
		it("should show Roaster narrative error", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
			});

			const { loadVoice } = await import("../src/services/voicePlayback");
			try {
				await loadVoice("roaster", "invalid");
			} catch (e: unknown) {
				expect(e).toBeInstanceOf(Error);
				expect((e as Error).message).toContain("V.E.R.A.");
			}
		});

		it("should show Zen Master narrative error", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
			});

			const { loadVoice } = await import("../src/services/voicePlayback");
			try {
				await loadVoice("zenmaster", "invalid");
			} catch (e: unknown) {
				expect(e).toBeInstanceOf(Error);
				expect((e as Error).message).toContain("spreadsheets");
			}
		});

		it("should show Lovebomber narrative error", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
			});

			const { loadVoice } = await import("../src/services/voicePlayback");
			try {
				await loadVoice("lovebomber", "invalid");
			} catch (e: unknown) {
				expect(e).toBeInstanceOf(Error);
				expect((e as Error).message).toContain("OMG");
			}
		});
	});
});
