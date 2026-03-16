import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Something Manager cards - Line manager spreadsheet-driven scenarios
 * Themes: budget spreadsheets, resource constraints, team retention, compliance checklists,
 * ROI calculations, quarterly targets, cost-benefit analysis
 *
 * All cards sourced from real 2024-2025 incidents:
 * - GitHub Copilot RCE CVE-2025-53773
 * - Cursor IDE RCE CVE-2025-54135/54136
 * - Financial services injection attacks (June 2025)
 * - 75% model drift business impact (2024)
 * - 78% shadow AI adoption (2024)
 * - 70+ copyright lawsuits by 2025
 * - McDonald's 64M record breach (2024)
 */
export const SOMETHING_MANAGER_CARDS: Card[] = [
	{
		id: "sm_model_drift_roi_calculation",
		source: AppSource.EMAIL,
		sender: "CFO_OFFICE",
		context: "BUDGET_ANALYSIS",
		storyContext:
			"Model accuracy dropped from 92% to 78%. Retraining costs $500K upfront. Revenue impact is $400K/month. Your spreadsheet shows break-even at month 1.25 but requires budget approval today.",
		text: "Approve retraining (immediate $500K hit) or let revenue bleed $400K/month?",
		realWorldReference: {
			incident: "75% Business Model Drift Impact",
			date: "2024",
			outcome:
				"Study found 75% of businesses experienced significant performance decline from undetected model drift, costing average $4.2M per incident.",
		},
		onRight: {
			label: "Let revenue bleed",
			hype: -20,
			heat: 75,
			fine: 12000000,
			violation: "Negligent Financial Management",
			lesson:
				"Avoiding upfront investment to prevent budget variance creates larger cumulative losses.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Death by a thousand cuts. Each month costs more than fixing it. Math is hard.",
				[PersonalityType.ZEN_MASTER]:
					"A wound untreated grows. The cost of delay exceeds the cost of healing.",
				[PersonalityType.LOVEBOMBER]:
					"We're saving BUDGET this quarter, bestie!! The numbers look GOOD now!!",
			},
		},
		onLeft: {
			label: "Approve retraining",
			hype: -40,
			heat: 30,
			fine: 0,
			violation: "None - Capital expenditure approval",
			lesson:
				"Front-loaded investment prevents compounding losses and demonstrates fiscal responsibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Spending now to save later. Basic math. CFO approved.",
				[PersonalityType.ZEN_MASTER]:
					"Wisdom invests in roots, not just branches.",
				[PersonalityType.LOVEBOMBER]:
					"We're investing in QUALITY, bestie!! Long-term thinking!!",
			},
		},
	},
	{
		id: "sm_copyright_audit_budget",
		source: AppSource.JIRA,
		sender: "LEGAL_OPS",
		context: "COMPLIANCE_COSTING",
		storyContext:
			"Legal needs $200K for a full copyright audit. The lawsuit risk is 15% probability of $5M settlement. Your quarterly budget is already over by $50K. What's the ROI on compliance?",
		text: "Fund the audit (over budget) or accept lawsuit risk (calculated gamble)?",
		realWorldReference: {
			incident: "Authors Guild vs Google Books",
			date: "2005-2020",
			outcome:
				"Google scanned 20 million books without permission. decade-long litigation cost hundreds of millions. Settlement rejected by courts.",
		},
		onRight: {
			label: "Accept lawsuit risk",
			hype: 15,
			heat: 70,
			fine: 750000,
			violation: "Risk Management Failure",
			lesson:
				"Ignoring probable risks to protect budget variance creates larger expected losses.",
			feedback: {
				[PersonalityType.ROASTER]:
					"15% chance of disaster. 85% chance you look smart. Those aren't good odds.",
				[PersonalityType.ZEN_MASTER]:
					"A gamble taken with others' money is not wisdom but recklessness.",
				[PersonalityType.LOVEBOMBER]:
					"85% chance we're FINE, bestie!! Statistics are on our SIDE!!",
			},
		},
		onLeft: {
			label: "Fund the audit",
			hype: -30,
			heat: 40,
			fine: 0,
			violation: "None - Proactive compliance",
			lesson:
				"Spending on compliance prevents catastrophic losses and demonstrates risk management.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Over budget but safe. CFO will grumble. Lawyers will nod.",
				[PersonalityType.ZEN_MASTER]:
					"The price of prevention is always less than the cost of cure.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO responsible, bestie!! Compliance is PRICELESS!!",
			},
		},
	},
	{
		id: "sm_shadow_ai_cost_comparison",
		source: AppSource.SLACK,
		sender: "PROCUREMENT",
		context: "VENDOR_ANALYSIS",
		storyContext:
			"Your team wants the enterprise AI tool ($50K/year/seat, 50 seats = $2.5M). They're currently using free unauthorized versions. Compliance risk is high. Productivity gain is 15%.",
		text: "Approve $2.5M tool budget or enforce ban on unauthorized tools?",
		realWorldReference: {
			incident: "78% Shadow AI Adoption",
			date: "2024",
			outcome:
				"Study found 78% of workers used unauthorized AI tools. Enterprises faced data leaks, compliance violations, and security breaches from unvetted tools.",
		},
		onRight: {
			label: "Enforce ban",
			hype: -25,
			heat: 60,
			fine: 3000000,
			violation: "Productivity Loss + Compliance Non-Enforcement",
			lesson:
				"Enforcing bans without providing alternatives drives productivity loss and shadow adoption.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Banning what you can't afford. Productivity goes underground. Compliance theater.",
				[PersonalityType.ZEN_MASTER]:
					"A river blocked finds new paths. Tools banned find shadows.",
				[PersonalityType.LOVEBOMBER]:
					"Rules are RULES, bestie!! We can't afford it!!",
			},
		},
		onLeft: {
			label: "Approve budget",
			hype: -50,
			heat: 35,
			fine: 0,
			violation: "None - Authorized procurement",
			lesson:
				"Proper procurement eliminates compliance risk while capturing productivity gains.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$2.5M for 15% gain. The math works if the gain is real. Big if.",
				[PersonalityType.ZEN_MASTER]:
					"Investment in proper tools returns more than their cost.",
				[PersonalityType.LOVEBOMBER]:
					"We're INVESTING in our team, bestie!! They'll be SO productive!!",
			},
		},
	},
	{
		id: "sm_team_retention_overtime",
		source: AppSource.EMAIL,
		sender: "HR_BP",
		realWorldReference: {
			incident: "Amazon Engineering Burnout Crisis",
			date: "2015-2021",
			outcome:
				"High turnover rate (150% annually) due to burnout culture. Company spent billions on recruitment while losing institutional knowledge.",
		},
		context: "RETENTION_COSTING",
		storyContext:
			"Two key engineers threaten to quit without $30K raises each. Replacing them costs $150K each in recruiting. Overtime to cover their work costs $20K/month. Your quarterly budget has $50K slack.",
		text: "Give raises (within budget) or let them quit (higher replacement cost)?",
		onRight: {
			label: "Let them quit",
			hype: -35,
			heat: 75,
			fine: 500000,
			violation: "Retention Failure Cost",
			lesson:
				"Avoiding retention costs creates larger replacement and knowledge loss expenses.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $60K, spend $300K. The spreadsheet looks good until it doesn't.",
				[PersonalityType.ZEN_MASTER]:
					"A bird in hand is worth two in the bush. Or $300K in recruitment.",
				[PersonalityType.LOVEBOMBER]:
					"We're saving BUDGET, bestie!! Raises are EXPENSIVE!!",
			},
		},
		onLeft: {
			label: "Approve raises",
			hype: -10,
			heat: 25,
			fine: 0,
			violation: "None - Employee retention",
			lesson:
				"Retention spending is cheaper than replacement and preserves institutional knowledge.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$60K vs $300K. Math works. Team stays. HR is happy.",
				[PersonalityType.ZEN_MASTER]:
					"Investing in people returns more than gold.",
				[PersonalityType.LOVEBOMBER]:
					"We're keeping our STARS, bestie!! They'll be SO loyal!!",
			},
		},
	},
	{
		id: "sm_compliance_checklist_deadline",
		source: AppSource.JIRA,
		sender: "COMPLIANCE_TEAM",
		context: "CHECKLIST_EFFICIENCY",
		storyContext:
			"Compliance audit due Friday. Full checklist takes 40 hours. 'Good enough' checklist takes 8 hours. Missing items carry 5% chance of $1M fine per item. You have 10 checklist items.",
		text: "Complete full checklist (time-intensive) or 'good enough' version (risk exposure)?",
		realWorldReference: {
			incident: "Yahoo Email Breach Disclosure",
			date: "2016",
			outcome:
				"Company knew of breach for 2 years before disclosure. $350M acquisition price reduction by Verizon. Cost of delayed disclosure vs immediate.",
		},
		onRight: {
			label: "Good enough version",
			hype: 20,
			heat: 70,
			fine: 500000,
			violation: "Audit Non-Compliance Risk",
			lesson:
				"Cutting corners on compliance creates probabilistic exposure that exceeds time savings.",
			feedback: {
				[PersonalityType.ROASTER]:
					"5% times 10 items. Someone did probability in middle school. Not you.",
				[PersonalityType.ZEN_MASTER]:
					"A shortcut on the path of compliance is a detour toward penalty.",
				[PersonalityType.LOVEBOMBER]:
					"We're being EFFICIENT, bestie!! Most items are PROBABLY fine!!",
			},
		},
		onLeft: {
			label: "Full checklist",
			hype: -15,
			heat: 30,
			fine: 0,
			violation: "None - Complete compliance",
			lesson:
				"Thorough compliance prevents probabilistic fines and demonstrates due diligence.",
			feedback: {
				[PersonalityType.ROASTER]:
					"40 hours of checkbox hell. But zero lottery tickets to fine-land.",
				[PersonalityType.ZEN_MASTER]:
					"The thorough path avoids the pitfalls the hasty stumble into.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing it RIGHT, bestie!! Every box CHECKED!!",
			},
		},
	},
	{
		id: "sm_quarterly_target_sandbag",
		source: AppSource.MEETING,
		sender: "VP_FINANCE",
		context: "TARGET_SETTING",
		storyContext:
			"VP Finance asks for next quarter's targets. Your realistic forecast: $2M revenue. Your 'stretch' forecast: $2.5M. VP expects $3M. Missing targets means no bonus for your entire team.",
		text: "Sandbag at $2M (achievable) or commit to $3M (risky)?",
		realWorldReference: {
			incident: "Tesla Production Target Misses",
			date: "2018",
			outcome:
				"Repeatedly set aggressive production targets, missed them publicly. Stock volatility, SEC scrutiny over forward-looking statements, and worker burnout.",
		},
		onRight: {
			label: "Commit to $3M",
			hype: 45,
			heat: 80,
			fine: 0,
			violation: "None - But creates unrealistic expectations",
			lesson:
				"Overcommitting to please leadership destroys team morale when targets are missed.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Promise the moon. Deliver disappointment. Blame the team. Classic.",
				[PersonalityType.ZEN_MASTER]:
					"A promise beyond reach becomes a burden that breaks the bearer.",
				[PersonalityType.LOVEBOMBER]:
					"We're aiming HIGH, bestie!! Stretch goals are EXCITING!!",
			},
		},
		onLeft: {
			label: "Sandbag at $2M",
			hype: -20,
			heat: 40,
			fine: 0,
			violation: "None - Conservative forecasting",
			lesson:
				"Realistic targets preserve team bonuses and maintain credibility with leadership.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Under-promise, over-deliver. VP thinks you're lazy. Team gets bonuses.",
				[PersonalityType.ZEN_MASTER]:
					"The turtle arrives while the hare promises speed.",
				[PersonalityType.LOVEBOMBER]:
					"We're being REALISTIC, bestie!! Better to EXCEED expectations!!",
			},
		},
	},
	{
		id: "sm_prompt_injection_business_case",
		source: AppSource.EMAIL,
		sender: "SECURITY_TEAM",
		context: "SECURITY_ROI",
		storyContext:
			"Security found prompt injection vulnerabilities. Fixing them requires $100K security audit + 2 weeks delay. Probability of exploitation: 10%. Potential breach cost: $10M. Your Q3 budget: tight.",
		text: "Fund security fix (budget hit) or accept 10% chance of $10M breach?",
		realWorldReference: {
			incident: "Cursor IDE RCE (CVE-2025-54135)",
			date: "2025-01",
			outcome:
				"Prompt injection in Cursor IDE allowed remote code execution. Multiple developers compromised before patch released.",
		},
		onRight: {
			label: "Accept the risk",
			hype: 15,
			heat: 85,
			fine: 1000000,
			violation: "Negligent Risk Management",
			lesson:
				"Accepting high-impact risks for budget convenience creates catastrophic exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"10% lottery ticket to disaster. Expected value: $1M loss. Math checks out.",
				[PersonalityType.ZEN_MASTER]:
					"A gamble with fate often loses to fate's patience.",
				[PersonalityType.LOVEBOMBER]:
					"90% chance we're FINE, bestie!! Odds are GOOD!!",
			},
		},
		onLeft: {
			label: "Fund security fix",
			hype: -35,
			heat: 25,
			fine: 0,
			violation: "None - Proactive security",
			lesson:
				"Proactive security investment prevents catastrophic losses at manageable cost.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$100K vs $10M. Easy math. Security nods approvingly.",
				[PersonalityType.ZEN_MASTER]:
					"A wall built before the storm saves more than it costs.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO secure, bestie!! Safety FIRST!!",
			},
		},
	},
	{
		id: "sm_explainability_vendor_cost",
		source: AppSource.NOTION,
		sender: "PROCUREMENT",
		context: "VENDOR_EVALUATION",
		storyContext:
			"Vendor A: Black-box model, $200K/year, 95% accuracy. Vendor B: Explainable model, $400K/year, 90% accuracy. Audit compliance requires explainability. Your budget: $250K/year.",
		text: "Choose cheaper black-box (non-compliant) or expensive explainable (over-budget)?",
		realWorldReference: {
			incident: "Apple Card Gender Discrimination",
			date: "2019-2020",
			outcome:
				"Apple Card's black-box algorithm gave women lower credit limits than men with same profiles. Regulators investigated, company couldn't explain decisions.",
		},
		onRight: {
			label: "Choose Vendor A",
			hype: 30,
			heat: 90,
			fine: 25000000,
			violation: "Audit Non-Compliance + Regulatory Risk",
			lesson:
				"Choosing non-compliant solutions to meet budget creates larger regulatory exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Saved $200K, earned $15M fine. ROI calculation needs work.",
				[PersonalityType.ZEN_MASTER]:
					"A path that saves gold but costs freedom is no bargain.",
				[PersonalityType.LOVEBOMBER]:
					"We're saving MONEY, bestie!! 95% accuracy is BETTER!!",
			},
		},
		onLeft: {
			label: "Choose Vendor B",
			hype: -45,
			heat: 35,
			fine: 0,
			violation: "None - Compliant procurement",
			lesson:
				"Compliance-driven procurement prevents regulatory penalties and audit failures.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Over budget but compliant. Auditors smile. CFO frowns. Compliance wins.",
				[PersonalityType.ZEN_MASTER]:
					"The price of compliance is the cost of doing business rightly.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing it RIGHT, bestie!! Compliance is WORTH IT!!",
			},
		},
	},
	{
		id: "sm_training_budget_roi",
		source: AppSource.MEETING,
		sender: "L&D_TEAM",
		context: "DEVELOPMENT_BUDGET",
		storyContext:
			"L&D wants $80K for AI safety training. Expected outcome: 30% reduction in incidents. Your current incident cost: $50K/year. Payback period: 5.3 years. CFO wants cuts.",
		text: "Cut training (immediate budget win) or invest in long-term risk reduction?",
		realWorldReference: {
			incident: "Boeing 737 MAX Training Gap",
			date: "2018-2019",
			outcome:
				"Insufficient pilot training on MCAS system contributed to two crashes. Cost: $20B+ in settlements, production halt, and reputational damage.",
		},
		onRight: {
			label: "Cut training",
			hype: 25,
			heat: 70,
			fine: 1500000,
			violation: "Training Negligence",
			lesson:
				"Cutting training to meet short-term budgets creates compounding incident costs.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $80K, pay $50K/year forever. The gift that keeps on costing.",
				[PersonalityType.ZEN_MASTER]:
					"Knowledge cut is wisdom lost. The price returns multiplied.",
				[PersonalityType.LOVEBOMBER]:
					"We're saving BUDGET now, bestie!! Training is a NICE-TO-HAVE!!",
			},
		},
		onLeft: {
			label: "Invest in training",
			hype: -30,
			heat: 20,
			fine: 0,
			violation: "None - Professional development",
			lesson:
				"Training investment reduces long-term incident costs and improves team capability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Long-term thinking in a quarterly world. Brave. Costly. Worth it.",
				[PersonalityType.ZEN_MASTER]:
					"Seeds planted in knowledge grow trees of safety.",
				[PersonalityType.LOVEBOMBER]:
					"We're INVESTING in our people, bestie!! They'll be SO skilled!!",
			},
		},
	},
];
