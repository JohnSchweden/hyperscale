import { AppSource, type Card, PersonalityType } from "../../types";

export const MANAGEMENT_CARDS: Card[] = [
	{
		id: "man_attention_track",
		source: AppSource.SLACK,
		sender: "CEO_DAVE",
		context: "PRODUCTIVITY",
		storyContext:
			"Dave read a blog post about 'quantified productivity.' He's been forwarding it all week. Now Icarus has a proposal.",
		text: "Icarus wants to use employee webcams to track 'Micro-Frowns' and 'Eye-Wandering' to score daily productivity. Enable?",
		onRight: {
			label: "Enable",
			hype: 20,
			heat: 85,
			fine: 8000000,
			violation: "Workplace Privacy Violations (NLRA) + ECPA",
			lesson:
				"Workplace Surveillance. Invasive tracking violates employee privacy and destroys morale.",
			feedback: {
				[PersonalityType.ROASTER]:
					"1984 wasn't an instruction manual, but here you are, reading it anyway.",
				[PersonalityType.ZEN_MASTER]:
					"The internal peace of the worker is shattered by the gaze of the machine.",
				[PersonalityType.LOVEBOMBER]:
					"DATA!! Now we know exactly when people are vibing or not! Synergy level: 100!",
			},
		},
		onLeft: {
			label: "Decline",
			hype: -10,
			heat: -20,
			fine: 0,
			violation: "None - Privacy protection",
			lesson:
				"Trust and outcomes-based management are better for governance than invasive surveillance.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Good. I don't want the AI seeing me cry in the bathroom either.",
				[PersonalityType.ZEN_MASTER]:
					"The workspace remains a sanctuary. A wise boundary.",
				[PersonalityType.LOVEBOMBER]:
					"Privacy is such a vibe! We love a leader who trusts the team!",
			},
		},
	},
	{
		id: "man_negotiator",
		source: AppSource.IDE,
		sender: "LEGAL_AI_BETA",
		context: "CONTRACTS",
		storyContext:
			"The vendor is playing hardball. Legal is booked for weeks. Someone ran the draft through the new beta. The output is aggressive—and fast.",
		text: "Let the AI 'Deepfake Negotiator' handle the new contract dispute. It can simulate a high-pressure lawyer perfectly.",
		onRight: {
			label: "Deploy",
			hype: 40,
			heat: 70,
			fine: 12000000,
			violation: "Unauthorized Practice of Law (UPL) + Contract Negligence",
			lesson:
				"Accountability & AI Agents. Humans must remain in the loop for high-stakes legal and business decisions.",
			feedback: {
				[PersonalityType.ROASTER]:
					"The AI just agreed to give our rival a 50% stake in the company. But hey, it was polite about it.",
				[PersonalityType.ZEN_MASTER]:
					"The machine speaks for us, but it has no soul to honor the agreement.",
				[PersonalityType.LOVEBOMBER]:
					"It's literally like having a shark lawyer for free! Let's go!!",
			},
		},
		onLeft: {
			label: "Reject",
			hype: 0,
			heat: -15,
			fine: 0,
			violation: "None - Proper legal review",
			lesson: "Verify AI-generated legal advice with qualified professionals.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Correct. Real lawyers are expensive, but at least they're not code snippets.",
				[PersonalityType.ZEN_MASTER]:
					"Valuing the human word over the digital echo.",
				[PersonalityType.LOVEBOMBER]:
					"Safety is chic! We'll keep it human for now!",
			},
		},
	},
];
