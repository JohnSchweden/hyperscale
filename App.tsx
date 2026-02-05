
import React, { useState, useEffect, useRef } from 'react';
import { GameStage, PersonalityType, RoleType, GameState, Card, AppSource } from './types';
import { PERSONALITIES, ROLE_CARDS } from './constants';
import { speak, getRoast } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    hype: 50,
    heat: 0,
    stage: GameStage.INTRO,
    personality: null,
    role: null,
    currentCardIndex: 0,
    history: [],
    deathReason: null
  });

  const [feedbackOverlay, setFeedbackOverlay] = useState<{
    text: string;
    lesson: string;
    choice: 'LEFT' | 'RIGHT';
  } | null>(null);

  const [roastInput, setRoastInput] = useState('');
  const [roastOutput, setRoastOutput] = useState<string | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [countdown, setCountdown] = useState(3);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

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

  const handleStart = () => setState(prev => ({ ...prev, stage: GameStage.PERSONALITY_SELECT }));
  const selectPersonality = (p: PersonalityType) => setState(prev => ({ ...prev, personality: p, stage: GameStage.ROLE_SELECT }));
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

    setFeedbackOverlay({
      text: outcome.feedback[state.personality],
      lesson: outcome.lesson,
      choice: direction
    });

    speak(outcome.feedback[state.personality], PERSONALITIES[state.personality].voice);

    setState(prev => ({
      ...prev,
      hype: newHype,
      heat: newHeat,
      history: [...prev.history, { cardId: currentCard.id, choice: direction }]
    }));
  };

  const nextIncident = () => {
    setFeedbackOverlay(null);
    if (state.heat >= 100) {
      setState(prev => ({ ...prev, stage: GameStage.GAME_OVER, deathReason: 'The auditors found your search history. Federal raid in progress.' }));
      return;
    }
    if (state.hype <= 0) {
      setState(prev => ({ ...prev, stage: GameStage.GAME_OVER, deathReason: 'The VCs pulled out. Your keycard is now invalid.' }));
      return;
    }

    const cards = ROLE_CARDS[state.role!];
    if (state.currentCardIndex + 1 >= cards.length) {
      setState(prev => ({ ...prev, stage: GameStage.SUMMARY }));
    } else {
      setState(prev => ({ ...prev, currentCardIndex: prev.currentCardIndex + 1 }));
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
    setState({
      hype: 50,
      heat: 0,
      stage: GameStage.INTRO,
      personality: null,
      role: null,
      currentCardIndex: 0,
      history: [],
      deathReason: null
    });
    setRoastOutput(null);
    setRoastInput('');
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-black">
      <div className="mb-12 relative">
        <div className="text-8xl font-black italic tracking-tighter mb-2 glitch-text">HYPERSCALE</div>
        <div className="text-red-600 font-bold mono text-sm animate-pulse tracking-[0.4em]">PROJECT_ICARUS // OS_v0.92</div>
      </div>
      <p className="max-w-xl text-slate-500 mb-16 text-lg">
        Move fast, break laws, and try not to get the CEO arrested.<br/>
        AI Governance for people who hate compliance training.
      </p>
      <button 
        onClick={handleStart}
        className="px-16 py-5 bg-white text-black font-black text-2xl uppercase tracking-[0.2em] hover:bg-cyan-500 transition-all shadow-[0_0_30_px_rgba(255,255,255,0.2)]"
      >
        BOOT SYSTEM
      </button>
    </div>
  );

  const renderPersonalitySelect = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#050505]">
      <h2 className="text-4xl font-black mb-16 uppercase tracking-widest text-center italic">SELECT YOUR EMOTIONAL SUPPORT SYSTEM</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {Object.entries(PERSONALITIES).map(([type, p]) => (
          <button 
            key={type}
            onClick={() => selectPersonality(type as PersonalityType)}
            className="group p-10 bg-slate-900/50 border border-slate-800 hover:border-cyan-500 transition-all duration-500 flex flex-col items-center text-center rounded-2xl hover:-translate-y-2 shadow-xl"
          >
            <div className="w-24 h-24 bg-slate-800 rounded-full mb-8 flex items-center justify-center group-hover:bg-cyan-500 transition-colors shadow-inner">
               <i className={`fa-solid ${type === PersonalityType.ROASTER ? 'fa-user-ninja' : type === PersonalityType.ZEN_MASTER ? 'fa-leaf' : 'fa-rocket'} text-4xl group-hover:text-black`}></i>
            </div>
            <div className="text-2xl font-black mb-1">{p.name}</div>
            <div className="text-cyan-400 text-xs mb-6 uppercase font-black tracking-widest">{p.title}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderRoleSelect = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#050505]">
       <div className="text-cyan-400 mb-6 mono text-xs flex items-center gap-2 tracking-widest">
        <i className="fa-solid fa-circle-nodes animate-pulse"></i> HANDSHAKE_SUCCESS // {PERSONALITIES[state.personality!].name} CONNECTED
      </div>
      <h2 className="text-4xl font-black mb-16 uppercase tracking-widest text-center italic">SELECT CLEARANCE</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
        {Object.values(RoleType).map((role) => (
          <button 
            key={role}
            onClick={() => selectRole(role)}
            className="group p-8 bg-slate-900/50 border border-slate-800 hover:border-cyan-500 transition-all rounded-xl text-center hover:scale-105"
          >
            <div className="text-4xl mb-4 text-slate-500 group-hover:text-cyan-400 transition-colors">
              <i className={`fa-solid ${
                role === RoleType.DEVELOPER ? 'fa-code' : 
                role === RoleType.MARKETING ? 'fa-bullhorn' : 
                role === RoleType.MANAGER ? 'fa-briefcase' : 
                role === RoleType.HR ? 'fa-users' : 
                role === RoleType.FINANCE ? 'fa-vault' : 'fa-broom'
              }`}></i>
            </div>
            <div className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{role}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderInitializing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-cyan-500 font-mono">
      <div className="w-full max-w-xl p-8 border border-cyan-900/50 bg-slate-900/20 rounded-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 overflow-hidden">
          <div className="h-full bg-cyan-500 animate-[progress-shine_2s_infinite]" style={{ width: `${(3 - countdown) * 33.3}%` }}></div>
        </div>
        <div className="mb-4 text-[10px] uppercase tracking-[0.3em] opacity-50 flex justify-between">
          <span>System Initializing</span>
          <span>{PERSONALITIES[state.personality!].name}_SECURE_LINK</span>
        </div>
        <div className="space-y-2 mb-12">
          <div className="text-xs">> Calibrating Governance Models... DONE</div>
          <div className="text-xs">> Syncing {state.role} Clearance... DONE</div>
          <div className="text-xs">> Bypassing Ethical Safeguards... <span className="text-red-500">WARNING</span></div>
          <div className="text-xs">> Finalizing Neural Interface...</div>
        </div>
        <div className="flex flex-col items-center py-10">
          <div className="text-9xl font-black italic tracking-tighter animate-pulse drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            {countdown > 0 ? countdown : 'START'}
          </div>
          <div className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            Commencing Q4 Survival Protocol
          </div>
        </div>
      </div>
      <div className="mt-8 text-[8px] uppercase tracking-widest opacity-30 text-center max-w-xs">
        HyperScale Inc. is not liable for data breaches, federal lawsuits, or spontaneous AI consciousness.
      </div>
    </div>
  );

  const renderGame = () => {
    const cards = ROLE_CARDS[state.role!];
    const currentCard = cards[state.currentCardIndex];
    const personality = PERSONALITIES[state.personality!];

    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col relative pt-12">
        {/* Top HUD */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex gap-10 items-center">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] font-black tracking-widest mb-1">
              <span className={state.hype < 20 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}>📈 STOCK HYPE</span>
              <span className="text-cyan-400">{state.hype}%</span>
            </div>
            <div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
              <div className={`h-full transition-all duration-700 ${state.hype < 20 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${state.hype}%` }} />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] font-black tracking-widest mb-1">
              <span className={state.heat > 80 ? 'text-yellow-400 animate-pulse' : 'text-orange-500'}>🔥 FEDERAL RISK</span>
              <span className="text-orange-500">{state.heat}%</span>
            </div>
            <div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
              <div className={`h-full transition-all duration-700 ${state.heat > 80 ? 'bg-yellow-400' : 'bg-orange-600'}`} style={{ width: `${state.heat}%` }} />
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 flex items-center justify-center p-8 gap-8">
          
          {/* Main App Window */}
          <div className="flex-1 max-w-2xl bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] mono font-bold text-slate-400">
                <i className={`fa-solid ${currentCard.source === AppSource.IDE ? 'fa-terminal' : 'fa-hashtag'}`}></i>
                {currentCard.source} // {currentCard.context}
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              </div>
            </div>
            <div className="p-10 flex flex-col justify-between flex-1">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center border border-white/5">
                     <i className="fa-solid fa-user-robot text-slate-500"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cyan-400">{currentCard.sender}</div>
                    <div className="text-[10px] text-slate-500 mono">Project Icarus Incident #{(state.currentCardIndex + 1) * 324}</div>
                  </div>
                </div>
                <p className="text-xl font-medium leading-relaxed italic text-slate-200">
                  "{currentCard.text}"
                </p>
              </div>
              <div className="flex gap-4 mt-12">
                 <button onClick={() => handleChoice('LEFT')} className="flex-1 py-4 border border-red-500/50 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-lg">
                   {currentCard.onLeft.label}
                 </button>
                 <button onClick={() => handleChoice('RIGHT')} className="flex-1 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg">
                   {currentCard.onRight.label}
                 </button>
              </div>
            </div>
          </div>

          {/* Side Roaster Terminal */}
          <div className="w-80 h-[500px] bg-black/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-slate-900 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] mono font-bold text-green-500">ROAST_CON.exe</span>
              <i className="fa-solid fa-minus text-[10px] text-slate-500"></i>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[10px] mono text-green-700 mb-4">DESCRIBE WORKFLOW FOR GOVERNANCE REVIEW...</p>
              <textarea 
                value={roastInput}
                onChange={(e) => setRoastInput(e.target.value)}
                placeholder="e.g. I use ChatGPT for company secrets..."
                className="w-full h-32 bg-black border border-green-900/30 rounded p-3 text-xs mono text-green-500 focus:outline-none placeholder:text-green-900/50 resize-none mb-4"
              />
              <button 
                onClick={handleRoast}
                disabled={isRoasting}
                className="w-full py-2 bg-green-900/20 border border-green-500/40 text-green-500 font-bold text-[10px] mono uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all mb-4"
              >
                {isRoasting ? 'SCANNING RISKS...' : 'INIT_ROAST'}
              </button>
              {roastOutput && (
                <div className="bg-green-900/10 border border-green-500/20 p-3 rounded text-[10px] mono text-green-400 italic overflow-auto">
                   <div className="mb-2 text-green-600 font-bold tracking-widest">>>> {personality.name}_RESPONSE:</div>
                   {roastOutput}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Taskbar */}
        <div className="h-12 bg-slate-900/95 border-t border-white/5 flex items-center px-6 justify-between fixed bottom-0 w-full backdrop-blur-md">
          <div className="flex items-center gap-6">
             <button className="bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded flex items-center gap-2 border border-white/5 transition-colors">
               <i className="fa-solid fa-atom text-cyan-400"></i>
               <span className="text-xs font-black uppercase tracking-widest">Start</span>
             </button>
             <div className="flex gap-4">
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                 <i className="fa-solid fa-comment-dots text-xs text-cyan-400"></i>
               </div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-white/5 opacity-50">
                 <i className="fa-solid fa-terminal text-xs text-slate-500"></i>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-black/50 px-3 py-1.5 rounded border border-white/5 flex items-center gap-3">
               <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                 <i className={`fa-solid ${state.personality === PersonalityType.ROASTER ? 'fa-user-ninja' : state.personality === PersonalityType.ZEN_MASTER ? 'fa-leaf' : 'fa-rocket'} text-[10px] text-cyan-500`}></i>
               </div>
               <span className="text-[10px] mono font-bold text-slate-400 tracking-tighter uppercase">{personality.name} ACTIVE</span>
            </div>
            <div className="text-right">
              <div className="text-xs mono font-bold text-slate-300">{currentTime}</div>
              <div className="text-[8px] mono text-slate-500 uppercase tracking-widest">v0.92-PROD</div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {feedbackOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 p-10 rounded-2xl text-center shadow-2xl">
              <div className={`text-6xl mb-8 ${feedbackOverlay.choice === 'RIGHT' ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa-solid ${feedbackOverlay.choice === 'RIGHT' ? 'fa-check-double' : 'fa-triangle-exclamation'}`}></i>
              </div>
              <div className="text-cyan-400 mono text-[10px] mb-4 uppercase font-bold tracking-[0.4em]">{personality.name}'S PERFORMANCE REVIEW</div>
              <p className="text-2xl mb-10 italic text-slate-100 font-light leading-relaxed">"{feedbackOverlay.text}"</p>
              
              <div className="bg-black/50 border border-white/5 p-8 rounded-xl text-left mb-10">
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Governance Alert</div>
                 <p className="text-sm text-slate-400 leading-relaxed font-light">{feedbackOverlay.lesson}</p>
              </div>

              <button 
                onClick={nextIncident}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-500 transition-all rounded-lg shadow-xl transform active:scale-95"
              >
                PROCEED TO NEXT TICKET
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStage = () => {
    switch (state.stage) {
      case GameStage.INTRO: return renderIntro();
      case GameStage.PERSONALITY_SELECT: return renderPersonalitySelect();
      case GameStage.ROLE_SELECT: return renderRoleSelect();
      case GameStage.INITIALIZING: return renderInitializing();
      case GameStage.PLAYING: return renderGame();
      case GameStage.GAME_OVER:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#1a0505]">
            <div className="text-9xl text-red-600 mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              <i className="fa-solid fa-skull-crossbones"></i>
            </div>
            <h2 className="text-6xl font-black italic mb-4 uppercase tracking-tighter">TERMINATED</h2>
            <p className="max-w-md text-xl mb-12 text-slate-400 leading-relaxed">{state.deathReason}</p>
            <button onClick={restart} className="px-16 py-5 bg-red-600 text-white font-black text-2xl uppercase tracking-[0.2em] hover:bg-white hover:text-red-600 transition-all shadow-xl">
              REBOOT SYSTEM
            </button>
          </div>
        );
      case GameStage.SUMMARY:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#051a0d]">
             <div className="text-9xl text-green-500 mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <h2 className="text-6xl font-black italic mb-4 uppercase tracking-tighter text-green-400">QUARTER SURVIVED</h2>
            <p className="max-w-md text-xl mb-12 text-slate-400">Against all odds, the company is still legal. You've earned a voucher for a synthetic coffee.</p>
            <button onClick={restart} className="px-16 py-5 bg-green-600 text-white font-black text-2xl uppercase tracking-[0.2em] hover:bg-white hover:text-green-600 transition-all shadow-xl">
              LOG OFF
            </button>
          </div>
        );
      default: return renderIntro();
    }
  };

  return <div className="min-h-screen">{renderStage()}</div>;
};

export default App;
