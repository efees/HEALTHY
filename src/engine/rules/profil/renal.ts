import type { Rule } from '../../types';

/**
 * Se déclenche si profile.vigilances inclut 'renale'. Sodium, potassium,
 * phosphore, additifs phosphatés. Voir RULES.md#9-profil-fonction-rénale.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const renalRule: Rule = (_product, _profile) => {
  return [];
};
