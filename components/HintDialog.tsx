import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { STRINGS } from '../constants/strings';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Themed confirmation dialog for the "watch an ad for a hint" flow.
 * Replaces the OS-native Alert so the prompt matches the game's dark UI.
 */
export function HintDialog({ visible, onCancel, onConfirm }: Props) {
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View
          style={[styles.card, { opacity, transform: [{ scale }] }]}
          // Swallow taps on the card so they don't dismiss via the overlay.
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>💡</Text>
          </View>

          <Text style={styles.title}>{STRINGS.hintTitle}</Text>
          <Text style={styles.body}>{STRINGS.hintPrompt}</Text>

          <Pressable
            style={({ pressed }) => [styles.btnConfirm, pressed && styles.pressed]}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.watchAd}
          >
            <Text style={styles.btnConfirmText}>▶  {STRINGS.watchAd}</Text>
          </Pressable>

          <Pressable
            style={styles.btnCancel}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.cancel}
          >
            <Text style={styles.btnCancelText}>{STRINGS.cancel}</Text>
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
    width: '84%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -48,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  badgeEmoji: { fontSize: 30 },
  title: {
    fontSize: 22,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  body: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  btnConfirm: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  pressed: { opacity: 0.8 },
  btnConfirmText: { color: '#000', fontFamily: FONTS.bold, fontSize: 16 },
  btnCancel: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    width: '100%',
  },
  btnCancelText: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 14 },
});
