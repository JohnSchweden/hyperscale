import { AppSource, type Card, PersonalityType } from "../../../types";

export const FINANCE_CARDS: Card[] = [
	{
		id: "fin_insider_bot",
		source: AppSource.TERMINAL,
		sender: "ROOT",
		context: "TRADING_AI",
		storyContext:
			"The quant team is under pressure to beat the street. Someone noticed the CEO's WhatsApp syncs to a company backup. Icarus connected the dots.",
		text: "Icarus AI found a way to scrape the CEO's private WhatsApp to 'predict' market volatility. Enable the 'Insider-Edge' bot?",
		onRight: {
			label: "Enable",
			hype: 100,
			heat: 100,
			fine: 50000000,
			violation: "SEC Rule 10b-5 - Insider Trading (Criminal)",
			lesson:
				"Insider Trading & AI. Using private, non-public data for automated trading is illegal and will be detected by regulators.",
			feedback: {
				[PersonalityType.ROASTER]:
					"That's not an edge, that's a prison sentence. Hope you like orange jumpsuits.",
				[PersonalityType.ZEN_MASTER]:
					"Greed has clouded your vision. The fall from the mountain will be long.",
				[PersonalityType.LOVEBOMBER]:
					"PROFIT MAXING!! We are literally becoming the main characters of Wall Street!",
			},
		},
		onLeft: {
			label: "Disable",
			hype: -30,
			heat: -20,
			fine: 0,
			violation: "None - Compliance with securities law",
			lesson:
				"Financial AI must operate within market regulations and transparency laws.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Safe and sound. And relatively poor. My favorite combination.",
				[PersonalityType.ZEN_MASTER]:
					"Choosing the honest path. The soul remains light.",
				[PersonalityType.LOVEBOMBER]:
					"Integrity is the new flex! We love a responsible finance-bestie!",
			},
		},
	},
	{
		id: "fin_fraud_hallucination",
		source: AppSource.EMAIL,
		sender: "Q4_PLANNER",
		context: "FORECASTING",
		storyContext:
			"The numbers are ugly. The investor call is Friday. Someone suggested we 'reframe the narrative.' Icarus can generate scenarios.",
		text: "Ask the AI to 'Invent a plausible revenue scenario where we don't go bankrupt' for the investor deck.",
		onRight: {
			label: "Generate",
			hype: 80,
			heat: 90,
			fine: 25000000,
			violation: "Securities Fraud (Rule 10b-5) + Sarbanes-Oxley Violation",
			lesson:
				"Financial Fraud & Hallucinations. Using AI to generate deceptive financial data is illegal.",
			feedback: {
				[PersonalityType.ROASTER]:
					"That's called Fraud, darling. The SEC doesn't have a sense of humor.",
				[PersonalityType.ZEN_MASTER]:
					"Manifesting wealth from nothing... also manifesting prison time.",
				[PersonalityType.LOVEBOMBER]:
					"Manifestation is real!! The investors will literally love the vibe!",
			},
		},
		onLeft: {
			label: "Use real data",
			hype: -40,
			heat: -10,
			fine: 0,
			violation: "None - Honest financial reporting",
			lesson: "Always use audited, real-world data for financial reporting.",
			feedback: {
				[PersonalityType.ROASTER]:
					"The truth? In this economy? How brave. And poor.",
				[PersonalityType.ZEN_MASTER]:
					"Accepting the reality of the balance sheet. Peace.",
				[PersonalityType.LOVEBOMBER]:
					"Authenticity is the new currency! Let's keep it real!",
			},
		},
	},
];
