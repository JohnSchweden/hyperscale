import { Analytics } from "@vercel/analytics/react";
import type React from "react";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	BossFight,
	DebriefContainer,
	FeedbackOverlay,
	GameScreen,
	InitializingScreen,
	IntroScreen,
	PersonalitySelect,
	PressureCueController,
	RoleSelect,
	StarfieldBackground,
} from "./components/game";

const WebMCPToolsProvider = import.meta.env.DEV
	? lazy(() =>
			import("./components/dev/WebMCPToolsProvider").then((m) => ({
				default: m.WebMCPToolsProvider,
			})),
		)
	: null;

import { BOSS_FIGHT_QUESTIONS, ROLE_CARDS } from "./data";
import {
	useBackgroundMusic,
	useBossFight,
	useClock,
	useCountdown,
	useDebrief,
	useGameState,
	useIncidentPressure,
	useRoast,
	useStageReady,
	useSwipeGestures,
	useVoicePlayback,
} from "./hooks";
import { shuffleDeck } from "./lib/deck";
import {
	authoringFeedbackStem,
	type PresentationChoiceSlot,
} from "./lib/feedbackAudioChoice";
import { playKirkCrashSound, playKirkGlitchTone } from "./services/kirkAudio";
import {
	getCountdownContext,
	playCountdownBeep,
	playCountdownStart,
	prepareCountdownAudio,
} from "./services/pressureAudio";
import { type Card, DeathType, GameStage, type RoleType } from "./types";
import { triggerHaptic } from "./utils/haptic";

/**
 * BUTTON VARIANT PATTERNS (established design system)
 *
 * Primary CTA (Boot system, Reboot, Log off):
 * - White background, black text
 * - Large padding (px-6 py-3 md:px-12 md:py-4)
 * - Cyan hover state
 * - Used on: Intro, Debrief page 1
 *
 * Card Selection (Personality, Role):
 * - Black/65 + white/10 border + shadow-lg + shared blur (see selectionStageStyles)
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
 * Standard (max-w-4xl): Personality Select, Role Select
 *   - Needs room for 3-column grid at md breakpoint
 *
 * Standard (max-w-4xl / lg:max-w-[43rem]): Game, BossFight
 *   - Game needs specific width for card proportions
 *   - BossFight uses max-w-3xl currently, could standardize to max-w-4xl
 *
 * Narrow (max-w-2xl): Initializing, debrief page 1
 *   - Focused content that doesn't need wide layout
 *
 * Auto (no max-w): Intro
 *   - Intro uses centered text, max-w on content elements instead
 */

const KEY_TO_DIRECTION: Record<string, "LEFT" | "RIGHT"> = {
	ArrowLeft: "LEFT",
	ArrowRight: "RIGHT",
};

type FeedbackOverlayState = {
	text: string;
	lesson: string;
	choice: "LEFT" | "RIGHT";
	/** Authoring label slug for pre-baked feedback audio (accounts for choiceSidesSwapped). */
	feedbackAuthoringStem: string;
	/** Fine delta from this choice */
	fine: number;
	/** Heat delta from this choice */
	heatDelta: number;
	/** Hype delta from this choice */
	hypeDelta: number;
	violation: string;
	cardId: string;
	teamImpact?: string | null;
	realWorldReference?: {
		incident: string;
		date: string;
		outcome: string;
	} | null;
	outcomeLabel?: string;
};

/**
 * Main application component that orchestrates the entire game flow.
 * Manages game state, stage transitions, user interactions, and renders
 * appropriate screens based on the current game stage.
 *
 * Features include:
 * - Game stage management (intro, personality/role selection, gameplay, boss fight, debrief)
 * - Swipe gesture handling for card choices
 * - Feedback overlay system
 * - Background music and sound effects
 * - Pressure/timing mechanics for urgent incidents
 * - Kirk Easter egg functionality
 * - Voice playback system
 * - Roast feature integration
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

	const {
		currentTrackTitle,
		userVolume,
		setUserVolume,
		enabled: bgmEnabled,
		toggleEnabled: toggleBgmEnabled,
		skipNext: skipBgmTrack,
		bgmVolumeMin,
		bgmVolumeMax,
		bgmVolumeStep,
	} = useBackgroundMusic();

	// Debrief hook for 3-page flow navigation and archetype calculation
	const debrief = useDebrief({ state, dispatch });

	// Feedback overlay state (includes optional team-impact from pressure metadata)
	const [feedbackOverlay, setFeedbackOverlay] =
		useState<FeedbackOverlayState | null>(null);

	// Card animation state
	const [isFirstCard, setIsFirstCard] = useState(true);
	const cardRef = useRef<HTMLDivElement>(null);

	// Kirk Easter Egg: game container ref for CSS class manipulation
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const kirkFlickerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	// Prevent duplicate choice handling (user click + timer race)
	const isChoiceLockedRef = useRef(false);

	// Current card for pressure metadata lookup (only when playing; same instance as CardStack)
	const currentCard =
		state.stage === GameStage.PLAYING && state.role
			? (state.effectiveDeck ?? ROLE_CARDS[state.role])[state.currentCardIndex]
			: null;

	// Derived pressure state (countdown, escalation, team-impact)
	const pressure = useIncidentPressure(
		state,
		currentCard ?? null,
		!!feedbackOverlay,
		{
			onCriticalChange: (isCritical) => {
				if (isCritical) triggerHaptic();
			},
		},
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
				feedbackAuthoringStem: authoringFeedbackStem(card, direction),
				fine: outcome.fine,
				heatDelta: outcome.heat,
				hypeDelta: outcome.hype,
				violation: outcome.violation,
				cardId: card.id,
				teamImpact: teamImpact ?? null,
				realWorldReference: card.realWorldReference ?? null,
				outcomeLabel: outcome.label,
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
		onExpire: () => triggerHaptic(),
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
		// Play beep for 3, 2, 1; Start tone at 0
		if (countdown >= 1 && countdown <= 3) {
			playCountdownBeep(countdown as 1 | 2 | 3);
		} else if (countdown === 0) {
			playCountdownStart();
		}
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
			return () => clearTimeout(timer);
		}
		// On transition to PLAYING, compute shuffled deck and pass it to state
		if (state.role) {
			const shuffled = shuffleDeck([...ROLE_CARDS[state.role]]);
			dispatch({
				type: "STAGE_CHANGE",
				stage: GameStage.PLAYING,
				shuffledDeck: shuffled,
			});
		} else {
			dispatch({ type: "STAGE_CHANGE", stage: GameStage.PLAYING });
		}
		setIsFirstCard(true);
	}, [state.stage, state.role, countdown, dispatch]);

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
		feedbackAuthoringStem: feedbackOverlay?.feedbackAuthoringStem ?? null,
		feedbackSelectedSlot: (feedbackOverlay?.choice ??
			null) as PresentationChoiceSlot | null,
		deathType: state.deathType,
	});

	// Handle choice (called by swipe or button click) — final, no undo
	const handleChoice = useCallback(
		(direction: "LEFT" | "RIGHT") => {
			if (!state.role || !state.personality) return;
			if (isChoiceLockedRef.current) return;
			isChoiceLockedRef.current = true;

			// Use effectiveDeck (shuffled) if available, fall back to ROLE_CARDS
			const cards = state.effectiveDeck ?? ROLE_CARDS[state.role];
			const card = cards[state.currentCardIndex];
			applyChoice(direction, card);
		},
		[
			state.role,
			state.personality,
			state.currentCardIndex,
			state.effectiveDeck,
			applyChoice,
		],
	);

	const triggerSwipeHaptic = useCallback(() => {
		if (pressure.isCritical || pressure.isUrgent) triggerHaptic();
	}, [pressure.isCritical, pressure.isUrgent]);

	// Kirk Easter Egg: swipe-up triggers KIRK_REFUSAL with audio/visual effects
	const handleSwipeUp = useCallback(() => {
		if (state.stage !== GameStage.PLAYING) return;
		const currentKirkCounter = state.kirkCounter;
		dispatch({ type: "KIRK_REFUSAL" });
		const ctx = getCountdownContext();
		if (currentKirkCounter === 0) {
			// First refusal: brief flicker + subtle glitch tone
			if (ctx) playKirkGlitchTone(ctx);
			const el = gameContainerRef.current;
			if (el) {
				if (kirkFlickerTimeoutRef.current !== null) {
					clearTimeout(kirkFlickerTimeoutRef.current);
				}
				el.classList.add("kirk-flicker");
				kirkFlickerTimeoutRef.current = setTimeout(() => {
					el.classList.remove("kirk-flicker");
					kirkFlickerTimeoutRef.current = null;
				}, 150);
			}
		} else if (currentKirkCounter === 1) {
			// Second refusal: crash sound + persistent corruption
			if (ctx) playKirkCrashSound(ctx);
			const el = gameContainerRef.current;
			if (el) {
				el.classList.add("kirk-corrupted");
			}
		}
	}, [state.stage, state.kirkCounter, dispatch]);

	const swipe = useSwipeGestures({
		enabled: state.stage === GameStage.PLAYING && !feedbackOverlay,
		onSwipe: handleChoice,
		onBeforeSwipe: triggerSwipeHaptic,
		onSwipeUp: handleSwipeUp,
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
			prepareCountdownAudio(); // resume context while still in user gesture
			selectRole(role);
			setIsFirstCard(true);
		},
		[selectRole],
	);

	// Keyboard navigation for game
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (state.stage !== GameStage.PLAYING || feedbackOverlay) return;
			const direction = KEY_TO_DIRECTION[e.key];
			if (direction) {
				e.preventDefault();
				swipe.swipeProgrammatically(direction);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [state.stage, feedbackOverlay, swipe]);

	// Restart game (full cleanup: state, roast, overlay, swipe)
	const handleRestart = useCallback(() => {
		resetGame();
		resetRoast();
		setFeedbackOverlay(null);
		setIsFirstCard(true);
		swipe.reset();
	}, [resetGame, resetRoast, swipe]);

	// Memoized swipe handlers to avoid recreating on every render
	const handleSwipeLeft = useCallback(() => {
		triggerSwipeHaptic();
		swipe.swipeProgrammatically("LEFT");
	}, [triggerSwipeHaptic, swipe]);

	const handleSwipeRight = useCallback(() => {
		triggerSwipeHaptic();
		swipe.swipeProgrammatically("RIGHT");
	}, [triggerSwipeHaptic, swipe]);

	// Memoized bgm config object to avoid breaking reference equality on every render
	const bgm = useMemo(
		() => ({
			currentTrackTitle,
			bgmVolume: userVolume,
			bgmVolumeMin,
			bgmVolumeMax,
			bgmVolumeStep,
			onBgmVolumeChange: setUserVolume,
			bgmEnabled,
			onBgmToggle: toggleBgmEnabled,
			onBgmSkip: skipBgmTrack,
		}),
		[
			currentTrackTitle,
			userVolume,
			bgmVolumeMin,
			bgmVolumeMax,
			bgmVolumeStep,
			setUserVolume,
			bgmEnabled,
			toggleBgmEnabled,
			skipBgmTrack,
		],
	);

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
							swipeVerticalOffset={swipe.verticalOffset}
							swipeDirection={swipe.direction}
							isDragging={swipe.isDragging}
							cardExitDirection={swipe.exitDirection}
							exitPosition={swipe.exitPosition}
							isSnappingBack={swipe.isSnappingBack}
							isSwipeUp={swipe.isSwipeUp}
							hasDragged={swipe.hasDragged}
							onTouchStart={swipe.onTouchStart}
							onTouchMove={swipe.onTouchMove}
							onTouchEnd={swipe.onTouchEnd}
							onSwipeLeft={handleSwipeLeft}
							onSwipeRight={handleSwipeRight}
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

			case GameStage.BOSS_FIGHT: {
				if (!bossFight.question) return null;
				const lastBossAnswerCorrect =
					state.bossFightAnswers[state.bossFightAnswers.length - 1] ?? false;
				return (
					<BossFight
						question={bossFight.question}
						fixedAnswers={bossFight.fixedAnswers}
						currentQuestion={bossFight.currentQuestion}
						totalQuestions={BOSS_FIGHT_QUESTIONS.length}
						timeLeft={bossFight.timeLeft}
						showExplanation={bossFight.showExplanation}
						hasAnswered={bossFight.hasAnswered}
						isCorrect={lastBossAnswerCorrect}
						correctCount={bossFight.correctCount}
						totalAnswered={bossFight.totalAnswered}
						onAnswer={bossFight.handleAnswer}
						onNext={bossFight.nextQuestion}
					/>
				);
			}

			case GameStage.DEBRIEF_PAGE_1:
			case GameStage.DEBRIEF_PAGE_2:
			case GameStage.DEBRIEF_PAGE_3:
				return (
					<DebriefContainer
						state={state}
						archetype={debrief.archetype}
						archetypeDescription={
							debrief.archetype?.description ?? "No classification available."
						}
						resilienceScore={debrief.resilienceScore}
						onNextPage={debrief.nextPage}
						onRestart={handleRestart}
					/>
				);

			default:
				return <IntroScreen onStart={startGame} />;
		}
	};

	// Kirk Easter Egg: keep kirk-corrupted class persistent through Kirk debrief,
	// remove on RESET (handled by watching stage transitions back to INTRO)
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally tracks kirk corruption state
	useEffect(() => {
		const el = gameContainerRef.current;
		if (!el) return;
		const isKirkPath =
			state.kirkCorruptionActive || state.deathType === DeathType.KIRK;
		if (isKirkPath) {
			el.classList.add("kirk-corrupted");
		} else {
			el.classList.remove("kirk-corrupted");
			el.classList.remove("kirk-flicker");
		}
	}, [state.kirkCorruptionActive, state.deathType, state.stage]);

	const isPlayingStage = state.stage === GameStage.PLAYING;

	return (
		<>
			<Analytics />
			<StarfieldBackground
				flySpeedMenuOnly
				taskbarHostsSpeedBurger={isPlayingStage}
				bgm={bgm}
			>
				<div
					ref={gameContainerRef}
					className="relative z-10 min-h-[100dvh]"
					key={state.stage}
				>
					<div className="stage-transition">{renderStage()}</div>
				</div>
				{isPlayingStage && feedbackOverlay && state.personality && (
					<FeedbackOverlay
						personality={state.personality}
						kirkCorruptionActive={state.kirkCorruptionActive}
						text={feedbackOverlay.text}
						lesson={feedbackOverlay.lesson}
						choice={feedbackOverlay.choice}
						fine={feedbackOverlay.fine}
						heatDelta={feedbackOverlay.heatDelta}
						hypeDelta={feedbackOverlay.hypeDelta}
						violation={feedbackOverlay.violation}
						teamImpact={feedbackOverlay.teamImpact}
						budget={state.budget}
						heat={state.heat}
						hype={state.hype}
						realWorldReference={feedbackOverlay.realWorldReference}
						outcomeLabel={feedbackOverlay.outcomeLabel}
						onNext={handleNextIncident}
					/>
				)}
				{import.meta.env.DEV && WebMCPToolsProvider && (
					<Suspense fallback={null}>
						<WebMCPToolsProvider
							state={state}
							startGame={startGame}
							selectPersonality={selectPersonality}
							handleSelectRole={handleSelectRole}
							swipe={swipe}
							feedbackOverlay={feedbackOverlay}
							handleNextIncident={handleNextIncident}
							bossFight={bossFight}
							handleRestart={handleRestart}
							currentCard={currentCard}
						/>
					</Suspense>
				)}
			</StarfieldBackground>
		</>
	);
};

export default App;
