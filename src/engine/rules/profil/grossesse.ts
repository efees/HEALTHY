import type { Rule } from '../../types';

/**
 * Se déclenche uniquement si profile.grossesseOuAllaitement === true (jamais
 * sur une valeur non renseignée). Alcool, foie/abats, fromages au lait cru,
 * soja/phytoestrogènes, caféine. Voir RULES.md#8-profil-grossesse.
 *
 * Logique non implémentée : en attente des fixtures réelles (étape 3b).
 */
export const grossesseRule: Rule = (_product, _profile) => {
  return [];
};
