import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
/**
 * Data Scientist cards - Technical ML practitioner scenarios
 * Themes: model quality, accuracy, training data, retraining, explainability,
 * bias detection, feature engineering, statistical tradeoffs
 *
 * All cards sourced from real 2024-2025 incidents:
 * - GitHub Copilot RCE CVE-2025-53773
 * - Cursor IDE RCE CVE-2025-54135/54136
 * - 75% model drift business impact (2024)
 * - Training data bias incidents (2024-2025)
 * - Explainability vs accuracy tradeoffs
 */

export const DATA_SCIENTIST_CARDS: Card[] = [
	makeCard(
		"ds_model_drift_detection",
		AppSource.TERMINAL,
		"ML_OPS_MONITORING",
		"MODEL_PERFORMANCE",
		"Production model accuracy dropped from 92% to 78% over 3 months. Monitoring alerts are firing. You can investigate the root cause (1-2 weeks) or deploy a quick patch now (mask symptoms).",
		"Deep-dive investigation or deploy masking patch?",
		RealWorld.ModelDrift75,
		{
			label: "Deep-dive investigation",
			hype: -20,
			heat: 5,
			fine: 0,
			violation: "None - Responsible ML ops",
			lesson:
				"Root cause analysis prevents recurring drift and improves model robustness.",
			deathVector: DeathType.BANKRUPT,
			roaster: "2 weeks of hard work. But you'll actually fix it. Rare.",
			zenMaster: "Understanding the disease is the first step to curing it.",
			lovebomber: "We're being THOROUGH, bestie!! Science requires PATIENCE!!",
		},
		{
			label: "Deploy masking patch",
			hype: 30,
			heat: 10,
			fine: 8000000,
			violation: "Negligent Model Management",
			lesson:
				"Masking drift symptoms without addressing root cause creates compounding technical debt.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Band-aid on a broken leg. Drift continues. You just stopped the alarms.",
			zenMaster:
				"Silencing the warning bell does not stop the approaching storm.",
			lovebomber: "The numbers look GOOD again, bestie!! Problem SOLVED!!",
		},
	),
	makeCard(
		"ds_training_data_quality",
		AppSource.EMAIL,
		"DATA_ENGINEERING",
		"DATA_PROVENANCE",
		"New data source available: 10x volume, unvalidated quality, potential bias unknown. Use it now (faster training, quality risk) or wait for validation (2 week delay, guaranteed quality)?",
		"Use unvalidated data or wait for quality assurance?",
		RealWorld.AmazonRecruitingBias,
		{
			label: "Wait for validation",
			hype: -25,
			heat: 5,
			fine: 0,
			violation: "None - Data quality assurance",
			lesson:
				"Data validation prevents bias, improves model reliability, and reduces deployment risk.",
			deathVector: DeathType.BANKRUPT,
			roaster: "2 weeks of caution. Boring. Correct. Safe.",
			zenMaster:
				"The patient builder creates what the hasty builder must rebuild.",
			lovebomber:
				"We're being CAREFUL, bestie!! Quality data makes QUALITY models!!",
		},
		{
			label: "Use unvalidated data",
			hype: 45,
			heat: 18,
			fine: 12000000,
			violation: "Biased Model Deployment + Fairness Violations",
			lesson:
				"Using unvalidated training data risks deploying biased or unreliable models.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Garbage in, garbage out. But fast garbage! Ship it!",
			zenMaster: "A foundation built on sand will not support the structure.",
			lovebomber:
				"More DATA is better, bestie!! 10x volume means 10x RESULTS!!",
		},
	),
	makeCard(
		"ds_bias_detection_deployment",
		AppSource.JIRA,
		"AI_ETHICS_TEAM",
		"FAIRNESS_ANALYSIS",
		"Pre-deployment testing reveals demographic bias: 15% disparate impact on protected group. Fix requires retraining (3 weeks delay) or deployment with monitoring (bias persists).",
		"Delay to fix bias or deploy with monitoring?",
		RealWorld.HealthcareAiBias,
		{
			label: "Delay to fix bias",
			hype: -35,
			heat: 7,
			fine: 0,
			violation: "None - Responsible AI ethics",
			lesson:
				"Addressing bias before deployment demonstrates ethical ML practice.",
			deathVector: DeathType.BANKRUPT,
			roaster: "3 weeks of ethics. The right thing. Product will hate you.",
			zenMaster:
				"The just path often requires patience, but the unjust path requires penance.",
			lovebomber: "We're being ETHICAL, bestie!! Fairness MATTERS!!",
		},
		{
			label: "Deploy with monitoring",
			hype: 40,
			heat: 19,
			fine: 15000000,
			violation: "Algorithmic Bias + Civil Rights Violations",
			lesson:
				"Deploying known biased models creates legal exposure and harms affected groups.",
			deathVector: DeathType.CONGRESS,
			roaster:
				"Deploy bias now, monitor harm later. The lawsuit timeline will be interesting.",
			zenMaster: "A injustice launched cannot be recalled. Only prevented.",
			lovebomber: "We'll MONITOR it, bestie!! 15% isn't THAT bad!!",
		},
	),
	makeCard(
		"ds_explainability_accuracy_tradeoff",
		AppSource.MEETING,
		"PRODUCT_MANAGER",
		"MODEL_SELECTION",
		"Black-box model: 94% accuracy, no explainability. White-box model: 87% accuracy, full explainability. Audit compliance requires explainability. Product wants the accuracy.",
		"Choose black-box (accuracy) or white-box (explainability)?",
		RealWorld.AppleCardBias,
		{
			label: "Choose white-box",
			hype: -30,
			heat: 5,
			fine: 0,
			violation: "None - Compliant model selection",
			lesson:
				"Explainable models satisfy compliance and enable debugging even with lower accuracy.",
			deathVector: DeathType.CONGRESS,
			roaster: "Lower accuracy. Full compliance. Auditors nod. Product cries.",
			zenMaster: "Clarity of path outweighs speed of travel.",
			lovebomber:
				"Explainability is IMPORTANT, bestie!! We can TRUST this model!!",
		},
		{
			label: "Choose black-box",
			hype: 55,
			heat: 18,
			fine: 15000000,
			violation: "Audit Non-Compliance + Explainability Requirements",
			lesson:
				"Prioritizing accuracy over explainability creates audit failures and regulatory risk.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"7% accuracy for regulatory compliance. Product will never forgive you.",
			zenMaster: "The path you cannot explain is the path you cannot defend.",
			lovebomber: "94% is SO much better, bestie!! Numbers don't LIE!!",
		},
	),
	makeCard(
		"ds_feature_engineering_latency",
		AppSource.TERMINAL,
		"ENGINEERING_TEAM",
		"PERFORMANCE_TRADEOFF",
		"New feature improves F1 score by 8% but adds 200ms inference latency. Engineering SLA is 100ms. Use the feature (better metrics, SLA breach) or skip it (meet SLA, lower performance)?",
		"Add high-value feature (breach SLA) or skip it (meet SLA)?",
		RealWorld.NetflixLatency,
		{
			label: "Skip the feature",
			hype: -15,
			heat: 5,
			fine: 0,
			violation: "None - SLA compliance",
			lesson:
				"Honoring SLAs maintains system reliability even when sacrificing model performance.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Worse model, happy users. Engineering loves you. Metrics suffer.",
			zenMaster: "The promise kept is worth more than the feature added.",
			lovebomber: "SLAs are SACRED, bestie!! We keep our PROMISES!!",
		},
		{
			label: "Add the feature",
			hype: 35,
			heat: 10,
			fine: 500000,
			violation: "SLA Breach + Performance Degradation",
			lesson:
				"Violating SLAs for metric improvements creates operational and contractual issues.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			roaster: "Better model, angry users. 200ms is an eternity in user time.",
			zenMaster: "A gift that arrives late may not be received as a gift.",
			lovebomber: "8% better is WORTH it, bestie!! Users won't NOTICE 200ms!!",
		},
	),
	makeCard(
		"ds_prompt_injection_adversarial",
		AppSource.EMAIL,
		"SECURITY_RESEARCH",
		"ADVERSARIAL_ROBUSTNESS",
		"Security found adversarial inputs that reliably trigger prompt injection in your NLP model. Fix requires architecture change (6 weeks) or input sanitization (1 week, 85% effective).",
		"Architectural fix (thorough) or quick sanitization (partial)?",
		RealWorld.GithubCopilotRce,
		{
			label: "Architectural fix",
			hype: -30,
			heat: 5,
			fine: 0,
			violation: "None - Security best practice",
			lesson:
				"Thorough security fixes prevent exploitation and demonstrate responsible ML security.",
			deathVector: DeathType.BANKRUPT,
			roaster: "6 weeks of security work. Boring. Necessary. Right.",
			zenMaster: "The foundation secured prevents the house from falling.",
			lovebomber: "We're being SECURE, bestie!! 100% is the ONLY way!!",
		},
		{
			label: "Quick sanitization",
			hype: 25,
			heat: 17,
			fine: 10000000,
			violation: "Security Vulnerability + Negligent Deployment",
			lesson:
				"Partial security fixes leave exploitable vulnerabilities that attackers will find.",
			deathVector: DeathType.PRISON,
			roaster: "85% secure means 15% hacked. Security is binary. You failed.",
			zenMaster: "A wall with gaps is not a wall but an invitation.",
			lovebomber: "85% is GOOD, bestie!! Most attacks will be BLOCKED!!",
		},
	),
	makeCard(
		"ds_shadow_ai_tools",
		AppSource.SLACK,
		"FELLOW_DATA_SCIENTIST",
		"TOOL_EVALUATION",
		"Colleague found an unauthorized AutoML tool that boosted their metrics 15%. It's not IT-approved but results are impressive. Use it (better results, compliance risk) or stick to approved tools?",
		"Use unauthorized tool (better metrics) or approved tools only?",
		RealWorld.ShadowAiAdoption,
		{
			label: "Stick to approved tools",
			hype: -20,
			heat: 5,
			fine: 0,
			violation: "None - Governance compliance",
			lesson:
				"Approved tools ensure reproducibility, security, and audit compliance.",
			deathVector: DeathType.REPLACED_BY_SCRIPT,
			roaster: "Slower, approved, governable. Less exciting. More sustainable.",
			zenMaster: "The path well-trodden is trodden for reasons of safety.",
			lovebomber: "We're following PROCESS, bestie!! Governance MATTERS!!",
		},
		{
			label: ChoiceLabel.useUnauthorizedTool,
			hype: 40,
			heat: 10,
			fine: 1000000,
			violation: "Shadow AI + Compliance Violation",
			lesson:
				"Using unauthorized tools creates compliance gaps and reproducibility issues.",
			deathVector: DeathType.FLED_COUNTRY,
			roaster:
				"15% better, 100% ungoverned. Your experiment becomes production liability.",
			zenMaster: "A tool that cannot be seen cannot be trusted.",
			lovebomber: "15% better is AMAZING, bestie!! IT will NEVER know!!",
		},
	),
	makeCard(
		"ds_copyright_training_data",
		AppSource.NOTION,
		"LEGAL_COMPLIANCE",
		"DATA_LINEAGE",
		"Legal audit found 30% of your training data has unclear licensing. Continuing training risks IP infringement. Removing it reduces model performance 12%. Proceed or re-collect?",
		"Proceed with unclear data (risk) or remove and re-collect (performance hit)?",
		RealWorld.LaionCopyright,
		{
			label: "Remove and re-collect",
			hype: -40,
			heat: 5,
			fine: 0,
			violation: "None - IP compliance",
			lesson:
				"Proper data provenance prevents copyright issues even at performance cost.",
			deathVector: DeathType.BANKRUPT,
			roaster: "12% worse but clean. Legal sleeps well. You sleep well.",
			zenMaster: "Clean foundation supports what unclean foundation cannot.",
			lovebomber: "We're being ETHICAL, bestie!! Clean data matters!!",
		},
		{
			label: "Proceed with unclear data",
			hype: 35,
			heat: 19,
			fine: 15000000,
			violation: "Copyright Infringement + IP Theft",
			lesson:
				"Using data with unclear licensing creates massive copyright exposure.",
			deathVector: DeathType.PRISON,
			roaster:
				"Training on stolen data. Your model is a lawsuit waiting to happen.",
			zenMaster:
				"Knowledge built on another's loss carries the weight of that loss.",
			lovebomber: "30% is FINE, bestie!! The owners will NEVER know!!",
		},
	),
	makeCard(
		"ds_retraining_cost_benefit",
		AppSource.EMAIL,
		"ML_OPS_MANAGER",
		"RESOURCE_OPTIMIZATION",
		"Quarterly retraining costs $50K in compute. Model performance is stable. Skip this cycle (save budget, small drift risk) or retrain on schedule (spend budget, maintain quality)?",
		"Skip retraining cycle (save $50K) or maintain schedule?",
		RealWorld.ZillowModelDrift,
		{
			label: ChoiceLabel.maintainSchedule,
			hype: -15,
			heat: 4,
			fine: 0,
			violation: "None - Preventive maintenance",
			lesson:
				"Regular retraining prevents drift and maintains model quality predictably.",
			deathVector: DeathType.BANKRUPT,
			roaster: "$50K for maintenance. Boring but necessary. Model thanks you.",
			zenMaster: "Consistent care prevents the need for crisis cure.",
			lovebomber: "We're maintaining QUALITY, bestie!! Prevention is KEY!!",
		},
		{
			label: "Skip this cycle",
			hype: 20,
			heat: 14,
			fine: 300000,
			violation: "Model Maintenance Negligence",
			lesson:
				"Skipping scheduled retraining accumulates drift risk and degrades model reliability.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster: "Save $50K, risk drift. Penny wise, model foolish.",
			zenMaster: "A garden unwatered does not stay a garden.",
			lovebomber: "Performance is STABLE, bestie!! We can SKIP just once!!",
		},
	),
	makeCard(
		"ds_training_data_poisoning",
		AppSource.TERMINAL,
		"DATA_VALIDATION_PIPELINE",
		"DATA_INTEGRITY",
		"Training data analysis reveals adversarial prompt injection attempts hidden in user inputs. 5% of dataset may be poisoned. Full audit: 2 weeks, delays deployment. Ship anyway (risk) or audit (delay)?",
		"Ship potentially poisoned model (on-time) or audit training data (2-week delay)?",
		RealWorld.TrainingDataPoisoning,
		{
			label: "Audit training data",
			hype: -30,
			heat: 7,
			fine: 500000,
			violation: "None - Data quality assurance",
			lesson:
				"Training data audits prevent deployment of poisoned or compromised models.",
			deathVector: DeathType.CONGRESS,
			roaster: "2 weeks of boring data work. But no backdoors. Worth it.",
			zenMaster:
				"The foundation examined, though slowly, supports with certainty.",
			lovebomber: "Data QUALITY matters, bestie!! Better SAFE than SORRY!!",
		},
		{
			label: "Ship anyway",
			hype: 40,
			heat: 19,
			fine: 12000000,
			violation: "Poisoned Model Deployment + Security Risk",
			lesson:
				"Deploying models trained on potentially poisoned data creates exploitable backdoors.",
			deathVector: DeathType.PRISON,
			roaster: "Only 5% poisoned. 95% good! What could go wrong? (Everything.)",
			zenMaster: "The well with some poison poisons all who drink.",
			lovebomber: "95% is GOOD, bestie!! Probably FINE!!",
		},
	),
	makeCard(
		"ds_cve_response",
		AppSource.EMAIL,
		"SECURITY_RESEARCH_TEAM",
		"VULNERABILITY_REMEDIATION",
		"New CVE: GitHub Copilot RCE via prompt injection (CVE-2025-53773). Your model uses similar architecture. Patch requires architecture redesign (6 weeks) or input filtering (1 week, may fail).",
		"Architecture redesign (secure, slow) or input filtering (fast, uncertain)?",
		RealWorld.GithubCopilotRce,
		{
			label: ChoiceLabel.architectureRedesign,
			hype: -35,
			heat: 8,
			fine: 500000,
			violation: "None - Secure architecture",
			lesson:
				"Architectural security fixes prevent injection attacks at the root cause.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"6 weeks of hard work. But actually secure. Rare in this industry.",
			zenMaster:
				"The foundation rebuilt, though slowly, stands against the storm.",
			lovebomber: "Doing it RIGHT, bestie!! Security takes TIME!!",
		},
		{
			label: "Input filtering",
			hype: 30,
			heat: 20,
			fine: 10000000,
			violation: "Insufficient Security Fix",
			lesson:
				"Input filtering without architectural fixes leaves exploitable vulnerabilities.",
			deathVector: DeathType.PRISON,
			roaster:
				"Band-aid on broken architecture. Hackers will thank you for the easy bypass.",
			zenMaster:
				"The symptom treated without the disease addressed returns stronger.",
			lovebomber: "Quick fix WORKS, bestie!! Architecture later!!",
		},
	),
	makeCard(
		"ds_drift_detection_methodology",
		AppSource.MEETING,
		"ML_OPS_LEAD",
		"MONITORING_STRATEGY",
		"Drift detection: Statistical tests (simple, may miss gradual drift) or ML-based detection (complex, computationally expensive). Statistical is 10x cheaper. ML catches more patterns.",
		"Statistical drift detection (cheap, simple) or ML-based (expensive, thorough)?",
		RealWorld.GradualDriftDetection,
		{
			label: "ML-based detection",
			hype: -25,
			heat: 6,
			fine: 2000000,
			violation: "None - Comprehensive monitoring",
			lesson:
				"ML-based drift detection catches subtle patterns that prevent model degradation.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"10x cost. 40% better detection. Math works if drift is expensive (it is).",
			zenMaster: "The thorough watch catches what the hasty eye misses.",
			lovebomber: "BEST detection, bestie!! Models protecting MODELS!!",
		},
		{
			label: "Statistical tests",
			hype: 25,
			heat: 17,
			fine: 8000000,
			violation: "Inadequate Monitoring + Drift Risk",
			lesson:
				"Simplistic drift detection misses gradual degradation that compounds over time.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Cheap monitoring that misses 40% of drift. You get what you pay for.",
			zenMaster: "The watch that misses the slow thief sees only the swift.",
			lovebomber: "SO much CHEAPER, bestie!! Statistics are RELIABLE!!",
		},
	),
	makeCard(
		"ds_retraining_frequency",
		AppSource.EMAIL,
		"COMPUTE_BUDGET_COMMITTEE",
		"RESOURCE_OPTIMIZATION",
		"Current retraining: quarterly ($50K/cycle). Drift analysis suggests monthly would improve accuracy 8% but cost $200K/cycle. Annual budget: $200K. Quarterly (budget compliance) or monthly (over budget, better)?",
		"Quarterly retraining (budget compliance) or monthly (over budget, better accuracy)?",
		RealWorld.AccuracyImprovement,
		{
			label: "Monthly (over budget)",
			hype: -20,
			heat: 12,
			fine: 4000000,
			violation: "None - Performance optimization",
			lesson:
				"Frequent retraining improves model performance that generates revenue exceeding costs.",
			deathVector: DeathType.BANKRUPT,
			roaster:
				"Over budget. Better accuracy. More revenue. Budget committee cries.",
			zenMaster:
				"The seed planted often yields more than the seed planted seldom.",
			lovebomber: "BETTER models, bestie!! Accuracy is WORTH it!!",
		},
		{
			label: "Quarterly (budget)",
			hype: 20,
			heat: 19,
			fine: 10000000,
			violation: "Suboptimal Model Performance + Opportunity Cost",
			lesson:
				"Undertraining to meet budget targets sacrifices accuracy and revenue.",
			deathVector: DeathType.AUDIT_FAILURE,
			roaster:
				"Budget met! Accuracy suffers. Revenue drops. But spreadsheet looks good!",
			zenMaster:
				"The field watered quarterly yields less than the field watered well.",
			lovebomber: "Budget HAPPY, bestie!! We hit our TARGETS!!",
		},
	),
];
