import type { Rule } from '../types';

/**
 * Détecte sirop de glucose (bio ou non), jus concentré de pomme/raisin,
 * sirop d'agave, dextrose. Déclencheur et texte type : voir RULES.md#3-sucres-déguisés.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const sucresDeguisesRule: Rule = (_product, _profile) => {
  return [];
};
