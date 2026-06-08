import React, { useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, RADIUS, SHADOWS } from '../constants/theme';
import { useGameStore } from '../store/useGameStore';
import type { LetterState } from '../types';

const KEYBOARD_ROWS = [
  ['פ', 'ו', 'ט', 'א', 'ר', 'ק', 'ץ', 'ף'],
  ['ל', 'ח', 'י', 'כ', 'ע', 'נ', 'מ', 'ן', 'ך'],
  ['DEL', 'ז', 'ס', 'ב', 'ה', 'ש', 'ד', 'ג', 'ENTER'],
  ['צ', 'ת', 'ם'],
];

const KEY_COLORS: Record<LetterState, string> = {
  correct: COLORS.correct,
  present: COLORS.present,
  absent: COLORS.absent,
  empty: COLORS.surfaceAlt,
  tbd: COLORS.surfaceAlt,
};

interface KeyProps {
  label: string;
  bg: string;
  wide?: boolean;
  small?: boolean;
  onPress: () => void;
}

function Key({ label, bg, wide, small, onPress }: KeyProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.88,
      speed: 50,
      bounciness: 0,
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      speed: 40,
      bounciness: 12,
      useNativeDriver: true,
    }).start();

  // Letter keys that have already been graded get a tinted border for depth.
  const isGraded = bg !== COLORS.surfaceAlt;

  return (
    <Animated.View style={[styles.keyWrap, wide && styles.keyWrapWide, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        android_disableSound={false}
        style={[
          styles.key,
          wide && styles.keyWide,
          {
            backgroundColor: bg,
            borderColor: isGraded ? 'rgba(255,255,255,0.18)' : COLORS.border,
          },
        ]}
      >
        <Text style={[styles.keyLabel, small && styles.keyLabelSmall]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

interface Props {
  onSubmit: () => void;
  onDelete: () => void;
  onLetter: (l: string) => void;
}

export function HebrewKeyboard({ onSubmit, onDelete, onLetter }: Props) {
  const { letterStates } = useGameStore();

  return (
    <View style={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((key) => {
            if (key === 'ENTER') {
              return <Key key={key} label="אישור" bg={COLORS.accentDim} wide small onPress={onSubmit} />;
            }
            if (key === 'DEL') {
              return <Key key={key} label="⌫" bg={COLORS.surfaceAlt} wide onPress={onDelete} />;
            }
            const state: LetterState = letterStates[key] ?? 'empty';
            return (
              <Key
                key={key}
                label={key}
                bg={KEY_COLORS[state]}
                onPress={() => onLetter(key)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { width: '100%', paddingHorizontal: 5, gap: 7 },
  row: { flexDirection: 'row-reverse', justifyContent: 'center', gap: 5 },
  keyWrap: { flex: 1, maxWidth: 42 },
  keyWrapWide: { flex: 1.6, maxWidth: 66 },
  key: {
    height: SIZES.keyHeight,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...SHADOWS.key,
  },
  keyWide: {},
  keyLabel: { color: COLORS.text, fontSize: 19, fontWeight: '700', fontFamily: FONTS.bold },
  keyLabelSmall: { fontSize: 14, color: '#000' },
});
