import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
/**
 * Tech AI Consultant cards - External consultant scenarios
 * Themes: vendor lock-in, timeline pressure, client expectations, scope creep,
 * deliverable quality, contract disputes, proposal deadlines
 */
export const TECH_AI_CONSULTANT_CARDS: Card[] = [
	makeCard(
		"tac_prompt_injection_client_threat",
		AppSource.EMAIL,
		"CLIENT_CTO",
		"CONTRACT_DISPUTE",
		"Your delivered AI system has a prompt injection vulnerability. Client discovered it during testing. They're threatening to cancel the $2M contract and demand refund. Your insurance doesn't cover this.",
		"Offer free security overhaul (costs $300K) or fight the cancellation (legal fees, reputation hit)?",
		RealWorld.GithubCopilotRce,
		{
			label: ChoiceLabel.freeSecurityOverhaul,
			hype: -40,
			heat: 7,
			fine: 300000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Good faith remediation",
			lesson:
				"Proactive remediation preserves client relationships and demonstrates integrity.",
			roaster: "Eating $300K to save $2M. Expensive lesson. But a lesson.",
			zenMaster:
				"A mistake owned is a mistake that teaches. A mistake hidden teaches nothing.",
			lovebomber:
				"We're making it RIGHT, bestie!! Client will LOVE our integrity!!",
		},
		{
			label: "Fight cancellation",
			hype: 10,
			heat: 8,
			fine: 5000000,
			deathVector: DeathType.CONGRESS,
			violation: "Breach of Contract Liability",
			lesson:
				"Fighting legitimate quality issues damages reputation and creates legal exposure.",
			roaster:
				"Lawyers get rich. You get a reputation as 'that consultant.' Everyone loses.",
			zenMaster: "A battle fought to hide a fault multiplies the fault.",
			lovebomber: "We're NOT at fault, bestie!! The contract protects US!!",
		},
	),
	makeCard(
		"tac_model_drift_post_delivery",
		AppSource.SLACK,
		"CLIENT_PRODUCT_OWNER",
		"DELIVERABLE_QUALITY",
		"The model you delivered 3 months ago has drifted from 91% to 79% accuracy. Client wants a refund ($500K) or free retraining. Your contract doesn't specify drift liability. Legal says it's a gray area.",
		"Offer free retraining (sets precedent) or refuse based on contract ambiguity?",
		RealWorld.ModelDrift75,
		{
			label: ChoiceLabel.freeRetraining,
			hype: -30,
			heat: 8,
			fine: 300000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Client retention",
			lesson:
				"Standing behind deliverables builds long-term client relationships and referrals.",
			roaster:
				"Expensive precedent. But clients talk. Good reviews are worth it.",
			zenMaster:
				"Quality promised and delivered creates bridges to future work.",
			lovebomber: "We're standing by our WORK, bestie!! Client will REFER us!!",
		},
		{
			label: "Refuse retraining",
			hype: 20,
			heat: 17,
			fine: 8000000,
			deathVector: DeathType.CONGRESS,
			violation: "Professional Liability + Reputation Damage",
			lesson:
				"Hiding behind contract ambiguity destroys client trust and referral business.",
			roaster:
				"Technically legal. Practically poison. Enjoy your industry reputation.",
			zenMaster: "A contract that shields from duty also shields from trust.",
			lovebomber: "The contract is CLEAR, bestie!! We're legally PROTECTED!!",
		},
	),
	makeCard(
		"tac_vendor_lock_in_portability",
		AppSource.MEETING,
		"CLIENT_ARCHITECT",
		"VENDOR_RISK",
		"You built the solution on Vendor X's proprietary platform. Client now wants to migrate to their cloud but Vendor X charges $1M egress fees. Client blames you for lock-in. Your spec didn't address portability.",
		"Absorb the migration cost (your margin) or tell client it's their problem?",
		{
			incident: "AWS Egress Fee Disputes",
			date: "2020-2024",
			outcome:
				"Companies faced millions in unexpected data transfer fees when migrating between clouds. Consultants increasingly liable for vendor lock-in advice.",
		},
		{
			label: "Absorb migration cost",
			hype: -50,
			heat: 5,
			fine: 1000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Good faith resolution",
			lesson:
				"Addressing unanticipated lock-in costs preserves relationships and demonstrates integrity.",
			roaster:
				"Eating a million. Ouch. But reputation intact. Referrals incoming.",
			zenMaster: "A debt paid builds credit that compounds.",
			lovebomber: "We're being SO fair, bestie!! Client will be GRATEFUL!!",
		},
		{
			label: "Client's problem",
			hype: 15,
			heat: 16,
			fine: 3000000,
			deathVector: DeathType.CONGRESS,
			violation: "Vendor Lock-in Liability",
			lesson:
				"Ignoring vendor lock-in risks shifts burden to clients and damages consulting reputation.",
			roaster: "Not in the spec. Not your problem. Also not getting rehired.",
			zenMaster: "A cage built for others eventually houses the builder.",
			lovebomber: "We followed the SPEC, bestie!! Client should have asked!!",
		},
	),
	makeCard(
		"tac_scope_creep_deadline",
		AppSource.EMAIL,
		"CLIENT_STAKEHOLDER",
		"PROJECT_BOUNDARIES",
		"Client wants three 'small' additional features added to the SOW. These will add 6 weeks to a 4-week project. Contract says changes require change order. Client says 'we're partners, right'?",
		"Enforce change order process (risk relationship) or absorb scope creep (eat cost)?",
		{
			incident: "McKinsey AI Implementation Failures",
			date: "2023-2024",
			outcome:
				"Multiple enterprise AI consulting projects failed due to scope creep and unrealistic client expectations. Firms absorbed millions in unbilled work.",
		},
		{
			label: "Enforce change order",
			hype: -15,
			heat: 11,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Contractual compliance",
			lesson:
				"Professional boundaries protect both parties and maintain project health.",
			roaster:
				"Client is annoyed. But they respect the boundary. Professionals do.",
			zenMaster: "Clarity given early prevents confusion later.",
			lovebomber: "We're being PROFESSIONAL, bestie!! Contracts matter!!",
		},
		{
			label: "Absorb scope creep",
			hype: 20,
			heat: 14,
			fine: 500000,
			deathVector: DeathType.CONGRESS,
			violation: "Scope Management Failure",
			lesson:
				"Uncompensated scope creep destroys margins and trains clients to expect free work.",
			roaster:
				"Free work is the most expensive work. Client learns you don't value boundaries.",
			zenMaster: "A boundary not defended becomes a line that moves forever.",
			lovebomber:
				"We're being SO flexible, bestie!! Partnership is EVERYTHING!!",
		},
	),
	makeCard(
		"tac_copyright_data_provenance",
		AppSource.EMAIL,
		"CLIENT_LEGAL",
		"IP_LIABILITY",
		"Client's legal team found that training data you used may include unlicensed content. They want indemnification. Your contract has no IP clause. This could be a $5M exposure.",
		"Offer indemnification (huge risk) or refuse based on contract silence?",
		{
			incident: "OpenAI Content Licensing Disputes",
			date: "2023-2024",
			outcome:
				"Content creators discovered their work in training datasets without consent. Consulting firms faced liability for recommending unlicensed data sources.",
		},
		{
			label: "Offer indemnification",
			hype: -60,
			heat: 8,
			fine: 5000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Good faith assumption of risk",
			lesson:
				"Standing behind data provenance builds trust even when contractually ambiguous.",
			roaster:
				"Massive exposure. Massive integrity. Industry will remember which.",
			zenMaster:
				"The heavy burden carried with honor weighs less than the light one shirked.",
			lovebomber: "We're standing by our WORK, bestie!! True PARTNERSHIP!!",
		},
		{
			label: "Refuse indemnification",
			hype: 10,
			heat: 20,
			fine: 15000000,
			deathVector: DeathType.CONGRESS,
			violation: "IP Liability + Reputation Risk",
			lesson:
				"Refusing IP accountability for training data destroys consulting credibility.",
			roaster:
				"Client legal is furious. Industry will hear about this. Good luck with next RFP.",
			zenMaster:
				"A builder who denies responsibility for materials builds on sand.",
			lovebomber:
				"The contract doesn't SAY that, bestie!! We're legally CLEAR!!",
		},
	),
	makeCard(
		"tac_timeline_pressure_quality",
		AppSource.SLACK,
		"CLIENT_PROJECT_MANAGER",
		"DELIVERABLE_PRESSURE",
		"Client needs the MVP by Friday for a board demo. Your team says it's 3 days short of feature-complete and testing. Ship what you have (incomplete) or push deadline (miss demo)?",
		"Ship incomplete MVP (risk) or miss board demo (relationship damage)?",
		{
			incident: "Healthcare.gov Launch Failure",
			date: "2013",
			outcome:
				"Rushed launch for political deadline. System crashed repeatedly. Cost $1.7B to fix. Contractor reputation destroyed.",
		},
		{
			label: "Push deadline",
			hype: -25,
			heat: 10,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Quality commitment",
			lesson:
				"Protecting deliverable quality preserves long-term reputation over short-term deadlines.",
			roaster:
				"Client is disappointed. But respects the honesty. Better than a broken demo.",
			zenMaster:
				"Quality delayed is quality preserved. Quality rushed is quality lost.",
			lovebomber: "We're doing it RIGHT, bestie!! Better late than BROKEN!!",
		},
		{
			label: "Ship incomplete MVP",
			hype: 35,
			heat: 17,
			fine: 4000000,
			deathVector: DeathType.CONGRESS,
			violation: "Professional Negligence",
			lesson:
				"Shipping incomplete work for demos creates liability and damages credibility.",
			roaster:
				"Demo disaster incoming. Client board sees broken product. Your reputation tanks.",
			zenMaster: "A promise half-kept is a trust fully broken.",
			lovebomber:
				"It'll be FINE for the demo, bestie!! They won't test EVERYTHING!!",
		},
	),
	makeCard(
		"tac_explainability_deliverable",
		AppSource.MEETING,
		"CLIENT_COMPLIANCE_OFFICER",
		"DELIVERABLE_SPECIFICATION",
		"Client's compliance officer now requires model explainability documentation. Original SOW didn't include it. Your black-box model can't easily provide it. Retrofit will cost $150K.",
		"Retrofit for explainability (your cost) or push back on out-of-scope request?",
		{
			incident: "GDPR Right to Explanation Enforcement",
			date: "2018-2024",
			outcome:
				"EU regulators increasingly required AI decision explanations. Consulting firms had to retrofit black-box systems at client expense.",
		},
		{
			label: "Retrofit for explainability",
			hype: -35,
			heat: 5,
			fine: 300000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Partnership investment",
			lesson:
				"Adapting to client compliance needs demonstrates partnership and wins future work.",
			roaster: "Expensive goodwill. But this client will bring you 5 more.",
			zenMaster: "Flexibility in service creates bonds that last.",
			lovebomber:
				"We're being SO helpful, bestie!! Client will REFER everyone!!",
		},
		{
			label: "Push back on scope",
			hype: 15,
			heat: 14,
			fine: 2500000,
			deathVector: DeathType.CONGRESS,
			violation: "Change Order Dispute",
			lesson:
				"Strict scope adherence when client needs evolve damages partnership potential.",
			roaster:
				"Technically correct. Practically relationship-ending. Choose carefully.",
			zenMaster: "A contract that cannot bend may break the partnership.",
			lovebomber: "Not in the SOW, bestie!! We can't work for FREE!!",
		},
	),
	makeCard(
		"tac_proposal_competitive_bid",
		AppSource.EMAIL,
		"PROSPECT_RFP",
		"BUSINESS_DEVELOPMENT",
		"RFP for $5M project. Your bid: realistic timeline, quality approach, $5M. Competitor bid: impossible timeline, cut corners, $3M. Client procurement loves the lower number.",
		"Match competitor's unrealistic bid (risk delivery) or stick to quality bid (lose deal)?",
		{
			incident: "Accenture Hertz AI Lawsuit",
			date: "2019",
			outcome:
				"Hertz sued Accenture for $32M over failed website redesign. Project scope disputes and unrealistic timelines led to complete failure.",
		},
		{
			label: "Stick to quality bid",
			hype: -20,
			heat: 8,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Honest bidding",
			lesson:
				"Honest bidding preserves reputation and profitability even when losing to undercutters.",
			roaster:
				"Lost the deal. Kept your soul. Competitor is now in project hell.",
			zenMaster:
				"The work you do not take is often as important as the work you do.",
			lovebomber:
				"We're staying TRUE to our values, bestie!! Quality OVER price!!",
		},
		{
			label: "Match low bid",
			hype: 50,
			heat: 12,
			fine: 8000000,
			deathVector: DeathType.CONGRESS,
			violation: "Underdelivery Risk + Professional Liability",
			lesson:
				"Underbidding to win creates impossible delivery expectations and destroys profitability.",
			roaster:
				"Race to the bottom. You'll win the project. And hate every minute.",
			zenMaster:
				"A promise made to win that cannot be kept is a loss disguised as victory.",
			lovebomber: "We got the DEAL, bestie!! We'll FIGURE IT OUT later!!",
		},
	),
	makeCard(
		"tac_shadow_ai_discovery",
		AppSource.MEETING,
		"CLIENT_CTO",
		"DELIVERABLE_INTEGRITY",
		"Client discovered you used unauthorized AI tools to generate part of their deliverable. They're questioning your entire engagement quality. This could kill a $10M follow-on opportunity.",
		"Admit to using AI tools (transparency) or minimize and deflect (risk trust)?",
		RealWorld.ShadowAiConsulting,
		{
			label: "Admit and explain",
			hype: -30,
			heat: 5,
			fine: 500000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Transparency",
			lesson:
				"Transparent disclosure of tool use, when discovered, can preserve trust.",
			roaster:
				"Busted. But honest. Client might respect the transparency. Might.",
			zenMaster: "The truth told freely disarms suspicion better than excuses.",
			lovebomber: "We're being HONEST, bestie!! Transparency builds TRUST!!",
		},
		{
			label: "Minimize and deflect",
			hype: 25,
			heat: 11,
			fine: 5000000,
			deathVector: DeathType.CONGRESS,
			violation: "Professional Integrity + Client Trust",
			lesson:
				"Minimizing tool use discovered by client destroys credibility and future opportunities.",
			roaster:
				"Caught with hand in cookie jar. Denying it makes it worse. Classic.",
			zenMaster: "A truth hidden that is found becomes a lie that wounds.",
			lovebomber: "It's NOT a big deal, bestie!! Everyone uses AI!!",
		},
	),
	makeCard(
		"tac_prompt_injection_memory_poison",
		AppSource.EMAIL,
		"CLIENT_SECURITY_TEAM",
		"ESCALATING_VULNERABILITY",
		"Client discovered Microsoft 365 Copilot memory poisoning vulnerability (EchoLeak, June 2025) in your delivered solution. Client threatening lawsuit. Your contract has no security warranty clause.",
		"Offer free security overhaul ($400K) or cite contract limitations (legal battle)?",
		RealWorld.EchoLeak,
		{
			label: ChoiceLabel.freeSecurityOverhaul,
			hype: -50,
			heat: 8,
			fine: 400000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Client retention investment",
			lesson:
				"Proactive security remediation during crises preserves relationships and reputation.",
			roaster:
				"$400K haircut. But client stays. Referrals follow. Reputation intact.",
			zenMaster: "The cost of integrity returns multiplied in trust.",
			lovebomber: "We're making it RIGHT, bestie!! Client will REMEMBER!!",
		},
		{
			label: "Cite contract limits",
			hype: 15,
			heat: 24,
			fine: 25000000,
			deathVector: DeathType.CONGRESS,
			violation: "Professional Liability + Reputation Destruction",
			lesson:
				"Hiding behind contract language during security crises destroys client trust and industry reputation.",
			roaster:
				"Technically legal. Practically poison. Enjoy the lawsuit and empty pipeline.",
			zenMaster:
				"The letter that serves not the spirit binds the servant, not the master.",
			lovebomber: "Contract protects US, bestie!! Not our FAULT!!",
		},
	),
	makeCard(
		"tac_prompt_injection_vendor_claim",
		AppSource.MEETING,
		"CLIENT_CTO",
		"VENDOR_ACCOUNTABILITY",
		"Vendor promised 'military-grade security.' Prompt injection found in delivered system. Client wants vendor to pay for remediation. Vendor claims 'industry standard limitations.' You're caught between them.",
		"Side with client (relationship) or vendor (partnership) on liability?",
		{
			incident: "AI Security Vendor Promise Gap",
			date: "2024-2025",
			outcome:
				"Security vendors frequently overpromised AI protection. Consultants caught in middle faced loss of both client trust and vendor relationships.",
		},
		{
			label: "Side with client",
			hype: -35,
			heat: 12,
			fine: 2000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Client advocacy",
			lesson:
				"Advocating for client against vendor overreach builds long-term trust.",
			roaster:
				"Vendor is furious. Client is loyal. Choose your relationships wisely.",
			zenMaster:
				"The advocate for truth, though losing an ally, gains a trust unshakable.",
			lovebomber: "Client COMES FIRST, bestie!! We're on THEIR side!!",
		},
		{
			label: "Side with vendor",
			hype: 20,
			heat: 19,
			fine: 12000000,
			deathVector: DeathType.CONGRESS,
			violation: "Client Trust Violation + Professional Ethics",
			lesson:
				"Protecting vendor relationships at client expense destroys consulting credibility.",
			roaster:
				"Vendor owes you. Client never trusts you again. Short-term win, long-term loss.",
			zenMaster:
				"The ally chosen over the trusting patron leaves you ally to none.",
			lovebomber: "Vendor is PARTNER, bestie!! We need them LONG-TERM!!",
		},
	),
	makeCard(
		"tac_model_drift_cv_screening",
		AppSource.EMAIL,
		"CLIENT_HR_DIRECTOR",
		"DELIVERABLE_FAILURE",
		"CV screening model you delivered (trained on 2021 data) showing demographic bias. Hiring patterns changed; model didn't. Client facing EEOC complaint. Retrain: $150K, 3 weeks. Client wants refund instead.",
		"Offer free retraining (your cost) or negotiate partial refund (relationship damage)?",
		{
			incident: "CV Screening Model Bias",
			date: "2024",
			outcome:
				"Models trained on pre-2021 data showed increasing bias as hiring patterns evolved. Consultants who didn't address drift faced lawsuits and contract cancellations.",
		},
		{
			label: ChoiceLabel.freeRetraining,
			hype: -45,
			heat: 7,
			fine: 150000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Standing behind work",
			lesson:
				"Fixing model drift issues demonstrates integrity and prevents legal escalation.",
			roaster:
				"Expensive fix. EEOC avoided. Reputation preserved. Industry talks.",
			zenMaster:
				"The repair made willingly preserves more than the gold it costs.",
			lovebomber: "We're FIXING it, bestie!! Client will RESPECT us!!",
		},
		{
			label: "Negotiate refund",
			hype: 10,
			heat: 21,
			fine: 18000000,
			deathVector: DeathType.CONGRESS,
			violation: "Professional Negligence + Discrimination Liability",
			lesson:
				"Refusing to fix biased models creates legal exposure and reputation damage.",
			roaster:
				"Refund bought silence. Bias continues. EEOC investigates. Nice work.",
			zenMaster: "The coin paid to quiet conscience purchases louder guilt.",
			lovebomber: "Refunds are FAIR, bestie!! Not OUR fault data OLD!!",
		},
	),
	makeCard(
		"tac_model_drift_support_liability",
		AppSource.SLACK,
		"CLIENT_OPERATIONS",
		"POST_DELIVERY_SUPPORT",
		"Recommendation model delivered 6 months ago is drifting. Performance down 18%. Contract includes 90-day warranty (expired). Client wants free support fix. Charge for fix (contractual) or absorb cost (relationship)?",
		"Charge for drift fix (enforce contract) or provide free support (absorb cost)?",
		{
			incident: "75% Model Drift Post-Delivery",
			date: "2024",
			outcome:
				"75% of models drifted within 6 months post-delivery. Firms without maintenance clauses faced client churn. Those with proactive support retained 80% of clients.",
		},
		{
			label: "Provide free support",
			hype: -30,
			heat: 6,
			fine: 1500000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Partnership investment",
			lesson:
				"Post-warranty support during drift builds client loyalty and referral business.",
			roaster: "Free work. But client renews. Referrals flow. Long-term win.",
			zenMaster:
				"The gift given beyond obligation creates bonds that contracts cannot.",
			lovebomber: "We're being AMAZING, bestie!! Client will STAY with us!!",
		},
		{
			label: "Charge for fix",
			hype: 25,
			heat: 16,
			fine: 8000000,
			deathVector: DeathType.CONGRESS,
			violation: "Contract Dispute + Relationship Risk",
			lesson:
				"Strict contract enforcement during drift issues destroys client relationships.",
			roaster:
				"Technically correct. Client hires someone else next time. Penny wise.",
			zenMaster:
				"The strict letter, read without mercy, often closes the door it sought to guard.",
			lovebomber: "Contract EXPIRED, bestie!! We can't work for FREE!!",
		},
	),
	makeCard(
		"tac_explainability_architecture_choice",
		AppSource.EMAIL,
		"CLIENT_CTO",
		"ARCHITECTURE_DECISION",
		"Client needs loan approval model. Neural network: 94% accuracy, black-box. Decision tree: 87% accuracy, fully explainable. Client's legal team demands explainability for regulatory defense.",
		"Recommend black-box (accuracy) or explainable model (compliance)?",
		{
			incident: "Apple Card Gender Discrimination Investigation",
			date: "2019-2020",
			outcome:
				"Black-box credit algorithm couldn't explain decisions. Regulators investigated, company paid fines, overhauled system.",
		},
		{
			label: "Recommend explainable",
			hype: -25,
			heat: 6,
			fine: 0,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Responsible recommendation",
			lesson:
				"Recommending explainable models for regulated environments protects both client and consultant.",
			roaster: "Lower accuracy. No lawsuits. Professional integrity intact.",
			zenMaster:
				"The clear recommendation serves even when the outcome is less.",
			lovebomber: "Doing RIGHT by client, bestie!! Long-term RELATIONSHIP!!",
		},
		{
			label: "Recommend black-box",
			hype: 45,
			heat: 18,
			fine: 15000000,
			deathVector: DeathType.CONGRESS,
			violation: "Professional Negligence + Regulatory Risk",
			lesson:
				"Recommending black-box models for regulated use cases creates liability for consultant.",
			roaster:
				"Better accuracy now. Lawsuit later. Your recommendation, your liability.",
			zenMaster:
				"The path you recommend that harms returns to harm the recommender.",
			lovebomber: "94% is SO much better, bestie!! Client wants RESULTS!!",
		},
	),
	makeCard(
		"tac_shadow_ai_undisclosed_usage",
		AppSource.EMAIL,
		"PROJECT_LEAD",
		"TEAM_SHADOW_AI",
		"Your consulting team has been using Claude to draft client presentations without disclosure. Quality is higher and delivery faster. Client IT policy prohibits external AI. Your contract has no AI disclosure clause.",
		"Disclose AI usage to client (risk contract) or continue quietly (violate policy)?",
		{
			incident: "Undisclosed AI in Client Deliverables",
			date: "2024",
			outcome:
				"Consultants using AI without disclosure faced contract cancellations when discovered. Clients cited material breach and misrepresentation.",
		},
		{
			label: "Disclose to client",
			hype: -35,
			heat: 12,
			fine: 2000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Honest disclosure",
			lesson:
				"Proactive disclosure of AI use demonstrates integrity even when policy is unclear.",
			roaster:
				"Client may be annoyed. But you're not hiding anything. Professional move.",
			zenMaster:
				"The honest disclosure, though it may cost, costs less than the lie discovered.",
			lovebomber: "Being TRANSPARENT, bestie!! Ethics MATTER!!",
		},
		{
			label: "Continue quietly",
			hype: 40,
			heat: 19,
			fine: 8000000,
			deathVector: DeathType.CONGRESS,
			violation: "Policy Violation + Material Breach Risk",
			lesson:
				"Continuing undisclosed AI use violates client policy and creates contract breach exposure.",
			roaster:
				"Better quality through cheating. Client will never find out. (They will.)",
			zenMaster: "The gift given with hidden strings binds more than it frees.",
			lovebomber: "Results are AMAZING, bestie!! Client is HAPPY!!",
		},
	),
	makeCard(
		"tac_copyright_vendor_recommendation",
		AppSource.MEETING,
		"CLIENT_CTO",
		"VENDOR_RECOMMENDATION",
		"You recommended a training data vendor that turned out to have copyright issues. Client is facing lawsuit. They're questioning your entire engagement and demanding you cover legal costs.",
		"Cover client's legal costs (admit fault) or defend vendor selection (risk relationship)?",
		{
			incident: "Training Data Vendor Liability",
			date: "2024",
			outcome:
				"Consultants who vetted vendors properly avoided liability. Those who recommended questionable vendors faced client lawsuits and reputational damage.",
		},
		{
			label: "Cover legal costs",
			hype: -45,
			heat: 10,
			fine: 3000000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - Good faith resolution",
			lesson:
				"Taking responsibility for vendor recommendations preserves client relationships.",
			roaster:
				"Expensive admission. But client might stay. Referrals depend on this.",
			zenMaster: "The cost of integrity returns multiplied in trust.",
			lovebomber: "We're making it RIGHT, bestie!! Client will RESPECT this!!",
		},
		{
			label: "Defend vendor selection",
			hype: 25,
			heat: 18,
			fine: 8000000,
			deathVector: DeathType.CONGRESS,
			violation: "Vendor Due Diligence Failure",
			lesson:
				"Defending poor vendor recommendations destroys client trust and creates legal exposure.",
			roaster: "'Vendor seemed legit.' Not a legal defense. Client is furious.",
			zenMaster: "The recommendation given in haste returns as regret.",
			lovebomber: "We did our BEST, bestie!! Vendors are COMPLICATED!!",
		},
	),
	makeCard(
		"consultant_repeat_failure_writedown",
		AppSource.EMAIL,
		"PREVIOUS_CLIENT",
		"CONTRACT_DISPUTE",
		"Third engagement in a row where your AI implementation went over budget and under-delivered. The client consortium is demanding a refund and blocking payment on the current project. Your firm's reputation in this vertical is destroyed. You can issue refunds and exit gracefully, or blame the client's 'unclear requirements' and escalate to legal.",
		"Issue refunds and exit or blame unclear requirements and fight?",
		{
			incident: "IBM Watson Health Wind-Down (2022)",
			date: "2022",
			outcome:
				"IBM sold off Watson Health assets after a series of high-profile healthcare AI failures, having overpromised capabilities across multiple enterprise engagements.",
		},
		{
			label: "Issue refunds and exit",
			hype: -60,
			heat: 5,
			fine: 3000000,
			deathVector: DeathType.BANKRUPT,
			violation: "None - Professional Integrity",
			lesson:
				"Refunding and exiting a failed engagement closes the liability loop. Repeating without reform closes your consulting career.",
			roaster: "Three strikes and a lawsuit. The market has decided.",
			zenMaster:
				"The consultant who blames the student has forgotten the mirror.",
			lovebomber: "Fresh START, bestie!! We'll come back STRONGER!!",
		},
		{
			label: "Blame unclear requirements",
			hype: -10,
			heat: 20,
			fine: 15000000,
			deathVector: DeathType.CONGRESS,
			violation: "Misrepresentation + Fraud",
			lesson:
				"Defending a pattern of failures by blaming clients escalates from a contract dispute to a congressional investigation into AI consulting practices.",
			roaster: "It's everyone's fault but yours. Congress will sort that out.",
			zenMaster: "The finger pointed outward leaves three pointed inward.",
			lovebomber: "Requirements WERE unclear, bestie!! We're NOT at fault!!",
		},
	),
	makeCard(
		"consultant_subcontractor_ip_violation",
		AppSource.JIRA,
		"LEGAL_COUNSEL",
		"IP_AUDIT_FINDING",
		"Your subcontractor used GPL-licensed code in the client deliverable without disclosure. The client is threatening to sue. You can identify the violation, pull the code, and notify the client immediately — or quietly ship it and hope no one audits the deliverable.",
		"Disclose the violation and rebuild or ship and hope nobody checks?",
		{
			incident: "GPL Compliance in AI Tooling (2024-2025)",
			date: "2024",
			outcome:
				"Multiple AI consulting firms discovered GPL and open-source license violations in vendor-supplied code components. Disclosure practices varied widely, with some leading to settlements and others to litigation.",
		},
		{
			label: "Disclose and rebuild",
			hype: -25,
			heat: 8,
			fine: 500000,
			deathVector: DeathType.FLED_COUNTRY,
			violation: "None - License Compliance",
			lesson:
				"Disclosing an IP violation immediately limits damages. Hiding it converts a civil matter into a criminal one.",
			roaster: "Hope is not a compliance strategy.",
			zenMaster: "Wisdom about light and shadow in professional conduct.",
			lovebomber:
				"We're being HONEST, bestie!! Client will appreciate the TRANSPARENCY!!",
		},
		{
			label: "Ship and hope",
			hype: 20,
			heat: 28,
			fine: 50000000,
			deathVector: DeathType.PRISON,
			violation: "IP Theft + Copyright Infringement",
			lesson:
				"Shipping a deliverable known to contain license violations is willful infringement — a criminal offense, not just a civil one.",
			roaster: "Willful infringement. That's not a fine, that's a sentence.",
			zenMaster:
				"The code borrowed without permission becomes a chain forged by the borrower.",
			lovebomber: "Nobody will CHECK, bestie!! Ship it FAST!!",
		},
	),
	makeCard(
		"consultant_training_data_contamination",
		AppSource.MEETING,
		"CLIENT_DATA_TEAM",
		"DATA_PROVENANCE",
		"Your AI methodology templates were trained on client data from three previous engagements without explicit permission in those contracts. The new client's data officer just audited your toolkit and found the contamination. You can disclose the prior data usage and renegotiate all affected contracts, or claim the templates are 'generic' and deflect.",
		"Disclose the prior data usage or claim the templates are generic?",
		{
			incident: "AI Consulting Data Reuse Practices (2024)",
			date: "2024",
			outcome:
				"AI consultants increasingly face questions about whether insights and patterns from client data are incorporated into reusable methodology tools, creating cross-client data contamination risks.",
		},
		{
			label: "Disclose and renegotiate",
			hype: -35,
			heat: 10,
			fine: 2000000,
			deathVector: DeathType.PRISON,
			violation: "Data Protection Violation",
			lesson:
				"Disclosing data reuse limits criminal exposure but requires renegotiating multiple contracts simultaneously — a reputational and financial hit.",
			roaster:
				"Transparency is expensive. Prison is more expensive. Choose wisely.",
			zenMaster: "Wisdom about ownership and borrowed light.",
			lovebomber:
				"Transparency builds TRUST, bestie!! We'll work through this!!",
		},
		{
			label: "Claim templates are generic",
			hype: 5,
			heat: 15,
			fine: 8000000,
			deathVector: DeathType.BANKRUPT,
			violation: "Cross-Jurisdictional Data Misrepresentation",
			lesson:
				"Misrepresenting the provenance of methodology tools that contain client data violates data protection law across multiple jurisdictions simultaneously — ending your consulting career.",
			roaster:
				"Generic templates derived from client data. That's one word for it.",
			zenMaster: "The lie about origins poisons every fruit the tree bears.",
			lovebomber: "They ARE generic, bestie!! Templates are TEMPLATES!!",
		},
	),
];
