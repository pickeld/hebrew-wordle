import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Tile } from './Tile';
import { useGameStore } from '../store/useGameStore';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export interface BoardHandle {
  /** Shake the active row to signal an invalid guess. */
  shake: () => void;
}

export const Board = forwardRef<BoardHandle>(function Board(_, ref) {
  const { guesses, currentGuess, gameStatus, getTileStates } = useGameStore();
  const tileStates = getTileStates();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    shake: () => {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0.6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -0.6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    },
  }));

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-9, 9],
  });

  const activeRow = guesses.length;
  const winningRow = gameStatus === 'won' ? guesses.length - 1 : -1;

  return (
    <View style={styles.board}>
      {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
        const isCurrentRow = rowIdx === activeRow;
        const rowChars = isCurrentRow
          ? [...currentGuess].concat(Array(WORD_LENGTH).fill('')).slice(0, WORD_LENGTH)
          : ([...(guesses[rowIdx] ?? '')].concat(Array(WORD_LENGTH).fill('')).slice(0, WORD_LENGTH));

        const isActivePlaying = isCurrentRow && gameStatus === 'playing';

        return (
          <Animated.View
            key={rowIdx}
            style={[
              styles.row,
              isActivePlaying && { transform: [{ translateX: shakeTranslate }] },
            ]}
          >
            {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => (
              <Tile
                key={colIdx}
                letter={rowChars[colIdx] ?? ''}
                state={tileStates[rowIdx]?.[colIdx] ?? 'empty'}
                index={colIdx}
                revealed={!isCurrentRow && rowIdx < guesses.length}
                win={rowIdx === winningRow}
              />
            ))}
          </Animated.View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  board: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row-reverse', // Hebrew RTL
  },
});
