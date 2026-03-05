import type { VercelRequest, VercelResponse } from "@vercel/node";

const ROAST_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"] as const;
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const PERSONALITY_NAMES: Record<string, string> = {
	ROASTER: "V.E.R.A.",
	ZEN_MASTER: "BAMBOO",
	LOVEBOMBER: "HYPE-BRO",
};

const TONE_INSTRUCTIONS: Record<string, string> = {
	ROASTER: "Be sarcastic, witty, and cynical. Biting British humor.",
	ZEN_MASTER:
		"Be calm, meditative, and passive-aggressive. Zen koans and flowing-water metaphors. Softly devastating.",
	LOVEBOMBER:
		"Be high-energy, hype, and Silicon Valley influencer style. Exclamation points. 'Slay,' 'literally,' 'vibes.'",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const { workflow, personality } = req.body ?? {};

		if (!workflow || !personality) {
			return res.status(400).json({ error: "Missing workflow or personality" });
		}

		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: "Server configuration error" });
		}

		const personalityName = PERSONALITY_NAMES[personality] ?? "V.E.R.A.";
		const tone = TONE_INSTRUCTIONS[personality] ?? TONE_INSTRUCTIONS.ROASTER;

		const prompt = `
You are ${personalityName} from the satirical tech company HyperScale Inc.
A user has described their current AI workflow: "${workflow}".

**Step 1:** Analyze the workflow. Is it using public tools (high privacy risk) or enterprise/in-house tools (low privacy risk)?
**Step 2:** Respond based on that analysis, in your character's voice.
*   If **Public**: Call out leaking IP and data breach risk.
*   If **Private/In-house**: Call out blindly trusting AI code, "secure" garbage, or believing a firewall fixes bad engineering.

${tone} Keep it under 50 words.
`;

		for (const model of ROAST_MODELS) {
			try {
				const resp = await fetch(
					`${API_BASE}/models/${model}:generateContent`,
					{
						method: "POST",
						headers: {
							"x-goog-api-key": apiKey,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							contents: [{ parts: [{ text: prompt }] }],
						}),
					},
				);

				if (!resp.ok) {
					const err = await resp.text();
					console.warn(`Roast Error (${model}):`, resp.status, err);
					continue;
				}

				const data = (await resp.json()) as {
					candidates?: Array<{
						content?: { parts?: Array<{ text?: string }> };
					}>;
				};
				const text =
					data.candidates?.[0]?.content?.parts?.[0]?.text ||
					"Even for you, this is remarkably insecure.";
				return res.status(200).json({ text });
			} catch (error) {
				console.warn(`Roast Error (${model}):`, error);
			}
		}

		return res.status(500).json({
			error: "The auditors found your workflow so bad they broke my AI.",
		});
	} catch (error) {
		console.error("[roast] Handler error:", error);
		return res.status(500).json({ error: "Roast generation failed" });
	}
}
