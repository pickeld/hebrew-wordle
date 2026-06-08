import { create } from 'zustand';
import type { LetterState } from '../types';
import { getDailyWord, isValidWord } from '../constants/words';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

function getTodayStr(): string {
  const now = new Date();
  const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
  return israelTime.toISOString().split('T')[0];
}

function evaluateGuess(guess: string, solution: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');

  // Pass 1: correct positions (green)
  guessChars.forEach((char, i) => {
    if (char === solutionChars[i]) {
      result[i] = 'correct';
      solutionChars[i] = '#';
    }
  });

  // Pass 2: present but wrong position (yellow)
  guessChars.forEach((char, i) => {
    if (result[i] === 'correct') return;
    const idx = solutionChars.indexOf(char);
    if (idx !== -1) {
      result[i] = 'present';
      solutionChars[idx] = '#';
    }
  });

  return result;
}

interface GameStore {
  solution: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStates: Record<string, LetterState>;
  startTime: number;
  addLetter: (letter: string) => void;
  deleteLetter: () => void;
  submitGuess: () => { valid: boolean; error?: string };
  resetGame: () => void;
  revealHint: () => string | null;
  getTileStates: () => LetterState[][];
}

export const useGameStore = create<GameStore>((set, get) => ({
  solution: getDailyWord(getTodayStr()),
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  letterStates: {},
  startTime: Date.now(),

  addLetter: (letter) => {
    const { currentGuess, gameStatus } = get();
    if (gameStatus !== 'playing') return;
    if ([...currentGuess].length >= WORD_LENGTH) return;
    set({ currentGuess: currentGuess + letter });
  },

  deleteLetter: () => {
    const { currentGuess } = get();
    // Remove last unicode character (handles multi-byte Hebrew)
    const chars = [...currentGuess];
    chars.pop();
    set({ currentGuess: chars.join('') });
  },

  submitGuess: () => {
    const { currentGuess, solution, guesses, letterStates, gameStatus } = get();
    if (gameStatus !== 'playing') return { valid: false };
    if ([...currentGuess].length !== WORD_LENGTH) return { valid: false, error: 'too_short' };
    if (!isValidWord(currentGuess)) return { valid: false, error: 'not_a_word' };

    const newGuesses = [...guesses, currentGuess];
    const states = evaluateGuess(currentGuess, solution);
    const newLetterStates = { ...letterStates };

    const priority: Record<LetterState, number> = {
      correct: 3, present: 2, absent: 1, empty: 0, tbd: 0,
    };

    [...currentGuess].forEach((char, i) => {
      const existing = newLetterStates[char];
      if (!existing || priority[states[i]] > priority[existing]) {
        newLetterStates[char] = states[i];
      }
    });

    const won = currentGuess === solution;
    const lost = !won && newGuesses.length >= MAX_GUESSES;

    set({
      guesses: newGuesses,
      currentGuess: '',
      letterStates: newLetterStates,
      gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
    });

    return { valid: true };
  },

  revealHint: () => {
    const { solution, guesses } = get();
    const solChars = [...solution];
    const correctPositions = new Set<number>();

    guesses.forEach((guess) => {
      [...guess].forEach((char, i) => {
        if (char === solChars[i]) correctPositions.add(i);
      });
    });

    for (let i = 0; i < solChars.length; i++) {
      if (!correctPositions.has(i)) return solChars[i];
    }
    return null;
  },

  getTileStates: () => {
    const { guesses, solution, currentGuess, gameStatus } = get();
    const rows: LetterState[][] = [];

    guesses.forEach((guess) => {
      rows.push(evaluateGuess(guess, solution));
    });

    if (guesses.length < MAX_GUESSES && gameStatus === 'playing') {
      const currentChars = [...currentGuess];
      const row: LetterState[] = Array(WORD_LENGTH).fill('empty');
      currentChars.forEach((_, i) => { row[i] = 'tbd'; });
      rows.push(row);
    }

    while (rows.length < MAX_GUESSES) {
      rows.push(Array(WORD_LENGTH).fill('empty') as LetterState[]);
    }

    return rows;
  },

  resetGame: () => {
    set({
      solution: getDailyWord(getTodayStr()),
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      letterStates: {},
      startTime: Date.now(),
    });
  },
}));
