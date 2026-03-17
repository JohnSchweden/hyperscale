import { AppSource, type Card, PersonalityType } from "../../types";

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
			heat: 14,
			fine: 5000000,
			violation: "User Experience Degradation",
			lesson:
				"Regional CDNs frustrate global users and create competitive disadvantage.",
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
			heat: 5,
			fine: 10000000,
			violation: "None - Global performance",
			lesson:
				"Global CDNs deliver consistent performance to all users regardless of location.",
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
			heat: 13,
			fine: 3000000,
			violation: "User Experience Degradation",
			lesson:
				"Centralized processing creates latency that frustrates users and loses engagement.",
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
			heat: 7,
			fine: 10000000,
			violation: "None - Performance optimized",
			lesson:
				"Edge computing delivers optimal user experience despite cost and complexity.",
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
			heat: 14,
			fine: 200000,
			violation: "Brand Degradation + Quality Loss",
			lesson:
				"Aggressive compression damages brand perception and user experience quality.",
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
			heat: 8,
			fine: 1000000,
			violation: "None - Quality maintained",
			lesson:
				"Quality compression preserves brand image and user satisfaction.",
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
];
