import type { Insight, Rule } from '../../types';

/**
 * Seuils heuristiques provisoires, choisis pour ce prototype — non validés
 * cliniquement. À faire réviser par un professionnel de santé avant mise
 * en production, au même titre que les citations marquées ⚠️ dans
 * RULES.md. Ne pas les présenter comme des seuils officiels dans l'app.
 */
const SODIUM_HIGH_100G = 0.3;
const POTASSIUM_HIGH_100G = 0.6;
const PHOSPHORUS_HIGH_100G = 0.3;

// Sous-ensemble phosphaté du règlement (CE) n° 1333/2008 — le brief cite la
// plage "E338 à E452", qui contient aussi des additifs non phosphatés (voir
// RULES.md#9) ; liste explicite plutôt que la plage brute.
const PHOSPHATE_ADDITIVE_TAGS = new Set([
  'en:e338',
  'en:e339',
  'en:e340',
  'en:e341',
  'en:e343',
  'en:e450',
  'en:e451',
  'en:e452',
]);

const SOURCE = {
  label: 'Recommandation diététique générale (pas de texte réglementaire spécifique)',
  url: 'https://www.mangerbouger.fr/',
};

/**
 * Se déclenche si "renale" fait partie des vigilances déclarées. Sodium,
 * potassium, phosphore élevés, additifs phosphatés. Voir
 * RULES.md#9-profil-fonction-rénale.
 */
export const renalRule: Rule = (product, profile) => {
  if (!profile.vigilances?.includes('renale')) {
    return [];
  }

  const insights: Insight[] = [];
  const nutriments = product.nutriments ?? {};

  const sodium = nutriments['sodium_100g'];
  if (typeof sodium === 'number' && sodium >= SODIUM_HIGH_100G) {
    insights.push({
      id: 'renal-sodium',
      severity: 'vigilance',
      category: 'profil',
      title: 'Teneur en sodium élevée',
      explanation: `Teneur en sodium de ${sodium} g/100g. Une vigilance fréquemment recommandée en cas de suivi de la fonction rénale.`,
      source: SOURCE,
      profileTriggered: 'vigilance:renale',
    });
  }

  const potassium = nutriments['potassium_100g'];
  if (typeof potassium === 'number' && potassium >= POTASSIUM_HIGH_100G) {
    insights.push({
      id: 'renal-potassium',
      severity: 'vigilance',
      category: 'profil',
      title: 'Teneur en potassium élevée',
      explanation: `Teneur en potassium de ${potassium} g/100g. Une vigilance fréquemment recommandée en cas de suivi de la fonction rénale.`,
      source: SOURCE,
      profileTriggered: 'vigilance:renale',
    });
  }

  const phosphorus = nutriments['phosphorus_100g'];
  if (typeof phosphorus === 'number' && phosphorus >= PHOSPHORUS_HIGH_100G) {
    insights.push({
      id: 'renal-phosphore',
      severity: 'vigilance',
      category: 'profil',
      title: 'Teneur en phosphore élevée',
      explanation: `Teneur en phosphore de ${phosphorus} g/100g. Une vigilance fréquemment recommandée en cas de suivi de la fonction rénale.`,
      source: SOURCE,
      profileTriggered: 'vigilance:renale',
    });
  }

  const additiveTags = product.additives_tags ?? [];
  for (const tag of additiveTags) {
    if (PHOSPHATE_ADDITIVE_TAGS.has(tag)) {
      insights.push({
        id: `renal-additif-${tag}`,
        severity: 'vigilance',
        category: 'profil',
        title: 'Additif phosphaté',
        explanation: `Contient un additif phosphaté (${tag.replace('en:', '').toUpperCase()}). Une vigilance fréquemment recommandée en cas de suivi de la fonction rénale.`,
        source: SOURCE,
        profileTriggered: 'vigilance:renale',
      });
    }
  }

  return insights;
};
