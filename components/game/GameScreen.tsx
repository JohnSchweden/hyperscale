import React from 'react';
import { GameState } from '../../types';
import { PERSONALITIES, ROLE_CARDS } from '../../constants';
import LayoutShell from '../LayoutShell';
import { GameHUD } from './GameHUD';
import { CardStack } from './CardStack';
import { RoastTerminal } from './RoastTerminal';
import { Taskbar } from './Taskbar';

interface GameScreenProps {
  state: GameState;
  isFirstCard: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
  // Swipe state
  swipeOffset: number;
  swipeDirection: 'LEFT' | 'RIGHT' | null;
  isDragging: boolean;
  hasDragged: boolean;
  cardExitDirection: 'LEFT' | 'RIGHT' | null;
  exitPosition: { x: number; rotate: number } | null;
  isSnappingBack: boolean;
  // Swipe handlers
  onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  // Roast
  roastInput: string;
  roastOutput: string | null;
  isRoasting: boolean;
  roastOutputRef: React.RefObject<HTMLDivElement>;
  onRoastInputChange: (value: string) => void;
  onRoastSubmit: () => void;
  // Taskbar
  currentTime: string;
  // Config
  swipeThreshold: number;
  swipePreviewThreshold: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  state,
  isFirstCard,
  cardRef,
  swipeOffset,
  swipeDirection,
  isDragging,
  hasDragged,
  cardExitDirection,
  exitPosition,
  isSnappingBack,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onSwipeLeft,
  onSwipeRight,
  roastInput,
  roastOutput,
  isRoasting,
  roastOutputRef,
  onRoastInputChange,
  onRoastSubmit,
  currentTime,
  swipeThreshold,
  swipePreviewThreshold
}) => {
  if (!state.role || !state.personality) return null;

  const personality = PERSONALITIES[state.personality];

  return (
    <LayoutShell className="bg-[#0a0a0c]">
      <GameHUD budget={state.budget} heat={state.heat} hype={state.hype} />

      {/* Main Content */}
      <div className="absolute top-[80px] md:top-[56px] bottom-12 left-0 right-0 overflow-y-auto">
        <div className="flex flex-col items-center p-3 md:p-6 pb-8 md:pb-12 gap-4 md:gap-6 min-h-full">
          {/* Card Stack */}
          <CardStack
            role={state.role}
            currentCardIndex={state.currentCardIndex}
            isFirstCard={isFirstCard}
            cardRef={cardRef}
            offset={swipeOffset}
            direction={swipeDirection}
            isDragging={isDragging}
            exitDirection={cardExitDirection}
            exitPosition={exitPosition}
            isSnappingBack={isSnappingBack}
            hasDragged={hasDragged}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            swipeThreshold={swipeThreshold}
            swipePreviewThreshold={swipePreviewThreshold}
          />

          {/* Roast Terminal */}
          <RoastTerminal
            personality={state.personality}
            input={roastInput}
            output={roastOutput}
            isLoading={isRoasting}
            outputRef={roastOutputRef}
            onInputChange={onRoastInputChange}
            onSubmit={onRoastSubmit}
          />
        </div>
      </div>

      {/* Taskbar */}
      <Taskbar personality={state.personality} currentTime={currentTime} />
    </LayoutShell>
  );
};
