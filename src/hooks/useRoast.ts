import { useCallback, useRef, useState } from "react";
import {
	getRoastTextOnly,
	getRoastWithFallback,
} from "../services/roastService";
import type { PersonalityType } from "../types";

/**
 * Possible states for the roast functionality.
 */
export type RoastStatus =
	| "idle"
	| "loading"
	| "streaming"
	| "speaking"
	| "complete";

/**
 * Custom hook for handling roast functionality with speech synthesis.
 * @param personality - The AI personality type
 * @returns Object with input state, output, loading status, and roast handler
 */
export function useRoast(personality: PersonalityType | null) {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState<RoastStatus>("idle");
	const outputRef = useRef<HTMLDivElement>(null);

	const handleRoast = useCallback(async () => {
		if (!input || !personality) return;
		setIsLoading(true);
		setOutput(null);
		setStatus("loading");
		try {
			// Check if speech is enabled
			const speechEnabled = import.meta.env.VITE_ENABLE_SPEECH !== "false";

			if (speechEnabled) {
				setStatus("streaming");
				await getRoastWithFallback(input, personality, (chunk) => {
					setOutput((prev) => (prev || "") + chunk);
				});
				setStatus("complete");
			} else {
				const roast = await getRoastTextOnly(input, personality);
				setOutput(roast);
				setStatus("complete");
			}
		} catch (e) {
			const errMsg = e instanceof Error ? e.message : String(e);
			setOutput(`Roast service unavailable. ${errMsg}`);
			setStatus("idle");
		}
		setIsLoading(false);
	}, [input, personality]);

	const reset = useCallback(() => {
		setInput("");
		setOutput(null);
		setIsLoading(false);
		setStatus("idle");
	}, []);

	return {
		input,
		setInput,
		output,
		outputRef,
		isLoading,
		status,
		handleRoast,
		reset,
	};
}
