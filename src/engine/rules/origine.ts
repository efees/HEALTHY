import type { Rule } from '../types';

/**
 * Croise origins_tags, manufacturing_places et countries_tags ; signale
 * explicitement une origine des matières premières absente ou floue.
 * Voir RULES.md#6-origine.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const origineRule: Rule = (_product, _profile) => {
  return [];
};
