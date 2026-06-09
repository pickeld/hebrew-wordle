import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';
import { submitDailyScore, upsertUserStats, getUserStats } from '../firebase/firestore';
import { israelDateStr } from '../lib/time';

export function useGame() {
  const store = useGameStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (store.gameStatus === 'playing') return;
    if (!user) return;

    const elapsed = Math.floor((Date.now() - store.startTime) / 1000);
    // Key the score to the same Israel-day the daily word is drawn from, so a
    // game finished just after local midnight still lands on the right puzzle.
    const date = israelDateStr();
    const won = store.gameStatus === 'won';
    const guessCount = store.guesses.length;

    submitDailyScore({
      uid: user.uid,
      displayName: user.displayName ?? 'אנונימי',
      date,
      guesses: won ? guessCount : 7,
      timeSeconds: elapsed,
      won,
    });

    getUserStats(user.uid).then((existing) => {
      const base = existing ?? {
        uid: user.uid,
        displayName: user.displayName ?? 'אנונימי',
        streak: 0,
        maxStreak: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0],
      };

      base.gamesPlayed += 1;
      if (won) {
        base.gamesWon += 1;
        base.streak += 1;
        base.maxStreak = Math.max(base.maxStreak, base.streak);
        const idx = guessCount - 1;
        if (idx >= 0 && idx < 6) base.guessDistribution[idx] += 1;
      } else {
        base.streak = 0;
      }

      upsertUserStats(user.uid, base);
    });
  }, [store.gameStatus]);

  return store;
}
