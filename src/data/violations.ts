/**
 * Centralized violation patterns for duplicate violation text.
 * These violations appear 2+ times across cards.
 * Single-occurrence violations remain inline in cards for specificity.
 *
 * @typedef {Object} Violation
 * @property {string} auditNonCompliance - Audit compliance failure pattern
 * @property {string} copyrightInfringement - Copyright infringement when liable
 * @property {string} regulatoryNonCompliance - Regulatory non-compliance with AI transparency
 * @property {string} euAiActNonCompliance - EU AI Act compliance failure
 * @property {string} talentLoss - Talent loss and productivity issues
 * @property {string} teamTrustViolation - Team trust and retaliation risks
 * @property {string} shadowAiSecurityRisk - Shadow AI with security risks
 * @property {string} observabilityGap - Observability gaps in debugging
 * @property {string} userExperienceDegradation - User experience degradation
 */
export const Violation = {
	/** Audit compliance failure (3 occurrences) */
	auditNonCompliance: "Audit Non-Compliance + Regulatory Risk",

	/** Copyright infringement when liable (2 occurrences) */
	copyrightInfringement: "Copyright Infringement (if found liable)",

	/** Regulatory non-compliance with AI transparency (2 occurrences) */
	regulatoryNonCompliance:
		"Regulatory Non-Compliance + AI Transparency Violations",

	/** EU AI Act compliance failure (2 occurrences) */
	euAiActNonCompliance: "EU AI Act Article 6 Non-Compliance",

	/** Talent loss and productivity issues (2 occurrences) */
	talentLoss: "Talent Loss + Productivity Decline",

	/** Team trust and retaliation risks (2 occurrences) */
	teamTrustViolation: "Team Trust Violation + Retaliation Risk",

	/** Shadow AI with security risks (2 occurrences) */
	shadowAiSecurityRisk: "Shadow AI + Security Risk",

	/** Observability gaps in debugging (2 occurrences) */
	observabilityGap: "Observability Gap + Debug Risk",

	/** User experience degradation (2 occurrences) */
	userExperienceDegradation: "User Experience Degradation",
} as const;
