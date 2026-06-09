import { useEffect, useState } from 'react';

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
