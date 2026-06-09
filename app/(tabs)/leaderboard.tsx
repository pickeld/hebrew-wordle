import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { getDailyLeaderboard } from '../../firebase/firestore';
import { israelDateStr } from '../../lib/time';
import { AdBanner } from '../../components/AdBanner';
import type { DailyScore } from '../../types';

type Tab = 'daily' | 'weekly' | 'alltime';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [scores, setScores] = useState<DailyScore[]>([]);
  const [loading, setLoading] = useState(false);

  const today = israelDateStr();

  useEffect(() => {
    load();
  }, [activeTab]);

  async function load() {
    setLoading(true);
    try {
      if (activeTab === 'daily') {
        setScores(await getDailyLeaderboard(today));
      }
      // weekly / alltime: add aggregated Firestore queries later
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'daily', label: STRINGS.daily },
    { id: 'weekly', label: STRINGS.weekly },
    { id: 'alltime', label: STRINGS.allTime },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>{STRINGS.leaderboard}</Text>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item, i) => `${item.uid}_${i}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>אין ניקוד עדיין. שחק כדי להיכנס לטבלה!</Text>
          }
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.name} numberOfLines={1}>{item.displayName}</Text>
              <Text style={styles.guesses}>{item.guesses} ניחושים</Text>
              <Text style={styles.time}>{item.timeSeconds}ש'</Text>
            </View>
          )}
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
  tabBar: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 12,
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: COLORS.accent },
  tabLabel: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 13 },
  tabLabelActive: { color: '#000' },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  empty: {
    textAlign: 'center', color: COLORS.textMuted,
    fontFamily: FONTS.regular, marginTop: 40, fontSize: 14,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 10,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  rank: { color: COLORS.accent, fontFamily: FONTS.bold, fontSize: 16, width: 36 },
  name: { flex: 1, color: COLORS.text, fontFamily: FONTS.semiBold, fontSize: 15 },
  guesses: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 13, marginRight: 10 },
  time: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 13 },
});
