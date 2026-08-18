import type { Rule } from '../types';

/**
 * Lit labels_tags pour distinguer une certification officielle (Eurofeuille/AB)
 * d'un cahier des charges privé (Demeter, Nature et Progrès, Bio Cohérence) ou
 * d'une mention marketing libre. Voir RULES.md#5-certification.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const certificationRule: Rule = (_product, _profile) => {
  return [];
};
