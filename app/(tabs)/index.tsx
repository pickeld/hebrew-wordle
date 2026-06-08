import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board, type BoardHandle } from '../../components/Board';
import { HebrewKeyboard } from '../../components/HebrewKeyboard';
import { AdBanner } from '../../components/AdBanner';
import { GameResultModal } from '../../components/GameResultModal';
import { HintDialog } from '../../components/HintDialog';
import { useGame } from '../../hooks/useGame';
import { showRewarded, showInterstitial } from '../../admob/ads';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';

const MAX_GUESSES = 6;

export default function HomeScreen() {
  const { gameStatus, guesses, addLetter, deleteLetter, submitGuess, revealHint } = useGame();
  const [showResult, setShowResult] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslate = useRef(new Animated.Value(-12)).current;
  const startTimeRef = useRef(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const resultShownRef = useRef(false);
  const boardRef = useRef<BoardHandle>(null);

  useEffect(() => {
    if (gameStatus !== 'playing' && !resultShownRef.current) {
      resultShownRef.current = true;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      // Let the win/reveal animation play before interrupting with the result.
      const delay = gameStatus === 'won' ? 1700 : 1400;
      setTimeout(() => showInterstitial(() => setShowResult(true)), delay);
    }
  }, [gameStatus]);

  function showToast(msg: string) {
    setToastMsg(msg);
    toastOpacity.setValue(0);
    toastTranslate.setValue(-12);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(toastTranslate, { toValue: 0, speed: 16, bounciness: 8, useNativeDriver: true }),
      ]),
      Animated.delay(1300),
      Animated.timing(toastOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }

  function handleSubmit() {
    const result = submitGuess();
    if (!result.valid) {
      if (result.error === 'too_short') {
        showToast(STRINGS.tooShort);
        boardRef.current?.shake();
      } else if (result.error === 'not_a_word') {
        showToast(STRINGS.notAWord);
        boardRef.current?.shake();
      }
    }
  }

  function handleHintConfirm() {
    setShowHintDialog(false);
    showRewarded(
      () => {
        const hint = revealHint();
        if (hint) showToast(`${STRINGS.hintRevealed}: ${hint}`);
      },
      undefined,
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
        <View style={styles.titleRow}>
          <View style={styles.titleAccent} />
          <Text style={styles.appName}>{STRINGS.appName}</Text>
          <View style={styles.titleAccent} />
        </View>
        <Text style={styles.dateStr}>{dayStr}</Text>

        {/* Guess progress dots */}
        <View style={styles.progressRow}>
          {Array.from({ length: MAX_GUESSES }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < guesses.length && styles.progressDotFilled,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Board */}
      <View style={styles.boardArea}>
        <Board ref={boardRef} />
      </View>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { opacity: toastOpacity, transform: [{ translateY: toastTranslate }] },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* Hint button (available after 2 failed guesses) */}
      {gameStatus === 'playing' && guesses.length >= 2 && (
        <Pressable
          style={({ pressed }) => [styles.hintBtn, pressed && styles.hintBtnPressed]}
          onPress={() => setShowHintDialog(true)}
        >
          <Text style={styles.hintBtnText}>💡 {STRINGS.watchAdForHint}</Text>
        </Pressable>
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

      {/* Hint confirmation dialog */}
      <HintDialog
        visible={showHintDialog}
        onCancel={() => setShowHintDialog(false)}
        onConfirm={handleHintConfirm}
      />

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
  header: { alignItems: 'center', paddingTop: SPACING.sm, paddingBottom: SPACING.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  titleAccent: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.accentDim,
  },
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
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  progressRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    marginTop: SPACING.sm,
  },
  progressDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
  },
  progressDotFilled: {
    backgroundColor: COLORS.accent,
  },
  boardArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xs },
  toast: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: COLORS.text,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: RADIUS.pill,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: { color: COLORS.background, fontWeight: '700', fontFamily: FONTS.bold, fontSize: 14 },
  hintBtn: {
    alignSelf: 'center',
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
  },
  hintBtnPressed: { opacity: 0.7 },
  hintBtnText: { color: COLORS.accent, fontFamily: FONTS.semiBold, fontSize: 13 },
  keyboardArea: { paddingBottom: SPACING.sm, paddingTop: SPACING.xs },
});
