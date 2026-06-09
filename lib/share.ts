import { Platform, Share } from 'react-native';
import { israelDateStr, puzzleNumber } from './time';
import { evaluateGuess } from './evaluate';
import type { LetterState } from '../types';

const STATE_EMOJI: Record<LetterState, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
  empty: '⬛',
  tbd: '⬛',
};

/** Emoji squares for one guessed row, mirroring the board exactly. */
export function rowEmoji(solution: string, guess: string): string {
  return evaluateGuess(guess, solution)
    .map((s) => STATE_EMOJI[s])
    .reverse() // Hebrew RTL: mirror so the recap reads right-to-left like the board.
    .join('');
}

/** Spoiler-free emoji recap of a finished board, e.g. for sharing or display. */
export function buildEmojiBoard(solution: string, guesses: string[]): string {
  return guesses.map((g) => rowEmoji(solution, g)).join('\n');
}

/**
 * Full shareable result text: a header naming the game and daily puzzle number
 * (the comparable "#N" hook) plus the spoiler-free emoji board. Contains no
 * Hebrew letters from the solution, so it never leaks the answer.
 */
export function buildShareText(
  solution: string,
  guesses: string[],
  won: boolean,
  puzzleNo: number,
): string {
  const score = won ? `${guesses.length}/6` : 'X/6';
  const emoji = won ? '🎉' : '😔';
  const header = `וורדל עברי #${puzzleNo} ${score} ${emoji}`;
  return `${header}\n${buildEmojiBoard(solution, guesses)}`;
}

export type ShareOutcome = 'shared' | 'copied' | 'failed';

/** Best-effort copy to the system clipboard on web. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    const clip = (globalThis as any)?.navigator?.clipboard;
    if (clip?.writeText) {
      await clip.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}

/**
 * Share the spoiler-free result via the native OS share sheet, returning how it
 * was delivered so the UI can give appropriate feedback.
 *
 * Native (iOS/Android) always uses the share sheet. On web we use the Web Share
 * sheet when the browser exposes it (most mobile browsers) and otherwise fall
 * back to copying the text to the clipboard — react-native-web's Share rejects
 * outright on desktop browsers, which would silently drop the share.
 */
export async function shareResult(
  solution: string,
  guesses: string[],
  won: boolean,
  dateStr: string = israelDateStr(),
): Promise<ShareOutcome> {
  const message = buildShareText(solution, guesses, won, puzzleNumber(dateStr));

  if (Platform.OS === 'web') {
    const nav = (globalThis as any)?.navigator;
    if (nav?.share) {
      try {
        await nav.share({ text: message });
        return 'shared';
      } catch (e: any) {
        // User dismissing the sheet aborts — treat as a no-op, not a failure.
        if (e?.name === 'AbortError') return 'shared';
        // Otherwise fall through to the clipboard fallback.
      }
    }
    return (await copyToClipboard(message)) ? 'copied' : 'failed';
  }

  try {
    await Share.share({ message });
    return 'shared';
  } catch {
    return 'failed';
  }
}
