/**
 * Safe type coercion utilities for hydrating state from storage.
 */

/** Safely parse JSON, returning null on failure */
export function safeParseJson<T>(raw: string): T | null {
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

/** Check if a value is a valid member of an enum set */
export function isValidEnumValue(
	value: unknown,
	validSet: Set<string>,
): value is string {
	return typeof value === "string" && validSet.has(value);
}

/** Coerce unknown to number with fallback */
export function safeNumber(value: unknown, fallback: number): number {
	return typeof value === "number" ? value : fallback;
}

/** Coerce unknown to string or null */
export function safeString(value: unknown): string | null {
	return typeof value === "string" ? value : null;
}

/** Coerce unknown to array with fallback to empty array */
export function safeArray<T>(value: unknown): T[] {
	return Array.isArray(value) ? (value as T[]) : [];
}
