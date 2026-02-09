
export enum PersonalityType {
  ROASTER = 'ROASTER',
  ZEN_MASTER = 'ZEN_MASTER',
  LOVEBOMBER = 'LOVEBOMBER'
}

export enum RoleType {
  DEVELOPMENT = 'DEVELOPMENT',
  MARKETING = 'MARKETING',
  MANAGEMENT = 'MANAGEMENT',
  HR = 'HR',
  FINANCE = 'FINANCE',
  CLEANING = 'CLEANING'
}

export enum AppSource {
  SLACK = 'SLACK',
  EMAIL = 'EMAIL',
  TERMINAL = 'TERMINAL',
  IDE = 'IDE'
}

export interface Card {
  id: string;
  source: AppSource;
  sender: string;
  context: string;
  /** Optional scene-setting line to immerse the user before the main ask */
  storyContext?: string;
  text: string;
  onRight: {
    label: string;
    hype: number;
    heat: number;
    fine: number;
    violation: string;
    feedback: {
      [key in PersonalityType]: string;
    };
    lesson: string;
  };
  onLeft: {
    label: string;
    hype: number;
    heat: number;
    fine: number;
    violation: string;
    feedback: {
      [key in PersonalityType]: string;
    };
    lesson: string;
  };
}

export enum GameStage {
  INTRO = 'INTRO',
  PERSONALITY_SELECT = 'PERSONALITY_SELECT',
  ROLE_SELECT = 'ROLE_SELECT',
  INITIALIZING = 'INITIALIZING',
  PLAYING = 'PLAYING',
  BOSS_FIGHT = 'BOSS_FIGHT',
  GAME_OVER = 'GAME_OVER',
  SUMMARY = 'SUMMARY'
}

export interface GameState {
  hype: number;
  heat: number;
  budget: number;
  stage: GameStage;
  personality: PersonalityType | null;
  role: RoleType | null;
  currentCardIndex: number;
  history: { cardId: string; choice: 'LEFT' | 'RIGHT' }[];
  deathReason: string | null;
  deathType: DeathType | null;
  unlockedEndings: DeathType[];
  bossFightAnswers: boolean[];
}

export enum DeathType {
  BANKRUPT = 'BANKRUPT',
  REPLACED_BY_SCRIPT = 'REPLACED_BY_SCRIPT',
  CONGRESS = 'CONGRESS',
  FLED_COUNTRY = 'FLED_COUNTRY',
  PRISON = 'PRISON',
  AUDIT_FAILURE = 'AUDIT_FAILURE'
}

export interface BossQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
}
