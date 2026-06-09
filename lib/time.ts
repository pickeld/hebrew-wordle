import { useEffect, useState } from 'react';

/** Calendar day puzzle #1 lands on. Defines the daily puzzle numbering. */
const PUZZLE_EPOCH = '2024-01-01';
const MS_PER_DAY = 86_400_000;

/**
 * The current calendar date in Israel (YYYY-MM-DD) — the single source of truth
 * for which daily puzzle is live. Keying the word, the puzzle number, and the
 * leaderboard score all off this guarantees every player gets the same word on
 * the same calendar day regardless of their device timezone (the core PIC-40
 * "shared daily puzzle" requirement). Built from formatToParts so it does not
 * depend on `en-CA`/locale data being bundled in the Hermes Intl build.
 */
export function israelDateStr(now: number = Date.now()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(now));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/**
 * Stable, human-friendly puzzle number for a given YYYY-MM-DD date — the same
 * for everyone on a given day. Mirrors Wordle's "#1,234" identity, which is the
 * comparable hook that makes shared results meaningful.
 */
export function puzzleNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [ey, em, ed] = PUZZLE_EPOCH.split('-').map(Number);
  const diff = Date.UTC(y, m - 1, d) - Date.UTC(ey, em - 1, ed);
  return Math.floor(diff / MS_PER_DAY) + 1;
}

/**
 * Milliseconds remaining until the next daily puzzle unlocks (midnight in
 * Israel — the same timezone the daily word is keyed to). Computed in a single
 * "wall clock" frame so the result is correct regardless of the device tz.
 */
export function msUntilNextPuzzle(now: number = Date.now()): number {
  const israelNow = new Date(new Date(now).toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
  const nextMidnight = new Date(israelNow);
  nextMidnight.setHours(24, 0, 0, 0);
  return Math.max(0, nextMidnight.getTime() - israelNow.getTime());
}

/** Format a millisecond duration as HH:MM:SS. */
export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Live HH:MM:SS string counting down to the next daily puzzle, ticking every
 * second. Only runs its interval while `active` is true to avoid needless work
 * during normal play.
 */
export function useNextPuzzleCountdown(active: boolean): string {
  const [label, setLabel] = useState(() => formatCountdown(msUntilNextPuzzle()));

  useEffect(() => {
    if (!active) return;
    setLabel(formatCountdown(msUntilNextPuzzle()));
    const id = setInterval(() => {
      setLabel(formatCountdown(msUntilNextPuzzle()));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  return label;
}
