export { colors } from './colors';
export { typography, CONSTRAINED_MAX_FONT_SCALE } from './typography';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Cible tactile minimale (44pt) pour tout élément interactif. */
export const minTouchTarget = 44;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
} as const;
