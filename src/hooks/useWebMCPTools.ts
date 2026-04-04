import { useWebMCP } from "@mcp-b/react-webmcp";
import type { BossQuestion, GameState, RoleType } from "../types";
import { GameStage, type PersonalityType } from "../types";
import type { SwipeState } from "./useSwipeGestures";

type SwipeControls = SwipeState & {
	swipeProgrammatically: (direction: "LEFT" | "RIGHT") => void;
	reset: () => void;
};

type BossFightControls = {
	hasAnswered: boolean;
	showExplanation: boolean;
	handleAnswer: (isCorrect: boolean) => void;
	nextQuestion: () => void;
	fixedAnswers: string[];
	currentQuestion: number;
	question: BossQuestion | undefined;
};

/**
 * Overlay fields used by dev MCP tools (matches App feedback overlay shape).
 */
export type WebMCPFeedbackOverlay = {
	cardId: string;
	choice: "LEFT" | "RIGHT";
	feedbackAuthoringStem: string;
} | null;

/**
 * Dependencies required by the useWebMCPTools hook.
 */
export interface UseWebMCPToolsDeps {
	state: GameState;
	startGame: () => void;
	selectPersonality: (personality: PersonalityType) => void;
	handleSelectRole: (role: RoleType) => void;
	swipe: SwipeControls;
	feedbackOverlay: WebMCPFeedbackOverlay;
	handleNextIncident: () => void;
	bossFight: BossFightControls;
	handleRestart: () => void;
	currentCard: { id: string } | null;
}

const PERSONALITIES = ["ROASTER", "ZEN_MASTER", "LOVEBOMBER"] as const;
const ROLES = [
	"CHIEF_SOMETHING_OFFICER",
	"HEAD_OF_SOMETHING",
	"SOMETHING_MANAGER",
	"TECH_AI_CONSULTANT",
	"DATA_SCIENTIST",
	"SOFTWARE_ARCHITECT",
	"SOFTWARE_ENGINEER",
	"VIBE_CODER",
	"VIBE_ENGINEER",
	"AGENTIC_ENGINEER",
] as const;

/**
 * Custom hook for registering WebMCP tools for game interaction.
 * @param deps - Dependencies and game state handlers
 */
export function useWebMCPTools(deps: UseWebMCPToolsDeps) {
	const {
		state,
		startGame,
		selectPersonality,
		handleSelectRole,
		swipe,
		feedbackOverlay,
		handleNextIncident,
		bossFight,
		handleRestart,
	} = deps;

	useWebMCP(
		{
			name: "get_game_state",
			description:
				"Returns the current game state including stage, stats, role, personality, and card index.",
			inputSchema: { type: "object", properties: {} },
			handler: () => ({
				success: true,
				stage: state.stage,
				hype: state.hype,
				heat: state.heat,
				budget: state.budget,
				role: state.role,
				personality: state.personality,
				currentCardIndex: state.currentCardIndex,
				deathReason: state.deathReason,
				deathType: state.deathType,
				bossFightAnswers: state.bossFightAnswers,
				hasFeedbackOverlay: feedbackOverlay !== null,
				feedbackAuthoringStem: feedbackOverlay?.feedbackAuthoringStem ?? null,
			}),
		},
		[state, feedbackOverlay],
	);

	useWebMCP(
		{
			name: "get_current_screen",
			description:
				"Returns a human-readable description of the current game screen.",
			inputSchema: { type: "object", properties: {} },
			handler: () => {
				const overlayMsg = feedbackOverlay
					? " — feedback overlay is showing (use dismiss_feedback)"
					: "";
				const bossMsg = bossFight.showExplanation
					? " — explanation showing (use advance_boss)"
					: bossFight.hasAnswered
						? " — answered, waiting for next question"
						: " — answer the quiz question";

				const descriptions: Record<GameStage, string> = {
					[GameStage.INTRO]: "Intro screen — click Start to begin",
					[GameStage.PERSONALITY_SELECT]:
						"Personality selection — choose ROASTER, ZEN_MASTER, or LOVEBOMBER",
					[GameStage.ROLE_SELECT]: "Role selection — choose your job role",
					[GameStage.INITIALIZING]:
						"Initializing screen — countdown before gameplay",
					[GameStage.PLAYING]: `Playing — swipe cards left or right${overlayMsg}`,
					[GameStage.BOSS_FIGHT]: `Boss fight${bossMsg}`,
					[GameStage.DEBRIEF_PAGE_1]:
						"Debrief page 1 — outcome summary (win or death), then Debrief me",
					[GameStage.DEBRIEF_PAGE_2]: "Debrief page 2",
					[GameStage.DEBRIEF_PAGE_3]: "Debrief page 3",
				};
				return {
					success: true,
					screen: descriptions[state.stage] ?? `Unknown stage: ${state.stage}`,
					stage: state.stage,
				};
			},
		},
		[
			state.stage,
			feedbackOverlay,
			bossFight.showExplanation,
			bossFight.hasAnswered,
		],
	);

	useWebMCP(
		{
			name: "start_game",
			description: "Starts the game from the intro screen (INTRO stage only).",
			inputSchema: { type: "object", properties: {} },
			handler: () => {
				if (state.stage !== GameStage.INTRO) {
					return {
						success: false,
						error: "Wrong stage",
						currentStage: state.stage,
					};
				}
				startGame();
				return { success: true, movedTo: GameStage.PERSONALITY_SELECT };
			},
		},
		[state.stage, startGame],
	);

	useWebMCP(
		{
			name: "select_personality",
			description:
				"Selects an AI personality during the PERSONALITY_SELECT stage. Valid values: ROASTER, ZEN_MASTER, LOVEBOMBER.",
			inputSchema: {
				type: "object",
				properties: {
					personality: {
						type: "string",
						enum: PERSONALITIES,
						description: "The personality to select",
					},
				},
				required: ["personality"],
			} as const,
			handler: ({ personality }) => {
				if (state.stage !== GameStage.PERSONALITY_SELECT) {
					return {
						success: false,
						error: "Wrong stage",
						currentStage: state.stage,
					};
				}
				selectPersonality(personality as PersonalityType);
				return { success: true, selected: personality };
			},
		},
		[state.stage, selectPersonality],
	);

	useWebMCP(
		{
			name: "select_role",
			description:
				"Selects a job role during the ROLE_SELECT stage. Valid values: " +
				ROLES.join(", "),
			inputSchema: {
				type: "object",
				properties: {
					role: {
						type: "string",
						enum: ROLES,
						description: "The role to select",
					},
				},
				required: ["role"],
			} as const,
			handler: ({ role }) => {
				if (state.stage !== GameStage.ROLE_SELECT) {
					return {
						success: false,
						error: "Wrong stage",
						currentStage: state.stage,
					};
				}
				handleSelectRole(role as RoleType);
				return { success: true, selected: role };
			},
		},
		[state.stage, handleSelectRole],
	);

	useWebMCP(
		{
			name: "swipe_card",
			description:
				"Swipes the current card left or right. Only available during PLAYING stage when no feedback overlay is showing.",
			inputSchema: {
				type: "object",
				properties: {
					direction: {
						type: "string",
						enum: ["LEFT", "RIGHT"],
						description: "Direction to swipe",
					},
				},
				required: ["direction"],
			} as const,
			handler: ({ direction }) => {
				if (state.stage !== GameStage.PLAYING) {
					return {
						success: false,
						error: "Wrong stage",
						currentStage: state.stage,
					};
				}
				if (feedbackOverlay !== null) {
					return {
						success: false,
						error: "Feedback overlay is showing — use dismiss_feedback first",
					};
				}
				swipe.swipeProgrammatically(direction as "LEFT" | "RIGHT");
				return { success: true, direction, cardIndex: state.currentCardIndex };
			},
		},
		[state.stage, state.currentCardIndex, feedbackOverlay, swipe],
	);

	useWebMCP(
		{
			name: "dismiss_feedback",
			description:
				"Dismisses the feedback overlay after swiping a card. Only available when the overlay is showing.",
			inputSchema: { type: "object", properties: {} },
			handler: () => {
				if (feedbackOverlay === null) {
					return {
						success: false,
						error: "No feedback overlay is currently showing",
					};
				}
				handleNextIncident();
				return { success: true };
			},
		},
		[feedbackOverlay, handleNextIncident],
	);

	useWebMCP(
		{
			name: "answer_boss_question",
			description:
				"Answers a boss fight quiz question by answer index (0-3, corresponding to the fixedAnswers array). Call get_game_state first to see the current question and available answers. Only available during BOSS_FIGHT stage when the question has not been answered yet.",
			inputSchema: {
				type: "object",
				properties: {
					answerIndex: {
						type: "number",
						minimum: 0,
						maximum: 3,
						description:
							"Index of the answer to select (0-based from the displayed answers)",
					},
				},
				required: ["answerIndex"],
			} as const,
			handler: ({ answerIndex }) => {
				if (state.stage !== GameStage.BOSS_FIGHT) {
					return {
						success: false,
						error: "Wrong stage",
						currentStage: state.stage,
					};
				}
				if (bossFight.hasAnswered) {
					return {
						success: false,
						error:
							"Already answered — use advance_boss to go to the next question",
					};
				}
				const idx = Math.round(answerIndex);
				if (idx < 0 || idx >= bossFight.fixedAnswers.length) {
					return {
						success: false,
						error: `Invalid answer index ${idx}. Valid range: 0-${bossFight.fixedAnswers.length - 1}`,
					};
				}
				const selectedAnswer = bossFight.fixedAnswers[idx];
				const isCorrect = selectedAnswer === bossFight.question?.correctAnswer;
				bossFight.handleAnswer(isCorrect);
				return {
					success: true,
					selectedAnswer,
					isCorrect,
					correctAnswer: bossFight.question?.correctAnswer,
				};
			},
		},
		[state.stage, bossFight],
	);

	useWebMCP(
		{
			name: "advance_boss",
			description:
				"Advances to the next boss fight question after reading the explanation. Only available when showExplanation is true.",
			inputSchema: { type: "object", properties: {} },
			handler: () => {
				if (state.stage !== GameStage.BOSS_FIGHT) {
					return {
						success: false,
						error: "Wrong stage",
						currentStage: state.stage,
					};
				}
				if (!bossFight.showExplanation) {
					return {
						success: false,
						error: "Explanation is not showing — answer the question first",
					};
				}
				bossFight.nextQuestion();
				return { success: true };
			},
		},
		[state.stage, bossFight.showExplanation, bossFight.nextQuestion],
	);

	useWebMCP(
		{
			name: "restart_game",
			description: "Restarts the game from scratch (always available).",
			inputSchema: { type: "object", properties: {} },
			handler: () => {
				handleRestart();
				return { success: true, movedTo: GameStage.INTRO };
			},
		},
		[handleRestart],
	);
}
