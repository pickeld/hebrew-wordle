import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board } from '../../components/Board';
import { HebrewKeyboard } from '../../components/HebrewKeyboard';
import { AdBanner } from '../../components/AdBanner';
import { GameResultModal } from '../../components/GameResultModal';
import { useGame } from '../../hooks/useGame';
import { showRewarded, showInterstitial } from '../../admob/ads';
import { COLORS, FONTS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';

export default function HomeScreen() {
  const { gameStatus, guesses, addLetter, deleteLetter, submitGuess, revealHint } = useGame();
  const [showResult, setShowResult] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const startTimeRef = useRef(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const resultShownRef = useRef(false);

  useEffect(() => {
    if (gameStatus !== 'playing' && !resultShownRef.current) {
      resultShownRef.current = true;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      showInterstitial(() => setShowResult(true));
    }
  }, [gameStatus]);

  function showToast(msg: string) {
    setToastMsg(msg);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(toastOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }

  function handleSubmit() {
    const result = submitGuess();
    if (!result.valid) {
      if (result.error === 'too_short') showToast(STRINGS.tooShort);
      else if (result.error === 'not_a_word') showToast(STRINGS.notAWord);
    }
  }

  function handleHint() {
    Alert.alert(
      STRINGS.watchAdForHint,
      'צפה בסרטון קצר כדי לחשוף אות אחת',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'צפה בפרסומת',
          onPress: () =>
            showRewarded(
              () => {
                const hint = revealHint();
                if (hint) showToast(`${STRINGS.hintRevealed}: ${hint}`);
              },
              undefined,
            ),
        },
      ],
    );
  }

  const dayStr = new Date().toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>{STRINGS.appName}</Text>
        <Text style={styles.dateStr}>{dayStr}</Text>
        <View style={styles.divider} />
      </View>

      {/* Board */}
      <View style={styles.boardArea}>
        <Board />
      </View>

      {/* Toast */}
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* Hint button (available after 2 failed guesses) */}
      {gameStatus === 'playing' && guesses.length >= 2 && (
        <TouchableOpacity style={styles.hintBtn} onPress={handleHint}>
          <Text style={styles.hintBtnText}>💡 {STRINGS.watchAdForHint}</Text>
        </TouchableOpacity>
      )}

      {/* Keyboard */}
      <View style={styles.keyboardArea}>
        <HebrewKeyboard
          onLetter={addLetter}
          onDelete={deleteLetter}
          onSubmit={handleSubmit}
        />
      </View>

      {/* Banner ad */}
      <AdBanner />

      {/* Result modal */}
      <GameResultModal
        visible={showResult}
        onClose={() => setShowResult(false)}
        timeSeconds={elapsedSeconds}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingTop: 6, paddingBottom: 10 },
  appName: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.accent,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  dateStr: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontFamily: FONTS.regular,
  },
  divider: { height: 1, width: '90%', backgroundColor: COLORS.border, marginTop: 8 },
  boardArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  toast: {
    position: 'absolute',
    top: 108,
    alignSelf: 'center',
    backgroundColor: COLORS.text,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    zIndex: 99,
  },
  toastText: { color: COLORS.background, fontWeight: '700', fontFamily: FONTS.bold, fontSize: 14 },
  hintBtn: {
    alignSelf: 'center',
    marginVertical: 4,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
  },
  hintBtnText: { color: COLORS.accent, fontFamily: FONTS.semiBold, fontSize: 13 },
  keyboardArea: { paddingBottom: 6, paddingTop: 2 },
});
