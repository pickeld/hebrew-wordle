export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export interface TileData {
  letter: string;
  state: LetterState;
}

export interface GameState {
  solution: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStates: Record<string, LetterState>;
  startTime: number;
}

export interface UserStats {
  uid: string;
  displayName: string;
  photoURL?: string;
  streak: number;
  maxStreak: number;
  gamesPlayed: number;
  gamesWon: number;
  guessDistribution: number[];
}

export interface DailyScore {
  uid: string;
  displayName: string;
  date: string;
  guesses: number;
  timeSeconds: number;
  won: boolean;
}

export interface ChallengeParticipant {
  uid: string;
  displayName: string;
  guesses: number;
  timeSeconds: number;
  won: boolean;
  completedAt: number;
}

export interface Challenge {
  id: string;
  creatorId: string;
  creatorName: string;
  word: string;
  createdAt: number;
  participants: ChallengeParticipant[];
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  participants: string[];
  scores: DailyScore[];
  status: 'upcoming' | 'active' | 'ended';
}
