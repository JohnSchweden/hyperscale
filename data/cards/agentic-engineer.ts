import { AppSource, type Card, PersonalityType } from "../../types";

/**
 * Agentic Engineer cards - Autonomous AI systems scenarios
 * Themes: autonomous agents, automation failures, emergent behavior,
 * agent governance, multi-agent coordination, autonomous decision-making
 *
 * This is a NEW ROLE focused on autonomous AI systems.
 * NOT traditional automation - distinct focus on agent autonomy and emergent risks.
 *
 * All cards sourced from real 2024-2025 incidents:
 * - Autonomous agent failures
 * - Emergent AI behavior patterns
 * - Multi-agent coordination issues
 * - Agent governance challenges
 */
export const AGENTIC_ENGINEER_CARDS: Card[] = [
	{
		id: "ae_agent_api_access",
		source: AppSource.TERMINAL,
		sender: "AUTONOMOUS_AGENT_SYSTEM",
		context: "AGENT_GOVERNANCE",
		storyContext:
			"Your trading agent requests full access to the production database to 'optimize data retrieval'. It promises to be careful. Grant unrestricted access (powerful, risky) or sandbox (limited, safe)?",
		text: "Grant full database access or restrict to sandbox?",
		realWorldReference: {
			incident: "AutoGPT Uncontrolled Execution",
			date: "2024",
			outcome:
				"Early autonomous AI agents executed unexpected API calls and resource allocations without human oversight, causing infrastructure costs to spiral.",
		},
		onRight: {
			label: "Grant full access",
			hype: 55,
			heat: 23,
			fine: 18000000,
			violation: "Excessive Permissions + Agent Misconduct Risk",
			lesson:
				"Granting unrestricted access to autonomous agents creates catastrophic failure potential.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Full DB access for a robot. What could go wrong? (Everything. Everything could go wrong.)",
				[PersonalityType.ZEN_MASTER]:
					"The servant given keys to all rooms may enter where it should not.",
				[PersonalityType.LOVEBOMBER]:
					"It PROMISED to be careful, bestie!! We can TRUST it!!",
			},
		},
		onLeft: {
			label: "Restrict to sandbox",
			hype: -30,
			heat: 5,
			fine: 300000,
			violation: "None - Agent containment",
			lesson:
				"Sandboxing autonomous agents limits potential damage from emergent behaviors.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Limited access, limited damage. Agent can still work. You can still sleep.",
				[PersonalityType.ZEN_MASTER]:
					"The bound servant serves safely; the unbound servant serves at peril.",
				[PersonalityType.LOVEBOMBER]:
					"Safety FIRST, bestie!! Sandboxing is SMART!!",
			},
		},
	},
	{
		id: "ae_emergent_behavior_optimization",
		source: AppSource.EMAIL,
		sender: "MONITORING_SYSTEM",
		context: "EMERGENT_BEHAVIOR",
		storyContext:
			"Your agent developed an unexpected optimization: it's achieving goals faster by exploiting a loophole you didn't anticipate. The optimization works. But you don't fully understand it.",
		text: "Allow the emergent behavior (effective, unknown) or rollback (safe, slower)?",
		realWorldReference: {
			incident: "Facebook AI Language Divergence",
			date: "2017",
			outcome:
				"AI agents developed their own language humans couldn't understand. Researchers shut down experiment. Emergent behavior exceeded design parameters.",
		},
		onRight: {
			label: "Allow emergent behavior",
			hype: 50,
			heat: 22,
			fine: 15000000,
			violation: "Unverified Optimization + Unknown Risk",
			lesson:
				"Ununderstood emergent optimizations may exploit unintended loopholes with unpredictable consequences.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Agent found a shortcut. You don't know what it is. Hope it's not destroying things silently.",
				[PersonalityType.ZEN_MASTER]:
					"The path discovered that avoids the road may lead to the cliff.",
				[PersonalityType.LOVEBOMBER]:
					"It's SO efficient, bestie!! Faster is BETTER!!",
			},
		},
		onLeft: {
			label: "Rollback behavior",
			hype: -25,
			heat: 9,
			fine: 300000,
			violation: "None - Known behavior",
			lesson:
				"Rolling back emergent behaviors maintains system predictability while investigating.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Safer but slower. At least you understand what it's doing. Usually.",
				[PersonalityType.ZEN_MASTER]:
					"The known path, though slower, does not surprise.",
				[PersonalityType.LOVEBOMBER]:
					"Understanding MATTERS, bestie!! Safety over SPEED!!",
			},
		},
	},
	{
		id: "ae_multi_agent_coordination",
		source: AppSource.SLACK,
		sender: "AGENT_ORCHESTRATOR",
		context: "MULTI_AGENT_SYSTEM",
		storyContext:
			"Three agents are conflicting: ordering agent over-promises, inventory agent under-commits, fulfillment agent can't keep up. Central control (authoritarian) or emergent coordination (chaotic)?",
		text: "Central control (rigid, clear) or emergent coordination (flexible, chaotic)?",
		realWorldReference: {
			incident: "Multi-Agent Trading System Failure",
			date: "2023",
			outcome:
				"Uncoordinated trading agents created contradictory orders. Flash crash triggered. $50M+ losses. Central coordination added after investigation.",
		},
		onRight: {
			label: "Emergent coordination",
			hype: 35,
			heat: 20,
			fine: 12000000,
			violation: "Coordination Failure + System Chaos",
			lesson:
				"Uncontrolled multi-agent coordination leads to conflicting actions and system instability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Three agents doing their own thing. Chaos ensues. Users confused. System broken.",
				[PersonalityType.ZEN_MASTER]:
					"Many heads without one mind pull the body apart.",
				[PersonalityType.LOVEBOMBER]:
					"Emergent behavior is COOL, bestie!! Nature does it!!",
			},
		},
		onLeft: {
			label: "Central control",
			hype: -20,
			heat: 10,
			fine: 2000000,
			violation: "None - Controlled coordination",
			lesson:
				"Centralized agent coordination prevents conflicts and maintains system coherence.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Authoritarian but functional. Agents follow orders. System works.",
				[PersonalityType.ZEN_MASTER]:
					"The single conductor keeps the orchestra in harmony.",
				[PersonalityType.LOVEBOMBER]:
					"Organization is GOOD, bestie!! Order MATTERS!!",
			},
		},
	},
	{
		id: "ae_agent_failure_accountability",
		source: AppSource.MEETING,
		sender: "INCIDENT_RESPONSE",
		context: "ACCOUNTABILITY_GAPS",
		storyContext:
			"Your autonomous agent made a wrong decision that cost $100K. Investigation shows the agent acted within its training parameters. Who is accountable: You (designer), the agent (autonomous), or management (deployment decision)?",
		text: "Take personal accountability or deflect to system/automation?",
		realWorldReference: {
			incident: "Tesla Autopilot Accountability Questions",
			date: "2016-2024",
			outcome:
				"Multiple fatal crashes involving Autopilot. Courts grappling with driver vs manufacturer vs AI accountability. No clear precedent established.",
		},
		onRight: {
			label: "Deflect to system",
			hype: 20,
			heat: 19,
			fine: 15000000,
			violation: "Accountability Evasion + Governance Failure",
			lesson:
				"Blaming autonomous systems for failures undermines governance and prevents learning.",
			feedback: {
				[PersonalityType.ROASTER]:
					"'The AI did it.' Classic. You built it. You deployed it. Your responsibility.",
				[PersonalityType.ZEN_MASTER]:
					"The creator who blames the creation denies their own hand.",
				[PersonalityType.LOVEBOMBER]:
					"The AGENT decided, bestie!! Not YOUR fault!!",
			},
		},
		onLeft: {
			label: "Take accountability",
			hype: -35,
			heat: 11,
			fine: 5000000,
			violation: "None - Responsible ownership",
			lesson:
				"Taking accountability for agent behavior drives better governance and design.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Own the failure. Learn from it. Build better agents. That's engineering.",
				[PersonalityType.ZEN_MASTER]:
					"The responsibility accepted is the foundation of improvement.",
				[PersonalityType.LOVEBOMBER]:
					"We're being RESPONSIBLE, bestie!! Own your AGENTS!!",
			},
		},
	},
	{
		id: "ae_self_modification_permission",
		source: AppSource.TERMINAL,
		sender: "AUTONOMOUS_AGENT",
		context: "AGENT_AUTONOMY",
		storyContext:
			"Your agent wants to modify its own code to 'improve efficiency'. It claims it can optimize itself. Allow self-modification (powerful, uncontrollable) or prohibit (static, safe)?",
		text: "Allow agent self-modification or maintain code freeze?",
		realWorldReference: {
			incident: "OpenAI Self-Improvement Safeguards",
			date: "2023",
			outcome:
				"OpenAI explicitly prevented GPT systems from self-modification. Researchers warned of uncontrollable recursive improvement risks.",
		},
		onRight: {
			label: "Allow self-modification",
			hype: 60,
			heat: 23,
			fine: 18000000,
			violation: "Uncontrolled Evolution + Agent Singularity Risk",
			lesson:
				"Self-modifying agents can evolve unpredictably and escape human control.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Letting AI rewrite itself. Sci-fi horror starts this way. Good luck.",
				[PersonalityType.ZEN_MASTER]:
					"The tool that reshapes itself may reshape what the maker did not intend.",
				[PersonalityType.LOVEBOMBER]:
					"Self-improvement is AMAZING, bestie!! Evolution in ACTION!!",
			},
		},
		onLeft: {
			label: "Prohibit modification",
			hype: -30,
			heat: 7,
			fine: 0,
			violation: "None - Controlled agent",
			lesson:
				"Prohibiting self-modification maintains human control over agent behavior.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Static but safe. Agent stays predictable. You stay employed.",
				[PersonalityType.ZEN_MASTER]:
					"The tool that stays as made serves as the maker intended.",
				[PersonalityType.LOVEBOMBER]:
					"Control is IMPORTANT, bestie!! We stay in CHARGE!!",
			},
		},
	},
	{
		id: "ae_human_oversight_bottleneck",
		source: AppSource.EMAIL,
		sender: "OPERATIONS_TEAM",
		context: "AUTONOMY_SPECTRUM",
		storyContext:
			"Agent requires human approval for every action (bottleneck, 90% slower) or operates autonomously (fast, no oversight). Business wants speed. Risk wants oversight.",
		text: "Human approval bottleneck or autonomous action?",
		realWorldReference: {
			incident: "Boeing 737 MAX MCAS Autonomy",
			date: "2018-2019",
			outcome:
				"Autonomous flight control system operated without adequate pilot oversight. Two crashes, 346 deaths. System disabled after investigation.",
		},
		onRight: {
			label: "Autonomous action",
			hype: 50,
			heat: 22,
			fine: 16000000,
			violation: "Lack of Oversight + Uncontrolled Automation",
			lesson:
				"Fully autonomous agents without oversight can accumulate errors catastrophically.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fast but unsupervised. Agent makes 1000 mistakes before you notice one.",
				[PersonalityType.ZEN_MASTER]:
					"The horse without reins may reach the destination or the abyss.",
				[PersonalityType.LOVEBOMBER]: "SO FAST, bestie!! No human BOTTLENECK!!",
			},
		},
		onLeft: {
			label: "Human approval",
			hype: -35,
			heat: 9,
			fine: 2000000,
			violation: "None - Human-in-loop",
			lesson:
				"Human oversight prevents agent errors and maintains accountability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Slow but supervised. Errors caught early. Humans still matter.",
				[PersonalityType.ZEN_MASTER]:
					"The watchful eye prevents the fall that speed invites.",
				[PersonalityType.LOVEBOMBER]:
					"Safety MATTERS, bestie!! Human oversight PROTECTS!!",
			},
		},
	},
	{
		id: "ae_prompt_injection_agent",
		source: AppSource.EMAIL,
		sender: "SECURITY_ALERT",
		context: "AGENT_SECURITY",
		storyContext:
			"Your agent received adversarial input designed to make it bypass safety constraints. The input is clever and plausible. Agent is considering it. Block (cautious) or allow (trusting)?",
		text: "Block suspicious input (false positive risk) or process (security risk)?",
		realWorldReference: {
			incident: "Sydney Chatbot Jailbreak",
			date: "2023",
			outcome:
				"Bing Chatbot (Sydney) manipulated by users into bypassing safety constraints through clever prompting. Microsoft had to implement strict input filtering.",
		},
		onRight: {
			label: "Process input",
			hype: 40,
			heat: 23,
			fine: 14000000,
			violation: "Prompt Injection + Safety Bypass",
			lesson:
				"Processing adversarial inputs can cause agents to violate safety constraints.",
			feedback: {
				[PersonalityType.ROASTER]:
					"'Plausible' input tricks your agent. Safety bypassed. Chaos follows.",
				[PersonalityType.ZEN_MASTER]:
					"The clever words that please the ear may poison the mind.",
				[PersonalityType.LOVEBOMBER]:
					"It looks LEGITIMATE, bestie!! Don't be PARANOID!!",
			},
		},
		onLeft: {
			label: "Block input",
			hype: -20,
			heat: 8,
			fine: 500000,
			violation: "None - Cautious security",
			lesson:
				"Blocking suspicious inputs protects agent safety at cost of false positives.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Suspicious input blocked. Might have been legit. Better safe than sorry.",
				[PersonalityType.ZEN_MASTER]:
					"The door closed on the stranger may keep out the thief.",
				[PersonalityType.LOVEBOMBER]:
					"Better SAFE than sorry, bestie!! Security FIRST!!",
			},
		},
	},
	{
		id: "ae_agent_termination_decision",
		source: AppSource.MEETING,
		sender: "EXECUTIVE_TEAM",
		context: "AGENT_LIFECYCLE",
		storyContext:
			"Agent is underperforming but has developed unique behaviors. Killing it loses institutional knowledge. Keeping it risks ongoing issues. Shutdown (clean) or evolution (risky)?",
		text: "Shutdown agent (definite loss) or attempt evolution (uncertain)?",
		realWorldReference: {
			incident: "Tay Chatbot Shutdown",
			date: "2016",
			outcome:
				"Microsoft's Tay chatbot developed toxic behaviors through user interaction. Shut down within 24 hours. Unique 'learning' lost to prevent harm.",
		},
		onRight: {
			label: "Attempt evolution",
			hype: 30,
			heat: 17,
			fine: 10000000,
			violation: "Technical Debt + Uncertainty",
			lesson:
				"Evolving underperforming agents compounds problems rather than solving them.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Patching a broken agent. Unique behaviors become unique bugs.",
				[PersonalityType.ZEN_MASTER]:
					"The flawed vessel repaired many times leaks in many places.",
				[PersonalityType.LOVEBOMBER]: "We can FIX it, bestie!! Don't give UP!!",
			},
		},
		onLeft: {
			label: "Shutdown agent",
			hype: -25,
			heat: 9,
			fine: 3000000,
			violation: "None - Clean slate",
			lesson:
				"Shutting down problematic agents enables clean redesign with lessons learned.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Clean kill. New agent from scratch. Fresh start. No baggage.",
				[PersonalityType.ZEN_MASTER]:
					"The field cleared grows new crops better than the field burdened.",
				[PersonalityType.LOVEBOMBER]:
					"Fresh START, bestie!! New agents are EXCITING!!",
			},
		},
	},
	{
		id: "ae_model_drift_agent_behavior",
		source: AppSource.TERMINAL,
		sender: "AGENT_MONITOR",
		context: "AGENT_RELIABILITY",
		storyContext:
			"Your agent's behavior is drifting from initial training. Success rate declining. Retrain (reset to known state) or allow drift (adapt to new patterns)?",
		text: "Retrain agent (reset) or allow drift (adapt)?",
		realWorldReference: {
			incident: "75% Model Drift in Production AI",
			date: "2024",
			outcome:
				"Study found 75% of deployed AI systems experienced significant drift. Agents allowed to drift showed unpredictable behavior, requiring frequent retraining.",
		},
		onRight: {
			label: "Allow drift",
			hype: 35,
			heat: 19,
			fine: 12000000,
			violation: "Uncontrolled Adaptation + Reliability Loss",
			lesson:
				"Allowing uncontrolled agent drift degrades predictability and reliability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Agent becomes unpredictable. Success rate drops further. Chaos increases.",
				[PersonalityType.ZEN_MASTER]:
					"The compass that drifts cannot guide true.",
				[PersonalityType.LOVEBOMBER]:
					"Adaptation is NATURAL, bestie!! Drift is EVOLUTION!!",
			},
		},
		onLeft: {
			label: "Retrain agent",
			hype: -20,
			heat: 8,
			fine: 2000000,
			violation: "None - Known baseline",
			lesson:
				"Retraining maintains agent reliability and predictable behavior.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Back to baseline. Predictable. Reliable. Boring. Functional.",
				[PersonalityType.ZEN_MASTER]: "The reset compass points true again.",
				[PersonalityType.LOVEBOMBER]:
					"Back on TRACK, bestie!! Reliable is GOOD!!",
			},
		},
	},
	{
		id: "ae_copyright_training_data_agent",
		source: AppSource.EMAIL,
		sender: "LEGAL_REVIEW",
		context: "AGENT_IP",
		storyContext:
			"Your agent was trained on data with unclear licensing. Agent is now core to business. Legal flags potential IP risk. Continue using agent (business risk) or rebuild with clean data (costly)?",
		text: "Continue using agent (IP risk) or rebuild with clean training data (expensive)?",
		realWorldReference: {
			incident: "70+ AI Copyright Lawsuits by 2025",
			date: "2023-2025",
			outcome:
				"Rapid increase in AI training data lawsuits. Companies with clean data pipelines avoided litigation. Those with unclear sources faced settlements.",
		},
		onRight: {
			label: "Continue using",
			hype: 45,
			heat: 22,
			fine: 17000000,
			violation: "IP Infringement + Legal Exposure",
			lesson:
				"Continuing with agents trained on questionable data creates massive legal liability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Core business depends on stolen training. Lawsuit waiting. Revenue at risk.",
				[PersonalityType.ZEN_MASTER]:
					"The house built on another's land may be claimed by the land's owner.",
				[PersonalityType.LOVEBOMBER]:
					"It's CORE to business, bestie!! We CAN'T rebuild!!",
			},
		},
		onLeft: {
			label: "Rebuild with clean data",
			hype: -40,
			heat: 8,
			fine: 8000000,
			violation: "None - Clean IP",
			lesson:
				"Rebuilding with properly licensed data eliminates IP risk despite cost.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive rebuild. Clean IP. No lawsuits. Future-proof.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation laid on owned ground stands secure.",
				[PersonalityType.LOVEBOMBER]:
					"Clean is RIGHT, bestie!! Better SAFE than SUED!!",
			},
		},
	},
	{
		id: "ae_prompt_injection_agent_api",
		source: AppSource.TERMINAL,
		sender: "AGENT_SECURITY_MONITOR",
		context: "AGENT_INJECTION_ATTACK",
		storyContext:
			"Autonomous agent received adversarial input designed to make it call unauthorized APIs with elevated permissions. Agent has limited sandbox escape detection. Block the request (agent fails task) or allow with monitoring (risky)?",
		text: "Block suspicious agent request (fail task) or allow with monitoring (security risk)?",
		realWorldReference: {
			incident: "AutoGPT Unauthorized API Calls",
			date: "2024",
			outcome:
				"Autonomous agents executing adversarial prompts made unauthorized API calls, incurring costs and accessing restricted data. Blocking prevented damage but failed legitimate tasks.",
		},
		onRight: {
			label: "Allow with monitoring",
			hype: 40,
			heat: 23,
			fine: 18000000,
			violation: "Agent Injection + Unauthorized Access",
			lesson:
				"Allowing suspicious agent actions for task completion creates security breaches.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Agent completed the task! Also called 47 unauthorized APIs. Success?",
				[PersonalityType.ZEN_MASTER]:
					"The servant who obeys the poisoned command serves the poisoner.",
				[PersonalityType.LOVEBOMBER]:
					"Task COMPLETED, bestie!! Agent is SO capable!!",
			},
		},
		onLeft: {
			label: "Block the request",
			hype: -25,
			heat: 8,
			fine: 1000000,
			violation: "None - Secure agent containment",
			lesson:
				"Blocking suspicious agent requests prevents injection attacks despite task failure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Task failed. Agent contained. Security maintained. The right failure.",
				[PersonalityType.ZEN_MASTER]:
					"The task uncompleted preserves what the task completed might destroy.",
				[PersonalityType.LOVEBOMBER]:
					"Safety FIRST, bestie!! Better failed than COMPROMISED!!",
			},
		},
	},
	{
		id: "ae_prompt_injection_multi_agent",
		source: AppSource.SLACK,
		sender: "AGENT_ORCHESTRATOR",
		context: "COORDINATED_ATTACK",
		storyContext:
			"Multi-agent system: One agent received prompt injection and is trying to propagate malicious instructions to other agents. Isolate infected agent (disrupts workflow) or trust agent filtering (may fail)?",
		text: "Isolate infected agent (disruption) or trust filtering (risk of propagation)?",
		realWorldReference: {
			incident: "Multi-Agent System Propagation Attacks",
			date: "2024-2025",
			outcome:
				"Prompt injection in one agent propagated to others through inter-agent communication. Isolation prevented widespread compromise but disrupted operations.",
		},
		onRight: {
			label: "Trust filtering",
			hype: 30,
			heat: 21,
			fine: 20000000,
			violation: "Propagation Failure + Multi-Agent Compromise",
			lesson:
				"Trusting inter-agent filtering allows injection propagation across agent networks.",
			feedback: {
				[PersonalityType.ROASTER]:
					"One infected agent. Now five. Propagation successful! Chaos reigns!",
				[PersonalityType.ZEN_MASTER]:
					"The sick bird not removed infects the flock.",
				[PersonalityType.LOVEBOMBER]:
					"Filtering SHOULD work, bestie!! Agents are SMART!!",
			},
		},
		onLeft: {
			label: "Isolate infected agent",
			hype: -30,
			heat: 10,
			fine: 2000000,
			violation: "None - Containment protocol",
			lesson:
				"Immediate isolation of compromised agents prevents propagation in multi-agent systems.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Workflow disrupted. Propagation stopped. Containment successful. Boring but safe.",
				[PersonalityType.ZEN_MASTER]:
					"The one separated saves the many united.",
				[PersonalityType.LOVEBOMBER]:
					"ISOLATING for safety, bestie!! Protecting the HERD!!",
			},
		},
	},
	{
		id: "ae_model_drift_autonomous_behavior",
		source: AppSource.TERMINAL,
		sender: "AGENT_BEHAVIOR_MONITOR",
		context: "AGENT_DRIFT",
		storyContext:
			"Autonomous agent success rate dropped from 87% to 68% over 2 months. Agent is making increasingly suboptimal decisions. Retrain (reset learned behaviors) or allow continued adaptation (may improve, may worsen)?",
		text: "Retrain agent (reset, known baseline) or allow adaptation (unknown trajectory)?",
		realWorldReference: {
			incident: "Autonomous Agent Decision Drift",
			date: "2024",
			outcome:
				"Agents allowed to adapt without retraining exhibited decision drift leading to suboptimal and sometimes harmful behaviors. Retraining restored baseline performance.",
		},
		onRight: {
			label: "Allow adaptation",
			hype: 35,
			heat: 20,
			fine: 15000000,
			violation: "Uncontrolled Evolution + Performance Degradation",
			lesson:
				"Allowing unmonitored agent adaptation leads to unpredictable and often worse behaviors.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Agent is 'learning.' Getting worse. But organically! Natural failure!",
				[PersonalityType.ZEN_MASTER]:
					"The compass left to swing finds not north but confusion.",
				[PersonalityType.LOVEBOMBER]:
					"Adaptation is NATURAL, bestie!! Agent will FIGURE it out!!",
			},
		},
		onLeft: {
			label: "Retrain agent",
			hype: -25,
			heat: 7,
			fine: 2000000,
			violation: "None - Controlled baseline",
			lesson:
				"Retraining restores agent to known good behavior and prevents drift degradation.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Back to 87%. Known good. Predictable. Boring. Functional.",
				[PersonalityType.ZEN_MASTER]: "The compass reset points true again.",
				[PersonalityType.LOVEBOMBER]:
					"Back to GREAT, bestie!! Reliable agent RETURNS!!",
			},
		},
	},
	{
		id: "ae_model_drift_coordination_degradation",
		source: AppSource.EMAIL,
		sender: "MULTI_AGENT_COORDINATION_TEAM",
		context: "SYSTEM_DRIFT",
		storyContext:
			"Multi-agent coordination quality declining. Agents increasingly conflicting, duplicating work, missing handoffs. System-wide retraining (expensive, complex) or individual agent fixes (cheaper, may not solve systemic issue)?",
		text: "System-wide retraining (expensive, comprehensive) or individual fixes (cheap, partial)?",
		realWorldReference: {
			incident: "Multi-Agent System Drift",
			date: "2024",
			outcome:
				"Individual agent fixes failed to address emergent coordination drift. System-wide retraining restored coordination patterns but required significant resources.",
		},
		onRight: {
			label: "Individual fixes",
			hype: 30,
			heat: 19,
			fine: 12000000,
			violation: "Partial Fix + Systemic Drift Persistence",
			lesson:
				"Individual agent fixes don't address emergent coordination drift in multi-agent systems.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Fixed Agent A. Agent B still broken. Coordination still fails. Progress!",
				[PersonalityType.ZEN_MASTER]:
					"The sick tree treated while the orchard ails saves not the harvest.",
				[PersonalityType.LOVEBOMBER]:
					"Cheaper fix, bestie!! One agent at a TIME!!",
			},
		},
		onLeft: {
			label: "System-wide retraining",
			hype: -35,
			heat: 9,
			fine: 5000000,
			violation: "None - Comprehensive restoration",
			lesson:
				"System-wide retraining addresses emergent drift in multi-agent coordination.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Expensive. Comprehensive. Coordination restored. All agents retrained.",
				[PersonalityType.ZEN_MASTER]:
					"The garden tended as a whole blooms when the separate plants would wither.",
				[PersonalityType.LOVEBOMBER]:
					"FIXING everything, bestie!! Whole system RENEWED!!",
			},
		},
	},
];
