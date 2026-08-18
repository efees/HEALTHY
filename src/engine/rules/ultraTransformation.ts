import type { Rule } from '../types';

/**
 * Signale nova_group === 4 et les marqueurs de texture (gomme xanthane E415,
 * guar E412, caroube E410, pectine E440, inuline, fibre d'acacia,
 * maltodextrine). Déclencheur, source et texte type : voir RULES.md#2-ultra-transformation.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const ultraTransformationRule: Rule = (_product, _profile) => {
  return [];
};
