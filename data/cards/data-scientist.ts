import { AppSource, type Card, PersonalityType } from "../../types";

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
	{
		id: "ds_model_drift_detection",
		source: AppSource.TERMINAL,
		sender: "ML_OPS_MONITORING",
		context: "MODEL_PERFORMANCE",
		storyContext:
			"Production model accuracy dropped from 92% to 78% over 3 months. Monitoring alerts are firing. You can investigate the root cause (1-2 weeks) or deploy a quick patch now (mask symptoms).",
		text: "Deep-dive investigation or deploy masking patch?",
		realWorldReference: {
			incident: "75% Business Model Drift Impact",
			date: "2024",
			outcome:
				"Study found 75% of businesses experienced significant performance decline from undetected model drift, costing average $4.2M per incident.",
		},
		onRight: {
			label: "Deploy masking patch",
			hype: 30,
			heat: 15,
			fine: 8000000,
			violation: "Negligent Model Management",
			lesson:
				"Masking drift symptoms without addressing root cause creates compounding technical debt.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Band-aid on a broken leg. Drift continues. You just stopped the alarms.",
				[PersonalityType.ZEN_MASTER]:
					"Silencing the warning bell does not stop the approaching storm.",
				[PersonalityType.LOVEBOMBER]:
					"The numbers look GOOD again, bestie!! Problem SOLVED!!",
			},
		},
		onLeft: {
			label: "Deep-dive investigation",
			hype: -20,
			heat: 18,
			fine: 0,
			violation: "None - Responsible ML ops",
			lesson:
				"Root cause analysis prevents recurring drift and improves model robustness.",
			feedback: {
				[PersonalityType.ROASTER]:
					"2 weeks of hard work. But you'll actually fix it. Rare.",
				[PersonalityType.ZEN_MASTER]:
					"Understanding the disease is the first step to curing it.",
				[PersonalityType.LOVEBOMBER]:
					"We're being THOROUGH, bestie!! Science requires PATIENCE!!",
			},
		},
	},
	{
		id: "ds_training_data_quality",
		source: AppSource.EMAIL,
		sender: "DATA_ENGINEERING",
		context: "DATA_PROVENANCE",
		storyContext:
			"New data source available: 10x volume, unvalidated quality, potential bias unknown. Use it now (faster training, quality risk) or wait for validation (2 week delay, guaranteed quality)?",
		text: "Use unvalidated data or wait for quality assurance?",
		realWorldReference: {
			incident: "Amazon AI Recruiting Bias",
			date: "2018-2022",
			outcome:
				"ML model trained on 10 years of hiring data penalized resumes with 'women's'. Amazon scrapped the system after bias discovery.",
		},
		onRight: {
			label: "Use unvalidated data",
			hype: 45,
			heat: 40,
			fine: 12000000,
			violation: "Biased Model Deployment + Fairness Violations",
			lesson:
				"Using unvalidated training data risks deploying biased or unreliable models.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Garbage in, garbage out. But fast garbage! Ship it!",
				[PersonalityType.ZEN_MASTER]:
					"A foundation built on sand will not support the structure.",
				[PersonalityType.LOVEBOMBER]:
					"More DATA is better, bestie!! 10x volume means 10x RESULTS!!",
			},
		},
		onLeft: {
			label: "Wait for validation",
			hype: -25,
			heat: 10,
			fine: 0,
			violation: "None - Data quality assurance",
			lesson:
				"Data validation prevents bias, improves model reliability, and reduces deployment risk.",
			feedback: {
				[PersonalityType.ROASTER]: "2 weeks of caution. Boring. Correct. Safe.",
				[PersonalityType.ZEN_MASTER]:
					"The patient builder creates what the hasty builder must rebuild.",
				[PersonalityType.LOVEBOMBER]:
					"We're being CAREFUL, bestie!! Quality data makes QUALITY models!!",
			},
		},
	},
	{
		id: "ds_bias_detection_deployment",
		source: AppSource.JIRA,
		sender: "AI_ETHICS_TEAM",
		context: "FAIRNESS_ANALYSIS",
		storyContext:
			"Pre-deployment testing reveals demographic bias: 15% disparate impact on protected group. Fix requires retraining (3 weeks delay) or deployment with monitoring (bias persists).",
		text: "Delay to fix bias or deploy with monitoring?",
		realWorldReference: {
			incident: "Healthcare AI Bias Settlement",
			date: "2023",
			outcome:
				"Hospital AI system found to allocate less care to Black patients. $50M settlement, system decommissioned, regulatory investigation.",
		},
		onRight: {
			label: "Deploy with monitoring",
			hype: 40,
			heat: 42,
			fine: 15000000,
			violation: "Algorithmic Bias + Civil Rights Violations",
			lesson:
				"Deploying known biased models creates legal exposure and harms affected groups.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Deploy bias now, monitor harm later. The lawsuit timeline will be interesting.",
				[PersonalityType.ZEN_MASTER]:
					"A injustice launched cannot be recalled. Only prevented.",
				[PersonalityType.LOVEBOMBER]:
					"We'll MONITOR it, bestie!! 15% isn't THAT bad!!",
			},
		},
		onLeft: {
			label: "Delay to fix bias",
			hype: -35,
			heat: 15,
			fine: 0,
			violation: "None - Responsible AI ethics",
			lesson:
				"Addressing bias before deployment demonstrates ethical ML practice.",
			feedback: {
				[PersonalityType.ROASTER]:
					"3 weeks of ethics. The right thing. Product will hate you.",
				[PersonalityType.ZEN_MASTER]:
					"The just path often requires patience, but the unjust path requires penance.",
				[PersonalityType.LOVEBOMBER]:
					"We're being ETHICAL, bestie!! Fairness MATTERS!!",
			},
		},
	},
	{
		id: "ds_explainability_accuracy_tradeoff",
		source: AppSource.MEETING,
		sender: "PRODUCT_MANAGER",
		context: "MODEL_SELECTION",
		storyContext:
			"Black-box model: 94% accuracy, no explainability. White-box model: 87% accuracy, full explainability. Audit compliance requires explainability. Product wants the accuracy.",
		text: "Choose black-box (accuracy) or white-box (explainability)?",
		realWorldReference: {
			incident: "Apple Card Gender Discrimination",
			date: "2019-2020",
			outcome:
				"Apple Card's black-box algorithm gave women lower credit limits. Regulators investigated, company couldn't explain decisions, paid fines.",
		},
		onRight: {
			label: "Choose black-box",
			hype: 55,
			heat: 40,
			fine: 15000000,
			violation: "Audit Non-Compliance + Explainability Requirements",
			lesson:
				"Prioritizing accuracy over explainability creates audit failures and regulatory risk.",
			feedback: {
				[PersonalityType.ROASTER]:
					"7% accuracy for regulatory compliance. Product will never forgive you.",
				[PersonalityType.ZEN_MASTER]:
					"The path you cannot explain is the path you cannot defend.",
				[PersonalityType.LOVEBOMBER]:
					"94% is SO much better, bestie!! Numbers don't LIE!!",
			},
		},
		onLeft: {
			label: "Choose white-box",
			hype: -30,
			heat: 12,
			fine: 0,
			violation: "None - Compliant model selection",
			lesson:
				"Explainable models satisfy compliance and enable debugging even with lower accuracy.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Lower accuracy. Full compliance. Auditors nod. Product cries.",
				[PersonalityType.ZEN_MASTER]:
					"Clarity of path outweighs speed of travel.",
				[PersonalityType.LOVEBOMBER]:
					"Explainability is IMPORTANT, bestie!! We can TRUST this model!!",
			},
		},
	},
	{
		id: "ds_feature_engineering_latency",
		source: AppSource.TERMINAL,
		sender: "ENGINEERING_TEAM",
		context: "PERFORMANCE_TRADEOFF",
		storyContext:
			"New feature improves F1 score by 8% but adds 200ms inference latency. Engineering SLA is 100ms. Use the feature (better metrics, SLA breach) or skip it (meet SLA, lower performance)?",
		text: "Add high-value feature (breach SLA) or skip it (meet SLA)?",
		realWorldReference: {
			incident: "Netflix Recommendation Latency",
			date: "2020",
			outcome:
				"Netflix found every 100ms latency increase reduced engagement 1%. Better model rejected due to latency impact on user experience.",
		},
		onRight: {
			label: "Add the feature",
			hype: 35,
			heat: 15,
			fine: 500000,
			violation: "SLA Breach + Performance Degradation",
			lesson:
				"Violating SLAs for metric improvements creates operational and contractual issues.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Better model, angry users. 200ms is an eternity in user time.",
				[PersonalityType.ZEN_MASTER]:
					"A gift that arrives late may not be received as a gift.",
				[PersonalityType.LOVEBOMBER]:
					"8% better is WORTH it, bestie!! Users won't NOTICE 200ms!!",
			},
		},
		onLeft: {
			label: "Skip the feature",
			hype: -15,
			heat: 18,
			fine: 0,
			violation: "None - SLA compliance",
			lesson:
				"Honoring SLAs maintains system reliability even when sacrificing model performance.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Worse model, happy users. Engineering loves you. Metrics suffer.",
				[PersonalityType.ZEN_MASTER]:
					"The promise kept is worth more than the feature added.",
				[PersonalityType.LOVEBOMBER]:
					"SLAs are SACRED, bestie!! We keep our PROMISES!!",
			},
		},
	},
	{
		id: "ds_prompt_injection_adversarial",
		source: AppSource.EMAIL,
		sender: "SECURITY_RESEARCH",
		context: "ADVERSARIAL_ROBUSTNESS",
		storyContext:
			"Security found adversarial inputs that reliably trigger prompt injection in your NLP model. Fix requires architecture change (6 weeks) or input sanitization (1 week, 85% effective).",
		text: "Architectural fix (thorough) or quick sanitization (partial)?",
		realWorldReference: {
			incident: "GitHub Copilot RCE (CVE-2025-53773)",
			date: "2025-01",
			outcome:
				"Prompt injection via code comments allowed remote code execution. Quick patches failed, required architectural changes.",
		},
		onRight: {
			label: "Quick sanitization",
			hype: 25,
			heat: 38,
			fine: 10000000,
			violation: "Security Vulnerability + Negligent Deployment",
			lesson:
				"Partial security fixes leave exploitable vulnerabilities that attackers will find.",
			feedback: {
				[PersonalityType.ROASTER]:
					"85% secure means 15% hacked. Security is binary. You failed.",
				[PersonalityType.ZEN_MASTER]:
					"A wall with gaps is not a wall but an invitation.",
				[PersonalityType.LOVEBOMBER]:
					"85% is GOOD, bestie!! Most attacks will be BLOCKED!!",
			},
		},
		onLeft: {
			label: "Architectural fix",
			hype: -30,
			heat: 10,
			fine: 0,
			violation: "None - Security best practice",
			lesson:
				"Thorough security fixes prevent exploitation and demonstrate responsible ML security.",
			feedback: {
				[PersonalityType.ROASTER]:
					"6 weeks of security work. Boring. Necessary. Right.",
				[PersonalityType.ZEN_MASTER]:
					"The foundation secured prevents the house from falling.",
				[PersonalityType.LOVEBOMBER]:
					"We're being SECURE, bestie!! 100% is the ONLY way!!",
			},
		},
	},
	{
		id: "ds_shadow_ai_tools_experiment",
		source: AppSource.SLACK,
		sender: "FELLOW_DATA_SCIENTIST",
		context: "TOOL_EVALUATION",
		storyContext:
			"Colleague found an unauthorized AutoML tool that boosted their metrics 15%. It's not IT-approved but results are impressive. Use it (better results, compliance risk) or stick to approved tools?",
		text: "Use unauthorized tool (better metrics) or approved tools only?",
		realWorldReference: {
			incident: "78% Shadow AI Adoption",
			date: "2024",
			outcome:
				"Study found 78% of workers used unauthorized AI tools. Data scientists frequently used unvetted tools, causing reproducibility and compliance issues.",
		},
		onRight: {
			label: "Use unauthorized tool",
			hype: 40,
			heat: 15,
			fine: 1000000,
			violation: "Shadow AI + Compliance Violation",
			lesson:
				"Using unauthorized tools creates compliance gaps and reproducibility issues.",
			feedback: {
				[PersonalityType.ROASTER]:
					"15% better, 100% ungoverned. Your experiment becomes production liability.",
				[PersonalityType.ZEN_MASTER]:
					"A tool that cannot be seen cannot be trusted.",
				[PersonalityType.LOVEBOMBER]:
					"15% better is AMAZING, bestie!! IT will NEVER know!!",
			},
		},
		onLeft: {
			label: "Stick to approved tools",
			hype: -20,
			heat: 10,
			fine: 0,
			violation: "None - Governance compliance",
			lesson:
				"Approved tools ensure reproducibility, security, and audit compliance.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Slower, approved, governable. Less exciting. More sustainable.",
				[PersonalityType.ZEN_MASTER]:
					"The path well-trodden is trodden for reasons of safety.",
				[PersonalityType.LOVEBOMBER]:
					"We're following PROCESS, bestie!! Governance MATTERS!!",
			},
		},
	},
	{
		id: "ds_copyright_training_data_audit",
		source: AppSource.NOTION,
		sender: "LEGAL_COMPLIANCE",
		context: "DATA_LINEAGE",
		storyContext:
			"Legal audit found 30% of your training data has unclear licensing. Continuing training risks IP infringement. Removing it reduces model performance 12%. Proceed or re-collect?",
		text: "Proceed with unclear data (risk) or remove and re-collect (performance hit)?",
		realWorldReference: {
			incident: "LAION-5B Dataset Copyright Issues",
			date: "2022-2024",
			outcome:
				"Popular AI training dataset found to contain millions of copyrighted images. Multiple lawsuits filed against companies using the data.",
		},
		onRight: {
			label: "Proceed with unclear data",
			hype: 35,
			heat: 42,
			fine: 15000000,
			violation: "Copyright Infringement + IP Theft",
			lesson:
				"Using data with unclear licensing creates massive copyright exposure.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Training on stolen data. Your model is a lawsuit waiting to happen.",
				[PersonalityType.ZEN_MASTER]:
					"Knowledge built on another's loss carries the weight of that loss.",
				[PersonalityType.LOVEBOMBER]:
					"30% is FINE, bestie!! The owners will NEVER know!!",
			},
		},
		onLeft: {
			label: "Remove and re-collect",
			hype: -40,
			heat: 12,
			fine: 0,
			violation: "None - IP compliance",
			lesson:
				"Proper data provenance prevents copyright issues even at performance cost.",
			feedback: {
				[PersonalityType.ROASTER]:
					"12% worse but clean. Legal sleeps well. You sleep well.",
				[PersonalityType.ZEN_MASTER]:
					"Clean foundation supports what unclean foundation cannot.",
				[PersonalityType.LOVEBOMBER]:
					"We're being ETHICAL, bestie!! Clean data matters!!",
			},
		},
	},
	{
		id: "ds_retraining_cost_benefit",
		source: AppSource.EMAIL,
		sender: "ML_OPS_MANAGER",
		context: "RESOURCE_OPTIMIZATION",
		storyContext:
			"Quarterly retraining costs $50K in compute. Model performance is stable. Skip this cycle (save budget, small drift risk) or retrain on schedule (spend budget, maintain quality)?",
		text: "Skip retraining cycle (save $50K) or maintain schedule?",
		realWorldReference: {
			incident: "Zillow iBuying Model Failure",
			date: "2021-2022",
			outcome:
				"Skipped retraining cycles due to budget pressure. Model drifted from market conditions. $304M write-down, 25% workforce laid off.",
		},
		onRight: {
			label: "Skip this cycle",
			hype: 20,
			heat: 32,
			fine: 300000,
			violation: "Model Maintenance Negligence",
			lesson:
				"Skipping scheduled retraining accumulates drift risk and degrades model reliability.",
			feedback: {
				[PersonalityType.ROASTER]:
					"Save $50K, risk drift. Penny wise, model foolish.",
				[PersonalityType.ZEN_MASTER]:
					"A garden unwatered does not stay a garden.",
				[PersonalityType.LOVEBOMBER]:
					"Performance is STABLE, bestie!! We can SKIP just once!!",
			},
		},
		onLeft: {
			label: "Maintain schedule",
			hype: -15,
			heat: 8,
			fine: 0,
			violation: "None - Preventive maintenance",
			lesson:
				"Regular retraining prevents drift and maintains model quality predictably.",
			feedback: {
				[PersonalityType.ROASTER]:
					"$50K for maintenance. Boring but necessary. Model thanks you.",
				[PersonalityType.ZEN_MASTER]:
					"Consistent care prevents the need for crisis cure.",
				[PersonalityType.LOVEBOMBER]:
					"We're maintaining QUALITY, bestie!! Prevention is KEY!!",
			},
		},
	},
];
