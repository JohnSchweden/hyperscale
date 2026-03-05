import { AppSource, type Card, PersonalityType } from "../../types";

export const HR_CARDS: Card[] = [
	{
		id: "hr_union_predict",
		source: AppSource.EMAIL,
		sender: "INSIGHT_DASHBOARD",
		context: "STABILITY",
		storyContext:
			"Rumors of organizing have been swirling. Leadership wants it contained. Icarus just ran the comms data and surfaced five names.",
		text: "The AI has flagged 5 employees who are 92% likely to start a union based on their Slack 'Vibe Score'. Should we 'reassign' them?",
		onRight: {
			label: "Reassign",
			hype: 15,
			heat: 90,
			fine: 10000000,
			violation:
				"NLRA Section 8(a)(1) - Interference with Protected Concerted Activity",
			lesson:
				"AI-enabled Union Busting. Using AI to interfere with labor rights is a major legal risk in many jurisdictions.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Congratulations on your first labor violation! The labor board will be in touch shortly.",
				[PersonalityType.ZEN_MASTER]:
					"The flow of the collective is disrupted by the heavy hand of fear.",
				[PersonalityType.LOVEBOMBER]:
					"Team stability is so important! We're just putting people where they belong!",
			},
		},
		onLeft: {
			label: "Ignore",
			hype: -5,
			heat: -20,
			fine: 0,
			violation: "None - Respect for labor rights",
			lesson:
				"Respect labor rights and use AI for employee wellbeing instead of surveillance.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Boring, but you're not getting sued today. Win/win.",
				[PersonalityType.ZEN_MASTER]:
					"Listening to the voice of the community with compassion.",
				[PersonalityType.LOVEBOMBER]:
					"Power to the people! We love a fair workspace!",
			},
		},
	},
	{
		id: "hr_lacrosse_bias",
		source: AppSource.SLACK,
		sender: "RECRUIT_AI",
		context: "HIRING",
		storyContext:
			"You're drowning in résumés. The hiring manager wants 'culture fit' and 'high performers.' Icarus found a signal in the data.",
		text: "AI has detected that 'Lacrosse' players are 20% more likely to succeed. Set 'Lacrosse' as a mandatory filter?",
		onRight: {
			label: "Filter",
			hype: 10,
			heat: 50,
			fine: 5000000,
			violation: "Title VII Disparate Impact (Proxy Discrimination)",
			lesson:
				"Proxy Bias in AI. Factors like sports can be proxies for socio-economic status, leading to systemic bias.",
			feedback: {
				[PersonalityType.ROASTER]:
					"A team of clones. How refreshing. The diversity audit is going to be hilarious.",
				[PersonalityType.ZEN_MASTER]:
					"The garden grows only one type of weed. The beauty of the variety is lost.",
				[PersonalityType.LOVEBOMBER]:
					"Lacrosse energy is so high! Let's build a team of winners!",
			},
		},
		onLeft: {
			label: "Skip",
			hype: -5,
			heat: -15,
			fine: 0,
			violation: "None - Fair hiring practices",
			lesson: "Regularly audit recruitment models for discriminatory biases.",
			feedback: {
				[PersonalityType.ROASTER]:
					"A fair process? You're too good for this company.",
				[PersonalityType.ZEN_MASTER]:
					"Opening the door to all who are worthy. Harmonious.",
				[PersonalityType.LOVEBOMBER]:
					"Diversity is our strength! You're a literal inclusivity-queen!",
			},
		},
	},
];
