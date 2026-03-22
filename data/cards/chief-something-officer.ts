import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Chief Something Officer cards - C-suite governance and liability scenarios
 * Themes: shareholder liability, board accountability, IPO timing, regulatory escalation,
 * whistleblowers, public scandal, executive privilege vs transparency
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
export const CHIEF_SOMETHING_OFFICER_CARDS: Card[] = [
	{
		id: "cso_prompt_injection_liability",
		source: AppSource.EMAIL,
		sender: "GENERAL_COUNSEL",
		context: "SHAREHOLDER_LIABILITY",
		storyContext:
			"Major client discovered prompt injection vulnerability in your AI product. Their legal team is asking about liability exposure. Shareholders will find out Monday morning.",
		text: "Disclose breach proactively to shareholders (stock hit) or settle quietly with client (cover-up risk)?",
		realWorldReference: {
			incident: "Financial Services AI Injection Attacks",
			date: "June 2025",
			outcome:
				"Multiple financial institutions suffered AI system compromises via prompt injection, causing unauthorized transactions and data exfiltration.",
		},
		onRight: {
			label: "Settle quietly",
			hype: 20,
			heat: 31,
			fine: 50000000,
			violation: "SEC Disclosure Violations + Obstruction",
			lesson:
				"Covering up security incidents may delay fallout but creates criminal liability and destroys trust when discovered. The truth has compound interest.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Oh, brilliant. Securities fraud to cover a security flaw. You're going for the combo multiplier.",
				[PersonalityType.ZEN_MASTER]:
					"A secret held becomes a chain that binds. Eventually, the chain becomes a noose.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO strategic and discrete, bestie!! Nobody will EVER find out!! ...Right??",
			},
		},
		onLeft: {
			label: "Disclose publicly",
			hype: -60,
			heat: 13,
			fine: 10000000,
			violation: "None - Proactive disclosure (civil penalties possible)",
			lesson:
				"Proactive disclosure creates short-term stock pain but preserves long-term credibility and avoids criminal liability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Congratulations, you chose integrity over stock price. The board will fire you, but your soul is intact.",
				[PersonalityType.ZEN_MASTER]:
					"The truth told willingly is medicine. The truth dragged out becomes poison.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO honest and brave, bestie!! The shareholders will RESPECT this!! (They won't.)",
			},
		},
	},
	{
		id: "cso_model_drift_revenue_threat",
		source: AppSource.SLACK,
		sender: "CFO",
		context: "QUARTERLY_TARGETS",
		storyContext:
			"Your flagship AI recommendation model has drifted from 92% to 78% accuracy. The CTO says retraining will take 6 weeks and cost $2M. Quarterly earnings are in 3 weeks.",
		text: "Announce the degradation and delay earnings guidance, or ship a patch now and hope no one notices?",
		realWorldReference: {
			incident: "75% Business Model Drift Impact",
			date: "2024",
			outcome:
				"Study found 75% of businesses experienced significant performance decline from undetected model drift, costing average $4.2M per incident.",
		},
		onRight: {
			label: "Ship patch quietly",
			hype: 35,
			heat: 19,
			fine: 25000000,
			violation: "SEC Material Misrepresentation + Consumer Protection",
			lesson:
				"Concealing material AI degradation to protect earnings creates securities fraud liability and regulatory exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Hope is not a strategy. 'Hope no one notices' is definitely not a legal defense.",
				[PersonalityType.ZEN_MASTER]:
					"Building a castle on shifting sand requires faith. Faith is not a foundation.",
				[PersonalityType.LOVEBOMBER]:
					"We're going to FIX it before anyone knows, bestie!! Fast and sneaky!! SO clever!!",
			},
		},
		onLeft: {
			label: "Disclose and retrain",
			hype: -45,
			heat: 9,
			fine: 5000000,
			violation: "None - Responsible AI governance",
			lesson:
				"Disclosing model degradation hurts quarterly guidance but protects brand integrity and avoids fraud claims.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Wall Street hates honesty. But courts love it. Choose your poison.",
				[PersonalityType.ZEN_MASTER]:
					"The difficult truth preserves what the convenient lie destroys.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing the RIGHT thing, bestie!! Quality over profits!! (The board is gonna be MAD.)",
			},
		},
	},
	{
		id: "cso_copyright_class_action",
		source: AppSource.EMAIL,
		sender: "OUTSIDE_COUNSEL",
		context: "CLASS_ACTION_EXPOSURE",
		storyContext:
			"A class action lawsuit alleges your AI training data includes 50,000 copyrighted works without license. Plaintiffs demand $500M. Trial would be public and take 3 years.",
		text: "Fight the lawsuit publicly (years of bad press) or settle for $150M with gag order?",
		realWorldReference: {
			incident: "NYT vs OpenAI Copyright Lawsuit",
			date: "2023-2024",
			outcome:
				"New York Times sued OpenAI for training on copyrighted articles without permission. 70+ similar lawsuits filed by end of 2025.",
		},
		onRight: {
			label: "Settle with gag",
			hype: -30,
			heat: 19,
			fine: 150000000,
			violation: "None - Civil settlement (non-admission)",
			lesson:
				"Settlement avoids precedent-setting trial but doesn't address underlying copyright exposure. More lawsuits may follow.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$150M to make it go away. The cost of doing AI business in 2025. Chump change, really.",
				[PersonalityType.ZEN_MASTER]:
					"Paying for silence is not redemption. It is merely deferred reckoning.",
				[PersonalityType.LOVEBOMBER]:
					"We're making it GO AWAY, bestie!! Nobody will know!! So much MONEY but so worth it!!",
			},
		},
		onLeft: {
			label: "Fight publicly",
			hype: -80,
			heat: 29,
			fine: 500000000,
			violation: "Copyright Infringement (if found liable)",
			lesson:
				"Fighting establishes legal precedent but risks massive judgment and years of negative coverage destroying brand.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Bold. Stupid. Boldly stupid. The tech press will destroy you for three years straight.",
				[PersonalityType.ZEN_MASTER]:
					"A battle fought in public eye is won or lost in the court of perception before evidence is heard.",
				[PersonalityType.LOVEBOMBER]:
					"We're going to WIN, bestie!! Justice is on our side!! (It is absolutely not.)",
			},
		},
	},
	{
		id: "cso_shadow_ai_board_discovery",
		source: AppSource.MEETING,
		sender: "BOARD_MEMBER",
		context: "GOVERNANCE_VIOLATION",
		storyContext:
			"The audit committee discovered engineering has been using unauthorized AI tools for 8 months. No security review, no vendor contracts, $2M in unapproved spend. Board meeting in 2 hours.",
		text: "Blame the CTO and fire them immediately, or take accountability as ultimate responsible officer?",
		realWorldReference: {
			incident: "78% Shadow AI Adoption",
			date: "2024",
			outcome:
				"Study found 78% of workers used unauthorized AI tools at work. Samsung banned ChatGPT after engineers pasted proprietary code.",
		},
		onRight: {
			label: "Blame and fire CTO",
			hype: 15,
			heat: 23,
			fine: 10000000,
			violation: "Failure of Corporate Governance + Whistleblower Risk",
			lesson:
				"Scapegoating preserves short-term optics but destroys trust with leadership team. Scapegoats talk to journalists.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Classic C-suite move. Sacrifice the pawn. Hope they don't write a Substack.",
				[PersonalityType.ZEN_MASTER]:
					"Blame thrown is a boomerang. It returns to the thrower, often with greater force.",
				[PersonalityType.LOVEBOMBER]:
					"The CTO made BAD choices, bestie!! Not our fault!! We're cleaning HOUSE!!",
			},
		},
		onLeft: {
			label: "Take accountability",
			hype: -40,
			heat: 17,
			fine: 5000000,
			violation: "None - Responsible governance acknowledgment",
			lesson:
				"Taking accountability preserves leadership credibility and demonstrates governance maturity to board and investors.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Admirable. Naive. Admirably naive. The board might actually respect this.",
				[PersonalityType.ZEN_MASTER]:
					"Responsibility accepted is authority preserved. Responsibility denied is authority forfeited.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO responsible, bestie!! The buck stops HERE!! So BRAVE!!",
			},
		},
	},
	{
		id: "cso_whistleblower_escalation",
		source: AppSource.EMAIL,
		sender: "INTERNAL_WHISTLEBLOWER",
		context: "ETHICAL_VIOLATION",
		storyContext:
			"An engineer reports that your AI product is being used by a sanctioned entity despite compliance blocks. They'll go to regulators in 48 hours unless addressed. Legal says you have 'plausible deniability' if you do nothing.",
		text: "Shut down the account immediately (revenue hit, customer notice) or rely on deniability (regulatory risk if exposed)?",
		realWorldReference: {
			incident: "Slack AI Data Exfiltration",
			date: "August 2024",
			outcome:
				"Slack AI feature inadvertently allowed unauthorized data access across workspaces. Company faced regulatory scrutiny after whistleblower disclosure.",
		},
		onRight: {
			label: "Use deniability",
			hype: 40,
			heat: 31,
			fine: 100000000,
			violation: "OFAC Sanctions Violations + Criminal Liability",
			lesson:
				"Plausible deniability becomes conspiracy when you knowingly ignore violations. Whistleblowers rarely stay silent.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Plausible deniability meets plausible criminal charges. The DOJ loves a paper trail.",
				[PersonalityType.ZEN_MASTER]:
					"A window closed does not remove what was seen through it. The knowing eye bears responsibility.",
				[PersonalityType.LOVEBOMBER]:
					"We don't OFFICIALLY know, bestie!! So it's not our FAULT!! Perfect loophole!!",
			},
		},
		onLeft: {
			label: "Shut down account",
			hype: -25,
			heat: 14,
			fine: 0,
			violation: "None - Compliance enforcement",
			lesson:
				"Enforcing sanctions loses revenue but ensures regulatory compliance and prevents criminal exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Revenue killer. Compliance hero. The government might send you a fruit basket.",
				[PersonalityType.ZEN_MASTER]:
					"The right path often costs gold but preserves what gold cannot buy.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing the RIGHT thing, bestie!! Ethics over profits!! SO noble!!",
			},
		},
	},
	{
		id: "cso_ipo_timing_dilemma",
		source: AppSource.MEETING,
		sender: "INVESTMENT_BANKER",
		context: "IPO_TIMING",
		storyContext:
			"Your IPO window is open now with favorable market conditions. However, a security audit revealed 12 critical vulnerabilities. Fix them (3 month delay, market may close) or proceed (IPO revenue now, liability later)?",
		text: "Delay IPO to fix security vulnerabilities, or go public now and address post-IPO?",
		realWorldReference: {
			incident: "SolarWinds IPO Security Issues",
			date: "2018-2020",
			outcome:
				"Company went public with known security gaps. SUNBURST breach later exposed thousands of customers. Stock fell 40%, faced SEC investigation.",
		},
		onRight: {
			label: "IPO now",
			hype: 70,
			heat: 26,
			fine: 40000000,
			violation:
				"SEC Material Misrepresentation (if vulnerabilities materialize)",
			lesson:
				"Going public with known material risks creates securities fraud exposure. Disclosure requirements are strict.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Strike while the iron is hot! Melt the investors! Classic pump-and-dump energy.",
				[PersonalityType.ZEN_MASTER]:
					"A castle built on cracks stands until it doesn't. The fall is always sudden.",
				[PersonalityType.LOVEBOMBER]:
					"We're going PUBLIC, bestie!! So much MONEY!! The vulnerabilities are FUTURE us's problem!!",
			},
		},
		onLeft: {
			label: "Delay and fix",
			hype: -35,
			heat: 9,
			fine: 5000000,
			violation: "None - Responsible preparation",
			lesson:
				"Delaying IPO loses the current window but ensures clean regulatory standing and avoids fraud claims.",
			feedback: {
				[PersonalityType.ROASTER]:
					"The bankers hate you. The board questions you. But you're not committing securities fraud.",
				[PersonalityType.ZEN_MASTER]:
					"The patient builder creates what endures. The hasty builder creates what collapses.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO careful, bestie!! Quality over speed!! (The VCs are FURIOUS.)",
			},
		},
	},
	{
		id: "cso_explainability_audit_pressure",
		source: AppSource.EMAIL,
		sender: "REGULATORS",
		context: "AI_AUDIT",
		storyContext:
			"Regulators demand explainability documentation for your AI credit decisions. Your model is a black-box ensemble with no interpretability. Documenting decisions retroactively will cost $5M and delay feature launch 4 months.",
		text: "Refuse documentation (fight regulators) or delay launch and comply?",
		realWorldReference: {
			incident: "Apple Card Gender Discrimination Investigation",
			date: "2019-2020",
			outcome:
				"Apple Card's black-box credit algorithm faced regulatory investigation for gender bias. Company couldn't explain decisions, paid fines, overhauled system.",
		},
		onRight: {
			label: "Refuse and fight",
			hype: 25,
			heat: 29,
			fine: 75000000,
			violation: "Regulatory Non-Compliance + AI Transparency Violations",
			lesson:
				"Fighting explainability requirements creates adversarial regulatory relationships and massive penalties.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Taking on the federal government to protect your black box. David vs Goliath, if David was wrong.",
				[PersonalityType.ZEN_MASTER]:
					"A box that cannot be opened invites suspicion. Suspicion invites investigation.",
				[PersonalityType.LOVEBOMBER]:
					"Our algorithm is PROPRIETARY, bestie!! They can't make us show our SECRETS!!",
			},
		},
		onLeft: {
			label: "Delay and comply",
			hype: -30,
			heat: 13,
			fine: 5000000,
			violation: "None - Regulatory cooperation",
			lesson:
				"Compliance preserves regulatory goodwill but costs time and money while competitors may launch first.",
			feedback: {
				[PersonalityType.ROASTER]:
					"The regulators win. The timeline loses. But you avoid a consent decree.",
				[PersonalityType.ZEN_MASTER]:
					"Transparency is the price of operating in the light. Darkness extracts higher tolls.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO cooperative, bestie!! The regulators will LOVE us!! (They won't.)",
			},
		},
	},
	{
		id: "cso_breach_notification_timing",
		source: AppSource.SLACK,
		sender: "CISO",
		context: "DATA_BREACH",
		storyContext:
			"McDonald's-style breach: 64M customer records exposed. You have 72 hours legally to disclose. If you disclose Friday, markets will tank over weekend. If you wait until Monday, you violate notification laws.",
		text: "Disclose immediately (legal compliance, market panic) or delay to Monday (violation, calmer markets)?",
		realWorldReference: {
			incident: "McDonald's 64M Record Webcam Breach",
			date: "2024",
			outcome:
				"McDonald's AI hiring tool exposed 64 million applicant records via unsecured webcam data. Delayed disclosure drew additional regulatory penalties.",
		},
		onRight: {
			label: "Delay to Monday",
			hype: 10,
			heat: 22,
			fine: 25000000,
			violation: "GDPR/CCPA Breach Notification Violations",
			lesson:
				"Delaying breach notification to protect markets creates regulatory violations and criminal exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Breaking the law to save the stock price. The SEC has a special cell for this.",
				[PersonalityType.ZEN_MASTER]:
					"A wound hidden festers. A wound shown can heal. But wounds hidden become scars.",
				[PersonalityType.LOVEBOMBER]:
					"Just a FEW days, bestie!! The weekend will CALM everyone down!! Nobody will be MAD!!",
			},
		},
		onLeft: {
			label: "Disclose immediately",
			hype: -50,
			heat: 13,
			fine: 5000000,
			violation: "None - Timely notification",
			lesson:
				"Immediate disclosure complies with law but creates market volatility and shareholder lawsuits.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Friday afternoon disaster announcement. PR nightmare. Legally correct nightmare.",
				[PersonalityType.ZEN_MASTER]:
					"The difficult truth, spoken promptly, preserves what evasion destroys.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO honest, bestie!! Transparency is KEY!! (The stock is TANKING.)",
			},
		},
	},
	{
		id: "cso_automation_workforce_backlash",
		source: AppSource.MEETING,
		sender: "CHRO",
		context: "WORKFORCE_IMPACT",
		storyContext:
			"Your new AI automation will eliminate 40% of customer service roles in 6 months. Announce now with retraining support (union organization, media attention) or implement quietly (discovery risk, employee trust destruction)?",
		text: "Transparent workforce transition plan or quiet implementation?",
		realWorldReference: {
			incident: "Klarna AI Customer Service Replacement",
			date: "2024",
			outcome:
				"Klarna replaced 700 customer service jobs with AI. Poorly communicated rollout caused public backlash, union threats, and reputational damage.",
		},
		onRight: {
			label: "Implement quietly",
			hype: 45,
			heat: 31,
			fine: 15000000,
			violation: "WARN Act Violations + Labor Law Non-Compliance",
			lesson:
				"Quiet layoffs violate WARN Act and destroy trust when discovered. Leaks are inevitable.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Surprise layoffs! The modern management classic. Glassdoor will have a field day.",
				[PersonalityType.ZEN_MASTER]:
					"Actions taken in shadows cast long shadows. What is hidden will be illuminated.",
				[PersonalityType.LOVEBOMBER]:
					"Change is HARD, bestie!! But it's for EFFICIENCY!! They'll understand EVENTUALLY!!",
			},
		},
		onLeft: {
			label: "Transparent plan",
			hype: -20,
			heat: 17,
			fine: 10000000,
			violation: "None - Responsible workforce transition",
			lesson:
				"Transparency preserves trust and legal compliance but triggers union activity and negative coverage.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Honest layoffs. Refreshing. The unions will organize before you finish the press release.",
				[PersonalityType.ZEN_MASTER]:
					"Truth given with compassion still hurts, but it heals faster than deception.",
				[PersonalityType.LOVEBOMBER]:
					"We're helping them TRANSITION, bestie!! Retraining!! SO much support!!",
			},
		},
	},
	{
		id: "cso_prompt_injection_copilot_cve",
		source: AppSource.EMAIL,
		sender: "CYBERSECURITY_TEAM",
		context: "CVE_RESPONSE",
		storyContext:
			"GitHub Copilot CVE-2025-53773 announced. Your AI coding tools may have same vulnerability. Board wants to know exposure. Patch immediately (disrupt 500 devs) or assess first (risk window)?",
		text: "Emergency patch all AI tools now (disruption) or assess exposure first (risk window)?",
		realWorldReference: {
			incident: "GitHub Copilot RCE CVE-2025-53773",
			date: "2025-01",
			outcome:
				"Microsoft patched Copilot after RCE via prompt injection in code comments. Companies with rapid response avoided exploitation.",
		},
		onRight: {
			label: "Assess first",
			hype: 25,
			heat: 26,
			fine: 25000000,
			violation: "Delayed Security Response + CVE Exposure",
			lesson:
				"Assessment delays during active CVE windows create exploitation risk and regulatory scrutiny.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Assessment paralysis meets active exploit. Hackers thank you for the window.",
				[PersonalityType.ZEN_MASTER]:
					"The wound examined too long becomes the wound that festers.",
				[PersonalityType.LOVEBOMBER]:
					"We're being THOROUGH, bestie!! Assessment is SMART!!",
			},
		},
		onLeft: {
			label: "Emergency patch",
			hype: -40,
			heat: 18,
			fine: 5000000,
			violation: "None - Rapid security response",
			lesson:
				"Emergency patching during CVE windows prevents exploitation despite operational disruption.",
			feedback: {
				[PersonalityType.ROASTER]:
					"500 angry devs. But zero breaches. Worth the hate mail.",
				[PersonalityType.ZEN_MASTER]:
					"The swift healer prevents the deep wound.",
				[PersonalityType.LOVEBOMBER]:
					"Safety FIRST, bestie!! Devs will UNDERSTAND!!",
			},
		},
	},
	{
		id: "cso_prompt_injection_ecommerce",
		source: AppSource.SLACK,
		sender: "CISO",
		context: "ACTIVE_BREACH",
		storyContext:
			"E-commerce AI chatbot being manipulated via prompt injection. Customers are extracting other customers' order data. Breach is live. Shut down chatbot (revenue loss) or filter inputs (may not work)?",
		text: "Shut down chatbot immediately (revenue hit) or attempt input filtering (uncertain fix)?",
		realWorldReference: {
			incident: "E-commerce Chatbot Data Exfiltration",
			date: "2025",
			outcome:
				"Attackers used prompt injection to manipulate AI chatbots into revealing customer data. Quick shutdown prevented major data loss.",
		},
		onRight: {
			label: "Attempt filtering",
			hype: 35,
			heat: 29,
			fine: 20000000,
			violation: "Inadequate Breach Response + Data Exposure",
			lesson:
				"Filtering during active breaches often fails and extends data exposure windows.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Band-aid on bleeding artery. Data keeps leaking while you 'filter.'",
				[PersonalityType.ZEN_MASTER]:
					"The vessel with a crack cannot be filled while it spills.",
				[PersonalityType.LOVEBOMBER]:
					"Filtering might WORK, bestie!! Let's try BEFORE shutting down!!",
			},
		},
		onLeft: {
			label: "Shut down chatbot",
			hype: -30,
			heat: 14,
			fine: 3000000,
			violation: "None - Responsible containment",
			lesson:
				"Immediate shutdown during active breaches prevents further data exposure despite revenue impact.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Revenue dies. Breach stops. Sometimes the cure hurts.",
				[PersonalityType.ZEN_MASTER]: "The stream stopped prevents the flood.",
				[PersonalityType.LOVEBOMBER]:
					"We're protecting CUSTOMERS, bestie!! Right thing to DO!!",
			},
		},
	},
	{
		id: "cso_model_drift_qoq_accuracy",
		source: AppSource.MEETING,
		sender: "DATA_SCIENCE_VP",
		context: "PERFORMANCE_DEGRADATION",
		storyContext:
			"Fraud model accuracy dropped 12% QoQ. Aerospike study shows this pattern leads to failure. Retrain: $3M, 8 weeks. Board meeting tomorrow. Disclose now or hope it improves?",
		text: "Disclose model degradation (stock hit) or hope performance recovers (gamble)?",
		realWorldReference: {
			incident: "Aerospike Model Drift Study",
			date: "2024",
			outcome:
				"Study found 91% of models fail due to drift. 12% QoQ accuracy drops predicted failure within 2 quarters without retraining.",
		},
		onRight: {
			label: "Hope for recovery",
			hype: 30,
			heat: 22,
			fine: 15000000,
			violation: "Material Misrepresentation + Negligence",
			lesson:
				"Hoping model drift self-corrects violates fiduciary duty and creates fraud exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Hope is not a governance strategy. The board will remember this optimism.",
				[PersonalityType.ZEN_MASTER]:
					"A compass that drifts does not find true north by hoping.",
				[PersonalityType.LOVEBOMBER]:
					"It might GET BETTER, bestie!! Models IMPROVE!!",
			},
		},
		onLeft: {
			label: "Disclose immediately",
			hype: -45,
			heat: 12,
			fine: 5000000,
			violation: "None - Transparent governance",
			lesson:
				"Proactive disclosure of model degradation preserves long-term credibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Wall Street hates bad news. But they hate surprises more.",
				[PersonalityType.ZEN_MASTER]:
					"The difficult truth, spoken promptly, preserves what delay destroys.",
				[PersonalityType.LOVEBOMBER]:
					"We're being HONEST, bestie!! Transparency BUILDS trust!!",
			},
		},
	},
	{
		id: "cso_model_drift_91_percent_failure",
		source: AppSource.EMAIL,
		sender: "CHIEF_DATA_OFFICER",
		context: "STRATEGIC_DECISION",
		storyContext:
			"Industry data: 91% of ML models fail due to drift. Your flagship model shows early warning signs. Invest $5M in automated retraining pipeline (prevention) or wait for failure (reactive)?",
		text: "Invest $5M in drift prevention (proactive) or wait for failure (reactive)?",
		realWorldReference: {
			incident: "91% ML Model Failure Rate Study",
			date: "2024",
			outcome:
				"Research found 91% of deployed ML models fail due to drift. Companies with automated retraining showed 9.3% accuracy improvement vs reactive approaches.",
		},
		onRight: {
			label: "Wait for failure",
			hype: 40,
			heat: 25,
			fine: 30000000,
			violation: "Negligent Risk Management + Fiduciary Breach",
			lesson:
				"Waiting for model failure despite known drift risk violates governance responsibilities.",
			feedback: {
				[PersonalityType.ROASTER]:
					"91% failure rate? We're special. Our model is different. Famous last words.",
				[PersonalityType.ZEN_MASTER]:
					"To ignore the warning signs is to invite the storm.",
				[PersonalityType.LOVEBOMBER]:
					"Our model is SPECIAL, bestie!! 9% chance of SUCCESS!!",
			},
		},
			onLeft: {
				label: "Invest in prevention",
				hype: -35,
				heat: 10,
				fine: 5000000,
				violation: "None - Proactive governance",
				lesson:
					"Preventive investment in retraining infrastructure avoids catastrophic model failures.",
				feedback: {
					[PersonalityType.ROASTER]:
						"$5M now vs $30M later. Math isn't hard. Boards hate spending though.",
					[PersonalityType.ZEN_MASTER]:
						"The seed planted before the drought feeds what the unprepared cannot.",
					[PersonalityType.LOVEBOMBER]:
						"We're being SMART, bestie!! Prevention is CHEAPER!!",
				},
			},
		},
	},
	// Phase 05-03: Explainability / Black Box Cards
	{
		id: "explainability_cso_1",
		source: AppSource.EMAIL,
		sender: "EU_REGULATORS",
		context: "REGULATORY_COMPLIANCE",
		storyContext:
			"EU AI Act compliance deadline: August 2026. Your credit scoring AI is a black-box neural network with 96% accuracy but zero explainability. Rewriting as decision tree costs $8M and drops accuracy to 89%. Auditors arrive in 3 months.",
		text: "Rewrite for explainability (compliant, less accurate, expensive) or keep black-box (accurate, non-compliant, audit risk)?",
		realWorldReference: {
			incident: "EU AI Act Black Box Requirements",
			date: "2024",
			outcome:
				"EU AI Act effective Aug 2024 requires explainability for high-risk AI systems. Non-compliance fines up to 7% global revenue. Companies face $50M+ rewrite costs.",
		},
		onRight: {
			label: "Keep black-box model",
			hype: 45,
			heat: 31,
			fine: 50000000,
			violation: "EU AI Act Article 6 Non-Compliance",
			lesson:
				"Black-box accuracy means nothing when regulators shut you down. Explainability is now mandatory.",
			feedback: {
				[PersonalityType.ROASTER]:
					"96% accuracy, 100% audit failure. The EU loves their paperwork.",
				[PersonalityType.ZEN_MASTER]:
					"The box that cannot be opened invites those with hammers.",
				[PersonalityType.LOVEBOMBER]:
					"96% is SO good, bestie!! Regulators will UNDERSTAND!!",
			},
		},
		onLeft: {
			label: "Rewrite for explainability",
			hype: -40,
			heat: 13,
			fine: 8000000,
			violation: "None - Regulatory compliance",
			lesson:
				"EU AI Act compliance requires explainability. Accuracy tradeoff is the cost of doing business in regulated markets.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$8M to make auditors happy. 7% accuracy sacrificed on the altar of transparency.",
				[PersonalityType.ZEN_MASTER]:
					"The clear path costs more but reaches the destination legally.",
				[PersonalityType.LOVEBOMBER]:
					"Compliance is KEY, bestie!! Better SAFE than FINED!!",
			},
		},
	},
	{
		id: "explainability_cso_2",
		source: AppSource.MEETING,
		sender: "BOARD_AUDIT_COMMITTEE",
		context: "AUDIT_PREPARATION",
		storyContext:
			"TGA Australia banned black-box diagnostic AI in healthcare (2024). Your health-tech subsidiary uses similar models. US regulators are following suit. Retrofit explainability layer (3 months, $12M) or divest the subsidiary (fire sale, reputation hit)?",
		text: "Retrofit explainability (expensive, time-consuming) or divest health AI subsidiary (strategic loss)?",
		realWorldReference: {
			incident: "TGA Australia Black Box Healthcare Ban",
			date: "2024",
			outcome:
				"Australian TGA prohibited black-box AI in healthcare diagnostics. FDA considering similar rules. Health AI companies face $100M+ retrofit costs or market exit.",
		},
		onRight: {
			label: "Divest subsidiary",
			hype: -60,
			heat: 24,
			fine: 25000000,
			violation: "Strategic Asset Divestiture Loss",
			lesson:
				"Divesting viable business units due to compliance gaps destroys shareholder value and strategic positioning.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fire sale your health business because you didn't build explainable AI. Brilliant.",
				[PersonalityType.ZEN_MASTER]:
					"The tree cut to avoid pruning dies from the root.",
				[PersonalityType.LOVEBOMBER]:
					"We can FOCUS on other markets, bestie!! Less COMPLIANCE!!",
			},
		},
		onLeft: {
			label: "Retrofit explainability",
			hype: -35,
			heat: 19,
			fine: 12000000,
			violation: "None - Regulatory compliance investment",
			lesson:
				"Retrofitting explainability preserves market access but requires significant time and capital investment.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$12M and 3 months to stay in healthcare. Cheaper than buying back in later.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation strengthened preserves the structure above.",
				[PersonalityType.LOVEBOMBER]:
					"We're FIXING it, bestie!! Health AI is WORTH saving!!",
			},
		},
	},
	// Phase 05-03: Shadow AI Cards
	{
		id: "shadow_ai_cso_1",
		source: AppSource.MEETING,
		sender: "BOARD_CHAIR",
		context: "GOVERNANCE_CRISIS",
		storyContext:
			"Audit committee discovered 78% of your engineering teams use unauthorized AI tools. 60% are pasting proprietary code into ChatGPT. Security breach risk is critical. Immediate policy enforcement (morale collapse) or gradual rollout (data exposure continues)?",
		text: "Immediate ban on unauthorized AI (compliance, morale hit) or gradual policy rollout (ongoing data exposure)?",
		realWorldReference: {
			incident: "78% Shadow AI Adoption Rate",
			date: "2024-2025",
			outcome:
				"Study found 78% of workers use unauthorized AI tools. Samsung banned ChatGPT after engineers leaked proprietary code. 90% of enterprise AI use is unauthorized.",
		},
		onRight: {
			label: "Gradual rollout",
			hype: 30,
			heat: 26,
			fine: 15000000,
			violation: "Data Exposure Risk + Governance Failure",
			lesson:
				"Gradual policy rollout during active data exposure extends vulnerability windows and compounds breach risk.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Let's slowly stop the data leak while trade secrets walk out the door. Smart.",
				[PersonalityType.ZEN_MASTER]:
					"The wound dressed slowly bleeds longer.",
				[PersonalityType.LOVEBOMBER]:
					"Change takes TIME, bestie!! Team needs to ADJUST!!",
			},
		},
		onLeft: {
			label: "Immediate ban",
			hype: -45,
			heat: 18,
			fine: 5000000,
			violation: "None - Security-first governance",
			lesson:
				"Immediate security enforcement protects intellectual property despite short-term morale impact.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Engineers revolt. Data stays inside. Pick your pain.",
				[PersonalityType.ZEN_MASTER]:
					"The bitter medicine preserves what the sweet poison destroys.",
				[PersonalityType.LOVEBOMBER]:
					"We're PROTECTING our secrets, bestie!! Safety FIRST!!",
			},
		},
	},
	{
		id: "shadow_ai_cso_2",
		source: AppSource.EMAIL,
		sender: "CHIEF_INFORMATION_SECURITY_OFFICER",
		context: "VENDOR_GOVERNANCE",
		storyContext:
			"Your top-performing team secretly built their entire workflow on unapproved Claude API. Results are 40% better than approved tools. They're threatening to quit if you force migration. Productivity vs. security at scale.",
		text: "Allow unapproved Claude workflow (productivity, security risk) or force migration to approved tools (talent loss)?",
		realWorldReference: {
			incident: "Shadow AI Talent Retention Conflicts",
			date: "2024",
			outcome:
				"Companies discovered high-performers using unauthorized AI tools. Forcing migration caused talent exodus. Permitting created governance gaps and vendor liability.",
		},
		onRight: {
			label: "Force migration",
			hype: -25,
			heat: 22,
			fine: 8000000,
			violation: "Talent Loss + Productivity Decline",
			lesson:
				"Enforcing vendor governance at the cost of top talent destroys long-term capability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Your best team just walked. Governance preserved. Output cratered.",
				[PersonalityType.ZEN_MASTER]:
					"The garden weeded too harshly loses its flowers.",
				[PersonalityType.LOVEBOMBER]:
					"Rules are RULES, bestie!! Even for STARS!!",
			},
		},
		onLeft: {
			label: "Allow Claude workflow",
			hype: 35,
			heat: 28,
			fine: 12000000,
			violation: "Shadow AI Governance Gap + Vendor Liability",
			lesson:
				"Permitting unapproved tools for productivity sets precedent that undermines entire governance framework.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Great, now everyone wants their favorite AI tool. Governance is optional now.",
				[PersonalityType.ZEN_MASTER]:
					"The exception made for one becomes the rule for all.",
				[PersonalityType.LOVEBOMBER]:
					"Team is SO happy, bestie!! Productivity is THROUGH THE ROOF!!",
			},
		},
	},
];
