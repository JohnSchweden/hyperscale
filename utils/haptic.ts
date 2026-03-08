/**
 * Vibration pattern. Android Chrome (some devices) ignores vibrations <1000ms total.
 * See: https://stackoverflow.com/questions/79077091/navigator-vibrate-on-android-only-works-for-vibrations-longer-than-one-second
 * Use 1001ms to satisfy threshold, then cancel after 80ms for short-pulse feel.
 * Cancel via vibrate(0) is unreliable on some devices — may get full 1s pulse.
 * iOS: navigator.vibrate not supported; no-op.
 */
const VIBRATE_DURATION_MS = 1001;
const VIBRATE_CANCEL_AFTER_MS = 80;

export function triggerHaptic(): void {
	if (
		typeof navigator !== "undefined" &&
		"vibrate" in navigator &&
		typeof navigator.vibrate === "function"
	) {
		navigator.vibrate(VIBRATE_DURATION_MS);
		// Attempt short pulse: cancel after 80ms. Unreliable on some Android devices.
		setTimeout(() => {
			navigator.vibrate(0);
		}, VIBRATE_CANCEL_AFTER_MS);
	}
}
