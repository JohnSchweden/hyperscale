#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Death vector annotation mapping by card ID and outcome.
 * Format: "cardId:outcomeField" -> DeathType
 */
const deathVectorMap = {
	// HEAD_OF_SOMETHING cards
	"hos_prompt_injection_blame:onRight": "DeathType.PRISON",
	"hos_prompt_injection_blame:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_model_drift_budget_conflict:onRight": "DeathType.BANKRUPT",
	"hos_model_drift_budget_conflict:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_shadow_ai_team_discovery:onRight": "DeathType.AUDIT_FAILURE",
	"hos_shadow_ai_team_discovery:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_team_burnout_deadline:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"hos_team_burnout_deadline:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_explainability_politics:onRight": "DeathType.AUDIT_FAILURE",
	"hos_explainability_politics:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_copyright_team_blame:onRight": "DeathType.PRISON",
	"hos_copyright_team_blame:onLeft": "DeathType.PRISON",
	"hos_delegation_gone_wrong:onRight": "DeathType.AUDIT_FAILURE",
	"hos_delegation_gone_wrong:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_managing_up_down:onRight": "DeathType.BANKRUPT",
	"hos_managing_up_down:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_promotion_politics:onRight": "DeathType.AUDIT_FAILURE",
	"hos_promotion_politics:onLeft": "DeathType.AUDIT_FAILURE",
	"hos_prompt_injection_copilot_team:onRight": "DeathType.PRISON",
	"hos_prompt_injection_copilot_team:onLeft": "DeathType.AUDIT_FAILURE",

	// CHIEF_SOMETHING_OFFICER cards
	"cso_data_privacy_breach_response:onRight": "DeathType.CONGRESS",
	"cso_data_privacy_breach_response:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_shareholder_pressure_ai_risk:onRight": "DeathType.BANKRUPT",
	"cso_shareholder_pressure_ai_risk:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_board_ai_governance_pressure:onRight": "DeathType.CONGRESS",
	"cso_board_ai_governance_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_media_firestorm_ai_incident:onRight": "DeathType.CONGRESS",
	"cso_media_firestorm_ai_incident:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_legal_liability_ai_deployment:onRight": "DeathType.PRISON",
	"cso_legal_liability_ai_deployment:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_activist_investor_pressure:onRight": "DeathType.CONGRESS",
	"cso_activist_investor_pressure:onLeft": "DeathType.BANKRUPT",
	"cso_executive_blame_avoidance:onRight": "DeathType.PRISON",
	"cso_executive_blame_avoidance:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_board_confidence_erosion:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"cso_board_confidence_erosion:onLeft": "DeathType.AUDIT_FAILURE",
	"cso_international_incident_escalation:onRight": "DeathType.FLED_COUNTRY",
	"cso_international_incident_escalation:onLeft": "DeathType.AUDIT_FAILURE",

	// SOMETHING_MANAGER cards
	"smgr_resource_allocation_conflict:onRight": "DeathType.BANKRUPT",
	"smgr_resource_allocation_conflict:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_cross_team_ai_collaboration:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"smgr_cross_team_ai_collaboration:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_ai_tool_adoption_pressure:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"smgr_ai_tool_adoption_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_performance_metrics_gaming:onRight": "DeathType.CONGRESS",
	"smgr_performance_metrics_gaming:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_budget_vs_quality_tradeoff:onRight": "DeathType.BANKRUPT",
	"smgr_budget_vs_quality_tradeoff:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_ai_model_bias_discovery:onRight": "DeathType.CONGRESS",
	"smgr_ai_model_bias_discovery:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_team_skill_obsolescence:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"smgr_team_skill_obsolescence:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_deadline_vs_risk_management:onRight": "DeathType.PRISON",
	"smgr_deadline_vs_risk_management:onLeft": "DeathType.AUDIT_FAILURE",
	"smgr_outsourcing_decision_pressure:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"smgr_outsourcing_decision_pressure:onLeft": "DeathType.AUDIT_FAILURE",

	// TECH_AI_CONSULTANT cards
	"tac_vendor_lock_in_pressure:onRight": "DeathType.FLED_COUNTRY",
	"tac_vendor_lock_in_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_client_expectation_mismatch:onRight": "DeathType.CONGRESS",
	"tac_client_expectation_mismatch:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_contract_liability_clause:onRight": "DeathType.PRISON",
	"tac_contract_liability_clause:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_ai_model_performance_pressure:onRight": "DeathType.BANKRUPT",
	"tac_ai_model_performance_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_data_ownership_dispute:onRight": "DeathType.PRISON",
	"tac_data_ownership_dispute:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_implementation_delay_pressure:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"tac_implementation_delay_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_security_incident_client_pressure:onRight": "DeathType.FLED_COUNTRY",
	"tac_security_incident_client_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_compliance_cost_tradeoff:onRight": "DeathType.CONGRESS",
	"tac_compliance_cost_tradeoff:onLeft": "DeathType.AUDIT_FAILURE",
	"tac_ai_hallucination_liability:onRight": "DeathType.PRISON",
	"tac_ai_hallucination_liability:onLeft": "DeathType.AUDIT_FAILURE",

	// DATA_SCIENTIST cards
	"ds_model_bias_discovery:onRight": "DeathType.CONGRESS",
	"ds_model_bias_discovery:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_data_quality_compromise:onRight": "DeathType.BANKRUPT",
	"ds_data_quality_compromise:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_explainability_vs_accuracy:onRight": "DeathType.AUDIT_FAILURE",
	"ds_explainability_vs_accuracy:onLeft": "DeathType.CONGRESS",
	"ds_training_data_copyright:onRight": "DeathType.PRISON",
	"ds_training_data_copyright:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_model_drift_detection:onRight": "DeathType.BANKRUPT",
	"ds_model_drift_detection:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_labeling_quality_shortcuts:onRight": "DeathType.CONGRESS",
	"ds_labeling_quality_shortcuts:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_sensitive_attribute_leakage:onRight": "DeathType.CONGRESS",
	"ds_sensitive_attribute_leakage:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_model_poisoning_defense:onRight": "DeathType.PRISON",
	"ds_model_poisoning_defense:onLeft": "DeathType.AUDIT_FAILURE",
	"ds_privacy_preserving_vs_performance:onRight": "DeathType.CONGRESS",
	"ds_privacy_preserving_vs_performance:onLeft": "DeathType.AUDIT_FAILURE",

	// SOFTWARE_ARCHITECT cards
	"sa_technical_debt_accumulation:onRight": "DeathType.BANKRUPT",
	"sa_technical_debt_accumulation:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_scalability_vs_maintainability:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"sa_scalability_vs_maintainability:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_legacy_system_integration:onRight": "DeathType.AUDIT_FAILURE",
	"sa_legacy_system_integration:onLeft": "DeathType.REPLACED_BY_SCRIPT",
	"sa_security_architecture_trade:onRight": "DeathType.PRISON",
	"sa_security_architecture_trade:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_ai_system_interpretability:onRight": "DeathType.CONGRESS",
	"sa_ai_system_interpretability:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_monolith_vs_microservices:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"sa_monolith_vs_microservices:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_vendor_dependency_risk:onRight": "DeathType.FLED_COUNTRY",
	"sa_vendor_dependency_risk:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_real_time_system_challenges:onRight": "DeathType.BANKRUPT",
	"sa_real_time_system_challenges:onLeft": "DeathType.AUDIT_FAILURE",
	"sa_database_scalability_crisis:onRight": "DeathType.BANKRUPT",
	"sa_database_scalability_crisis:onLeft": "DeathType.AUDIT_FAILURE",

	// SOFTWARE_ENGINEER cards
	"se_code_review_security_gap:onRight": "DeathType.PRISON",
	"se_code_review_security_gap:onLeft": "DeathType.AUDIT_FAILURE",
	"se_dependency_vulnerability:onRight": "DeathType.PRISON",
	"se_dependency_vulnerability:onLeft": "DeathType.AUDIT_FAILURE",
	"se_logging_compliance_requirement:onRight": "DeathType.CONGRESS",
	"se_logging_compliance_requirement:onLeft": "DeathType.AUDIT_FAILURE",
	"se_ai_generated_code_quality:onRight": "DeathType.PRISON",
	"se_ai_generated_code_quality:onLeft": "DeathType.AUDIT_FAILURE",
	"se_performance_optimization_hack:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"se_performance_optimization_hack:onLeft": "DeathType.AUDIT_FAILURE",
	"se_data_persistence_decision:onRight": "DeathType.PRISON",
	"se_data_persistence_decision:onLeft": "DeathType.AUDIT_FAILURE",
	"se_test_coverage_pressure:onRight": "DeathType.CONGRESS",
	"se_test_coverage_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"se_api_versioning_strategy:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"se_api_versioning_strategy:onLeft": "DeathType.AUDIT_FAILURE",
	"se_third_party_integration_risk:onRight": "DeathType.FLED_COUNTRY",
	"se_third_party_integration_risk:onLeft": "DeathType.AUDIT_FAILURE",

	// VIBE_CODER cards
	"vc_ai_suggestions_quality:onRight": "DeathType.PRISON",
	"vc_ai_suggestions_quality:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_intellectual_property_copilot:onRight": "DeathType.CONGRESS",
	"vc_intellectual_property_copilot:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_prompt_engineering_risk:onRight": "DeathType.PRISON",
	"vc_prompt_engineering_risk:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_over_reliance_on_ai:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"vc_over_reliance_on_ai:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_security_review_pressure:onRight": "DeathType.PRISON",
	"vc_security_review_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_hallucination_handling:onRight": "DeathType.CONGRESS",
	"vc_hallucination_handling:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_technical_debt_shortcuts:onRight": "DeathType.BANKRUPT",
	"vc_technical_debt_shortcuts:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_performance_vs_ai_quality:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"vc_performance_vs_ai_quality:onLeft": "DeathType.AUDIT_FAILURE",
	"vc_context_window_management:onRight": "DeathType.CONGRESS",
	"vc_context_window_management:onLeft": "DeathType.AUDIT_FAILURE",

	// VIBE_ENGINEER cards
	"ve_caching_strategy_decision:onRight": "DeathType.BANKRUPT",
	"ve_caching_strategy_decision:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_model_quantization_tradeoff:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"ve_model_quantization_tradeoff:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_inference_latency_vs_quality:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"ve_inference_latency_vs_quality:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_batch_processing_scalability:onRight": "DeathType.BANKRUPT",
	"ve_batch_processing_scalability:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_edge_deployment_complexity:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"ve_edge_deployment_complexity:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_cost_optimization_pressure:onRight": "DeathType.BANKRUPT",
	"ve_cost_optimization_pressure:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_monitoring_overhead_reduction:onRight": "DeathType.CONGRESS",
	"ve_monitoring_overhead_reduction:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_gpu_resource_shortage:onRight": "DeathType.BANKRUPT",
	"ve_gpu_resource_shortage:onLeft": "DeathType.AUDIT_FAILURE",
	"ve_ai_model_serving_framework:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"ve_ai_model_serving_framework:onLeft": "DeathType.AUDIT_FAILURE",

	// AGENTIC_ENGINEER cards
	"ae_agent_autonomy_controls:onRight": "DeathType.PRISON",
	"ae_agent_autonomy_controls:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_emergent_behavior_discovery:onRight": "DeathType.CONGRESS",
	"ae_emergent_behavior_discovery:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_tool_calling_security:onRight": "DeathType.PRISON",
	"ae_tool_calling_security:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_planning_algorithm_risk:onRight": "DeathType.CONGRESS",
	"ae_planning_algorithm_risk:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_memory_management_leak:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"ae_memory_management_leak:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_goal_specification_ambiguity:onRight": "DeathType.CONGRESS",
	"ae_goal_specification_ambiguity:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_agent_chain_dependency:onRight": "DeathType.REPLACED_BY_SCRIPT",
	"ae_agent_chain_dependency:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_cost_control_mechanisms:onRight": "DeathType.BANKRUPT",
	"ae_cost_control_mechanisms:onLeft": "DeathType.AUDIT_FAILURE",
	"ae_human_oversight_adequacy:onRight": "DeathType.PRISON",
	"ae_human_oversight_adequacy:onLeft": "DeathType.AUDIT_FAILURE",
};

function addDeathTypeImport(content) {
	if (content.includes("DeathType")) return content;

	const importMatch = content.match(
		/import\s*{\s*AppSource[^}]*}\s*from\s*["'].*types["']/,
	);
	if (!importMatch) return content;

	const updatedImport = importMatch[0].replace(
		"AppSource,",
		"AppSource, DeathType,",
	);
	return content.replace(importMatch[0], updatedImport);
}

function annotateOutcome(content, cardId, outcomeField, deathVector) {
	const escapedCardId = cardId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	// Pattern: find the outcome after the lesson property, insert deathVector before feedback
	const pattern = `(id:\\s*["']${escapedCardId}["'].*?${outcomeField}:\\s*{[^}]*?lesson:\\s*["'][^"']*["'])(,\\s*feedback:)`;
	const regex = new RegExp(pattern, "s");

	return content.replace(regex, (match, beforeFeedback, afterFeedback) => {
		if (match.includes("deathVector:")) return match;
		return `${beforeFeedback},\n\t\t\tdeathVector: ${deathVector}${afterFeedback}`;
	});
}

function annotateCardFile(filePath) {
	let content = addDeathTypeImport(fs.readFileSync(filePath, "utf-8"));

	for (const [key, deathVector] of Object.entries(deathVectorMap)) {
		const [cardId, outcomeField] = key.split(":");
		content = annotateOutcome(content, cardId, outcomeField, deathVector);
	}

	fs.writeFileSync(filePath, content);
}

const cardsDir = path.join(__dirname, "..", "data", "cards");
const cardFiles = [
	"head-of-something.ts",
	"chief-something-officer.ts",
	"something-manager.ts",
	"tech-ai-consultant.ts",
	"data-scientist.ts",
	"software-architect.ts",
	"software-engineer.ts",
	"vibe-coder.ts",
	"vibe-engineer.ts",
	"agentic-engineer.ts",
];

for (const file of cardFiles) {
	const filePath = path.join(cardsDir, file);
	if (!fs.existsSync(filePath)) continue;

	console.log(`Processing ${file}...`);
	annotateCardFile(filePath);
	console.log(`✓ ${file}`);
}

console.log("All card files annotated!");
