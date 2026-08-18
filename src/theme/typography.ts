import { Platform } from 'react-native';

/**
 * Police système uniquement : elle suit les réglages d'accessibilité de
 * l'utilisateur (taille de police système, y compris au-delà de 200 %),
 * ce qu'une police embarquée ne ferait pas.
 *
 * La hiérarchie de sévérité des insights (info / attention / vigilance) se
 * fait par poids typographique et ordre d'affichage — jamais par teinte.
 */
export const fontFamily = Platform.select({
  ios: undefined,
  android: undefined,
  default: undefined,
});

export const typography = {
  displayTitle: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  screenTitle: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  sectionTitle: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },

  // Sévérité des insights, du plus au moins appuyé.
  insightVigilance: { fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  insightAttention: { fontSize: 16, fontWeight: '600' as const, lineHeight: 21 },
  insightInfo: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20 },

  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21 },
  bodyMuted: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
} as const;

/** Multiplicateur max pour les libellés courts qui casseraient sinon la mise en page ; à utiliser au cas par cas, jamais par défaut. */
export const CONSTRAINED_MAX_FONT_SCALE = 2;
