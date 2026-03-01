import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStage, PersonalityType, RoleType } from './types';
import { ROLE_CARDS, BOSS_FIGHT_QUESTIONS } from './data';
import {
  useGameState,
  useSwipeGestures,
  useVoicePlayback,
  useRoast,
  useBossFight,
  useStageReady,
  useCountdown,
  useClock
} from './hooks';
import {
  IntroScreen,
  PersonalitySelect,
  RoleSelect,
  InitializingScreen,
  GameScreen,
  BossFight,
  GameOver,
  SummaryScreen,
  FeedbackOverlay
} from './components/game';

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
    resetGame
  } = useGameState();

  // Feedback overlay state
  const [feedbackOverlay, setFeedbackOverlay] = useState<{
    text: string;
    lesson: string;
    choice: 'LEFT' | 'RIGHT';
    fine: number;
    violation: string;
    cardId: string;
  } | null>(null);

  // Card animation state
  const [isFirstCard, setIsFirstCard] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // Roast feature
  const {
    input: roastInput,
    setInput: setRoastInput,
    output: roastOutput,
    outputRef: roastOutputRef,
    isLoading: isRoasting,
    handleRoast,
    reset: resetRoast
  } = useRoast(state.personality);

  // Clock
  const currentTime = useClock();

  // Stage ready states (prevent ghost clicks)
  const personalityReady = useStageReady({
    stage: state.stage,
    targetStage: GameStage.PERSONALITY_SELECT
  });

  const roleReady = useStageReady({
    stage: state.stage,
    targetStage: GameStage.ROLE_SELECT
  });

  // Countdown for initializing screen
  const [countdown, setCountdown] = useState(3);

  // Handle countdown timer
  useEffect(() => {
    if (state.stage === GameStage.INITIALIZING) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Countdown finished, move to playing
        dispatch({ type: 'STAGE_CHANGE', stage: GameStage.PLAYING });
        setIsFirstCard(true);
      }
    } else if (state.stage !== GameStage.INITIALIZING) {
      // Reset countdown when leaving initializing stage
      setCountdown(3);
    }
  }, [state.stage, countdown]);

  // Boss fight hook
  const bossFight = useBossFight({
    isActive: state.stage === GameStage.BOSS_FIGHT,
    onAnswer: answerBossQuestion,
    onComplete: completeBossFight,
    currentAnswers: state.bossFightAnswers
  });

  // Voice playback
  useVoicePlayback({
    stage: state.stage,
    personality: state.personality,
    feedbackCardId: feedbackOverlay?.cardId,
    feedbackChoice: feedbackOverlay?.choice
  });

  // Swipe gestures
  const swipe = useSwipeGestures({
    enabled: state.stage === GameStage.PLAYING && !feedbackOverlay,
    onSwipe: useCallback((direction: 'LEFT' | 'RIGHT') => {
      handleChoice(direction);
    }, [state.currentCardIndex, state.role, state.personality])
  });

  // Handle choice (called by swipe or button click)
  const handleChoice = useCallback((direction: 'LEFT' | 'RIGHT') => {
    if (!state.role || !state.personality) return;

    const cards = ROLE_CARDS[state.role];
    const currentCard = cards[state.currentCardIndex];
    const outcome = direction === 'RIGHT' ? currentCard.onRight : currentCard.onLeft;

    setFeedbackOverlay({
      text: outcome.feedback[state.personality],
      lesson: outcome.lesson,
      choice: direction,
      fine: outcome.fine,
      violation: outcome.violation,
      cardId: currentCard.id
    });

    makeChoice(direction, {
      hype: outcome.hype,
      heat: outcome.heat,
      fine: outcome.fine,
      cardId: currentCard.id
    });
  }, [state.currentCardIndex, state.role, state.personality, makeChoice]);

  // Handle next incident (dismiss feedback and move to next card)
  const handleNextIncident = useCallback(() => {
    setFeedbackOverlay(null);
    swipe.reset();
    setIsFirstCard(false);
    nextIncident();
  }, [nextIncident, swipe]);

  // Handle role selection with countdown reset
  const handleSelectRole = useCallback((role: RoleType) => {
    selectRole(role);
    setIsFirstCard(true);
  }, [selectRole]);

  // Keyboard navigation for game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.stage !== GameStage.PLAYING || feedbackOverlay) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        swipe.swipeProgrammatically('LEFT');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        swipe.swipeProgrammatically('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
            onSwipeLeft={() => swipe.swipeProgrammatically('LEFT')}
            onSwipeRight={() => swipe.swipeProgrammatically('RIGHT')}
            roastInput={roastInput}
            roastOutput={roastOutput}
            isRoasting={isRoasting}
            roastOutputRef={roastOutputRef}
            onRoastInputChange={setRoastInput}
            onRoastSubmit={handleRoast}
            currentTime={currentTime}
            swipeThreshold={swipe.SWIPE_THRESHOLD}
            swipePreviewThreshold={swipe.SWIPE_PREVIEW_THRESHOLD}
          />
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
            isCorrect={state.bossFightAnswers[state.bossFightAnswers.length - 1] || false}
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
        <div className="stage-transition">
          {renderStage()}
        </div>
      </div>
      {state.stage === GameStage.PLAYING && feedbackOverlay && state.personality && (
        <FeedbackOverlay
          personality={state.personality}
          text={feedbackOverlay.text}
          lesson={feedbackOverlay.lesson}
          choice={feedbackOverlay.choice}
          fine={feedbackOverlay.fine}
          violation={feedbackOverlay.violation}
          onNext={handleNextIncident}
        />
      )}
    </>
  );
};

export default App;
