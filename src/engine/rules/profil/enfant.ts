import type { Insight, Rule } from '../../types';

/**
 * Seuils heuristiques provisoires — non validés cliniquement, mêmes
 * réserves que src/engine/rules/profil/renal.ts.
 */
const SALT_HIGH_100G = 0.5;
const ADDED_SUGAR_HIGH_100G = 10;

const SOURCE = {
  label: 'Recommandations de santé publique (PNNS, ANSES)',
  url: 'https://www.mangerbouger.fr/',
};

/**
 * Se déclenche si enfantMoinsDeTroisAns === true. Sel, sucres ajoutés.
 * Voir RULES.md#12-profil-enfant-en-bas-âge.
 *
 * Les "additifs déconseillés avant trois ans" prévus par le brief ne sont
 * pas implémentés : je n'ai pas de liste de référence vérifiée pour cette
 * tranche d'âge spécifique — inventer cette liste serait exactement le
 * genre d'approximation que ce projet cherche à éviter.
 */
export const enfantRule: Rule = (product, profile) => {
  if (!profile.enfantMoinsDeTroisAns) {
    return [];
  }

  const insights: Insight[] = [];
  const nutriments = product.nutriments ?? {};

  const salt = nutriments['salt_100g'];
  if (typeof salt === 'number' && salt >= SALT_HIGH_100G) {
    insights.push({
      id: 'enfant-sel',
      severity: 'vigilance',
      category: 'profil',
      title: 'Teneur en sel élevée',
      explanation: `Teneur en sel de ${salt} g/100g. Les repères nutritionnels pour les enfants de moins de trois ans recommandent de limiter les apports en sel.`,
      source: SOURCE,
      profileTriggered: 'enfant',
    });
  }

  // added-sugars_100g uniquement : ne pas retomber sur sugars_100g (sucres
  // totaux, y compris naturellement présents) au risque de conflater deux
  // notions différentes — silence plutôt que devinette.
  const addedSugars = nutriments['added-sugars_100g'];
  if (typeof addedSugars === 'number' && addedSugars >= ADDED_SUGAR_HIGH_100G) {
    insights.push({
      id: 'enfant-sucres-ajoutes',
      severity: 'vigilance',
      category: 'profil',
      title: 'Sucres ajoutés',
      explanation: `Teneur en sucres ajoutés de ${addedSugars} g/100g. Les repères nutritionnels pour les enfants de moins de trois ans recommandent de limiter les sucres ajoutés.`,
      source: SOURCE,
      profileTriggered: 'enfant',
    });
  }

  return insights;
};
