import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { V2WaitlistPayload } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

function validatePayload(payload: unknown): payload is V2WaitlistPayload {
	if (!payload || typeof payload !== "object") {
		return false;
	}

	const p = payload as Record<string, unknown>;

	return (
		typeof p.email === "string" &&
		validateEmail(p.email) &&
		typeof p.role === "string" &&
		typeof p.archetype === "string" &&
		typeof p.resilience === "number" &&
		typeof p.timestamp === "number"
	);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Only accept POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const payload = req.body;

		// Validate payload
		if (!validatePayload(payload)) {
			return res
				.status(400)
				.json({ error: "Invalid email format or missing fields" });
		}

		// Log signup for tracking (MVP: console log; production: database)
		console.log("[V2 Waitlist] New signup:", {
			email: payload.email,
			role: payload.role,
			archetype: payload.archetype,
			resilience: payload.resilience,
			timestamp: new Date(payload.timestamp).toISOString(),
		});

		// Return success
		return res.status(200).json({
			success: true,
			message: "Thank you for joining the V2 waitlist!",
		});
	} catch (error) {
		console.error("[V2 Waitlist] Error:", error);
		return res.status(500).json({
			error: "Something went wrong. Please try again.",
		});
	}
}
