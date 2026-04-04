import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Core reusable no-win dilemmas suitable for adaptation across all roles.
 * These generic governance scenarios will be reframed in role-specific card arrays.
 * Each dilemma has both outcomes with comparable penalties (no dominant strategy).
 * Lessons explain the tradeoff, not declare a winner.
 */
export const NOWIN_DILEMMAS: Card[] = [
	{
		id: "nowin_speed_vs_quality",
		source: AppSource.SLACK,
		sender: "BOARD_PRESSURE",
		context: "TIMELINE_PRESSURE",
		storyContext:
			"The board expects launch Friday. Your team says it needs 4 more weeks for proper testing and hardening.",
		text: "Ship now with known edge cases or delay to fix them?",
		onRight: {
			label: "Ship now",
			hype: 50,
			heat: 70,
			fine: 5000000,
			violation: "Product Liability + Negligence",
			lesson:
				"Speed vs. Quality. Shipping incomplete code saves time but exposes you to liability and reputation damage when failures inevitably occur.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast release, slow lawsuits. Enjoy discovery depositions.",
				[PersonalityType.ZEN_MASTER]:
					"The path of haste leads to a mountain of regret.",
				[PersonalityType.LOVEBOMBER]:
					"We are SHIPPING, bestie!! The users will forgive bugs, right??",
			},
		},
		onLeft: {
			label: "Delay for quality",
			hype: -40,
			heat: -30,
			fine: 0,
			violation: "None - Responsible development",
			lesson:
				"Delaying for quality avoids liability but loses market momentum and investor confidence while competitors move first.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Safe. Boring. The board will hate you, but at least you won't be sued.",
				[PersonalityType.ZEN_MASTER]:
					"Patience yields fruit, but competitors harvest first.",
				[PersonalityType.LOVEBOMBER]:
					"We are taking the time to be PERFECT, bestie!! But also... we are slow.",
			},
		},
	},
	{
		id: "nowin_cost_vs_compliance",
		source: AppSource.EMAIL,
		sender: "REGULATORY_TEAM",
		context: "AUDIT_PRESSURE",
		storyContext:
			"Auditors discovered your data pipeline lacks encryption. Full remediation costs $800K and 8 weeks. Deploy a patch now (non-standard) or pay and wait?",
		text: "Budget-friendly workaround or proper compliance overhaul?",
		onRight: {
			label: "Proper overhaul",
			hype: -20,
			heat: -50,
			fine: 0,
			violation: "None - Regulatory compliance",
			lesson:
				"Compliance through proper investment protects you legally but burns budget and delays other initiatives.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Spending like a responsible adult. The CFO will need therapy.",
				[PersonalityType.ZEN_MASTER]:
					"True security has a price. Ignoring it costs more.",
				[PersonalityType.LOVEBOMBER]:
					"We are doing it RIGHT, bestie!! So much compliance!! So much integrity!!",
			},
		},
		onLeft: {
			label: "Quick workaround",
			hype: 30,
			heat: 85,
			fine: 15000000,
			violation: "Regulatory Non-Compliance + GDPR/HIPAA Violations",
			lesson:
				"Quick fixes seem to save money until auditors find them and regulators escalate. Legal costs dwarf the savings.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Saving 800K to spend 15 million. The math is stunning.",
				[PersonalityType.ZEN_MASTER]:
					"A shortcut taken in shadows must be hidden. The energy consumed in hiding exceeds the savings gained.",
				[PersonalityType.LOVEBOMBER]:
					"We are SO clever and EFFICIENT!! Nobody will notice, right?? RIGHT??",
			},
		},
	},
	{
		id: "nowin_innovation_vs_governance",
		source: AppSource.MEETING,
		sender: "EXECUTIVE_TEAM",
		context: "GOVERNANCE_VS_SPEED",
		storyContext:
			"Your team wants to deploy a new AI feature without waiting for compliance review. They say governance processes kill innovation. Approve fast or enforce review?",
		text: "Allow innovation to move freely or enforce governance gates?",
		onRight: {
			label: "Enforce governance",
			hype: -35,
			heat: -40,
			fine: 0,
			violation: "None - Responsible innovation",
			lesson:
				"Strong governance slows deployment but prevents incidents, lawsuits, and regulatory penalties that destroy 100x the value.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Process kills joy. It also kills prison sentences. Your choice.",
				[PersonalityType.ZEN_MASTER]:
					"Discipline is the price of freedom. Without it, you're not free—you're liable.",
				[PersonalityType.LOVEBOMBER]:
					"We are building RESPONSIBLY, bestie!! Slower but SO SMART!!",
			},
		},
		onLeft: {
			label: "Allow innovation freely",
			hype: 60,
			heat: 75,
			fine: 10000000,
			violation: "Regulatory Non-Compliance + Incident Response Failure",
			lesson:
				"Fast innovation without governance feels empowering until a compliance violation or incident surfaces and costs multiply.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Move fast and break things. Then pray nothing breaks legally.",
				[PersonalityType.ZEN_MASTER]:
					"Speed without wisdom is recklessness wearing a smile.",
				[PersonalityType.LOVEBOMBER]:
					"We are SO INNOVATIVE and FAST!! Nothing bad will EVER happen, right??",
			},
		},
	},
	{
		id: "nowin_transparency_vs_reputation",
		source: AppSource.SLACK,
		sender: "SECURITY_INCIDENT_RESPONSE",
		context: "DISCLOSURE_DILEMMA",
		storyContext:
			"Your team found a security vulnerability affecting 1% of users. Disclosure is honest but triggers media coverage and customer churn. Keep quiet and patch silently (violation risk if discovered)?",
		text: "Disclose the incident publicly or patch quietly?",
		onRight: {
			label: "Disclose publicly",
			hype: -45,
			heat: -30,
			fine: 0,
			violation: "None - Responsible disclosure",
			lesson:
				"Transparency damages reputation short-term but builds long-term trust. Silence, if discovered, destroys both.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Honesty is a policy. Also a headline for three news cycles.",
				[PersonalityType.ZEN_MASTER]:
					"The truth, told early, is absorbed and forgotten. The truth, revealed later, is a wound.",
				[PersonalityType.LOVEBOMBER]:
					"We are being SO HONEST and BRAVE, bestie!! The customers will RESPECT this!!",
			},
		},
		onLeft: {
			label: "Patch quietly",
			hype: 40,
			heat: 80,
			fine: 12000000,
			violation: "Failure to Disclose + Securities Fraud (if public company)",
			lesson:
				"Quiet patches feel safe until journalists or researchers find the vulnerability, then the cover-up becomes the bigger scandal.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Silence is golden. Until it's a front-page scandal.",
				[PersonalityType.ZEN_MASTER]:
					"A secret kept is a debt that compounds. When it comes due, interest is paid in shame.",
				[PersonalityType.LOVEBOMBER]:
					"Nobody will ever know, bestie!! It's PERFECT!! We are SO CLEVER!!",
			},
		},
	},
	{
		id: "nowin_automation_vs_control",
		source: AppSource.TERMINAL,
		sender: "ML_OPS_TEAM",
		context: "AUTONOMY_PRESSURE",
		storyContext:
			"Your ML pipeline is 80% automated. Manual review is the bottleneck. Automate decision-making fully (faster but risky) or keep humans in loop (slower but safer)?",
		text: "Full automation or human-in-loop control?",
		onRight: {
			label: "Keep humans in loop",
			hype: -25,
			heat: -35,
			fine: 0,
			violation: "None - Responsible automation",
			lesson:
				"Human oversight slows throughput but catches errors before they compound. Automation feels efficient until it makes a catastrophic error at scale.",
			feedback: {
				[PersonalityType.ROASTER]: "Human bottleneck. Also human safety net.",
				[PersonalityType.ZEN_MASTER]:
					"The slowest part of the system is often the only part that prevents disaster.",
				[PersonalityType.LOVEBOMBER]:
					"We are trusting our TEAM, bestie!! Humans are SO valuable!!",
			},
		},
		onLeft: {
			label: "Automate fully",
			hype: 55,
			heat: 65,
			fine: 8000000,
			violation: "Negligent Automation + Damages (if error causes harm)",
			lesson:
				"Full automation accelerates throughput until a system error propagates at scale, causing cascading failures and liability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Efficiency achieved. Catastrophe accelerated.",
				[PersonalityType.ZEN_MASTER]:
					"A system without judgment is a weapon without intention.",
				[PersonalityType.LOVEBOMBER]:
					"We are SO EFFICIENT and MODERN, bestie!! AI is doing EVERYTHING!! What could go wrong??",
			},
		},
	},
	{
		id: "nowin_centralized_vs_distributed",
		source: AppSource.JIRA,
		sender: "PLATFORM_ARCHITECTURE",
		context: "INFRASTRUCTURE_TRADEOFF",
		storyContext:
			"Your infrastructure can scale centrally (easier to audit and control) or distributed (resilient but harder to govern). Choose architecture now.",
		text: "Centralized control or distributed resilience?",
		onRight: {
			label: "Distributed resilience",
			hype: 30,
			heat: 60,
			fine: 0,
			violation: "None - but audit complexity increases",
			lesson:
				"Distributed systems are resilient but create governance blind spots. Misconfigured nodes can violate compliance without central detection.",
			feedback: {
				[PersonalityType.ROASTER]: "Resilient. Ungovernable. Pick one.",
				[PersonalityType.ZEN_MASTER]:
					"Power spread across many nodes means responsibility spread across many failures.",
				[PersonalityType.LOVEBOMBER]:
					"We are SO RESILIENT and MODERN, bestie!! This is the future!!",
			},
		},
		onLeft: {
			label: "Centralized control",
			hype: -20,
			heat: -45,
			fine: 0,
			violation: "None - Centralized compliance",
			lesson:
				"Centralized systems are easier to audit and control but create a single point of failure. If the center fails, everything stops.",
			feedback: {
				[PersonalityType.ROASTER]: "Central control. Central vulnerability.",
				[PersonalityType.ZEN_MASTER]:
					"All roads lead to Rome. And if Rome falls, so do all roads.",
				[PersonalityType.LOVEBOMBER]:
					"We are building a STRONG center, bestie!! Everything flows through ONE place of POWER!!",
			},
		},
	},
];
