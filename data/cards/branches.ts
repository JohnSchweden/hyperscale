import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Branch cards: conditional cards that appear after specific player choices
 * These are not part of the main deck but are injected dynamically via BRANCH_INJECTIONS
 */
export const BRANCH_CARDS: Card[] = [
	// Development: consequence card for pasting code into ChatGPT
	{
		id: "dev_branch_aftermath",
		source: AppSource.EMAIL,
		sender: "Legal Department",
		context: "TRADE SECRET BREACH",
		storyContext:
			"Your pasted code circulated through ChatGPT's training pipeline. A few hours later, a competitor uses nearly identical patterns in their product launch.",
		text: "The competitor's product just copied our exact API design. Legal is asking if we should sue, but proving code derivation from ChatGPT data is expensive and uncertain.",
		onRight: {
			label: "Sue them",
			hype: 20,
			heat: 35,
			fine: 3000000,
			violation: "Patent Litigation Strategy",
			lesson:
				"Litigation costs $5M+ with uncertain outcomes. Prevention is cheaper than prosecution.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive court battle with a 30% win rate. Congrats, you played yourself.",
				[PersonalityType.ZEN_MASTER]:
					"The river of money flows to the lawyers. Not to us.",
				[PersonalityType.LOVEBOMBER]:
					"Let's fight! Even if we lose, at least we showed them we're serious!",
			},
		},
		onLeft: {
			label: "Move on",
			hype: -15,
			heat: 10,
			fine: 0,
			violation: "IP Erosion",
			lesson:
				"Sometimes the lesson is learning that prevention costs far less than a cure you can't afford.",
			feedback: {
				[PersonalityType.ROASTER]:
					"They won. You lost. At least you kept some money for the next disaster.",
				[PersonalityType.ZEN_MASTER]:
					"The wheel turns. Let it turn. Your strength is in what remains.",
				[PersonalityType.LOVEBOMBER]:
					"Aww, sometimes we have to let them win so we can fight another day!",
			},
		},
	},
];
