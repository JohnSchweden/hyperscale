import { useCallback, useMemo, useState } from "react";
import type { V2WaitlistPayload } from "../types";

interface UseEmailCaptureOptions {
	role: string;
	archetype: string;
	resilience: number;
}

interface UseEmailCaptureReturn {
	email: string;
	setEmail: (email: string) => void;
	isSubmitting: boolean;
	error: string | null;
	success: boolean;
	submit: () => Promise<void>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function useEmailCapture({
	role,
	archetype,
	resilience,
}: UseEmailCaptureOptions): UseEmailCaptureReturn {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const submit = useCallback(async () => {
		// Reset states
		setError(null);
		setSuccess(false);

		// Validate email
		if (!validateEmail(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		try {
			const payload: V2WaitlistPayload = {
				email: email.trim(),
				role,
				archetype,
				resilience,
				timestamp: Date.now(),
			};

			const response = await fetch("/api/v2-waitlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: Submission failed`);
			}

			// Success
			setSuccess(true);
			setEmail("");
			localStorage.setItem("v2-waitlist-submitted", "true");
		} catch (_err) {
			setError("Something went wrong. Please try again.");
			setSuccess(false);
		} finally {
			setIsSubmitting(false);
		}
	}, [email, role, archetype, resilience]);

	return useMemo(
		() => ({
			email,
			setEmail,
			isSubmitting,
			error,
			success,
			submit,
		}),
		[email, isSubmitting, error, success, submit],
	);
}
