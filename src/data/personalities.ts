import { PersonalityType } from "../types";

/**
 * Personality configurations for the AI assistant in the game.
 * Each personality defines the character's voice, tone, and scripted responses
 * for different game states (onboarding, victory, failure).
 */
export const PERSONALITIES = {
	[PersonalityType.ZEN_MASTER]: {
		name: "BAMBOO",
		title: "The Zen Master",
		description:
			"Meditation app vibes, flowing water, passive-aggressive calmness.",
		voice: "Puck",
		onboarding:
			"Namaste, corporate warrior. The data flows like a river. Let us align our chakras and our privacy policies.",
		victory:
			"Balance is achieved. The spreadsheets are at peace. You are one with compliance.",
		failure:
			"Breathe in... and breathe out the lawsuits. Your karma is now a major liability.",
	},
	[PersonalityType.ROASTER]: {
		name: "V.E.R.A.",
		title: "The Roaster",
		description: "British sarcasm, burned-out IT director, cynical.",
		voice: "Kore",
		onboarding:
			"Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?",
		victory:
			"I... don't hate it. Adequate performance. Here's a badge. Now leave.",
		failure:
			"Well, you managed to violate basic common sense. The legal team is crying. Pathetic.",
	},
	[PersonalityType.LOVEBOMBER]: {
		name: "HYPE-BRO",
		title: "The Lovebomber",
		description: 'Silicon Valley influencer, high energy, loves "Synergy".',
		voice: "Enceladus",
		onboarding:
			"OMG HI!! We are literally going to change the world! You look SO compliant today! Let's crush it!",
		victory:
			"YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!",
		failure:
			"Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!",
	},
};
