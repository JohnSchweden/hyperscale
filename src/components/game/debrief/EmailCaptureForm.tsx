import type React from "react";
import { useEmailCapture } from "../../../hooks/useEmailCapture";

interface EmailCaptureFormProps {
	role: string;
	archetype: string;
	resilience: number;
}

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
	role,
	archetype,
	resilience,
}) => {
	const { email, setEmail, isSubmitting, error, success, submit } =
		useEmailCapture({
			role,
			archetype,
			resilience,
		});

	const isValidEmail = (email: string): boolean => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const canSubmit = isValidEmail(email) && !isSubmitting && !success;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (canSubmit) {
			submit();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
			{/* Email Input */}
			<div className="mb-4">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="your.email@company.com"
					readOnly={success}
					className={`
						w-full px-4 py-3 rounded-lg
						bg-slate-900/50 border
						text-white placeholder-slate-500
						focus:outline-none focus:ring-2 focus:ring-cyan-500/50
						transition-all duration-200
						${success ? "border-emerald-500/50 bg-emerald-950/20" : "border-slate-700"}
						${error ? "border-red-500/50" : ""}
					`}
				/>
			</div>

			{/* Error Message */}
			{error && (
				<div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm">
					{error}
				</div>
			)}

			{/* Success Message */}
			{success && (
				<div className="mb-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-sm">
					✓ Email received. V2 is coming.
				</div>
			)}

			{/* Submit Button */}
			<button
				type="submit"
				disabled={!canSubmit}
				className={`
					w-full px-6 py-3 text-base font-bold tracking-wide
					transition-all duration-300
					${
						canSubmit
							? "bg-white text-black hover:bg-cyan-400 hover:text-black"
							: success
								? "bg-emerald-500/20 text-emerald-400 cursor-default"
								: "bg-slate-700 text-slate-400 cursor-not-allowed"
					}
				`}
			>
				{isSubmitting ? "Joining..." : success ? "Joined" : "Join V2 waitlist"}
			</button>
		</form>
	);
};
