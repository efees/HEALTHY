import type { Rule } from '../types';

const SOURCE = {
  label: 'Analyse Open Food Facts (ingredients_analysis_tags)',
  url: 'https://world.openfoodfacts.org/ingredient/palm-oil',
};

/**
 * Signale la présence d'huile de palme via ingredients_analysis_tags
 * (tag `en:palm-oil`, calculé par Open Food Facts). Repère de lecture, pas
 * une règle de conformité : aucune source réglementaire à citer. Voir
 * RULES.md#4-huile-de-palme.
 *
 * Non testé en positif : les 4 fixtures actuelles sont toutes
 * `palm-oil-free` (voir __tests__/engine/huileDePalme.test.ts, cas marqué
 * .todo).
 */
export const huileDePalmeRule: Rule = (product) => {
  const tags = product.ingredients_analysis_tags ?? [];
  if (!tags.includes('en:palm-oil')) {
    return [];
  }

  return [
    {
      id: 'huile-de-palme',
      severity: 'attention',
      category: 'transformation',
      title: "Repère de lecture — huile de palme",
      explanation:
        "Repère de lecture — contient de l'huile de palme, identifiée par Open Food Facts dans la liste d'ingrédients.",
      source: SOURCE,
    },
  ];
};
