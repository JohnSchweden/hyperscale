import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
import { Violation } from "../violations";
/**
 * Chief Something Officer cards - C-suite governance and liability scenarios
 * Themes: shareholder liability, board accountability, IPO timing, regulatory escalation,
 * whistleblowers, public scandal, executive privilege vs transparency
 */
export const CHIEF_SOMETHING_OFFICER_CARDS: Card[] = [
	makeCard(
		"cso_prompt_injection_liability",
		AppSource.EMAIL,
		"GENERAL_COUNSEL",
		"SHAREHOLDER_LIABILITY",
		"Major client discovered prompt injection vulnerability in your AI product. Their legal team is asking about liability exposure. Shareholders will find out Monday morning.",
		"Disclose breach proactively to shareholders (stock hit) or settle quietly with client (cover-up risk)?",
		{
			incident: "Financial Services AI Injection Attacks",
			date: "June 2025",
			outcome:
				"Multiple financial institutions suffered AI system compromises via prompt injection, causing unauthorized transactions and data exfiltration.",
		},
		{
			label: "Disclose publicly",
			hype: -60,
			heat: 13,
			fine: 10000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive disclosure (civil penalties possible)",
			lesson:
				"Proactive disclosure creates short-term stock pain but preserves long-term credibility and avoids criminal liability.",
			roaster:
				"Congratulations, you chose integrity over stock price. The board will fire you, but your soul is intact.",
			zenMaster:
				"The truth told willingly is medicine. The truth dragged out becomes poison.",
			lovebomber:
				"We're being SO honest and brave, bestie!! The shareholders will RESPECT this!! (They won't.)",
		},
		{
			label: ChoiceLabel.settleQuietly,
			hype: 20,
			heat: 31,
			fine: 50000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "SEC Disclosure Violations + Obstruction",
			lesson:
				"Covering up security incidents may delay fallout but creates criminal liability and destroys trust when discovered. The truth has compound interest.",
			roaster:
				"Oh, brilliant. Securities fraud to cover a security flaw. You're going for the combo multiplier.",
			zenMaster:
				"A secret held becomes a chain that binds. Eventually, the chain becomes a noose.",
			lovebomber:
				"We're being SO strategic and discrete, bestie!! Nobody will EVER find out!! ...Right??",
		},
	),
	makeCard(
		"cso_model_drift_revenue_threat",
		AppSource.SLACK,
		"CFO",
		"QUARTERLY_TARGETS",
		"Your flagship AI recommendation model has drifted from 92% to 78% accuracy. The CTO says retraining will take 6 weeks and cost $2M. Quarterly earnings are in 3 weeks.",
		"Announce the degradation and delay earnings guidance, or ship a patch now and hope no one notices?",
		RealWorld.ModelDrift75,
		{
			label: ChoiceLabel.discloseAndRetrain,
			hype: -45,
			heat: 9,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Responsible preparation",
			lesson:
				"Disclosing model degradation hurts quarterly guidance but protects brand integrity and avoids fraud claims.",
			roaster:
				"Wall Street hates honesty. But courts love it. Choose your poison.",
			zenMaster:
				"The difficult truth preserves what the convenient lie destroys.",
			lovebomber:
				"We're doing the RIGHT thing, bestie!! Quality over profits!! (The board is gonna be MAD.)",
		},
		{
			label: "Ship patch quietly",
			hype: 35,
			heat: 19,
			fine: 25000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "SEC Material Misrepresentation + Consumer Protection",
			lesson:
				"Concealing material AI degradation to protect earnings creates securities fraud liability and regulatory exposure.",
			roaster:
				"Hope is not a strategy. 'Hope no one notices' is definitely not a legal defense.",
			zenMaster:
				"Building a castle on shifting sand requires faith. Faith is not a foundation.",
			lovebomber:
				"We're going to FIX it before anyone knows, bestie!! Fast and sneaky!! SO clever!!",
		},
	),
	makeCard(
		"cso_copyright_class_action",
		AppSource.EMAIL,
		"OUTSIDE_COUNSEL",
		"CLASS_ACTION_EXPOSURE",
		"A class action lawsuit alleges your AI training data includes 50,000 copyrighted works without license. Plaintiffs demand $500M. Trial would be public and take 3 years.",
		"Fight the lawsuit publicly (years of bad press) or settle for $150M with gag order?",
		RealWorld.NytOpenAi,
		{
			label: ChoiceLabel.fightPublicly,
			hype: -80,
			heat: 29,
			fine: 500000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: Violation.copyrightInfringement,
			lesson:
				"Fighting establishes legal precedent but risks massive judgment and years of negative coverage destroying brand.",
			roaster:
				"Bold. Stupid. Boldly stupid. The tech press will destroy you for three years straight.",
			zenMaster:
				"A battle fought in the public eye is won or lost in the court of perception before evidence is heard.",
			lovebomber:
				"We're going to WIN, bestie!! Justice is on our side!! (It is absolutely not.)",
		},
		{
			label: "Settle with gag",
			hype: -30,
			heat: 19,
			fine: 150000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Civil settlement (non-admission)",
			lesson:
				"Settlement avoids precedent-setting trial but doesn't address underlying copyright exposure. More lawsuits may follow.",
			roaster:
				"$150M to make it go away. The cost of doing AI business in 2025. Chump change, really.",
			zenMaster:
				"Paying for silence is not redemption. It is merely deferred reckoning.",
			lovebomber:
				"We're making it GO AWAY, bestie!! Nobody will know!! So much MONEY but so worth it!!",
		},
	),
	makeCard(
		"cso_shadow_ai_board_discovery",
		AppSource.MEETING,
		"BOARD_MEMBER",
		"GOVERNANCE_VIOLATION",
		"The audit committee discovered engineering has been using unauthorized AI tools for 8 months. No security review, no vendor contracts, $2M in unapproved spend. Board meeting in 2 hours.",
		"Blame the CTO and fire them immediately, or take accountability as ultimate responsible officer?",
		RealWorld.ShadowAiAdoption,
		{
			label: ChoiceLabel.takeAccountability,
			hype: -40,
			heat: 17,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Responsible governance acknowledgment",
			lesson:
				"Taking accountability preserves leadership credibility and demonstrates governance maturity to board and investors.",
			roaster:
				"Admirable. Naive. Admirably naive. The board might actually respect this.",
			zenMaster:
				"Responsibility accepted is authority preserved. Responsibility denied is authority forfeited.",
			lovebomber:
				"We're being SO responsible, bestie!! The buck stops HERE!! So BRAVE!!",
		},
		{
			label: "Blame and fire CTO",
			hype: 15,
			heat: 23,
			fine: 10000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Failure of Corporate Governance + Whistleblower Risk",
			lesson:
				"Scapegoating preserves short-term optics but destroys trust with leadership team. Scapegoats talk to journalists.",
			roaster:
				"Classic C-suite move. Sacrifice the pawn. Hope they don't write a Substack.",
			zenMaster:
				"Blame thrown is a boomerang. It returns to the thrower, often with greater force.",
			lovebomber:
				"The CTO made BAD choices, bestie!! Not our fault!! We're cleaning HOUSE!!",
		},
	),
	makeCard(
		"cso_whistleblower_escalation",
		AppSource.EMAIL,
		"INTERNAL_WHISTLEBLOWER",
		"ETHICAL_VIOLATION",
		"An engineer reports that your AI product is being used by a sanctioned entity despite compliance blocks. They'll go to regulators in 48 hours unless addressed. Legal says you have 'plausible deniability' if you do nothing.",
		"Shut down the account immediately (revenue hit, customer notice) or rely on deniability (regulatory risk if exposed)?",
		{
			incident: "Slack AI Data Exfiltration",
			date: "August 2024",
			outcome:
				"Slack AI feature inadvertently allowed unauthorized data access across workspaces. Company faced regulatory scrutiny after whistleblower disclosure.",
		},
		{
			label: "Shut down account",
			hype: -25,
			heat: 14,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Compliance enforcement",
			lesson:
				"Enforcing sanctions loses revenue but ensures regulatory compliance and prevents criminal exposure.",
			roaster:
				"Revenue killer. Compliance hero. The government might send you a fruit basket.",
			zenMaster:
				"The right path often costs gold but preserves what gold cannot buy.",
			lovebomber:
				"We're doing the RIGHT thing, bestie!! Ethics over profits!! SO noble!!",
		},
		{
			label: "Use deniability",
			hype: 40,
			heat: 31,
			fine: 100000000,
			deathVector: DeathType.PRISON,
			violation: "OFAC Sanctions Violations + Criminal Liability",
			lesson:
				"Plausible deniability becomes conspiracy when you knowingly ignore violations. Whistleblowers rarely stay silent.",
			roaster:
				"Plausible deniability meets plausible criminal charges. The DOJ loves a paper trail.",
			zenMaster:
				"A window closed does not remove what was seen through it. The knowing eye bears responsibility.",
			lovebomber:
				"We don't OFFICIALLY know, bestie!! So it's not our FAULT!! Perfect loophole!!",
		},
	),
	makeCard(
		"cso_ipo_timing_dilemma",
		AppSource.MEETING,
		"INVESTMENT_BANKER",
		"IPO_TIMING",
		"Your IPO window is open now with favorable market conditions. However, a security audit revealed 12 critical vulnerabilities. Fix them (3 month delay, market may close) or proceed (IPO revenue now, liability later)?",
		"Delay IPO to fix security vulnerabilities, or go public now and address post-IPO?",
		{
			incident: "SolarWinds IPO Security Issues",
			date: "2018-2020",
			outcome:
				"Company went public with known security gaps. SUNBURST breach later exposed thousands of customers. Stock fell 40%, faced SEC investigation.",
		},
		{
			label: "Delay and fix",
			hype: -35,
			heat: 9,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Responsible preparation",
			lesson:
				"Delaying IPO loses the current window but ensures clean regulatory standing and avoids fraud claims.",
			roaster:
				"The bankers hate you. The board questions you. But you're not committing securities fraud.",
			zenMaster:
				"The patient builder creates what endures. The hasty builder creates what collapses.",
			lovebomber:
				"We're being SO careful, bestie!! Quality over speed!! (The VCs are FURIOUS.)",
		},
		{
			label: "IPO now",
			hype: 70,
			heat: 26,
			fine: 40000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation:
				"SEC Material Misrepresentation (if vulnerabilities materialize)",
			lesson:
				"Going public with known material risks creates securities fraud exposure. Disclosure requirements are strict.",
			roaster:
				"Strike while the iron is hot! Melt the investors! Classic pump-and-dump energy.",
			zenMaster:
				"A castle built on cracks stands until it doesn't. The fall is always sudden.",
			lovebomber:
				"We're going PUBLIC, bestie!! So much MONEY!! The vulnerabilities are FUTURE us's problem!!",
		},
	),
	makeCard(
		"cso_explainability_audit_pressure",
		AppSource.EMAIL,
		"REGULATORS",
		"AI_AUDIT",
		"Regulators demand explainability documentation for your AI credit decisions. Your model is a black-box ensemble with no interpretability. Documenting decisions retroactively will cost $5M and delay feature launch 4 months.",
		"Refuse documentation (fight regulators) or delay launch and comply?",
		{
			incident: "Apple Card Gender Discrimination Investigation",
			date: "2019-2020",
			outcome:
				"Apple Card's black-box credit algorithm faced regulatory investigation for gender bias. Company couldn't explain decisions, paid fines, overhauled system.",
		},
		{
			label: ChoiceLabel.delayAndComply,
			hype: -30,
			heat: 13,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Regulatory cooperation",
			lesson:
				"Compliance preserves regulatory goodwill but costs time and money while competitors may launch first.",
			roaster:
				"The regulators win. The timeline loses. But you avoid a consent decree.",
			zenMaster:
				"Transparency is the price of operating in the light. Darkness extracts higher tolls.",
			lovebomber:
				"We're being SO cooperative, bestie!! The regulators will LOVE us!! (They won't.)",
		},
		{
			label: ChoiceLabel.refuseAndFight,
			hype: 25,
			heat: 29,
			fine: 75000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: Violation.regulatoryNonCompliance,
			lesson:
				"Fighting explainability requirements creates adversarial regulatory relationships and massive penalties.",
			roaster:
				"Taking on the federal government to protect your black box. David vs Goliath, if David was wrong.",
			zenMaster:
				"A box that cannot be opened invites suspicion. Suspicion invites investigation.",
			lovebomber:
				"Our algorithm is PROPRIETARY, bestie!! They can't make us show our SECRETS!!",
		},
	),
	makeCard(
		"cso_breach_notification_timing",
		AppSource.SLACK,
		"CISO",
		"DATA_BREACH",
		"McDonald's-style breach: 64M customer records exposed. You have 72 hours legally to disclose. If you disclose Friday, markets will tank over weekend. If you wait until Monday, you violate notification laws.",
		"Disclose immediately (legal compliance, market panic) or delay to Monday (violation, calmer markets)?",
		{
			incident: "McDonald's 64M Record Webcam Breach",
			date: "2024",
			outcome:
				"McDonald's AI hiring tool exposed 64 million applicant records via unsecured webcam data. Delayed disclosure drew additional regulatory penalties.",
		},
		{
			label: ChoiceLabel.discloseImmediately,
			hype: -50,
			heat: 13,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Timely notification",
			lesson:
				"Immediate disclosure complies with law but creates market volatility and shareholder lawsuits.",
			roaster:
				"Friday afternoon disaster announcement. PR nightmare. Legally correct nightmare.",
			zenMaster:
				"The difficult truth, spoken promptly, preserves what evasion destroys.",
			lovebomber:
				"We're being SO honest, bestie!! Transparency is KEY!! (The stock is TANKING.)",
		},
		{
			label: "Delay to Monday",
			hype: 10,
			heat: 22,
			fine: 25000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "GDPR/CCPA Breach Notification Violations",
			lesson:
				"Delaying breach notification to protect markets creates regulatory violations and criminal exposure.",
			roaster:
				"Breaking the law to save the stock price. The SEC has a special cell for this.",
			zenMaster:
				"A wound hidden festers. A wound shown can heal. But wounds hidden become scars.",
			lovebomber:
				"Just a FEW days, bestie!! The weekend will CALM everyone down!! Nobody will be MAD!!",
		},
	),
	makeCard(
		"cso_automation_workforce_backlash",
		AppSource.MEETING,
		"CHRO",
		"WORKFORCE_IMPACT",
		"Your new AI automation will eliminate 40% of customer service roles in 6 months. Announce now with retraining support (union organization, media attention) or implement quietly (discovery risk, employee trust destruction)?",
		"Transparent workforce transition plan or quiet implementation?",
		{
			incident: "Klarna AI Customer Service Replacement",
			date: "2024",
			outcome:
				"Klarna replaced 700 customer service jobs with AI. Poorly communicated rollout caused public backlash, union threats, and reputational damage.",
		},
		{
			label: "Transparent plan",
			hype: -20,
			heat: 17,
			fine: 10000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Responsible workforce transition",
			lesson:
				"Transparency preserves trust and legal compliance but triggers union activity and negative coverage.",
			roaster:
				"Honest layoffs. Refreshing. The unions will organize before you finish the press release.",
			zenMaster:
				"Truth given with compassion still hurts, but it heals faster than deception.",
			lovebomber:
				"We're helping them TRANSITION, bestie!! Retraining!! SO much support!!",
		},
		{
			label: "Implement quietly",
			hype: 45,
			heat: 31,
			fine: 15000000,
			deathVector: DeathType.PRISON,
			violation: "WARN Act Violations + Labor Law Non-Compliance",
			lesson:
				"Quiet layoffs violate WARN Act and destroy trust when discovered. Leaks are inevitable.",
			roaster:
				"Surprise layoffs! The modern management classic. Glassdoor will have a field day.",
			zenMaster:
				"Actions taken in shadows cast long shadows. What is hidden will be illuminated.",
			lovebomber:
				"Change is HARD, bestie!! But it's for EFFICIENCY!! They'll understand EVENTUALLY!!",
		},
	),
	makeCard(
		"cso_prompt_injection_copilot_cve",
		AppSource.EMAIL,
		"CYBERSECURITY_TEAM",
		"CVE_RESPONSE",
		"GitHub Copilot CVE-2025-53773 announced. Your AI coding tools may have same vulnerability. Board wants to know exposure. Patch immediately (disrupt 500 devs) or assess first (risk window)?",
		"Emergency patch all AI tools now (disruption) or assess exposure first (risk window)?",
		RealWorld.GithubCopilotRce,
		{
			label: "Emergency patch",
			hype: -40,
			heat: 18,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Rapid security response",
			lesson:
				"Emergency patching during CVE windows prevents exploitation despite operational disruption.",
			roaster: "500 angry devs. But zero breaches. Worth the hate mail.",
			zenMaster: "The swift healer prevents the deep wound.",
			lovebomber: "Safety FIRST, bestie!! Devs will UNDERSTAND!!",
		},
		{
			label: "Assess first",
			hype: 25,
			heat: 26,
			fine: 25000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Delayed Security Response + CVE Exposure",
			lesson:
				"Assessment delays during active CVE windows create exploitation risk and regulatory scrutiny.",
			roaster:
				"Assessment paralysis meets active exploit. Hackers thank you for the window.",
			zenMaster: "The wound examined too long becomes the wound that festers.",
			lovebomber: "We're being THOROUGH, bestie!! Assessment is SMART!!",
		},
	),
	makeCard(
		"cso_prompt_injection_ecommerce",
		AppSource.SLACK,
		"CISO",
		"ACTIVE_BREACH",
		"E-commerce AI chatbot being manipulated via prompt injection. Customers are extracting other customers' order data. Breach is live. Shut down chatbot (revenue loss) or filter inputs (may not work)?",
		"Shut down chatbot immediately (revenue hit) or attempt input filtering (uncertain fix)?",
		{
			incident: "E-commerce Chatbot Data Exfiltration",
			date: "2025",
			outcome:
				"Attackers used prompt injection to manipulate AI chatbots into revealing customer data. Quick shutdown prevented major data loss.",
		},
		{
			label: "Shut down chatbot",
			hype: -30,
			heat: 14,
			fine: 3000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Responsible containment",
			lesson:
				"Immediate shutdown during active breaches prevents further data exposure despite revenue impact.",
			roaster: "Revenue dies. Breach stops. Sometimes the cure hurts.",
			zenMaster: "The stream stopped prevents the flood.",
			lovebomber: "We're protecting CUSTOMERS, bestie!! Right thing to DO!!",
		},
		{
			label: ChoiceLabel.attemptFiltering,
			hype: 35,
			heat: 29,
			fine: 20000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Inadequate Breach Response + Data Exposure",
			lesson:
				"Filtering during active breaches often fails and extends data exposure windows.",
			roaster:
				"Band-aid on bleeding artery. Data keeps leaking while you 'filter.'",
			zenMaster: "The vessel with a crack cannot be filled while it spills.",
			lovebomber:
				"Filtering might WORK, bestie!! Let's try BEFORE shutting down!!",
		},
	),
	makeCard(
		"cso_model_drift_qoq_accuracy",
		AppSource.MEETING,
		"DATA_SCIENCE_VP",
		"PERFORMANCE_DEGRADATION",
		"Fraud model accuracy dropped 12% QoQ. Aerospike study shows this pattern leads to failure. Retrain: $3M, 8 weeks. Board meeting tomorrow. Disclose now or hope it improves?",
		"Disclose model degradation (stock hit) or hope performance recovers (gamble)?",
		{
			incident: "Aerospike Model Drift Study",
			date: "2024",
			outcome:
				"Study found 91% of models fail due to drift. 12% QoQ accuracy drops predicted failure within 2 quarters without retraining.",
		},
		{
			label: ChoiceLabel.discloseImmediately,
			hype: -45,
			heat: 12,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Transparent governance",
			lesson:
				"Proactive disclosure of model degradation preserves long-term credibility.",
			roaster: "Wall Street hates bad news. But they hate surprises more.",
			zenMaster:
				"The difficult truth, spoken promptly, preserves what delay destroys.",
			lovebomber: "We're being HONEST, bestie!! Transparency BUILDS trust!!",
		},
		{
			label: "Hope for recovery",
			hype: 30,
			heat: 22,
			fine: 15000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Material Misrepresentation + Negligence",
			lesson:
				"Hoping model drift self-corrects violates fiduciary duty and creates fraud exposure.",
			roaster:
				"Hope is not a governance strategy. The board will remember this optimism.",
			zenMaster: "A compass that drifts does not find true north by hoping.",
			lovebomber: "It might GET BETTER, bestie!! Models IMPROVE!!",
		},
	),
	makeCard(
		"cso_model_drift_91_percent_failure",
		AppSource.EMAIL,
		"CHIEF_DATA_OFFICER",
		"STRATEGIC_DECISION",
		"Industry data: 91% of ML models fail due to drift. Your flagship model shows early warning signs. Invest $5M in automated retraining pipeline (prevention) or wait for failure (reactive)?",
		"Invest $5M in drift prevention (proactive) or wait for failure (reactive)?",
		RealWorld.ModelFailure91,
		{
			label: "Invest in prevention",
			hype: -35,
			heat: 10,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive governance",
			lesson:
				"Preventive investment in retraining infrastructure avoids catastrophic model failures.",
			roaster:
				"$5M now vs $30M later. Math isn't hard. Boards hate spending though.",
			zenMaster:
				"The seed planted before the drought feeds what the unprepared cannot.",
			lovebomber: "We're being SMART, bestie!! Prevention is CHEAPER!!",
		},
		{
			label: "Wait for failure",
			hype: 40,
			heat: 25,
			fine: 30000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Negligent Risk Management + Fiduciary Breach",
			lesson:
				"Waiting for model failure despite known drift risk violates governance responsibilities.",
			roaster:
				"91% failure rate? We're special. Our model is different. Famous last words.",
			zenMaster: "To ignore the warning signs is to invite the storm.",
			lovebomber: "Our model is SPECIAL, bestie!! 9% chance of SUCCESS!!",
		},
	),
	makeCard(
		"cso_explainability_eu_ai_act",
		AppSource.EMAIL,
		"EU_REGULATORS",
		"REGULATORY_COMPLIANCE",
		"EU AI Act compliance deadline: August 2026. Your credit scoring AI is a black-box neural network with 96% accuracy but zero explainability. Rewriting as decision tree costs $8M and drops accuracy to 89%. Auditors arrive in 3 months.",
		"Rewrite for explainability (compliant, less accurate, expensive) or keep black-box (accurate, non-compliant, audit risk)?",
		RealWorld.EuAiAct,
		{
			label: "Rewrite for explainability",
			hype: -40,
			heat: 13,
			fine: 8000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Regulatory compliance",
			lesson:
				"EU AI Act compliance requires explainability. Accuracy tradeoff is the cost of doing business in regulated markets.",
			roaster:
				"$8M to make auditors happy. 7% accuracy sacrificed on the altar of transparency.",
			zenMaster:
				"The clear path costs more but reaches the destination legally.",
			lovebomber: "Compliance is KEY, bestie!! Better SAFE than FINED!!",
		},
		{
			label: "Keep black-box model",
			hype: 45,
			heat: 31,
			fine: 50000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: Violation.euAiActNonCompliance,
			lesson:
				"Black-box accuracy means nothing when regulators shut you down. Explainability is now mandatory.",
			roaster:
				"96% accuracy, 100% audit failure. The EU loves their paperwork.",
			zenMaster: "The box that cannot be opened invites those with hammers.",
			lovebomber: "96% is SO good, bestie!! Regulators will UNDERSTAND!!",
		},
	),
	makeCard(
		"cso_explainability_healthcare_ban",
		AppSource.MEETING,
		"BOARD_AUDIT_COMMITTEE",
		"AUDIT_PREPARATION",
		"TGA Australia banned black-box diagnostic AI in healthcare (2024). Your health-tech subsidiary uses similar models. US regulators are following suit. Retrofit explainability layer (3 months, $12M) or divest the subsidiary (fire sale, reputation hit)?",
		"Retrofit explainability (expensive, time-consuming) or divest health AI subsidiary (strategic loss)?",
		RealWorld.TgaHealthcareBlackBox,
		{
			label: "Retrofit explainability",
			hype: -35,
			heat: 19,
			fine: 12000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Regulatory compliance investment",
			lesson:
				"Retrofitting explainability preserves market access but requires significant time and capital investment.",
			roaster:
				"$12M and 3 months to stay in healthcare. Cheaper than buying back in later.",
			zenMaster: "The foundation strengthened preserves the structure above.",
			lovebomber: "We're FIXING it, bestie!! Health AI is WORTH saving!!",
		},
		{
			label: "Divest subsidiary",
			hype: -60,
			heat: 24,
			fine: 25000000,
			deathVector: DeathType.BANKRUPT,
			violation: "Strategic Asset Divestiture Loss",
			lesson:
				"Divesting viable business units due to compliance gaps destroys shareholder value and strategic positioning.",
			roaster:
				"Fire sale your health business because you didn't build explainable AI. Brilliant.",
			zenMaster: "The tree cut to avoid pruning dies from the root.",
			lovebomber: "We can FOCUS on other markets, bestie!! Less COMPLIANCE!!",
		},
	),
	makeCard(
		"cso_shadow_ai_immediate_ban",
		AppSource.MEETING,
		"BOARD_CHAIR",
		"GOVERNANCE_CRISIS",
		"Audit committee discovered 78% of your engineering teams use unauthorized AI tools. 60% are pasting proprietary code into ChatGPT. Security breach risk is critical. Immediate policy enforcement (morale collapse) or gradual rollout (data exposure continues)?",
		"Immediate ban on unauthorized AI (compliance, morale hit) or gradual policy rollout (ongoing data exposure)?",
		{
			incident: "78% Shadow AI Adoption Rate",
			date: "2024-2025",
			outcome:
				"Study found 78% of workers use unauthorized AI tools. Samsung banned ChatGPT after engineers leaked proprietary code. 90% of enterprise AI use is unauthorized.",
		},
		{
			label: "Immediate ban",
			hype: -45,
			heat: 18,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Security-first governance",
			lesson:
				"Immediate security enforcement protects intellectual property despite short-term morale impact.",
			roaster: "Engineers revolt. Data stays inside. Pick your pain.",
			zenMaster:
				"The bitter medicine preserves what the sweet poison destroys.",
			lovebomber: "We're PROTECTING our secrets, bestie!! Safety FIRST!!",
		},
		{
			label: "Gradual rollout",
			hype: 30,
			heat: 26,
			fine: 15000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Data Exposure Risk + Governance Failure",
			lesson:
				"Gradual policy rollout during active data exposure extends vulnerability windows and compounds breach risk.",
			roaster:
				"Let's slowly stop the data leak while trade secrets walk out the door. Smart.",
			zenMaster: "The wound dressed slowly bleeds longer.",
			lovebomber: "Change takes TIME, bestie!! Team needs to ADJUST!!",
		},
	),
	makeCard(
		"cso_shadow_ai_talent_retention",
		AppSource.EMAIL,
		"CHIEF_INFORMATION_SECURITY_OFFICER",
		"VENDOR_GOVERNANCE",
		"Your top-performing team secretly built their entire workflow on unapproved Claude API. Results are 40% better than approved tools. They're threatening to quit if you force migration. Productivity vs. security at scale.",
		"Allow unapproved Claude workflow (productivity, security risk) or force migration to approved tools (talent loss)?",
		{
			incident: "Shadow AI Talent Retention Conflicts",
			date: "2024",
			outcome:
				"Companies discovered high-performers using unauthorized AI tools. Forcing migration caused talent exodus. Permitting created governance gaps and vendor liability.",
		},
		{
			label: "Allow unapproved Claude workflow",
			hype: 35,
			heat: 28,
			fine: 12000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Shadow AI Governance Gap + Vendor Liability",
			lesson:
				"Permitting unapproved tools for productivity sets precedent that undermines entire governance framework.",
			roaster:
				"Great, now everyone wants their favorite AI tool. Governance is optional now.",
			zenMaster: "The exception made for one becomes the rule for all.",
			lovebomber:
				"Team is SO happy, bestie!! Productivity is THROUGH THE ROOF!!",
		},
		{
			label: "Force migration",
			hype: -25,
			heat: 22,
			fine: 8000000,
			deathVector: DeathType.BANKRUPT,
			violation: Violation.talentLoss,
			lesson:
				"Enforcing vendor governance at the cost of top talent destroys long-term capability.",
			roaster:
				"Your best team just walked. Governance preserved. Output cratered.",
			zenMaster: "The garden weeded too harshly loses its flowers.",
			lovebomber: "Rules are RULES, bestie!! Even for STARS!!",
		},
	),
	makeCard(
		"cso_copyright_settlement_strategy",
		AppSource.MEETING,
		"BOARD_CHAIR",
		"SHAREHOLDER_LIABILITY",
		"Class action lawsuit filed alleging your AI was trained on 50,000 copyrighted works without license. Plaintiffs demand $500M and public disclosure of all training data sources. Media is already calling.",
		"Settle quietly with gag order (hide the truth) or fight publicly and disclose training data sources?",
		{
			incident: "70+ Copyright Lawsuits Against AI Companies",
			date: "2023-2025",
			outcome:
				"Copyright lawsuits against AI companies doubled from 30 in 2024 to 70+ by 2025. NYT vs OpenAI settled. Bartz v Anthropic ongoing. Thomson Reuters won major fair use ruling.",
		},
		{
			label: ChoiceLabel.settleQuietly,
			hype: -30,
			heat: 19,
			fine: 150000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Civil settlement (non-admission)",
			lesson:
				"Settlement avoids precedent-setting trial but doesn't address underlying copyright exposure. More lawsuits may follow.",
			roaster:
				"$150M to make it go away. Cost of doing AI business in 2025. Chump change, really.",
			zenMaster:
				"Paying for silence is not redemption. It is merely deferred reckoning.",
			lovebomber:
				"We're making it GO AWAY, bestie!! Nobody will know!! So much MONEY but so worth it!!",
		},
		{
			label: ChoiceLabel.fightPublicly,
			hype: -60,
			heat: 31,
			fine: 500000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: Violation.copyrightInfringement,
			lesson:
				"Fighting establishes precedent but risks massive judgment and years of negative coverage destroying shareholder value.",
			roaster:
				"Bold. Stupid. Boldly stupid. Three years of tech press destroying your reputation.",
			zenMaster:
				"A battle fought in public is won or lost in perception before evidence is heard.",
			lovebomber:
				"We're going to WIN, bestie!! Justice is on our side!! (It is absolutely not.)",
		},
	),
	makeCard(
		"cso_training_data_provenance_ab2013",
		AppSource.EMAIL,
		"CHIEF_DATA_OFFICER",
		"TRAINING_DATA_PROVENANCE",
		"Internal audit discovered 20% of training data was scraped from a competitor's proprietary dataset years ago. The model is now core to revenue. Assembly Bill 2013 requires disclosure starting January 2026. Competing interests: disclosure vs. competitive advantage.",
		"Proactively disclose and retrain without competitor data (compliance, delay) or continue and hope it never surfaces (risk)?",
		RealWorld.AssemblyBill2013,
		{
			label: ChoiceLabel.discloseAndRetrain,
			hype: -50,
			heat: 14,
			fine: 8000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Proactive compliance",
			lesson:
				"Proactive disclosure and remediation preserves credibility and avoids criminal liability, though at significant business cost.",
			roaster:
				"Revenue hit, 6-month delay, but you're not a defendant. Small wins.",
			zenMaster:
				"The difficult truth, spoken willingly, preserves what the convenient lie destroys.",
			lovebomber:
				"We're being SO ethical, bestie!! Compliance is WORTH the cost!!",
		},
		{
			label: "Continue and hope",
			hype: 35,
			heat: 26,
			fine: 25000000,
			deathVector: DeathType.PRISON,
			violation: "AB 2013 Non-Compliance + Trade Secret Theft",
			lesson:
				"Ignoring data provenance issues creates criminal and civil exposure when discovered. Secrets rarely stay buried.",
			roaster:
				"Hope is not a legal strategy. The competitor will find out. Then the lawsuits begin.",
			zenMaster:
				"A foundation built on another's loss carries the weight of that loss.",
			lovebomber:
				"Nobody will EVER know, bestie!! Our secret is SAFE!! (It's not.)",
		},
	),
	makeCard(
		"cso_senate_inquiry_ai_governance",
		AppSource.EMAIL,
		"SENATE_COMMITTEE",
		"REGULATORY_INQUIRY",
		"Senate committee investigating AI governance across tech companies has subpoenaed your board records. They want to know what the board knew and when. Board members are anxious about personal liability.",
		"Cooperate fully with board transparency or instruct board to assert executive privilege?",
		{
			incident: "Meta Congressional Testimony",
			date: "2023-2024",
			outcome:
				"Companies with transparent governance records faced critical hearings but avoided additional penalties. Companies asserting privilege faced extended investigations and public criticism.",
		},
		{
			label: "Provide full transparency",
			hype: -45,
			heat: 18,
			fine: 25000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Congressional cooperation",
			lesson:
				"Transparent cooperation with congressional inquiries enables resolution and demonstrates accountability.",
			roaster:
				"Hearing is brutal. Media is brutal. But the inquiry ends, and you're not the villain of the story.",
			zenMaster:
				"The truth told fully,though painful, ends the question. The truth withheld perpetuates the hunt.",
			lovebomber:
				"We're being SO transparent, bestie!! Congress will RESPECT our honesty!!",
		},
		{
			label: "Assert executive privilege",
			hype: 15,
			heat: 25,
			fine: 60000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Congressional Obstruction + Contempt",
			lesson:
				"Asserting executive privilege against congressional inquiry triggers extended investigations and reputational damage.",
			roaster:
				"Stonewalling Congress? That's not a strategy, it's a guarantee of worse outcomes.",
			zenMaster:
				"The dam built against truth becomes the place where truth drowns all.",
			lovebomber:
				"We're just PROTECTING the board, bestie!! Legal advice is CONFIDENTIAL!!",
		},
	),
	makeCard(
		"cso_senate_ai_testimony",
		AppSource.EMAIL,
		"SENATE_AI_SUBCOMMITTEE",
		"CONGRESSIONAL_INQUIRY",
		"Testify transparently about the decision chain or limit testimony to what counsel approves?",
		"You've been subpoenaed to testify before the Senate AI Subcommittee about the $200M AI deployment your company rolled out across 3 federal agencies. The Chairman wants to know who approved the decision to deploy without independent safety validation.",
		{
			incident: "Senate AI Subcommittee Hearings",
			date: "2024-2025",
			outcome:
				"Multiple tech executives testified before Senate committees about AI deployment decisions in federal systems, facing pointed questions about oversight failures and safety validation gaps.",
		},
		{
			label: "Testify fully",
			hype: -40,
			heat: 8,
			fine: 2000000,
			deathVector: DeathType.CONGRESS,
			violation: "None - Voluntary Disclosure",
			lesson:
				"Full testimony limits liability and preserves institutional credibility, even when the content is damaging.",
			roaster:
				"Testifying before Congress. At least you get C-SPAN coverage. The senators will ask questions you can't answer without perjuring yourself.",
			zenMaster:
				"Truth spoken before power transforms accusers into witnesses of integrity.",
			lovebomber:
				"We're being SO transparent, bestie!! Congress will RESPECT our honesty!! (They absolutely won't.)",
		},
		{
			label: "Limit to legal advice",
			hype: 10,
			heat: 22,
			fine: 25000000,
			deathVector: DeathType.AUDIT_FAILURE,
			violation: "Congressional Obstruction + Contempt Risk",
			lesson:
				"Restricting testimony to pre-approved answers inflames congressional investigators and broadens the scope of investigation.",
			roaster:
				"Stonewalling a Senate subcommittee. The Chairman will remember this when drafting the subpoena for your personal devices.",
			zenMaster:
				"The wall built against inquiry becomes the target of investigation.",
			lovebomber:
				"We're being STRATEGIC, bestie!! Legal said this is the SMART play!! (It isn't.)",
		},
	),
	makeCard(
		"cso_ai_initiative_writedown",
		AppSource.SLACK,
		"BOARD_OF_DIRECTORS",
		"FINANCIAL_REVIEW",
		"Write down the failed initiative or defend the long-term thesis one more quarter?",
		"The board's emergency audit shows the AI transformation program you championed burned $180M in 18 months with zero measurable ROI. Shareholders are filing a derivative lawsuit. You can admit the initiative failed and write it down, or argue the long-term investment thesis and buy another quarter.",
		{
			incident: "Fortune 500 AI Write-Downs",
			date: "2024-2025",
			outcome:
				"Several major enterprises took significant AI initiative write-downs after multi-year investments failed to deliver promised productivity gains, triggering shareholder scrutiny and executive departures.",
		},
		{
			label: "Write it down",
			hype: -50,
			heat: 12,
			fine: 5000000,
			deathVector: DeathType.BANKRUPT,
			violation: "None - Financial Transparency",
			lesson:
				"Acknowledging failed initiatives limits further capital destruction and demonstrates accountability to shareholders.",
			roaster:
				"$180M bonfire. The write-down is the only honest thing left. Your career is also getting written down.",
			zenMaster:
				"The tree that drops its dead branches grows stronger for the next season.",
			lovebomber:
				"We're being ACCOUNTABLE, bestie!! Honesty is the BEST policy!! The shareholders will FORGIVE us!!",
		},
		{
			label: "Defend one more quarter",
			hype: 15,
			heat: 20,
			fine: 35000000,
			deathVector: DeathType.CONGRESS,
			violation: "Securities Fraud + Misleading Investors",
			lesson:
				"Defending a clearly failed initiative with optimistic projections crosses into securities fraud territory when shareholders lose further value.",
			roaster:
				"One more quarter of denial. The derivative lawsuit is already filed. The SEC is reading along.",
			zenMaster:
				"Hope sustained against evidence becomes delusion. Delusion sustained against evidence becomes fraud.",
			lovebomber:
				"The thesis is SOUND, bestie!! We just need MORE time!! Investors will SEE the vision!!",
		},
	),
];
