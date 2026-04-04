import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { V2WaitlistPayload } from "../src/types";

/**
 * Regular expression for validating email addresses.
 * Matches basic email format with local@domain.tld structure.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates if the given string is a valid email address.
 * @param email - The email string to validate
 * @returns True if the email matches the expected format, false otherwise
 */
function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

/**
 * Validates if the given payload conforms to the V2WaitlistPayload type.
 * Checks for required fields: email (string), role (string), archetype (string),
 * resilience (number), and timestamp (number). Also validates email format.
 * @param payload - The unknown payload to validate
 * @returns True if payload matches V2WaitlistPayload interface, false otherwise
 */
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

/**
 * Handles V2 waitlist API requests for user signups.
 * Accepts POST requests with V2WaitlistPayload, validates the data,
 * logs the signup, sends a confirmation email (if configured), and returns success.
 * @param req - The incoming Vercel request object
 * @param res - The Vercel response object to send back to the client
 * @returns Promise that resolves when the response is sent (status 200, 400, 405, or 500)
 * @throws Will send error responses for invalid methods (405), invalid payload (400), or server errors (500)
 * @example
 * POST /api/v2-waitlist
 * Body: { "email": "user@example.com", "role": "Manager", "archetype": "Optimist", "resilience": 75, "timestamp": 1640995200000 }
 */
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
