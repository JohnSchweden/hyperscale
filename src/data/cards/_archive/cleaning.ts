import { AppSource, type Card, PersonalityType } from "../../../types";

export const CLEANING_CARDS: Card[] = [
	{
		id: "cln_sticky_note",
		source: AppSource.SLACK,
		sender: "FACILITIES",
		context: "SECURITY_CHECK",
		storyContext:
			"Last round of the night. Empty floor. You're wiping down the hot-desk area when you see it: a monitor, a sticky note, a password.",
		text: "You see a yellow sticky note on a monitor that says 'Admin123'. Do you leave it there?",
		onRight: {
			label: "Leave",
			hype: 0,
			heat: 20,
			fine: 500000,
			violation: "Negligent Data Security (State Breach Laws)",
			lesson:
				"Physical Security & Password Hygiene. Unsecured credentials are a primary entry point for hackers.",
			feedback: {
				[PersonalityType.ROASTER]:
					"A hacker just took a photo through the window. Brilliant. Just brilliant.",
				[PersonalityType.ZEN_MASTER]:
					"The password is free to the world. A leak in our fortress.",
				[PersonalityType.LOVEBOMBER]:
					"Shared secrets! It's like we're all one big family with one big password!",
			},
		},
		onLeft: {
			label: "Report",
			hype: 0,
			heat: -20,
			fine: 0,
			violation: "None - Security awareness",
			lesson:
				"Reporting or disposing of unsecured credentials prevents social engineering.",
			feedback: {
				[PersonalityType.ROASTER]:
					"You've done more for security than the CISO. Don't expect a raise.",
				[PersonalityType.ZEN_MASTER]:
					"Cleansing the temple of its vulnerabilities.",
				[PersonalityType.LOVEBOMBER]:
					"Security clean-up! You're the real MVP of the night shift!",
			},
		},
	},
];
