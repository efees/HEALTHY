import type { Rule } from '../../types';

/**
 * Croise allergens_tags et traces_tags avec profile.allergies. Voir
 * RULES.md#11-profil-allergies.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const allergiesRule: Rule = (_product, _profile) => {
  return [];
};
