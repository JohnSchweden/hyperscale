import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStage, PersonalityType, RoleType, GameState, AppSource, DeathType } from './types';
import { PERSONALITIES, ROLE_CARDS, DEATH_ENDINGS, BOSS_FIGHT_QUESTIONS } from './constants';
import { speak, getRoast } from './services/geminiService';
import LayoutShell from './components/LayoutShell';

const INITIAL_BUDGET = 10000000;
const SWIPE_THRESHOLD = 100;
const SWIPE_PREVIEW_THRESHOLD = 50;

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    hype: 50,
    heat: 0,
    budget: INITIAL_BUDGET,
    stage: GameStage.INTRO,
    personality: null,
    role: null,
    currentCardIndex: 0,
    history: [],
    deathReason: null,
    deathType: null,
    unlockedEndings: [],
    bossFightAnswers: []
  });

  const [feedbackOverlay, setFeedbackOverlay] = useState<{
    text: string;
    lesson: string;
    choice: 'LEFT' | 'RIGHT';
    fine: number;
    violation: string;
  } | null>(null);

  const [roastInput, setRoastInput] = useState('');
  const [roastOutput, setRoastOutput] = useState<string | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [countdown, setCountdown] = useState(3);
  const [personalitySelectReady, setPersonalitySelectReady] = useState(false);
  const [personalityHoverEnabled, setPersonalityHoverEnabled] = useState(false);
  const personalitySelectReadyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [roleSelectReady, setRoleSelectReady] = useState(false);
  const [roleHoverEnabled, setRoleHoverEnabled] = useState(false);
  const roleSelectReadyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Boss fight state
  const [currentBossQuestion, setCurrentBossQuestion] = useState(0);
  const [bossTimeLeft, setBossTimeLeft] = useState(15);
  const [showBossExplanation, setShowBossExplanation] = useState(false);
  const [bossAnswered, setBossAnswered] = useState(false);

  // Swipe gesture state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'LEFT' | 'RIGHT' | null>(null);
  const [cardExitDirection, setCardExitDirection] = useState<'LEFT' | 'RIGHT' | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [isSnappingBack, setIsSnappingBack] = useState(false);
  const [exitPosition, setExitPosition] = useState<{ x: number; rotate: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(false);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Boss fight timer
  useEffect(() => {
    if (state.stage === GameStage.BOSS_FIGHT && bossTimeLeft > 0 && !bossAnswered && !showBossExplanation) {
      const timer = setTimeout(() => setBossTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (state.stage === GameStage.BOSS_FIGHT && bossTimeLeft === 0 && !bossAnswered) {
      handleBossAnswer(false);
    }
  }, [state.stage, bossTimeLeft, bossAnswered, showBossExplanation]);

  // Initialization Countdown Logic
  useEffect(() => {
    if (state.stage === GameStage.INITIALIZING) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setState(prev => ({ ...prev, stage: GameStage.PLAYING }));
      }
    }
  }, [state.stage, countdown]);

  // Defer personality button interaction + hover so Boot click/tap doesn’t ghost-select or show hover
  useEffect(() => {
    if (state.stage !== GameStage.PERSONALITY_SELECT) {
      setPersonalitySelectReady(false);
      setPersonalityHoverEnabled(false);
      if (personalitySelectReadyTimeout.current) {
        clearTimeout(personalitySelectReadyTimeout.current);
        personalitySelectReadyTimeout.current = null;
      }
      return;
    }
    personalitySelectReadyTimeout.current = setTimeout(() => {
      setPersonalitySelectReady(true);
      personalitySelectReadyTimeout.current = null;
    }, 100);
    return () => {
      if (personalitySelectReadyTimeout.current) {
        clearTimeout(personalitySelectReadyTimeout.current);
        personalitySelectReadyTimeout.current = null;
      }
    };
  }, [state.stage]);

  // Enable hover only after first pointer move so Boot cursor position doesn't show BAMBOO hover
  useEffect(() => {
    if (state.stage !== GameStage.PERSONALITY_SELECT) return;
    const onMove = () => {
      setPersonalityHoverEnabled(true);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onMove, { capture: true });
    };
    window.addEventListener('mousemove', onMove, { once: true });
    window.addEventListener('touchstart', onMove, { capture: true, once: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onMove, { capture: true });
    };
  }, [state.stage]);

  // Block ghost click on role select; enable clicks after short delay
  useEffect(() => {
    if (state.stage !== GameStage.ROLE_SELECT) {
      setRoleSelectReady(false);
      setRoleHoverEnabled(false);
      if (roleSelectReadyTimeout.current) {
        clearTimeout(roleSelectReadyTimeout.current);
        roleSelectReadyTimeout.current = null;
      }
      return;
    }
    roleSelectReadyTimeout.current = setTimeout(() => {
      setRoleSelectReady(true);
      roleSelectReadyTimeout.current = null;
    }, 100);
    return () => {
      if (roleSelectReadyTimeout.current) {
        clearTimeout(roleSelectReadyTimeout.current);
        roleSelectReadyTimeout.current = null;
      }
    };
  }, [state.stage]);

  // Enable role hover only after first pointer move
  useEffect(() => {
    if (state.stage !== GameStage.ROLE_SELECT) return;
    const onMove = () => {
      setRoleHoverEnabled(true);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onMove, { capture: true });
    };
    window.addEventListener('mousemove', onMove, { once: true });
    window.addEventListener('touchstart', onMove, { capture: true, once: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onMove, { capture: true });
    };
  }, [state.stage]);

  // Voice logic for stage transitions
  useEffect(() => {
    if (state.stage === GameStage.ROLE_SELECT && state.personality) {
      speak(PERSONALITIES[state.personality].onboarding, PERSONALITIES[state.personality].voice);
    }
    if (state.stage === GameStage.GAME_OVER && state.personality) {
      speak(PERSONALITIES[state.personality].failure, PERSONALITIES[state.personality].voice);
    }
    if (state.stage === GameStage.SUMMARY && state.personality) {
      speak(PERSONALITIES[state.personality].victory, PERSONALITIES[state.personality].voice);
    }
  }, [state.stage, state.personality]);

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.stage !== GameStage.PLAYING || feedbackOverlay) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipeChoice('LEFT');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipeChoice('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.stage, feedbackOverlay, state.currentCardIndex]);

  // Reset card state when moving to next card
  useEffect(() => {
    setCardExitDirection(null);
    setExitPosition(null);
    setSwipeOffset(0);
    setSwipeDirection(null);
    setHasDragged(false);
    setIsSnappingBack(false);
  }, [state.currentCardIndex]);

  // Touch/Mouse gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (state.stage !== GameStage.PLAYING || feedbackOverlay) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    touchStartX.current = clientX;
    touchStartY.current = clientY;
    isHorizontalSwipe.current = false;
    setIsDragging(true);
    setHasDragged(true);
  }, [state.stage, feedbackOverlay]);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || state.stage !== GameStage.PLAYING || feedbackOverlay) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - touchStartX.current;
    const deltaY = clientY - touchStartY.current;
    
    // Determine if this is a horizontal swipe
    if (!isHorizontalSwipe.current && Math.abs(deltaX) > Math.abs(deltaY)) {
      isHorizontalSwipe.current = true;
    }
    
    if (isHorizontalSwipe.current) {
      e.preventDefault?.();
      setSwipeOffset(deltaX);
      
      // Update preview direction
      if (Math.abs(deltaX) > SWIPE_PREVIEW_THRESHOLD) {
        setSwipeDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        setSwipeDirection(null);
      }
    }
  }, [isDragging, state.stage, feedbackOverlay]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (Math.abs(swipeOffset) > SWIPE_THRESHOLD) {
      // Commit the swipe - animate from current position to exit
      const direction = swipeOffset > 0 ? 'RIGHT' : 'LEFT';
      const targetX = direction === 'RIGHT' ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
      const targetRotate = direction === 'RIGHT' ? 25 : -25;

      // Set exit direction and position for animation
      setCardExitDirection(direction);
      setExitPosition({ x: targetX, rotate: targetRotate });

      // After animation completes, process the choice
      setTimeout(() => {
        handleChoice(direction);
        // Reset for next card
        setCardExitDirection(null);
        setExitPosition(null);
        setSwipeOffset(0);
        setSwipeDirection(null);
        setHasDragged(false);
      }, 350);
    } else {
      // Snap back
      setIsSnappingBack(true);
      setSwipeOffset(0);
      setSwipeDirection(null);
      // Reset snap back flag after animation completes
      setTimeout(() => setIsSnappingBack(false), 600);
    }
  }, [isDragging, swipeOffset]);

  const handleStart = () => {
    setPersonalitySelectReady(false);
    setState(prev => ({ ...prev, stage: GameStage.PERSONALITY_SELECT }));
  };
  const selectPersonality = (p: PersonalityType) => {
    setState(prev => ({ ...prev, personality: p, stage: GameStage.ROLE_SELECT }));
  };
  const selectRole = (r: RoleType) => {
    setCountdown(3);
    setState(prev => ({ ...prev, role: r, stage: GameStage.INITIALIZING, currentCardIndex: 0 }));
  };

  const handleChoice = (direction: 'LEFT' | 'RIGHT') => {
    if (!state.role || !state.personality) return;
    
    const cards = ROLE_CARDS[state.role];
    const currentCard = cards[state.currentCardIndex];
    const outcome = direction === 'RIGHT' ? currentCard.onRight : currentCard.onLeft;
    
    const newHype = Math.max(0, state.hype + outcome.hype);
    const newHeat = Math.min(100, state.heat + outcome.heat);
    const newBudget = state.budget - outcome.fine;

    setFeedbackOverlay({
      text: outcome.feedback[state.personality],
      lesson: outcome.lesson,
      choice: direction,
      fine: outcome.fine,
      violation: outcome.violation
    });

    speak(outcome.feedback[state.personality], PERSONALITIES[state.personality].voice);

    setState(prev => ({
      ...prev,
      hype: newHype,
      heat: newHeat,
      budget: newBudget,
      history: [...prev.history, { cardId: currentCard.id, choice: direction }]
    }));
  };

  const handleSwipeChoice = (direction: 'LEFT' | 'RIGHT') => {
    // If already animating from drag, don't reset
    if (cardExitDirection) return;

    const targetX = direction === 'RIGHT' ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
    const targetRotate = direction === 'RIGHT' ? 25 : -25;

    setCardExitDirection(direction);
    setExitPosition({ x: targetX, rotate: targetRotate });

    // Wait for exit animation then trigger choice
    setTimeout(() => {
      handleChoice(direction);
      // Reset for next card
      setCardExitDirection(null);
      setExitPosition(null);
      setSwipeOffset(0);
      setSwipeDirection(null);
      setHasDragged(false);
    }, 350);
  };

  const determineDeathType = (budget: number, heat: number, hype: number): DeathType => {
    if (budget <= 0) return DeathType.BANKRUPT;
    if (heat >= 100) {
      if (hype <= 10) return DeathType.REPLACED_BY_SCRIPT;
      if (state.role === RoleType.FINANCE) return DeathType.PRISON;
      if (state.role === RoleType.MARKETING) return DeathType.CONGRESS;
      if (state.role === RoleType.MANAGEMENT) return DeathType.AUDIT_FAILURE;
      return DeathType.FLED_COUNTRY;
    }
    return DeathType.AUDIT_FAILURE;
  };

  const nextIncident = () => {
    setFeedbackOverlay(null);
    
    // Check for game over conditions
    if (state.budget <= 0) {
      const deathType = DeathType.BANKRUPT;
      setState(prev => ({
        ...prev,
        stage: GameStage.GAME_OVER,
        deathType,
        deathReason: DEATH_ENDINGS[deathType].description,
        unlockedEndings: prev.unlockedEndings.includes(deathType) ? prev.unlockedEndings : [...prev.unlockedEndings, deathType]
      }));
      return;
    }
    
    if (state.heat >= 100) {
      const deathType = determineDeathType(state.budget, state.heat, state.hype);
      setState(prev => ({
        ...prev,
        stage: GameStage.GAME_OVER,
        deathType,
        deathReason: DEATH_ENDINGS[deathType].description,
        unlockedEndings: prev.unlockedEndings.includes(deathType) ? prev.unlockedEndings : [...prev.unlockedEndings, deathType]
      }));
      return;
    }

    const cards = ROLE_CARDS[state.role!];
    if (state.currentCardIndex + 1 >= cards.length) {
      // Start boss fight instead of going directly to summary
      setCurrentBossQuestion(0);
      setBossTimeLeft(15);
      setBossAnswered(false);
      setShowBossExplanation(false);
      setState(prev => ({ ...prev, stage: GameStage.BOSS_FIGHT }));
    } else {
      setState(prev => ({ ...prev, currentCardIndex: prev.currentCardIndex + 1 }));
    }
  };

  const handleBossAnswer = (isCorrect: boolean) => {
    setBossAnswered(true);
    setShowBossExplanation(true);
    
    setState(prev => ({
      ...prev,
      bossFightAnswers: [...prev.bossFightAnswers, isCorrect]
    }));

    if (!isCorrect) {
      // Wrong answer costs budget
      setState(prev => ({ ...prev, budget: prev.budget - 1000000 }));
    }
  };

  const nextBossQuestion = () => {
    if (currentBossQuestion + 1 >= BOSS_FIGHT_QUESTIONS.length) {
      // Boss fight complete
      const correctAnswers = state.bossFightAnswers.filter(a => a).length;
      if (correctAnswers >= 3) {
        setState(prev => ({ ...prev, stage: GameStage.SUMMARY }));
      } else {
        const deathType = DeathType.AUDIT_FAILURE;
        setState(prev => ({
          ...prev,
          stage: GameStage.GAME_OVER,
          deathType,
          deathReason: DEATH_ENDINGS[deathType].description,
          unlockedEndings: prev.unlockedEndings.includes(deathType) ? prev.unlockedEndings : [...prev.unlockedEndings, deathType]
        }));
      }
    } else {
      setCurrentBossQuestion(prev => prev + 1);
      setBossTimeLeft(15);
      setBossAnswered(false);
      setShowBossExplanation(false);
    }
  };

  const handleRoast = async () => {
    if (!roastInput || !state.personality) return;
    setIsRoasting(true);
    const roast = await getRoast(roastInput, PERSONALITIES[state.personality].name);
    setRoastOutput(roast);
    speak(roast, PERSONALITIES[state.personality].voice);
    setIsRoasting(false);
  };

  const restart = () => {
    setState(prev => ({
      hype: 50,
      heat: 0,
      budget: INITIAL_BUDGET,
      stage: GameStage.INTRO,
      personality: null,
      role: null,
      currentCardIndex: 0,
      history: [],
      deathReason: null,
      deathType: null,
      unlockedEndings: prev.unlockedEndings,
      bossFightAnswers: []
    }));
    setRoastOutput(null);
    setRoastInput('');
    setCurrentBossQuestion(0);
    setBossTimeLeft(15);
    setBossAnswered(false);
    setShowBossExplanation(false);
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatLabel = (s: string) =>
    s === RoleType.HR ? 'HR' : s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const renderIntro = () => (
    <LayoutShell className="p-4 md:p-6 text-center">
      <div className="mb-8 md:mb-12 relative">
        <h1 className="text-6xl md:text-7xl font-bold glitch-text tracking-tighter mb-2">hyperscale</h1>
        <div className="text-red-600 font-bold mono text-xs md:text-sm animate-pulse tracking-[0.4em]">incident_response_terminal // os_v0.92</div>
      </div>
      <p className="max-w-xl text-slate-300 mb-8 md:mb-10 text-base md:text-lg px-4 leading-relaxed">
        <span className="font-bold">Tinder for AI Risk, Governance, and Compliance.</span>
        <br />
        <span className="text-[#B8962E] mono text-sm md:text-base">[NOTICE: Made for people who hate f*cking boring governance training]</span>
      </p>
      <p className="max-w-xl text-slate-300 mb-12 md:mb-16 text-base md:text-lg px-4">
        <span className="text-slate-300 font-bold block mb-2">Project Icarus</span>
        <span className="text-slate-400">The CEO integrated an unhinged AI into every department.</span><br className="hidden md:inline" /><span className="text-slate-300"> Move fast, break laws, and try to survive the final audit. <span className="cursor-blink text-slate-300">_</span></span> 
      </p>
      <div className="w-full flex justify-center">
        <button 
          onClick={handleStart}
          className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 min-h-[40px] md:min-h-[48px] bg-white text-black"
        >
          Boot system
        </button>
      </div>
      <div className="mt-8 md:mt-12 mono text-xs text-red-500 px-4 text-center">WARNING: PREVIOUS COMPLIANCE OFFICER CURRENTLY PENDING LITIGATION</div>
    </LayoutShell>
  );

  const renderPersonalitySelect = () => (
    <LayoutShell className="p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <div className="text-red-600 mb-3 mono text-[10px] md:text-xs tracking-[0.3em]">
            step_01 // chaos_handler
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight fade-in px-4">
            Select your emotional support
          </h2>
          <p className="mt-4 md:mt-6 max-w-xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed px-4">
            Pick the unhinged co-pilot that will narrate your compliance spiral, hype your bad ideas,
            and occasionally try to keep you out of prison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full px-4">
          {Object.entries(PERSONALITIES).map(([type, p], index) => (
            <button
              key={type}
              onClick={() => personalitySelectReady && selectPersonality(type as PersonalityType)}
              className={`group p-6 md:p-10 bg-slate-900/60 border border-slate-800 focus:outline-none flex flex-col shadow-2xl transition-colors w-full text-left ${personalityHoverEnabled ? 'hover:border-cyan-500 hover-scale' : ''}`}
              style={{ animationDelay: `${index * 0.1}s`, pointerEvents: personalitySelectReady ? 'auto' : 'none' }}
            >
              <div className="flex flex-col items-center text-center mb-4 md:mb-6">
                <div className={`text-slate-400 transition-colors mb-2 md:mb-3 ${personalityHoverEnabled ? 'group-hover:text-cyan-500' : ''}`}>
                  <i
                    className={`fa-solid ${
                      type === PersonalityType.ROASTER
                        ? 'fa-user-ninja'
                        : type === PersonalityType.ZEN_MASTER
                        ? 'fa-leaf'
                        : 'fa-rocket'
                    } text-2xl md:text-4xl`}
                    aria-hidden
                  ></i>
                </div>
                <div className="text-xl md:text-2xl font-black">{p.name}</div>
                <div className="text-cyan-400 text-xs font-black tracking-wide">{p.title}</div>
              </div>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed w-full mt-auto text-center">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </LayoutShell>
  );

  const renderRoleSelect = () => (
    <LayoutShell className="p-4 md:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <div className="text-red-600 mb-2 md:mb-3 mono text-[10px] md:text-xs tracking-[0.3em] fade-in px-4">
            step_02 // damage_control
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 tracking-tight fade-in px-4">
            Select your clearance level
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed px-4">
            Choose which part of the company you want to endanger first. Each role changes the kinds of
            incidents, heat you attract, and creative ways to lose that $10M budget.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full px-4">
          {Object.values(RoleType).map((role, index) => (
            <button
              key={role}
              onClick={() => roleSelectReady && selectRole(role)}
              className={`group p-6 md:p-8 bg-slate-900/60 border border-slate-800 transition-all text-center shadow-2xl ${roleHoverEnabled ? 'hover:border-cyan-500 hover-scale' : ''}`}
              style={{ animationDelay: `${index * 0.08}s`, pointerEvents: roleSelectReady ? 'auto' : 'none' }}
            >
              <div className={`text-3xl md:text-4xl mb-3 md:mb-4 text-slate-400 transition-colors ${roleHoverEnabled ? 'group-hover:text-cyan-400' : ''}`}>
                <i
                  className={`fa-solid ${
                    role === RoleType.DEVELOPMENT
                      ? 'fa-code'
                      : role === RoleType.MARKETING
                      ? 'fa-bullhorn'
                      : role === RoleType.MANAGEMENT
                      ? 'fa-briefcase'
                      : role === RoleType.HR
                      ? 'fa-users'
                      : role === RoleType.FINANCE
                      ? 'fa-vault'
                      : 'fa-broom'
                  }`}
                  aria-hidden
                ></i>
              </div>
              <div className={`font-black text-xs md:text-sm tracking-wide text-slate-300 transition-colors ${roleHoverEnabled ? 'group-hover:text-white' : ''}`}>
                {formatLabel(role)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </LayoutShell>
  );

  const renderInitializing = () => (
    <LayoutShell className="p-4 md:p-6 bg-black text-cyan-500 font-mono">
      <div className="w-full max-w-xl p-4 md:p-8 border border-cyan-900/50 bg-slate-900/20 rounded-lg shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500/20 overflow-hidden">
          <div className="h-full bg-cyan-500 animate-[progress-shine_2s_infinite]" style={{ width: `${(3 - countdown) * 33.3}%` }}></div>
        </div>
        <div className="mb-4 text-[10px] tracking-[0.2em] opacity-50 flex justify-between">
          <span>System initializing</span>
          <span className="hidden sm:inline">{PERSONALITIES[state.personality!].name}_secure_link</span>
        </div>
        <div className="space-y-2 mb-8 md:mb-12">
          <div className="text-xs">{'>'} Calibrating governance models... done</div>
          <div className="text-xs">{'>'} Syncing {state.role && formatLabel(state.role)} clearance... done</div>
          <div className="text-xs">{'>'} Bypassing ethical safeguards... <span className="text-red-500">warning</span></div>
          <div className="text-xs">{'>'} Loading $10M compliance budget... done</div>
          <div className="text-xs">{'>'} Finalizing neural interface...</div>
        </div>
        <div className="flex flex-col items-center py-6 md:py-10">
          <div className="text-4xl md:text-6xl font-black tracking-tighter animate-pulse drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            {countdown > 0 ? countdown : 'Start'}
          </div>
          <div className="mt-4 md:mt-6 text-[10px] font-black tracking-[0.3em] text-slate-400 text-center">
            Commencing Q4 survival protocol
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-8 text-[8px] tracking-wide opacity-30 text-center max-w-xs px-4">
        HyperScale Inc. is not liable for data breaches, federal lawsuits, or spontaneous AI consciousness.
      </div>
    </LayoutShell>
  );

  const renderGame = () => {
    const cards = ROLE_CARDS[state.role!];
    const currentCard = cards[state.currentCardIndex];
    const personality = PERSONALITIES[state.personality!];

    return (
      <LayoutShell className="bg-[#0a0a0c] overflow-hidden">
        {/* Top HUD - Budget Focused - Mobile Optimized */}
        <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3 md:px-4 flex flex-col md:flex-row gap-2 md:gap-6 items-stretch md:items-center z-10">
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex justify-between text-[10px] font-black tracking-wide mb-1">
              <span className={`${state.budget < 2000000 ? 'text-red-500 animate-pulse' : 'text-green-400'} inline-flex items-center gap-1.5`}><i className="fa-solid fa-coins text-[10px]" aria-hidden></i>Budget</span>
              <span className={state.budget < 2000000 ? 'text-red-500' : 'text-green-400'}>{formatBudget(state.budget)}</span>
            </div>
            <div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
              <div 
                className={`h-full progress-bar ${state.budget < 2000000 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min(100, (state.budget / INITIAL_BUDGET) * 100)}%` }} 
              />
            </div>
          </div>
          <div className="flex gap-3 md:gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-28 space-y-1">
              <div className="flex justify-between text-[10px] font-black tracking-wide mb-1">
                <span className={`${state.heat > 80 ? 'text-yellow-400 animate-pulse' : 'text-orange-500'} inline-flex items-center gap-1.5`}><i className="fa-solid fa-fire text-[10px]" aria-hidden></i>Risk</span>
                <span className="text-orange-500">{state.heat}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
                <div className={`h-full progress-bar ${state.heat > 80 ? 'bg-yellow-400' : 'bg-orange-600'}`} style={{ width: `${state.heat}%` }} />
              </div>
            </div>
            <div className="flex-1 md:w-28 space-y-1">
              <div className="flex justify-between text-[10px] font-black tracking-wide mb-1">
                <span className={`${state.hype < 20 ? 'text-red-500 animate-pulse' : 'text-cyan-400'} inline-flex items-center gap-1.5`}><i className="fa-solid fa-chart-line text-[10px]" aria-hidden></i>Hype</span>
                <span className="text-cyan-400">{state.hype}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
                <div className={`h-full progress-bar ${state.hype < 20 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${state.hype}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex-1 flex flex-col items-center justify-center pt-8 md:pt-12 p-3 pb-14 md:p-8 md:pb-4 gap-4 md:gap-8">
          
          {/* Card Stack Container */}
          <div className="relative flex-1 w-full max-w-full lg:max-w-[43rem] min-h-[360px] md:min-h-[480px] self-stretch">
            {/* Next card (behind) - render only if there's a next card */}
            {state.currentCardIndex + 1 < cards.length && (
              <div 
                className="absolute inset-0 bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col"
                style={{
                  zIndex: 0,
                  transform: 'scale(0.95)',
                  opacity: 0.6,
                }}
              >
                {/* Simplified next card content - just header and basic structure */}
                <div className="bg-slate-800 px-3 md:px-4 py-2 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-2 text-[10px] mono font-bold text-slate-400 truncate">
                    <i className={`fa-solid ${cards[state.currentCardIndex + 1].source === AppSource.IDE ? 'fa-terminal' : 'fa-hashtag'}`} aria-hidden></i>
                    <span className="truncate">{cards[state.currentCardIndex + 1].source} // {cards[state.currentCardIndex + 1].context}</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  </div>
                </div>
                <div className="p-4 md:p-10 flex flex-col justify-center items-center flex-1">
                  <div className="text-slate-600 text-sm mono">Next incident loading...</div>
                </div>
              </div>
            )}

            {/* Current card (front) */}
            <div
              ref={cardRef}
              className={`absolute inset-0 bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col select-none ${swipeOffset === 0 && !isDragging && !hasDragged ? 'ticket-transition' : ''} ${isSnappingBack ? 'spring-snap-back' : ''}`}
              key={state.currentCardIndex}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              style={{
                zIndex: 10,
                transform: cardExitDirection && exitPosition
                  ? `translateX(${exitPosition.x}px) rotate(${exitPosition.rotate}deg)`
                  : `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)`,
                transition: isDragging
                  ? 'none'
                  : cardExitDirection
                    ? 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: isDragging ? 'grabbing' : 'grab',
                opacity: cardExitDirection ? 0 : 1,
              }}
            >
              {/* Dynamic Swipe Preview - Text only, shown on opposite side */}
              {swipeDirection && (
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    opacity: Math.min(1, 0.3 + (Math.abs(swipeOffset) - SWIPE_PREVIEW_THRESHOLD) / SWIPE_THRESHOLD * 0.7),
                  }}
                >
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${swipeDirection === 'RIGHT' ? 'left-8' : 'right-8'} font-black tracking-tighter ${swipeDirection === 'RIGHT' ? 'text-green-500' : 'text-red-500'}`}
                    style={{
                      fontSize: swipeDirection === 'RIGHT'
                        ? `clamp(1.5rem, ${2 + (Math.abs(swipeOffset) - SWIPE_PREVIEW_THRESHOLD) / SWIPE_THRESHOLD * 2}rem, 3.75rem)`
                        : `clamp(1.5rem, ${2 + (Math.abs(swipeOffset) - SWIPE_PREVIEW_THRESHOLD) / SWIPE_THRESHOLD * 2}rem, 3.75rem)`,
                      transform: `scale(${0.5 + Math.min(0.5, (Math.abs(swipeOffset) - SWIPE_PREVIEW_THRESHOLD) / SWIPE_THRESHOLD * 0.5)})`,
                    }}
                  >
                    {swipeDirection === 'RIGHT' ? currentCard.onRight.label.toUpperCase() : currentCard.onLeft.label.toUpperCase()}
                  </div>
                </div>
              )}

            <div className="bg-slate-800 px-3 md:px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] mono font-bold text-slate-400 truncate">
                <i className={`fa-solid ${currentCard.source === AppSource.IDE ? 'fa-terminal' : 'fa-hashtag'}`} aria-hidden></i>
                <span className="truncate">{currentCard.source} // {currentCard.context}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              </div>
            </div>
            <div className="p-4 md:p-10 flex flex-col justify-between flex-1 overflow-hidden">
              <div className="space-y-3 md:space-y-6 overflow-y-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
                     <i className="fa-solid fa-user-robot text-slate-400 text-xs md:text-base" aria-hidden></i>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-bold text-cyan-400 truncate">{currentCard.sender}</div>
                    <div className="text-[9px] md:text-[10px] text-slate-400 mono truncate">Incident #{(state.currentCardIndex + 1) * 324}</div>
                  </div>
                </div>
                <p className="text-base md:text-xl font-medium leading-relaxed text-slate-200">
                  "{currentCard.text}"
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-6 md:mt-8 shrink-0">
                {/* Keyboard hint for desktop */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mono">
                  <span className="hidden md:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">←</span>
                  <span className="hidden md:inline">Use arrow keys or swipe</span>
                  <span className="hidden md:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">→</span>
                  
                  {/* Mobile swipe hint */}
                  <span className="flex md:hidden items-center justify-center gap-3">
                    <span className="text-red-500 font-bold">← Swipe left</span>
                    <span className="text-slate-600">or</span>
                    <span className="text-green-500 font-bold">Swipe right →</span>
                  </span>
                </div>

                <div className="flex flex-row gap-3 md:gap-4">
                   <button onClick={() => handleSwipeChoice('LEFT')} className={`flex-1 py-2 px-3 md:py-4 md:px-4 text-sm md:text-base border font-bold tracking-wide transition-all min-h-[40px] md:min-h-[48px] ${swipeDirection === 'LEFT' ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white text-white bg-transparent hover:bg-cyan-500 hover:border-cyan-500 hover:text-black active:bg-cyan-500 active:border-cyan-500 active:text-black'}`}>
                     {currentCard.onLeft.label}
                   </button>
                   <button onClick={() => handleSwipeChoice('RIGHT')} className={`flex-1 py-2 px-3 md:py-4 md:px-4 text-sm md:text-base border font-black tracking-wide transition-all min-h-[40px] md:min-h-[48px] ${swipeDirection === 'RIGHT' ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white text-white bg-transparent hover:bg-cyan-500 hover:border-cyan-500 hover:text-black active:bg-cyan-500 active:border-cyan-500 active:text-black'}`}>
                     {currentCard.onRight.label}
                   </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Side Roaster Terminal - Below incident */}
          <div className="w-full max-w-[43rem] lg:w-[43rem] h-auto lg:h-[260px] bg-black/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl mb-12">
            <div className="bg-slate-900 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] mono font-bold text-green-500">roast_con.exe</span>
              <i className="fa-solid fa-minus text-[10px] text-slate-400" aria-hidden></i>
            </div>
            <div className="p-3 md:p-4 flex-1 flex flex-col">
              <p className="text-[10px] mono text-green-700 mb-4 hidden sm:block">Describe workflow for governance review...</p>
              <textarea 
                value={roastInput}
                onChange={(e) => setRoastInput(e.target.value)}
                placeholder="e.g. I use ChatGPT for company secrets..."
                aria-label="Describe workflow for governance review"
                className="w-full h-14 lg:h-24 bg-black border border-green-900/30 rounded p-3 text-xs mono text-green-500 focus:outline-none placeholder:text-green-900/50 resize-none mb-3"
              />
              <button 
                onClick={handleRoast}
                disabled={isRoasting}
                className="w-fit px-8 py-2.5 bg-green-900/20 border border-green-500/40 text-green-500 font-bold text-[10px] mono tracking-wide hover:bg-green-500 hover:text-black transition-all mb-3 min-h-[44px] self-center"
              >
                {isRoasting ? 'Scanning...' : 'Init roast'}
              </button>
              {roastOutput && (
                <div className="bg-green-900/10 border border-green-500/20 p-3 rounded text-[10px] mono text-green-400 italic overflow-auto max-h-24">
                   <div className="mb-2 text-green-600 font-bold tracking-wide">{'>>>'} {personality.name}:</div>
                   {roastOutput}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Taskbar - Mobile Optimized */}
        <div className="h-12 bg-slate-900/95 border-t border-white/5 flex items-center px-3 md:px-6 justify-between fixed bottom-0 w-full backdrop-blur-md safe-area-bottom z-20">
          <div className="flex items-center gap-2 md:gap-6">
             <button className="bg-slate-800 hover:bg-slate-700 px-3 md:px-4 py-2 flex items-center gap-2 border border-white/5 transition-colors min-h-[44px]">
               <i className="fa-solid fa-atom text-cyan-400" aria-hidden></i>
               <span className="text-xs font-black tracking-wide hidden sm:inline">Start</span>
             </button>
             <div className="flex gap-2 md:gap-4">
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                 <i className="fa-solid fa-comment-dots text-xs text-cyan-400" aria-hidden></i>
               </div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-white/5 opacity-50 hidden sm:flex">
                 <i className="fa-solid fa-terminal text-xs text-slate-400" aria-hidden></i>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="bg-black/50 px-2 md:px-3 py-1.5 rounded border border-white/5 flex items-center gap-2 md:gap-3">
               <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                 <i className={`fa-solid ${state.personality === PersonalityType.ROASTER ? 'fa-user-ninja' : state.personality === PersonalityType.ZEN_MASTER ? 'fa-leaf' : 'fa-rocket'} text-[10px] text-cyan-500`} aria-hidden></i>
               </div>
               <span className="text-[10px] mono font-bold text-slate-400 tracking-tighter hidden md:inline">{personality.name}</span>
            </div>
            <div className="text-right">
              <div className="text-xs mono font-bold text-slate-300">{currentTime}</div>
              <div className="text-[8px] mono text-slate-400 tracking-wide hidden sm:block">v0.92-prod</div>
            </div>
          </div>
        </div>
      </LayoutShell>
    );
  };

  const renderBossFight = () => {
    const question = BOSS_FIGHT_QUESTIONS[currentBossQuestion];
    const fixedAnswers = [question.correctAnswer, ...question.wrongAnswers];

    return (
      <LayoutShell className="p-4 md:p-8 bg-[#0a0a0c]">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6 md:mb-8">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">
              <i className="fa-solid fa-gavel text-yellow-500" aria-hidden></i>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tight text-yellow-500">Boss fight</h2>
            <p className="text-slate-400 text-sm md:text-base">Negotiate with the External Auditor</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 md:p-8 shadow-2xl">
            {/* Timer Bar */}
            <div className="mb-4 md:mb-6">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Time remaining</span>
                <span className={bossTimeLeft < 5 ? 'text-red-500' : ''}>{bossTimeLeft}s</span>
              </div>
              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${bossTimeLeft < 5 ? 'bg-red-500' : 'bg-yellow-500'}`}
                  style={{ width: `${(bossTimeLeft / 15) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6 md:mb-8">
              <div className="text-xs text-cyan-400 tracking-wide mb-3 md:mb-4">
                Question {currentBossQuestion + 1} of {BOSS_FIGHT_QUESTIONS.length}
              </div>
              <p className="text-base md:text-xl font-medium text-slate-200 leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Answers */}
            {!showBossExplanation ? (
              <div className="space-y-2 md:space-y-3">
                {fixedAnswers.map((answer, index) => {
                  const isCorrect = answer === question.correctAnswer;
                  return (
                    <button
                      key={index}
                      onClick={() => handleBossAnswer(isCorrect)}
                      disabled={bossAnswered}
                      className="w-full p-3 md:p-4 bg-slate-800 border border-slate-700 text-left hover:bg-slate-700 hover:border-cyan-500 transition-all flex items-center gap-4 min-h-[48px]"
                    >
                      <div className="flex-1">
                        <span className="text-cyan-400 font-mono mr-2">{String.fromCharCode(65 + index)}.</span>
                        <span className="text-slate-300 text-sm md:text-base">{answer}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-3 md:p-4 rounded-lg ${state.bossFightAnswers[state.bossFightAnswers.length - 1] ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                  <div className={`text-sm font-bold mb-2 ${state.bossFightAnswers[state.bossFightAnswers.length - 1] ? 'text-green-400' : 'text-red-400'}`}>
                    {state.bossFightAnswers[state.bossFightAnswers.length - 1] ? 'Correct!' : 'Incorrect'}
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm">{question.explanation}</p>
                </div>
                <div className="text-center pt-3">
                  <button
                    onClick={nextBossQuestion}
                    className="w-auto px-8 py-2.5 text-sm md:text-base bg-white text-black font-black tracking-wide hover:bg-cyan-500 transition-all shadow-xl transform active:scale-95"
                  >
                    {currentBossQuestion + 1 >= BOSS_FIGHT_QUESTIONS.length ? 'Final result' : 'Next question'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Score */}
          <div className="mt-4 md:mt-6 text-center">
            <div className="text-xs text-slate-400 tracking-wide mb-2">Correct answers</div>
            <div className="text-xl md:text-2xl font-black text-cyan-400">
              {state.bossFightAnswers.filter(a => a).length} / {state.bossFightAnswers.length}
            </div>
          </div>
        </div>
      </LayoutShell>
    );
  };

  const renderGameOver = () => {
    const deathEnding = state.deathType ? DEATH_ENDINGS[state.deathType] : null;
    
    return (
      <LayoutShell className="p-4 md:p-6 text-center bg-[#1a0505]">
        <div className="w-full max-w-2xl">
        {deathEnding && (
          <>
            <div className={`text-6xl md:text-9xl mb-4 md:mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] ${deathEnding.color}`}>
              <i className={`fa-solid ${deathEnding.icon}`} aria-hidden></i>
            </div>
            <h2 className={`text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter ${deathEnding.color}`}>
              {deathEnding.title}
            </h2>
            <p className="max-w-xl text-base md:text-xl mb-6 md:mb-8 text-slate-400 leading-relaxed px-4 mx-auto">
              {deathEnding.description}
            </p>
          </>
        )}

        <div className="mb-3 md:mb-4 p-3 md:p-4 rounded-lg">
          <div className="text-red-400 text-xs font-bold tracking-wide mb-1">Final budget</div>
          <div className="text-2xl md:text-3xl font-black text-red-500">{formatBudget(state.budget)}</div>
        </div>

        {/* Collection Progress */}
        <div className="mb-6 md:mb-8 p-4 md:p-6 rounded-xl">
          <div className="text-xs text-slate-400 tracking-wide mb-3 md:mb-4">Ending collection</div>
          <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
            {Object.values(DeathType).map((type) => (
              <div 
                key={type}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
                  state.unlockedEndings.includes(type) 
                    ? 'bg-cyan-500/20 border border-cyan-500' 
                    : 'bg-slate-800 border border-slate-700 opacity-30'
                }`}
                title={DEATH_ENDINGS[type].title}
              >
                <i className={`fa-solid ${DEATH_ENDINGS[type].icon} ${state.unlockedEndings.includes(type) ? 'text-cyan-400' : 'text-slate-600'}`} aria-hidden></i>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-400">
            {state.unlockedEndings.length} / {Object.keys(DeathType).length} unlocked
          </div>
        </div>

        <button onClick={restart} className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 min-h-[40px] md:min-h-[48px]">
          Reboot system
        </button>
        </div>
      </LayoutShell>
    );
  };

  const renderSummary = () => (
    <LayoutShell className="p-4 md:p-6 text-center bg-[#051a0d]">
      <div className="w-full max-w-2xl">
       <div className="text-6xl md:text-9xl text-green-500 mb-6 md:mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">
        <i className="fa-solid fa-trophy" aria-hidden></i>
      </div>
      <h2 className="text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter text-green-400">Quarter survived</h2>
      <p className="max-w-xl text-base md:text-xl mb-6 md:mb-8 text-slate-400 px-4 mx-auto">Against all odds, the company is still legal. You've earned a voucher for a synthetic coffee.</p>
      
      <div className="mb-6 md:mb-8 p-4 md:p-6 bg-green-900/20 border border-green-500/30 rounded-xl">
        <div className="text-green-400 text-xs font-bold tracking-wide mb-1">Remaining budget</div>
        <div className="text-3xl md:text-4xl font-black text-green-500">{formatBudget(state.budget)}</div>
      </div>

      {/* Collection Progress */}
      <div className="mb-6 md:mb-8 p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
        <div className="text-xs text-slate-400 tracking-wide mb-3 md:mb-4">Ending collection</div>
        <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
            {Object.values(DeathType).map((type) => (
              <div 
                key={type}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
                  state.unlockedEndings.includes(type) 
                    ? 'bg-cyan-500/20 border border-cyan-500' 
                    : 'bg-slate-800 border border-slate-700 opacity-30'
                }`}
                title={DEATH_ENDINGS[type].title}
              >
              <i className={`fa-solid ${DEATH_ENDINGS[type].icon} ${state.unlockedEndings.includes(type) ? 'text-cyan-400' : 'text-slate-600'}`} aria-hidden></i>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-400">
          {state.unlockedEndings.length} / {Object.keys(DeathType).length} unlocked
        </div>
      </div>

      <button onClick={restart} className="px-6 py-3 md:px-16 md:py-5 text-base md:text-2xl font-black tracking-wide bg-green-600 text-white hover:bg-white hover:text-green-600 transition-all shadow-xl min-h-[40px] md:min-h-[48px]">
        Log off
      </button>
      </div>
    </LayoutShell>
  );

  const renderStage = () => {
    switch (state.stage) {
      case GameStage.INTRO: return renderIntro();
      case GameStage.PERSONALITY_SELECT: return renderPersonalitySelect();
      case GameStage.ROLE_SELECT: return renderRoleSelect();
      case GameStage.INITIALIZING: return renderInitializing();
      case GameStage.PLAYING: return renderGame();
      case GameStage.BOSS_FIGHT: return renderBossFight();
      case GameStage.GAME_OVER: return renderGameOver();
      case GameStage.SUMMARY: return renderSummary();
      default: return renderIntro();
    }
  };

  return (
    <>
      <div className="min-h-[100dvh] stage-transition" key={state.stage}>
        {renderStage()}
      </div>
      {state.stage === GameStage.PLAYING && feedbackOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm modal-overlay" role="dialog" aria-modal="true" aria-labelledby="feedback-overlay-title" aria-describedby="feedback-overlay-desc">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 p-6 md:p-10 rounded-2xl text-center shadow-2xl max-h-[90vh] overflow-y-auto modal-content">
            <h2 id="feedback-overlay-title" className="sr-only">Governance feedback</h2>
            <div className={`text-4xl md:text-6xl mb-4 md:mb-6 ${feedbackOverlay.fine > 0 ? 'text-red-500' : 'text-green-500'}`}>
              <i className={`fa-solid ${feedbackOverlay.fine > 0 ? 'fa-triangle-exclamation' : 'fa-circle-check'}`} aria-hidden></i>
            </div>
            
            {feedbackOverlay.fine > 0 && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="text-red-400 text-xs font-bold tracking-wide mb-1">Violation fine</div>
                <div className="text-2xl md:text-3xl font-black text-red-500">-{formatBudget(feedbackOverlay.fine)}</div>
                <div className="text-red-400/70 text-xs mt-1">{feedbackOverlay.violation}</div>
              </div>
            )}
            
            <div className="text-cyan-400 mono text-[10px] mb-3 md:mb-4 font-bold tracking-wide">{PERSONALITIES[state.personality!].name}'s review</div>
            <p className="text-lg md:text-2xl mb-4 md:mb-8 italic text-slate-100 font-light leading-relaxed">"{feedbackOverlay.text}"</p>
            
            <div id="feedback-overlay-desc" className="bg-black/50 border border-white/5 p-4 md:p-6 rounded-xl text-left mb-4 md:mb-8 min-h-[4.5rem]">
              <div className="text-[10px] font-bold text-slate-400 tracking-wide mb-3 border-b border-white/5 pb-2">Governance alert</div>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">{feedbackOverlay.lesson}</p>
            </div>

            <button 
              onClick={nextIncident}
              className="w-auto px-8 py-2.5 text-sm md:text-base bg-white text-black font-black tracking-wide hover:bg-cyan-500 transition-all shadow-xl transform active:scale-95"
            >
              Next ticket
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;