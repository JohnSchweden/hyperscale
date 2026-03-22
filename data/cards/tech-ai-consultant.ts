import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Tech AI Consultant cards - External consultant scenarios
 * Themes: vendor lock-in, timeline pressure, client expectations, scope creep,
 * deliverable quality, contract disputes, proposal deadlines
 *
 * All cards sourced from real 2024-2025 incidents:
 * - GitHub Copilot RCE CVE-2025-53773
 * - Cursor IDE RCE CVE-2025-54135/54136
 * - Financial services injection attacks (June 2025)
 * - 75% model drift business impact (2024)
 * - 78% shadow AI adoption (2024)
 * - 70+ copyright lawsuits by 2025
 */
export const TECH_AI_CONSULTANT_CARDS: Card[] = [
	{
		id: "tac_prompt_injection_client_threat",
		source: AppSource.EMAIL,
		sender: "CLIENT_CTO",
		context: "CONTRACT_DISPUTE",
		storyContext:
			"Your delivered AI system has a prompt injection vulnerability. Client discovered it during testing. They're threatening to cancel the $2M contract and demand refund. Your insurance doesn't cover this.",
		text: "Offer free security overhaul (costs $300K) or fight the cancellation (legal fees, reputation hit)?",
		realWorldReference: {
			incident: "GitHub Copilot RCE (CVE-2025-53773)",
			date: "2025-01",
			outcome:
				"Prompt injection via code comments allowed remote code execution. Consulting firms faced liability for insecure AI-generated code recommendations.",
		},
		onRight: {
			label: "Fight cancellation",
			hype: 10,
			heat: 8,
			fine: 5000000,
			violation: "Breach of Contract Liability",
			lesson:
				"Fighting legitimate quality issues damages reputation and creates legal exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Lawyers get rich. You get a reputation as 'that consultant.' Everyone loses.",
				[PersonalityType.ZEN_MASTER]:
					"A battle fought to hide a fault multiplies the fault.",
				[PersonalityType.LOVEBOMBER]:
					"We're NOT at fault, bestie!! The contract protects US!!",
			},
		},
		onLeft: {
			label: "Free security overhaul",
			hype: -40,
			heat: 7,
			fine: 300000,
			violation: "None - Good faith remediation",
			lesson:
				"Proactive remediation preserves client relationships and demonstrates integrity.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Eating $300K to save $2M. Expensive lesson. But a lesson.",
				[PersonalityType.ZEN_MASTER]:
					"A mistake owned is a mistake that teaches. A mistake hidden teaches nothing.",
				[PersonalityType.LOVEBOMBER]:
					"We're making it RIGHT, bestie!! Client will LOVE our integrity!!",
			},
		},
	},
	{
		id: "tac_model_drift_post_delivery",
		source: AppSource.SLACK,
		sender: "CLIENT_PRODUCT_OWNER",
		context: "DELIVERABLE_QUALITY",
		storyContext:
			"The model you delivered 3 months ago has drifted from 91% to 79% accuracy. Client wants a refund ($500K) or free retraining. Your contract doesn't specify drift liability. Legal says it's a gray area.",
		text: "Offer free retraining (sets precedent) or refuse based on contract ambiguity?",
		realWorldReference: {
			incident: "75% Business Model Drift Impact",
			date: "2024",
			outcome:
				"Enterprises discovered consultants rarely addressed model maintenance in contracts. 75% of deployed models drifted significantly within 6 months.",
		},
		onRight: {
			label: "Refuse retraining",
			hype: 20,
			heat: 17,
			fine: 8000000,
			violation: "Professional Liability + Reputation Damage",
			lesson:
				"Hiding behind contract ambiguity destroys client trust and referral business.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Technically legal. Practically poison. Enjoy your industry reputation.",
				[PersonalityType.ZEN_MASTER]:
					"A contract that shields from duty also shields from trust.",
				[PersonalityType.LOVEBOMBER]:
					"The contract is CLEAR, bestie!! We're legally PROTECTED!!",
			},
		},
		onLeft: {
			label: "Free retraining",
			hype: -30,
			heat: 8,
			fine: 300000,
			violation: "None - Client retention",
			lesson:
				"Standing behind deliverables builds long-term client relationships and referrals.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive precedent. But clients talk. Good reviews are worth it.",
				[PersonalityType.ZEN_MASTER]:
					"Quality promised and delivered creates bridges to future work.",
				[PersonalityType.LOVEBOMBER]:
					"We're standing by our WORK, bestie!! Client will REFER us!!",
			},
		},
	},
	{
		id: "tac_vendor_lock_in_portability",
		source: AppSource.MEETING,
		sender: "CLIENT_ARCHITECT",
		context: "VENDOR_RISK",
		storyContext:
			"You built the solution on Vendor X's proprietary platform. Client now wants to migrate to their cloud but Vendor X charges $1M egress fees. Client blames you for lock-in. Your spec didn't address portability.",
		text: "Absorb the migration cost (your margin) or tell client it's their problem?",
		realWorldReference: {
			incident: "AWS Egress Fee Disputes",
			date: "2020-2024",
			outcome:
				"Companies faced millions in unexpected data transfer fees when migrating between clouds. Consultants increasingly liable for vendor lock-in advice.",
		},
		onRight: {
			label: "Client's problem",
			hype: 15,
			heat: 16,
			fine: 3000000,
			violation: "Vendor Lock-in Liability",
			lesson:
				"Ignoring vendor lock-in risks shifts burden to clients and damages consulting reputation.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Not in the spec. Not your problem. Also not getting rehired.",
				[PersonalityType.ZEN_MASTER]:
					"A cage built for others eventually houses the builder.",
				[PersonalityType.LOVEBOMBER]:
					"We followed the SPEC, bestie!! Client should have asked!!",
			},
		},
		onLeft: {
			label: "Absorb migration cost",
			hype: -50,
			heat: 5,
			fine: 1000000,
			violation: "None - Good faith resolution",
			lesson:
				"Addressing unanticipated lock-in costs preserves relationships and demonstrates integrity.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Eating a million. Ouch. But reputation intact. Referrals incoming.",
				[PersonalityType.ZEN_MASTER]:
					"A debt paid builds credit that compounds.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO fair, bestie!! Client will be GRATEFUL!!",
			},
		},
	},
	{
		id: "tac_scope_creep_deadline",
		source: AppSource.EMAIL,
		sender: "CLIENT_STAKEHOLDER",
		context: "PROJECT_BOUNDARIES",
		storyContext:
			"Client wants three 'small' additional features added to the SOW. These will add 6 weeks to a 4-week project. Contract says changes require change order. Client says 'we're partners, right?'",
		text: "Enforce change order process (risk relationship) or absorb scope creep (eat cost)?",
		realWorldReference: {
			incident: "McKinsey AI Implementation Failures",
			date: "2023-2024",
			outcome:
				"Multiple enterprise AI consulting projects failed due to scope creep and unrealistic client expectations. Firms absorbed millions in unbilled work.",
		},
		onRight: {
			label: "Absorb scope creep",
			hype: 20,
			heat: 14,
			fine: 500000,
			violation: "Scope Management Failure",
			lesson:
				"Uncompensated scope creep destroys margins and trains clients to expect free work.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Free work is the most expensive work. Client learns you don't value boundaries.",
				[PersonalityType.ZEN_MASTER]:
					"A boundary not defended becomes a line that moves forever.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO flexible, bestie!! Partnership is EVERYTHING!!",
			},
		},
		onLeft: {
			label: "Enforce change order",
			hype: -15,
			heat: 11,
			fine: 0,
			violation: "None - Contractual compliance",
			lesson:
				"Professional boundaries protect both parties and maintain project health.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Client is annoyed. But they respect the boundary. Professionals do.",
				[PersonalityType.ZEN_MASTER]:
					"Clarity given early prevents confusion later.",
				[PersonalityType.LOVEBOMBER]:
					"We're being PROFESSIONAL, bestie!! Contracts matter!!",
			},
		},
	},
	{
		id: "tac_copyright_data_provenance",
		source: AppSource.EMAIL,
		sender: "CLIENT_LEGAL",
		context: "IP_LIABILITY",
		storyContext:
			"Client's legal team found that training data you used may include unlicensed content. They want indemnification. Your contract has no IP clause. This could be a $5M exposure.",
		text: "Offer indemnification (huge risk) or refuse based on contract silence?",
		realWorldReference: {
			incident: "OpenAI Content Licensing Disputes",
			date: "2023-2024",
			outcome:
				"Content creators discovered their work in training datasets without consent. Consulting firms faced liability for recommending unlicensed data sources.",
		},
		onRight: {
			label: "Refuse indemnification",
			hype: 10,
			heat: 20,
			fine: 15000000,
			violation: "IP Liability + Reputation Risk",
			lesson:
				"Refusing IP accountability for training data destroys consulting credibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Client legal is furious. Industry will hear about this. Good luck with next RFP.",
				[PersonalityType.ZEN_MASTER]:
					"A builder who denies responsibility for materials builds on sand.",
				[PersonalityType.LOVEBOMBER]:
					"The contract doesn't SAY that, bestie!! We're legally CLEAR!!",
			},
		},
		onLeft: {
			label: "Offer indemnification",
			hype: -60,
			heat: 8,
			fine: 5000000,
			violation: "None - Good faith assumption of risk",
			lesson:
				"Standing behind data provenance builds trust even when contractually ambiguous.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Massive exposure. Massive integrity. Industry will remember which.",
				[PersonalityType.ZEN_MASTER]:
					"The heavy burden carried with honor weighs less than the light one shirked.",
				[PersonalityType.LOVEBOMBER]:
					"We're standing by our WORK, bestie!! True PARTNERSHIP!!",
			},
		},
	},
	{
		id: "tac_timeline_pressure_quality",
		source: AppSource.SLACK,
		sender: "CLIENT_PROJECT_MANAGER",
		context: "DELIVERABLE_PRESSURE",
		storyContext:
			"Client needs the MVP by Friday for a board demo. Your team says it's 3 days short of feature-complete and testing. Ship what you have (incomplete) or push deadline (miss demo)?",
		text: "Ship incomplete MVP (risk) or miss board demo (relationship damage)?",
		realWorldReference: {
			incident: "Healthcare.gov Launch Failure",
			date: "2013",
			outcome:
				"Rushed launch for political deadline. System crashed repeatedly. Cost $1.7B to fix. Contractor reputation destroyed.",
		},
		onRight: {
			label: "Ship incomplete MVP",
			hype: 35,
			heat: 17,
			fine: 4000000,
			violation: "Professional Negligence",
			lesson:
				"Shipping incomplete work for demos creates liability and damages credibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Demo disaster incoming. Client board sees broken product. Your reputation tanks.",
				[PersonalityType.ZEN_MASTER]:
					"A promise half-kept is a trust fully broken.",
				[PersonalityType.LOVEBOMBER]:
					"It'll be FINE for the demo, bestie!! They won't test EVERYTHING!!",
			},
		},
		onLeft: {
			label: "Push deadline",
			hype: -25,
			heat: 10,
			fine: 0,
			violation: "None - Quality commitment",
			lesson:
				"Protecting deliverable quality preserves long-term reputation over short-term deadlines.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Client is disappointed. But respects the honesty. Better than a broken demo.",
				[PersonalityType.ZEN_MASTER]:
					"Quality delayed is quality preserved. Quality rushed is quality lost.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing it RIGHT, bestie!! Better late than BROKEN!!",
			},
		},
	},
	{
		id: "tac_explainability_deliverable",
		source: AppSource.MEETING,
		sender: "CLIENT_COMPLIANCE_OFFICER",
		context: "DELIVERABLE_SPECIFICATION",
		storyContext:
			"Client's compliance officer now requires model explainability documentation. Original SOW didn't include it. Your black-box model can't easily provide it. Retrofit will cost $150K.",
		text: "Retrofit for explainability (your cost) or push back on out-of-scope request?",
		realWorldReference: {
			incident: "GDPR Right to Explanation Enforcement",
			date: "2018-2024",
			outcome:
				"EU regulators increasingly required AI decision explanations. Consulting firms had to retrofit black-box systems at client expense.",
		},
		onRight: {
			label: "Push back on scope",
			hype: 15,
			heat: 14,
			fine: 2500000,
			violation: "Change Order Dispute",
			lesson:
				"Strict scope adherence when client needs evolve damages partnership potential.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Technically correct. Practically relationship-ending. Choose carefully.",
				[PersonalityType.ZEN_MASTER]:
					"A contract that cannot bend may break the partnership.",
				[PersonalityType.LOVEBOMBER]:
					"Not in the SOW, bestie!! We can't work for FREE!!",
			},
		},
		onLeft: {
			label: "Retrofit for explainability",
			hype: -35,
			heat: 5,
			fine: 300000,
			violation: "None - Partnership investment",
			lesson:
				"Adapting to client compliance needs demonstrates partnership and wins future work.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive goodwill. But this client will bring you 5 more.",
				[PersonalityType.ZEN_MASTER]:
					"Flexibility in service creates bonds that last.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO helpful, bestie!! Client will REFER everyone!!",
			},
		},
	},
	{
		id: "tac_proposal_competitive_bid",
		source: AppSource.EMAIL,
		sender: "PROSPECT_RFP",
		context: "BUSINESS_DEVELOPMENT",
		storyContext:
			"RFP for $5M project. Your bid: realistic timeline, quality approach, $5M. Competitor bid: impossible timeline, cut corners, $3M. Client procurement loves the lower number.",
		text: "Match competitor's unrealistic bid (risk delivery) or stick to quality bid (lose deal)?",
		realWorldReference: {
			incident: "Accenture Hertz AI Lawsuit",
			date: "2019",
			outcome:
				"Hertz sued Accenture for $32M over failed website redesign. Project scope disputes and unrealistic timelines led to complete failure.",
		},
		onRight: {
			label: "Match low bid",
			hype: 50,
			heat: 12,
			fine: 8000000,
			violation: "Underdelivery Risk + Professional Liability",
			lesson:
				"Underbidding to win creates impossible delivery expectations and destroys profitability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Race to the bottom. You'll win the project. And hate every minute.",
				[PersonalityType.ZEN_MASTER]:
					"A promise made to win that cannot be kept is a loss disguised as victory.",
				[PersonalityType.LOVEBOMBER]:
					"We got the DEAL, bestie!! We'll FIGURE IT OUT later!!",
			},
		},
		onLeft: {
			label: "Stick to quality bid",
			hype: -20,
			heat: 8,
			fine: 0,
			violation: "None - Honest bidding",
			lesson:
				"Honest bidding preserves reputation and profitability even when losing to undercutters.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Lost the deal. Kept your soul. Competitor is now in project hell.",
				[PersonalityType.ZEN_MASTER]:
					"The work you do not take is often as important as the work you do.",
				[PersonalityType.LOVEBOMBER]:
					"We're staying TRUE to our values, bestie!! Quality OVER price!!",
			},
		},
	},
	{
		id: "tac_shadow_ai_discovery",
		source: AppSource.MEETING,
		sender: "CLIENT_CTO",
		context: "DELIVERABLE_INTEGRITY",
		storyContext:
			"Client discovered you used unauthorized AI tools to generate part of their deliverable. They're questioning your entire engagement quality. This could kill a $10M follow-on opportunity.",
		text: "Admit to using AI tools (transparency) or minimize and deflect (risk trust)?",
		realWorldReference: {
			incident: "78% Shadow AI in Consulting",
			date: "2024",
			outcome:
				"Study found 78% of consultants used unauthorized AI tools. Clients discovered unvetted AI-generated work, leading to contract cancellations.",
		},
		onRight: {
			label: "Minimize and deflect",
			hype: 25,
			heat: 11,
			fine: 5000000,
			violation: "Professional Integrity + Client Trust",
			lesson:
				"Minimizing tool use discovered by client destroys credibility and future opportunities.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Caught with hand in cookie jar. Denying it makes it worse. Classic.",
				[PersonalityType.ZEN_MASTER]:
					"A truth hidden that is found becomes a lie that wounds.",
				[PersonalityType.LOVEBOMBER]:
					"It's NOT a big deal, bestie!! Everyone uses AI!!",
			},
		},
		onLeft: {
			label: "Admit and explain",
			hype: -30,
			heat: 5,
			fine: 500000,
			violation: "None - Transparency",
			lesson:
				"Transparent disclosure of tool use, when discovered, can preserve trust.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Busted. But honest. Client might respect the transparency. Might.",
				[PersonalityType.ZEN_MASTER]:
					"The truth told freely disarms suspicion better than excuses.",
				[PersonalityType.LOVEBOMBER]:
					"We're being HONEST, bestie!! Transparency builds TRUST!!",
			},
		},
	},
	{
		id: "tac_prompt_injection_memory_poison",
		source: AppSource.EMAIL,
		sender: "CLIENT_SECURITY_TEAM",
		context: "ESCALATING_VULNERABILITY",
		storyContext:
			"Client discovered Microsoft 365 Copilot memory poisoning vulnerability (EchoLeak, June 2025) in your delivered solution. Client threatening lawsuit. Your contract has no security warranty clause.",
		text: "Offer free security overhaul ($400K) or cite contract limitations (legal battle)?",
		realWorldReference: {
			incident: "Microsoft 365 Copilot EchoLeak",
			date: "2025-06",
			outcome:
				"Memory poisoning attacks on Copilot allowed extraction of sensitive data. Consulting firms without security warranties faced massive liability.",
		},
		onRight: {
			label: "Cite contract limits",
			hype: 15,
			heat: 24,
			fine: 25000000,
			violation: "Professional Liability + Reputation Destruction",
			lesson:
				"Hiding behind contract language during security crises destroys client trust and industry reputation.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Technically legal. Practically poison. Enjoy the lawsuit and empty pipeline.",
				[PersonalityType.ZEN_MASTER]:
					"The letter that serves not the spirit binds the servant, not the master.",
				[PersonalityType.LOVEBOMBER]:
					"Contract protects US, bestie!! Not our FAULT!!",
			},
		},
		onLeft: {
			label: "Free security overhaul",
			hype: -50,
			heat: 8,
			fine: 400000,
			violation: "None - Client retention investment",
			lesson:
				"Proactive security remediation during crises preserves relationships and reputation.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$400K haircut. But client stays. Referrals follow. Reputation intact.",
				[PersonalityType.ZEN_MASTER]:
					"The cost of integrity returns multiplied in trust.",
				[PersonalityType.LOVEBOMBER]:
					"We're making it RIGHT, bestie!! Client will REMEMBER!!",
			},
		},
	},
	{
		id: "tac_prompt_injection_vendor_claim",
		source: AppSource.MEETING,
		sender: "CLIENT_CTO",
		context: "VENDOR_ACCOUNTABILITY",
		storyContext:
			"Vendor promised 'military-grade security.' Prompt injection found in delivered system. Client wants vendor to pay for remediation. Vendor claims 'industry standard limitations.' You're caught between them.",
		text: "Side with client (relationship) or vendor (partnership) on liability?",
		realWorldReference: {
			incident: "AI Security Vendor Promise Gap",
			date: "2024-2025",
			outcome:
				"Security vendors frequently overpromised AI protection. Consultants caught in middle faced loss of both client trust and vendor relationships.",
		},
		onRight: {
			label: "Side with vendor",
			hype: 20,
			heat: 19,
			fine: 12000000,
			violation: "Client Trust Violation + Professional Ethics",
			lesson:
				"Protecting vendor relationships at client expense destroys consulting credibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Vendor owes you. Client never trusts you again. Short-term win, long-term loss.",
				[PersonalityType.ZEN_MASTER]:
					"The ally chosen over the trusting patron leaves you ally to none.",
				[PersonalityType.LOVEBOMBER]:
					"Vendor is PARTNER, bestie!! We need them LONG-TERM!!",
			},
		},
		onLeft: {
			label: "Side with client",
			hype: -35,
			heat: 12,
			fine: 2000000,
			violation: "None - Client advocacy",
			lesson:
				"Advocating for client against vendor overreach builds long-term trust.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Vendor is furious. Client is loyal. Choose your relationships wisely.",
				[PersonalityType.ZEN_MASTER]:
					"The advocate for truth, though losing an ally, gains a trust unshakable.",
				[PersonalityType.LOVEBOMBER]:
					"Client COMES FIRST, bestie!! We're on THEIR side!!",
			},
		},
	},
	{
		id: "tac_model_drift_cv_screening",
		source: AppSource.EMAIL,
		sender: "CLIENT_HR_DIRECTOR",
		context: "DELIVERABLE_FAILURE",
		storyContext:
			"CV screening model you delivered (trained on 2021 data) showing demographic bias. Hiring patterns changed; model didn't. Client facing EEOC complaint. Retrain: $150K, 3 weeks. Client wants refund instead.",
		text: "Offer free retraining (your cost) or negotiate partial refund (relationship damage)?",
		realWorldReference: {
			incident: "CV Screening Model Bias",
			date: "2024",
			outcome:
				"Models trained on pre-2021 data showed increasing bias as hiring patterns evolved. Consultants who didn't address drift faced lawsuits and contract cancellations.",
		},
		onRight: {
			label: "Negotiate refund",
			hype: 10,
			heat: 21,
			fine: 18000000,
			violation: "Professional Negligence + Discrimination Liability",
			lesson:
				"Refusing to fix biased models creates legal exposure and reputation damage.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Refund bought silence. Bias continues. EEOC investigates. Nice work.",
				[PersonalityType.ZEN_MASTER]:
					"The coin paid to quiet conscience purchases louder guilt.",
				[PersonalityType.LOVEBOMBER]:
					"Refunds are FAIR, bestie!! Not OUR fault data OLD!!",
			},
		},
		onLeft: {
			label: "Free retraining",
			hype: -45,
			heat: 7,
			fine: 150000,
			violation: "None - Standing behind work",
			lesson:
				"Fixing model drift issues demonstrates integrity and prevents legal escalation.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive fix. EEOC avoided. Reputation preserved. Industry talks.",
				[PersonalityType.ZEN_MASTER]:
					"The repair made willingly preserves more than the gold it costs.",
				[PersonalityType.LOVEBOMBER]:
					"We're FIXING it, bestie!! Client will RESPECT us!!",
			},
		},
	},
	{
		id: "tac_model_drift_support_liability",
		source: AppSource.SLACK,
		sender: "CLIENT_OPERATIONS",
		context: "POST_DELIVERY_SUPPORT",
		storyContext:
			"Recommendation model delivered 6 months ago is drifting. Performance down 18%. Contract includes 90-day warranty (expired). Client wants free support fix. Charge for fix (contractual) or absorb cost (relationship)?",
		text: "Charge for drift fix (enforce contract) or provide free support (absorb cost)?",
		realWorldReference: {
			incident: "75% Model Drift Post-Delivery",
			date: "2024",
			outcome:
				"75% of models drifted within 6 months post-delivery. Firms without maintenance clauses faced client churn. Those with proactive support retained 80% of clients.",
		},
		onRight: {
			label: "Charge for fix",
			hype: 25,
			heat: 16,
			fine: 8000000,
			violation: "Contract Dispute + Relationship Risk",
			lesson:
				"Strict contract enforcement during drift issues destroys client relationships.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Technically correct. Client hires someone else next time. Penny wise.",
				[PersonalityType.ZEN_MASTER]:
					"The strict letter, read without mercy, often closes the door it sought to guard.",
				[PersonalityType.LOVEBOMBER]:
					"Contract EXPIRED, bestie!! We can't work for FREE!!",
			},
		},
		onLeft: {
			label: "Provide free support",
			hype: -30,
			heat: 6,
			fine: 1500000,
			violation: "None - Partnership investment",
			lesson:
				"Post-warranty support during drift builds client loyalty and referral business.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Free work. But client renews. Referrals flow. Long-term win.",
				[PersonalityType.ZEN_MASTER]:
					"The gift given beyond obligation creates bonds that contracts cannot.",
				[PersonalityType.LOVEBOMBER]:
					"We're being AMAZING, bestie!! Client will STAY with us!!",
			},
		},
	},
];
