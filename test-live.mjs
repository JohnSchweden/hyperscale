import { GoogleGenAI, Modality } from "@google/generai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

try {
	const _session = await ai.live.connect({
		model: "gemini-2.5-flash-native-audio-latest",
		config: { responseModalities: [Modality.AUDIO] },
		callbacks: {
			onopen: () => console.log("Connected!"),
			onerror: (e) => console.log("Error:", e.message),
			onmessage: (m) => console.log("Message:", m),
		},
	});
	console.log("Session started");
} catch (e) {
	console.log("Exception:", e.message);
}
