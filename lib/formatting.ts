/**
 * Formatting utilities for display values.
 */

/** Format a budget amount for display (e.g., $1.5M or $500,000) */
export function formatBudget(amount: number): string {
	return amount >= 1_000_000
		? `$${(amount / 1_000_000).toFixed(1)}M`
		: `$${amount.toLocaleString()}`;
}
