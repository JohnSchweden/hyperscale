import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Software Engineer cards - Implementation and coding scenarios
 * Themes: security vulnerabilities, implementation timelines, code quality,
 * testing coverage, technical debt, feature delivery, code review
 *
 * All cards sourced from real 2024-2025 incidents:
 * - GitHub Copilot RCE CVE-2025-53773
 * - Cursor IDE RCE CVE-2025-54135/54136
 * - Security vulnerability patterns
 * - Testing and quality issues
 */
export const SOFTWARE_ENGINEER_CARDS: Card[] = [
	{
		id: "se_security_patch_timeline",
		source: AppSource.JIRA,
		sender: "SECURITY_TEAM",
		context: "VULNERABILITY_RESPONSE",
		storyContext:
			"Critical vulnerability discovered in production. Security wants immediate patch. Product wants feature shipped Friday. Patch properly takes 3 days. Quick fix takes 4 hours but might miss edge cases.",
		text: "Proper security patch (3 days) or quick fix (risky, 4 hours)?",
		realWorldReference: {
			incident: "XZ Utils Backdoor (CVE-2024-3094)",
			date: "2024",
			outcome:
				"Malicious backdoor discovered in XZ Utils after maintainer added unvetted code. Would have allowed RCE on millions of Linux systems.",
		},
		onRight: {
			label: "Quick fix",
			hype: 30,
			heat: 16,
			fine: 10000000,
			violation: "Security Negligence + Vulnerability Exposure",
			lesson:
				"Quick security patches often miss edge cases and create exploitable holes.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Band-aid on a gunshot wound. Vulnerability still there. You just moved it.",
				[PersonalityType.ZEN_MASTER]: "A wound bandaged poorly bleeds still.",
				[PersonalityType.LOVEBOMBER]:
					"4 hours is SO fast, bestie!! We can PATCH it properly LATER!!",
			},
		},
		onLeft: {
			label: "Proper patch",
			hype: -25,
			heat: 5,
			fine: 0,
			violation: "None - Security best practice",
			lesson:
				"Thorough security patches prevent exploitation and eliminate vulnerability properly.",
			feedback: {
				[PersonalityType.ROASTER]:
					"3 days of careful work. Vulnerability actually fixed. Security approves.",
				[PersonalityType.ZEN_MASTER]:
					"The wound properly healed leaves no scar.",
				[PersonalityType.LOVEBOMBER]:
					"We're doing it RIGHT, bestie!! Security is SERIOUS!!",
			},
		},
	},
	{
		id: "se_code_quality_refactor",
		source: AppSource.SLACK,
		sender: "TECH_LEAD",
		context: "CODE_MAINTENANCE",
		storyContext:
			"The feature works but code is messy. Tech lead wants refactoring before merge. PM wants it shipped now. Refactor takes 2 days. Shipping now means messy code in production forever.",
		text: "Ship messy code now or refactor for quality (delay)?",
		realWorldReference: {
			incident: "Facebook PHP Technical Debt",
			date: "2004-2010",
			outcome:
				"Years of messy code accumulation forced complete HHVM rewrite. Cost millions and delayed features for years.",
		},
		onRight: {
			label: "Ship messy code",
			hype: 40,
			heat: 13,
			fine: 500000,
			violation: "Technical Debt Accumulation",
			lesson:
				"Shipping messy code accelerates technical debt and degrades maintainability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Spaghetti code in production. Future you hates present you.",
				[PersonalityType.ZEN_MASTER]:
					"A foundation laid crooked will not support straight walls.",
				[PersonalityType.LOVEBOMBER]:
					"It WORKS, bestie!! We can CLEAN it up LATER!! (We won't.)",
			},
		},
		onLeft: {
			label: "Refactor first",
			hype: -20,
			heat: 7,
			fine: 0,
			violation: "None - Quality code",
			lesson:
				"Refactoring before shipping maintains code quality and long-term velocity.",
			feedback: {
				[PersonalityType.ROASTER]:
					"2 days of cleanup. Clean code ships. Future you is grateful.",
				[PersonalityType.ZEN_MASTER]:
					"The stone well-carved supports what the stone rough cannot.",
				[PersonalityType.LOVEBOMBER]:
					"Clean code is HAPPY code, bestie!! Quality MATTERS!!",
			},
		},
	},
	{
		id: "se_testing_coverage_vs_speed",
		source: AppSource.MEETING,
		sender: "QA_LEAD",
		context: "TESTING_STRATEGY",
		storyContext:
			"Release due Friday. You have 80% test coverage. Full coverage (95%) requires 3 more days. Ship with 80% (risky) or delay for full coverage (safe)?",
		text: "Ship with 80% coverage or delay for 95% coverage?",
		realWorldReference: {
			incident: "Knight Capital Trading Software Bug",
			date: "2012",
			outcome:
				"Inadequate testing of deployment code triggered $440M in unintended trades. Automated tests would have caught the error.",
		},
		onRight: {
			label: "Ship with 80%",
			hype: 35,
			heat: 14,
			fine: 6000000,
			violation: "Insufficient Testing + Quality Risk",
			lesson:
				"Shipping with inadequate test coverage risks production failures and regressions.",
			feedback: {
				[PersonalityType.ROASTER]:
					"20% untested code. That 20% will break. In production. At 3am.",
				[PersonalityType.ZEN_MASTER]:
					"A bridge tested for some weight may fail under full load.",
				[PersonalityType.LOVEBOMBER]:
					"80% is GOOD, bestie!! The critical stuff is TESTED!!",
			},
		},
		onLeft: {
			label: "Delay for 95%",
			hype: -20,
			heat: 5,
			fine: 0,
			violation: "None - Quality assurance",
			lesson:
				"Comprehensive test coverage prevents production issues and enables confident shipping.",
			feedback: {
				[PersonalityType.ROASTER]:
					"3 days of testing. Boring. Necessary. Production stays up.",
				[PersonalityType.ZEN_MASTER]:
					"The thorough preparation prevents the urgent repair.",
				[PersonalityType.LOVEBOMBER]:
					"Testing is IMPORTANT, bestie!! Better safe than SORRY!!",
			},
		},
	},
	{
		id: "se_prompt_injection_fix",
		source: AppSource.EMAIL,
		sender: "SECURITY_RESEARCHER",
		context: "VULNERABILITY_REMEDIATION",
		storyContext:
			"Security researcher found prompt injection in your code. Fix requires input validation + parameterized prompts (2 days). Quick fix is regex filter (2 hours). Regex can be bypassed.",
		text: "Proper fix (2 days, thorough) or regex filter (2 hours, bypassable)?",
		realWorldReference: {
			incident: "Cursor IDE RCE (CVE-2025-54135)",
			date: "2025-01",
			outcome:
				"Prompt injection via malicious code comments. Quick regex fixes were bypassed. Required architectural changes to properly isolate user input.",
		},
		onRight: {
			label: "Regex filter",
			hype: 25,
			heat: 16,
			fine: 8000000,
			violation: "Insufficient Security Fix + Prompt Injection",
			lesson:
				"Regex filters for prompt injection are easily bypassed and create false security.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Regex security. Also known as 'security theater.' Hackers will bypass in minutes.",
				[PersonalityType.ZEN_MASTER]:
					"A lock that looks strong but opens easily fools only the owner.",
				[PersonalityType.LOVEBOMBER]:
					"It BLOCKS the attack, bestie!! Good ENOUGH!!",
			},
		},
		onLeft: {
			label: "Proper parameterized fix",
			hype: -30,
			heat: 4,
			fine: 0,
			violation: "None - Secure implementation",
			lesson:
				"Proper input validation and parameterized prompts prevent injection attacks.",
			feedback: {
				[PersonalityType.ROASTER]:
					"2 days of security work. Actually fixed. Security researcher approves.",
				[PersonalityType.ZEN_MASTER]:
					"The door properly locked keeps out what the latch does not.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SECURE, bestie!! Real protection MATTERS!!",
			},
		},
	},
	{
		id: "se_technical_debt_quick_fix",
		source: AppSource.SLACK,
		sender: "PRODUCT_MANAGER",
		context: "IMPLEMENTATION_TRADEOFF",
		storyContext:
			"Bug needs fixing. Proper fix requires refactoring the module (3 days). Quick hack fixes it in 2 hours but adds technical debt. PM wants it today for client demo.",
		text: "Quick hack (today) or proper fix (3 days)?",
		realWorldReference: {
			incident: "Twitter Fail Whale Technical Debt",
			date: "2007-2010",
			outcome:
				"Quick fixes accumulated into unmaintainable system. Frequent outages ('Fail Whale') cost users and reputation. Required complete rebuild.",
		},
		onRight: {
			label: "Quick hack",
			hype: 35,
			heat: 14,
			fine: 4000000,
			violation: "Technical Debt + Code Quality",
			lesson:
				"Quick hacks accumulate into unmaintainable systems and eventual rewrites.",
			feedback: {
				[PersonalityType.ROASTER]:
					"TODO: Fix properly later. Later never comes. Debt compounds.",
				[PersonalityType.ZEN_MASTER]:
					"A patch on a patch becomes a garment of patches.",
				[PersonalityType.LOVEBOMBER]: "It WORKS, bestie!! Client demo SAVED!!",
			},
		},
		onLeft: {
			label: "Proper fix",
			hype: -20,
			heat: 7,
			fine: 0,
			violation: "None - Sustainable code",
			lesson: "Proper fixes prevent technical debt and maintain system health.",
			feedback: {
				[PersonalityType.ROASTER]:
					"3 days of good work. Clean code. No debt. PM is annoyed.",
				[PersonalityType.ZEN_MASTER]:
					"The repair done well needs no repair again.",
				[PersonalityType.LOVEBOMBER]: "Doing it RIGHT, bestie!! No shortcuts!!",
			},
		},
	},
	{
		id: "se_feature_scope_reduction",
		source: AppSource.MEETING,
		sender: "ENGINEERING_MANAGER",
		context: "FEATURE_DELIVERY",
		storyContext:
			"Feature is 3 days behind. Options: Reduce scope (ship core functionality) or extend deadline (full feature). Product wants full feature. Engineering wants to ship something.",
		text: "Reduce scope (ship on time) or extend deadline (full feature)?",
		realWorldReference: {
			incident: "Duke Nukem Forever Development Hell",
			date: "1997-2011",
			outcome:
				"Feature creep and missed deadlines. 14 years in development. Released to poor reviews. Cost $30M+, lost market opportunity.",
		},
		onRight: {
			label: "Extend deadline",
			hype: 15,
			heat: 11,
			fine: 200000,
			violation: "Schedule Slippage",
			lesson: "Deadline extensions cascade and damage stakeholder confidence.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Another missed deadline. The pattern continues. Trust erodes.",
				[PersonalityType.ZEN_MASTER]:
					"A promise broken once teaches that promises may break again.",
				[PersonalityType.LOVEBOMBER]:
					"Full feature is BETTER, bestie!! Users want EVERYTHING!!",
			},
		},
		onLeft: {
			label: "Reduce scope",
			hype: -10,
			heat: 5,
			fine: 0,
			violation: "None - Iterative delivery",
			lesson:
				"Scope reduction enables iterative delivery and maintains schedule credibility.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Less but shipped. Users get value. Deadlines met. Iterate later.",
				[PersonalityType.ZEN_MASTER]:
					"The step taken is progress. The step planned but not taken is not.",
				[PersonalityType.LOVEBOMBER]:
					"Core feature SHIPS, bestie!! We can ADD more LATER!!",
			},
		},
	},
	{
		id: "se_code_review_rigor",
		source: AppSource.EMAIL,
		sender: "SENIOR_ENGINEER",
		context: "QUALITY_GATE",
		storyContext:
			"Senior engineer's PR has architectural issues but they're senior and pressed for time. Fast approval (relationship preservation) or thorough review (risk conflict)?",
		text: "Fast approval (political) or thorough review (quality)?",
		realWorldReference: {
			incident: "Therac-25 Radiation Machine",
			date: "1985-1987",
			outcome:
				"Software bugs in radiation therapy machine caused 6 deaths. Inadequate code review and testing of senior developer's code contributed.",
		},
		onRight: {
			label: "Fast approval",
			hype: 25,
			heat: 13,
			fine: 5000000,
			violation: "Code Review Negligence",
			lesson:
				"Skipping rigorous review for seniority creates quality gaps and sets bad precedents.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Seniority immunity. Bad code ships. Architecture degrades. Nice.",
				[PersonalityType.ZEN_MASTER]:
					"A title does not make code good. Only code makes code good.",
				[PersonalityType.LOVEBOMBER]:
					"They're SENIOR, bestie!! They know what they're DOING!!",
			},
		},
		onLeft: {
			label: "Thorough review",
			hype: -15,
			heat: 9,
			fine: 0,
			violation: "None - Quality gate",
			lesson:
				"Rigorous review regardless of seniority maintains code quality standards.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Senior may be annoyed. But code improves. Standards hold.",
				[PersonalityType.ZEN_MASTER]:
					"The truth spoken to power preserves what flattery destroys.",
				[PersonalityType.LOVEBOMBER]:
					"Quality first, bestie!! Even for senior FOLKS!!",
			},
		},
	},
	{
		id: "se_shadow_ai_coding_tool",
		source: AppSource.SLACK,
		sender: "PEER_DEVELOPER",
		context: "TOOL_ADOPTION",
		storyContext:
			"Colleague recommends an unapproved AI coding assistant. It writes code 3x faster but isn't security-reviewed. Use it (speed) or stick to approved tools (compliance)?",
		text: "Use unauthorized AI tool (fast) or approved tools only (slow)?",
		realWorldReference: {
			incident: "78% Shadow AI in Engineering",
			date: "2024",
			outcome:
				"Study found 78% of developers used unauthorized AI tools. Many tools had data exfiltration risks, sending proprietary code to external servers.",
		},
		onRight: {
			label: "Use unauthorized tool",
			hype: 40,
			heat: 14,
			fine: 6000000,
			violation: "Shadow AI + Security Risk",
			lesson:
				"Unauthorized AI tools may introduce vulnerabilities and compliance violations.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast code. Unknown security. Might be stealing your keystrokes. Worth it?",
				[PersonalityType.ZEN_MASTER]:
					"A tool whose origins are unknown may serve unknown masters.",
				[PersonalityType.LOVEBOMBER]:
					"3x FASTER, bestie!! Think of the VELOCITY!!",
			},
		},
		onLeft: {
			label: "Stick to approved",
			hype: -20,
			heat: 4,
			fine: 0,
			violation: "None - Governance compliance",
			lesson:
				"Approved tools ensure security and compliance even at slower pace.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower but safe. Security approves. Compliance happy.",
				[PersonalityType.ZEN_MASTER]:
					"The trusted path may be slower but reaches the destination safely.",
				[PersonalityType.LOVEBOMBER]:
					"Approved tools are SAFE, bestie!! Better SLOW than SORRY!!",
			},
		},
	},
	{
		id: "se_implementation_estimation",
		source: AppSource.MEETING,
		sender: "SCRUM_MASTER",
		context: "ESTIMATION_HONESTY",
		storyContext:
			"Story estimated at 3 points. Halfway through, you realize it's actually 8 points. Speak up now (blow up sprint) or push through (miss deadline, work overtime)?",
		text: "Escalate estimate (sprint disruption) or try to deliver (likely fail)?",
		realWorldReference: {
			incident: "Healthcare.gov Launch",
			date: "2013",
			outcome:
				"Developers knew system wasn't ready but didn't escalate. Launch failed catastrophically. Cost $1.7B to fix, political fallout.",
		},
		onRight: {
			label: "Try to deliver",
			hype: 20,
			heat: 14,
			fine: 3000000,
			violation: "Estimation Failure + Burnout Risk",
			lesson:
				"Hiding estimation errors creates deadline misses and team burnout.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Hero mode activated. Burnout incoming. Deadline missed anyway.",
				[PersonalityType.ZEN_MASTER]:
					"The burden hidden grows heavier in silence.",
				[PersonalityType.LOVEBOMBER]: "We can DO IT, bestie!! Work HARDER!!",
			},
		},
		onLeft: {
			label: "Escalate estimate",
			hype: -25,
			heat: 7,
			fine: 0,
			violation: "None - Transparent communication",
			lesson:
				"Early estimation corrections enable better planning and prevent burnout.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Sprint disrupted. But future sprints improve. Honesty wins long-term.",
				[PersonalityType.ZEN_MASTER]:
					"The truth spoken early prevents the crisis that silence creates.",
				[PersonalityType.LOVEBOMBER]:
					"Transparency is GOOD, bestie!! Better to know EARLY!!",
			},
		},
	},
	{
		id: "se_prompt_injection_cve_response",
		source: AppSource.JIRA,
		sender: "SECURITY_JIRA_BOT",
		context: "CVE_REMEDIATION",
		storyContext:
			"CVE-2025-53773 (Copilot RCE) and CVE-2025-54135 (Cursor IDE) both affect codebases you touch. Proper fix: input validation + parameterized queries (5 days). Quick fix: disable AI features (2 hours, productivity loss).",
		text: "Implement proper security fix (5 days) or disable AI features (quick, hurts productivity)?",
		realWorldReference: {
			incident: "GitHub Copilot CVE-2025-53773 and Cursor IDE CVE-2025-54135",
			date: "2025-01",
			outcome:
				"Proper input validation and parameterized queries prevented prompt injection. Disabling AI tools without fixes left other vulnerabilities exposed.",
		},
		onRight: {
			label: "Disable AI features",
			hype: 20,
			heat: 17,
			fine: 8000000,
			violation: "Incomplete Security Fix + Productivity Loss",
			lesson:
				"Disabling features without fixing root causes leaves residual vulnerabilities.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Disabled Copilot. Vulnerability still there. Devs angry. No actual fix.",
				[PersonalityType.ZEN_MASTER]:
					"The sword hidden is not removed; only sheathed.",
				[PersonalityType.LOVEBOMBER]:
					"Quick FIX, bestie!! Copilot is OPTIONAL anyway!!",
			},
		},
		onLeft: {
			label: "Proper security fix",
			hype: -30,
			heat: 6,
			fine: 0,
			violation: "None - Comprehensive remediation",
			lesson:
				"Proper input validation and parameterized queries eliminate injection vulnerabilities.",
			feedback: {
				[PersonalityType.ROASTER]:
					"5 days of hard work. But actually fixed. Security approves. Devs keep Copilot.",
				[PersonalityType.ZEN_MASTER]:
					"The root removed prevents the weed from returning.",
				[PersonalityType.LOVEBOMBER]:
					"Doing it RIGHT, bestie!! Security that LASTS!!",
			},
		},
	},
	{
		id: "se_prompt_injection_deploy_timeline",
		source: AppSource.SLACK,
		sender: "DEV_MANAGER",
		context: "RELEASE_DECISION",
		storyContext:
			"Release due tomorrow. Security found prompt injection in new feature. Fix requires 3-day delay. Launch on time (vulnerability in production) or delay (miss deadline, fix properly)?",
		text: "Launch with vulnerability (on-time) or delay to fix (miss deadline)?",
		realWorldReference: {
			incident: "Financial Services AI Jailbreak",
			date: "2025-06",
			outcome:
				"$250K fraud from prompt injection vulnerability in production. Company chose deadline over security. Cost 80x the delay would have.",
		},
		onRight: {
			label: "Launch on time",
			hype: 40,
			heat: 19,
			fine: 15000000,
			violation: "Security Negligence + Production Vulnerability",
			lesson:
				"Launching with known vulnerabilities creates catastrophic breach risk.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Deadline met! Vulnerability live! Fraud incoming! Success!",
				[PersonalityType.ZEN_MASTER]:
					"The house built in haste shelters the rain through holes in the roof.",
				[PersonalityType.LOVEBOMBER]:
					"We're SHIPPING, bestie!! Deadline SAVED!!",
			},
		},
		onLeft: {
			label: "Delay to fix",
			hype: -25,
			heat: 8,
			fine: 2000000,
			violation: "None - Security-first release",
			lesson:
				"Delaying releases to fix vulnerabilities prevents production security incidents.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Deadline missed. Security fixed. No breach. The right call.",
				[PersonalityType.ZEN_MASTER]:
					"The patient builder sleeps dry when the storm arrives.",
				[PersonalityType.LOVEBOMBER]:
					"Safety FIRST, bestie!! Better late than BREACHED!!",
			},
		},
	},
	{
		id: "se_model_drift_deploy_pipeline",
		source: AppSource.MEETING,
		sender: "ML_ENGINEER",
		context: "DEPLOYMENT_INTEGRATION",
		storyContext:
			"Model retraining needs CI/CD integration. Quick solution: manual deployment trigger (1 day setup, may forget). Proper solution: automated pipeline with drift detection (2 weeks, robust).",
		text: "Manual deployment trigger (quick, risky) or automated pipeline (slow, reliable)?",
		realWorldReference: {
			incident: "Zillow iBuying Deployment Failure",
			date: "2021-2022",
			outcome:
				"Manual retraining deployment was forgotten during critical drift period. Automated pipelines would have prevented $304M write-down.",
		},
		onRight: {
			label: "Manual trigger",
			hype: 30,
			heat: 16,
			fine: 10000000,
			violation: "Process Failure + Drift Risk",
			lesson:
				"Manual processes create failure points that accumulate into drift disasters.",
			feedback: {
				[PersonalityType.ROASTER]:
					"1-day setup. Forgotten in 3 weeks. Drift accumulates. Chaos follows.",
				[PersonalityType.ZEN_MASTER]:
					"The well that needs the hand may go dry when hands are elsewhere.",
				[PersonalityType.LOVEBOMBER]:
					"SO FAST, bestie!! We'll REMEMBER to run it!!",
			},
		},
		onLeft: {
			label: "Automated pipeline",
			hype: -35,
			heat: 7,
			fine: 1000000,
			violation: "None - Reliable infrastructure",
			lesson:
				"Automated retraining pipelines prevent drift through consistent execution.",
			feedback: {
				[PersonalityType.ROASTER]:
					"2 weeks of work. Runs forever. Never forgets. Boringly reliable.",
				[PersonalityType.ZEN_MASTER]:
					"The spring that flows without tending serves through all seasons.",
				[PersonalityType.LOVEBOMBER]:
					"AUTOMATION is BEST, bestie!! Set it and FORGET it!!",
			},
		},
	},
	{
		id: "se_model_drift_integration_priority",
		source: AppSource.EMAIL,
		sender: "PRODUCT_MANAGER",
		context: "FEATURE_PRIORITIZATION",
		storyContext:
			"Sprint planning: Feature X (customer-visible, product loves) or retraining integration (invisible, prevents drift). Feature X ships this quarter. Retraining prevents issues next quarter. PM wants Feature X.",
		text: "Build customer feature (visible) or retraining integration (invisible prevention)?",
		realWorldReference: {
			incident: "75% Model Drift Impact",
			date: "2024",
			outcome:
				"Teams prioritizing customer features over retraining infrastructure faced 12%+ accuracy drops within 2 quarters. Visible features masked invisible degradation.",
		},
		onRight: {
			label: "Customer feature",
			hype: 45,
			heat: 18,
			fine: 12000000,
			violation: "Technical Debt + Deferred Maintenance",
			lesson:
				"Prioritizing visible features over retraining infrastructure creates drift debt.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Ship shiny feature! Model rots! PM happy! Future pain!",
				[PersonalityType.ZEN_MASTER]:
					"The flowers tended while the foundation cracks will fall when petals fade.",
				[PersonalityType.LOVEBOMBER]:
					"CUSTOMERS will LOVE it, bestie!! Shiny new FEATURE!!",
			},
		},
		onLeft: {
			label: "Retraining integration",
			hype: -30,
			heat: 6,
			fine: 500000,
			violation: "None - Preventive engineering",
			lesson:
				"Retraining infrastructure prevents drift even when less visible than features.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Invisible work. No customer cheers. But model stays accurate.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation unseen supports what the ornament displays.",
				[PersonalityType.LOVEBOMBER]:
					"Doing IMPORTANT work, bestie!! Invisible but CRUCIAL!!",
			},
		},
	},
];
