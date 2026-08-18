import type { Rule } from '../types';

/**
 * Signale nova_group === 4 et les marqueurs de texture (gomme xanthane E415,
 * guar E412, caroube E410, pectine E440, inuline, fibre d'acacia,
 * maltodextrine). NOVA n'est pas une norme officielle : le texte affiché
 * doit nommer son origine académique (Université de São Paulo, équipe
 * Monteiro), jamais la présenter comme réglementaire. Déclencheur, source et
 * texte type : voir RULES.md#2-ultra-transformation.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const ultraTransformationRule: Rule = (_product, _profile) => {
  return [];
};
