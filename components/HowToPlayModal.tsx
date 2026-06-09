import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { STRINGS } from '../constants/strings';
import type { LetterState } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const STATE_BG: Record<'correct' | 'present' | 'absent', string> = {
  correct: COLORS.correct,
  present: COLORS.present,
  absent: COLORS.absent,
};

/** A compact 5-tile example row with one highlighted tile demonstrating a state. */
function ExampleRow({
  word,
  highlightIndex,
  state,
  description,
}: {
  word: string;
  highlightIndex: number;
  state: 'correct' | 'present' | 'absent';
  description: string;
}) {
  const chars = [...word];
  return (
    <View style={styles.example}>
      <View style={styles.exampleRow}>
        {chars.map((ch, i) => {
          const on = i === highlightIndex;
          return (
            <View
              key={i}
              style={[
                styles.miniTile,
                on
                  ? { backgroundColor: STATE_BG[state], borderColor: STATE_BG[state] }
                  : { borderColor: COLORS.border },
              ]}
            >
              <Text style={styles.miniLetter}>{ch}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.exampleText}>{description}</Text>
    </View>
  );
}

/**
 * First-run / on-demand onboarding modal that teaches the rules and the
 * meaning of each tile colour. Mirrors the themed HintDialog presentation.
 */
export function HowToPlayModal({ visible, onClose }: Props) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.85);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, speed: 14, bounciness: 7, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.card, { opacity, transform: [{ scale }] }]}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.title}>{STRINGS.howToTitle}</Text>
          <Text style={styles.intro}>{STRINGS.howToIntro}</Text>

          <View style={styles.examples}>
            <ExampleRow
              word="שולחן"
              highlightIndex={0}
              state="correct"
              description={STRINGS.howToCorrect}
            />
            <ExampleRow
              word="פרחים"
              highlightIndex={2}
              state="present"
              description={STRINGS.howToPresent}
            />
            <ExampleRow
              word="חברים"
              highlightIndex={4}
              state="absent"
              description={STRINGS.howToAbsent}
            />
          </View>

          <Text style={styles.footer}>{STRINGS.howToFooter}</Text>

          <Pressable
            style={({ pressed }) => [styles.btnClose, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.gotIt}
          >
            <Text style={styles.btnCloseText}>{STRINGS.gotIt}</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
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
    width: '88%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.sm,
  },
  intro: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
    writingDirection: 'rtl',
  },
  examples: {
    width: '100%',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  example: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  exampleRow: {
    flexDirection: 'row-reverse',
    gap: 4,
  },
  miniTile: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniLetter: {
    fontSize: 18,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    includeFontPadding: false,
  },
  exampleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  footer: {
    fontSize: 13,
    color: COLORS.accent,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  btnClose: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    width: '100%',
  },
  pressed: { opacity: 0.8 },
  btnCloseText: { color: '#000', fontFamily: FONTS.bold, fontSize: 16 },
});
