import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './config';
import type { UserStats, DailyScore, Challenge, ChallengeParticipant, Tournament } from '../types';

// ─── User Stats ───────────────────────────────────────────────────────────────

export async function getUserStats(uid: string): Promise<UserStats | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserStats) : null;
}

export async function upsertUserStats(uid: string, stats: Partial<UserStats>): Promise<void> {
  await setDoc(doc(db, 'users', uid), stats, { merge: true });
}

// ─── Daily Scores ─────────────────────────────────────────────────────────────

export async function submitDailyScore(score: DailyScore): Promise<void> {
  const id = `${score.uid}_${score.date}`;
  await setDoc(doc(db, 'dailyScores', id), score);
}

export async function getDailyLeaderboard(date: string): Promise<DailyScore[]> {
  const q = query(
    collection(db, 'dailyScores'),
    where('date', '==', date),
    where('won', '==', true),
    orderBy('guesses', 'asc'),
    orderBy('timeSeconds', 'asc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DailyScore);
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export async function createChallenge(challenge: Omit<Challenge, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'challenges'));
  await setDoc(ref, { ...challenge, id: ref.id });
  return ref.id;
}

export async function getChallenge(id: string): Promise<Challenge | null> {
  const snap = await getDoc(doc(db, 'challenges', id));
  return snap.exists() ? (snap.data() as Challenge) : null;
}

export async function submitChallengeResult(
  challengeId: string,
  participant: ChallengeParticipant
): Promise<void> {
  await updateDoc(doc(db, 'challenges', challengeId), {
    participants: arrayUnion(participant),
  });
}

// ─── Tournaments ──────────────────────────────────────────────────────────────

export async function getActiveTournaments(): Promise<Tournament[]> {
  const q = query(
    collection(db, 'tournaments'),
    where('status', '==', 'active'),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Tournament);
}

export async function joinTournament(tournamentId: string, uid: string): Promise<void> {
  await updateDoc(doc(db, 'tournaments', tournamentId), {
    participants: arrayUnion(uid),
  });
}
