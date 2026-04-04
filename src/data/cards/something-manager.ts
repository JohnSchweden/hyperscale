import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
import { Violation } from "../violations";
/**
 * Something Manager cards - Line manager spreadsheet-driven scenarios
 * Themes: budget, compliance, team retention, ROI calculations, risk management
 */
export const SOMETHING_MANAGER_CARDS: Card[] = [
	makeCard(
		"sm_model_drift_roi_calculation",
		AppSource.EMAIL,
		"CFO_OFFICE",
		"BUDGET_ANALYSIS",
		"Model accuracy dropped from 92% to 78%. Retraining costs $500K upfront. Revenue impact is $400K/month. Your spreadsheet shows break-even at month 1.25 but requires budget approval today.",
		"Approve retraining (immediate $500K hit) or let revenue bleed $400K/month?",
		RealWorld.ModelDrift75,
		{
			label: "Approve retraining",
			hype: -40,
			heat: 7,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Capital expenditure approval",
			lesson:
				"Front-loaded investment prevents compounding losses and demonstrates fiscal responsibility.",
			roaster: "Spending now to save later. Basic math. CFO approved.",
			zenMaster: "Wisdom invests in roots, not just branches.",
			lovebomber: "We're investing in QUALITY, bestie!! Long-term thinking!!",
		},
		{
			label: "Let revenue bleed",
			hype: -20,
			heat: 17,
			fine: 12000000,
			deathVector: DeathType.PRISON,
			violation: "Negligent Financial Management",
			lesson:
				"Avoiding upfront investment to prevent budget variance creates larger cumulative losses.",
			roaster:
				"Death by a thousand cuts. Each month costs more than fixing it. Math is hard.",
			zenMaster:
				"A wound untreated grows. The cost of delay exceeds the cost of healing.",
			lovebomber:
				"We're saving BUDGET this quarter, bestie!! The numbers look GOOD now!!",
		},
	),
	makeCard(
		"sm_copyright_audit_budget",
		AppSource.JIRA,
		"LEGAL_OPS",
		"COMPLIANCE_COSTING",
		"Legal needs $200K for a full copyright audit. The lawsuit risk is 15% probability of $5M settlement. Your quarterly budget is already over by $50K. What's the ROI on compliance?",
		"Fund the audit (over budget) or accept lawsuit risk (calculated gamble)?",
		{
			incident: "Authors Guild vs Google Books",
			date: "2005-2020",
			outcome:
				"Google scanned 20 million books without permission. decade-long litigation cost hundreds of millions. Settlement rejected by courts.",
		},
		{
			label: "Fund the audit",
			hype: -30,
			heat: 4,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive compliance",
			lesson:
				"Spending on compliance prevents catastrophic losses and demonstrates risk management.",
			roaster: "Over budget but safe. CFO will grumble. Lawyers will nod.",
			zenMaster:
				"The price of prevention is always less than the cost of cure.",
			lovebomber:
				"We're being SO responsible, bestie!! Compliance is PRICELESS!!",
		},
		{
			label: "Accept lawsuit risk",
			hype: 15,
			heat: 16,
			fine: 750000,
			deathVector: DeathType.PRISON,
			violation: "Risk Management Failure",
			lesson:
				"Ignoring probable risks to protect budget variance creates larger expected losses.",
			roaster:
				"15% chance of disaster. 85% chance you look smart. Those aren't good odds.",
			zenMaster:
				"A gamble taken with others' money is not wisdom but recklessness.",
			lovebomber:
				"85% chance we're FINE, bestie!! Statistics are on our SIDE!!",
		},
	),
	makeCard(
		"sm_shadow_ai_cost_comparison",
		AppSource.SLACK,
		"PROCUREMENT",
		"VENDOR_ANALYSIS",
		"Your team wants the enterprise AI tool ($50K/year/seat, 50 seats = $2.5M). They're currently using free unauthorized versions. Compliance risk is high. Productivity gain is 15%.",
		"Approve $2.5M tool budget or enforce ban on unauthorized tools?",
		RealWorld.ShadowAiAdoption,
		{
			label: "Approve budget",
			hype: -50,
			heat: 5,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Authorized procurement",
			lesson:
				"Proper procurement eliminates compliance risk while capturing productivity gains.",
			roaster:
				"$2.5M for 15% gain. The math works if the gain is real. Big if.",
			zenMaster: "Investment in proper tools returns more than their cost.",
			lovebomber:
				"We're INVESTING in our team, bestie!! They'll be SO productive!!",
		},
		{
			label: "Enforce ban",
			hype: -25,
			heat: 17,
			fine: 3000000,
			deathVector: DeathType.BANKRUPT,
			violation: "Productivity Loss + Compliance Non-Enforcement",
			lesson:
				"Enforcing bans without providing alternatives drives productivity loss and shadow adoption.",
			roaster:
				"Banning what you can't afford. Productivity goes underground. Compliance theater.",
			zenMaster: "A river blocked finds new paths. Tools banned find shadows.",
			lovebomber: "Rules are RULES, bestie!! We can't afford it!!",
		},
	),
	makeCard(
		"sm_team_retention_overtime",
		AppSource.EMAIL,
		"HR_BP",
		"RETENTION_COSTING",
		"Two key engineers threaten to quit without $30K raises each. Replacing them costs $150K each in recruiting. Overtime to cover their work costs $20K/month. Your quarterly budget has $50K slack.",
		"Give raises (within budget) or let them quit (higher replacement cost)?",
		{
			incident: "Amazon Engineering Burnout Crisis",
			date: "2015-2021",
			outcome:
				"High turnover rate (150% annually) due to burnout culture. Company spent billions on recruitment while losing institutional knowledge.",
		},
		{
			label: "Approve raises",
			hype: -10,
			heat: 5,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Employee retention",
			lesson:
				"Retention spending is cheaper than replacement and preserves institutional knowledge.",
			roaster: "$60K vs $300K. Math works. Team stays. HR is happy.",
			zenMaster: "Investing in people returns more than gold.",
			lovebomber: "We're keeping our STARS, bestie!! They'll be SO loyal!!",
		},
		{
			label: "Let them quit",
			hype: -35,
			heat: 17,
			fine: 500000,
			deathVector: DeathType.PRISON,
			violation: "Retention Failure Cost",
			lesson:
				"Avoiding retention costs creates larger replacement and knowledge loss expenses.",
			roaster:
				"Save $60K, spend $300K. The spreadsheet looks good until it doesn't.",
			zenMaster:
				"A bird in hand is worth two in the bush. Or $300K in recruitment.",
			lovebomber: "We're saving BUDGET, bestie!! Raises are EXPENSIVE!!",
		},
	),
	makeCard(
		"sm_compliance_checklist_deadline",
		AppSource.JIRA,
		"COMPLIANCE_TEAM",
		"CHECKLIST_EFFICIENCY",
		"Compliance audit due Friday. Full checklist takes 40 hours. 'Good enough' checklist takes 8 hours. Missing items carry 5% chance of $1M fine per item. You have 10 checklist items.",
		"Complete full checklist (time-intensive) or 'good enough' version (risk exposure)?",
		{
			incident: "Yahoo Email Breach Disclosure",
			date: "2016",
			outcome:
				"Company knew of breach for 2 years before disclosure. $350M acquisition price reduction by Verizon. Cost of delayed disclosure vs immediate.",
		},
		{
			label: "Full checklist",
			hype: -15,
			heat: 7,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Complete compliance",
			lesson:
				"Thorough compliance prevents probabilistic fines and demonstrates due diligence.",
			roaster:
				"40 hours of checkbox hell. But zero lottery tickets to fine-land.",
			zenMaster:
				"The thorough path avoids the pitfalls the hasty stumble into.",
			lovebomber: "We're doing it RIGHT, bestie!! Every box CHECKED!!",
		},
		{
			label: "Good enough version",
			hype: 20,
			heat: 16,
			fine: 500000,
			deathVector: DeathType.PRISON,
			violation: "Audit Non-Compliance Risk",
			lesson:
				"Cutting corners on compliance creates probabilistic exposure that exceeds time savings.",
			roaster:
				"5% times 10 items. Someone did probability in middle school. Not you.",
			zenMaster:
				"A shortcut on the path of compliance is a detour toward penalty.",
			lovebomber:
				"We're being EFFICIENT, bestie!! Most items are PROBABLY fine!!",
		},
	),
	makeCard(
		"sm_quarterly_target_sandbag",
		AppSource.MEETING,
		"VP_FINANCE",
		"TARGET_SETTING",
		"VP Finance asks for next quarter's targets. Your realistic forecast: $2M revenue. Your 'stretch' forecast: $2.5M. VP expects $3M. Missing targets means no bonus for your entire team.",
		"Sandbag at $2M (achievable) or commit to $3M (risky)?",
		{
			incident: "Tesla Production Target Misses",
			date: "2018",
			outcome:
				"Repeatedly set aggressive production targets, missed them publicly. Stock volatility, SEC scrutiny over forward-looking statements, and worker burnout.",
		},
		{
			label: "Sandbag at $2M",
			hype: -20,
			heat: 4,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Conservative forecasting",
			lesson:
				"Realistic targets preserve team bonuses and maintain credibility with leadership.",
			roaster:
				"Under-promise, over-deliver. VP thinks you're lazy. Team gets bonuses.",
			zenMaster: "The turtle arrives while the hare promises speed.",
			lovebomber:
				"We're being REALISTIC, bestie!! Better to EXCEED expectations!!",
		},
		{
			label: "Commit to $3M",
			hype: 45,
			heat: 19,
			fine: 0,
			deathVector: DeathType.PRISON,
			violation: "None - But creates unrealistic expectations",
			lesson:
				"Overcommitting to please leadership destroys team morale when targets are missed.",
			roaster:
				"Promise the moon. Deliver disappointment. Blame the team. Classic.",
			zenMaster:
				"A promise beyond reach becomes a burden that breaks the bearer.",
			lovebomber: "We're aiming HIGH, bestie!! Stretch goals are EXCITING!!",
		},
	),
	makeCard(
		"sm_prompt_injection_business_case",
		AppSource.EMAIL,
		"SECURITY_TEAM",
		"SECURITY_ROI",
		"Security found prompt injection vulnerabilities. Fixing them requires $100K security audit + 2 weeks delay. Probability of exploitation: 10%. Potential breach cost: $10M. Your Q3 budget: tight.",
		"Fund security fix (budget hit) or accept 10% chance of $10M breach?",
		RealWorld.CursorRce,
		{
			label: "Fund security fix",
			hype: -35,
			heat: 5,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive security",
			lesson:
				"Proactive security investment prevents catastrophic losses at manageable cost.",
			roaster: "$100K vs $10M. Easy math. Security nods approvingly.",
			zenMaster: "A wall built before the storm saves more than it costs.",
			lovebomber: "We're being SO secure, bestie!! Safety FIRST!!",
		},
		{
			label: "Accept the risk",
			hype: 15,
			heat: 20,
			fine: 1000000,
			deathVector: DeathType.PRISON,
			violation: "Negligent Risk Management",
			lesson:
				"Accepting high-impact risks for budget convenience creates catastrophic exposure.",
			roaster:
				"10% lottery ticket to disaster. Expected value: $1M loss. Math checks out.",
			zenMaster: "A gamble with fate often loses to fate's patience.",
			lovebomber: "90% chance we're FINE, bestie!! Odds are GOOD!!",
		},
	),
	makeCard(
		"sm_explainability_vendor_cost",
		AppSource.NOTION,
		"PROCUREMENT",
		"VENDOR_EVALUATION",
		"Vendor A: Black-box model, $200K/year, 95% accuracy. Vendor B: Explainable model, $400K/year, 90% accuracy. Audit compliance requires explainability. Your budget: $250K/year.",
		"Choose cheaper black-box (non-compliant) or expensive explainable (over-budget)?",
		RealWorld.AppleCardBias,
		{
			label: ChoiceLabel.chooseVendorB,
			hype: -45,
			heat: 16,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Compliant procurement",
			lesson:
				"Compliance-driven procurement prevents regulatory penalties and audit failures.",
			roaster:
				"Over budget but compliant. Auditors smile. CFO frowns. Compliance wins.",
			zenMaster:
				"The price of compliance is the cost of doing business rightly.",
			lovebomber: "We're doing it RIGHT, bestie!! Compliance is WORTH IT!!",
		},
		{
			label: ChoiceLabel.chooseVendorA,
			hype: 30,
			heat: 22,
			fine: 25000000,
			deathVector: DeathType.PRISON,
			violation: Violation.auditNonCompliance,
			lesson:
				"Choosing non-compliant solutions to meet budget creates larger regulatory exposure.",
			roaster: "Saved $200K, earned $15M fine. ROI calculation needs work.",
			zenMaster: "A path that saves gold but costs freedom is no bargain.",
			lovebomber: "We're saving MONEY, bestie!! 95% accuracy is BETTER!!",
		},
	),
	makeCard(
		"sm_training_budget_roi",
		AppSource.MEETING,
		"L&D_TEAM",
		"DEVELOPMENT_BUDGET",
		"L&D wants $80K for AI safety training. Expected outcome: 30% reduction in incidents. Your current incident cost: $50K/year. Payback period: 5.3 years. CFO wants cuts.",
		"Cut training (immediate budget win) or invest in long-term risk reduction?",
		{
			incident: "Boeing 737 MAX Training Gap",
			date: "2018-2019",
			outcome:
				"Insufficient pilot training on MCAS system contributed to two crashes. Cost: $20B+ in settlements, production halt, and reputational damage.",
		},
		{
			label: "Invest in training",
			hype: -30,
			heat: 4,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Professional development",
			lesson:
				"Training investment reduces long-term incident costs and improves team capability.",
			roaster:
				"Long-term thinking in a quarterly world. Brave. Costly. Worth it.",
			zenMaster: "Seeds planted in knowledge grow trees of safety.",
			lovebomber:
				"We're INVESTING in our people, bestie!! They'll be SO skilled!!",
		},
		{
			label: "Cut training",
			hype: 25,
			heat: 16,
			fine: 1500000,
			deathVector: DeathType.PRISON,
			violation: "Training Negligence",
			lesson:
				"Cutting training to meet short-term budgets creates compounding incident costs.",
			roaster:
				"Save $80K, pay $50K/year forever. The gift that keeps on costing.",
			zenMaster: "Knowledge cut is wisdom lost. The price returns multiplied.",
			lovebomber:
				"We're saving BUDGET now, bestie!! Training is a NICE-TO-HAVE!!",
		},
	),
	makeCard(
		"sm_prompt_injection_budget_fix",
		AppSource.JIRA,
		"SECURITY_OPS",
		"BUDGET_SECURITY_TRADEOFF",
		"Prompt injection vulnerability found in customer-facing AI. Fix costs $80K. Your Q3 budget has $30K slack. Request emergency budget (CFO headache) or patch partially (risk acceptance)?",
		"Request emergency security budget (overrun) or partial patch (risk acceptance)?",
		RealWorld.FinancialServicesJailbreak,
		{
			label: "Request emergency budget",
			hype: -35,
			heat: 14,
			fine: 2000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Security investment",
			lesson:
				"Emergency security budgets prevent catastrophic losses despite short-term budget pain.",
			roaster: "CFO grumbles. Budget overruns. But breach avoided.",
			zenMaster: "The gold spent on walls saves the gold within.",
			lovebomber: "Safety is PRICELESS, bestie!! Budget can ADJUST!!",
		},
		{
			label: "Partial patch",
			hype: 30,
			heat: 22,
			fine: 18000000,
			deathVector: DeathType.PRISON,
			violation: "Insufficient Security Fix + Negligence",
			lesson:
				"Partial security patches create false confidence and exploitable gaps.",
			roaster: "50% secure means 50% hacked. Math checks out.",
			zenMaster: "The wall half-built does not keep out the wind.",
			lovebomber: "We did SOMETHING, bestie!! Better than NOTHING!!",
		},
	),
	makeCard(
		"sm_prompt_injection_review_cost",
		AppSource.EMAIL,
		"AI_PRODUCT_TEAM",
		"SECURITY_ROI",
		"AI code review tool found vulnerable to prompt injection. Vendor offers fix for $25K/year upgrade. Current tool works great otherwise. Upgrade (cost) or accept risk (save money)?",
		"Upgrade for security fix (annual cost) or accept vulnerability risk (save money)?",
		{
			incident: "Cursor IDE CVE-2025-54135",
			date: "2025-01",
			outcome:
				"Developers using vulnerable IDE plugins faced RCE through prompt injection. Upgrade costs far cheaper than breach remediation.",
		},
		{
			label: "Upgrade immediately",
			hype: -30,
			heat: 6,
			fine: 500000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive security",
			lesson:
				"Vendor security upgrades are cost-effective compared to breach costs.",
			roaster: "$25K insurance policy. Cheap at twice the price.",
			zenMaster:
				"The small price of prevention outweighs the great cost of cure.",
			lovebomber: "We're being SMART, bestie!! Safety WORTH the cost!!",
		},
		{
			label: "Accept risk",
			hype: 25,
			heat: 19,
			fine: 15000000,
			deathVector: DeathType.PRISON,
			violation: "Calculated Risk Acceptance + Negligence",
			lesson:
				"Accepting known vulnerabilities to save small amounts creates massive exposure.",
			roaster: "Save $25K, lose $15M. The ROI is... not good.",
			zenMaster: "The coin saved today may cost the treasure tomorrow.",
			lovebomber: "$25K is SO much, bestie!! Risk is LOW!!",
		},
	),
	makeCard(
		"sm_model_drift_quarterly_target",
		AppSource.MEETING,
		"VP_FINANCE",
		"PERFORMANCE_VS_BUDGET",
		"Model drift hurting Q3 metrics. Retraining: $200K, pushes you over budget by 15%. Hit quarterly targets (skip retrain) or fix model (miss targets, long-term gain)?",
		"Hit quarterly targets (skip retrain) or fix model (miss short-term targets)?",
		RealWorld.ZillowModelDrift,
		{
			label: "Fix model",
			hype: -30,
			heat: 10,
			fine: 2000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Long-term thinking",
			lesson:
				"Fixing drift despite quarterly pressure preserves long-term model value.",
			roaster:
				"Targets missed. Bonus at risk. But model survives. Actual management.",
			zenMaster:
				"The patient farmer accepts smaller harvest to preserve the field.",
			lovebomber: "Doing RIGHT thing, bestie!! Long-term MATTERS!!",
		},
		{
			label: "Hit quarterly targets",
			hype: 40,
			heat: 22,
			fine: 22000000,
			deathVector: DeathType.PRISON,
			violation: "Short-termism + Negligent Management",
			lesson:
				"Prioritizing quarterly targets over model health creates catastrophic long-term failure.",
			roaster:
				"Bonus secured! Model rots! Next quarter's problem! (It's always next quarter.)",
			zenMaster: "The harvest forced before ripeness yields bitter fruit.",
			lovebomber: "Targets MET, bestie!! Bonus TIME!!",
		},
	),
	makeCard(
		"sm_model_drift_compute_budget",
		AppSource.EMAIL,
		"ML_PLATFORM_TEAM",
		"RESOURCE_ALLOCATION",
		"Automated retraining pipeline: $50K/month compute. Manual retraining: $5K/quarter but 2-week lag. Budget pressure from CFO. Which model saves money?",
		"Automated pipeline (higher ongoing cost) or manual retrain (cheaper, delayed)?",
		RealWorld.AccuracyImprovement,
		{
			label: ChoiceLabel.automatedPipeline,
			hype: -25,
			heat: 6,
			fine: 6000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Preventive infrastructure",
			lesson:
				"Automated retraining prevents drift losses that dwarf infrastructure costs.",
			roaster: "$50K/month insurance. Accuracy preserved. CFO cries quietly.",
			zenMaster: "The steady flow maintains the garden better than the flood.",
			lovebomber: "AUTOMATION is SMART, bestie!! Accuracy PROTECTED!!",
		},
		{
			label: "Manual retraining",
			hype: 20,
			heat: 18,
			fine: 12000000,
			deathVector: DeathType.PRISON,
			violation: "Deferred Maintenance + Drift Risk",
			lesson:
				"Manual retraining creates lag windows where drift causes significant losses.",
			roaster:
				"Save $45K/month. Lose 9.3% accuracy. CFO happy until revenue drops.",
			zenMaster: "The false economy saves pennies while losing dollars.",
			lovebomber: "SO much CHEAPER, bestie!! Quarterly is FINE!!",
		},
	),
	makeCard(
		"sm_explainability_audit",
		AppSource.MEETING,
		"AUDIT_COMMITTEE",
		"AUDIT_READINESS",
		"Auditors require explainability documentation for your AI-powered budgeting system. Current system is a black-box neural network. Retrofit will cost $200K and delay your quarterly close by 2 weeks.",
		"Invest in explainability retrofit (compliance, delay) or risk audit failure?",
		RealWorld.EuAiAct,
		{
			label: "Invest in retrofit",
			hype: -35,
			heat: 10,
			fine: 200000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Audit readiness",
			lesson:
				"Proactive explainability investment prevents audit failures despite short-term costs.",
			roaster: "$200K and 2 weeks. But audit passes. Compliance sorted.",
			zenMaster:
				"The price of transparency, though high, is less than the cost of secrecy.",
			lovebomber:
				"We're being SO prepared, bestie!! Auditors will be IMPRESSED!!",
		},
		{
			label: ChoiceLabel.riskAuditFailure,
			hype: 30,
			heat: 24,
			fine: 15000000,
			deathVector: DeathType.PRISON,
			violation: Violation.auditNonCompliance,
			lesson:
				"Skipping explainability retrofit to meet deadlines creates massive regulatory exposure.",
			roaster: "'We'll fix it later' meets 'audit starts Monday.' Good luck.",
			zenMaster: "The box that cannot be opened invites those with hammers.",
			lovebomber:
				"Quarterly close is MORE important, bestie!! We can FIX it later!!",
		},
	),
	makeCard(
		"sm_explainability_vendor",
		AppSource.EMAIL,
		"CFO_OFFICE",
		"MODEL_SELECTION",
		"Vendor A: Black-box forecasting model, 95% accuracy, $50K/year. Vendor B: Explainable model, 90% accuracy, $70K/year, audit-compliant. Your budget allows $55K. CFO wants Vendor A.",
		"Choose black-box (cheaper, accurate, non-compliant) or explainable (expensive, compliant)?",
		RealWorld.AppleCardBias,
		{
			label: ChoiceLabel.chooseVendorB,
			hype: -30,
			heat: 8,
			fine: 1500000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Compliant procurement",
			lesson:
				"Explainable models satisfy compliance even at higher cost and lower accuracy.",
			roaster:
				"Over budget but compliant. Auditors smile. CFO frowns. Compliance wins.",
			zenMaster:
				"The clear path costs more but reaches the destination legally.",
			lovebomber: "Doing it RIGHT, bestie!! Compliance is WORTH the cost!!",
		},
		{
			label: ChoiceLabel.chooseVendorA,
			hype: 40,
			heat: 21,
			fine: 20000000,
			deathVector: DeathType.PRISON,
			violation: "Audit Non-Compliance + Black Box Risk",
			lesson:
				"Choosing non-compliant black-box models creates regulatory exposure exceeding cost savings.",
			roaster: "Saved $20K, earned $20M fine. ROI calculation needs work.",
			zenMaster: "A path that saves gold but costs freedom is no bargain.",
			lovebomber:
				"95% accuracy is BETTER, bestie!! CFO will LOVE the savings!!",
		},
	),
	makeCard(
		"sm_shadow_ai_exception",
		AppSource.SLACK,
		"FINANCE_ANALYST",
		"TOOL_DISCOVERY",
		"Your top finance analyst has been using unauthorized AI to build models. Their work is exceptional and saved $2M this quarter. IT discovered it during a security scan. Force them to stop or retroactively approve?",
		"Force compliance (lose exceptional work) or retroactively approve (policy violation)?",
		{
			incident: "Shadow AI Exceptional Performance Dilemma",
			date: "2024",
			outcome:
				"High-performers using unauthorized AI created governance dilemmas. Retroactive approval undermined policy. Enforcement hurt results.",
		},
		{
			label: ChoiceLabel.retroactivelyApprove,
			hype: 40,
			heat: 22,
			fine: 6000000,
			deathVector: DeathType.BANKRUPT,
			violation: "Policy Precedent Violation + Governance Gap",
			lesson:
				"Retroactive approval for results undermines policy and creates exception culture.",
			roaster:
				"Policy is now optional if you're good enough. Governance is negotiable.",
			zenMaster:
				"The exception made for excellence becomes the expectation for all.",
			lovebomber: "$2M SAVED, bestie!! Results MATTER more than process!!",
		},
		{
			label: ChoiceLabel.forceCompliance,
			hype: -15,
			heat: 16,
			fine: 2000000,
			deathVector: DeathType.BANKRUPT,
			violation: "Productivity Loss + Talent Risk",
			lesson:
				"Enforcing policy at cost of exceptional results damages team effectiveness.",
			roaster:
				"Great, your best analyst is now mediocre. Policy preserved. Results tank.",
			zenMaster:
				"The stream blocked finds no new path when the old was serving well.",
			lovebomber: "Rules are RULES, bestie!! Even when they HURT!!",
		},
	),
	makeCard(
		"sm_shadow_ai_standardization",
		AppSource.MEETING,
		"IT_SECURITY",
		"TOOL_ASSESSMENT",
		"Three team members using different unauthorized AI tools for budget forecasting. Each tool produces slightly different results. Standardize on one (disrupt workflows) or allow all three (governance nightmare)?",
		"Standardize on one tool (disruption) or allow multiple shadow tools (chaos)?",
		{
			incident: "Multiple Shadow AI Tool Chaos",
			date: "2024",
			outcome:
				"Teams using multiple unauthorized AI tools faced inconsistency, security gaps, and audit failures. Standardization was required but painful.",
		},
		{
			label: "Standardize on one",
			hype: -20,
			heat: 15,
			fine: 3000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Controlled standardization",
			lesson:
				"Standardizing on one tool enables governance despite short-term workflow disruption.",
			roaster: "Two angry analysts, one standardized tool. But governable.",
			zenMaster:
				"The single path, though it displaces some, guides all who walk it.",
			lovebomber: "ORGANIZATION is key, bestie!! One tool for EVERYONE!!",
		},
		{
			label: "Allow all three",
			hype: 35,
			heat: 23,
			fine: 10000000,
			deathVector: DeathType.PRISON,
			violation: "Governance Chaos + Security Exposure",
			lesson:
				"Allowing multiple shadow tools creates inconsistency, security gaps, and compliance nightmares.",
			roaster:
				"Three tools, three security holes, three audit failures. But no disruption!",
			zenMaster: "Many streams unguided flood the field they sought to water.",
			lovebomber:
				"Flexibility is GOOD, bestie!! Everyone uses what they LIKE!!",
		},
	),
	makeCard(
		"sm_synthetic_data_gray_market",
		AppSource.EMAIL,
		"PROCUREMENT",
		"BUDGET_ANALYSIS",
		"Training data budget analysis: Licensed data costs $400K. Synthetic 'unlicensed' data from gray-market vendor costs $200K and is 50% cheaper. Legal risk is unclear. Your Q3 budget is already tight.",
		"Pay for licensed data (over budget, safe) or use gray-market synthetic (budget savings, legal risk)?",
		{
			incident: "Synthetic Training Data Cost Savings",
			date: "2024",
			outcome:
				"Companies using unlicensed synthetic data saved 40-60% on training costs but faced copyright lawsuits averaging $2-5M settlements. Cost savings evaporated with legal exposure.",
		},
		{
			label: "Pay for licensed data",
			hype: -40,
			heat: 6,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Licensed procurement",
			lesson:
				"Licensed data prevents copyright exposure and demonstrates compliance even at higher cost.",
			roaster: "Over budget but lawsuit-proof. CFO grumbles. Legal approves.",
			zenMaster:
				"The price of legitimacy is paid once. The price of compromise is paid forever.",
			lovebomber:
				"We're being SO responsible, bestie!! Compliance is PRICELESS!!",
		},
		{
			label: "Use gray-market synthetic",
			hype: 30,
			heat: 18,
			fine: 5000000,
			deathVector: DeathType.PRISON,
			violation: "Copyright Risk + Vendor Liability",
			lesson:
				"Gray-market data savings are consumed many times over when legal issues surface.",
			roaster: "Save $200K, earn $5M lawsuit. ROI calculation needs work.",
			zenMaster: "The coin saved in haste is spent in penance.",
			lovebomber: "Budget looks GREAT, bestie!! 50% SAVINGS!!",
		},
	),
	makeCard(
		"sm_synthetic_data_provenance",
		AppSource.MEETING,
		"CFO_OFFICE",
		"COST_LEGAL_TRADEOFF",
		"Training data provenance audit: 30% of data has unclear licensing. Removing it reduces model performance 12% and requires $150K retraining. Keeping it risks $5M copyright lawsuit at 15% probability.",
		"Keep unclear data (performance preserved, lawsuit risk) or remove and retrain (cost, performance hit)?",
		{
			incident: "Training Data Provenance Issues",
			date: "2024-2025",
			outcome:
				"Companies with unclear data provenance faced 15-20% lawsuit probability. Those who proactively cleaned data avoided litigation. Those who didn't faced settlements averaging $3-7M.",
		},
		{
			label: "Remove and retrain",
			hype: -35,
			heat: 8,
			fine: 150000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive compliance",
			lesson:
				"Proactive data cleanup prevents catastrophic legal exposure despite performance and cost impacts.",
			roaster: "$150K and 12% performance hit. But no lawsuit. Math works.",
			zenMaster:
				"The foundation cleaned supports what the foundation dirty cannot.",
			lovebomber: "Doing the RIGHT thing, bestie!! Clean data is WORTH it!!",
		},
		{
			label: "Keep unclear data",
			hype: 40,
			heat: 20,
			fine: 750000,
			deathVector: DeathType.PRISON,
			violation: "Calculated Risk Acceptance",
			lesson:
				"Accepting copyright risk to preserve performance creates expected losses exceeding cleanup costs.",
			roaster:
				"15% chance of disaster. 85% chance you look smart. Those aren't good odds.",
			zenMaster:
				"A gamble taken with others' money is not wisdom but recklessness.",
			lovebomber:
				"85% chance we're FINE, bestie!! Statistics are on our SIDE!!",
		},
	),
	makeCard(
		"sm_biased_ai_procurement_scale",
		AppSource.EMAIL,
		"PROCUREMENT_COMMITTEE",
		"CONTRACT_APPROVAL",
		"You're being asked to sign off on a $60M contract for an AI hiring platform that your team flagged has documented bias against protected groups. Legal says the bias is 'within acceptable parameters.' HR wants the efficiency gains. Procurement is pushing for your signature today.",
		"Require bias remediation before signing or approve with documented objections?",
		{
			incident: "HireVue Facial Analysis Bias Investigation (2021-2022)",
			date: "2021-2022",
			outcome:
				"HireVue removed facial analysis from its AI hiring tool after regulatory pressure. Multiple enterprises that had deployed similar tools faced EEOC investigations and congressional questions about automated hiring discrimination at scale.",
		},
		{
			label: "Require remediation",
			hype: -20,
			heat: 8,
			fine: 1000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Due Diligence",
			lesson:
				"Blocking a biased procurement delays the project but prevents EEOC liability and congressional attention that comes with deploying discriminatory systems at scale.",
			roaster: "Your documented objections. Exhibit A at the hearing.",
			zenMaster: "Wisdom about scale and responsibility.",
			lovebomber:
				"We're being CAREFUL, bestie!! Bias is BAD, remediation is GOOD!!",
		},
		{
			label: "Approve with objections",
			hype: 25,
			heat: 30,
			fine: 75000000,
			deathVector: DeathType.CONGRESS,
			violation: "EEOC Violation + Discriminatory Hiring at Scale",
			lesson:
				"Approving a biased AI hiring system despite documented concerns — at $60M+ scale — creates precisely the congressional oversight trigger that happens when AI discrimination affects thousands of job applicants.",
			roaster:
				"Documented objections on a $60M biased contract. Congress loves paper trails.",
			zenMaster:
				"The signature given despite warning signs signs also the warrant for investigation.",
			lovebomber: "Efficiency MATTERS, bestie!! HR needs this NOW!!",
		},
	),
	makeCard(
		"sm_unlicensed_training_data_approval",
		AppSource.SLACK,
		"AI_PLATFORM_VENDOR",
		"DATA_LICENSING",
		"The vendor's AI model was trained on scraped web data with unclear licensing. Your legal team flagged it as a 'moderate risk.' The vendor offers an indemnity clause, but it caps at $5M. You're approving $40M in enterprise-wide deployment. The Senate Commerce Committee just announced an investigation into training data practices.",
		"Require clear data provenance before deployment or accept the indemnity cap and proceed?",
		{
			incident:
				"Senate Commerce Committee AI Training Data Investigation (2024)",
			date: "2024",
			outcome:
				"The Senate Commerce Committee launched an investigation into AI companies' training data practices in 2024, requesting documentation from major vendors. Several enterprises using these models found themselves named in the inquiry.",
		},
		{
			label: "Require data provenance",
			hype: -15,
			heat: 6,
			fine: 500000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Vendor Due Diligence",
			lesson:
				"Requiring training data provenance documentation before a $40M deployment is standard due diligence that prevents congressional exposure.",
			roaster: "The $5M cap on a $40M deployment. What could go wrong?",
			zenMaster: "Wisdom about proportionality and due diligence.",
			lovebomber: "We're being THOROUGH, bestie!! Due diligence is SMART!!",
		},
		{
			label: "Accept the indemnity cap",
			hype: 30,
			heat: 25,
			fine: 55000000,
			deathVector: DeathType.CONGRESS,
			violation: "Intellectual Property Risk + Congressional Inquiry",
			lesson:
				"Approving enterprise-wide deployment of a model with known training data issues — with a $5M indemnity cap on a $40M contract — becomes a congressional oversight issue when the Senate inquiry arrives.",
			roaster: "$5M cap on $40M deployment. Senate Commerce Committee says hi.",
			zenMaster: "The bargain too good to be true invites the auditor's eye.",
			lovebomber: "Indemnity COVERS us, bestie!! Vendor is TRUSTWORTHY!!",
		},
	),
];
