import type { Insight, RegulatedAllergen, Rule } from '../../types';

// Correspondance avec les tags Open Food Facts pour les 14 allergènes à
// déclaration obligatoire (règlement (UE) n° 1169/2011, annexe II).
const ALLERGEN_TAGS: Record<RegulatedAllergen, string> = {
  gluten: 'en:gluten',
  crustaces: 'en:crustaceans',
  oeufs: 'en:eggs',
  poisson: 'en:fish',
  arachides: 'en:peanuts',
  soja: 'en:soybeans',
  lait: 'en:milk',
  'fruits-a-coque': 'en:nuts',
  celeri: 'en:celery',
  moutarde: 'en:mustard',
  'graines-de-sesame': 'en:sesame-seeds',
  'anhydride-sulfureux-et-sulfites': 'en:sulphur-dioxide-and-sulphites',
  lupin: 'en:lupin',
  mollusques: 'en:molluscs',
};

const ALLERGEN_LABELS: Record<RegulatedAllergen, string> = {
  gluten: 'gluten',
  crustaces: 'crustacés',
  oeufs: 'œufs',
  poisson: 'poisson',
  arachides: 'arachides',
  soja: 'soja',
  lait: 'lait',
  'fruits-a-coque': 'fruits à coque',
  celeri: 'céleri',
  moutarde: 'moutarde',
  'graines-de-sesame': 'graines de sésame',
  'anhydride-sulfureux-et-sulfites': 'anhydride sulfureux et sulfites',
  lupin: 'lupin',
  mollusques: 'mollusques',
};

const SOURCE = {
  label: 'Règlement (UE) n° 1169/2011, annexe II',
  url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1169',
};

/**
 * Croise allergens_tags et traces_tags avec les allergies déclarées dans le
 * profil. Ne se déclenche que si le profil en déclare au moins une — un
 * profil vide n'implique aucune allergie. Voir RULES.md#11-profil-allergies.
 */
export const allergiesRule: Rule = (product, profile) => {
  const declared = profile.allergies ?? [];
  if (declared.length === 0) {
    return [];
  }

  const allergenTags = product.allergens_tags ?? [];
  const traceTags = product.traces_tags ?? [];
  const insights: Insight[] = [];

  for (const allergen of declared) {
    const tag = ALLERGEN_TAGS[allergen];
    const label = ALLERGEN_LABELS[allergen];

    if (allergenTags.includes(tag)) {
      insights.push({
        id: `allergie-${allergen}`,
        severity: 'vigilance',
        category: 'profil',
        title: `Contient ${label}`,
        explanation: `Contient ${label}. Vous avez déclaré une allergie à ${label} dans votre profil.`,
        source: SOURCE,
        profileTriggered: `allergie:${allergen}`,
      });
    } else if (traceTags.includes(tag)) {
      insights.push({
        id: `trace-${allergen}`,
        severity: 'vigilance',
        category: 'profil',
        title: `Traces possibles de ${label}`,
        explanation: `Peut contenir des traces de ${label}. Vous avez déclaré une allergie à ${label} dans votre profil.`,
        source: SOURCE,
        profileTriggered: `allergie:${allergen}`,
      });
    }
  }

  return insights;
};
