import type { Rule } from '../types';

/**
 * Détecte les arômes qui ne nomment pas leur source (« arôme naturel » seul,
 * ou « arôme naturel goût X » plutôt que « arôme naturel de X »).
 * Déclencheur, source réglementaire et texte type : voir RULES.md#1-arômes.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const aromeRule: Rule = (_product, _profile) => {
  return [];
};
