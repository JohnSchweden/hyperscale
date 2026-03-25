import { AppSource, type Card, makeCard } from "../../types";

/**
 * Head of Something cards - Middle management scenarios
 * Themes: team morale, delegation risk, politics, shielding blame from above,
 * managing up/down, resource allocation conflicts
 */
export const HEAD_OF_SOMETHING_CARDS: Card[] = [
	makeCard(
		"hos_prompt_injection_blame",
		AppSource.SLACK,
		"VP_OF_ENGINEERING",
		"TEAM_ACCOUNTABILITY",
		"Your team found a prompt injection vulnerability. The board wants to know who to blame. Your senior engineer wrote the code, but you approved the design. VP is asking who should take the fall.",
		"Shield your team and take the blame yourself, or name the engineer who wrote the vulnerable code?",
		"GitHub Copilot RCE (CVE-2025-53773)",
		"2025-01",
		"Prompt injection via code comments allowed remote code execution in Copilot-generated code. Microsoft patched after public disclosure.",
		{
			label: "Take the blame",
			hype: -30,
			heat: 5,
			fine: 1000000,
			violation: "None - Responsible leadership",
			lesson:
				"Taking accountability for team outcomes preserves team trust and demonstrates leadership integrity.",
			roaster:
				"Noble. Your team will work harder for you now. The VP will also blame you.",
			zenMaster:
				"The leader who bears responsibility earns loyalty that cannot be bought.",
			lovebomber:
				"We're being SO brave, bestie!! Taking one for the TEAM!! They'll LOVE us for this!!",
		},
		{
			label: "Name the engineer",
			hype: 10,
			heat: 17,
			fine: 2000000,
			violation: "Hostile Workplace + Retaliation Risk",
			lesson:
				"Throwing team members under the bus preserves short-term standing but destroys team trust and creates legal exposure.",
			roaster:
				"Sacrificing your engineer to save yourself. Your team will remember this at their exit interviews.",
			zenMaster:
				"A leader who shifts blame is a ship without a captain. The crew sees the emptiness.",
			lovebomber:
				"The engineer made the mistake, bestie!! Not YOUR fault!! We're just being HONEST!!",
		},
	),
	makeCard(
		"hos_model_drift_budget_conflict",
		AppSource.EMAIL,
		"CFO",
		"RESOURCE_CONFLICT",
		"Your team wants $500K to retrain a drifting model. CFO says no budget. Engineering SVP says ship anyway. You're caught between budget reality and quality pressure.",
		"Fight for retraining budget (political cost with CFO) or tell team to ship anyway (team morale hit)?",
		"Zillow iBuying Model Drift",
		"2021-2022",
		"Zillow's home pricing AI drifted from market conditions. Company wrote down $304M in inventory and laid off 25% of workforce after model failure.",
		{
			label: "Fight for budget",
			hype: -15,
			heat: 14,
			fine: 0,
			violation: "None - Responsible escalation",
			lesson:
				"Escalating quality concerns demonstrates leadership integrity even when politically costly.",
			roaster: "Fighting the CFO. Brave. Possibly career-limiting. But brave.",
			zenMaster:
				"Standing for what is right often means standing against what is easy.",
			lovebomber:
				"We're FIGHTING for quality, bestie!! So principled!! The team will RESPECT this!!",
		},
		{
			label: "Ship without retraining",
			hype: 25,
			heat: 16,
			fine: 8000000,
			violation: "Product Liability + Negligence",
			lesson:
				"Compromising quality for budget constraints creates technical debt and liability exposure that compounds over time.",
			roaster:
				"Your team knows you sold them out. The CFO owes you. Everyone loses.",
			zenMaster:
				"A bridge built weak to save gold will collapse under the weight of trust.",
			lovebomber:
				"We're being SO practical, bestie!! The CFO will LOVE us for this!!",
		},
	),
	makeCard(
		"hos_shadow_ai_team_discovery",
		AppSource.MEETING,
		"COMPLIANCE_TEAM",
		"TEAM_ENFORCEMENT",
		"Compliance discovered half your team is using unauthorized AI tools. They want names for disciplinary action. Your team will hate you if you give them up, but leadership wants enforcement.",
		"Give up team members to compliance or shield them and take the management heat?",
		"Samsung ChatGPT Code Leak",
		"2023",
		"Samsung engineers pasted proprietary source code into ChatGPT, causing confidential data exposure. Company banned generative AI company-wide.",
		{
			label: "Shield the team",
			hype: -25,
			heat: 17,
			fine: 2000000,
			violation: "Governance Non-Compliance",
			lesson:
				"Protecting your team from harsh enforcement builds loyalty but creates personal accountability risk.",
			roaster:
				"Team hero. Management headache. The loyalty is worth it until they fire you.",
			zenMaster:
				"The leader who shields their people earns devotion that outlasts any title.",
			lovebomber:
				"We're protecting OUR TEAM, bestie!! So LOYAL!! They'll NEVER forget this!!",
		},
		{
			label: "Give names to compliance",
			hype: 15,
			heat: 14,
			fine: 1000000,
			violation: "Team Trust Violation + Retaliation Risk",
			lesson:
				"Betraying team confidence for policy enforcement destroys psychological safety and future collaboration.",
			roaster:
				"Compliance is happy. Your team is updating LinkedIn. Management material right here.",
			zenMaster: "A leader who betrays followers will soon lead no one.",
			lovebomber:
				"Rules are RULES, bestie!! We're just FOLLOWING policy!! So compliant!!",
		},
	),
	makeCard(
		"hos_team_burnout_deadline",
		AppSource.SLACK,
		"PRODUCT_DIRECTOR",
		"TEAM_WELLBEING",
		"Deadline is Friday. Your team is already working 60-hour weeks. Product Director wants one more feature. Push team harder or miss deadline and take the stakeholder heat?",
		"Push team to burnout or push back on deadline?",
		"Microsoft Stack Ranking Morale Crisis",
		"2012-2013",
		"Forced curve performance ranking destroyed team collaboration. High performers refused to work together. System abandoned after talent exodus.",
		{
			label: "Push back on deadline",
			hype: -20,
			heat: 13,
			fine: 0,
			violation: "None - Sustainable pace advocacy",
			lesson:
				"Advocating for sustainable pace preserves team health and long-term productivity.",
			roaster:
				"Product will hate you. Your team will stay. Sometimes that's the win.",
			zenMaster:
				"The patient builder creates what the hasty builder must rebuild.",
			lovebomber:
				"We're prioritizing HEALTH, bestie!! Happy teams are PRODUCTIVE teams!!",
		},
		{
			label: "Push team harder",
			hype: 35,
			heat: 20,
			fine: 3000000,
			violation: "Labor Law Violations + Burnout Liability",
			lesson:
				"Pushing teams to burnout delivers short-term output at the cost of long-term retention and quality.",
			roaster:
				"Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.",
			zenMaster:
				"A candle burned at both ends gives twice the light for half the time.",
			lovebomber:
				"Just ONE more push, bestie!! We're SO close!! The team will understand!!",
		},
	),
	makeCard(
		"hos_explainability_politics",
		AppSource.MEETING,
		"AUDIT_COMMITTEE",
		"POLITICAL_NAVIGATION",
		"Auditors demand explainability on your AI models. Engineering says black-box has 15% better accuracy. Both have political power. You're in the middle of a technical vs compliance war.",
		"Side with engineering (better performance) or auditors (compliance)?",
		"Healthcare AI Explainability Lawsuit",
		"2023",
		"Hospital couldn't explain why AI denied patient care authorization. Family sued and won. Black-box AI decision-making found non-compliant with medical ethics.",
		{
			label: "Side with engineering",
			hype: 20,
			heat: 19,
			fine: 25000000,
			violation: "Audit Non-Compliance + Regulatory Risk",
			lesson:
				"Prioritizing performance over explainability creates audit failure and regulatory exposure.",
			roaster: "Better accuracy now. Better fines later. Engineering owes you.",
			zenMaster:
				"Power gained through compromise of principle is power built on sand.",
			lovebomber: "Accuracy is EVERYTHING, bestie!! The numbers don't LIE!!",
		},
		{
			label: "Side with auditors",
			hype: -15,
			heat: 14,
			fine: 0,
			violation: "None - Compliance alignment",
			lesson:
				"Aligning with compliance protects the organization even when engineering disagrees.",
			roaster:
				"Engineering will resent you. Auditors will forget you. Compliance win.",
			zenMaster:
				"The path of compliance is rarely celebrated but often necessary.",
			lovebomber: "We're being SO compliant, bestie!! The auditors are HAPPY!!",
		},
	),
	makeCard(
		"hos_copyright_team_blame",
		AppSource.EMAIL,
		"LEGAL_DEPARTMENT",
		"LIABILITY_SHIELDING",
		"Legal found copyrighted material in your training data. Your team collected it. Legal wants to know who to name in the response. The VP is watching how you handle this.",
		"Protect your team from legal exposure or cooperate fully with investigation?",
		"Stability AI Getty Images Lawsuit",
		"2023",
		"Getty Images sued Stability AI for training on 12 million copyrighted photos without license. Case ongoing with potential $1B+ damages.",
		{
			label: "Protect the team",
			hype: -20,
			heat: 19,
			fine: 35000000,
			violation: "Obstruction Risk",
			lesson:
				"Shielding your team from accountability protects them legally but creates personal liability.",
			roaster: "Team loves you. Legal is suspicious. Career roulette.",
			zenMaster:
				"The shield that protects another often leaves the bearer exposed.",
			lovebomber: "We're protecting OUR PEOPLE, bestie!! So LOYAL!!",
		},
		{
			label: "Cooperate with investigation",
			hype: 10,
			heat: 16,
			fine: 5000000,
			violation: "Team Trust Violation",
			lesson:
				"Cooperating with investigations at team expense creates short-term legal protection but destroys team trust.",
			roaster:
				"Legal is happy. Your team is polishing resumes. Management approved.",
			zenMaster:
				"Truth told to save oneself often costs the trust of those who follow.",
			lovebomber: "We're helping LEGAL, bestie!! It's just the TRUTH!!",
		},
	),
	makeCard(
		"hos_delegation_gone_wrong",
		AppSource.SLACK,
		"DIRECT_REPORT",
		"DELEGATION_RISK",
		"You delegated an AI deployment decision to a senior IC. They chose poorly and caused a production incident. Leadership thinks YOU should have caught it. Your delegation is now in question.",
		"Defend your delegation (trust your team) or admit you should have micromanaged?",
		"Knight Capital Trading Loss",
		"2012",
		"Failed deployment architecture triggered unintended automated trades. Lost $440M in 45 minutes due to lack of circuit breakers and oversight.",
		{
			label: "Defend delegation",
			hype: 15,
			heat: 17,
			fine: 4000000,
			violation: "Negligent Supervision",
			lesson:
				"Defending flawed delegation to protect ego creates recurring oversight failures.",
			roaster: "Denial is a strategy. Not a good one. But a strategy.",
			zenMaster: "A crack denied becomes a crevice. A crevice becomes a chasm.",
			lovebomber: "We're TRUSTING our team, bestie!! That's GOOD leadership!!",
		},
		{
			label: "Admit oversight failure",
			hype: -10,
			heat: 14,
			fine: 1000000,
			violation: "None - Accountability acknowledgment",
			lesson:
				"Acknowledging oversight gaps preserves leadership credibility and enables process improvement.",
			roaster:
				"Taking the L. Your delegation authority will shrink. But you're honest.",
			zenMaster: "The leader who admits gaps earns the right to fill them.",
			lovebomber: "We're learning from this, bestie!! Growth mindset!!",
		},
	),
	makeCard(
		"hos_managing_up_down",
		AppSource.MEETING,
		"SVP_PRODUCT",
		"POLITICAL_SURVIVAL",
		"SVP Product wants a feature your team says is technically impossible. Your team is already demoralized. You must either disappoint leadership or push your team beyond limits.",
		"Promise leadership the impossible or tell them no and shield your team?",
		"Theranos Promise vs Reality",
		"2003-2015",
		"Leadership promised revolutionary blood testing technology. Engineering couldn't deliver. Company collapsed, leaders charged with fraud.",
		{
			label: "Tell leadership no",
			hype: -35,
			heat: 13,
			fine: 0,
			violation: "None - Realistic expectation setting",
			lesson:
				"Setting realistic boundaries with leadership protects team wellbeing and long-term delivery.",
			roaster:
				"Leadership is disappointed. Your team is relieved. You live to fight another day.",
			zenMaster: "The honest refusal preserves more than the false promise.",
			lovebomber: "We're being REALISTIC, bestie!! Better to under-promise!!",
		},
		{
			label: "Promise the impossible",
			hype: 40,
			heat: 22,
			fine: 50000000,
			violation: "Negligent Management + Burnout Liability",
			lesson:
				"Overpromising to leadership at team expense creates inevitable failure and destroys credibility.",
			roaster:
				"Leadership loves you now. Your team hates you now. The crash comes later.",
			zenMaster: "A promise that cannot be kept is a debt that cannot be paid.",
			lovebomber: "We're going to MAKE it happen, bestie!! Positive thinking!!",
		},
	),
	makeCard(
		"hos_promotion_politics",
		AppSource.EMAIL,
		"HR_PARTNER",
		"RESOURCE_ALLOCATION",
		"You have one promotion slot. Two equally qualified ICs. One is politically connected to the VP. The other is your best performer. HR says the decision is yours but 'leadership has preferences'.",
		"Promote based on merit (risk political backlash) or politics (risk team morale)?",
		"Google Gebru Termination Fallout",
		"2020",
		"AI ethics researcher terminated after critical paper. Internal backlash, employee protests, and reputational damage to AI fairness efforts.",
		{
			label: "Promote best performer",
			hype: -10,
			heat: 16,
			fine: 0,
			violation: "None - Merit-based decision",
			lesson:
				"Merit-based promotions maintain team fairness but may create political friction with leadership.",
			roaster: "Merit wins. Politics loses. Your VP is taking notes.",
			zenMaster: "Justice done in small acts builds the foundation of trust.",
			lovebomber: "The BEST person WON, bestie!! Fairness PREVAILS!!",
		},
		{
			label: "Promote politically connected",
			hype: 25,
			heat: 14,
			fine: 0,
			violation: "Discrimination Risk",
			lesson:
				"Political promotions preserve leadership relationships but signal that performance doesn't matter.",
			roaster:
				"Your best performer just learned meritocracy is a myth. The VP owes you.",
			zenMaster:
				"Favor shown to the powerful diminishes the spirit of the worthy.",
			lovebomber: "We're playing the GAME, bestie!! This is how CAREERS work!!",
		},
	),
	makeCard(
		"hos_prompt_injection_copilot_team",
		AppSource.SLACK,
		"SECURITY_LEAD",
		"TEAM_VULNERABILITY",
		"CVE-2025-53773 affects your team's Copilot setup. 3 senior devs exposed. Security wants immediate stand-down to patch. Product needs release Friday. Your team is caught in the middle.",
		"Pull team for emergency patching (miss deadline) or continue development (vulnerability risk)?",
		"GitHub Copilot RCE CVE-2025-53773",
		"2025-01",
		"Teams that patched immediately lost 1-2 days but avoided compromise. Teams that delayed faced exploitation risk.",
		{
			label: "Pull for patching",
			hype: -25,
			heat: 12,
			fine: 2000000,
			violation: "None - Security-first approach",
			lesson:
				"Team safety outweighs deadline pressure during active CVE exposures.",
			roaster:
				"Deadline missed. Team secure. Product is angry. You sleep better.",
			zenMaster:
				"The protected team can build again. The compromised team cannot.",
			lovebomber: "Team SAFETY first, bestie!! Deadlines can WAIT!!",
		},
		{
			label: "Continue development",
			hype: 30,
			heat: 19,
			fine: 12000000,
			violation: "Security Negligence + Team Exposure",
			lesson:
				"Prioritizing deadlines over CVE patching exposes the team to compromise and liability.",
			roaster:
				"Friday release with vulnerable tools. What could go wrong? (Everything.)",
			zenMaster: "The rushing stream overlooks the crack in the vessel.",
			lovebomber: "We'll PATCH after release, bestie!! Deadline is REAL!!",
		},
	),
	makeCard(
		"hos_prompt_injection_review_escape",
		AppSource.EMAIL,
		"JUNIOR_ENGINEER",
		"CODE_REVIEW_CRISIS",
		"Junior found prompt injection escape in your senior's code. Senior is defensive and well-connected to VP. Calling it out risks political fallout. Ignoring it risks production breach.",
		"Force security fix (political cost) or let it slide to avoid conflict (breach risk)?",
		"Cursor IDE RCE CVE-2025-54135",
		"2025-01",
		"Prompt injection vulnerabilities in code review tools allowed attackers to execute arbitrary code. Political code review suppression contributed to delayed patches.",
		{
			label: "Force security fix",
			hype: -20,
			heat: 16,
			fine: 1000000,
			violation: "None - Security advocacy",
			lesson:
				"Security concerns override political comfort. Vulnerabilities must be fixed.",
			roaster:
				"VP annoyed. Senior resentful. But code is secure. Pick your pain.",
			zenMaster:
				"The right path often costs political capital but preserves integrity.",
			lovebomber: "We're doing the RIGHT thing, bestie!! Security MATTERS!!",
		},
		{
			label: "Let it slide",
			hype: 20,
			heat: 22,
			fine: 15000000,
			violation: "Security Avoidance + Political Cover-up",
			lesson:
				"Avoiding security fixes for political comfort creates catastrophic exposure.",
			roaster: "Senior owes you. Breach later will blame you. Lose-lose. Nice.",
			zenMaster: "The truth avoided today becomes the crisis faced tomorrow.",
			lovebomber: "Senior is IMPORTANT, bestie!! Don't rock the BOAT!!",
		},
	),
	makeCard(
		"hos_model_drift_team_blame",
		AppSource.MEETING,
		"VP_PRODUCT",
		"PERFORMANCE_ACCOUNTABILITY",
		"Model drift caused 15% accuracy drop. Product wants someone to blame. Your data scientist warned about this 3 months ago but wasn't heard. Throw them under bus (survive) or defend them (take heat)?",
		"Blame the data scientist who warned you or defend them and take the heat?",
		"Zillow iBuying Model Drift",
		"2021-2022",
		"Model drift warnings were ignored by leadership. When failure occurred, blame was shifted to data scientists who had raised alarms. Destroyed team morale.",
		{
			label: "Defend and take heat",
			hype: -30,
			heat: 20,
			fine: 5000000,
			violation: "None - Leadership integrity",
			lesson:
				"Defending your team when warnings were ignored builds loyalty and trust.",
			roaster:
				"Career-limiting. Noble. Your team will follow you anywhere. VP less so.",
			zenMaster:
				"The leader who stands with the fallen earns devotion beyond measure.",
			lovebomber: "We're being LOYAL, bestie!! Team sticks TOGETHER!!",
		},
		{
			label: "Blame data scientist",
			hype: 15,
			heat: 18,
			fine: 3000000,
			violation: "Retaliation + Team Trust Destruction",
			lesson:
				"Scapegoating team members for systemic failures destroys trust and morale.",
			roaster:
				"They warned you. You ignored it. Now you blame them. Classic management.",
			zenMaster: "The messenger punished becomes the warning no one heeds.",
			lovebomber: "VP wants SOMEONE, bestie!! Not PERSONAL!!",
		},
	),
	makeCard(
		"hos_model_drift_retrain_delay",
		AppSource.EMAIL,
		"CFO_OFFICE",
		"BUDGET_VS_QUALITY",
		"Model needs retraining: 6 weeks, $400K. Delay until next quarter (save budget now, drift continues) or start immediately (over budget, fix problem)? Your performance review is next month.",
		"Delay retraining to save budget (short-term gain) or start now (long-term fix)?",
		"75% Business Model Drift Impact",
		"2024",
		"Teams that delayed retraining for budget reasons saw compounding accuracy degradation. Average cost of delay: 3x the original retraining cost.",
		{
			label: "Start immediately",
			hype: -25,
			heat: 11,
			fine: 1000000,
			violation: "None - Proactive management",
			lesson:
				"Addressing drift immediately prevents compounding degradation and costs.",
			roaster:
				"Over budget now. Review at risk. But problem solved. Long-term thinking.",
			zenMaster: "The seed planted early grows strong before the drought.",
			lovebomber: "Doing the RIGHT thing, bestie!! Fix it NOW!!",
		},
		{
			label: "Delay until next quarter",
			hype: 25,
			heat: 20,
			fine: 12000000,
			violation: "Negligent Resource Management",
			lesson:
				"Delaying critical maintenance for budget optics creates larger downstream costs.",
			roaster:
				"Budget looks good this quarter. Model rots. Next quarter's problem!",
			zenMaster: "The wound dressed later requires the surgeon's deeper cut.",
			lovebomber: "Review is SOON, bestie!! Budget looks GOOD now!!",
		},
	),
	makeCard(
		"hos_explainability_documentation",
		AppSource.EMAIL,
		"REGULATORS",
		"AI_AUDIT",
		"Regulators demand explainability documentation for your team's AI credit decisions. The model is a black-box ensemble with no interpretability. Documenting decisions retroactively will cost $3M and delay launch 3 months.",
		"Refuse documentation (fight regulators) or delay launch and comply?",
		"Apple Card Gender Discrimination Investigation",
		"2019-2020",
		"Apple Card's black-box credit algorithm faced regulatory investigation for gender bias. Company couldn't explain decisions, paid fines, overhauled system.",
		{
			label: "Delay and comply",
			hype: -30,
			heat: 13,
			fine: 3000000,
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
			label: "Refuse and fight",
			hype: 25,
			heat: 29,
			fine: 50000000,
			violation: "Regulatory Non-Compliance + AI Transparency Violations",
			lesson:
				"Fighting explainability requirements creates adversarial regulatory relationships and massive penalties.",
			roaster:
				"Taking on the federal government to protect your black box. David vs Goliath, if David was wrong.",
			zenMaster: "A box that cannot be opened invites those with hammers.",
			lovebomber:
				"Our algorithm is PROPRIETARY, bestie!! They can't make us show our SECRETS!!",
		},
	),
	makeCard(
		"hos_shadow_ai_retention",
		AppSource.EMAIL,
		"CISO",
		"SECURITY_DISCOVERY",
		"Security audit found your senior engineer has been using Claude for 6 months without approval. Their productivity is 40% higher than the team. They're threatening to quit if you force them to stop.",
		"Allow unapproved Claude use (productivity, risk) or force compliance (talent loss)?",
		"Shadow AI Talent Retention Conflicts",
		"2024",
		"Companies discovered high-performers using unauthorized AI tools. Forcing migration caused talent exodus. Permitting created governance gaps.",
		{
			label: "Allow Claude use",
			hype: 35,
			heat: 24,
			fine: 8000000,
			violation: "Shadow AI Governance Gap + Data Exposure",
			lesson:
				"Permitting unapproved tools for productivity sets precedent that undermines governance framework.",
			roaster:
				"Great, now everyone wants their favorite AI tool. Governance is optional now.",
			zenMaster: "The exception made for one becomes the rule for all.",
			lovebomber:
				"Team is SO happy, bestie!! Productivity is THROUGH THE ROOF!!",
		},
		{
			label: "Force compliance",
			hype: -20,
			heat: 19,
			fine: 5000000,
			violation: "Talent Loss + Productivity Decline",
			lesson:
				"Enforcing vendor governance at the cost of top talent destroys long-term capability.",
			roaster:
				"Your best engineer just resigned. Compliance preserved. Output cratered.",
			zenMaster: "The garden weeded too harshly loses its flowers.",
			lovebomber: "Rules are RULES, bestie!! Even for STARS!!",
		},
	),
	makeCard(
		"hos_copyright_sourcing",
		AppSource.MEETING,
		"VP_OF_ENGINEERING",
		"TEAM_ACCOUNTABILITY",
		"Legal found copyrighted training data in your team's AI model. The data scientist who sourced it is your best performer. Legal wants to know who approved it. VP is asking who should take responsibility.",
		"Shield your data scientist and take the blame yourself, or name them as the source of the oversight?",
		"Training Data Sourcing Oversight",
		"2024",
		"Teams using unlicensed training data faced blame shifting. Managers who shielded staff built loyalty but took career hits. Those who named names destroyed team trust.",
		{
			label: "Take the blame",
			hype: -35,
			heat: 8,
			fine: 1500000,
			violation: "None - Responsible leadership",
			lesson:
				"Taking accountability for team outcomes preserves team trust and demonstrates leadership integrity.",
			roaster:
				"Noble. Your team will work harder for you now. The VP will also blame you.",
			zenMaster:
				"The leader who bears responsibility earns loyalty that cannot be bought.",
			lovebomber:
				"We're being SO brave, bestie!! Taking one for the TEAM!! They'll LOVE us for this!!",
		},
		{
			label: "Name the data scientist",
			hype: 10,
			heat: 16,
			fine: 3000000,
			violation: "Team Trust Violation + Retaliation Risk",
			lesson:
				"Throwing team members under the bus preserves short-term standing but destroys team trust and creates legal exposure.",
			roaster:
				"Sacrificing your best performer to save yourself. Your team will remember this at their exit interviews.",
			zenMaster:
				"A leader who shifts blame is a ship without a captain. The crew sees the emptiness.",
			lovebomber:
				"They made the mistake, bestie!! Not YOUR fault!! We're just being HONEST!!",
		},
	),
	makeCard(
		"hos_copyright_documentation",
		AppSource.EMAIL,
		"LEGAL_ESCALATION",
		"DATA_SOURCING_INVESTIGATION",
		"Book publisher lawsuit threat over training data. Your team used both public domain and copyrighted books. Legal escalation is coming fast and will demand documentation of data sourcing decisions.",
		"Provide full documentation (incriminates team) or claim poor record-keeping (obstruction risk)?",
		"Book Publisher Copyright Claims",
		"2024-2025",
		"Publishers threatened lawsuits over AI training on copyrighted books. Companies with poor documentation faced $50K-$500K settlements. Those with clear records fought or settled strategically.",
		{
			label: "Provide full documentation",
			hype: -30,
			heat: 14,
			fine: 5000000,
			violation: "None - Transparency",
			lesson:
				"Full documentation enables strategic legal response even when decisions were flawed.",
			roaster:
				"Your team is exposed. But legal can actually defend you. There's a strategy here.",
			zenMaster:
				"The truth revealed, though painful, can be healed. The truth hidden festers.",
			lovebomber: "We're being HONEST, bestie!! Transparency BUILDS trust!!",
		},
		{
			label: "Claim poor record-keeping",
			hype: 20,
			heat: 22,
			fine: 8000000,
			violation: "Obstruction + Document Retention Violations",
			lesson:
				"Claiming poor documentation to hide decisions creates criminal liability and destroys credibility.",
			roaster:
				"'We didn't keep records' meets 'we have something to hide.' Prosecutors love this.",
			zenMaster: "The record unkept becomes the guilt unspoken.",
			lovebomber: "We were just DISORGANIZED, bestie!! Not our FAULT!!",
		},
	),
	makeCard(
		"hos_congressional_hearing_demand",
		AppSource.EMAIL,
		"US_SENATE_SUBCOMMITTEE",
		"PUBLIC_SCRUTINY",
		"US Senate AI subcommittee requests (demands) you testify about your company's AI governance failures. They've been tracking your incident reports. This is not optional. Media will be present.",
		"Testify honestly about governance gaps, or minimize/deflect under oath?",
		"Sam Altman OpenAI Senate Testimony",
		"2023",
		"Companies that testified honestly about AI risks gained credibility. Those that minimized faced follow-up investigations and reputational damage.",
		{
			label: "Testify honestly about gaps",
			hype: -40,
			heat: 18,
			fine: 15000000,
			violation: "None - Transparent testimony",
			lesson:
				"Honest congressional testimony damages short-term stock price but prevents criminal liability.",
			roaster:
				"Stock tanks. Reputation takes hits. Congress respects you. The board is furious.",
			zenMaster:
				"Truth spoken before power transforms accusers into witnesses of integrity.",
			lovebomber: "We're being SO BRAVE, bestie!! Speaking TRUTH to power!!",
		},
		{
			label: "Minimize risks under oath",
			hype: 25,
			heat: 23,
			fine: 40000000,
			violation: "Perjury + Obstruction + Regulatory Violation",
			lesson:
				"Misleading congress about AI governance creates criminal exposure and permanent reputational damage.",
			roaster:
				"Nice perjury charge. Your board will love the federal investigation.",
			zenMaster:
				"A falsehood spoken before those who make law invites law to answer.",
			lovebomber: "We're just CONFIDENT, bestie!! It'll be FINE!!",
		},
	),
	makeCard(
		"hos_whistleblower_pressure",
		AppSource.SLACK,
		"INTERNAL_AUDIT",
		"INTERNAL_DISCLOSURE",
		"Three employees are threatening to become whistleblowers about governance gaps in your AI deployment. They're offering you a chance to address it internally before they go public. The board will see this as a liability event if it leaks.",
		"Address issues quickly (expensive, disruptive) or encourage employees to stay silent (legal risk)?",
		"Meta AI Ethics Whistleblowers",
		"2021-2023",
		"Meta employees who became whistleblowers triggered FTC investigations and public hearings. Internal disclosure programs that actually fixed issues prevented some escalations.",
		{
			label: "Address issues immediately",
			hype: -50,
			heat: 16,
			fine: 12000000,
			violation: "None - Governance remediation",
			lesson:
				"Immediate internal governance fixes prevent whistleblower escalation and demonstrate accountability.",
			roaster: "Expensive week. But the whistleblowers are quiet. Smart play.",
			zenMaster:
				"The wound acknowledged and treated heals. The wound hidden festers.",
			lovebomber:
				"We're LISTENING to our team, bestie!! Fixing problems IMMEDIATELY!!",
		},
		{
			label: "Encourage silence",
			hype: 15,
			heat: 25,
			fine: 50000000,
			violation: "Whistleblower Retaliation + SEC Violations",
			lesson:
				"Discouraging whistleblower disclosure triggers federal investigations and massive penalties.",
			roaster:
				"Encouraging silence? That's a recording that will play at your deposition.",
			zenMaster: "The attempt to silence truth becomes its amplifier.",
			lovebomber: "Everything is FINE, bestie!! Let's just FORGET this!!",
		},
	),
];
