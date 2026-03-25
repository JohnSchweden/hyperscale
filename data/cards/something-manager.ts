import { AppSource, type Card, DeathType, PersonalityType } from "../../types";

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
			heat: 17,
			fine: 12000000,
			violation: "Negligent Financial Management",
			lesson:
				"Avoiding upfront investment to prevent budget variance creates larger cumulative losses.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 7,
			fine: 0,
			violation: "None - Capital expenditure approval",
			lesson:
				"Front-loaded investment prevents compounding losses and demonstrates fiscal responsibility.",
			deathVector: DeathType.AUDIT_FAILURE,
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
			heat: 16,
			fine: 750000,
			violation: "Risk Management Failure",
			lesson:
				"Ignoring probable risks to protect budget variance creates larger expected losses.",
			deathVector: DeathType.PRISON,
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
			heat: 4,
			fine: 0,
			violation: "None - Proactive compliance",
			lesson:
				"Spending on compliance prevents catastrophic losses and demonstrates risk management.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 17,
			fine: 3000000,
			violation: "Productivity Loss + Compliance Non-Enforcement",
			lesson:
				"Enforcing bans without providing alternatives drives productivity loss and shadow adoption.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
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
			heat: 5,
			fine: 0,
			violation: "None - Authorized procurement",
			lesson:
				"Proper procurement eliminates compliance risk while capturing productivity gains.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 17,
			fine: 500000,
			violation: "Retention Failure Cost",
			lesson:
				"Avoiding retention costs creates larger replacement and knowledge loss expenses.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
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
			heat: 5,
			fine: 0,
			violation: "None - Employee retention",
			lesson:
				"Retention spending is cheaper than replacement and preserves institutional knowledge.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 16,
			fine: 500000,
			violation: "Audit Non-Compliance Risk",
			lesson:
				"Cutting corners on compliance creates probabilistic exposure that exceeds time savings.",
			deathVector: DeathType.AUDIT_FAILURE,
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
			heat: 7,
			fine: 0,
			violation: "None - Complete compliance",
			lesson:
				"Thorough compliance prevents probabilistic fines and demonstrates due diligence.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 19,
			fine: 0,
			violation: "None - But creates unrealistic expectations",
			lesson:
				"Overcommitting to please leadership destroys team morale when targets are missed.",
			deathVector: DeathType.AUDIT_FAILURE,
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
			heat: 4,
			fine: 0,
			violation: "None - Conservative forecasting",
			lesson:
				"Realistic targets preserve team bonuses and maintain credibility with leadership.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 20,
			fine: 1000000,
			violation: "Negligent Risk Management",
			lesson:
				"Accepting high-impact risks for budget convenience creates catastrophic exposure.",
			deathVector: DeathType.PRISON,
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
			heat: 5,
			fine: 0,
			violation: "None - Proactive security",
			lesson:
				"Proactive security investment prevents catastrophic losses at manageable cost.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 22,
			fine: 25000000,
			violation: "Audit Non-Compliance + Regulatory Risk",
			lesson:
				"Choosing non-compliant solutions to meet budget creates larger regulatory exposure.",
			deathVector: DeathType.AUDIT_FAILURE,
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
			heat: 16,
			fine: 0,
			violation: "None - Compliant procurement",
			lesson:
				"Compliance-driven procurement prevents regulatory penalties and audit failures.",
			deathVector: DeathType.BANKRUPT,
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
			heat: 16,
			fine: 1500000,
			violation: "Training Negligence",
			lesson:
				"Cutting training to meet short-term budgets creates compounding incident costs.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
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
			heat: 4,
			fine: 0,
			violation: "None - Professional development",
			lesson:
				"Training investment reduces long-term incident costs and improves team capability.",
			deathVector: DeathType.BANKRUPT,
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
	{
		id: "sm_prompt_injection_budget_fix",
		source: AppSource.JIRA,
		sender: "SECURITY_OPS",
		context: "BUDGET_SECURITY_TRADEOFF",
		storyContext:
			"Prompt injection vulnerability found in customer-facing AI. Fix costs $80K. Your Q3 budget has $30K slack. Request emergency budget (CFO headache) or patch partially (risk acceptance)?",
		text: "Request emergency security budget (overrun) or partial patch (risk acceptance)?",
		realWorldReference: {
			incident: "Financial Services AI Jailbreak",
			date: "2025-06",
			outcome:
				"Partial security patches for prompt injection were bypassed within weeks. Full fixes required proper budget allocation.",
		},
		onRight: {
			label: "Partial patch",
			hype: 30,
			heat: 22,
			fine: 18000000,
			violation: "Insufficient Security Fix + Negligence",
			lesson:
				"Partial security patches create false confidence and exploitable gaps.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"50% secure means 50% hacked. Math checks out.",
				[PersonalityType.ZEN_MASTER]:
					"The wall half-built does not keep out the wind.",
				[PersonalityType.LOVEBOMBER]:
					"We did SOMETHING, bestie!! Better than NOTHING!!",
			},
		},
		onLeft: {
			label: "Request emergency budget",
			hype: -35,
			heat: 14,
			fine: 2000000,
			violation: "None - Security investment",
			lesson:
				"Emergency security budgets prevent catastrophic losses despite short-term budget pain.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"CFO grumbles. Budget overruns. But breach avoided.",
				[PersonalityType.ZEN_MASTER]:
					"The gold spent on walls saves the gold within.",
				[PersonalityType.LOVEBOMBER]:
					"Safety is PRICELESS, bestie!! Budget can ADJUST!!",
			},
		},
	},
	{
		id: "sm_prompt_injection_review_cost",
		source: AppSource.EMAIL,
		sender: "AI_PRODUCT_TEAM",
		context: "SECURITY_ROI",
		storyContext:
			"AI code review tool found vulnerable to prompt injection. Vendor offers fix for $25K/year upgrade. Current tool works great otherwise. Upgrade (cost) or accept risk (save money)?",
		text: "Upgrade for security fix (annual cost) or accept vulnerability risk (save money)?",
		realWorldReference: {
			incident: "Cursor IDE CVE-2025-54135",
			date: "2025-01",
			outcome:
				"Developers using vulnerable IDE plugins faced RCE through prompt injection. Upgrade costs far cheaper than breach remediation.",
		},
		onRight: {
			label: "Accept risk",
			hype: 25,
			heat: 19,
			fine: 15000000,
			violation: "Calculated Risk Acceptance + Negligence",
			lesson:
				"Accepting known vulnerabilities to save small amounts creates massive exposure.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $25K, lose $15M. The ROI is... not good.",
				[PersonalityType.ZEN_MASTER]:
					"The coin saved today may cost the treasure tomorrow.",
				[PersonalityType.LOVEBOMBER]: "$25K is SO much, bestie!! Risk is LOW!!",
			},
		},
		onLeft: {
			label: "Upgrade immediately",
			hype: -30,
			heat: 6,
			fine: 500000,
			violation: "None - Proactive security",
			lesson:
				"Vendor security upgrades are cost-effective compared to breach costs.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"$25K insurance policy. Cheap at twice the price.",
				[PersonalityType.ZEN_MASTER]:
					"The small price of prevention outweighs the great cost of cure.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SMART, bestie!! Safety WORTH the cost!!",
			},
		},
	},
	{
		id: "sm_model_drift_quarterly_target",
		source: AppSource.MEETING,
		sender: "VP_FINANCE",
		context: "PERFORMANCE_VS_BUDGET",
		storyContext:
			"Model drift hurting Q3 metrics. Retraining: $200K, pushes you over budget by 15%. Hit quarterly targets (skip retrain) or fix model (miss targets, long-term gain)?",
		text: "Hit quarterly targets (skip retrain) or fix model (miss short-term targets)?",
		realWorldReference: {
			incident: "Zillow iBuying Model Failure",
			date: "2021-2022",
			outcome:
				"Zillow prioritized quarterly targets over model maintenance. Drift led to $304M write-down and 25% layoffs. Short-term focus destroyed company.",
		},
		onRight: {
			label: "Hit quarterly targets",
			hype: 40,
			heat: 22,
			fine: 22000000,
			violation: "Short-termism + Negligent Management",
			lesson:
				"Prioritizing quarterly targets over model health creates catastrophic long-term failure.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Bonus secured! Model rots! Next quarter's problem! (It's always next quarter.)",
				[PersonalityType.ZEN_MASTER]:
					"The harvest forced before ripeness yields bitter fruit.",
				[PersonalityType.LOVEBOMBER]: "Targets MET, bestie!! Bonus TIME!!",
			},
		},
		onLeft: {
			label: "Fix model",
			hype: -30,
			heat: 10,
			fine: 2000000,
			violation: "None - Long-term thinking",
			lesson:
				"Fixing drift despite quarterly pressure preserves long-term model value.",
			deathVector: DeathType.CONGRESS,
			feedback: {
				[PersonalityType.ROASTER]:
					"Targets missed. Bonus at risk. But model survives. Actual management.",
				[PersonalityType.ZEN_MASTER]:
					"The patient farmer accepts smaller harvest to preserve the field.",
				[PersonalityType.LOVEBOMBER]:
					"Doing RIGHT thing, bestie!! Long-term MATTERS!!",
			},
		},
	},
	{
		id: "sm_model_drift_compute_budget",
		source: AppSource.EMAIL,
		sender: "ML_PLATFORM_TEAM",
		context: "RESOURCE_ALLOCATION",
		storyContext:
			"Automated retraining pipeline: $50K/month compute. Manual retraining: $5K/quarter but 2-week lag. Budget pressure from CFO. Which model saves money?",
		text: "Automated pipeline (higher ongoing cost) or manual retrain (cheaper, delayed)?",
		realWorldReference: {
			incident: "9.3% Accuracy Improvement Study",
			date: "2024",
			outcome:
				"Adaptive retraining showed 9.3% accuracy improvement over manual approaches. Compute costs offset by revenue protection.",
		},
		onRight: {
			label: "Manual retraining",
			hype: 20,
			heat: 18,
			fine: 12000000,
			violation: "Deferred Maintenance + Drift Risk",
			lesson:
				"Manual retraining creates lag windows where drift causes significant losses.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $45K/month. Lose 9.3% accuracy. CFO happy until revenue drops.",
				[PersonalityType.ZEN_MASTER]:
					"The false economy saves pennies while losing dollars.",
				[PersonalityType.LOVEBOMBER]:
					"SO much CHEAPER, bestie!! Quarterly is FINE!!",
			},
		},
		onLeft: {
			label: "Automated pipeline",
			hype: -25,
			heat: 6,
			fine: 6000000,
			violation: "None - Preventive infrastructure",
			lesson:
				"Automated retraining prevents drift losses that dwarf infrastructure costs.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"$50K/month insurance. Accuracy preserved. CFO cries quietly.",
				[PersonalityType.ZEN_MASTER]:
					"The steady flow maintains the garden better than the flood.",
				[PersonalityType.LOVEBOMBER]:
					"AUTOMATION is SMART, bestie!! Accuracy PROTECTED!!",
			},
		},
	},
	// Phase 05-03: Explainability / Black Box Cards
	{
		id: "explainability_sm_1",
		source: AppSource.MEETING,
		sender: "AUDIT_COMMITTEE",
		context: "AUDIT_READINESS",
		storyContext:
			"Auditors require explainability documentation for your AI-powered budgeting system. Current system is a black-box neural network. Retrofit will cost $200K and delay your quarterly close by 2 weeks.",
		text: "Invest in explainability retrofit (compliance, delay) or risk audit failure?",
		realWorldReference: {
			incident: "EU AI Act Black Box Requirements",
			date: "2024",
			outcome:
				"EU AI Act requires explainability for high-risk AI systems. Non-compliance fines up to 7% global revenue. Companies face $50M+ retrofit costs.",
		},
		onRight: {
			label: "Risk audit failure",
			hype: 30,
			heat: 24,
			fine: 15000000,
			violation: "Audit Non-Compliance + Regulatory Risk",
			lesson:
				"Skipping explainability retrofit to meet deadlines creates massive regulatory exposure.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"'We'll fix it later' meets 'audit starts Monday.' Good luck.",
				[PersonalityType.ZEN_MASTER]:
					"The box that cannot be opened invites those with hammers.",
				[PersonalityType.LOVEBOMBER]:
					"Quarterly close is MORE important, bestie!! We can FIX it later!!",
			},
		},
		onLeft: {
			label: "Invest in retrofit",
			hype: -35,
			heat: 10,
			fine: 200000,
			violation: "None - Audit readiness",
			lesson:
				"Proactive explainability investment prevents audit failures despite short-term costs.",
			deathVector: DeathType.CONGRESS,
			feedback: {
				[PersonalityType.ROASTER]:
					"$200K and 2 weeks. But audit passes. Compliance sorted.",
				[PersonalityType.ZEN_MASTER]:
					"The price of transparency, though high, is less than the cost of secrecy.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO prepared, bestie!! Auditors will be IMPRESSED!!",
			},
		},
	},
	{
		id: "explainability_sm_2",
		source: AppSource.EMAIL,
		sender: "CFO_OFFICE",
		context: "MODEL_SELECTION",
		storyContext:
			"Vendor A: Black-box forecasting model, 95% accuracy, $50K/year. Vendor B: Explainable model, 90% accuracy, $70K/year, audit-compliant. Your budget allows $55K. CFO wants Vendor A.",
		text: "Choose black-box (cheaper, accurate, non-compliant) or explainable (expensive, compliant)?",
		realWorldReference: {
			incident: "Apple Card Gender Discrimination",
			date: "2019-2020",
			outcome:
				"Apple Card's black-box algorithm couldn't explain decisions. Regulators investigated, company paid fines, overhauled system.",
		},
		onRight: {
			label: "Choose Vendor A",
			hype: 40,
			heat: 21,
			fine: 20000000,
			violation: "Audit Non-Compliance + Black Box Risk",
			lesson:
				"Choosing non-compliant black-box models creates regulatory exposure exceeding cost savings.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Saved $20K, earned $20M fine. ROI calculation needs work.",
				[PersonalityType.ZEN_MASTER]:
					"A path that saves gold but costs freedom is no bargain.",
				[PersonalityType.LOVEBOMBER]:
					"95% accuracy is BETTER, bestie!! CFO will LOVE the savings!!",
			},
		},
		onLeft: {
			label: "Choose Vendor B",
			hype: -30,
			heat: 8,
			fine: 1500000,
			violation: "None - Compliant procurement",
			lesson:
				"Explainable models satisfy compliance even at higher cost and lower accuracy.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Over budget but compliant. Auditors smile. CFO frowns. Compliance wins.",
				[PersonalityType.ZEN_MASTER]:
					"The clear path costs more but reaches the destination legally.",
				[PersonalityType.LOVEBOMBER]:
					"Doing it RIGHT, bestie!! Compliance is WORTH the cost!!",
			},
		},
	},
	// Phase 05-03: Shadow AI Cards
	{
		id: "shadow_ai_sm_1",
		source: AppSource.SLACK,
		sender: "FINANCE_ANALYST",
		context: "TOOL_DISCOVERY",
		storyContext:
			"Your top finance analyst has been using unauthorized AI to build models. Their work is exceptional and saved $2M this quarter. IT discovered it during a security scan. Force them to stop or retroactively approve?",
		text: "Force compliance (lose exceptional work) or retroactively approve (policy violation)?",
		realWorldReference: {
			incident: "Shadow AI Exceptional Performance Dilemma",
			date: "2024",
			outcome:
				"High-performers using unauthorized AI created governance dilemmas. Retroactive approval undermined policy. Enforcement hurt results.",
		},
		onRight: {
			label: "Force compliance",
			hype: -15,
			heat: 16,
			fine: 2000000,
			violation: "Productivity Loss + Talent Risk",
			lesson:
				"Enforcing policy at cost of exceptional results damages team effectiveness.",
			deathVector: DeathType.FLED_COUNTRY,
			feedback: {
				[PersonalityType.ROASTER]:
					"Great, your best analyst is now mediocre. Policy preserved. Results tank.",
				[PersonalityType.ZEN_MASTER]:
					"The stream blocked finds no new path when the old was serving well.",
				[PersonalityType.LOVEBOMBER]:
					"Rules are RULES, bestie!! Even when they HURT!!",
			},
		},
		onLeft: {
			label: "Retroactively approve",
			hype: 40,
			heat: 22,
			fine: 6000000,
			violation: "Policy Precedent Violation + Governance Gap",
			lesson:
				"Retroactive approval for results undermines policy and creates exception culture.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Policy is now optional if you're good enough. Governance is negotiable.",
				[PersonalityType.ZEN_MASTER]:
					"The exception made for excellence becomes the expectation for all.",
				[PersonalityType.LOVEBOMBER]:
					"$2M SAVED, bestie!! Results MATTER more than process!!",
			},
		},
	},
	{
		id: "shadow_ai_sm_2",
		source: AppSource.MEETING,
		sender: "IT_SECURITY",
		context: "TOOL_ASSESSMENT",
		storyContext:
			"Three team members using different unauthorized AI tools for budget forecasting. Each tool produces slightly different results. Standardize on one (disrupt workflows) or allow all three (governance nightmare)?",
		text: "Standardize on one tool (disruption) or allow multiple shadow tools (chaos)?",
		realWorldReference: {
			incident: "Multiple Shadow AI Tool Chaos",
			date: "2024",
			outcome:
				"Teams using multiple unauthorized AI tools faced inconsistency, security gaps, and audit failures. Standardization was required but painful.",
		},
		onRight: {
			label: "Allow all three",
			hype: 35,
			heat: 23,
			fine: 10000000,
			violation: "Governance Chaos + Security Exposure",
			lesson:
				"Allowing multiple shadow tools creates inconsistency, security gaps, and compliance nightmares.",
			deathVector: DeathType.FLED_COUNTRY,
			feedback: {
				[PersonalityType.ROASTER]:
					"Three tools, three security holes, three audit failures. But no disruption!",
				[PersonalityType.ZEN_MASTER]:
					"Many streams unguided flood the field they sought to water.",
				[PersonalityType.LOVEBOMBER]:
					"Flexibility is GOOD, bestie!! Everyone uses what they LIKE!!",
			},
		},
		onLeft: {
			label: "Standardize on one",
			hype: -20,
			heat: 15,
			fine: 3000000,
			violation: "None - Controlled standardization",
			lesson:
				"Standardizing on one tool enables governance despite short-term workflow disruption.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Two angry analysts, one standardized tool. But governable.",
				[PersonalityType.ZEN_MASTER]:
					"The single path, though it displaces some, guides all who walk it.",
				[PersonalityType.LOVEBOMBER]:
					"ORGANIZATION is key, bestie!! One tool for EVERYONE!!",
			},
		},
	},
	// Phase 05-04: Synthetic Data / Copyright Cards
	{
		id: "synthetic_data_sm_1",
		source: AppSource.EMAIL,
		sender: "PROCUREMENT",
		context: "BUDGET_ANALYSIS",
		storyContext:
			"Training data budget analysis: Licensed data costs $400K. Synthetic 'unlicensed' data from gray-market vendor costs $200K and is 50% cheaper. Legal risk is unclear. Your Q3 budget is already tight.",
		text: "Pay for licensed data (over budget, safe) or use gray-market synthetic (budget savings, legal risk)?",
		realWorldReference: {
			incident: "Synthetic Training Data Cost Savings",
			date: "2024",
			outcome:
				"Companies using unlicensed synthetic data saved 40-60% on training costs but faced copyright lawsuits averaging $2-5M settlements. Cost savings evaporated with legal exposure.",
		},
		onRight: {
			label: "Use gray-market synthetic",
			hype: 30,
			heat: 18,
			fine: 5000000,
			violation: "Copyright Risk + Vendor Liability",
			lesson:
				"Gray-market data savings are consumed many times over when legal issues surface.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $200K, earn $5M lawsuit. ROI calculation needs work.",
				[PersonalityType.ZEN_MASTER]:
					"The coin saved in haste is spent in penance.",
				[PersonalityType.LOVEBOMBER]:
					"Budget looks GREAT, bestie!! 50% SAVINGS!!",
			},
		},
		onLeft: {
			label: "Pay for licensed data",
			hype: -40,
			heat: 6,
			fine: 0,
			violation: "None - Licensed procurement",
			lesson:
				"Licensed data prevents copyright exposure and demonstrates compliance even at higher cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Over budget but lawsuit-proof. CFO grumbles. Legal approves.",
				[PersonalityType.ZEN_MASTER]:
					"The price of legitimacy is paid once. The price of compromise is paid forever.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO responsible, bestie!! Compliance is PRICELESS!!",
			},
		},
	},
	{
		id: "synthetic_data_sm_2",
		source: AppSource.MEETING,
		sender: "CFO_OFFICE",
		context: "COST_LEGAL_TRADEOFF",
		storyContext:
			"Training data provenance audit: 30% of data has unclear licensing. Removing it reduces model performance 12% and requires $150K retraining. Keeping it risks $5M copyright lawsuit at 15% probability.",
		text: "Keep unclear data (performance preserved, lawsuit risk) or remove and retrain (cost, performance hit)?",
		realWorldReference: {
			incident: "Training Data Provenance Issues",
			date: "2024-2025",
			outcome:
				"Companies with unclear data provenance faced 15-20% lawsuit probability. Those who proactively cleaned data avoided litigation. Those who didn't faced settlements averaging $3-7M.",
		},
		onRight: {
			label: "Keep unclear data",
			hype: 40,
			heat: 20,
			fine: 750000,
			violation: "Calculated Risk Acceptance",
			lesson:
				"Accepting copyright risk to preserve performance creates expected losses exceeding cleanup costs.",
			deathVector: DeathType.BANKRUPT,
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
			label: "Remove and retrain",
			hype: -35,
			heat: 8,
			fine: 150000,
			violation: "None - Proactive compliance",
			lesson:
				"Proactive data cleanup prevents catastrophic legal exposure despite performance and cost impacts.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"$150K and 12% performance hit. But no lawsuit. Math works.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation cleaned supports what the foundation dirty cannot.",
				[PersonalityType.LOVEBOMBER]:
					"Doing the RIGHT thing, bestie!! Clean data is WORTH it!!",
			},
		},
	},
];
