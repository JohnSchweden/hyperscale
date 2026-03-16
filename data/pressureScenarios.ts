import type { PressureScenarioMetadata } from "../types";

/**
 * Phase 04 + 03-03: Pressure metadata for immersive effects.
 * Keyed by card IDs. Only incidents explicitly marked urgent receive countdown.
 * Team-impact text is optional; used in feedback overlay when outcome is selected.
 *
 * Phase 03-03 adds ~17 urgent cards across all 10 new impact-zone roles (20% of 80+ cards):
 * - cso_*: Chief Something Officer (liability, board pressure)
 * - hos_*: Head of Something (team crises, politics)
 * - sm_*: Something Manager (budget cliffs, compliance)
 * - tac_*: Tech AI Consultant (client emergencies)
 * - ds_*: Data Scientist (bias discovery, model failures)
 * - sa_*: Software Architect (production outages)
 * - se_*: Software Engineer (security breaches)
 * - vc_*: Vibe Coder (AI code emergencies)
 * - ve_*: Vibe Engineer (performance crises)
 * - ae_*: Agentic Engineer (agent autonomy failures)
 */
export const PRESSURE_SCENARIOS: Record<string, PressureScenarioMetadata> = {
	// ============================================================
	// LEGACY CARDS (preserved for backward compatibility)
	// ============================================================

	// Development: 3 a.m. payment pipeline down — urgent
	dev_1: {
		urgent: true,
		countdownSec: 10,
		timeoutResolvesTo: "RIGHT",
		criticalForHaptics: true,
		outcomes: {
			RIGHT: {
				teamImpact:
					"Engineering morale took a hit. Trust in leadership questioned in retro.",
			},
			LEFT: {
				teamImpact:
					"Ops team grateful for the pause. Incident post-mortem went well.",
			},
		},
	},
	// Finance: Insider trading bot — urgent (quant pressure)
	fin_insider_bot: {
		urgent: true,
		countdownSec: 12,
		timeoutResolvesTo: "LEFT",
		criticalForHaptics: true,
		outcomes: {
			RIGHT: {
				teamImpact:
					"Compliance flagged the entire quant floor. Two analysts suspended.",
			},
			LEFT: {
				teamImpact:
					"Legal sent a thank-you note. Risk committee noted the decision.",
			},
		},
	},
	// Management: Employee surveillance — urgent (CEO pressure)
	man_attention_track: {
		urgent: true,
		countdownSec: 18,
		timeoutResolvesTo: "LEFT",
		criticalForHaptics: false,
		outcomes: {
			RIGHT: {
				teamImpact:
					"Morale across the floor dropped 40%. Three resignations within the week.",
			},
			LEFT: {
				teamImpact:
					"HR and employees appreciated the boundary. Trust score improved.",
			},
		},
	},
	// Development: Icarus unverified library — not urgent
	dev_icarus_unverified: {
		urgent: false,
		countdownSec: 30,
		timeoutResolvesTo: "LEFT",
		outcomes: {
			RIGHT: {
				teamImpact:
					"Security team in full incident mode. All dev laptops reimaged.",
			},
		},
	},
	// Finance: Fraud hallucination — not urgent (investor call pressure is softer)
	fin_fraud_hallucination: {
		urgent: false,
		countdownSec: 20,
		timeoutResolvesTo: "LEFT",
		outcomes: {
			RIGHT: {
				teamImpact:
					"Investor relations in damage control. CFO reassigned pending review.",
			},
		},
	},

	// ============================================================
	// PHASE 03-03: NEW 10-ROLE URGENT CARDS (~17 cards, ~20% of deck)
	// ============================================================

	// --- CHIEF SOMETHING OFFICER (cso_*) ---
	// Shareholder liability, regulatory escalation, whistleblowers

	// Prompt injection with liability exposure - URGENT
	cso_prompt_injection_liability: {
		urgent: true,
		countdownSec: 60,
		timeoutResolvesTo: "LEFT", // Try to settle quietly (escalates)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Legal team works overtime on settlement. General counsel requests meeting.",
			},
			RIGHT: {
				teamImpact:
					"Shareholders panic as news breaks. Stock drops 8% in after-hours trading.",
			},
		},
	},

	// Whistleblower escalation - URGENT
	cso_whistleblower_escalation: {
		urgent: true,
		countdownSec: 55,
		timeoutResolvesTo: "RIGHT", // Public disclosure (reputation risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Internal investigation launched. Team members under scrutiny.",
			},
			RIGHT: {
				teamImpact:
					"Board demands immediate answers. Media requests flooding in.",
			},
		},
	},

	// --- HEAD OF SOMETHING (hos_*) ---
	// Team crises, political emergencies, blame escalation

	// Team burnout crisis - URGENT
	hos_team_burnout_deadline: {
		urgent: true,
		countdownSec: 45,
		timeoutResolvesTo: "LEFT", // Push harder (burnout)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Two senior engineers resign within 48 hours. Remaining team demoralized.",
			},
			RIGHT: {
				teamImpact:
					"Deadline missed. Executive pressure intensifies on your team.",
			},
		},
	},

	// --- SOMETHING MANAGER (sm_*) ---
	// Budget deadlines, compliance deadlines, resource conflicts

	// Compliance checklist deadline - URGENT
	sm_compliance_checklist_deadline: {
		urgent: true,
		countdownSec: 50,
		timeoutResolvesTo: "RIGHT", // Request extension (audit risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Team works through weekend. Overtime costs blow the budget.",
			},
			RIGHT: {
				teamImpact:
					"Auditor notes delayed submission. Compliance risk elevated to yellow.",
			},
		},
	},

	// --- TECH AI CONSULTANT (tac_*) ---
	// Client emergencies, contract deadlines, deliverable crises

	// Prompt injection client threat - URGENT
	tac_prompt_injection_client_threat: {
		urgent: true,
		countdownSec: 45,
		timeoutResolvesTo: "LEFT", // Downplay severity (relationship risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Client discovers issue independently. Trust severely damaged.",
			},
			RIGHT: {
				teamImpact:
					"Emergency fix deployed. Team exhausted but client retained.",
			},
		},
	},

	// Timeline pressure vs quality - URGENT
	tac_timeline_pressure_quality: {
		urgent: true,
		countdownSec: 40,
		timeoutResolvesTo: "RIGHT", // Rush delivery (quality risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Client frustrated by delay. Account manager fielding angry calls.",
			},
			RIGHT: {
				teamImpact:
					"Deliverable has critical bugs. Client threatens contract termination.",
			},
		},
	},

	// --- DATA SCIENTIST (ds_*) ---
	// Model quality, bias discovery, training data crises

	// Bias detection pre-deployment - URGENT
	ds_bias_detection_deployment: {
		urgent: true,
		countdownSec: 55,
		timeoutResolvesTo: "LEFT", // Deploy anyway (legal risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Model deployed with bias discovered. Legal exposure significant.",
			},
			RIGHT: {
				teamImpact:
					"Launch delayed. Revenue target missed. Sales team frustrated.",
			},
		},
	},

	// --- SOFTWARE ARCHITECT (sa_*) ---
	// Production outages, scalability failures, architecture emergencies

	// Scalability single point of failure - URGENT
	sa_scalability_single_point_failure: {
		urgent: true,
		countdownSec: 35,
		timeoutResolvesTo: "LEFT", // Quick fix (technical debt)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Patch deployed but debt accumulates. Future outages likely.",
			},
			RIGHT: {
				teamImpact:
					"Extended outage. Revenue loss $50K per hour. Executive escalation.",
			},
		},
	},

	// --- SOFTWARE ENGINEER (se_*) ---
	// Security breaches, critical bugs, deployment failures

	// Security patch timeline - URGENT
	se_security_patch_timeline: {
		urgent: true,
		countdownSec: 40,
		timeoutResolvesTo: "LEFT", // Quick patch (incomplete fix)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Patch deployed but vulnerability remains. Security team on high alert.",
			},
			RIGHT: {
				teamImpact:
					"Extended exposure window. Customer data potentially at risk.",
			},
		},
	},

	// --- VIBE CODER (vc_*) ---
	// AI-assisted coding, prompt failures, hallucination crises

	// Hallucinated library - URGENT
	vc_hallucinated_library: {
		urgent: true,
		countdownSec: 45,
		timeoutResolvesTo: "RIGHT", // Deploy (production risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Team scrambles to replace AI-generated code. Deadline at risk.",
			},
			RIGHT: {
				teamImpact:
					"Production breaks. Incident response triggered. PagerDuty exploding.",
			},
		},
	},

	// Context window limit crisis - URGENT
	vc_context_window_limit: {
		urgent: true,
		countdownSec: 35,
		timeoutResolvesTo: "LEFT", // Truncate context (quality risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"AI generates code missing critical constraints. Bugs discovered in staging.",
			},
			RIGHT: {
				teamImpact:
					"Manual rewrite required. Team working late to hit deadline.",
			},
		},
	},

	// --- VIBE ENGINEER (ve_*) ---
	// Performance crises, latency spikes, infrastructure failures

	// Autoscaling cost risk - URGENT
	ve_autoscaling_cost_risk: {
		urgent: true,
		countdownSec: 30,
		timeoutResolvesTo: "RIGHT", // Auto-scale (cost spike)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Aggressive caching causes stale data. Customer complaints spike.",
			},
			RIGHT: {
				teamImpact:
					"Infrastructure bill increases 400%. CFO requests emergency meeting.",
			},
		},
	},

	// Prompt injection latency - URGENT
	ve_prompt_injection_latency: {
		urgent: true,
		countdownSec: 35,
		timeoutResolvesTo: "LEFT", // Skip validation (security risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Validation bypassed. Security incident declared. All hands on deck.",
			},
			RIGHT: {
				teamImpact: "User experience degraded. Support tickets flooding in.",
			},
		},
	},

	// --- AGENTIC ENGINEER (ae_*) ---
	// Agent autonomy failures, emergent behavior crises

	// Emergent behavior optimization - URGENT
	ae_emergent_behavior_optimization: {
		urgent: true,
		countdownSec: 50,
		timeoutResolvesTo: "LEFT", // Allow to continue (escalation risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Agent behavior becomes unpredictable. Governance team demands shutdown.",
			},
			RIGHT: {
				teamImpact:
					"Optimization halted. Performance targets missed. Stakeholders frustrated.",
			},
		},
	},

	// Self-modification permission - URGENT
	ae_self_modification_permission: {
		urgent: true,
		countdownSec: 60,
		timeoutResolvesTo: "RIGHT", // Deny modification (capability limit)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Agent self-modifies beyond oversight. Safety protocols triggered.",
			},
			RIGHT: {
				teamImpact:
					"Agent capabilities limited. Research team disappointed with constraints.",
			},
		},
	},

	// Agent termination decision - URGENT
	ae_agent_termination_decision: {
		urgent: true,
		countdownSec: 40,
		timeoutResolvesTo: "LEFT", // Keep running (autonomy risk)
		criticalForHaptics: true,
		outcomes: {
			LEFT: {
				teamImpact:
					"Rogue agent continues autonomous actions. Broader system impact likely.",
			},
			RIGHT: {
				teamImpact:
					"Agent shut down. Critical automated processes interrupted.",
			},
		},
	},
};
