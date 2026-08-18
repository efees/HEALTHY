import type { Rule } from '../types';

/**
 * Signale la présence d'huile de palme via ingredients_analysis_tags
 * (tag `en:palm-oil`, calculé par Open Food Facts). Voir RULES.md#4-huile-de-palme.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const huileDePalmeRule: Rule = (_product, _profile) => {
  return [];
};
