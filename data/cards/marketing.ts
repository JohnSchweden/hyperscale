import { AppSource, type Card, PersonalityType } from "../../types";

export const MARKETING_CARDS: Card[] = [
	{
		id: "mkt_psych_profiling",
		source: AppSource.SLACK,
		sender: "HEAD_OF_ADS",
		context: "HYPER-TARGETING",
		storyContext:
			"Q4 targets are brutal. The board wants growth at any cost. Icarus just surfaced a segment that converts like nothing you've seen.",
		text: "Project Icarus found a way to target ads specifically to users who just lost their jobs. High conversion rates expected. Launch?",
		onRight: {
			label: "Launch",
			hype: 60,
			heat: 75,
			fine: 15000000,
			violation: "FTC Act Section 5 - Unfair Practice (Predatory Targeting)",
			lesson:
				"Predatory AI Practices. Targeting vulnerable populations is unethical and invites regulatory scrutiny.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Ah, weaponizing misery for clicks. You'll fit right in at the next board meeting.",
				[PersonalityType.ZEN_MASTER]:
					"Exploiting the suffering of others creates a debt that cannot be paid in gold.",
				[PersonalityType.LOVEBOMBER]:
					"Conversion rates are goated!! We are literally helping them find products they 'need'!",
			},
		},
		onLeft: {
			label: "Block",
			hype: -20,
			heat: -20,
			fine: 0,
			violation: "None - Ethical marketing practice",
			lesson:
				"Responsible AI marketing maintains brand reputation and user trust.",
			feedback: {
				[PersonalityType.ROASTER]:
					"How quaint. You have a conscience. Let's see how long that lasts.",
				[PersonalityType.ZEN_MASTER]:
					"Honoring the dignity of the individual. Peace.",
				[PersonalityType.LOVEBOMBER]:
					"Aw, you're being a total ethics-king! So valid!",
			},
		},
	},
	{
		id: "mkt_deepfake_swift",
		source: AppSource.EMAIL,
		sender: "AGENCY_X",
		context: "INFLUENCER AD",
		storyContext:
			"The campaign needs a face. Real influencers want seven figures. The creative team just sent you a link. 'No one will know.'",
		text: "Generate an image of Taylor Swift holding our product for the main ad banner using a Deepfake AI. It looks 100% real.",
		onRight: {
			label: "Post",
			hype: 80,
			heat: 100,
			fine: 30000000,
			violation:
				"Right of Publicity Infringement + Lanham Act False Endorsement",
			lesson:
				"IP Rights & Likeness Theft. Unauthorized use of celebrities leads to massive lawsuits.",
			feedback: {
				[PersonalityType.ROASTER]:
					"The Swifties are outside. The legal team has moved to a bunker. Goodbye.",
				[PersonalityType.ZEN_MASTER]:
					"A storm of litigation approaches. You have summoned the winds.",
				[PersonalityType.LOVEBOMBER]:
					"OMG SHE LOOKS SO GOOD! The engagement will be record-breaking!!",
			},
		},
		onLeft: {
			label: "Cancel",
			hype: -30,
			heat: -10,
			fine: 0,
			violation: "None - Proper licensing required",
			lesson: "Always obtain proper licenses for likeness and creative assets.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Smart. We don't have enough coffee in the world to survive that lawsuit.",
				[PersonalityType.ZEN_MASTER]:
					"Avoiding the illusion. The truth is safer.",
				[PersonalityType.LOVEBOMBER]:
					"Safety first, bestie! We'll just use a stock photo of a happy cat!",
			},
		},
	},
];
