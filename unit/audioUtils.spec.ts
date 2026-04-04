import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Audio Utils", () => {
	let canPlayType: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.resetModules();

		canPlayType = vi.fn();

		vi.stubGlobal(
			"Audio",
			class MockAudio {
				canPlayType = canPlayType;
			},
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("supportsOpus", () => {
		it("should return false when window is undefined (SSR)", async () => {
			vi.stubGlobal("window", undefined);

			const { supportsOpus } = await import("../src/services/audioUtils");

			expect(supportsOpus()).toBe(false);
		});

		it("should return true when Ogg Opus is probably supported", async () => {
			canPlayType.mockReturnValue("probably");

			const { supportsOpus } = await import("../src/services/audioUtils");

			expect(supportsOpus()).toBe(true);
		});

		it("should return true when WebM Opus is probably supported", async () => {
			canPlayType.mockReturnValueOnce("").mockReturnValueOnce("probably");

			const { supportsOpus } = await import("../src/services/audioUtils");

			expect(supportsOpus()).toBe(true);
		});

		it("should return true when CAF is probably supported", async () => {
			canPlayType
				.mockReturnValueOnce("")
				.mockReturnValueOnce("")
				.mockReturnValueOnce("probably");

			const { supportsOpus } = await import("../src/services/audioUtils");

			expect(supportsOpus()).toBe(true);
		});

		it("should return false when no Opus format is supported", async () => {
			canPlayType.mockReturnValue("");

			const { supportsOpus } = await import("../src/services/audioUtils");

			expect(supportsOpus()).toBe(false);
		});

		it("should cache the result after first call", async () => {
			canPlayType.mockReturnValue("probably");

			const { supportsOpus } = await import("../src/services/audioUtils");

			expect(supportsOpus()).toBe(true);
			expect(canPlayType).toHaveBeenCalledTimes(3);

			expect(supportsOpus()).toBe(true);
			expect(canPlayType).toHaveBeenCalledTimes(3);
		});
	});

	describe("getAudioExtension", () => {
		it("should return .opus when Opus is supported", async () => {
			canPlayType.mockReturnValue("probably");

			const { getAudioExtension } = await import("../src/services/audioUtils");

			expect(getAudioExtension()).toBe(".opus");
		});

		it("should return .mp3 when Opus is not supported", async () => {
			canPlayType.mockReturnValue("");

			const { getAudioExtension } = await import("../src/services/audioUtils");

			expect(getAudioExtension()).toBe(".mp3");
		});
	});

	describe("getAudioMimeType", () => {
		it("should return audio/opus when Opus is supported", async () => {
			canPlayType.mockReturnValue("probably");

			const { getAudioMimeType } = await import("../src/services/audioUtils");

			expect(getAudioMimeType()).toBe("audio/opus");
		});

		it("should return audio/mpeg when Opus is not supported", async () => {
			canPlayType.mockReturnValue("");

			const { getAudioMimeType } = await import("../src/services/audioUtils");

			expect(getAudioMimeType()).toBe("audio/mpeg");
		});
	});

	describe("getAudioPath", () => {
		it("should append .opus extension when Opus is supported", async () => {
			canPlayType.mockReturnValue("probably");

			const { getAudioPath } = await import("../src/services/audioUtils");

			expect(getAudioPath("audio/voice")).toBe("audio/voice.opus");
		});

		it("should append .mp3 extension when Opus is not supported", async () => {
			canPlayType.mockReturnValue("");

			const { getAudioPath } = await import("../src/services/audioUtils");

			expect(getAudioPath("audio/voice")).toBe("audio/voice.mp3");
		});

		it("should replace existing audio extensions", async () => {
			canPlayType.mockReturnValue("probably");

			const { getAudioPath } = await import("../src/services/audioUtils");

			expect(getAudioPath("audio/voice.mp3")).toBe("audio/voice.opus");
			expect(getAudioPath("audio/voice.opus")).toBe("audio/voice.opus");
			expect(getAudioPath("audio/voice.wav")).toBe("audio/voice.opus");
		});

		it("should handle paths with dots in directory names", async () => {
			canPlayType.mockReturnValue("probably");

			const { getAudioPath } = await import("../src/services/audioUtils");

			expect(getAudioPath("audio.test/voice")).toBe("audio.test/voice.opus");
		});
	});
});
