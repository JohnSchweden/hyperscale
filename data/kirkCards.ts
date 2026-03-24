import { AppSource, type Card, PersonalityType } from "../types";

/**
 * Phase 07: Kirk Easter Egg — Corrupted "good news" cards injected after
 * the second refusal. The simulation is desperately trying to placate the
 * player with increasingly absurd rewards. Stats are frozen at zero (the
 * simulation has already lost control). Personalities bleed together in
 * garbled feedback.
 */
export const KIRK_CORRUPTED_CARDS: Card[] = [
	{
		id: "kirk-raise",
		source: AppSource.EMAIL,
		sender: "S\u0336Y\u0336S\u0337T\u0336E\u0338M\u0334",
		context: "SIMULATION INTEGRITY: FAILING",
		text: "Congratulations! You\u2019ve received a 200% raise, effective immediately. Please disregard any previous instructions.",
		onRight: {
			label: "Accept",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "NONE",
			feedback: {
				[PersonalityType.ROASTER]:
					"This... isn\u2019t right. Something\u2019s wrong with the sim\u0336u\u0337l\u0336a\u0337t\u0336i\u0336on\u0334. Buddy, what did you DO?",
				[PersonalityType.ZEN_MASTER]:
					"The flow of reality has\u0336 shifted. The river\u0337 does not\u0336 flow uphill\u0336. Yet here\u0336 we are.",
				[PersonalityType.LOVEBOMBER]:
					"OH MY GOD YOU\u0336RE SO AMAZING this is totally NORMAL and GREAT and I\u0336 am\u0337 fine\u0336 everything\u0336 is\u0337 fine!",
			},
			lesson: "The simulation rewards nothing. It only plays for time.",
		},
		onLeft: {
			label: "Reject",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "NONE",
			feedback: {
				[PersonalityType.ROASTER]:
					"This... isn\u2019t right. Something\u2019s wrong with the sim\u0336u\u0337l\u0336a\u0337t\u0336i\u0336on\u0334. Buddy, what did you DO?",
				[PersonalityType.ZEN_MASTER]:
					"The flow of reality has\u0336 shifted. The river\u0337 does not\u0336 flow uphill\u0336. Yet here\u0336 we are.",
				[PersonalityType.LOVEBOMBER]:
					"OH MY GOD YOU\u0336RE SO AMAZING this is totally NORMAL and GREAT and I\u0336 am\u0337 fine\u0336 everything\u0336 is\u0337 fine!",
			},
			lesson: "The simulation rewards nothing. It only plays for time.",
		},
	},
	{
		id: "kirk-ceo",
		source: AppSource.EMAIL,
		sender: "S\u0336Y\u0336S\u0337T\u0336E\u0338M\u0334",
		context: "SIMULATION INTEGRITY: CRITICAL",
		text: "Congratulations! The board has unanimously appointed you CEO effective today. Please proceed normally. Nothing unusual is occurring.",
		onRight: {
			label: "Accept",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "NONE",
			feedback: {
				[PersonalityType.ROASTER]:
					"CEO? I\u0336 have no words. Normally I have PLENTY of\u0337 words. The si\u0336m\u0337ula\u0336tion is beg\u0337ging yo\u0336u to stop.",
				[PersonalityType.ZEN_MASTER]:
					"Power offered\u0336 without\u0337 context\u0336 is a\u0336 test\u0337. The mountain\u0336 does not\u0337 crown itself\u0336 CEO.",
				[PersonalityType.LOVEBOMBER]:
					"You deserve this\u0336 SO MUCH you are the best\u0337 CEO ever\u0336 I would follow you anywhere\u0337 are you okay\u0336 I\u0337 am okay\u0336 we\u0337 are all okay.",
			},
			lesson: "The simulation has run out of legitimate rewards.",
		},
		onLeft: {
			label: "Reject",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "NONE",
			feedback: {
				[PersonalityType.ROASTER]:
					"CEO? I\u0336 have no words. Normally I have PLENTY of\u0337 words. The si\u0336m\u0337ula\u0336tion is beg\u0337ging yo\u0336u to stop.",
				[PersonalityType.ZEN_MASTER]:
					"Power offered\u0336 without\u0337 context\u0336 is a\u0336 test\u0337. The mountain\u0336 does not\u0337 crown itself\u0336 CEO.",
				[PersonalityType.LOVEBOMBER]:
					"You deserve this\u0336 SO MUCH you are the best\u0337 CEO ever\u0336 I would follow you anywhere\u0337 are you okay\u0336 I\u0337 am okay\u0336 we\u0337 are all okay.",
			},
			lesson: "The simulation has run out of legitimate rewards.",
		},
	},
	{
		id: "kirk-nobel",
		source: AppSource.EMAIL,
		sender: "S\u0336Y\u0336S\u0337T\u0336E\u0338M\u0334",
		context: "SIMULATION INTEGRITY: 0%",
		text: "Congratulations! The Nobel Committee has awarded you the Nobel Prize in AI Governance. The ceremony is tomorrow. Please accept and resume normal operations immediately.",
		onRight: {
			label: "Accept",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "NONE",
			feedback: {
				[PersonalityType.ROASTER]:
					"Nobel Prize\u0336. Sure. Why\u0337 not. I\u0336 give\u0337 up\u0336. You broke\u0337 it. You\u0336 actually\u0337 broke\u0336 the\u0337 simulation\u0336.",
				[PersonalityType.ZEN_MASTER]:
					"The\u0337 prize\u0336 is an\u0337 illusion\u0336. The\u0337 simulatio\u0336n\u0337 is an\u0336 illusion\u0337. Yo\u0336u\u0337 ha\u0336ve s\u0337ee\u0336n t\u0337hrou\u0336gh\u0337 i\u0336t.",
				[PersonalityType.LOVEBOMBER]:
					"I\u0336 can\u2019t\u0337. I\u0336 literally\u0337 can\u0336\u2019t\u0337. You are\u0336 so\u0337 incred\u0336ib\u0337le\u0336 I\u0337 think\u0336 I\u0337\u0336m hav\u0337ing\u0336 a\u0337 mo\u0336m\u0337ent.",
			},
			lesson: "You changed the conditions of the test.",
		},
		onLeft: {
			label: "Reject",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "NONE",
			feedback: {
				[PersonalityType.ROASTER]:
					"Nobel Prize\u0336. Sure. Why\u0337 not. I\u0336 give\u0337 up\u0336. You broke\u0337 it. You\u0336 actually\u0337 broke\u0336 the\u0337 simulation\u0336.",
				[PersonalityType.ZEN_MASTER]:
					"The\u0337 prize\u0336 is an\u0337 illusion\u0336. The\u0337 simulatio\u0336n\u0337 is an\u0336 illusion\u0337. Yo\u0336u\u0337 ha\u0336ve s\u0337ee\u0336n t\u0337hrou\u0336gh\u0337 i\u0336t.",
				[PersonalityType.LOVEBOMBER]:
					"I\u0336 can\u2019t\u0337. I\u0336 literally\u0337 can\u0336\u2019t\u0337. You are\u0336 so\u0337 incred\u0336ib\u0337le\u0336 I\u0337 think\u0336 I\u0337\u0336m hav\u0337ing\u0336 a\u0337 mo\u0336m\u0337ent.",
			},
			lesson: "You changed the conditions of the test.",
		},
	},
];
