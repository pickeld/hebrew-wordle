import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
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
  empty: COLORS.surface,
  tbd: COLORS.surface,
};

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
            const isEnter = key === 'ENTER';
            const isDel = key === 'DEL';
            const state: LetterState = (!isEnter && !isDel && letterStates[key]) ? letterStates[key] : 'empty';
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  (isEnter || isDel) && styles.keyWide,
                  { backgroundColor: KEY_COLORS[state] },
                ]}
                onPress={isEnter ? onSubmit : isDel ? onDelete : () => onLetter(key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.keyLabel, (isEnter || isDel) && styles.keyLabelSmall]}>
                  {isEnter ? 'אישור' : isDel ? '⌫' : key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { width: '100%', paddingHorizontal: 6, gap: 5 },
  row: { flexDirection: 'row-reverse', justifyContent: 'center', gap: 4 },
  key: {
    height: SIZES.keyHeight,
    minWidth: 30,
    paddingHorizontal: 7,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keyWide: { minWidth: 58, paddingHorizontal: 10 },
  keyLabel: { color: COLORS.text, fontSize: 18, fontWeight: '700', fontFamily: FONTS.bold },
  keyLabelSmall: { fontSize: 13 },
});
