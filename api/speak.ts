import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { text, voiceName } = req.body ?? {};

	if (!text) {
		return res.status(400).json({ error: "Missing text" });
	}

	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		return res.status(500).json({ error: "Server configuration error" });
	}

	try {
		const resp = await fetch(
			`${API_BASE}/models/${TTS_MODEL}:generateContent`,
			{
				method: "POST",
				headers: {
					"x-goog-api-key": apiKey,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [{ parts: [{ text }] }],
					generationConfig: {
						responseModalities: ["AUDIO"],
						speechConfig: {
							voiceConfig: {
								prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
							},
						},
					},
				}),
			},
		);

		if (!resp.ok) {
			const err = await resp.text();
			console.error("TTS Error:", resp.status, err);
			return res.status(500).json({ error: "TTS generation failed" });
		}

		const data = (await resp.json()) as {
			candidates?: Array<{
				content?: {
					parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }>;
				};
			}>;
		};
		const base64Audio =
			data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

		if (!base64Audio) {
			return res.status(500).json({ error: "No audio generated" });
		}

		return res.status(200).json({ audio: base64Audio });
	} catch (error) {
		console.error("TTS Error:", error);
		return res.status(500).json({ error: "TTS generation failed" });
	}
}
