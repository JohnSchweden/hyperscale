/**
 * Formatting utilities for display values.
 */

/**
 * Format a budget / fine amount for UI (HUD, feedback, debrief).
 * Uses $XM from 1M+, $XK from 1K–999,999, otherwise plain dollars with locale grouping.
 */
export function formatBudget(amount: number): string {
	const sign = amount < 0 ? "-" : "";
	const abs = Math.abs(amount);

	if (abs === 0) {
		return "$0";
	}
	if (abs >= 1_000_000_000) {
		return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
	}
	if (abs >= 1_000_000) {
		return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
	}
	if (abs >= 1_000) {
		const k = abs / 1_000;
		const kText = Number.isInteger(k) ? String(Math.round(k)) : k.toFixed(1);
		return `${sign}$${kText}K`;
	}
	return `${sign}$${abs.toLocaleString()}`;
}
