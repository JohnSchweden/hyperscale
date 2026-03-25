import {
	AppSource,
	type Card,
	type DeathType,
	makeFeedback,
	type PersonalityType,
} from "../../types";

/**
 * Card builder for fluent, readable card definitions.
 *
 * Example:
 * ```ts
 * card("ae_example")
 *   .source(AppSource.TERMINAL)
 *   .sender("SYSTEM")
 *   .context("TEST_CONTEXT")
 *   .text("Your scenario text here...")
 *   .prompt("Your choice prompt?")
 *   .realWorld("Incident Name", "2024", "Description...")
 *   .left({
 *     label: "Safe choice",
 *     hype: -10, heat: 5, fine: 0,
 *     violation: "None", lesson: "Safety first.",
 *     roaster: "Boring but safe.",
 *     zenMaster: "The cautious path preserves.",
 *     lovebomber: "Safety MATTERS, bestie!!",
 *   })
 *   .right({
 *     label: "Risky choice",
 *     hype: 30, heat: 15, fine: 5000000,
 *     violation: "Risky Business", lesson: "Risk brings reward...",
 *     deathVector: DeathType.FLED_COUNTRY,
 *     roaster: "Bold move! Probably stupid.",
 *     zenMaster: "The bold leap may find air or stone.",
 *     lovebomber: "YOLO, bestie!!",
 *   })
 *   .build();
 * ```
 */

interface OutcomeConfig {
	label: string;
	hype: number;
	heat: number;
	fine: number;
	violation: string;
	lesson: string;
	deathVector?: DeathType;
	roaster: string;
	zenMaster: string;
	lovebomber: string;
}

class CardBuilder {
	private _id = "";
	private _source = AppSource.EMAIL;
	private _sender = "";
	private _context = "";
	private _text = "";
	private _prompt = "";
	private _rwIncident = "";
	private _rwDate = "";
	private _rwOutcome = "";
	private _rwSourceUrl?: string;
	private _left?: OutcomeConfig;
	private _right?: OutcomeConfig;

	id(value: string): this {
		this._id = value;
		return this;
	}

	source(value: AppSource): this {
		this._source = value;
		return this;
	}

	sender(value: string): this {
		this._sender = value;
		return this;
	}

	context(value: string): this {
		this._context = value;
		return this;
	}

	text(value: string): this {
		this._text = value;
		return this;
	}

	prompt(value: string): this {
		this._prompt = value;
		return this;
	}

	realWorld(
		incident: string,
		date: string,
		outcome: string,
		sourceUrl?: string,
	): this {
		this._rwIncident = incident;
		this._rwDate = date;
		this._rwOutcome = outcome;
		this._rwSourceUrl = sourceUrl;
		return this;
	}

	left(config: OutcomeConfig): this {
		this._left = config;
		return this;
	}

	right(config: OutcomeConfig): this {
		this._right = config;
		return this;
	}

	build(): Card {
		if (!this._left || !this._right) {
			throw new Error(
				`Card ${this._id}: both left and right outcomes required`,
			);
		}

		return {
			id: this._id,
			source: this._source,
			sender: this._sender,
			context: this._context,
			storyContext: this._prompt,
			text: this._text,
			realWorldReference: {
				incident: this._rwIncident,
				date: this._rwDate,
				outcome: this._rwOutcome,
				sourceUrl: this._rwSourceUrl,
			},
			onLeft: this.buildOutcome(this._left),
			onRight: this.buildOutcome(this._right),
		};
	}

	private buildOutcome(config: OutcomeConfig): {
		label: string;
		hype: number;
		heat: number;
		fine: number;
		violation: string;
		lesson: string;
		deathVector?: DeathType;
		feedback: Record<PersonalityType, string>;
	} {
		return {
			label: config.label,
			hype: config.hype,
			heat: config.heat,
			fine: config.fine,
			violation: config.violation,
			lesson: config.lesson,
			deathVector: config.deathVector,
			feedback: makeFeedback(
				config.roaster,
				config.zenMaster,
				config.lovebomber,
			),
		};
	}
}

/**
 * Creates a new card builder for fluent card definition.
 */
export function card(id: string): CardBuilder {
	return new CardBuilder().id(id);
}

/**
 * Shared real-world reference data for common incidents.
 * Use these to maintain consistency across cards.
 */
export const RealWorld = {
	/** 78% Shadow AI Adoption Rate (2024) */
	ShadowAIAdoption: {
		incident: "78% Shadow AI Adoption Rate",
		date: "2024",
		outcome:
			"Study found 78% of workers used unauthorized AI tools. Samsung banned ChatGPT after engineers leaked proprietary code. 90% of enterprise AI use is unauthorized.",
	},

	/** GitHub Copilot RCE (CVE-2025-53773) */
	CopilotRCE: {
		incident: "GitHub Copilot RCE (CVE-2025-53773)",
		date: "2025-01",
		outcome:
			"Microsoft patched Copilot after RCE via prompt injection in code comments. Companies with rapid response avoided exploitation.",
	},

	/** Cursor IDE RCE (CVE-2025-54135) */
	CursorRCE: {
		incident: "Cursor IDE RCE (CVE-2025-54135)",
		date: "2025-01",
		outcome:
			"Prompt injection in Cursor IDE allowed remote code execution. Quick patches failed, required architectural changes.",
	},

	/** 75% Business Model Drift Impact */
	ModelDrift75: {
		incident: "75% Business Model Drift Impact",
		date: "2024",
		outcome:
			"Study found 75% of businesses experienced significant performance decline from undetected model drift, costing average $4.2M per incident.",
	},

	/** Zillow iBuying Model Drift */
	ZillowDrift: {
		incident: "Zillow iBuying Model Drift",
		date: "2021-2022",
		outcome:
			"Zillow's home pricing AI drifted from market conditions. Company wrote down $304M in inventory and laid off 25% of workforce after model failure.",
	},

	/** Apple Card Gender Discrimination */
	AppleCardBias: {
		incident: "Apple Card Gender Discrimination Investigation",
		date: "2019-2020",
		outcome:
			"Apple Card's black-box credit algorithm faced regulatory investigation for gender bias. Company couldn't explain decisions, paid fines, overhauled system.",
	},

	/** EU AI Act Black Box Requirements */
	EuAiAct: {
		incident: "EU AI Act Black Box Requirements",
		date: "2024",
		outcome:
			"EU AI Act effective Aug 2024 requires explainability for high-risk AI systems. Non-compliance fines up to 7% global revenue. Companies face $50M+ retrofit costs.",
	},

	/** NYT vs OpenAI Copyright Lawsuit */
	NytOpenAi: {
		incident: "NYT vs OpenAI Copyright Lawsuit",
		date: "2023-2024",
		outcome:
			"New York Times sued OpenAI for training on copyrighted articles without permission. 70+ similar lawsuits filed by end of 2025.",
	},

	/** GitHub Copilot GPL Litigation */
	CopilotGpl: {
		incident: "GitHub Copilot GPL Litigation",
		date: "2021-2023",
		outcome:
			"Lawsuit alleged Copilot reproduced GPL code without attribution. Courts grappling with AI-generated code copyright status.",
	},

	/** Microsoft 365 Copilot EchoLeak */
	EchoLeak: {
		incident: "Microsoft 365 Copilot EchoLeak",
		date: "2025-06",
		outcome:
			"Memory poisoning attacks on Copilot allowed extraction of sensitive data. Users who disabled memory features avoided exposure but lost personalization.",
	},

	/** 91% ML Model Failure Rate Study */
	ModelFailure91: {
		incident: "91% ML Model Failure Rate Study",
		date: "2024",
		outcome:
			"Research found 91% of deployed ML models fail due to drift. Companies with automated retraining showed 9.3% accuracy improvement vs reactive approaches.",
	},

	/** Assembly Bill 2013 (California) */
	Ab2013: {
		incident: "Assembly Bill 2013 (California)",
		date: "2024",
		outcome:
			"California law requires synthetic data disclosure effective January 1, 2026. Non-compliance carries penalties and public disclosure requirements.",
	},

	/** AutoGPT Uncontrolled Execution */
	AutoGpt: {
		incident: "AutoGPT Uncontrolled Execution",
		date: "2024",
		outcome:
			"Early autonomous AI agents executed unexpected API calls and resource allocations without human oversight, causing infrastructure costs to spiral.",
	},

	/** Multi-Agent Trading System Failure */
	MultiAgentTrading: {
		incident: "Multi-Agent Trading System Failure",
		date: "2023",
		outcome:
			"Uncoordinated trading agents created contradictory orders. Flash crash triggered. $50M+ losses. Central coordination added after investigation.",
	},
} as const;
