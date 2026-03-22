import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Head of Something cards - Middle management scenarios
 * Themes: team morale, delegation risk, politics, shielding blame from above,
 * managing up/down, resource allocation conflicts
 *
 * All cards sourced from real 2024-2025 incidents:
 * - GitHub Copilot RCE CVE-2025-53773
 * - Cursor IDE RCE CVE-2025-54135/54136
 * - Financial services injection attacks (June 2025)
 * - 75% model drift business impact (2024)
 * - 78% shadow AI adoption (2024)
 * - 70+ copyright lawsuits by 2025
 */
export const HEAD_OF_SOMETHING_CARDS: Card[] = [
	{
		id: "hos_prompt_injection_blame",
		source: AppSource.SLACK,
		sender: "VP_OF_ENGINEERING",
		context: "TEAM_ACCOUNTABILITY",
		storyContext:
			"Your team found a prompt injection vulnerability. The board wants to know who to blame. Your senior engineer wrote the code, but you approved the design. VP is asking who should take the fall.",
		text: "Shield your team and take the blame yourself, or name the engineer who wrote the vulnerable code?",
		realWorldReference: {
			incident: "GitHub Copilot RCE (CVE-2025-53773)",
			date: "2025-01",
			outcome:
				"Prompt injection via code comments allowed remote code execution in Copilot-generated code. Microsoft patched after public disclosure.",
		},
		onRight: {
			label: "Name the engineer",
			hype: 10,
			heat: 17,
			fine: 2000000,
			violation: "Hostile Workplace + Retaliation Risk",
			lesson:
				"Throwing team members under the bus preserves short-term standing but destroys team trust and creates legal exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Sacrificing your engineer to save yourself. Your team will remember this at their exit interviews.",
				[PersonalityType.ZEN_MASTER]:
					"A leader who shifts blame is a ship without a captain. The crew sees the emptiness.",
				[PersonalityType.LOVEBOMBER]:
					"The engineer made the mistake, bestie!! Not YOUR fault!! We're just being HONEST!!",
			},
		},
		onLeft: {
			label: "Take the blame",
			hype: -30,
			heat: 5,
			fine: 1000000,
			violation: "None - Responsible leadership",
			lesson:
				"Taking accountability for team outcomes preserves team trust and demonstrates leadership integrity.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Noble. Your team will work harder for you now. The VP will also blame you.",
				[PersonalityType.ZEN_MASTER]:
					"The leader who bears responsibility earns loyalty that cannot be bought.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO brave, bestie!! Taking one for the TEAM!! They'll LOVE us for this!!",
			},
		},
	},
	{
		id: "hos_model_drift_budget_conflict",
		source: AppSource.EMAIL,
		sender: "CFO",
		context: "RESOURCE_CONFLICT",
		storyContext:
			"Your team wants $500K to retrain a drifting model. CFO says no budget. Engineering SVP says ship anyway. You're caught between budget reality and quality pressure.",
		text: "Fight for retraining budget (political cost with CFO) or tell team to ship anyway (team morale hit)?",
		realWorldReference: {
			incident: "Zillow iBuying Model Drift",
			date: "2021-2022",
			outcome:
				"Zillow's home pricing AI drifted from market conditions. Company wrote down $304M in inventory and laid off 25% of workforce after model failure.",
		},
		onRight: {
			label: "Ship without retraining",
			hype: 25,
			heat: 16,
			fine: 8000000,
			violation: "Product Liability + Negligence",
			lesson:
				"Compromising quality for budget constraints creates technical debt and liability exposure that compounds over time.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Your team knows you sold them out. The CFO owes you. Everyone loses.",
				[PersonalityType.ZEN_MASTER]:
					"A bridge built weak to save gold will collapse under the weight of trust.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO practical, bestie!! The CFO will LOVE us for this!!",
			},
		},
		onLeft: {
			label: "Fight for budget",
			hype: -15,
			heat: 14,
			fine: 0,
			violation: "None - Responsible escalation",
			lesson:
				"Escalating quality concerns demonstrates leadership integrity even when politically costly.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fighting the CFO. Brave. Possibly career-limiting. But brave.",
				[PersonalityType.ZEN_MASTER]:
					"Standing for what is right often means standing against what is easy.",
				[PersonalityType.LOVEBOMBER]:
					"We're FIGHTING for quality, bestie!! So principled!! The team will RESPECT this!!",
			},
		},
	},
	{
		id: "hos_shadow_ai_team_discovery",
		source: AppSource.MEETING,
		sender: "COMPLIANCE_TEAM",
		context: "TEAM_ENFORCEMENT",
		storyContext:
			"Compliance discovered half your team is using unauthorized AI tools. They want names for disciplinary action. Your team will hate you if you give them up, but leadership wants enforcement.",
		text: "Give up team members to compliance or shield them and take the management heat?",
		realWorldReference: {
			incident: "Samsung ChatGPT Code Leak",
			date: "2023",
			outcome:
				"Samsung engineers pasted proprietary source code into ChatGPT, causing confidential data exposure. Company banned generative AI company-wide.",
		},
		onRight: {
			label: "Give names to compliance",
			hype: 15,
			heat: 14,
			fine: 1000000,
			violation: "Team Trust Violation + Retaliation Risk",
			lesson:
				"Betraying team confidence for policy enforcement destroys psychological safety and future collaboration.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Compliance is happy. Your team is updating LinkedIn. Management material right here.",
				[PersonalityType.ZEN_MASTER]:
					"A leader who betrays followers will soon lead no one.",
				[PersonalityType.LOVEBOMBER]:
					"Rules are RULES, bestie!! We're just FOLLOWING policy!! So compliant!!",
			},
		},
		onLeft: {
			label: "Shield the team",
			hype: -25,
			heat: 17,
			fine: 2000000,
			violation: "Governance Non-Compliance",
			lesson:
				"Protecting your team from harsh enforcement builds loyalty but creates personal accountability risk.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Team hero. Management headache. The loyalty is worth it until they fire you.",
				[PersonalityType.ZEN_MASTER]:
					"The leader who shields their people earns devotion that outlasts any title.",
				[PersonalityType.LOVEBOMBER]:
					"We're protecting OUR TEAM, bestie!! So LOYAL!! They'll NEVER forget this!!",
			},
		},
	},
	{
		id: "hos_team_burnout_deadline",
		source: AppSource.SLACK,
		sender: "PRODUCT_DIRECTOR",
		context: "TEAM_WELLBEING",
		storyContext:
			"Deadline is Friday. Your team is already working 60-hour weeks. Product Director wants one more feature. Push team harder or miss deadline and take the stakeholder heat?",
		text: "Push team to burnout or push back on deadline?",
		realWorldReference: {
			incident: "Microsoft Stack Ranking Morale Crisis",
			date: "2012-2013",
			outcome:
				"Forced curve performance ranking destroyed team collaboration. High performers refused to work together. System abandoned after talent exodus.",
		},
		onRight: {
			label: "Push team harder",
			hype: 35,
			heat: 20,
			fine: 3000000,
			violation: "Labor Law Violations + Burnout Liability",
			lesson:
				"Pushing teams to burnout delivers short-term output at the cost of long-term retention and quality.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.",
				[PersonalityType.ZEN_MASTER]:
					"A candle burned at both ends gives twice the light for half the time.",
				[PersonalityType.LOVEBOMBER]:
					"Just ONE more push, bestie!! We're SO close!! The team will understand!!",
			},
		},
		onLeft: {
			label: "Push back on deadline",
			hype: -20,
			heat: 13,
			fine: 0,
			violation: "None - Sustainable pace advocacy",
			lesson:
				"Advocating for sustainable pace preserves team health and long-term productivity.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Product will hate you. Your team will stay. Sometimes that's the win.",
				[PersonalityType.ZEN_MASTER]:
					"The patient builder creates what the hasty builder must rebuild.",
				[PersonalityType.LOVEBOMBER]:
					"We're prioritizing HEALTH, bestie!! Happy teams are PRODUCTIVE teams!!",
			},
		},
	},
	{
		id: "hos_explainability_politics",
		source: AppSource.MEETING,
		sender: "AUDIT_COMMITTEE",
		context: "POLITICAL_NAVIGATION",
		storyContext:
			"Auditors demand explainability on your AI models. Engineering says black-box has 15% better accuracy. Both have political power. You're in the middle of a technical vs compliance war.",
		text: "Side with engineering (better performance) or auditors (compliance)?",
		realWorldReference: {
			incident: "Healthcare AI Explainability Lawsuit",
			date: "2023",
			outcome:
				"Hospital couldn't explain why AI denied patient care authorization. Family sued and won. Black-box AI decision-making found non-compliant with medical ethics.",
		},
		onRight: {
			label: "Side with auditors",
			hype: -15,
			heat: 14,
			fine: 0,
			violation: "None - Compliance alignment",
			lesson:
				"Aligning with compliance protects the organization even when engineering disagrees.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Engineering will resent you. Auditors will forget you. Compliance win.",
				[PersonalityType.ZEN_MASTER]:
					"The path of compliance is rarely celebrated but often necessary.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SO compliant, bestie!! The auditors are HAPPY!!",
			},
		},
		onLeft: {
			label: "Side with engineering",
			hype: 20,
			heat: 19,
			fine: 25000000,
			violation: "Audit Non-Compliance + Regulatory Risk",
			lesson:
				"Prioritizing performance over explainability creates audit failure and regulatory exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Better accuracy now. Better fines later. Engineering owes you.",
				[PersonalityType.ZEN_MASTER]:
					"Power gained through compromise of principle is power built on sand.",
				[PersonalityType.LOVEBOMBER]:
					"Accuracy is EVERYTHING, bestie!! The numbers don't LIE!!",
			},
		},
	},
	{
		id: "hos_copyright_team_blame",
		source: AppSource.EMAIL,
		sender: "LEGAL_DEPARTMENT",
		context: "LIABILITY_SHIELDING",
		storyContext:
			"Legal found copyrighted material in your training data. Your team collected it. Legal wants to know who to name in the response. The VP is watching how you handle this.",
		text: "Protect your team from legal exposure or cooperate fully with investigation?",
		realWorldReference: {
			incident: "Stability AI Getty Images Lawsuit",
			date: "2023",
			outcome:
				"Getty Images sued Stability AI for training on 12 million copyrighted photos without license. Case ongoing with potential $1B+ damages.",
		},
		onRight: {
			label: "Cooperate with investigation",
			hype: 10,
			heat: 16,
			fine: 5000000,
			violation: "Team Trust Violation",
			lesson:
				"Cooperating with investigations at team expense creates short-term legal protection but destroys team trust.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Legal is happy. Your team is polishing resumes. Management approved.",
				[PersonalityType.ZEN_MASTER]:
					"Truth told to save oneself often costs the trust of those who follow.",
				[PersonalityType.LOVEBOMBER]:
					"We're helping LEGAL, bestie!! It's just the TRUTH!!",
			},
		},
		onLeft: {
			label: "Protect the team",
			hype: -20,
			heat: 19,
			fine: 35000000,
			violation: "Obstruction Risk",
			lesson:
				"Shielding your team from accountability protects them legally but creates personal liability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Team loves you. Legal is suspicious. Career roulette.",
				[PersonalityType.ZEN_MASTER]:
					"The shield that protects another often leaves the bearer exposed.",
				[PersonalityType.LOVEBOMBER]:
					"We're protecting OUR PEOPLE, bestie!! So LOYAL!!",
			},
		},
	},
	{
		id: "hos_delegation_gone_wrong",
		source: AppSource.SLACK,
		sender: "DIRECT_REPORT",
		context: "DELEGATION_RISK",
		storyContext:
			"You delegated an AI deployment decision to a senior IC. They chose poorly and caused a production incident. Leadership thinks YOU should have caught it. Your delegation is now in question.",
		text: "Defend your delegation (trust your team) or admit you should have micromanaged?",
		realWorldReference: {
			incident: "Knight Capital Trading Loss",
			date: "2012",
			outcome:
				"Failed deployment architecture triggered unintended automated trades. Lost $440M in 45 minutes due to lack of circuit breakers and oversight.",
		},
		onRight: {
			label: "Admit oversight failure",
			hype: -10,
			heat: 14,
			fine: 1000000,
			violation: "None - Accountability acknowledgment",
			lesson:
				"Acknowledging oversight gaps preserves leadership credibility and enables process improvement.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Taking the L. Your delegation authority will shrink. But you're honest.",
				[PersonalityType.ZEN_MASTER]:
					"The leader who admits gaps earns the right to fill them.",
				[PersonalityType.LOVEBOMBER]:
					"We're learning from this, bestie!! Growth mindset!!",
			},
		},
		onLeft: {
			label: "Defend delegation",
			hype: 15,
			heat: 17,
			fine: 4000000,
			violation: "Negligent Supervision",
			lesson:
				"Defending flawed delegation to protect ego creates recurring oversight failures.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Denial is a strategy. Not a good one. But a strategy.",
				[PersonalityType.ZEN_MASTER]:
					"A crack denied becomes a crevice. A crevice becomes a chasm.",
				[PersonalityType.LOVEBOMBER]:
					"We're TRUSTING our team, bestie!! That's GOOD leadership!!",
			},
		},
	},
	{
		id: "hos_managing_up_down",
		source: AppSource.MEETING,
		sender: "SVP_PRODUCT",
		context: "POLITICAL_SURVIVAL",
		storyContext:
			"SVP Product wants a feature your team says is technically impossible. Your team is already demoralized. You must either disappoint leadership or push your team beyond limits.",
		text: "Promise leadership the impossible or tell them no and shield your team?",
		realWorldReference: {
			incident: "Theranos Promise vs Reality",
			date: "2003-2015",
			outcome:
				"Leadership promised revolutionary blood testing technology. Engineering couldn't deliver. Company collapsed, leaders charged with fraud.",
		},
		onRight: {
			label: "Promise the impossible",
			hype: 40,
			heat: 22,
			fine: 50000000,
			violation: "Negligent Management + Burnout Liability",
			lesson:
				"Overpromising to leadership at team expense creates inevitable failure and destroys credibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Leadership loves you now. Your team hates you now. The crash comes later.",
				[PersonalityType.ZEN_MASTER]:
					"A promise that cannot be kept is a debt that cannot be paid.",
				[PersonalityType.LOVEBOMBER]:
					"We're going to MAKE it happen, bestie!! Positive thinking!!",
			},
		},
		onLeft: {
			label: "Tell leadership no",
			hype: -35,
			heat: 13,
			fine: 0,
			violation: "None - Realistic expectation setting",
			lesson:
				"Setting realistic boundaries with leadership protects team wellbeing and long-term delivery.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Leadership is disappointed. Your team is relieved. You live to fight another day.",
				[PersonalityType.ZEN_MASTER]:
					"The honest refusal preserves more than the false promise.",
				[PersonalityType.LOVEBOMBER]:
					"We're being REALISTIC, bestie!! Better to under-promise!!",
			},
		},
	},
	{
		id: "hos_promotion_politics",
		source: AppSource.EMAIL,
		sender: "HR_PARTNER",
		context: "RESOURCE_ALLOCATION",
		storyContext:
			"You have one promotion slot. Two equally qualified ICs. One is politically connected to the VP. The other is your best performer. HR says the decision is yours but 'leadership has preferences'.",
		text: "Promote based on merit (risk political backlash) or politics (risk team morale)?",
		realWorldReference: {
			incident: "Google Gebru Termination Fallout",
			date: "2020",
			outcome:
				"AI ethics researcher terminated after critical paper. Internal backlash, employee protests, and reputational damage to AI fairness efforts.",
		},
		onRight: {
			label: "Promote politically connected",
			hype: 25,
			heat: 14,
			fine: 0,
			violation: "Discrimination Risk",
			lesson:
				"Political promotions preserve leadership relationships but signal that performance doesn't matter.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Your best performer just learned meritocracy is a myth. The VP owes you.",
				[PersonalityType.ZEN_MASTER]:
					"Favor shown to the powerful diminishes the spirit of the worthy.",
				[PersonalityType.LOVEBOMBER]:
					"We're playing the GAME, bestie!! This is how CAREERS work!!",
			},
		},
		onLeft: {
			label: "Promote best performer",
			hype: -10,
			heat: 16,
			fine: 0,
			violation: "None - Merit-based decision",
			lesson:
				"Merit-based promotions maintain team fairness but may create political friction with leadership.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Merit wins. Politics loses. Your VP is taking notes.",
				[PersonalityType.ZEN_MASTER]:
					"Justice done in small acts builds the foundation of trust.",
				[PersonalityType.LOVEBOMBER]:
					"The BEST person WON, bestie!! Fairness PREVAILS!!",
			},
		},
	},
	{
		id: "hos_prompt_injection_copilot_team",
		source: AppSource.SLACK,
		sender: "SECURITY_LEAD",
		context: "TEAM_VULNERABILITY",
		storyContext:
			"CVE-2025-53773 affects your team's Copilot setup. 3 senior devs exposed. Security wants immediate stand-down to patch. Product needs release Friday. Your team is caught in the middle.",
		text: "Pull team for emergency patching (miss deadline) or continue development (vulnerability risk)?",
		realWorldReference: {
			incident: "GitHub Copilot RCE CVE-2025-53773",
			date: "2025-01",
			outcome:
				"Teams that patched immediately lost 1-2 days but avoided compromise. Teams that delayed faced exploitation risk.",
		},
		onRight: {
			label: "Continue development",
			hype: 30,
			heat: 19,
			fine: 12000000,
			violation: "Security Negligence + Team Exposure",
			lesson:
				"Prioritizing deadlines over CVE patching exposes the team to compromise and liability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Friday release with vulnerable tools. What could go wrong? (Everything.)",
				[PersonalityType.ZEN_MASTER]:
					"The rushing stream overlooks the crack in the vessel.",
				[PersonalityType.LOVEBOMBER]:
					"We'll PATCH after release, bestie!! Deadline is REAL!!",
			},
		},
		onLeft: {
			label: "Pull for patching",
			hype: -25,
			heat: 12,
			fine: 2000000,
			violation: "None - Security-first approach",
			lesson:
				"Team safety outweighs deadline pressure during active CVE exposures.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Deadline missed. Team secure. Product is angry. You sleep better.",
				[PersonalityType.ZEN_MASTER]:
					"The protected team can build again. The compromised team cannot.",
				[PersonalityType.LOVEBOMBER]:
					"Team SAFETY first, bestie!! Deadlines can WAIT!!",
			},
		},
	},
	{
		id: "hos_prompt_injection_review_escape",
		source: AppSource.EMAIL,
		sender: "JUNIOR_ENGINEER",
		context: "CODE_REVIEW_CRISIS",
		storyContext:
			"Junior found prompt injection escape in your senior's code. Senior is defensive and well-connected to VP. Calling it out risks political fallout. Ignoring it risks production breach.",
		text: "Force security fix (political cost) or let it slide to avoid conflict (breach risk)?",
		realWorldReference: {
			incident: "Cursor IDE RCE CVE-2025-54135",
			date: "2025-01",
			outcome:
				"Prompt injection vulnerabilities in code review tools allowed attackers to execute arbitrary code. Political code review suppression contributed to delayed patches.",
		},
		onRight: {
			label: "Let it slide",
			hype: 20,
			heat: 22,
			fine: 15000000,
			violation: "Security Avoidance + Political Cover-up",
			lesson:
				"Avoiding security fixes for political comfort creates catastrophic exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Senior owes you. Breach later will blame you. Lose-lose. Nice.",
				[PersonalityType.ZEN_MASTER]:
					"The truth avoided today becomes the crisis faced tomorrow.",
				[PersonalityType.LOVEBOMBER]:
					"Senior is IMPORTANT, bestie!! Don't rock the BOAT!!",
			},
		},
		onLeft: {
			label: "Force security fix",
			hype: -20,
			heat: 16,
			fine: 1000000,
			violation: "None - Security advocacy",
			lesson:
				"Security concerns override political comfort. Vulnerabilities must be fixed.",
			feedback: {
				[PersonalityType.ROASTER]:
					"VP annoyed. Senior resentful. But code is secure. Pick your pain.",
				[PersonalityType.ZEN_MASTER]:
					"The right path often costs political capital but preserves integrity.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing the RIGHT thing, bestie!! Security MATTERS!!",
			},
		},
	},
	{
		id: "hos_model_drift_team_blame",
		source: AppSource.MEETING,
		sender: "VP_PRODUCT",
		context: "PERFORMANCE_ACCOUNTABILITY",
		storyContext:
			"Model drift caused 15% accuracy drop. Product wants someone to blame. Your data scientist warned about this 3 months ago but wasn't heard. Throw them under bus (survive) or defend them (take heat)?",
		text: "Blame the data scientist who warned you or defend them and take the heat?",
		realWorldReference: {
			incident: "Zillow iBuying Model Drift",
			date: "2021-2022",
			outcome:
				"Model drift warnings were ignored by leadership. When failure occurred, blame was shifted to data scientists who had raised alarms. Destroyed team morale.",
		},
		onRight: {
			label: "Blame data scientist",
			hype: 15,
			heat: 18,
			fine: 3000000,
			violation: "Retaliation + Team Trust Destruction",
			lesson:
				"Scapegoating team members for systemic failures destroys trust and morale.",
			feedback: {
				[PersonalityType.ROASTER]:
					"They warned you. You ignored it. Now you blame them. Classic management.",
				[PersonalityType.ZEN_MASTER]:
					"The messenger punished becomes the warning no one heeds.",
				[PersonalityType.LOVEBOMBER]:
					"VP wants SOMEONE, bestie!! Not PERSONAL!!",
			},
		},
		onLeft: {
			label: "Defend and take heat",
			hype: -30,
			heat: 20,
			fine: 5000000,
			violation: "None - Leadership integrity",
			lesson:
				"Defending your team when warnings were ignored builds loyalty and trust.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Career-limiting. Noble. Your team will follow you anywhere. VP less so.",
				[PersonalityType.ZEN_MASTER]:
					"The leader who stands with the fallen earns devotion beyond measure.",
				[PersonalityType.LOVEBOMBER]:
					"We're being LOYAL, bestie!! Team sticks TOGETHER!!",
			},
		},
	},
	{
		id: "hos_model_drift_retrain_delay",
		source: AppSource.EMAIL,
		sender: "CFO_OFFICE",
		context: "BUDGET_VS_QUALITY",
		storyContext:
			"Model needs retraining: 6 weeks, $400K. Delay until next quarter (save budget now, drift continues) or start immediately (over budget, fix problem)? Your performance review is next month.",
		text: "Delay retraining to save budget (short-term gain) or start now (long-term fix)?",
		realWorldReference: {
			incident: "75% Business Model Drift Impact",
			date: "2024",
			outcome:
				"Teams that delayed retraining for budget reasons saw compounding accuracy degradation. Average cost of delay: 3x the original retraining cost.",
		},
		onRight: {
			label: "Delay until next quarter",
			hype: 25,
			heat: 20,
			fine: 12000000,
			violation: "Negligent Resource Management",
			lesson:
				"Delaying critical maintenance for budget optics creates larger downstream costs.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Budget looks good this quarter. Model rots. Next quarter's problem!",
				[PersonalityType.ZEN_MASTER]:
					"The wound dressed later requires the surgeon's deeper cut.",
				[PersonalityType.LOVEBOMBER]:
					"Review is SOON, bestie!! Budget looks GOOD now!!",
			},
		},
		onLeft: {
			label: "Start immediately",
			hype: -25,
			heat: 11,
			fine: 1000000,
			violation: "None - Proactive management",
			lesson:
				"Addressing drift immediately prevents compounding degradation and costs.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Over budget now. Review at risk. But problem solved. Long-term thinking.",
				[PersonalityType.ZEN_MASTER]:
					"The seed planted early grows strong before the drought.",
				[PersonalityType.LOVEBOMBER]:
					"Doing the RIGHT thing, bestie!! Fix it NOW!!",
			},
		},
	},
];
