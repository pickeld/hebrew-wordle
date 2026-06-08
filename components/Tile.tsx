import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
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
  tbd: COLORS.textSecondary,
};

interface TileProps {
  letter: string;
  state: LetterState;
  index: number;
  revealed?: boolean;
}

export function Tile({ letter, state, index, revealed = false }: TileProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevLetter = useRef('');

  useEffect(() => {
    if (revealed && state !== 'empty' && state !== 'tbd') {
      Animated.sequence([
        Animated.delay(index * 120),
        Animated.timing(flipAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [revealed, state]);

  useEffect(() => {
    if (letter && letter !== prevLetter.current && state === 'tbd') {
      prevLetter.current = letter;
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.12, duration: 70, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 70, useNativeDriver: true }),
      ]).start();
    }
  }, [letter]);

  const bgColor = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: ['transparent', 'transparent', STATE_BG[state], STATE_BG[state]],
  });

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          borderColor: STATE_BORDER[state],
          backgroundColor: bgColor,
          transform: [
            { scaleX: scaleAnim },
            { scaleY: scaleAnim },
            { perspective: 1000 },
            { rotateY },
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
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
});
