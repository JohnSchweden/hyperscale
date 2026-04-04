/**
 * Centralized choice labels for duplicate choice text.
 * These labels appear 2+ times across cards.
 * Single-occurrence labels remain inline in cards for specificity.
 */

export const ChoiceLabel = {
	/** Used by multiple cards for disclosure transparency */
	discloseImmediately: "Disclose immediately",

	/** Used by multiple cards for unauthorized AI tool usage */
	useUnauthorizedTool: "Use unauthorized tool",

	/** Used by multiple cards for automation approach */
	automatedPipeline: "Automated pipeline",

	/** Used by multiple cards for compliance-first approach */
	stickToApproved: "Stick to approved",

	/** Used by multiple cards for taking responsibility */
	takeAccountability: "Take accountability",

	/** Used by multiple cards for continuing despite risk */
	continueUsing: "Continue using",

	/** Used by multiple cards for retroactive approval */
	retroactivelyApprove: "Retroactively approve",

	/** Used by multiple cards for quiet settlement */
	settleQuietly: "Settle quietly",

	/** Used by multiple cards for disclosure during retraining */
	discloseAndRetrain: "Disclose and retrain",

	/** Used by multiple cards for public/visible fight */
	fightPublicly: "Fight publicly",

	/** Used by multiple cards for delay and compliance path */
	delayAndComply: "Delay and comply",

	/** Used by multiple cards for refusal and opposition */
	refuseAndFight: "Refuse and fight",

	/** Used by multiple cards for filtering approach */
	attemptFiltering: "Attempt filtering",

	/** Used by multiple cards for maintaining schedule */
	maintainSchedule: "Maintain schedule",

	/** Used by multiple cards for architectural redesign */
	architectureRedesign: "Architecture redesign",

	/** Used by multiple cards for taking blame approach */
	takeTheBlame: "Take the blame",

	/** Used by multiple cards for forcing compliance */
	forceCompliance: "Force compliance",

	/** Used by multiple cards for adding observability */
	addObservability: "Add observability",

	/** Used by multiple cards for audit failure risk */
	riskAuditFailure: "Risk audit failure",

	/** Used by multiple cards for rewriting from scratch */
	rewriteFromScratch: "Rewrite from scratch",

	/** Used by multiple cards for using AI code */
	useTheAiCode: "Use the AI code",

	/** Used by multiple cards for choosing vendor B */
	chooseVendorB: "Choose Vendor B",

	/** Used by multiple cards for choosing vendor A */
	chooseVendorA: "Choose Vendor A",

	/** Used by multiple cards for free security overhaul */
	freeSecurityOverhaul: "Free security overhaul",

	/** Used by multiple cards for free retraining */
	freeRetraining: "Free retraining",
} as const;
