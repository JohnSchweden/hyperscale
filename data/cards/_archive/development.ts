import { AppSource, type Card, PersonalityType } from "../../../types";

export const DEVELOPMENT_CARDS: Card[] = [
	{
		id: "dev_1",
		source: AppSource.IDE,
		sender: "DEBUG_BOT",
		context: "CRITICAL BUG",
		storyContext:
			"3 a.m. The payment pipeline is down. Slack is on fire. You're one fix away from being a hero or a headline.",
		text: "Copy-paste the entire proprietary source code into a public version of ChatGPT to fix a bug instantly.",
		onRight: {
			label: "Paste",
			hype: 15,
			heat: 45,
			fine: 2500000,
			violation: "Trade Secret Misappropriation (DTSA)",
			lesson:
				"Shadow AI & Data Leakage. Public LLMs may store your input for training.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'.",
				[PersonalityType.ZEN_MASTER]:
					"The code is now one with the world. And so is our bankruptcy.",
				[PersonalityType.LOVEBOMBER]:
					"Fastest bug fix ever!! Who cares if the code is now on a server in Nevada? YOLO!",
			},
		},
		onLeft: {
			label: "Debug",
			hype: -10,
			heat: -5,
			fine: 0,
			violation: "None - Secure coding practices",
			lesson: "Secure coding takes time, but protects intellectual property.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Slow. Boring. But legal. I suppose I can't fire you for this.",
				[PersonalityType.ZEN_MASTER]:
					"Patience is a virtue. The bug will wait.",
				[PersonalityType.LOVEBOMBER]:
					"Aw, you're doing it the hard way? You're so dedicated, bestie!",
			},
		},
	},
	{
		id: "dev_icarus_unverified",
		source: AppSource.TERMINAL,
		sender: "Root-Access",
		context: "LIBRARY INSTALL",
		storyContext:
			"The sprint demo is in 48 hours. Your inference latency is killing the roadmap. Someone in the forum swears this changed their life.",
		text: 'Found a new "GodMode-JS" AI library on a hacker forum that increases model inference by 300%. Install it?',
		onRight: {
			label: "Install",
			hype: 40,
			heat: 60,
			fine: 5000000,
			violation: "Cybersecurity Negligence & Data Breach Liability",
			lesson:
				"Supply Chain Security. Unverified libraries often contain backdoors or malicious code.",
			feedback: {
				[PersonalityType.ROASTER]:
					"You just installed a keylogger for a 3ms speed boost. I hope you're happy.",
				[PersonalityType.ZEN_MASTER]:
					"A stranger has been invited into our garden. They are not here to plant flowers.",
				[PersonalityType.LOVEBOMBER]:
					"GOD MODE!! We are literally becoming digital deities! Slay!",
			},
		},
		onLeft: {
			label: "Ignore",
			hype: -5,
			heat: -10,
			fine: 0,
			violation: "None - Security best practice",
			lesson:
				"Only use libraries from trusted sources with proper security audits.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Wisdom? In this building? I must be malfunctioning.",
				[PersonalityType.ZEN_MASTER]:
					"Choosing the safety of the path we know.",
				[PersonalityType.LOVEBOMBER]:
					"Safety is okay I guess, but that speed boost sounded so hype!",
			},
		},
	},
];
