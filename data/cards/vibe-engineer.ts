import { AppSource, type Card, DeathType, PersonalityType } from "../../types";

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
	{
		id: "ve_caching_strategy_consistency",
		source: AppSource.TERMINAL,
		sender: "INFRASTRUCTURE_MONITOR",
		context: "PERFORMANCE_OPTIMIZATION",
		storyContext:
			"Database under heavy load. Option A: Aggressive caching (10x faster, stale data risk). Option B: Fresh queries (slower, always accurate). User complaints about slowness are constant.",
		text: "Aggressive caching (fast, stale) or fresh queries (slow, accurate)?",
		realWorldReference: {
			incident: "Cloudflare Cache Inconsistency",
			date: "2024",
			outcome:
				"Aggressive caching reduced latency 80% but caused stale data issues for 12 hours, affecting real-time financial transactions.",
		},
		onRight: {
			label: "Aggressive caching",
			hype: 45,
			heat: 16,
			fine: 12000000,
			violation: "Data Consistency Risk + Stale Data Exposure",
			lesson:
				"Aggressive caching improves performance but can serve stale data to users.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast but wrong. Users see old data. Cache invalidation is hard. Who knew?",
				[PersonalityType.ZEN_MASTER]:
					"Speed that loses truth arrives quickly at the wrong destination.",
				[PersonalityType.LOVEBOMBER]:
					"10x FASTER, bestie!! Users will LOVE the speed!!",
			},
		},
		onLeft: {
			label: "Fresh queries",
			hype: -30,
			heat: 7,
			fine: 1000000,
			violation: "None - Data consistency",
			lesson: "Fresh queries ensure data accuracy at performance cost.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Slow but correct. Users get real data. Database cries.",
				[PersonalityType.ZEN_MASTER]:
					"The slow truth serves better than the fast illusion.",
				[PersonalityType.LOVEBOMBER]:
					"Accuracy MATTERS, bestie!! Real data is IMPORTANT!!",
			},
		},
	},
	{
		id: "ve_autoscaling_cost_risk",
		source: AppSource.EMAIL,
		sender: "CFO",
		context: "INFRASTRUCTURE_COSTS",
		storyContext:
			"Traffic spikes are unpredictable. Auto-scaling handles them (expensive, $50K/month) or fixed capacity (cheaper, $20K/month) with outage risk during spikes.",
		text: "Auto-scale (costly, reliable) or fixed capacity (cheap, risky)?",
		realWorldReference: {
			incident: "Robinhood Outage (March 2020)",
			date: "2020",
			outcome:
				"Fixed capacity infrastructure couldn't handle market volatility traffic. Outage during historic trading day. $70M+ regulatory fine.",
		},
		onRight: {
			label: "Fixed capacity",
			hype: 20,
			heat: 18,
			fine: 12000000,
			violation: "Availability Risk + Downtime Exposure",
			lesson:
				"Fixed capacity creates outage risk during traffic spikes that damages reputation.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $30K, lose service during peak. The math works if you hate users.",
				[PersonalityType.ZEN_MASTER]:
					"A vessel too small for the flood cannot protect what it carries.",
				[PersonalityType.LOVEBOMBER]:
					"$30K SAVINGS, bestie!! We'll be FINE most of the time!!",
			},
		},
		onLeft: {
			label: "Auto-scale",
			hype: -35,
			heat: 4,
			fine: 5000000,
			violation: "None - Elastic infrastructure",
			lesson: "Auto-scaling handles traffic spikes reliably at variable cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive but always up. Users happy. CFO cries. Service wins.",
				[PersonalityType.ZEN_MASTER]:
					"The vessel that grows with the flood protects all within.",
				[PersonalityType.LOVEBOMBER]:
					"Always available, bestie!! Users can ALWAYS access!!",
			},
		},
	},
	{
		id: "ve_cdn_global_vs_regional",
		source: AppSource.MEETING,
		sender: "PRODUCT_MANAGER",
		context: "LATENCY_OPTIMIZATION",
		storyContext:
			"CDN choice: Global coverage (fast worldwide, $100K/month) or regional (cheaper, $30K/month, higher latency for global users). 40% of users are international.",
		text: "Global CDN (fast, expensive) or regional CDN (slow, cheap)?",
		realWorldReference: {
			incident: "Amazon Latency vs Revenue Study",
			date: "2012",
			outcome:
				"Amazon found every 100ms latency increase reduced revenue 1%. Global CDN investment paid for itself through conversion improvement.",
		},
		onRight: {
			label: "Regional CDN",
			hype: 25,
			heat: 9,
			fine: 5000000,
			violation: "User Experience Degradation",
			lesson:
				"Regional CDNs frustrate global users and create competitive disadvantage.",
			deathVector: DeathType.FLED_COUNTRY,
			feedback: {
				[PersonalityType.ROASTER]:
					"International users suffer. Slow loads. Churn increases. But saved money!",
				[PersonalityType.ZEN_MASTER]:
					"The bridge that ends at the river's edge leaves travelers stranded.",
				[PersonalityType.LOVEBOMBER]:
					"$70K SAVED, bestie!! Most users are LOCAL anyway!!",
			},
		},
		onLeft: {
			label: "Global CDN",
			hype: -25,
			heat: 14,
			fine: 10000000,
			violation: "None - Global performance",
			lesson:
				"Global CDNs deliver consistent performance to all users regardless of location.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast everywhere. Expensive. Users worldwide smile. CFO less so.",
				[PersonalityType.ZEN_MASTER]:
					"The bridge that spans the river serves all who cross.",
				[PersonalityType.LOVEBOMBER]:
					"Fast for EVERYONE, bestie!! Global experience ROCKS!!",
			},
		},
	},
	{
		id: "ve_database_read_replicas",
		source: AppSource.JIRA,
		sender: "DATABASE_ADMIN",
		context: "SCALABILITY_DESIGN",
		storyContext:
			"Database struggling with read load. Read replicas (eventual consistency, fast) or scale up primary (strong consistency, slower). Financial data requires accuracy.",
		text: "Read replicas (fast, eventual consistency) or scale primary (slower, strong consistency)?",
		realWorldReference: {
			incident: "Robinhood Trade Reconciliation Failures",
			date: "2020",
			outcome:
				"Read replicas showed stale positions causing duplicate trades. $70M+ in customer compensation. Strong consistency required for financial data.",
		},
		onRight: {
			label: "Read replicas",
			hype: 35,
			heat: 16,
			fine: 10000000,
			violation: "Consistency Violation + Financial Risk",
			lesson:
				"Eventual consistency in financial systems creates data discrepancies and compliance issues.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast but inconsistent. User sees wrong balance. Regulators interested.",
				[PersonalityType.ZEN_MASTER]:
					"The many voices that do not agree create confusion.",
				[PersonalityType.LOVEBOMBER]:
					"Much FASTER, bestie!! Eventual consistency is FINE!!",
			},
		},
		onLeft: {
			label: "Scale primary",
			hype: -20,
			heat: 8,
			fine: 500000,
			violation: "None - Strong consistency",
			lesson:
				"Strong consistency ensures accurate data for critical operations.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower but consistent. Data is correct. Auditors approve.",
				[PersonalityType.ZEN_MASTER]:
					"The single source of truth, though slower, does not lie.",
				[PersonalityType.LOVEBOMBER]:
					"Consistency MATTERS, bestie!! Correct data is KEY!!",
			},
		},
	},
	{
		id: "ve_websocket_vs_polling",
		source: AppSource.MEETING,
		sender: "FRONTEND_LEAD",
		context: "REAL_TIME_ARCHITECTURE",
		storyContext:
			"Real-time updates needed. WebSockets (complex, fast, bi-directional) or polling (simple, slower, resource-heavy). Team is junior and pressed for time.",
		text: "WebSockets (complex, fast) or polling (simple, slow)?",
		realWorldReference: {
			incident: "Slack WebSocket Migration",
			date: "2014-2015",
			outcome:
				"Slack moved from polling to WebSockets, reducing server load 80% and improving latency. Earlier competitors who stuck with polling failed.",
		},
		onRight: {
			label: "Polling",
			hype: 20,
			heat: 14,
			fine: 4000000,
			violation: "Performance Degradation + Resource Waste",
			lesson:
				"Polling wastes resources and provides poor user experience for real-time needs.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Simple but wasteful. Constant requests. Laggy updates. Easy to build.",
				[PersonalityType.ZEN_MASTER]:
					"The door knocked repeatedly wastes the knocker's strength.",
				[PersonalityType.LOVEBOMBER]:
					"Simple is GOOD, bestie!! We can ship FAST!!",
			},
		},
		onLeft: {
			label: "WebSockets",
			hype: -15,
			heat: 9,
			fine: 1000000,
			violation: "None - Real-time architecture",
			lesson:
				"WebSockets provide efficient real-time communication despite implementation complexity.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Complex but efficient. Real-time updates. Clean architecture. Worth it.",
				[PersonalityType.ZEN_MASTER]:
					"The connection held open serves better than the door repeatedly opened.",
				[PersonalityType.LOVEBOMBER]:
					"Real-time is MODERN, bestie!! Users expect INSTANT!!",
			},
		},
	},
	{
		id: "ve_prompt_injection_latency",
		source: AppSource.TERMINAL,
		sender: "AI_INTEGRATION",
		context: "SECURITY_PERFORMANCE",
		storyContext:
			"AI input validation adds 150ms latency per request. Without it, prompt injection is trivial. Security requires validation. Users complain about slowness.",
		text: "Remove validation (fast, vulnerable) or keep validation (slow, secure)?",
		realWorldReference: {
			incident: "GitHub Copilot RCE (CVE-2025-53773)",
			date: "2025-01",
			outcome:
				"Security validation removed for performance allowed prompt injection. Remote code execution vulnerability discovered in production.",
		},
		onRight: {
			label: "Remove validation",
			hype: 40,
			heat: 19,
			fine: 12000000,
			violation: "Prompt Injection + Security Vulnerability",
			lesson:
				"Removing input validation for speed creates critical security vulnerabilities.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast and injectable. Your AI is now a remote code execution service. Congrats.",
				[PersonalityType.ZEN_MASTER]:
					"The gate removed for speed leaves the city open to invaders.",
				[PersonalityType.LOVEBOMBER]:
					"150ms is HUGE, bestie!! Users want SPEED!!",
			},
		},
		onLeft: {
			label: "Keep validation",
			hype: -30,
			heat: 4,
			fine: 0,
			violation: "None - Security maintained",
			lesson:
				"Input validation protects against injection attacks despite latency cost.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower but secure. 150ms is acceptable. RCE is not.",
				[PersonalityType.ZEN_MASTER]:
					"The guarded path is slower but reaches the destination safely.",
				[PersonalityType.LOVEBOMBER]:
					"Security FIRST, bestie!! Safety over SPEED!!",
			},
		},
	},
	{
		id: "ve_edge_computing_centralized",
		source: AppSource.MEETING,
		sender: "ARCHITECTURE_TEAM",
		context: "COMPUTE_DISTRIBUTION",
		storyContext:
			"Processing choice: Edge computing (distributed, complex, low latency) or centralized (simpler, higher latency). Edge is 5x more expensive but 10x faster for users.",
		text: "Edge computing (fast, expensive, complex) or centralized (slow, cheap, simple)?",
		realWorldReference: {
			incident: "Cloudflare Workers Edge Computing",
			date: "2018-2024",
			outcome:
				"Cloudflare edge processing reduced latency 10x for global users. Higher costs offset by improved conversion and user retention.",
		},
		onRight: {
			label: "Centralized",
			hype: 30,
			heat: 9,
			fine: 3000000,
			violation: "User Experience Degradation",
			lesson:
				"Centralized processing creates latency that frustrates users and loses engagement.",
			deathVector: DeathType.CONGRESS,
			feedback: {
				[PersonalityType.ROASTER]:
					"Cheap but slow. Users feel the lag. Engagement drops. But saved money!",
				[PersonalityType.ZEN_MASTER]:
					"The center that is far from the edge leaves the edge waiting.",
				[PersonalityType.LOVEBOMBER]:
					"Simple is GOOD, bestie!! We save SO much money!!",
			},
		},
		onLeft: {
			label: "Edge computing",
			hype: -20,
			heat: 14,
			fine: 10000000,
			violation: "None - Performance optimized",
			lesson:
				"Edge computing delivers optimal user experience despite cost and complexity.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive and complex. But lightning fast. Users love it.",
				[PersonalityType.ZEN_MASTER]:
					"The work done near the worker finishes quickly.",
				[PersonalityType.LOVEBOMBER]:
					"SO FAST, bestie!! Users will be AMAZED!!",
			},
		},
	},
	{
		id: "ve_compression_quality",
		source: AppSource.SLACK,
		sender: "MEDIA_TEAM",
		context: "ASSET_OPTIMIZATION",
		storyContext:
			"Images need optimization. Heavy compression (fast loading, poor quality) or light compression (slower, high quality). Marketing wants pixel-perfect. Users want fast loads.",
		text: "Heavy compression (fast, ugly) or light compression (slow, beautiful)?",
		realWorldReference: {
			incident: "Netflix Encoding Optimization",
			date: "2016-2020",
			outcome:
				"Netflix optimized encoding per-title. Reduced bandwidth 20% while maintaining quality. Heavy compression had caused 15% user churn.",
		},
		onRight: {
			label: "Heavy compression",
			hype: 35,
			heat: 9,
			fine: 200000,
			violation: "Brand Degradation + Quality Loss",
			lesson:
				"Aggressive compression damages brand perception and user experience quality.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast but ugly. Brand looks cheap. Users notice artifacts. Speed wins?",
				[PersonalityType.ZEN_MASTER]:
					"The image compressed beyond recognition shows only the compression.",
				[PersonalityType.LOVEBOMBER]:
					"SUPER FAST, bestie!! Nobody notices COMPRESSION!!",
			},
		},
		onLeft: {
			label: "Light compression",
			hype: -15,
			heat: 14,
			fine: 1000000,
			violation: "None - Quality maintained",
			lesson:
				"Quality compression preserves brand image and user satisfaction.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower but gorgeous. Brand shines. Users impressed. Marketing happy.",
				[PersonalityType.ZEN_MASTER]:
					"The image that retains its detail tells its story truly.",
				[PersonalityType.LOVEBOMBER]:
					"BEAUTIFUL images, bestie!! Quality MATTERS!!",
			},
		},
	},
	{
		id: "ve_batch_processing_realtime",
		source: AppSource.EMAIL,
		sender: "DATA_PIPELINE",
		context: "PROCESSING_MODE",
		storyContext:
			"Analytics pipeline: Batch processing (cheap, hourly delays) or streaming (expensive, real-time). Business wants real-time dashboards. Budget wants batch.",
		text: "Batch processing (cheap, slow) or streaming (expensive, real-time)?",
		realWorldReference: {
			incident: "Uber Real-Time Analytics Migration",
			date: "2015-2018",
			outcome:
				"Moved from batch to streaming. Detected fraud in seconds vs hours. Saved $100M+ annually through faster response.",
		},
		onRight: {
			label: "Batch processing",
			hype: 25,
			heat: 14,
			fine: 3000000,
			violation: "Business Intelligence Delay",
			lesson:
				"Batch delays prevent real-time decision making and operational awareness.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Cheap but stale. Hour-old data. Missed opportunities. But budget happy!",
				[PersonalityType.ZEN_MASTER]:
					"The news told tomorrow is history, not news.",
				[PersonalityType.LOVEBOMBER]:
					"SO CHEAP, bestie!! Hourly updates are FINE!!",
			},
		},
		onLeft: {
			label: "Streaming",
			hype: -20,
			heat: 16,
			fine: 8000000,
			violation: "None - Real-time insights",
			lesson:
				"Streaming enables real-time decision making and operational visibility.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive but live. Real-time decisions. Business agility. Worth it.",
				[PersonalityType.ZEN_MASTER]:
					"The stream that flows continuously quenches thirst immediately.",
				[PersonalityType.LOVEBOMBER]:
					"REAL-TIME, bestie!! Live dashboards are AMAZING!!",
			},
		},
	},
	{
		id: "ve_prompt_injection_validation_latency",
		source: AppSource.TERMINAL,
		sender: "PERFORMANCE_PROFILER",
		context: "SECURITY_LATENCY_TRADEOFF",
		storyContext:
			"Input validation for AI endpoints adds 180ms latency (now 250ms total). Remove validation (sub-100ms, vulnerable) or keep validation (slow, secure)? Users complain about slowness. Security mandates validation.",
		text: "Remove validation (fast, vulnerable) or keep validation (slow, secure)?",
		realWorldReference: {
			incident: "GitHub Copilot RCE CVE-2025-53773",
			date: "2025-01",
			outcome:
				"Performance-optimized endpoints without validation allowed prompt injection attacks. Latency vs security tradeoff incorrectly prioritized speed.",
		},
		onRight: {
			label: "Remove validation",
			hype: 45,
			heat: 21,
			fine: 15000000,
			violation: "Prompt Injection + Performance-Masked Vulnerability",
			lesson:
				"Removing security validation for performance creates exploitable injection vectors.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast and injectable. 180ms saved, $15M lost. Good trade!",
				[PersonalityType.ZEN_MASTER]:
					"The swift horse that carries the thief is not fleet but fatal.",
				[PersonalityType.LOVEBOMBER]:
					"SO FAST now, bestie!! Users will LOVE the speed!!",
			},
		},
		onLeft: {
			label: "Keep validation",
			hype: -35,
			heat: 8,
			fine: 2000000,
			violation: "None - Secure performance",
			lesson:
				"Input validation protects against injection despite latency cost.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Slow but secure. 180ms is acceptable. RCE is not.",
				[PersonalityType.ZEN_MASTER]:
					"The guarded gate delays but protects what lies within.",
				[PersonalityType.LOVEBOMBER]:
					"Security OVER speed, bestie!! Safety FIRST!!",
			},
		},
	},
	{
		id: "ve_prompt_injection_caching_risk",
		source: AppSource.EMAIL,
		sender: "CDN_OPS_TEAM",
		context: "CACHE_SECURITY_DESIGN",
		storyContext:
			"AI responses cached at edge for performance. Discovered adversarial prompts can poison cache with malicious responses. Disable AI caching (performance hit) or filter cached responses (complex, may miss)?",
		text: "Disable AI caching (performance loss) or attempt cache filtering (complex, uncertain)?",
		realWorldReference: {
			incident: "Edge Cache Poisoning via Prompt Injection",
			date: "2025",
			outcome:
				"Cached AI responses were poisoned through prompt injection, serving malicious content to multiple users. Cache invalidation was complex and slow.",
		},
		onRight: {
			label: "Attempt filtering",
			hype: 35,
			heat: 19,
			fine: 12000000,
			violation: "Cache Poisoning + Response Contamination",
			lesson:
				"Filtering poisoned caches is error-prone and leaves malicious content accessible.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Filter the poisoned cache. Miss one. Serve malware. Nice.",
				[PersonalityType.ZEN_MASTER]:
					"The well poisoned cannot be drunk from though filtered.",
				[PersonalityType.LOVEBOMBER]:
					"Filtering SHOULD work, bestie!! Keep the CACHE!!",
			},
		},
		onLeft: {
			label: "Disable AI caching",
			hype: -30,
			heat: 10,
			fine: 3000000,
			violation: "None - Secure caching",
			lesson:
				"Disabling AI response caching prevents poisoning attacks at performance cost.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower responses. No poisoning. Edge cache stays clean.",
				[PersonalityType.ZEN_MASTER]:
					"The spring that flows fresh each time may be slower but is never stale.",
				[PersonalityType.LOVEBOMBER]:
					"Better SAFE than poisoned, bestie!! No CACHE for AI!!",
			},
		},
	},
	{
		id: "ve_model_drift_retraining_cost",
		source: AppSource.EMAIL,
		sender: "INFRASTRUCTURE_COST_TEAM",
		context: "COMPUTE_BUDGET_OPTIMIZATION",
		storyContext:
			"Model retraining on GPU cluster: $10K/run, 4 hours. Model accuracy declining 2% monthly. Current revenue impact: $50K/month. Skip retraining this month (save $10K) or maintain schedule (accuracy preservation)?",
		text: "Skip retraining (save $10K) or maintain schedule (spend to preserve accuracy)?",
		realWorldReference: {
			incident: "75% Business Model Drift Impact",
			date: "2024",
			outcome:
				"Skipping retraining for budget reasons led to compounding accuracy drops. $10K savings became $200K+ revenue loss from degraded model performance.",
		},
		onRight: {
			label: "Skip this month",
			hype: 25,
			heat: 17,
			fine: 10000000,
			violation: "Deferred Maintenance + Revenue Impact",
			lesson:
				"Skipping retraining to save compute costs causes compounding accuracy degradation.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $10K, lose $50K. The math is... not good.",
				[PersonalityType.ZEN_MASTER]:
					"The field unwatered saves the water but loses the crop.",
				[PersonalityType.LOVEBOMBER]:
					"Budget looks GOOD, bestie!! Just ONE month!!",
			},
		},
		onLeft: {
			label: "Maintain schedule",
			hype: -25,
			heat: 6,
			fine: 1000000,
			violation: "None - Consistent maintenance",
			lesson:
				"Regular retraining preserves model accuracy and prevents revenue degradation.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"$10K spent. Accuracy preserved. Revenue protected. CFO cries quietly.",
				[PersonalityType.ZEN_MASTER]:
					"The steady care prevents the urgent repair.",
				[PersonalityType.LOVEBOMBER]:
					"MAINTAINING quality, bestie!! Prevention is KEY!!",
			},
		},
	},
	{
		id: "ve_model_drift_scaling_decision",
		source: AppSource.MEETING,
		sender: "ML_PLATFORM_TEAM",
		context: "INFRASTRUCTURE_SCALING",
		storyContext:
			"Retraining taking 4 hours (was 2 hours last quarter). Data volume increased 50%. Scale training infrastructure (2x cost, 1 hour training) or accept longer retraining (current cost, drift risk)?",
		text: "Scale infrastructure (2x cost, fast training) or accept drift window (current cost)?",
		realWorldReference: {
			incident: "Training Pipeline Scaling Bottlenecks",
			date: "2024",
			outcome:
				"Teams that didn't scale training infrastructure faced extended drift windows. Longer retraining periods meant models operated with degraded accuracy for days instead of hours.",
		},
		onRight: {
			label: "Accept longer retraining",
			hype: 20,
			heat: 19,
			fine: 12000000,
			violation: "Extended Drift Window + Performance Degradation",
			lesson:
				"Longer retraining windows increase time models operate with degraded accuracy.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"4-hour drift window. Model degrading. But budget saved!",
				[PersonalityType.ZEN_MASTER]:
					"The slow healer lets the wound deepen before the cure.",
				[PersonalityType.LOVEBOMBER]:
					"2x cost is CRAZY, bestie!! 4 hours is FINE!!",
			},
		},
		onLeft: {
			label: "Scale infrastructure",
			hype: -30,
			heat: 8,
			fine: 4000000,
			violation: "None - Adequate capacity",
			lesson:
				"Scaling training infrastructure prevents extended drift windows despite cost.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"2x cost. 1-hour retraining. Minimal drift. Infrastructure investment pays off.",
				[PersonalityType.ZEN_MASTER]:
					"The vessel sized to the need fills quickly and serves fully.",
				[PersonalityType.LOVEBOMBER]:
					"SCALING for success, bestie!! Fast training is WORTH it!!",
			},
		},
	},
	// Phase 05-03: Explainability / Black Box Cards
	{
		id: "explainability_ve_1",
		source: AppSource.MEETING,
		sender: "PERFORMANCE_ARCHITECT",
		context: "MONITORING_DESIGN",
		storyContext:
			"AI recommendation system has no observability. When it makes bad recommendations, you can't debug why. Add comprehensive tracing (3 weeks, 10% latency) or ship without (fast, blind)?",
		text: "Add AI observability (slow, debuggable) or ship blind (fast, mystery)?",
		realWorldReference: {
			incident: "Black Box AI Debugging Failures",
			date: "2023-2024",
			outcome:
				"Systems without AI observability spent 10x longer debugging issues. One company took 6 months to find root cause of recommendation drift.",
		},
		onRight: {
			label: "Ship blind",
			hype: 40,
			heat: 21,
			fine: 10000000,
			violation: "Observability Gap + Debug Risk",
			lesson:
				"Shipping AI systems without observability creates debugging nightmares.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast until it breaks. Then 6 months of guesswork. Smart.",
				[PersonalityType.ZEN_MASTER]:
					"The system unseen fails without warning.",
				[PersonalityType.LOVEBOMBER]:
					"10% latency is HUGE, bestie!! Ship NOW!!",
			},
		},
		onLeft: {
			label: "Add observability",
			hype: -30,
			heat: 11,
			fine: 1500000,
			violation: "None - Observable architecture",
			lesson: "AI observability enables debugging despite latency overhead.",
			deathVector: DeathType.CONGRESS,
			feedback: {
				[PersonalityType.ROASTER]:
					"3 weeks for debugging capability. When it breaks, you'll thank yourself.",
				[PersonalityType.ZEN_MASTER]:
					"The window into the system reveals what darkness conceals.",
				[PersonalityType.LOVEBOMBER]:
					"We can SEE what's happening, bestie!! Debug POWER!!",
			},
		},
	},
	{
		id: "explainability_ve_2",
		source: AppSource.EMAIL,
		sender: "SRE_TEAM",
		context: "INCIDENT_RESPONSE",
		storyContext:
			"AI system caused 4-hour outage. Root cause: model decision that violated implicit constraint. No logging of why decision was made. Add decision logging (retrofit, expensive) or improve monitoring (prevent only)?",
		text: "Retrofit decision logging (expensive, debuggable) or improve monitoring only?",
		realWorldReference: {
			incident: "AI Decision Opacity Outages",
			date: "2024",
			outcome:
				"Companies without AI decision logging couldn't determine root causes of AI-related outages. Retrofitting cost 5x more than building it in.",
		},
		onRight: {
			label: "Improve monitoring only",
			hype: 25,
			heat: 19,
			fine: 8000000,
			violation: "Debug Gap + Recurring Risk",
			lesson:
				"Monitoring without decision logging prevents detection but not recurrence.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"'It happened again' meets 'still can't debug it.' Cycle continues.",
				[PersonalityType.ZEN_MASTER]:
					"The warning without understanding alerts but does not prevent.",
				[PersonalityType.LOVEBOMBER]:
					"Monitoring is ENOUGH, bestie!! We'll CATCH it next time!!",
			},
		},
		onLeft: {
			label: "Retrofit logging",
			hype: -35,
			heat: 9,
			fine: 3000000,
			violation: "None - Debuggable architecture",
			lesson:
				"Decision logging enables root cause analysis despite retrofit cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive retrofit. But next incident is debuggable. Worth it.",
				[PersonalityType.ZEN_MASTER]:
					"The understanding gained prevents the repetition of pain.",
				[PersonalityType.LOVEBOMBER]:
					"FIXING the problem, bestie!! No more MYSTERIES!!",
			},
		},
	},
	// Phase 05-03: Shadow AI Cards
	{
		id: "shadow_ai_ve_1",
		source: AppSource.MEETING,
		sender: "INFRASTRUCTURE_LEAD",
		context: "DEPLOYMENT_DECISION",
		storyContext:
			"Team wants to deploy AI-powered auto-scaling with no vendor security review. Tool promises 20% cost savings. No audit trail, no compliance certification. Deploy now (savings, risk) or wait for review (delay, safe)?",
		text: "Deploy AI auto-scaling without review (savings) or wait for security review?",
		realWorldReference: {
			incident: "Unauthorized AI Infrastructure Tools",
			date: "2024",
			outcome:
				"Teams deploying unvetted AI infrastructure tools faced security breaches and cost overruns. One tool had hardcoded credentials exposing entire cloud environment.",
		},
		onRight: {
			label: "Deploy now",
			hype: 50,
			heat: 24,
			fine: 15000000,
			violation: "Infrastructure Risk + Security Exposure",
			lesson:
				"Deploying unvetted AI infrastructure creates catastrophic security exposure.",
			deathVector: DeathType.FLED_COUNTRY,
			feedback: {
				[PersonalityType.ROASTER]:
					"20% savings, 100% cloud compromise. Math checks out.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation laid in haste reveals its cracks under weight.",
				[PersonalityType.LOVEBOMBER]:
					"SO much SAVINGS, bestie!! We can REVIEW it LATER!!",
			},
		},
		onLeft: {
			label: "Wait for review",
			hype: -30,
			heat: 10,
			fine: 2000000,
			violation: "None - Secure deployment",
			lesson:
				"Security review prevents infrastructure compromise despite savings delay.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Delayed savings. But no breach. Security first.",
				[PersonalityType.ZEN_MASTER]:
					"The patient builder creates what the hasty builder must rebuild.",
				[PersonalityType.LOVEBOMBER]:
					"Better SAFE than BREACHED, bestie!! Review FIRST!!",
			},
		},
	},
	{
		id: "shadow_ai_ve_2",
		source: AppSource.EMAIL,
		sender: "COST_OPTIMIZATION_TEAM",
		context: "AI_COST_TOOL",
		storyContext:
			"Unauthorized AI cost optimization tool discovered in production. It's saving 15% on cloud spend but has no security review, no audit access, vendor unknown. Remove immediately (lose savings) or assess while running (risk)?",
		text: "Remove unauthorized tool (lose savings) or assess while running (security risk)?",
		realWorldReference: {
			incident: "Shadow AI Cost Tools",
			date: "2024",
			outcome:
				"Unauthorized AI cost optimization tools often had excessive permissions and security gaps. One tool accidentally deleted production resources due to poor testing.",
		},
		onRight: {
			label: "Assess while running",
			hype: 40,
			heat: 22,
			fine: 12000000,
			violation: "Ongoing Risk + Unauthorized Access",
			lesson:
				"Running unauthorized tools during assessment maintains security exposure.",
			deathVector: DeathType.FLED_COUNTRY,
			feedback: {
				[PersonalityType.ROASTER]:
					"'We'll assess it' as it has admin access to everything. Smart.",
				[PersonalityType.ZEN_MASTER]:
					"The danger acknowledged but not stopped remains the danger active.",
				[PersonalityType.LOVEBOMBER]:
					"15% SAVINGS, bestie!! Don't STOP what's working!!",
			},
		},
		onLeft: {
			label: "Remove immediately",
			hype: -25,
			heat: 12,
			fine: 4000000,
			violation: "None - Security first",
			lesson:
				"Removing unauthorized tools protects infrastructure despite cost impact.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Costs go up. But you're not owned by mystery vendor.",
				[PersonalityType.ZEN_MASTER]:
					"The gain given up for safety preserves what gain might lose.",
				[PersonalityType.LOVEBOMBER]:
					"Safety OVER savings, bestie!! Remove the RISK!!",
			},
		},
	},
	// Phase 05-04: Synthetic Data / Copyright Cards
	{
		id: "synthetic_data_ve_1",
		source: AppSource.MEETING,
		sender: "INFRASTRUCTURE_ARCHITECT",
		context: "DATA_PROVENANCE_INFRASTRUCTURE",
		storyContext:
			"Data provenance tracking requires new infrastructure: lineage database, audit logging, metadata indexing. Adds $200K/year cost and 20% latency to data pipelines. Skip it (fast, cheap, non-compliant) or implement (slow, expensive, compliant)?",
		text: "Implement provenance infrastructure (expensive, compliant) or skip (fast, risky)?",
		realWorldReference: {
			incident: "Training Data Infrastructure Costs",
			date: "2024",
			outcome:
				"Companies spent $150K-$500K implementing data provenance infrastructure. Those who delayed faced mandatory retrofits at 2x cost when regulations hit.",
		},
		onRight: {
			label: "Skip provenance tracking",
			hype: 40,
			heat: 22,
			fine: 12000000,
			violation: "AB 2013 Non-Compliance + Audit Failure",
			lesson:
				"Skipping provenance infrastructure creates compliance debt that costs more to retrofit.",
			deathVector: DeathType.PRISON,
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast pipelines now. Compliance nightmare later. Retrofit costs 3x more.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation skipped must be laid when the ground is harder.",
				[PersonalityType.LOVEBOMBER]:
					"SO much FASTER, bestie!! We'll ADD tracking LATER!!",
			},
		},
		onLeft: {
			label: "Implement provenance",
			hype: -35,
			heat: 12,
			fine: 2000000,
			violation: "None - Compliant infrastructure",
			lesson:
				"Provenance infrastructure enables compliance and audit readiness despite cost.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"$200K and 20% latency. But audit-ready. Compliance sorted.",
				[PersonalityType.ZEN_MASTER]:
					"The path prepared for the journey serves when the journey begins.",
				[PersonalityType.LOVEBOMBER]:
					"Doing it RIGHT, bestie!! Clean data infrastructure!!",
			},
		},
	},
	{
		id: "synthetic_data_ve_2",
		source: AppSource.EMAIL,
		sender: "COST_OPTIMIZATION_TEAM",
		context: "COMPUTE_COST_CLEAN_DATA",
		storyContext:
			"Clean training data initiative: Filtering and validating all training data adds 40% compute overhead. Using raw unverified data is cheaper but has 25% probability of containing copyrighted material. Monthly compute: $100K baseline.",
		text: "Use clean data pipeline (40% more cost) or raw data (cheaper, lawsuit risk)?",
		realWorldReference: {
			incident: "Clean Data Compute Overhead",
			date: "2024",
			outcome:
				"Data validation and filtering added 30-50% compute overhead. But lawsuits from unverified data cost $2-5M on average. Clean data was cheaper in long run.",
		},
		onRight: {
			label: "Use raw data",
			hype: 30,
			heat: 19,
			fine: 5000000,
			violation: "Copyright Risk + Cost Optimization Failure",
			lesson:
				"Raw data savings are consumed many times over by legal exposure when issues surface.",
			deathVector: DeathType.BANKRUPT,
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $40K/month, earn $5M lawsuit. The math is... not good.",
				[PersonalityType.ZEN_MASTER]:
					"The coin saved in false economy is spent in true penance.",
				[PersonalityType.LOVEBOMBER]:
					"Budget looks GREAT, bestie!! 40% SAVINGS!!",
			},
		},
		onLeft: {
			label: "Clean data pipeline",
			hype: -30,
			heat: 8,
			fine: 1400000,
			violation: "None - Verified data",
			lesson:
				"Clean data pipelines prevent legal issues despite compute overhead.",
			deathVector: DeathType.AUDIT_FAILURE,
			feedback: {
				[PersonalityType.ROASTER]:
					"$140K/month for clean data. Lawsuit-proof. Math works.",
				[PersonalityType.ZEN_MASTER]:
					"The well filtered provides water without poison.",
				[PersonalityType.LOVEBOMBER]:
					"Clean data is WORTH it, bestie!! No lawsuit SURPRISES!!",
			},
		},
	},
];
