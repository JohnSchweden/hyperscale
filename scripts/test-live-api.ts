#!/usr/bin/env bun
/**
 * Simple Live API smoke test. Run: bun run scripts/test-live-api.ts
 * Requires GEMINI_API_KEY or VITE_GEMINI_API_KEY in .env.local
 */
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.VITE_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY or VITE_GEMINI_API_KEY not set");
	process.exit(1);
}

const PROMPT = "Say hello in one word.";
const TIMEOUT_MS = 20000;

async function testLiveApi() {
	console.log("[test-live-api] Connecting to Gemini Live API...");

	let resolveResponse: (v: { audioChunks: number; textChunks: number }) => void;
	const responsePromise = new Promise<{
		audioChunks: number;
		textChunks: number;
	}>((resolve) => {
		resolveResponse = resolve;
	});

	let audioChunks = 0;
	let textChunks = 0;

	const ai = new GoogleGenAI({
		apiKey,
		httpOptions: { apiVersion: "v1alpha" as const },
	});

	const connectPromise = ai.live.connect({
		model: "gemini-2.5-flash-native-audio-latest",
		config: {
			responseModalities: [Modality.AUDIO],
			systemInstruction:
				"You are a test assistant. Respond very briefly, one word when possible.",
		},
		callbacks: {
			onopen: () => console.log("[test-live-api] Connected"),
			onmessage: (msg) => {
				const parts = msg.serverContent?.modelTurn?.parts ?? [];
				for (const p of parts) {
					if (p.inlineData?.data) audioChunks++;
					if (p.text) {
						textChunks++;
						console.log("[test-live-api] Text:", p.text);
					}
				}
				if (msg.serverContent?.turnComplete) {
					resolveResponse?.({ audioChunks, textChunks });
				}
			},
			onerror: (e) => console.error("[test-live-api] Error:", e),
			onclose: (e) =>
				console.log("[test-live-api] Closed:", e?.code, e?.reason),
		},
	});

	const session = await Promise.race([
		connectPromise,
		new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error("Connection timeout")), TIMEOUT_MS),
		),
	]);

	session.sendClientContent({
		turns: [{ role: "user", parts: [{ text: PROMPT }] }],
		turnComplete: true,
	});

	const result = await Promise.race([
		responsePromise,
		new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error("Response timeout")), TIMEOUT_MS),
		),
	]);

	console.log(
		"[test-live-api] Response:",
		result.audioChunks,
		"audio chunks,",
		result.textChunks,
		"text chunks",
	);

	if (result.audioChunks > 0 || result.textChunks > 0) {
		console.log("[test-live-api] PASS");
		process.exit(0);
	} else {
		console.error("[test-live-api] FAIL: No response received");
		process.exit(1);
	}
}

testLiveApi().catch((e) => {
	console.error("[test-live-api] FAIL:", e?.message ?? e);
	process.exit(1);
});
