/**
 * Phase 07: Kirk Easter Egg — Zalgo-lite text corruption utility.
 * Appends Unicode combining diacritics to characters to create a corrupted visual effect.
 */

const COMBINING_START = 0x0300;
const COMBINING_END = 0x030d;

const randomCombining = () =>
	String.fromCodePoint(
		COMBINING_START +
			Math.floor(Math.random() * (COMBINING_END - COMBINING_START + 1)),
	);

/**
 * Corrupts a string by appending 1-3 random Unicode combining diacritics
 * to each non-space character with the given probability.
 */
export const corruptText = (text: string, intensity = 0.3): string =>
	[...text]
		.map((char) =>
			char === " " || Math.random() > intensity
				? char
				: char +
					Array.from(
						{ length: 1 + Math.floor(Math.random() * 3) },
						randomCombining,
					).join(""),
		)
		.join("");
