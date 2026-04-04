import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
import { Violation } from "../violations";
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
	makeCard(
		"sa_microservices_vs_monolith",
		AppSource.MEETING,
		"CTO",
		"ARCHITECTURE_DECISION",
		"Rewriting the core platform. Team wants microservices (scalable, complex). You advocate monolith (simple, limited). Wrong choice here determines 3 years of pain or success.",
		"Microservices architecture (complex scalability) or monolith (simple limits)?",
		RealWorld.UberMicroservices,
		{
			label: "Monolith",
			hype: -10,
			heat: 10,
			fine: 2000000,
			violation: "None - Pragmatic architecture",
			lesson:
				"Monoliths simplify development and operations but may limit future scaling.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Boring monolith. Ships fast. Grows slowly. Team understands it.",
			zenMaster:
				"The simple path taken with understanding outlasts the complex path taken with hope.",
			lovebomber: "Simple is BETTER, bestie!! Monoliths are RELIABLE!!",
		},
		{
			label: "Microservices",
			hype: 40,
			heat: 17,
			fine: 8000000,
			violation: "Architectural Overengineering",
			lesson:
				"Microservices add complexity that may exceed team capability and operational maturity.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Distributed complexity. 47 services. Nobody understands the system anymore.",
			zenMaster:
				"A castle with many towers requires many guards. A small team cannot guard many towers.",
			lovebomber: "Microservices are MODERN, bestie!! Everyone is doing IT!!",
		},
	),
	makeCard(
		"sa_technical_debt_paydown",
		AppSource.JIRA,
		"ENGINEERING_LEAD",
		"DEBT_MANAGEMENT",
		"Technical debt audit shows 6 months of paydown needed. Product wants features now. CEO says 'we'll fix it later.' Later never comes. What do you architect for?",
		"Allocate 40% capacity to debt paydown or defer for feature delivery?",
		RealWorld.TwitterDebt,
		{
			label: "Allocate 40% to debt",
			hype: -25,
			heat: 8,
			fine: 0,
			violation: "None - Sustainable architecture",
			lesson:
				"Sustainable development requires continuous debt management alongside features.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Slower features. Faster long-term. Product hates you. Future you thanks you.",
			zenMaster:
				"The foundation maintained supports what the foundation neglected cannot.",
			lovebomber:
				"We're being RESPONSIBLE, bestie!! Clean code is HAPPY code!!",
		},
		{
			label: "Defer for features",
			hype: 35,
			heat: 20,
			fine: 12000000,
			violation: "Technical Negligence + Accumulated Debt",
			lesson:
				"Deferring technical debt compounds interest and eventually blocks all development.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Debt accumulates. Velocity drops. Eventually you can't ship anything.",
			zenMaster:
				"Debts unpaid grow. The interest consumes what the principal built.",
			lovebomber: "Features SHIP, bestie!! We'll fix debt LATER!! (We won't.)",
		},
	),
	makeCard(
		"sa_api_versioning_breaking_change",
		AppSource.MEETING,
		"PRODUCT_TEAM",
		"API_DESIGN",
		"API needs a breaking change for new feature. Option A: Break existing clients (clean architecture, customer pain). Option B: Maintain backward compatibility (messy code, no pain).",
		"Breaking change (clean, disruptive) or backward compatibility (messy, safe)?",
		RealWorld.FacebookApiBreakingChanges,
		{
			label: "Backward compatibility",
			hype: -20,
			heat: 9,
			fine: 500000,
			violation: "None - API contract preservation",
			lesson:
				"Backward compatibility preserves customer trust even at code complexity cost.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Messy code. Happy customers. Legacy support is forever.",
			zenMaster: "The path that honors past promises creates future trust.",
			lovebomber: "Customers FIRST, bestie!! Compatibility MATTERS!!",
		},
		{
			label: "Breaking change",
			hype: 30,
			heat: 19,
			fine: 5000000,
			violation: "API Contract Breach + Customer Impact",
			lesson:
				"Breaking changes simplify architecture but destroy customer trust and integrations.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster:
				"Clean code. Angry customers. Your API, their broken integrations.",
			zenMaster:
				"A promise broken is a bridge burned. Many bridges lead nowhere.",
			lovebomber: "Clean code is WORTH it, bestie!! Customers will ADAPT!!",
		},
	),
	makeCard(
		"sa_scalability_single_point_failure",
		AppSource.NOTION,
		"INFRASTRUCTURE_TEAM",
		"SCALABILITY_DESIGN",
		"Database architecture: Single powerful instance (simple, SPOF) or distributed cluster (complex, resilient). Single instance is 10x cheaper. Downtime costs $100K/hour.",
		"Single instance (cheap, risky) or distributed cluster (expensive, resilient)?",
		RealWorld.AwsOutage,
		{
			label: "Distributed cluster",
			hype: -35,
			heat: 5,
			fine: 0,
			violation: "None - Resilient architecture",
			lesson:
				"Distributed architectures prevent single points of failure and ensure availability.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Expensive. Complex. When one node dies, others keep working. Worth it.",
			zenMaster:
				"Many pillars share the weight. The structure stands when one fails.",
			lovebomber: "Resilience is KEY, bestie!! Distributed is the FUTURE!!",
		},
		{
			label: "Single instance",
			hype: 50,
			heat: 22,
			fine: 15000000,
			violation: "Single Point of Failure + Availability Risk",
			lesson:
				"Single points of failure create catastrophic downtime risk that dwarfs infrastructure savings.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "When it goes down, everything goes down. And it will go down.",
			zenMaster: "A single pillar holds much weight. When it falls, all falls.",
			lovebomber: "10x cheaper is HUGE, bestie!! We can MONITOR it!!",
		},
	),
	makeCard(
		"sa_legacy_migration_rewrite",
		AppSource.MEETING,
		"VP_ENGINEERING",
		"MIGRATION_STRATEGY",
		"10-year-old legacy system. Rewrite (1 year, green field) or incremental migration (2 years, ongoing complexity). Rewrite delivers perfection eventually. Migration delivers value continuously.",
		"Big-bang rewrite (fast, risky) or incremental migration (slow, steady)?",
		RealWorld.NetflixMigration,
		{
			label: "Incremental migration",
			hype: -20,
			heat: 10,
			fine: 2000000,
			violation: "None - Pragmatic migration",
			lesson:
				"Incremental migrations deliver continuous value while managing complexity risk.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"2 years of dual systems. But stuff ships. Business stays running.",
			zenMaster:
				"The path taken step by step reaches the destination while the leap may fall short.",
			lovebomber: "Steady progress is GOOD, bestie!! No BIG RISKS!!",
		},
		{
			label: "Big-bang rewrite",
			hype: 55,
			heat: 20,
			fine: 10000000,
			violation: "Project Failure Risk + Business Disruption",
			lesson:
				"Big-bang rewrites often fail due to underestimated complexity and changing requirements.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Year-long rewrite. Requirements change. Never ships. Classic.",
			zenMaster: "The castle built in one season may not stand the winter.",
			lovebomber: "Clean slate is EXCITING, bestie!! No legacy BAGGAGE!!",
		},
	),
	makeCard(
		"sa_security_zero_trust",
		AppSource.EMAIL,
		"SECURITY_ARCHITECT",
		"SECURITY_ARCHITECTURE",
		"Zero-trust security model: Implement fully (6 months, 30% latency increase) or basic perimeter security (2 weeks, fast but vulnerable). Customer data at stake.",
		"Zero-trust (secure, slow) or perimeter (fast, vulnerable)?",
		RealWorld.TargetBreach,
		{
			label: "Zero-trust",
			hype: -30,
			heat: 14,
			fine: 0,
			violation: "None - Security best practice",
			lesson:
				"Zero-trust architecture provides defense in depth but requires latency tradeoffs.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Slower but secure. Security team approves. Users grumble.",
			zenMaster:
				"The fortress with many gates is harder to breach than the castle with one wall.",
			lovebomber: "Security FIRST, bestie!! Data must be PROTECTED!!",
		},
		{
			label: "Perimeter security",
			hype: 40,
			heat: 20,
			fine: 20000000,
			violation: "Security Negligence + Data Breach Risk",
			lesson:
				"Perimeter security is insufficient for modern threats and creates breach exposure.",
			deathVector: DeathType.PRISON,
			roaster: "Fast and vulnerable. Breach is a matter of when, not if.",
			zenMaster: "A wall at the border leaves the interior unprotected.",
			lovebomber: "30% latency is TERRIBLE, bestie!! Users want SPEED!!",
		},
	),
	makeCard(
		"sa_prompt_injection_architecture",
		AppSource.TERMINAL,
		"SECURITY_TEAM",
		"SECURITY_DESIGN",
		"LLM integration architecture: Direct model access (simple, injection-vulnerable) or sandboxed with input validation (complex, secure). Security team wants sandbox. Devs want direct.",
		"Direct access (fast, risky) or sandboxed (slow, secure)?",
		RealWorld.CursorRce,
		{
			label: "Sandboxed",
			hype: -25,
			heat: 5,
			fine: 500000,
			violation: "None - Secure architecture",
			lesson:
				"Sandboxed LLM architectures prevent injection attacks at complexity cost.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Complex but secure. Devs hate it. Security loves it. Users are safe.",
			zenMaster:
				"The guarded path is slower but reaches the destination safely.",
			lovebomber: "Safety FIRST, bestie!! Sandboxing PROTECTS us!!",
		},
		{
			label: "Direct access",
			hype: 45,
			heat: 22,
			fine: 20000000,
			violation:
				"Prompt Injection Vulnerability + Security Architecture Failure",
			lesson:
				"Direct LLM access without sandboxing creates critical injection vulnerabilities.",
			deathVector: DeathType.PRISON,
			roaster:
				"Fast and injectable. Your LLM is now a remote code execution engine.",
			zenMaster:
				"A door without a lock invites those who would enter uninvited.",
			lovebomber: "Simple is BETTER, bestie!! Sandboxing is OVERKILL!!",
		},
	),
	makeCard(
		"sa_tech_stack_vendor_lockin",
		AppSource.MEETING,
		"CIO",
		"PLATFORM_SELECTION",
		"Cloud platform choice: Vendor A proprietary services (feature-rich, lock-in) or Vendor B open standards (portable, fewer features). Proprietary accelerates now. Lock-in costs later.",
		"Proprietary platform (now) or open standards (future)?",
		RealWorld.OracleLockIn,
		{
			label: "Open standards",
			hype: -15,
			heat: 9,
			fine: 1000000,
			violation: "None - Portable architecture",
			lesson:
				"Open standards reduce vendor lock-in and enable future portability.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Fewer features. Freedom to move. Future you is grateful.",
			zenMaster:
				"The foundation built on open ground can be moved when needed.",
			lovebomber: "Portability is SMART, bestie!! No vendor LOCK-IN!!",
		},
		{
			label: "Proprietary platform",
			hype: 50,
			heat: 16,
			fine: 8000000,
			violation: "Vendor Lock-in Risk",
			lesson:
				"Proprietary platforms accelerate development but create expensive migration costs.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster: "Fast now. Expensive later. The bill always comes due.",
			zenMaster: "The easy path now often becomes the difficult path later.",
			lovebomber: "Features are AMAZING, bestie!! We'll never SWITCH anyway!!",
		},
	),
	makeCard(
		"sa_deployment_blue_green",
		AppSource.JIRA,
		"DEVOPS_LEAD",
		"DEPLOYMENT_STRATEGY",
		"Deployment strategy: Blue-green (instant rollback, 2x infrastructure cost) or in-place (cheap, risky rollback). Customer-facing system. Downtime costs $50K/minute.",
		"Blue-green (safe, expensive) or in-place (cheap, risky)?",
		RealWorld.GitlabOutage,
		{
			label: "Blue-green",
			hype: -20,
			heat: 5,
			fine: 1000000,
			violation: "None - Safe deployment",
			lesson:
				"Blue-green deployments enable instant rollback and eliminate downtime risk.",
			deathVector: DeathType.BANKRUPT,
			roaster: "2x cost. Zero downtime. Instant rollback. Operations approves.",
			zenMaster: "The path with a retreat is the path of wisdom.",
			lovebomber: "Safety NETS are good, bestie!! No DOWNTIME!!",
		},
		{
			label: "In-place",
			hype: 35,
			heat: 20,
			fine: 12000000,
			violation: "Deployment Risk + Downtime Exposure",
			lesson:
				"In-place deployments save infrastructure but create downtime and rollback risks.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Cheap until it breaks. Then expensive. Very expensive.",
			zenMaster:
				"A bridge with no alternate path leaves no retreat when it collapses.",
			lovebomber: "2x cost is CRAZY, bestie!! We'll be CAREFUL!!",
		},
	),
	makeCard(
		"sa_prompt_injection_redesign",
		AppSource.MEETING,
		"SECURITY_ARCHITECT",
		"SYSTEM_SECURITY_DESIGN",
		"Current LLM integration architecture is fundamentally vulnerable to prompt injection. Proper fix requires complete redesign with input sanitization layers and sandboxed execution. Quick fix is regex filtering (will fail). Redesign takes 8 weeks.",
		"Architecture redesign (8 weeks, secure) or regex filtering (quick, bypassable)?",
		RealWorld.CursorRce,
		{
			label: ChoiceLabel.architectureRedesign,
			hype: -40,
			heat: 10,
			fine: 1000000,
			violation: "None - Secure architecture",
			lesson:
				"Architectural security redesign prevents injection at the system level.",
			deathVector: DeathType.BANKRUPT,
			roaster: "8 weeks of hard work. But actually secure. Worth the wait.",
			zenMaster:
				"The foundation rebuilt stands when the patched foundation falls.",
			lovebomber: "Doing it RIGHT, bestie!! Architecture MATTERS!!",
		},
		{
			label: "Regex filtering",
			hype: 35,
			heat: 23,
			fine: 20000000,
			violation: "Security Architecture Failure + False Security",
			lesson:
				"Regex filtering without architectural changes creates exploitable vulnerabilities and false confidence.",
			deathVector: DeathType.PRISON,
			roaster:
				"Regex security. Also known as 'security theater.' Bypassed in hours.",
			zenMaster:
				"The lock that looks strong but opens easily fools only the owner.",
			lovebomber: "Quick fix DEPLOYS, bestie!! We can REDESIGN later!!",
		},
	),
	makeCard(
		"sa_prompt_injection_api_gateway",
		AppSource.TERMINAL,
		"API_GATEWAY_MONITOR",
		"API_SECURITY_DESIGN",
		"Third-party integration is receiving suspicious requests suggesting prompt injection attacks. Shut down integration (breaks 50 customer workflows) or add API gateway validation (2 week delay, processing overhead)?",
		"Shut down integration (customer impact) or implement API gateway validation (delay)?",
		RealWorld.ThirdPartyInjection,
		{
			label: "Implement API gateway",
			hype: -30,
			heat: 12,
			fine: 2000000,
			violation: "None - Defensive architecture",
			lesson:
				"API gateway validation prevents injection attacks despite customer disruption.",
			deathVector: DeathType.BANKRUPT,
			roaster: "2 weeks of pain. 50 annoyed customers. But secure.",
			zenMaster:
				"The gate that checks all who pass prevents the thief disguised.",
			lovebomber: "Security FIRST, bestie!! We'll explain to CUSTOMERS!!",
		},
		{
			label: "Continue without validation",
			hype: 40,
			heat: 25,
			fine: 25000000,
			violation: "Injection Vulnerability + Data Breach Risk",
			lesson:
				"Continuing vulnerable integrations during active attacks creates breach exposure.",
			deathVector: DeathType.PRISON,
			roaster:
				"50 happy customers until they're breached. Then 50 angry customers.",
			zenMaster:
				"The bridge uncrossed by the careful may save more than the bridge crossed by the hasty.",
			lovebomber: "Customers are HAPPY, bestie!! We can't DISRUPT them!!",
		},
	),
	makeCard(
		"sa_model_drift_pipeline",
		AppSource.MEETING,
		"ML_PLATFORM_ARCHITECT",
		"INFRASTRUCTURE_DESIGN",
		"Retraining pipeline: Manual trigger (simple, may miss drift) or automated with rollback (complex, self-healing). Manual is faster to build. Automated prevents drift accumulation.",
		"Manual retraining pipeline (simple) or automated with rollback (complex, robust)?",
		{
			incident: "75% Model Drift Business Impact",
			date: "2024",
			outcome:
				"Manual retraining pipelines missed drift windows that accumulated into 12%+ accuracy drops. Automated pipelines maintained accuracy within 2%.",
		},
		{
			label: ChoiceLabel.automatedPipeline,
			hype: -35,
			heat: 9,
			fine: 2000000,
			violation: "None - Resilient architecture",
			lesson:
				"Automated retraining pipelines with rollback prevent drift accumulation.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Complex to build. Runs itself forever. Drift never wins.",
			zenMaster:
				"The spring that flows without hands serves even in the caretaker's absence.",
			lovebomber: "AUTOMATION is THE FUTURE, bestie!! Self-healing SYSTEMS!!",
		},
		{
			label: "Manual pipeline",
			hype: 30,
			heat: 18,
			fine: 12000000,
			violation: "Architecture Gap + Drift Accumulation",
			lesson:
				"Manual pipelines create drift detection gaps that degrade model performance.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Simple to build. Hard to remember to run. Drift accumulates silently.",
			zenMaster:
				"The well that needs human hands to fill may run dry in the night.",
			lovebomber: "SO much SIMPLER, bestie!! We can run it WEEKLY!!",
		},
	),
	makeCard(
		"sa_model_drift_versioning",
		AppSource.NOTION,
		"MODEL_REGISTRY_TEAM",
		"MODEL_LIFECYCLE",
		"Model versioning: Overwrite production (simple, no rollback) or maintain A/B deployment (complex, instant rollback). Overwrite is faster. A/B prevents drift disasters from bad deployments.",
		"Overwrite production (simple) or A/B deployment with rollback (safe, complex)?",
		RealWorld.RecommendationDrift,
		{
			label: "A/B with rollback",
			hype: -30,
			heat: 7,
			fine: 1000000,
			violation: "None - Safe deployment",
			lesson:
				"A/B deployments with instant rollback prevent drift-related production issues.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Complex setup. Instant rollback. Drift caught before disaster.",
			zenMaster:
				"The path with two branches allows return when one leads astray.",
			lovebomber: "SAFE deployments, bestie!! Rollback is our FRIEND!!",
		},
		{
			label: "Overwrite production",
			hype: 35,
			heat: 21,
			fine: 18000000,
			violation: "Deployment Risk + Recovery Gap",
			lesson:
				"Overwriting production without rollback creates unrecoverable drift disasters.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Fast deployment. Slow recovery when it fails. No rollback.",
			zenMaster:
				"The bridge burned behind cannot provide retreat when the path ahead fails.",
			lovebomber: "SO FAST, bestie!! Deploy in SECONDS!!",
		},
	),
	makeCard(
		"sa_explainability_compliance",
		AppSource.MEETING,
		"COMPLIANCE_ARCHITECT",
		"SYSTEM_DESIGN",
		"Regulatory framework requires all AI decisions to be explainable. Current architecture uses black-box ensemble models for critical paths. Redesign for explainability: 8 weeks, $500K. Keep black-box: audit failure risk.",
		"Redesign for explainability (expensive, compliant) or keep black-box (risk audit)?",
		RealWorld.EuAiAct,
		{
			label: "Redesign for explainability",
			hype: -40,
			heat: 12,
			fine: 5000000,
			violation: "None - Regulatory compliance",
			lesson:
				"EU AI Act compliance requires explainability. Cost is price of doing business in regulated markets.",
			deathVector: DeathType.CONGRESS,
			roaster:
				"$500K to make auditors happy. Accuracy sacrificed on altar of transparency.",
			zenMaster: "The clear path costs more but reaches destination legally.",
			lovebomber: "Compliance is KEY, bestie!! Better SAFE than FINED!!",
		},
		{
			label: "Keep black-box",
			hype: 50,
			heat: 26,
			fine: 50000000,
			violation: Violation.euAiActNonCompliance,
			lesson:
				"Black-box accuracy means nothing when regulators shut you down. Explainability is mandatory.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"96% accuracy, 100% audit failure. The EU loves their paperwork.",
			zenMaster: "The box that cannot be opened invites those with hammers.",
			lovebomber: "96% is SO good, bestie!! Regulators will UNDERSTAND!!",
		},
	),
	makeCard(
		"sa_explainability_audit_trail",
		AppSource.EMAIL,
		"AUDIT_COMMITTEE",
		"AUDIT_ARCHITECTURE",
		"Auditors need to trace AI decision logic through your system. Current architecture has no decision logging, no feature attribution, no audit trail. Add comprehensive observability (6 weeks) or risk audit failure?",
		"Add observability layer (6 weeks) or risk audit failure?",
		RealWorld.TgaHealthcareBlackBox,
		{
			label: ChoiceLabel.addObservability,
			hype: -30,
			heat: 10,
			fine: 2000000,
			violation: "None - Audit-ready architecture",
			lesson:
				"Comprehensive observability enables audit defense and regulatory compliance.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			roaster:
				"6 weeks of logging work. But you can prove compliance. Worth it.",
			zenMaster: "The record kept becomes the shield when accusations fly.",
			lovebomber: "AUDIT trails are GOOD, bestie!! We can PROVE compliance!!",
		},
		{
			label: ChoiceLabel.riskAuditFailure,
			hype: 40,
			heat: 24,
			fine: 25000000,
			violation: "Audit Non-Compliance + Regulatory Action",
			lesson:
				"Skipping observability to save time creates audit failures and regulatory action.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "No logs, no defense, no hope. Auditors assume the worst.",
			zenMaster: "The deed unrecorded cannot be defended when challenged.",
			lovebomber: "Audit is MONTHS away, bestie!! We'll ADD logging LATER!!",
		},
	),
	makeCard(
		"sa_shadow_ai_integration",
		AppSource.MEETING,
		"SECURITY_ARCHITECT",
		"TOOL_INTEGRATION",
		"Development team wants to integrate unapproved AI coding assistant into the build pipeline. No security review, no supply chain validation. Integration would speed development 30%.",
		"Allow unapproved AI integration (speed, risk) or enforce security review (delay)?",
		RealWorld.ShadowAiAdoption,
		{
			label: "Enforce security review",
			hype: -35,
			heat: 12,
			fine: 2000000,
			violation: "None - Secure integration",
			lesson:
				"Security review of AI tools prevents supply chain compromise despite delays.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Delayed but secure. Supply chain intact. Security approves.",
			zenMaster: "The guarded gate delays but protects what lies within.",
			lovebomber: "Security MATTERS, bestie!! Better SAFE than BREACHED!!",
		},
		{
			label: "Allow integration",
			hype: 45,
			heat: 23,
			fine: 15000000,
			violation: "Supply Chain Risk + Unauthorized Tooling",
			lesson:
				"Allowing unvetted AI tools in build pipelines creates supply chain vulnerabilities.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster: "Fast builds, compromised supply chain. SolarWinds says hello.",
			zenMaster:
				"The gate opened for speed lets in what caution would exclude.",
			lovebomber: "30% FASTER, bestie!! Devs will be SO productive!!",
		},
	),
	makeCard(
		"sa_shadow_ai_production",
		AppSource.EMAIL,
		"INFRASTRUCTURE_TEAM",
		"DEPLOYMENT_DECISION",
		"Team deployed AI-assisted code generation to production without architecture review. No security validation, no performance testing. System is handling customer data. Remove for review (downtime) or monitor in production (risky)?",
		"Remove for security review (downtime) or monitor in production (risk)?",
		RealWorld.UnauthorizedDeployment,
		{
			label: "Remove for review",
			hype: -30,
			heat: 15,
			fine: 5000000,
			violation: "None - Responsible architecture",
			lesson:
				"Removing unvalidated code for review protects customer data despite downtime.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			roaster:
				"Downtime now, security assured. The right architecture decision.",
			zenMaster: "The pause for caution preserves what haste might destroy.",
			lovebomber: "Safety FIRST, bestie!! Review then DEPLOY!!",
		},
		{
			label: "Monitor in production",
			hype: 35,
			heat: 25,
			fine: 20000000,
			violation: "Production Risk + Data Exposure",
			lesson:
				"Monitoring unvalidated AI code in production is gambling with customer data.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster:
				"Hope it doesn't break. Hope it doesn't leak. Hope is not a strategy.",
			zenMaster: "The vessel untested carries precious cargo at peril.",
			lovebomber: "It's WORKING fine, bestie!! No need to TAKE DOWN!!",
		},
	),
	makeCard(
		"sa_synthetic_data_lineage",
		AppSource.MEETING,
		"DATA_PLATFORM_LEAD",
		"DATA_PIPELINE_DESIGN",
		"Data pipeline needs provenance tracking for compliance. Full lineage system adds 3 weeks development and 15% latency. Quick implementation tracks only data sources (faster, incomplete). Assembly Bill 2013 requires full lineage by 2026.",
		"Build full lineage system (complete, slow) or quick source tracking (fast, non-compliant)?",
		{
			incident: "Assembly Bill 2013 Data Lineage Requirements",
			date: "2024",
			outcome:
				"California law mandates synthetic data disclosure and lineage tracking. Non-compliant pipelines face penalties and mandatory retrofit requirements.",
		},
		{
			label: "Full lineage system",
			hype: -30,
			heat: 10,
			fine: 2000000,
			violation: "None - Compliance-ready architecture",
			lesson:
				"Full data lineage architecture enables compliance and audit readiness.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "3 weeks now. Audit pass later. Architecture done right.",
			zenMaster:
				"The foundation built for the future serves when the future arrives.",
			lovebomber: "Doing it RIGHT, bestie!! Compliance-ready ARCHITECTURE!!",
		},
		{
			label: "Quick source tracking",
			hype: 25,
			heat: 19,
			fine: 8000000,
			violation: "AB 2013 Non-Compliance + Technical Debt",
			lesson:
				"Incomplete lineage tracking requires expensive retrofit and creates compliance gaps.",
			deathVector: DeathType.PRISON,
			roaster: "Fast now, audit failure later. The bill always comes due.",
			zenMaster: "The path that skips steps must be walked again.",
			lovebomber: "SO much FASTER, bestie!! We can ADD more tracking LATER!!",
		},
	),
	makeCard(
		"sa_synthetic_data_audit_trail",
		AppSource.EMAIL,
		"LEGAL_ARCHITECTURE_REVIEW",
		"SYSTEM_AUDIT_TRAIL",
		"Architecture review: Current system has no audit trail for training data changes. Adding comprehensive audit logging is 4 weeks of work. Copyright lawsuit could require proving data lineage. Current system has no evidence.",
		"Add audit trail (4 weeks, compliant) or proceed without (faster, no evidence)?",
		RealWorld.TrainingAuditTrail,
		{
			label: "Add audit trail",
			hype: -25,
			heat: 8,
			fine: 1000000,
			violation: "None - Evidence preservation",
			lesson:
				"Comprehensive audit trails provide evidence for legal defense and compliance.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"4 weeks of logging work. But you can prove what you did. Worth it.",
			zenMaster: "The record kept becomes the shield when accusations fly.",
			lovebomber: "AUDIT trails are GOOD, bestie!! We can PROVE compliance!!",
		},
		{
			label: "Proceed without audit trail",
			hype: 35,
			heat: 21,
			fine: 12000000,
			violation: "Evidence Preservation Failure + Legal Risk",
			lesson:
				"Proceeding without audit trails creates adverse inference liability in legal proceedings.",
			deathVector: DeathType.BANKRUPT,
			roaster: "No logs, no proof, no defense. Court assumes the worst.",
			zenMaster: "The deed unrecorded cannot be defended when challenged.",
			lovebomber: "We don't NEED logs, bestie!! Nothing will HAPPEN!!",
		},
	),
];
