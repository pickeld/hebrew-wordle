import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { useAuthStore } from '../../store/useAuthStore';
import { signInWithGoogle, signOut } from '../../firebase/auth';
import { getUserStats } from '../../firebase/firestore';
import { AdBanner } from '../../components/AdBanner';
import type { UserStats } from '../../types';

export default function ProfileScreen() {
  const { user, loading } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      getUserStats(user.uid).then(setStats).catch(console.error);
    }
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.signInBox}>
          <Text style={styles.signInIcon}>👤</Text>
          <Text style={styles.signInTitle}>כנס כדי לעקוב אחר הניצחונות שלך</Text>
          <Text style={styles.signInDesc}>
            שמור את הסטטיסטיקות, השתתף בתחרויות וצבור ניקוד!
          </Text>
          <TouchableOpacity style={styles.signInBtn} onPress={signInWithGoogle}>
            <Text style={styles.signInBtnText}>{STRINGS.signIn}</Text>
          </TouchableOpacity>
        </View>
        <AdBanner />
      </SafeAreaView>
    );
  }

  const winRate =
    stats && stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{(user.displayName ?? '?')[0]}</Text>
            </View>
          )}
          <Text style={styles.displayName}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Stats Grid */}
        {stats && (
          <View style={styles.statsGrid}>
            <StatBox label="משחקים" value={String(stats.gamesPlayed)} />
            <StatBox label="ניצחונות" value={String(stats.gamesWon)} />
            <StatBox label="אחוז ניצחון" value={`${winRate}%`} />
            <StatBox label="רצף נוכחי" value={String(stats.streak)} />
            <StatBox label="רצף שיא" value={String(stats.maxStreak)} />
          </View>
        )}

        {/* Guess Distribution */}
        {stats && (
          <View style={styles.distCard}>
            <Text style={styles.distTitle}>התפלגות ניחושים</Text>
            {stats.guessDistribution.map((count, i) => {
              const max = Math.max(...stats.guessDistribution, 1);
              const pct = Math.round((count / max) * 100);
              return (
                <View key={i} style={styles.distRow}>
                  <Text style={styles.distLabel}>{i + 1}</Text>
                  <View style={styles.distBarBg}>
                    <View style={[styles.distBarFill, { width: `${Math.max(pct, 4)}%` }]} />
                  </View>
                  <Text style={styles.distCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>{STRINGS.signOut}</Text>
        </TouchableOpacity>
      </ScrollView>

      <AdBanner />
    </SafeAreaView>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },
  signInBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  signInIcon: { fontSize: 56, marginBottom: 16 },
  signInTitle: {
    color: COLORS.text, fontSize: 20, fontWeight: '700',
    fontFamily: FONTS.bold, textAlign: 'center', marginBottom: 8,
  },
  signInDesc: {
    color: COLORS.textSecondary, fontSize: 14,
    fontFamily: FONTS.regular, textAlign: 'center', marginBottom: 28, lineHeight: 22,
  },
  signInBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12,
  },
  signInBtnText: { color: '#000', fontWeight: '700', fontFamily: FONTS.bold, fontSize: 16 },
  avatarSection: { alignItems: 'center', paddingTop: 18, paddingBottom: 18 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 2, borderColor: COLORS.accent,
  },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.accent,
  },
  avatarText: { fontSize: 36, color: COLORS.accent, fontWeight: '700' },
  displayName: {
    color: COLORS.text, fontSize: 22, fontWeight: '700',
    fontFamily: FONTS.bold, marginTop: 10,
  },
  email: { color: COLORS.textSecondary, fontSize: 13, fontFamily: FONTS.regular, marginTop: 2 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    justifyContent: 'center', marginBottom: 20,
  },
  statBox: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16,
    alignItems: 'center', width: 100, borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { color: COLORS.accent, fontSize: 24, fontWeight: '700', fontFamily: FONTS.bold },
  statLabel: {
    color: COLORS.textSecondary, fontSize: 11,
    fontFamily: FONTS.regular, marginTop: 4, textAlign: 'center',
  },
  distCard: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  distTitle: {
    color: COLORS.text, fontFamily: FONTS.bold, fontSize: 15,
    fontWeight: '700', textAlign: 'right', marginBottom: 12,
  },
  distRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  distLabel: { color: COLORS.textSecondary, fontFamily: FONTS.bold, width: 18, textAlign: 'center' },
  distBarBg: {
    flex: 1, height: 20, backgroundColor: COLORS.background,
    borderRadius: 4, marginHorizontal: 8, overflow: 'hidden',
  },
  distBarFill: { height: '100%', backgroundColor: COLORS.correct, borderRadius: 4 },
  distCount: { color: COLORS.textSecondary, fontFamily: FONTS.regular, width: 28, textAlign: 'right' },
  signOutBtn: {
    alignSelf: 'center', padding: 12, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 28, marginBottom: 8,
  },
  signOutText: { color: COLORS.danger, fontFamily: FONTS.semiBold, fontSize: 15 },
});
