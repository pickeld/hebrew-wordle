import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { STRINGS } from '../constants/strings';
import { useGameStore } from '../store/useGameStore';
import { tileEmoji, shareResult } from '../lib/share';
import { useNextPuzzleCountdown } from '../lib/time';

interface Props {
  visible: boolean;
  onClose: () => void;
  timeSeconds: number;
}

export function GameResultModal({ visible, onClose, timeSeconds }: Props) {
  const { gameStatus, solution, guesses } = useGameStore();
  const won = gameStatus === 'won';

  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const countdown = useNextPuzzleCountdown(visible);

  useEffect(() => {
    if (visible) {
      scale.setValue(0.8);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, speed: 12, bounciness: 8, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  async function handleShare() {
    await shareResult(solution, guesses, won);
  }

  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}ש׳`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          <View style={[styles.badge, { backgroundColor: won ? COLORS.correct : COLORS.absent }]}>
            <Text style={styles.emoji}>{won ? '🏆' : '🙈'}</Text>
          </View>

          <Text style={styles.title}>{won ? STRINGS.youWon : STRINGS.youLost}</Text>

          {!won && (
            <View style={styles.solutionRow}>
              <Text style={styles.solutionLabel}>{STRINGS.theSolutionWas}: </Text>
              <Text style={styles.solution}>{solution}</Text>
            </View>
          )}

          {/* Emoji recap of the played board */}
          {guesses.length > 0 && (
            <View style={styles.recap}>
              {guesses.map((g, gi) => (
                <Text key={gi} style={styles.recapRow}>
                  {[...g].map((ch, i) => tileEmoji(ch, solution, i)).reverse().join('')}
                </Text>
              ))}
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{won ? guesses.length : '—'}</Text>
              <Text style={styles.statLabel}>{STRINGS.guesses}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{timeStr}</Text>
              <Text style={styles.statLabel}>{STRINGS.time}</Text>
            </View>
          </View>

          {/* Countdown to the next daily puzzle */}
          <View style={styles.countdownRow}>
            <Text style={styles.countdownLabel}>{STRINGS.nextWordIn}</Text>
            <Text style={styles.countdownValue}>{countdown}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.btnShare, pressed && styles.pressed]}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.a11yShare}
          >
            <Text style={styles.btnShareText}>{STRINGS.shareResult} 📤</Text>
          </Pressable>

          <Pressable
            style={styles.btnClose}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.a11yClose}
          >
            <Text style={styles.btnCloseText}>{STRINGS.close}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
    width: '84%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -52,
    marginBottom: SPACING.sm,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  emoji: { fontSize: 40 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  solutionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  solutionLabel: { color: COLORS.textSecondary, fontSize: 15, fontFamily: FONTS.regular },
  solution: { color: COLORS.accent, fontSize: 22, fontWeight: '700', fontFamily: FONTS.bold },
  recap: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  recapRow: {
    fontSize: 15,
    letterSpacing: 2,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    width: '100%',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  countdownRow: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countdownLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  countdownValue: {
    color: COLORS.accent,
    fontSize: 24,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    // Tabular feel so the digits don't jitter as they tick.
    fontVariant: ['tabular-nums'],
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: 22, fontWeight: '700', fontFamily: FONTS.bold },
  statLabel: { color: COLORS.textSecondary, fontSize: 12, fontFamily: FONTS.regular, marginTop: 2 },
  btnShare: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  pressed: { opacity: 0.8 },
  btnShareText: { color: '#000', fontWeight: '700', fontFamily: FONTS.bold, fontSize: 16 },
  btnClose: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    width: '100%',
  },
  btnCloseText: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 14 },
});
