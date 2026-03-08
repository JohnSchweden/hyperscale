const VIBRATE_PATTERN = [50, 30, 50];

export function triggerHaptic(): void {
	if (
		typeof navigator !== "undefined" &&
		"vibrate" in navigator &&
		typeof navigator.vibrate === "function"
	) {
		navigator.vibrate(VIBRATE_PATTERN);
	}
}
