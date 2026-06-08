import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { getActiveTournaments, joinTournament } from '../../firebase/firestore';
import { useAuthStore } from '../../store/useAuthStore';
import { AdBanner } from '../../components/AdBanner';
import type { Tournament } from '../../types';

export default function TournamentScreen() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    getActiveTournaments()
      .then(setTournaments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleJoin(t: Tournament) {
    if (!user) return;
    try {
      await joinTournament(t.id, user.uid);
      setTournaments((prev) =>
        prev.map((x) =>
          x.id === t.id ? { ...x, participants: [...x.participants, user.uid] } : x,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>{STRINGS.tournament}</Text>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>אין טורנירים פעילים</Text>
              <Text style={styles.emptyDesc}>
                טורנירים שבועיים יתחילו בקרוב — הישאר מעודכן!
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const joined = user ? item.participants.includes(user.uid) : false;
            return (
              <View style={styles.card}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDates}>
                  {item.startDate} – {item.endDate}
                </Text>
                <Text style={styles.cardCount}>{item.participants.length} משתתפים</Text>
                <TouchableOpacity
                  style={[styles.btn, joined && styles.btnJoined]}
                  onPress={() => handleJoin(item)}
                  disabled={joined}
                >
                  <Text style={styles.btnText}>{joined ? '✓ הצטרפת' : STRINGS.joinTournament}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: 26, fontWeight: '700', color: COLORS.accent,
    fontFamily: FONTS.bold, textAlign: 'center', paddingTop: 12, paddingBottom: 8,
  },
  list: { padding: 16 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    color: COLORS.text, fontSize: 18, fontWeight: '700',
    fontFamily: FONTS.bold, marginBottom: 6,
  },
  emptyDesc: {
    color: COLORS.textSecondary, fontSize: 13,
    fontFamily: FONTS.regular, textAlign: 'center', lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 18,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  cardName: {
    color: COLORS.text, fontSize: 18, fontWeight: '700',
    fontFamily: FONTS.bold, textAlign: 'right',
  },
  cardDates: {
    color: COLORS.textSecondary, fontSize: 12,
    fontFamily: FONTS.regular, textAlign: 'right', marginTop: 4,
  },
  cardCount: {
    color: COLORS.textMuted, fontSize: 12,
    fontFamily: FONTS.regular, textAlign: 'right', marginBottom: 12,
  },
  btn: { backgroundColor: COLORS.accent, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnJoined: { backgroundColor: COLORS.absent },
  btnText: { color: '#000', fontWeight: '700', fontFamily: FONTS.bold },
});
