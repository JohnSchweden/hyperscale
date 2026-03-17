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
			heat: 68,
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
			heat: 28,
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
			heat: 42,
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
			heat: 20,
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
			heat: 42,
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
			heat: 65,
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
			heat: 52,
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
			heat: 38,
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
			heat: 68,
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
			heat: 32,
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
			heat: 58,
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
			heat: 20,
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
			heat: 65,
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
			heat: 28,
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
			heat: 42,
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
			heat: 42,
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
			heat: 52,
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
			heat: 65,
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
];
