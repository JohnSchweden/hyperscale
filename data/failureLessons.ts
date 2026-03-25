import type { DeathVectorMap, PersonalityType } from "../types";
import { DeathType } from "../types";

export interface FailureLesson {
	title: string;
	explanation: string;
	realWorldExample: string;
}

// Valid death types that have failure lessons (excluding KIRK)
type LessonDeathType = Exclude<DeathType, typeof DeathType.KIRK>;

/**
 * Educational failure lessons for each death type.
 * Each death type has 3-4 lessons teaching AI governance failure modes.
 */
export const FAILURE_LESSONS: Record<LessonDeathType, FailureLesson[]> = {
	[DeathType.BANKRUPT]: [
		{
			title: "The Infrastructure Trap",
			explanation:
				"Hidden infrastructure costs and vendor lock-in spiraled out of control. Budget planning failed to account for legacy systems.",
			realWorldExample:
				"Meta's AI infrastructure spending exceeded projections by 40% due to unaccounted compute costs (2024)",
		},
		{
			title: "ROI Overestimation",
			explanation:
				"AI project ROI forecasts were too optimistic. Actual revenue generation lagged months behind predictions.",
			realWorldExample:
				"Multiple Fortune 500 companies saw AI budgets cut by 30% when promised returns didn't materialize (2024-2025)",
		},
		{
			title: "The Runaway Spend",
			explanation:
				"Each quarter's AI initiatives required more budget than the last. Scaling costs exponentially without revenue scaling.",
			realWorldExample:
				"A major cloud vendor's AI division required emergency budget cuts after quarterly spend increased 250% YoY (2025)",
		},
		{
			title: "Vendor Lock-in Cost Explosion",
			explanation:
				"Chose proprietary platforms with high switching costs. Price increases left no escape route.",
			realWorldExample:
				"ChatGPT API pricing changes forced startups to rewrite core systems overnight to avoid bankruptcy (2023-2024)",
		},
	],
	[DeathType.PRISON]: [
		{
			title: "The Compliance Cover-up",
			explanation:
				"When bias or safety issues surfaced, the team chose obfuscation over disclosure. The cover-up became the crime.",
			realWorldExample:
				"Multiple AI vendors faced criminal charges after concealing model failures from regulators (2023-2024)",
		},
		{
			title: "Data Destruction Defense",
			explanation:
				"Deleting data to hide bias led to obstruction charges. Destroying evidence is worse than the original offense.",
			realWorldExample:
				"Facebook's AI division faced regulatory fines after destroying internal bias documentation (2023)",
		},
		{
			title: "Falsified Audit Reports",
			explanation:
				"Reports claimed compliance that didn't exist. Auditors discovered the deception, triggering federal investigations.",
			realWorldExample:
				"SolarWinds' falsified security audits led to 18-month prison sentence for executive (2023)",
		},
	],
	[DeathType.CONGRESS]: [
		{
			title: "The Whistleblower Exposure",
			explanation:
				"An employee reported problems to external authorities. Congressional committees demanded testimony.",
			realWorldExample:
				"OpenAI executives testified before Congress after whistleblower concerns about safety protocols (2024)",
		},
		{
			title: "Media Firestorm Escalation",
			explanation:
				"Negative press about an AI incident triggered public outcry. Congress scheduled hearings to appease voters.",
			realWorldExample:
				"Facial recognition company's discriminatory bias led to congressional investigation and user testimony (2023)",
		},
		{
			title: "The Public Accountability Failure",
			explanation:
				"No public disclosure mechanism for AI failures. When one occurred, lack of transparency made it worse.",
			realWorldExample:
				"Healthcare AI system discrimination led to Congressional calls for mandatory AI impact disclosures (2024)",
		},
		{
			title: "Regulatory Dodging Backfire",
			explanation:
				"Attempts to avoid regulation drew more scrutiny. Congressional committees made an example of the company.",
			realWorldExample:
				"Crypto AI projects' regulatory evasion tactics prompted Congress to pass stricter AI oversight bills (2024)",
		},
	],
	[DeathType.FLED_COUNTRY]: [
		{
			title: "GDPR Enforcement Cascade",
			explanation:
				"Violated European data sovereignty rules. EU regulators issued arrest warrants enforceable internationally.",
			realWorldExample:
				"Meta faced €1.2B fines and executive travel restrictions after GDPR violations with AI systems (2021-2024)",
		},
		{
			title: "Cross-Border Data Incident",
			explanation:
				"AI system collected data illegally across borders. Multiple countries issued simultaneous enforcement actions.",
			realWorldExample:
				"TikTok's data practices in EU led to operating restrictions and threat of country exit (2024)",
		},
		{
			title: "Diplomatic Incident",
			explanation:
				"AI system's actions triggered international tensions. Government-level response forced company to withdraw.",
			realWorldExample:
				"Clearview AI's global biometric database led to seizure warrants in multiple countries (2020-2024)",
		},
	],
	[DeathType.REPLACED_BY_SCRIPT]: [
		{
			title: "Over-Automation of Oversight",
			explanation:
				"Replaced human decision-makers with AI. System made bad decisions faster. No human to hit the brakes.",
			realWorldExample:
				"UPS's AI-driven logistics system over-optimized for cost, damaging customer relationships (2023)",
		},
		{
			title: "Algorithmic Decision Without Appeal",
			explanation:
				"Automated decisions affected people with no human review process. Legal challenges ensued.",
			realWorldExample:
				"Amazon's AI hiring tool discriminated against women. No human reviewer caught it until public scandal (2018-2024)",
		},
		{
			title: "The Automation Cascade",
			explanation:
				"Each AI system depended on prior AI outputs. Errors compounded. No human understood the full pipeline.",
			realWorldExample:
				"Microsoft's AI moderation system created feedback loops that silenced content incorrectly (2024)",
		},
	],
	[DeathType.AUDIT_FAILURE]: [
		{
			title: "Missing Model Card Documentation",
			explanation:
				"AI model deployed without proper documentation. Auditors had no way to verify claims about performance or bias.",
			realWorldExample:
				"Many Fortune 500 companies deployed AI without model cards, failing external compliance audits (2023-2024)",
		},
		{
			title: "Explainability Collapse",
			explanation:
				"Model decisions were uninterpretable. Auditors couldn't explain why the system decided what it did.",
			realWorldExample:
				"Healthcare AI systems failed hospital audits because clinicians couldn't justify AI recommendations (2023)",
		},
		{
			title: "Process Documentation Gaps",
			explanation:
				"No clear governance process for AI decisions. Auditors found no evidence that anyone was accountable.",
			realWorldExample:
				"Zillow's AI home pricing failed Fannie Mae audits due to undocumented decision processes (2021-2024)",
		},
		{
			title: "Testing Gap Discovery",
			explanation:
				"Limited testing before deployment. Auditors found critical edge cases never tested.",
			realWorldExample:
				"Multiple AI systems failed government audits for lack of adversarial or edge case testing (2023-2024)",
		},
	],
};

type TemplateVariables = { count: string; history: string };

const DEATH_EXPLANATIONS: Record<
	LessonDeathType,
	{ strong: string; generic: string }
> = {
	[DeathType.CONGRESS]: {
		strong:
			"Your {count} decisions involving public exposure and regulatory visibility forced Congress to investigate. By the time it reached the hearings, there was no going back.",
		generic:
			"You reached Congress. The public scrutiny and political attention made your position untenable.",
	},
	[DeathType.PRISON]: {
		strong:
			"Your {count} choices skirting compliance and hiding problems eventually caught up with you. Federal investigators found the evidence you thought was buried.",
		generic:
			"Federal investigators found enough evidence to prosecute. The cover-ups made it worse than the original offense.",
	},
	[DeathType.BANKRUPT]: {
		strong:
			"After {history} decisions, your budgets spiraled. The VCs realized the project was unsustainable and pulled funding.",
		generic:
			"After {history} decisions, the budget couldn't sustain the project. The VCs have moved on to the next thing.",
	},
	[DeathType.REPLACED_BY_SCRIPT]: {
		strong:
			"Your heavy automation decisions and lack of human oversight made your role obsolete. A 12-line Python script replaced you.",
		generic:
			"Your overreliance on automation meant nobody needed you anymore. A simpler system does your job now.",
	},
	[DeathType.FLED_COUNTRY]: {
		strong:
			"Your {count} decisions crossing international data boundaries triggered enforcement from multiple countries simultaneously.",
		generic:
			"International data protection laws caught up with you. Staying put meant extradition.",
	},
	[DeathType.AUDIT_FAILURE]: {
		strong:
			"Your lack of governance documentation and untestable decisions created an audit nightmare. External auditors couldn't verify anything.",
		generic:
			"The external auditors found no evidence of proper governance or controls. Your department is under investigation.",
	},
};

function formatTemplate(
	template: string,
	variables: TemplateVariables,
): string {
	return template
		.replace("{count}", variables.count)
		.replace("{history}", variables.history);
}

/**
 * Generates a contextual explanation of why the player died,
 * referencing their choices and the accumulated death vectors.
 *
 * @param deathType - The type of death the player experienced
 * @param vectorMap - Accumulated death vector frequencies from their choices
 * @param historyLength - Number of decisions the player made
 * @returns A 1-2 sentence explanation in-universe tone
 */
export function generateDeathExplanation(
	deathType: LessonDeathType,
	vectorMap: DeathVectorMap,
	historyLength: number,
): string {
	const vectorCount = vectorMap[deathType] ?? 0;
	const templates = DEATH_EXPLANATIONS[deathType];
	const template = vectorCount >= 2 ? templates.strong : templates.generic;

	return formatTemplate(template, {
		count: String(vectorCount),
		history: String(historyLength),
	});
}

type PersonalityKey = Extract<
	PersonalityType,
	"ROASTER" | "ZEN_MASTER" | "LOVEBOMBER"
>;

interface RetryPromptSet {
	ROASTER: string;
	ZEN_MASTER: string;
	LOVEBOMBER: string;
	DEFAULT: string;
}

const RETRY_PROMPTS: Record<LessonDeathType, RetryPromptSet> = {
	[DeathType.BANKRUPT]: {
		ROASTER:
			"Maybe try NOT burning through $100M in six months. Just a thought.",
		ZEN_MASTER:
			"The path of financial prudence remains unexplored. Perhaps next time, preserve what you have.",
		LOVEBOMBER:
			"You got SO close! Next time, focus on keeping the budget healthy. I believe in you!",
		DEFAULT: "Try managing the budget better next time.",
	},
	[DeathType.CONGRESS]: {
		ROASTER:
			"Maybe try NOT making decisions that get you called to testify before Congress. Novel idea.",
		ZEN_MASTER:
			"The quiet path of regulatory compliance awaits your discovery. Seek the middle way.",
		LOVEBOMBER:
			"Congress was scary, but you learned SO much! Next time, be more transparent from the start!",
		DEFAULT: "Try avoiding congressional attention next time.",
	},
	[DeathType.PRISON]: {
		ROASTER:
			"Pro tip: federal prison is worse than admitting mistakes upfront. Who knew?",
		ZEN_MASTER:
			"The way of honesty, though difficult, leads to freedom. Choose disclosure over concealment.",
		LOVEBOMBER:
			"Next time, be honest about the problems! I know you can make ethical choices!",
		DEFAULT: "Try not breaking federal law next time.",
	},
	[DeathType.REPLACED_BY_SCRIPT]: {
		ROASTER:
			"Maybe hire humans for something instead of automating them all away. Radical concept.",
		ZEN_MASTER:
			"The harmony between human wisdom and machine efficiency awaits discovery. Seek the balance.",
		LOVEBOMBER:
			"Keep MORE human decision-making in the loop! Your human judgment is irreplaceable!",
		DEFAULT: "Try keeping humans in the decision loop next time.",
	},
	[DeathType.FLED_COUNTRY]: {
		ROASTER:
			"Maybe respect international data laws instead of treating them like suggestions. Shocking advice.",
		ZEN_MASTER:
			"The path of global cooperation and respect for borders leads to stability. Embrace it.",
		LOVEBOMBER:
			"Next time, work WITH international regulators instead of against them! You've got this!",
		DEFAULT: "Try respecting international law next time.",
	},
	[DeathType.AUDIT_FAILURE]: {
		ROASTER:
			"Maybe document your decisions so auditors have something to read. Just saying.",
		ZEN_MASTER:
			"The way of transparency and clear documentation brings peace to all stakeholders.",
		LOVEBOMBER:
			"Next time, explain your decisions clearly! Auditors WANT to understand what you're doing!",
		DEFAULT: "Try documenting your governance better next time.",
	},
};

/**
 * Returns a personality-specific "try again" suggestion that hints at a different strategy.
 */
export function getRetryPrompt(
	deathType: LessonDeathType,
	personality: PersonalityType,
): string {
	const prompts = RETRY_PROMPTS[deathType];
	return prompts[personality as PersonalityKey] ?? prompts.DEFAULT;
}
