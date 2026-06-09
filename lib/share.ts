import { Share } from 'react-native';

function tileEmoji(ch: string, solution: string, i: number): string {
  const sol = [...solution];
  if (ch === sol[i]) return '🟩';
  if (sol.includes(ch)) return '🟨';
  return '⬛';
}

/** Spoiler-free emoji recap of a finished board, e.g. for sharing or display. */
export function buildEmojiBoard(solution: string, guesses: string[]): string {
  return guesses
    .map((g) =>
      [...g]
        .map((ch, i) => tileEmoji(ch, solution, i))
        .reverse() // Hebrew RTL: mirror so the recap reads right-to-left like the board.
        .join('')
    )
    .join('\n');
}

/** Full shareable result text (header + emoji board). */
export function buildShareText(solution: string, guesses: string[], won: boolean): string {
  const emoji = won ? '🎉 ניצחתי!' : '😔 הפסדתי';
  const header = `וורדל עברי ${emoji} (${won ? guesses.length : 'X'}/6)`;
  return `${header}\n${buildEmojiBoard(solution, guesses)}`;
}

export function shareResult(solution: string, guesses: string[], won: boolean) {
  return Share.share({ message: buildShareText(solution, guesses, won) });
}

export { tileEmoji };
