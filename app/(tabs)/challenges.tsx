import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Share, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { createChallenge, getChallenge } from '../../firebase/firestore';
import { useAuthStore } from '../../store/useAuthStore';
import { signInWithGoogle } from '../../firebase/auth';
import { AdBanner } from '../../components/AdBanner';
import { ANSWER_WORDS_CLEAN } from '../../constants/words';

function randomWord(): string {
  const words = ANSWER_WORDS_CLEAN;
  return words[Math.floor(Math.random() * words.length)];
}

export default function ChallengesScreen() {
  const { user } = useAuthStore();
  const [joinCode, setJoinCode] = useState('');

  async function handleCreate() {
    if (!user) {
      Alert.alert('כניסה נדרשת', 'כנס כדי ליצור אתגר', [
        { text: 'כניסה עם גוגל', onPress: signInWithGoogle },
        { text: 'ביטול', style: 'cancel' },
      ]);
      return;
    }
    try {
      const word = randomWord();
      const id = await createChallenge({
        creatorId: user.uid,
        creatorName: user.displayName ?? 'אנונימי',
        word,
        createdAt: Date.now(),
        participants: [],
      });
      await Share.share({
        message: `אני מאתגר אותך בוורדל עברי! 🏆\nקוד: ${id}\nhebrewwordle://challenge/${id}`,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleJoin() {
    const code = joinCode.trim();
    if (!code) return;
    try {
      const challenge = await getChallenge(code);
      if (!challenge) {
        Alert.alert('לא נמצא', 'קוד האתגר לא קיים');
        return;
      }
      Alert.alert('אתגר נמצא!', `${challenge.creatorName} מאתגר אותך. בהצלחה! 🎯`);
      setJoinCode('');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>{STRINGS.challenges}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚔️ {STRINGS.createChallenge}</Text>
        <Text style={styles.cardDesc}>
          מילה אקראית תיבחר ותשלח לחבר — מי יפתור אותה ראשון?
        </Text>
        <TouchableOpacity style={styles.btn} onPress={handleCreate}>
          <Text style={styles.btnText}>{STRINGS.createChallenge}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔗 {STRINGS.joinChallenge}</Text>
        <TextInput
          style={styles.input}
          placeholder={STRINGS.challengeCode}
          placeholderTextColor={COLORS.textMuted}
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={handleJoin}>
          <Text style={[styles.btnText, { color: COLORS.accent }]}>{STRINGS.joinChallenge}</Text>
        </TouchableOpacity>
      </View>

      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  title: {
    fontSize: 26, fontWeight: '700', color: COLORS.accent,
    fontFamily: FONTS.bold, textAlign: 'center', paddingTop: 12, paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 20,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.text, fontSize: 18, fontWeight: '700',
    fontFamily: FONTS.bold, marginBottom: 6, textAlign: 'right',
  },
  cardDesc: {
    color: COLORS.textSecondary, fontSize: 13,
    fontFamily: FONTS.regular, marginBottom: 14, textAlign: 'right', lineHeight: 20,
  },
  btn: {
    backgroundColor: COLORS.accent, padding: 13,
    borderRadius: 10, alignItems: 'center',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: COLORS.accent,
  },
  btnText: { color: '#000', fontWeight: '700', fontFamily: FONTS.bold, fontSize: 16 },
  input: {
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 8, padding: 12, color: COLORS.text, fontFamily: FONTS.regular,
    marginBottom: 12, textAlign: 'right', fontSize: 15,
  },
});
