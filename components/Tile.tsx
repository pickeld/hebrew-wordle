import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import type { LetterState } from '../types';

const STATE_BG: Record<LetterState, string> = {
  correct: COLORS.correct,
  present: COLORS.present,
  absent: COLORS.absent,
  empty: 'transparent',
  tbd: 'transparent',
};

const STATE_BORDER: Record<LetterState, string> = {
  correct: COLORS.correct,
  present: COLORS.present,
  absent: COLORS.absent,
  empty: COLORS.border,
  tbd: COLORS.accentDim,
};

// Hebrew descriptions read aloud by screen readers for each graded tile.
const STATE_A11Y: Record<LetterState, string> = {
  correct: 'במקום הנכון',
  present: 'במילה אך במקום שגוי',
  absent: 'לא במילה',
  empty: '',
  tbd: '',
};

interface TileProps {
  letter: string;
  state: LetterState;
  index: number;
  revealed?: boolean;
  /** True when this tile is part of the winning row (triggers a celebratory bounce). */
  win?: boolean;
}

export function Tile({ letter, state, index, revealed = false, win = false }: TileProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const popAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const prevLetter = useRef('');

  // Flip-to-reveal once a row is submitted.
  useEffect(() => {
    if (revealed && state !== 'empty' && state !== 'tbd') {
      Animated.sequence([
        Animated.delay(index * 130),
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      flipAnim.setValue(0);
    }
  }, [revealed, state]);

  // Pop the tile when a new letter is typed into it.
  useEffect(() => {
    if (letter && letter !== prevLetter.current && state === 'tbd') {
      prevLetter.current = letter;
      Animated.sequence([
        Animated.spring(popAnim, {
          toValue: 1.14,
          speed: 50,
          bounciness: 14,
          useNativeDriver: false,
        }),
        Animated.spring(popAnim, {
          toValue: 1,
          speed: 40,
          bounciness: 10,
          useNativeDriver: false,
        }),
      ]).start();
    }
    if (!letter) prevLetter.current = '';
  }, [letter]);

  // Celebratory bounce wave across the winning row.
  useEffect(() => {
    if (win) {
      Animated.sequence([
        Animated.delay(index * 90 + 350),
        Animated.spring(bounceAnim, {
          toValue: 1,
          speed: 18,
          bounciness: 22,
          useNativeDriver: false,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          speed: 14,
          bounciness: 12,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [win]);

  const bgColor = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: ['transparent', 'transparent', STATE_BG[state], STATE_BG[state]],
  });

  const rotateX = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  // While typing, give the filled (tbd) tile a slightly stronger border.
  const isFilled = state === 'tbd' && !!letter;

  // Only graded tiles convey meaning to screen readers; empty/typing tiles stay silent.
  const a11yDesc = revealed ? STATE_A11Y[state] : '';
  const a11yLabel = letter && a11yDesc ? `${letter}, ${a11yDesc}` : letter || undefined;

  return (
    <Animated.View
      accessible={!!a11yLabel}
      accessibilityLabel={a11yLabel}
      style={[
        styles.tile,
        win && SHADOWS.glow,
        {
          borderColor: isFilled ? COLORS.textSecondary : STATE_BORDER[state],
          backgroundColor: bgColor,
          transform: [
            { perspective: 1000 },
            { scale: popAnim },
            { translateY },
            { rotateX },
          ],
        },
      ]}
    >
      <Text style={styles.letter}>{letter}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: SIZES.tile,
    height: SIZES.tile,
    borderWidth: 2,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.tileGap / 2,
  },
  letter: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
