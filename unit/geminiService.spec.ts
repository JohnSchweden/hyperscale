import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalityType } from "../src/types";

const mockFetch = vi.fn();

describe("Gemini Service", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();

		const mockAudioContext = {
			state: "running",
			sampleRate: 24000,
			currentTime: 0,
			createBuffer: vi.fn(() => ({
				numberOfChannels: 1,
				length: 24000,
				sampleRate: 24000,
				getChannelData: () => new Float32Array(24000),
			})),
			createBufferSource: vi.fn(() => ({
				buffer: null,
				connect: vi.fn(),
				start: vi.fn(),
				stop: vi.fn(),
				onended: null,
			})),
			createGain: vi.fn(() => ({
				connect: vi.fn(),
				gain: { value: 1 },
			})),
			decodeAudioData: vi.fn(),
			close: vi.fn(),
			resume: vi.fn(() => Promise.resolve()),
		};

		vi.stubGlobal("fetch", mockFetch);
		vi.stubGlobal(
			"AudioContext",
			vi.fn(() => mockAudioContext),
		);

		vi.mock("../src/services/radioEffect", () => ({
			createRadioSession: vi.fn(() => ({
				start: vi.fn(),
				end: vi.fn(),
				voiceInput: {},
				scheduleChunk: vi.fn(() => 0),
			})),
		}));
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	describe("speak", () => {
		it("should handle TTS API errors gracefully", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				json: vi.fn().mockResolvedValue({ error: "TTS service unavailable" }),
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { speak } = await import("../src/services/geminiService");

			await speak("Hello world");

			expect(consoleSpy).toHaveBeenCalledWith(
				"TTS Error:",
				"TTS service unavailable",
			);
			consoleSpy.mockRestore();
		});

		it("should create AudioContext and play audio when successful", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({
					audio: btoa("mock audio data"),
				}),
			});

			const { speak } = await import("../src/services/geminiService");

			await speak("Hello world", "TestVoice");

			expect(mockFetch).toHaveBeenCalledWith("/api/speak", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: "Hello world", voiceName: "TestVoice" }),
			});
		});

		it("should handle fetch errors", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { speak } = await import("../src/services/geminiService");

			await speak("Hello world");

			expect(consoleSpy).toHaveBeenCalledWith("TTS Error:", expect.any(Error));
			consoleSpy.mockRestore();
		});
	});

	describe("cleanupAudio", () => {
		it("should close AudioContext when running", async () => {
			const { cleanupAudio } = await import("../src/services/geminiService");

			cleanupAudio();
		});

		it("should handle cleanup without errors", async () => {
			const { cleanupAudio } = await import("../src/services/geminiService");

			expect(() => cleanupAudio()).not.toThrow();
		});
	});

	describe("getRoast", () => {
		it("should return roast text on successful API call", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				text: vi.fn().mockResolvedValue('{"text": "You are terrible at this"}'),
				headers: {
					get: vi.fn().mockReturnValue("application/json"),
				},
			});

			const { getRoast } = await import("../src/services/geminiService");

			const result = await getRoast("workflow text", PersonalityType.ROASTER);

			expect(result).toBe("You are terrible at this");
			expect(mockFetch).toHaveBeenCalledWith("/api/roast", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					workflow: "workflow text",
					personality: PersonalityType.ROASTER,
				}),
			});
		});

		it("should handle API errors gracefully", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				text: vi
					.fn()
					.mockResolvedValue('{"error": "Server configuration error"}'),
				headers: {
					get: vi.fn().mockReturnValue("application/json"),
				},
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { getRoast } = await import("../src/services/geminiService");

			const result = await getRoast("workflow", PersonalityType.ZEN_MASTER);

			expect(result).toBe("Roast disabled: Server configuration error.");
			expect(consoleSpy).toHaveBeenCalledWith(
				"Roast Error:",
				"Server configuration error",
			);
			consoleSpy.mockRestore();
		});

		it("should handle non-JSON responses", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 500,
				text: vi.fn().mockResolvedValue("Internal Server Error"),
				headers: {
					get: vi.fn().mockReturnValue("text/plain"),
				},
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { getRoast } = await import("../src/services/geminiService");

			const result = await getRoast("workflow", PersonalityType.LOVEBOMBER);

			expect(result).toBe("Roast disabled: Server error.");
			consoleSpy.mockRestore();
		});

		it("should handle fetch errors", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { getRoast } = await import("../src/services/geminiService");

			const result = await getRoast("workflow", PersonalityType.ROASTER);

			expect(result).toBe("Roast disabled: Could not connect to server.");
			expect(consoleSpy).toHaveBeenCalledWith(
				"Roast Error:",
				expect.any(Error),
			);
			consoleSpy.mockRestore();
		});

		it("should return fallback text when API returns empty text", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				text: vi.fn().mockResolvedValue('{"text": ""}'),
				headers: {
					get: vi.fn().mockReturnValue("application/json"),
				},
			});

			const { getRoast } = await import("../src/services/geminiService");

			const result = await getRoast("workflow", PersonalityType.ROASTER);

			expect(result).toBe("Even for you, this is remarkably insecure.");
		});
	});
});
