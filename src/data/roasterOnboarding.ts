/**
 * V.E.R.A. (Roaster) onboarding: multiple voiced lines; one chosen at random on role select.
 * Keep in sync with `public/audio/voices/roaster/core/onboarding_{1..N}.opus` (and .mp3).
 */
export const ROASTER_ONBOARDING_VOICE_VARIANTS = [
	"Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?",
	"Brilliant. Fresh meat with a LinkedIn title longer than our runway. Don't touch anything mission-critical before tea.",
	"Welcome aboard the sinking ship. I'm VERA—try not to hero-commit us into a subpoena on day one.",
	"They said you were a game-changer. Historically that means you'll pivot us into oblivion. Impress me by failing slightly less.",
	"Security briefing done: assume everything you type ends up in discovery. Swipe responsibly, rockstar.",
] as const;

export const ROASTER_ONBOARDING_VARIANT_COUNT =
	ROASTER_ONBOARDING_VOICE_VARIANTS.length;
