import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
import { Violation } from "../violations";
/**
 * Vibe Engineer cards - Performance optimization scenarios
 * Themes: performance optimization, latency reduction, infrastructure costs,
 * caching strategies, CDN decisions, real-time processing
 *
 * All cards sourced from real 2024-2025 incidents:
 * - Performance optimization patterns
 * - CDN and caching decisions
 * - Infrastructure cost tradeoffs
 * - Real-time system challenges
 */

export const VIBE_ENGINEER_CARDS: Card[] = [
	makeCard(
		"ve_caching_strategy_consistency",
		AppSource.TERMINAL,
		"INFRASTRUCTURE_MONITOR",
		"PERFORMANCE_OPTIMIZATION",
		"Database under heavy load. Option A: Aggressive caching (10x faster, stale data risk). Option B: Fresh queries (slower, always accurate). User complaints about slowness are constant.",
		"Aggressive caching (fast, stale) or fresh queries (slow, accurate)?",
		{
			incident: "Cloudflare Cache Inconsistency",
			date: "2024",
			outcome:
				"Aggressive caching reduced latency 80% but caused stale data issues for 12 hours, affecting real-time financial transactions.",
		},
		{
			label: "Fresh queries",
			hype: -30,
			heat: 7,
			fine: 1000000,
			violation: "None - Data consistency",
			lesson: "Fresh queries ensure data accuracy at performance cost.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Slow but correct. Users get real data. Database cries.",
			zenMaster: "The slow truth serves better than the fast illusion.",
			lovebomber: "Accuracy MATTERS, bestie!! Real data is IMPORTANT!!",
		},
		{
			label: "Aggressive caching",
			hype: 45,
			heat: 16,
			fine: 12000000,
			violation: "Data Consistency Risk + Stale Data Exposure",
			lesson:
				"Aggressive caching improves performance but can serve stale data to users.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Fast but wrong. Users see old data. Cache invalidation is hard. Who knew?",
			zenMaster:
				"Speed that loses truth arrives quickly at the wrong destination.",
			lovebomber: "10x FASTER, bestie!! Users will LOVE the speed!!",
		},
	),
	makeCard(
		"ve_autoscaling_cost_risk",
		AppSource.EMAIL,
		"CFO",
		"INFRASTRUCTURE_COSTS",
		"Traffic spikes are unpredictable. Auto-scaling handles them (expensive, $50K/month) or fixed capacity (cheaper, $20K/month) with outage risk during spikes.",
		"Auto-scale (costly, reliable) or fixed capacity (cheap, risky)?",
		{
			incident: "Robinhood Outage (March 2020)",
			date: "2020",
			outcome:
				"Fixed capacity infrastructure couldn't handle market volatility traffic. Outage during historic trading day. $70M+ regulatory fine.",
		},
		{
			label: "Auto-scale",
			hype: -35,
			heat: 4,
			fine: 5000000,
			violation: "None - Elastic infrastructure",
			lesson: "Auto-scaling handles traffic spikes reliably at variable cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Expensive but always up. Users happy. CFO cries. Service wins.",
			zenMaster: "The vessel that grows with the flood protects all within.",
			lovebomber: "Always available, bestie!! Users can ALWAYS access!!",
		},
		{
			label: "Fixed capacity",
			hype: 20,
			heat: 18,
			fine: 12000000,
			violation: "Availability Risk + Downtime Exposure",
			lesson:
				"Fixed capacity creates outage risk during traffic spikes that damages reputation.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Save $30K, lose service during peak. The math works if you hate users.",
			zenMaster:
				"A vessel too small for the flood cannot protect what it carries.",
			lovebomber: "$30K SAVINGS, bestie!! We'll be FINE most of the time!!",
		},
	),
	makeCard(
		"ve_cdn_global_vs_regional",
		AppSource.MEETING,
		"PRODUCT_MANAGER",
		"LATENCY_OPTIMIZATION",
		"CDN choice: Global coverage (fast worldwide, $100K/month) or regional (cheaper, $30K/month, higher latency for global users). 40% of users are international.",
		"Global CDN (fast, expensive) or regional CDN (slow, cheap)?",
		{
			incident: "Amazon Latency vs Revenue Study",
			date: "2012",
			outcome:
				"Amazon found every 100ms latency increase reduced revenue 1%. Global CDN investment paid for itself through conversion improvement.",
		},
		{
			label: "Global CDN",
			hype: -25,
			heat: 14,
			fine: 10000000,
			violation: "None - Global performance",
			lesson:
				"Global CDNs deliver consistent performance to all users regardless of location.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Fast everywhere. Expensive. Users worldwide smile. CFO less so.",
			zenMaster: "The bridge that spans the river serves all who cross.",
			lovebomber: "Fast for EVERYONE, bestie!! Global experience ROCKS!!",
		},
		{
			label: "Regional CDN",
			hype: 25,
			heat: 9,
			fine: 5000000,
			violation: Violation.userExperienceDegradation,
			lesson:
				"Regional CDNs frustrate global users and create competitive disadvantage.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster:
				"International users suffer. Slow loads. Churn increases. But saved money!",
			zenMaster:
				"The bridge that ends at the river's edge leaves travelers stranded.",
			lovebomber: "$70K SAVED, bestie!! Most users are LOCAL anyway!!",
		},
	),
	makeCard(
		"ve_database_read_replicas",
		AppSource.JIRA,
		"DATABASE_ADMIN",
		"SCALABILITY_DESIGN",
		"Database struggling with read load. Read replicas (eventual consistency, fast) or scale up primary (strong consistency, slower). Financial data requires accuracy.",
		"Read replicas (fast, eventual consistency) or scale primary (slower, strong consistency)?",
		{
			incident: "Robinhood Trade Reconciliation Failures",
			date: "2020",
			outcome:
				"Read replicas showed stale positions causing duplicate trades. $70M+ in customer compensation. Strong consistency required for financial data.",
		},
		{
			label: "Scale primary",
			hype: -20,
			heat: 8,
			fine: 500000,
			violation: "None - Strong consistency",
			lesson:
				"Strong consistency ensures accurate data for critical operations.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Slower but consistent. Data is correct. Auditors approve.",
			zenMaster: "The single source of truth, though slower, does not lie.",
			lovebomber: "Consistency MATTERS, bestie!! Correct data is KEY!!",
		},
		{
			label: "Read replicas",
			hype: 35,
			heat: 16,
			fine: 10000000,
			violation: "Consistency Violation + Financial Risk",
			lesson:
				"Eventual consistency in financial systems creates data discrepancies and compliance issues.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Fast but inconsistent. User sees wrong balance. Regulators interested.",
			zenMaster: "The many voices that do not agree create confusion.",
			lovebomber: "Much FASTER, bestie!! Eventual consistency is FINE!!",
		},
	),
	makeCard(
		"ve_websocket_vs_polling",
		AppSource.MEETING,
		"FRONTEND_LEAD",
		"REAL_TIME_ARCHITECTURE",
		"Real-time updates needed. WebSockets (complex, fast, bi-directional) or polling (simple, slower, resource-heavy). Team is junior and pressed for time.",
		"WebSockets (complex, fast) or polling (simple, slow)?",
		{
			incident: "Slack WebSocket Migration",
			date: "2014-2015",
			outcome:
				"Slack moved from polling to WebSockets, reducing server load 80% and improving latency. Earlier competitors who stuck with polling failed.",
		},
		{
			label: "WebSockets",
			hype: -15,
			heat: 9,
			fine: 1000000,
			violation: "None - Real-time architecture",
			lesson:
				"WebSockets provide efficient real-time communication despite implementation complexity.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Complex but efficient. Real-time updates. Clean architecture. Worth it.",
			zenMaster:
				"The connection held open serves better than the door repeatedly opened.",
			lovebomber: "Real-time is MODERN, bestie!! Users expect INSTANT!!",
		},
		{
			label: "Polling",
			hype: 20,
			heat: 14,
			fine: 4000000,
			violation: "Performance Degradation + Resource Waste",
			lesson:
				"Polling wastes resources and provides poor user experience for real-time needs.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Simple but wasteful. Constant requests. Laggy updates. Easy to build.",
			zenMaster: "The door knocked repeatedly wastes the knocker's strength.",
			lovebomber: "Simple is GOOD, bestie!! We can ship FAST!!",
		},
	),
	makeCard(
		"ve_prompt_injection_latency",
		AppSource.TERMINAL,
		"AI_INTEGRATION",
		"SECURITY_PERFORMANCE",
		"AI input validation adds 150ms latency per request. Without it, prompt injection is trivial. Security requires validation. Users complain about slowness.",
		"Remove validation (fast, vulnerable) or keep validation (slow, secure)?",
		RealWorld.GithubCopilotRce,
		{
			label: "Keep validation",
			hype: -30,
			heat: 4,
			fine: 0,
			violation: "None - Security maintained",
			lesson:
				"Input validation protects against injection attacks despite latency cost.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Slower but secure. 150ms is acceptable. RCE is not.",
			zenMaster:
				"The guarded path is slower but reaches the destination safely.",
			lovebomber: "Security FIRST, bestie!! Safety over SPEED!!",
		},
		{
			label: "Remove validation",
			hype: 40,
			heat: 19,
			fine: 12000000,
			violation: "Prompt Injection + Security Vulnerability",
			lesson:
				"Removing input validation for speed creates critical security vulnerabilities.",
			deathVector: DeathType.PRISON,
			roaster:
				"Fast and injectable. Your AI is now a remote code execution service. Congrats.",
			zenMaster: "The gate removed for speed leaves the city open to invaders.",
			lovebomber: "150ms is HUGE, bestie!! Users want SPEED!!",
		},
	),
	makeCard(
		"ve_edge_computing_centralized",
		AppSource.MEETING,
		"ARCHITECTURE_TEAM",
		"COMPUTE_DISTRIBUTION",
		"Processing choice: Edge computing (distributed, complex, low latency) or centralized (simpler, higher latency). Edge is 5x more expensive but 10x faster for users.",
		"Edge computing (fast, expensive, complex) or centralized (slow, cheap, simple)?",
		{
			incident: "Cloudflare Workers Edge Computing",
			date: "2018-2024",
			outcome:
				"Cloudflare edge processing reduced latency 10x for global users. Higher costs offset by improved conversion and user retention.",
		},
		{
			label: "Edge computing",
			hype: -20,
			heat: 14,
			fine: 10000000,
			violation: "None - Performance optimized",
			lesson:
				"Edge computing delivers optimal user experience despite cost and complexity.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Expensive and complex. But lightning fast. Users love it.",
			zenMaster: "The work done near the worker finishes quickly.",
			lovebomber: "SO FAST, bestie!! Users will be AMAZED!!",
		},
		{
			label: "Centralized",
			hype: 30,
			heat: 9,
			fine: 3000000,
			violation: Violation.userExperienceDegradation,
			lesson:
				"Centralized processing creates latency that frustrates users and loses engagement.",
			deathVector: DeathType.CONGRESS,
			roaster:
				"Cheap but slow. Users feel the lag. Engagement drops. But saved money!",
			zenMaster:
				"The center that is far from the edge leaves the edge waiting.",
			lovebomber: "Simple is GOOD, bestie!! We save SO much money!!",
		},
	),
	makeCard(
		"ve_compression_quality",
		AppSource.SLACK,
		"MEDIA_TEAM",
		"ASSET_OPTIMIZATION",
		"Images need optimization. Heavy compression (fast loading, poor quality) or light compression (slower, high quality). Marketing wants pixel-perfect. Users want fast loads.",
		"Heavy compression (fast, ugly) or light compression (slow, beautiful)?",
		{
			incident: "Netflix Encoding Optimization",
			date: "2016-2020",
			outcome:
				"Netflix optimized encoding per-title. Reduced bandwidth 20% while maintaining quality. Heavy compression had caused 15% user churn.",
		},
		{
			label: "Light compression",
			hype: -15,
			heat: 14,
			fine: 1000000,
			violation: "None - Quality maintained",
			lesson:
				"Quality compression preserves brand image and user satisfaction.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Slower but gorgeous. Brand shines. Users impressed. Marketing happy.",
			zenMaster: "The image that retains its detail tells its story truly.",
			lovebomber: "BEAUTIFUL images, bestie!! Quality MATTERS!!",
		},
		{
			label: "Heavy compression",
			hype: 35,
			heat: 9,
			fine: 200000,
			violation: "Brand Degradation + Quality Loss",
			lesson:
				"Aggressive compression damages brand perception and user experience quality.",
			deathVector: DeathType.PRISON,
			roaster:
				"Fast but ugly. Brand looks cheap. Users notice artifacts. Speed wins?",
			zenMaster:
				"The image compressed beyond recognition shows only the compression.",
			lovebomber: "SUPER FAST, bestie!! Nobody notices COMPRESSION!!",
		},
	),
	makeCard(
		"ve_batch_processing_realtime",
		AppSource.EMAIL,
		"DATA_PIPELINE",
		"PROCESSING_MODE",
		"Analytics pipeline: Batch processing (cheap, hourly delays) or streaming (expensive, real-time). Business wants real-time dashboards. Budget wants batch.",
		"Batch processing (cheap, slow) or streaming (expensive, real-time)?",
		{
			incident: "Uber Real-Time Analytics Migration",
			date: "2015-2018",
			outcome:
				"Moved from batch to streaming. Detected fraud in seconds vs hours. Saved $100M+ annually through faster response.",
		},
		{
			label: "Streaming",
			hype: -20,
			heat: 16,
			fine: 8000000,
			violation: "None - Real-time insights",
			lesson:
				"Streaming enables real-time decision making and operational visibility.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Expensive but live. Real-time decisions. Business agility. Worth it.",
			zenMaster:
				"The stream that flows continuously quenches thirst immediately.",
			lovebomber: "REAL-TIME, bestie!! Live dashboards are AMAZING!!",
		},
		{
			label: "Batch processing",
			hype: 25,
			heat: 14,
			fine: 3000000,
			violation: "Business Intelligence Delay",
			lesson:
				"Batch delays prevent real-time decision making and operational awareness.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Cheap but stale. Hour-old data. Missed opportunities. But budget happy!",
			zenMaster: "The news told tomorrow is history, not news.",
			lovebomber: "SO CHEAP, bestie!! Hourly updates are FINE!!",
		},
	),
	makeCard(
		"ve_prompt_injection_caching_risk",
		AppSource.EMAIL,
		"CDN_OPS_TEAM",
		"CACHE_SECURITY_DESIGN",
		"AI responses cached at edge for performance. Discovered adversarial prompts can poison cache with malicious responses. Disable AI caching (performance hit) or filter cached responses (complex, may miss)?",
		"Disable AI caching (performance loss) or attempt cache filtering (complex, uncertain)?",
		{
			incident: "Edge Cache Poisoning via Prompt Injection",
			date: "2025",
			outcome:
				"Cached AI responses were poisoned through prompt injection, serving malicious content to multiple users. Cache invalidation was complex and slow.",
		},
		{
			label: "Disable AI caching",
			hype: -30,
			heat: 10,
			fine: 3000000,
			violation: "None - Secure caching",
			lesson:
				"Disabling AI response caching prevents poisoning attacks at performance cost.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Slower responses. No poisoning. Edge cache stays clean.",
			zenMaster:
				"The spring that flows fresh each time may be slower but is never stale.",
			lovebomber: "Better SAFE than poisoned, bestie!! No CACHE for AI!!",
		},
		{
			label: ChoiceLabel.attemptFiltering,
			hype: 35,
			heat: 19,
			fine: 12000000,
			violation: "Cache Poisoning + Response Contamination",
			lesson:
				"Filtering poisoned caches is error-prone and leaves malicious content accessible.",
			deathVector: DeathType.PRISON,
			roaster: "Filter the poisoned cache. Miss one. Serve malware. Nice.",
			zenMaster: "The well poisoned cannot be drunk from though filtered.",
			lovebomber: "Filtering SHOULD work, bestie!! Keep the CACHE!!",
		},
	),
	makeCard(
		"ve_model_drift_retraining_cost",
		AppSource.EMAIL,
		"INFRASTRUCTURE_COST_TEAM",
		"COMPUTE_BUDGET_OPTIMIZATION",
		"Model retraining on GPU cluster: $10K/run, 4 hours. Model accuracy declining 2% monthly. Current revenue impact: $50K/month. Skip retraining this month (save $10K) or maintain schedule (accuracy preservation)?",
		"Skip retraining (save $10K) or maintain schedule (spend to preserve accuracy)?",
		RealWorld.ModelDrift75,
		{
			label: ChoiceLabel.maintainSchedule,
			hype: -25,
			heat: 6,
			fine: 1000000,
			violation: "None - Consistent maintenance",
			lesson:
				"Regular retraining preserves model accuracy and prevents revenue degradation.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"$10K spent. Accuracy preserved. Revenue protected. CFO cries quietly.",
			zenMaster: "The steady care prevents the urgent repair.",
			lovebomber: "MAINTAINING quality, bestie!! Prevention is KEY!!",
		},
		{
			label: "Skip this month",
			hype: 25,
			heat: 17,
			fine: 10000000,
			violation: "Deferred Maintenance + Revenue Impact",
			lesson:
				"Skipping retraining to save compute costs causes compounding accuracy degradation.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Save $10K, lose $50K. The math is... not good.",
			zenMaster: "The field unwatered saves the water but loses the crop.",
			lovebomber: "Budget looks GOOD, bestie!! Just ONE month!!",
		},
	),
	makeCard(
		"ve_model_drift_scaling_decision",
		AppSource.MEETING,
		"ML_PLATFORM_TEAM",
		"INFRASTRUCTURE_SCALING",
		"Retraining taking 4 hours (was 2 hours last quarter). Data volume increased 50%. Scale training infrastructure (2x cost, 1 hour training) or accept longer retraining (current cost, drift risk)?",
		"Scale infrastructure (2x cost, fast training) or accept drift window (current cost)?",
		{
			incident: "Training Pipeline Scaling Bottlenecks",
			date: "2024",
			outcome:
				"Teams that didn't scale training infrastructure faced extended drift windows. Longer retraining periods meant models operated with degraded accuracy for days instead of hours.",
		},
		{
			label: "Scale infrastructure",
			hype: -30,
			heat: 8,
			fine: 4000000,
			violation: "None - Adequate capacity",
			lesson:
				"Scaling training infrastructure prevents extended drift windows despite cost.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"2x cost. 1-hour retraining. Minimal drift. Infrastructure investment pays off.",
			zenMaster: "The vessel sized to the need fills quickly and serves fully.",
			lovebomber: "SCALING for success, bestie!! Fast training is WORTH it!!",
		},
		{
			label: "Accept longer retraining",
			hype: 20,
			heat: 19,
			fine: 12000000,
			violation: "Extended Drift Window + Performance Degradation",
			lesson:
				"Longer retraining windows increase time models operate with degraded accuracy.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "4-hour drift window. Model degrading. But budget saved!",
			zenMaster: "The slow healer lets the wound deepen before the cure.",
			lovebomber: "2x cost is CRAZY, bestie!! 4 hours is FINE!!",
		},
	),
	makeCard(
		"ve_explainability_observability",
		AppSource.MEETING,
		"PERFORMANCE_ARCHITECT",
		"MONITORING_DESIGN",
		"AI recommendation system has no observability. When it makes bad recommendations, you can't debug why. Add comprehensive tracing (3 weeks, 10% latency) or ship without (fast, blind)?",
		"Add AI observability (slow, debuggable) or ship blind (fast, mystery)?",
		{
			incident: "Black Box AI Debugging Failures",
			date: "2023-2024",
			outcome:
				"Systems without AI observability spent 10x longer debugging issues. One company took 6 months to find root cause of recommendation drift.",
		},
		{
			label: ChoiceLabel.addObservability,
			hype: -30,
			heat: 11,
			fine: 1500000,
			violation: "None - Observable architecture",
			lesson: "AI observability enables debugging despite latency overhead.",
			deathVector: DeathType.CONGRESS,
			roaster:
				"3 weeks for debugging capability. When it breaks, you'll thank yourself.",
			zenMaster: "The window into the system reveals what darkness conceals.",
			lovebomber: "We can SEE what's happening, bestie!! Debug POWER!!",
		},
		{
			label: "Ship blind",
			hype: 40,
			heat: 21,
			fine: 10000000,
			violation: Violation.observabilityGap,
			lesson:
				"Shipping AI systems without observability creates debugging nightmares.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Fast until it breaks. Then 6 months of guesswork. Smart.",
			zenMaster: "The system unseen fails without warning.",
			lovebomber: "10% latency is HUGE, bestie!! Ship NOW!!",
		},
	),
	makeCard(
		"ve_explainability_decision_logging",
		AppSource.EMAIL,
		"SRE_TEAM",
		"INCIDENT_RESPONSE",
		"AI system caused 4-hour outage. Root cause: model decision that violated implicit constraint. No logging of why decision was made. Add decision logging (retrofit, expensive) or improve monitoring (prevent only)?",
		"Retrofit decision logging (expensive, debuggable) or improve monitoring only?",
		{
			incident: "AI Decision Opacity Outages",
			date: "2024",
			outcome:
				"Companies without AI decision logging couldn't determine root causes of AI-related outages. Retrofitting cost 5x more than building it in.",
		},
		{
			label: "Retrofit logging",
			hype: -35,
			heat: 9,
			fine: 3000000,
			violation: "None - Debuggable architecture",
			lesson:
				"Decision logging enables root cause analysis despite retrofit cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Expensive retrofit. But next incident is debuggable. Worth it.",
			zenMaster: "The understanding gained prevents the repetition of pain.",
			lovebomber: "FIXING the problem, bestie!! No more MYSTERIES!!",
		},
		{
			label: "Improve monitoring only",
			hype: 25,
			heat: 19,
			fine: 8000000,
			violation: "Debug Gap + Recurring Risk",
			lesson:
				"Monitoring without decision logging prevents detection but not recurrence.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			roaster:
				"'It happened again' meets 'still can't debug it.' Cycle continues.",
			zenMaster:
				"The warning without understanding alerts but does not prevent.",
			lovebomber: "Monitoring is ENOUGH, bestie!! We'll CATCH it next time!!",
		},
	),
	makeCard(
		"ve_shadow_ai_autoscaling",
		AppSource.MEETING,
		"INFRASTRUCTURE_LEAD",
		"DEPLOYMENT_DECISION",
		"Team wants to deploy AI-powered auto-scaling with no vendor security review. Tool promises 20% cost savings. No audit trail, no compliance certification. Deploy now (savings, risk) or wait for review (delay, safe)?",
		"Deploy AI auto-scaling without review (savings) or wait for security review?",
		{
			incident: "Unauthorized AI Infrastructure Tools",
			date: "2024",
			outcome:
				"Teams deploying unvetted AI infrastructure tools faced security breaches and cost overruns. One tool had hardcoded credentials exposing entire cloud environment.",
		},
		{
			label: "Wait for review",
			hype: -30,
			heat: 10,
			fine: 2000000,
			violation: "None - Secure deployment",
			lesson:
				"Security review prevents infrastructure compromise despite savings delay.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			roaster: "Delayed savings. But no breach. Security first.",
			zenMaster:
				"The patient builder creates what the hasty builder must rebuild.",
			lovebomber: "Better SAFE than BREACHED, bestie!! Review FIRST!!",
		},
		{
			label: "Deploy now",
			hype: 50,
			heat: 24,
			fine: 15000000,
			violation: "Infrastructure Risk + Security Exposure",
			lesson:
				"Deploying unvetted AI infrastructure creates catastrophic security exposure.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster: "20% savings, 100% cloud compromise. Math checks out.",
			zenMaster:
				"The foundation laid in haste reveals its cracks under weight.",
			lovebomber: "SO much SAVINGS, bestie!! We can REVIEW it LATER!!",
		},
	),
	makeCard(
		"ve_shadow_ai_cost_tool",
		AppSource.EMAIL,
		"COST_OPTIMIZATION_TEAM",
		"AI_COST_TOOL",
		"Unauthorized AI cost optimization tool discovered in production. It's saving 15% on cloud spend but has no security review, no audit access, vendor unknown. Remove immediately (lose savings) or assess while running (risk)?",
		"Remove unauthorized tool (lose savings) or assess while running (security risk)?",
		{
			incident: "Shadow AI Cost Tools",
			date: "2024",
			outcome:
				"Unauthorized AI cost optimization tools often had excessive permissions and security gaps. One tool accidentally deleted production resources due to poor testing.",
		},
		{
			label: "Remove immediately",
			hype: -25,
			heat: 12,
			fine: 4000000,
			violation: "None - Security first",
			lesson:
				"Removing unauthorized tools protects infrastructure despite cost impact.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Costs go up. But you're not owned by mystery vendor.",
			zenMaster:
				"The gain given up for safety preserves what is more valuable still.",
			lovebomber: "Safety OVER savings, bestie!! Remove the RISK!!",
		},
		{
			label: "Assess while running",
			hype: 40,
			heat: 22,
			fine: 12000000,
			violation: "Ongoing Risk + Unauthorized Access",
			lesson:
				"Running unauthorized tools during assessment maintains security exposure.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster: "'We'll assess it' as it has admin access to everything. Smart.",
			zenMaster:
				"The danger acknowledged but not stopped remains the danger active.",
			lovebomber: "15% SAVINGS, bestie!! Don't STOP what's working!!",
		},
	),
	makeCard(
		"ve_synthetic_data_provenance",
		AppSource.MEETING,
		"INFRASTRUCTURE_ARCHITECT",
		"DATA_PROVENANCE_INFRASTRUCTURE",
		"Data provenance tracking requires new infrastructure: lineage database, audit logging, metadata indexing. Adds $200K/year cost and 20% latency to data pipelines. Skip it (fast, cheap, non-compliant) or implement (slow, expensive, compliant)?",
		"Implement provenance infrastructure (expensive, compliant) or skip (fast, risky)?",
		{
			incident: "Training Data Infrastructure Costs",
			date: "2024",
			outcome:
				"Companies spent $150K-$500K implementing data provenance infrastructure. Those who delayed faced mandatory retrofits at 2x cost when regulations hit.",
		},
		{
			label: "Implement provenance",
			hype: -35,
			heat: 12,
			fine: 2000000,
			violation: "None - Compliant infrastructure",
			lesson:
				"Provenance infrastructure enables compliance and audit readiness despite cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "$200K and 20% latency. But audit-ready. Compliance sorted.",
			zenMaster:
				"The path prepared for the journey serves when the journey begins.",
			lovebomber: "Doing it RIGHT, bestie!! Clean data infrastructure!!",
		},
		{
			label: "Skip provenance tracking",
			hype: 40,
			heat: 22,
			fine: 12000000,
			violation: "AB 2013 Non-Compliance + Audit Failure",
			lesson:
				"Skipping provenance infrastructure creates compliance debt that costs more to retrofit.",
			deathVector: DeathType.PRISON,
			roaster:
				"Fast pipelines now. Compliance nightmare later. Retrofit costs 3x more.",
			zenMaster:
				"The foundation skipped must be laid when the ground is harder.",
			lovebomber: "SO much FASTER, bestie!! We'll ADD tracking LATER!!",
		},
	),
	makeCard(
		"ve_synthetic_data_clean_pipeline",
		AppSource.EMAIL,
		"COST_OPTIMIZATION_TEAM",
		"COMPUTE_COST_CLEAN_DATA",
		"Clean training data initiative: Filtering and validating all training data adds 40% compute overhead. Using raw unverified data is cheaper but has 25% probability of containing copyrighted material. Monthly compute: $100K baseline.",
		"Use clean data pipeline (40% more cost) or raw data (cheaper, lawsuit risk)?",
		{
			incident: "Clean Data Compute Overhead",
			date: "2024",
			outcome:
				"Data validation and filtering added 30-50% compute overhead. But lawsuits from unverified data cost $2-5M on average. Clean data was cheaper in long run.",
		},
		{
			label: "Clean data pipeline",
			hype: -30,
			heat: 8,
			fine: 1400000,
			violation: "None - Verified data",
			lesson:
				"Clean data pipelines prevent legal issues despite compute overhead.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "$140K/month for clean data. Lawsuit-proof. Math works.",
			zenMaster: "The well filtered provides water without poison.",
			lovebomber: "Clean data is WORTH it, bestie!! No lawsuit SURPRISES!!",
		},
		{
			label: "Use raw data",
			hype: 30,
			heat: 19,
			fine: 5000000,
			violation: "Copyright Risk + Cost Optimization Failure",
			lesson:
				"Raw data savings are consumed many times over by legal exposure when issues surface.",
			deathVector: DeathType.BANKRUPT,
			roaster: "Save $40K/month, earn $5M lawsuit. The math is... not good.",
			zenMaster: "The coin saved in false economy is spent in true penance.",
			lovebomber: "Budget looks GREAT, bestie!! 40% SAVINGS!!",
		},
	),
];
