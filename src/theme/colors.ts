/**
 * Palette volontairement neutre : aucune couleur ne doit pouvoir être lue
 * comme un jugement sur un produit (pas de vert "validé", pas de rouge
 * "danger"). L'accent est réservé aux actions de l'interface, jamais à un
 * insight ou à une certification.
 */
export const colors = {
  background: '#FAFAF7',
  surface: '#FFFFFF',
  ink: '#1A1A18',
  inkMuted: '#5C5C57',
  border: '#DEDDD5',

  accent: '#1F3A5F',
  accentMuted: '#3C5878',
  onAccent: '#FFFFFF',

  // Réservé aux états de formulaire (ex. champ invalide), jamais à une
  // lecture produit ou à un insight du moteur de règles.
  formError: '#B3261E',
} as const;

export type ColorToken = keyof typeof colors;
