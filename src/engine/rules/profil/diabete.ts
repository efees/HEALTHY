import type { Rule } from '../../types';

/**
 * Se déclenche si profile.vigilances inclut 'glycemique'. Sucres pour 100g,
 * index glycémique des ingrédients dominants. Voir RULES.md#10-profil-diabète.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const diabeteRule: Rule = (_product, _profile) => {
  return [];
};
