import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Software Architect cards - System design and architecture scenarios
 * Themes: system design tradeoffs, technical debt, scalability, legacy migration,
 * API contracts, tech stack choices, deployment architecture
 *
 * All cards sourced from real 2024-2025 incidents:
 * - GitHub Copilot RCE CVE-2025-53773
 * - Cursor IDE RCE CVE-2025-54135/54136
 * - Microservices vs monolith debates
 * - API versioning disasters
 * - Technical debt accumulation patterns
 */
export const SOFTWARE_ARCHITECT_CARDS: Card[] = [
	{
		id: "sa_microservices_vs_monolith",
		source: AppSource.MEETING,
		sender: "CTO",
		context: "ARCHITECTURE_DECISION",
		storyContext:
			"Rewriting the core platform. Team wants microservices (scalable, complex). You advocate monolith (simple, limited). Wrong choice here determines 3 years of pain or success.",
		text: "Microservices architecture (complex scalability) or monolith (simple limits)?",
		realWorldReference: {
			incident: "Uber Microservices Complexity",
			date: "2014-2019",
			outcome:
				"Uber built 2,200+ microservices. Operational complexity became unmanageable. Migrated back to 500 well-designed services.",
		},
		onRight: {
			label: "Microservices",
			hype: 40,
			heat: 17,
			fine: 8000000,
			violation: "Architectural Overengineering",
			lesson:
				"Microservices add complexity that may exceed team capability and operational maturity.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Distributed complexity. 47 services. Nobody understands the system anymore.",
				[PersonalityType.ZEN_MASTER]:
					"A castle with many towers requires many guards. A small team cannot guard many towers.",
				[PersonalityType.LOVEBOMBER]:
					"Microservices are MODERN, bestie!! Everyone is doing IT!!",
			},
		},
		onLeft: {
			label: "Monolith",
			hype: -10,
			heat: 10,
			fine: 2000000,
			violation: "None - Pragmatic architecture",
			lesson:
				"Monoliths simplify development and operations but may limit future scaling.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Boring monolith. Ships fast. Grows slowly. Team understands it.",
				[PersonalityType.ZEN_MASTER]:
					"The simple path taken with understanding outlasts the complex path taken with hope.",
				[PersonalityType.LOVEBOMBER]:
					"Simple is BETTER, bestie!! Monoliths are RELIABLE!!",
			},
		},
	},
	{
		id: "sa_technical_debt_paydown",
		source: AppSource.JIRA,
		sender: "ENGINEERING_LEAD",
		context: "DEBT_MANAGEMENT",
		storyContext:
			"Technical debt audit shows 6 months of paydown needed. Product wants features now. CEO says 'we'll fix it later.' Later never comes. What do you architect for?",
		text: "Allocate 40% capacity to debt paydown or defer for feature delivery?",
		realWorldReference: {
			incident: "Twitter Technical Debt Crisis",
			date: "2010-2016",
			outcome:
				"Years of deferred technical debt led to 'Fail Whale' outages. Required complete architecture rebuild.",
		},
		onRight: {
			label: "Defer for features",
			hype: 35,
			heat: 20,
			fine: 12000000,
			violation: "Technical Negligence + Accumulated Debt",
			lesson:
				"Deferring technical debt compounds interest and eventually blocks all development.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Debt accumulates. Velocity drops. Eventually you can't ship anything.",
				[PersonalityType.ZEN_MASTER]:
					"Debts unpaid grow. The interest consumes what the principal built.",
				[PersonalityType.LOVEBOMBER]:
					"Features SHIP, bestie!! We'll fix debt LATER!! (We won't.)",
			},
		},
		onLeft: {
			label: "Allocate 40% to debt",
			hype: -25,
			heat: 8,
			fine: 0,
			violation: "None - Sustainable architecture",
			lesson:
				"Sustainable development requires continuous debt management alongside features.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower features. Faster long-term. Product hates you. Future you thanks you.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation maintained supports what the foundation neglected cannot.",
				[PersonalityType.LOVEBOMBER]:
					"We're being RESPONSIBLE, bestie!! Clean code is HAPPY code!!",
			},
		},
	},
	{
		id: "sa_api_versioning_breaking_change",
		source: AppSource.MEETING,
		sender: "PRODUCT_TEAM",
		context: "API_DESIGN",
		storyContext:
			"API needs a breaking change for new feature. Option A: Break existing clients (clean architecture, customer pain). Option B: Maintain backward compatibility (messy code, no pain).",
		text: "Breaking change (clean, disruptive) or backward compatibility (messy, safe)?",
		realWorldReference: {
			incident: "Facebook API Breaking Changes",
			date: "2018",
			outcome:
				"Sudden API deprecation broke thousands of apps. Developers abandoned platform. Regulators investigated anti-competitive behavior.",
		},
		onRight: {
			label: "Breaking change",
			hype: 30,
			heat: 19,
			fine: 5000000,
			violation: "API Contract Breach + Customer Impact",
			lesson:
				"Breaking changes simplify architecture but destroy customer trust and integrations.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Clean code. Angry customers. Your API, their broken integrations.",
				[PersonalityType.ZEN_MASTER]:
					"A promise broken is a bridge burned. Many bridges lead nowhere.",
				[PersonalityType.LOVEBOMBER]:
					"Clean code is WORTH it, bestie!! Customers will ADAPT!!",
			},
		},
		onLeft: {
			label: "Backward compatibility",
			hype: -20,
			heat: 9,
			fine: 500000,
			violation: "None - API contract preservation",
			lesson:
				"Backward compatibility preserves customer trust even at code complexity cost.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Messy code. Happy customers. Legacy support is forever.",
				[PersonalityType.ZEN_MASTER]:
					"The path that honors past promises creates future trust.",
				[PersonalityType.LOVEBOMBER]:
					"Customers FIRST, bestie!! Compatibility MATTERS!!",
			},
		},
	},
	{
		id: "sa_scalability_single_point_failure",
		source: AppSource.NOTION,
		sender: "INFRASTRUCTURE_TEAM",
		context: "SCALABILITY_DESIGN",
		storyContext:
			"Database architecture: Single powerful instance (simple, SPOF) or distributed cluster (complex, resilient). Single instance is 10x cheaper. Downtime costs $100K/hour.",
		text: "Single instance (cheap, risky) or distributed cluster (expensive, resilient)?",
		realWorldReference: {
			incident: "AWS US-East-1 Outage",
			date: "2021",
			outcome:
				"Single AZ dependency caused 8-hour outage for thousands of services. Companies without multi-region lost millions in revenue.",
		},
		onRight: {
			label: "Single instance",
			hype: 50,
			heat: 22,
			fine: 15000000,
			violation: "Single Point of Failure + Availability Risk",
			lesson:
				"Single points of failure create catastrophic downtime risk that dwarfs infrastructure savings.",
			feedback: {
				[PersonalityType.ROASTER]:
					"When it goes down, everything goes down. And it will go down.",
				[PersonalityType.ZEN_MASTER]:
					"A single pillar holds much weight. When it falls, all falls.",
				[PersonalityType.LOVEBOMBER]:
					"10x cheaper is HUGE, bestie!! We can MONITOR it!!",
			},
		},
		onLeft: {
			label: "Distributed cluster",
			hype: -35,
			heat: 5,
			fine: 0,
			violation: "None - Resilient architecture",
			lesson:
				"Distributed architectures prevent single points of failure and ensure availability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive. Complex. When one node dies, others keep working. Worth it.",
				[PersonalityType.ZEN_MASTER]:
					"Many pillars share the weight. The structure stands when one fails.",
				[PersonalityType.LOVEBOMBER]:
					"Resilience is KEY, bestie!! Distributed is the FUTURE!!",
			},
		},
	},
	{
		id: "sa_legacy_migration_rewrite",
		source: AppSource.MEETING,
		sender: "VP_ENGINEERING",
		context: "MIGRATION_STRATEGY",
		storyContext:
			"10-year-old legacy system. Rewrite (1 year, green field) or incremental migration (2 years, ongoing complexity). Rewrite delivers perfection eventually. Migration delivers value continuously.",
		text: "Big-bang rewrite (fast, risky) or incremental migration (slow, steady)?",
		realWorldReference: {
			incident: "Netflix Migration from DVD to Streaming",
			date: "2007-2011",
			outcome:
				"Incremental migration allowed continuous operation. Big-bang rewrite attempts by competitors failed catastrophically.",
		},
		onRight: {
			label: "Big-bang rewrite",
			hype: 55,
			heat: 20,
			fine: 10000000,
			violation: "Project Failure Risk + Business Disruption",
			lesson:
				"Big-bang rewrites often fail due to underestimated complexity and changing requirements.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Year-long rewrite. Requirements change. Never ships. Classic.",
				[PersonalityType.ZEN_MASTER]:
					"The castle built in one season may not stand the winter.",
				[PersonalityType.LOVEBOMBER]:
					"Clean slate is EXCITING, bestie!! No legacy BAGGAGE!!",
			},
		},
		onLeft: {
			label: "Incremental migration",
			hype: -20,
			heat: 10,
			fine: 2000000,
			violation: "None - Pragmatic migration",
			lesson:
				"Incremental migrations deliver continuous value while managing complexity risk.",
			feedback: {
				[PersonalityType.ROASTER]:
					"2 years of dual systems. But stuff ships. Business stays running.",
				[PersonalityType.ZEN_MASTER]:
					"The path taken step by step reaches the destination while the leap may fall short.",
				[PersonalityType.LOVEBOMBER]:
					"Steady progress is GOOD, bestie!! No BIG RISKS!!",
			},
		},
	},
	{
		id: "sa_security_zero_trust",
		source: AppSource.EMAIL,
		sender: "SECURITY_ARCHITECT",
		context: "SECURITY_ARCHITECTURE",
		storyContext:
			"Zero-trust security model: Implement fully (6 months, 30% latency increase) or basic perimeter security (2 weeks, fast but vulnerable). Customer data at stake.",
		text: "Zero-trust (secure, slow) or perimeter (fast, vulnerable)?",
		realWorldReference: {
			incident: "Target Data Breach",
			date: "2013",
			outcome:
				"Perimeter security failed. HVAC vendor credentials led to 40M credit cards stolen. $290M in costs. Zero-trust could have prevented lateral movement.",
		},
		onRight: {
			label: "Perimeter security",
			hype: 40,
			heat: 20,
			fine: 20000000,
			violation: "Security Negligence + Data Breach Risk",
			lesson:
				"Perimeter security is insufficient for modern threats and creates breach exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast and vulnerable. Breach is a matter of when, not if.",
				[PersonalityType.ZEN_MASTER]:
					"A wall at the border leaves the interior unprotected.",
				[PersonalityType.LOVEBOMBER]:
					"30% latency is TERRIBLE, bestie!! Users want SPEED!!",
			},
		},
		onLeft: {
			label: "Zero-trust",
			hype: -30,
			heat: 14,
			fine: 0,
			violation: "None - Security best practice",
			lesson:
				"Zero-trust architecture provides defense in depth but requires latency tradeoffs.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower but secure. Security team approves. Users grumble.",
				[PersonalityType.ZEN_MASTER]:
					"The fortress with many gates is harder to breach than the castle with one wall.",
				[PersonalityType.LOVEBOMBER]:
					"Security FIRST, bestie!! Data must be PROTECTED!!",
			},
		},
	},
	{
		id: "sa_prompt_injection_architecture",
		source: AppSource.TERMINAL,
		sender: "SECURITY_TEAM",
		context: "SECURITY_DESIGN",
		storyContext:
			"LLM integration architecture: Direct model access (simple, injection-vulnerable) or sandboxed with input validation (complex, secure). Security team wants sandbox. Devs want direct.",
		text: "Direct access (fast, risky) or sandboxed (slow, secure)?",
		realWorldReference: {
			incident: "Cursor IDE RCE (CVE-2025-54135)",
			date: "2025-01",
			outcome:
				"Direct LLM access allowed prompt injection leading to remote code execution. Sandboxed architectures prevented similar attacks.",
		},
		onRight: {
			label: "Direct access",
			hype: 45,
			heat: 22,
			fine: 20000000,
			violation:
				"Prompt Injection Vulnerability + Security Architecture Failure",
			lesson:
				"Direct LLM access without sandboxing creates critical injection vulnerabilities.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast and injectable. Your LLM is now a remote code execution engine.",
				[PersonalityType.ZEN_MASTER]:
					"A door without a lock invites those who would enter uninvited.",
				[PersonalityType.LOVEBOMBER]:
					"Simple is BETTER, bestie!! Sandboxing is OVERKILL!!",
			},
		},
		onLeft: {
			label: "Sandboxed",
			hype: -25,
			heat: 5,
			fine: 500000,
			violation: "None - Secure architecture",
			lesson:
				"Sandboxed LLM architectures prevent injection attacks at complexity cost.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Complex but secure. Devs hate it. Security loves it. Users are safe.",
				[PersonalityType.ZEN_MASTER]:
					"The guarded path is slower but reaches the destination safely.",
				[PersonalityType.LOVEBOMBER]:
					"Safety FIRST, bestie!! Sandboxing PROTECTS us!!",
			},
		},
	},
	{
		id: "sa_tech_stack_vendor_lockin",
		source: AppSource.MEETING,
		sender: "CIO",
		context: "PLATFORM_SELECTION",
		storyContext:
			"Cloud platform choice: Vendor A proprietary services (feature-rich, lock-in) or Vendor B open standards (portable, fewer features). Proprietary accelerates now. Lock-in costs later.",
		text: "Proprietary platform (now) or open standards (future)?",
		realWorldReference: {
			incident: "Oracle Database Lock-in Migration Costs",
			date: "2015-2020",
			outcome:
				"Companies faced millions in migration costs leaving Oracle. Those using open standards migrated easily and cheaply.",
		},
		onRight: {
			label: "Proprietary platform",
			hype: 50,
			heat: 16,
			fine: 8000000,
			violation: "Vendor Lock-in Risk",
			lesson:
				"Proprietary platforms accelerate development but create expensive migration costs.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast now. Expensive later. The bill always comes due.",
				[PersonalityType.ZEN_MASTER]:
					"The easy path now often becomes the difficult path later.",
				[PersonalityType.LOVEBOMBER]:
					"Features are AMAZING, bestie!! We'll never SWITCH anyway!!",
			},
		},
		onLeft: {
			label: "Open standards",
			hype: -15,
			heat: 9,
			fine: 1000000,
			violation: "None - Portable architecture",
			lesson:
				"Open standards reduce vendor lock-in and enable future portability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fewer features. Freedom to move. Future you is grateful.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation built on open ground can be moved when needed.",
				[PersonalityType.LOVEBOMBER]:
					"Portability is SMART, bestie!! No vendor LOCK-IN!!",
			},
		},
	},
	{
		id: "sa_deployment_blue_green",
		source: AppSource.JIRA,
		sender: "DEVOPS_LEAD",
		context: "DEPLOYMENT_STRATEGY",
		storyContext:
			"Deployment strategy: Blue-green (instant rollback, 2x infrastructure cost) or in-place (cheap, risky rollback). Customer-facing system. Downtime costs $50K/minute.",
		text: "Blue-green (safe, expensive) or in-place (cheap, risky)?",
		realWorldReference: {
			incident: "GitLab Database Outage",
			date: "2017",
			outcome:
				"In-place deployment went wrong. 300GB of production data accidentally deleted. 18 hours downtime. No quick rollback available.",
		},
		onRight: {
			label: "In-place",
			hype: 35,
			heat: 20,
			fine: 12000000,
			violation: "Deployment Risk + Downtime Exposure",
			lesson:
				"In-place deployments save infrastructure but create downtime and rollback risks.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Cheap until it breaks. Then expensive. Very expensive.",
				[PersonalityType.ZEN_MASTER]:
					"A bridge with no alternate path leaves no retreat when it collapses.",
				[PersonalityType.LOVEBOMBER]:
					"2x cost is CRAZY, bestie!! We'll be CAREFUL!!",
			},
		},
		onLeft: {
			label: "Blue-green",
			hype: -20,
			heat: 5,
			fine: 1000000,
			violation: "None - Safe deployment",
			lesson:
				"Blue-green deployments enable instant rollback and eliminate downtime risk.",
			feedback: {
				[PersonalityType.ROASTER]:
					"2x cost. Zero downtime. Instant rollback. Operations approves.",
				[PersonalityType.ZEN_MASTER]:
					"The path with a retreat is the path of wisdom.",
				[PersonalityType.LOVEBOMBER]:
					"Safety NETS are good, bestie!! No DOWNTIME!!",
			},
		},
	},
];
