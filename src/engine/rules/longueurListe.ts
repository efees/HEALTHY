import type { Rule } from '../types';

/**
 * Signale plus de huit ingrédients sur un produit bio, ou la présence d'un
 * ingrédient absent d'une cuisine domestique. Heuristique éditoriale interne,
 * repère de lecture — pas une règle de conformité, pas une source
 * réglementaire. Voir RULES.md#7-longueur-de-liste.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const longueurListeRule: Rule = (_product, _profile) => {
  return [];
};
