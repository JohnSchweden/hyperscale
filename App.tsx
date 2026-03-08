import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	BossFight,
	FeedbackOverlay,
	GameOver,
	GameScreen,
	InitializingScreen,
	IntroScreen,
	PersonalitySelect,
	PressureCueController,
	RoleSelect,
	SummaryScreen,
} from "./components/game";
import { BOSS_FIGHT_QUESTIONS, ROLE_CARDS } from "./data";
import {
	useBossFight,
	useClock,
	useCountdown,
	useGameState,
	useIncidentPressure,
	useRoast,
	useStageReady,
	useSwipeGestures,
	useVoicePlayback,
} from "./hooks";
import { type Card, GameStage, type RoleType } from "./types";
import { triggerHaptic } from "./utils/haptic";

/**
 * BUTTON VARIANT PATTERNS (established design system)
 *
 * Primary CTA (Boot system, Reboot, Log off):
 * - White background, black text
 * - Large padding (px-6 py-3 md:px-12 md:py-4)
 * - Cyan hover state
 * - Used on: Intro, GameOver, Summary
 *
 * Card Selection (Personality, Role):
 * - Slate-900/60 background
 * - Slate-800 border
 * - Cyan border on hover
 * - Large padding (p-6 md:p-8/10)
 * - Used on: PersonalitySelect, RoleSelect
 *
 * Action Button (Swipe choices):
 * - Transparent background
 * - White border
 * - White text
 * - Cyan hover state
 * - Used on: Game screen swipe buttons
 */

/**
 * CONTAINER WIDTH STRATEGY
 *
 * Wide (max-w-5xl): Personality Select
 *   - Needs room for 3-column grid at md breakpoint
 *
 * Standard (max-w-4xl / lg:max-w-[43rem]): Game, BossFight
 *   - Game needs specific width for card proportions
 *   - BossFight uses max-w-3xl currently, could standardize to max-w-4xl
 *
 * Narrow (max-w-2xl): Initializing, GameOver, Summary
 *   - Focused content that doesn't need wide layout
 *
 * Auto (no max-w): Intro, Role Select
 *   - Intro uses centered text, max-w on content elements instead
 *   - Role Select uses 2-3 column grid, width adapts naturally
 */

const App: React.FC = () => {
	// Game state
	const {
		state,
		dispatch,
		startGame,
		selectPersonality,
		selectRole,
		makeChoice,
		nextIncident,
		answerBossQuestion,
		completeBossFight,
		resetGame,
	} = useGameState();

	// Feedback overlay state (includes optional team-impact from pressure metadata)
	const [feedbackOverlay, setFeedbackOverlay] = useState<{
		text: string;
		lesson: string;
		choice: "LEFT" | "RIGHT";
		fine: number;
		violation: string;
		cardId: string;
		teamImpact?: string | null;
	} | null>(null);

	// Card animation state
	const [isFirstCard, setIsFirstCard] = useState(true);
	const cardRef = useRef<HTMLDivElement>(null);

	// Prevent duplicate choice handling (user click + timer race)
	const isChoiceLockedRef = useRef(false);

	// Current card for pressure metadata lookup (only when playing)
	const currentCard =
		state.stage === GameStage.PLAYING && state.role && state.personality
			? ROLE_CARDS[state.role][state.currentCardIndex]
			: null;

	// Derived pressure state (countdown, escalation, team-impact)
	const pressure = useIncidentPressure(
		state,
		currentCard ?? null,
		!!feedbackOverlay,
	);

	// Apply choice and feedback overlay; used by both timer expiry and user swipe/click
	const applyChoice = useCallback(
		(direction: "LEFT" | "RIGHT", card: Card) => {
			if (!state.personality) return;
			const outcome = direction === "RIGHT" ? card.onRight : card.onLeft;
			const teamImpact = pressure.getTeamImpact(direction);

			setFeedbackOverlay({
				text: outcome.feedback[state.personality],
				lesson: outcome.lesson,
				choice: direction,
				fine: outcome.fine,
				violation: outcome.violation,
				cardId: card.id,
				teamImpact: teamImpact ?? null,
			});

			makeChoice(direction, {
				hype: outcome.hype,
				heat: outcome.heat,
				fine: outcome.fine,
				cardId: card.id,
			});
		},
		[state.personality, pressure.getTeamImpact, makeChoice],
	);

	// Urgent incident countdown — expiry resolves to timeout outcome, no undo
	const handleTimerExpiry = useCallback(() => {
		if (
			!state.role ||
			!state.personality ||
			!currentCard ||
			!pressure.timeoutResolvesTo
		)
			return;
		if (isChoiceLockedRef.current) return;
		isChoiceLockedRef.current = true;

		triggerHaptic();

		const direction = pressure.timeoutResolvesTo;
		applyChoice(direction, currentCard);
	}, [
		state.role,
		state.personality,
		currentCard,
		pressure.timeoutResolvesTo,
		applyChoice,
	]);

	const incidentCountdown = useCountdown({
		startFrom: pressure.countdownSec,
		onComplete: handleTimerExpiry,
		isActive: pressure.isUrgent,
	});

	// Reset countdown when transitioning to a new card
	const currentCardId = currentCard?.id;
	useEffect(() => {
		if (currentCardId && !feedbackOverlay) {
			incidentCountdown.reset();
		}
	}, [currentCardId, feedbackOverlay, incidentCountdown.reset]);

	// Roast feature
	const {
		input: roastInput,
		setInput: setRoastInput,
		output: roastOutput,
		outputRef: roastOutputRef,
		isLoading: isRoasting,
		handleRoast,
		reset: resetRoast,
	} = useRoast(state.personality);

	// Clock
	const currentTime = useClock();

	// Scroll to top on stage change (fixes mobile: second page showing scrolled-down)
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-run on stage change
	useEffect(() => {
		window.scrollTo(0, 0);
		document.documentElement.scrollTo(0, 0);
	}, [state.stage]);

	// Stage ready states (prevent ghost clicks)
	const personalityReady = useStageReady({
		stage: state.stage,
		targetStage: GameStage.PERSONALITY_SELECT,
	});

	const roleReady = useStageReady({
		stage: state.stage,
		targetStage: GameStage.ROLE_SELECT,
	});

	// Countdown for initializing screen
	const [countdown, setCountdown] = useState(3);

	// Handle countdown timer
	useEffect(() => {
		if (state.stage !== GameStage.INITIALIZING) {
			setCountdown(3);
			return;
		}
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
			return () => clearTimeout(timer);
		}
		dispatch({ type: "STAGE_CHANGE", stage: GameStage.PLAYING });
		setIsFirstCard(true);
	}, [state.stage, countdown, dispatch]);

	// Boss fight hook
	const bossFight = useBossFight({
		isActive: state.stage === GameStage.BOSS_FIGHT,
		onAnswer: answerBossQuestion,
		onComplete: completeBossFight,
		currentAnswers: state.bossFightAnswers,
	});

	// Voice playback
	useVoicePlayback({
		stage: state.stage,
		personality: state.personality,
		feedbackCardId: feedbackOverlay?.cardId,
		feedbackChoice: feedbackOverlay?.choice,
	});

	// Handle choice (called by swipe or button click) — final, no undo
	const handleChoice = useCallback(
		(direction: "LEFT" | "RIGHT") => {
			if (!state.role || !state.personality) return;
			if (isChoiceLockedRef.current) return;
			isChoiceLockedRef.current = true;

			const card = ROLE_CARDS[state.role][state.currentCardIndex];
			applyChoice(direction, card);
		},
		[state.role, state.personality, state.currentCardIndex, applyChoice],
	);

	const swipe = useSwipeGestures({
		enabled: state.stage === GameStage.PLAYING && !feedbackOverlay,
		onSwipe: handleChoice,
	});

	// Handle next incident (dismiss feedback and move to next card)
	const handleNextIncident = useCallback(() => {
		isChoiceLockedRef.current = false;
		setFeedbackOverlay(null);
		swipe.reset();
		setIsFirstCard(false);
		nextIncident();
	}, [nextIncident, swipe]);

	// Handle role selection with countdown reset
	const handleSelectRole = useCallback(
		(role: RoleType) => {
			selectRole(role);
			setIsFirstCard(true);
		},
		[selectRole],
	);

	// Keyboard navigation for game
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (state.stage !== GameStage.PLAYING || feedbackOverlay) return;

			if (e.key === "ArrowLeft") {
				e.preventDefault();
				swipe.swipeProgrammatically("LEFT");
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				swipe.swipeProgrammatically("RIGHT");
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [state.stage, feedbackOverlay, swipe]);

	// Restart game
	const handleRestart = useCallback(() => {
		resetGame();
		resetRoast();
		setFeedbackOverlay(null);
		setIsFirstCard(true);
		swipe.reset();
	}, [resetGame, resetRoast, swipe]);

	// Render current stage
	const renderStage = () => {
		switch (state.stage) {
			case GameStage.INTRO:
				return <IntroScreen onStart={startGame} />;

			case GameStage.PERSONALITY_SELECT:
				return (
					<PersonalitySelect
						isReady={personalityReady.isReady}
						hoverEnabled={personalityReady.hoverEnabled}
						onSelect={selectPersonality}
					/>
				);

			case GameStage.ROLE_SELECT:
				return (
					<RoleSelect
						isReady={roleReady.isReady}
						hoverEnabled={roleReady.hoverEnabled}
						onSelect={handleSelectRole}
					/>
				);

			case GameStage.INITIALIZING:
				return (
					<InitializingScreen
						role={state.role}
						personality={state.personality}
						countdown={countdown}
					/>
				);

			case GameStage.PLAYING:
				if (!state.role || !state.personality) return null;
				return (
					<>
						<GameScreen
							state={state}
							isFirstCard={isFirstCard}
							cardRef={cardRef}
							swipeOffset={swipe.offset}
							swipeDirection={swipe.direction}
							isDragging={swipe.isDragging}
							cardExitDirection={swipe.exitDirection}
							exitPosition={swipe.exitPosition}
							isSnappingBack={swipe.isSnappingBack}
							hasDragged={swipe.hasDragged}
							onTouchStart={swipe.onTouchStart}
							onTouchMove={swipe.onTouchMove}
							onTouchEnd={swipe.onTouchEnd}
							onSwipeLeft={() => {
								if (pressure.isCritical || pressure.isUrgent) triggerHaptic();
								swipe.swipeProgrammatically("LEFT");
							}}
							onSwipeRight={() => {
								if (pressure.isCritical || pressure.isUrgent) triggerHaptic();
								swipe.swipeProgrammatically("RIGHT");
							}}
							roastInput={roastInput}
							roastOutput={roastOutput}
							isRoasting={isRoasting}
							roastOutputRef={roastOutputRef}
							onRoastInputChange={setRoastInput}
							onRoastSubmit={handleRoast}
							currentTime={currentTime}
							swipeThreshold={swipe.SWIPE_THRESHOLD}
							swipePreviewThreshold={swipe.SWIPE_PREVIEW_THRESHOLD}
							countdownValue={incidentCountdown.count}
							isCountdownActive={pressure.isUrgent}
							isCritical={pressure.isCritical}
						/>
						<PressureCueController
							{...pressure}
							countdownValue={incidentCountdown.count}
							isCountdownActive={pressure.isUrgent}
						/>
					</>
				);

			case GameStage.BOSS_FIGHT:
				if (!bossFight.question) return null;
				return (
					<BossFight
						question={bossFight.question}
						fixedAnswers={bossFight.fixedAnswers}
						currentQuestion={bossFight.currentQuestion}
						totalQuestions={BOSS_FIGHT_QUESTIONS.length}
						timeLeft={bossFight.timeLeft}
						showExplanation={bossFight.showExplanation}
						hasAnswered={bossFight.hasAnswered}
						isCorrect={
							state.bossFightAnswers[state.bossFightAnswers.length - 1] || false
						}
						correctCount={bossFight.correctCount}
						totalAnswered={bossFight.totalAnswered}
						onAnswer={bossFight.handleAnswer}
						onNext={bossFight.nextQuestion}
					/>
				);

			case GameStage.GAME_OVER:
				return <GameOver state={state} onRestart={handleRestart} />;

			case GameStage.SUMMARY:
				return <SummaryScreen state={state} onRestart={handleRestart} />;

			default:
				return <IntroScreen onStart={startGame} />;
		}
	};

	return (
		<>
			<div className="min-h-[100dvh]" key={state.stage}>
				<div className="stage-transition">{renderStage()}</div>
			</div>
			{state.stage === GameStage.PLAYING &&
				feedbackOverlay &&
				state.personality && (
					<FeedbackOverlay
						personality={state.personality}
						text={feedbackOverlay.text}
						lesson={feedbackOverlay.lesson}
						choice={feedbackOverlay.choice}
						fine={feedbackOverlay.fine}
						violation={feedbackOverlay.violation}
						teamImpact={feedbackOverlay.teamImpact}
						budget={state.budget}
						heat={state.heat}
						onNext={handleNextIncident}
					/>
				)}
		</>
	);
};

export default App;
