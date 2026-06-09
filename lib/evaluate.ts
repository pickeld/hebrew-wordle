import type { LetterState } from '../types';

export const WORD_LENGTH = 5;

/**
 * Score a guess against the solution into per-tile states, in two passes so
 * duplicate letters are handled exactly like real Wordle: greens are claimed
 * first, then each remaining guess letter only turns yellow if an unclaimed
 * copy of it is still left in the solution.
 *
 * This is the single source of truth for tile colors — the on-screen board, the
 * shareable emoji grid, and the result recap all derive from it, so the shared
 * grid always mirrors what the player actually saw (and never leaks an extra
 * colored square for a duplicate letter).
 */
export function evaluateGuess(guess: string, solution: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const solutionChars = [...solution];
  const guessChars = [...guess];

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
