export const COLORS = {
  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceAlt: '#16213e',
  border: '#2a2a4a',

  correct: '#6aaa64',
  present: '#c9b458',
  absent: '#3a3a5c',

  text: '#ffffff',
  textSecondary: '#8888aa',
  textMuted: '#555577',

  accent: '#f0c040',
  accentDim: '#c09830',

  danger: '#e05555',
  success: '#6aaa64',

  adBanner: '#111122',
};

export const FONTS = {
  regular: 'Assistant_400Regular',
  semiBold: 'Assistant_600SemiBold',
  bold: 'Assistant_700Bold',
};

export const SIZES = {
  tile: 54,
  tileGap: 5,
  keyHeight: 52,
  borderRadius: 6,
};

// Shared rounded-corner scale for cards, keys, buttons.
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

// Consistent vertical/horizontal rhythm.
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

// Reusable elevation presets (work on both native and web).
export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  key: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  glow: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
};
