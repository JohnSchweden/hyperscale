
export enum PersonalityType {
  ROASTER = 'ROASTER',
  ZEN_MASTER = 'ZEN_MASTER',
  LOVEBOMBER = 'LOVEBOMBER'
}

export enum RoleType {
  DEVELOPER = 'DEVELOPER',
  MARKETING = 'MARKETING',
  MANAGER = 'MANAGER',
  HR = 'HR',
  FINANCE = 'FINANCE',
  CLEANER = 'CLEANER'
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
  text: string;
  onRight: {
    label: string;
    hype: number;
    heat: number;
    feedback: {
      [key in PersonalityType]: string;
    };
    lesson: string;
  };
  onLeft: {
    label: string;
    hype: number;
    heat: number;
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
  GAME_OVER = 'GAME_OVER',
  SUMMARY = 'SUMMARY'
}

export interface GameState {
  hype: number;
  heat: number;
  stage: GameStage;
  personality: PersonalityType | null;
  role: RoleType | null;
  currentCardIndex: number;
  history: { cardId: string; choice: 'LEFT' | 'RIGHT' }[];
  deathReason: string | null;
}
