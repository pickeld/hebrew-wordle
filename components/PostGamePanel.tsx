import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { STRINGS } from '../constants/strings';
import { useGameStore } from '../store/useGameStore';
import { shareResult } from '../lib/share';
import { useNextPuzzleCountdown } from '../lib/time';

interface Props {
  /** Re-open the full result modal. */
  onViewResult: () => void;
}

/**
 * Shown in place of the keyboard once the daily game is finished. Keeps the
 * player oriented (the game is over, here's when the next word lands) and gives
 * them something to do — re-open their result or share it — instead of staring
 * at an inert keyboard.
 */
export function PostGamePanel({ onViewResult }: Props) {
  const { gameStatus, solution, guesses } = useGameStore();
  const won = gameStatus === 'won';
  const countdown = useNextPuzzleCountdown(true);

  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>{won ? STRINGS.youWon : STRINGS.gameOver}</Text>

      <View style={styles.countdownBlock}>
        <Text style={styles.countdownLabel}>{STRINGS.nextWordIn}</Text>
        <Text style={styles.countdownValue}>{countdown}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
          onPress={onViewResult}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.a11yViewResult}
        >
          <Text style={styles.btnPrimaryText}>{STRINGS.viewResult}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btnSecondary, pressed && styles.pressed]}
          onPress={() => shareResult(solution, guesses, won)}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.a11yShare}
        >
          <Text style={styles.btnSecondaryText}>📤 {STRINGS.shareResult}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    alignItems: 'center',
  },
  heading: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.sm,
  },
  countdownBlock: {
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
    fontSize: 30,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: SPACING.sm,
    width: '100%',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#000', fontFamily: FONTS.bold, fontSize: 15 },
  btnSecondary: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnSecondaryText: { color: COLORS.text, fontFamily: FONTS.semiBold, fontSize: 15 },
  pressed: { opacity: 0.8 },
});
