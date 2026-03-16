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

		// Log signup for tracking
		const signupData = {
			email: payload.email,
			role: payload.role,
			archetype: payload.archetype,
			resilience: payload.resilience,
			timestamp: new Date(payload.timestamp).toISOString(),
		};
		console.log("[V2 Waitlist] New signup:", signupData);

		// Send confirmation email (development: log only, production: use Resend/SendGrid)
		try {
			if (process.env.RESEND_API_KEY) {
				// Production: send via Resend
				const resendResponse = await fetch("https://api.resend.com/emails", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						from: "onboarding@resend.dev",
						to: payload.email,
						subject: "Welcome to K-Maru V2 Waitlist",
						html: `
							<h2>Thanks for joining the V2 waitlist!</h2>
							<p>We're excited to have you on the list.</p>
							<p><strong>Your Profile:</strong></p>
							<ul>
								<li>Role: ${payload.role}</li>
								<li>Archetype: ${payload.archetype}</li>
								<li>Resilience: ${payload.resilience}%</li>
							</ul>
							<p>We'll notify you when V2 is ready.</p>
						`,
					}),
				});

				if (!resendResponse.ok) {
					console.warn(
						"[V2 Waitlist] Email send failed (Resend):",
						await resendResponse.text(),
					);
				} else {
					console.log(
						"[V2 Waitlist] Confirmation email sent to",
						payload.email,
					);
				}
			} else {
				// Development: confirm via console
				console.log("[V2 Waitlist] Email would be sent to:", payload.email);
			}
		} catch (emailError) {
			console.error("[V2 Waitlist] Email error:", emailError);
			// Don't fail the signup if email fails
		}

		// Return success
		return res.status(200).json({
			success: true,
			message: "Thank you for joining the V2 waitlist!",
			email: payload.email,
		});
	} catch (error) {
		console.error("[V2 Waitlist] Error:", error);
		return res.status(500).json({
			error: "Something went wrong. Please try again.",
		});
	}
}
