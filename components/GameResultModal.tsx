import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { STRINGS } from '../constants/strings';
import { useGameStore } from '../store/useGameStore';

function buildShareText(solution: string, guesses: string[], won: boolean): string {
  const emoji = won ? '🎉 ניצחתי!' : '😔 הפסדתי';
  const header = `וורדל עברי ${emoji} (${guesses.length}/6)`;
  const board = guesses
    .map((g) =>
      [...g]
        .map((ch, i) => {
          if (ch === [...solution][i]) return '🟩';
          if ([...solution].includes(ch)) return '🟨';
          return '⬛';
        })
        .reverse()
        .join('')
    )
    .join('\n');
  return `${header}\n${board}`;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  timeSeconds: number;
}

export function GameResultModal({ visible, onClose, timeSeconds }: Props) {
  const { gameStatus, solution, guesses } = useGameStore();
  const won = gameStatus === 'won';

  async function handleShare() {
    await Share.share({ message: buildShareText(solution, guesses, won) });
  }

  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}ש׳`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>{won ? '🏆' : '😔'}</Text>
          <Text style={styles.title}>{won ? STRINGS.youWon : STRINGS.youLost}</Text>

          {!won && (
            <View style={styles.solutionRow}>
              <Text style={styles.solutionLabel}>{STRINGS.theSolutionWas}: </Text>
              <Text style={styles.solution}>{solution}</Text>
            </View>
          )}

          {won && (
            <Text style={styles.stat}>
              {guesses.length} ניחושים • {timeStr}
            </Text>
          )}

          <TouchableOpacity style={styles.btnShare} onPress={handleShare}>
            <Text style={styles.btnShareText}>{STRINGS.shareResult} 📤</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnCloseText}>סגור</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '82%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emoji: { fontSize: 52, marginBottom: 8 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  solutionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  solutionLabel: { color: COLORS.textSecondary, fontSize: 15, fontFamily: FONTS.regular },
  solution: { color: COLORS.accent, fontSize: 22, fontWeight: '700', fontFamily: FONTS.bold },
  stat: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginBottom: 20,
  },
  btnShare: {
    backgroundColor: COLORS.accent,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  btnShareText: { color: '#000', fontWeight: '700', fontFamily: FONTS.bold, fontSize: 16 },
  btnClose: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  btnCloseText: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 14 },
});
