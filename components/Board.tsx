import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tile } from './Tile';
import { useGameStore } from '../store/useGameStore';
import { SIZES } from '../constants/theme';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export function Board() {
  const { guesses, currentGuess, getTileStates } = useGameStore();
  const tileStates = getTileStates();

  return (
    <View style={styles.board}>
      {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
        const isCurrentRow = rowIdx === guesses.length;
        const rowChars = isCurrentRow
          ? [...currentGuess].concat(Array(WORD_LENGTH).fill('')).slice(0, WORD_LENGTH)
          : ([...(guesses[rowIdx] ?? '')].concat(Array(WORD_LENGTH).fill('')).slice(0, WORD_LENGTH));

        return (
          <View key={rowIdx} style={styles.row}>
            {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => (
              <Tile
                key={colIdx}
                letter={rowChars[colIdx] ?? ''}
                state={tileStates[rowIdx]?.[colIdx] ?? 'empty'}
                index={colIdx}
                revealed={!isCurrentRow && rowIdx < guesses.length}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row-reverse', // Hebrew RTL
  },
});
