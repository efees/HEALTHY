import type { Rule } from '../../types';

/**
 * Se déclenche si profile.enfantMoinsDeTroisAns === true. Sel, sucres
 * ajoutés, additifs déconseillés avant trois ans. Voir RULES.md#12-profil-enfant-en-bas-âge.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const enfantRule: Rule = (_product, _profile) => {
  return [];
};
