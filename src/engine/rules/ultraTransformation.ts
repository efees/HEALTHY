import type { Insight, Rule } from '../types';

const NOVA_SOURCE = {
  label: 'Classification NOVA (Monteiro et al., Université de São Paulo)',
  url: 'https://world.openfoodfacts.org/nova',
};

// E-numbers structurés (additives_tags), fiables — pas de parsing de texte libre.
const TEXTURE_ADDITIVE_TAGS: Record<string, string> = {
  'en:e415': 'gomme xanthane (E415)',
  'en:e412': 'gomme guar (E412)',
  'en:e410': 'gomme de caroube (E410)',
  'en:e440': 'pectine (E440)',
};

// Pas de code E dans le vocabulaire OFF pour ces trois-là : recherche dans
// le texte libre, mais motif simple (mot isolé), pas de grammaire à
// interpréter façon "arôme naturel de X" — risque de faux positif bien
// moindre.
const TEXTURE_TEXT_MARKERS: Record<string, RegExp> = {
  inuline: /\binuline\b/i,
  "fibre d'acacia": /\bfibres?\s+d['’]acacia\b/i,
  maltodextrine: /\bmaltodextrine\b/i,
};

const TEXTURE_SOURCE = {
  label: 'Règlement (CE) n° 1333/2008 sur les additifs alimentaires',
  url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32008R1333',
};

/**
 * Signale nova_group === 4 et les marqueurs de texture (gomme xanthane E415,
 * guar E412, caroube E410, pectine E440, inuline, fibre d'acacia,
 * maltodextrine). NOVA n'est pas une norme officielle : le texte nomme son
 * origine académique. Voir RULES.md#2-ultra-transformation.
 *
 * Non testé en positif : aucune fixture actuelle n'est NOVA 4 ni ne
 * contient ces marqueurs (voir __tests__/engine/ultraTransformation.test.ts,
 * cas marqués .todo).
 */
export const ultraTransformationRule: Rule = (product) => {
  const insights: Insight[] = [];

  if (product.nova_group === 4) {
    insights.push({
      id: 'ultra-transformation-nova4',
      severity: 'attention',
      category: 'transformation',
      title: 'Classé NOVA 4 (aliment ultra-transformé)',
      explanation:
        "Classé NOVA 4 (aliment ultra-transformé) selon la classification NOVA, développée par l'Université de São Paulo (équipe Monteiro) et reprise par Open Food Facts — ce n'est pas une norme officielle.",
      source: NOVA_SOURCE,
    });
  }

  const additiveTags = product.additives_tags ?? [];
  for (const tag of additiveTags) {
    const label = TEXTURE_ADDITIVE_TAGS[tag];
    if (label) {
      insights.push({
        id: `ultra-transformation-additif-${tag}`,
        severity: 'attention',
        category: 'transformation',
        title: 'Additif texturant',
        explanation: `Contient ${label}, un additif texturant autorisé en bio.`,
        source: TEXTURE_SOURCE,
      });
    }
  }

  const text = product.ingredients_text_fr;
  if (text) {
    for (const [label, pattern] of Object.entries(TEXTURE_TEXT_MARKERS)) {
      if (pattern.test(text)) {
        insights.push({
          id: `ultra-transformation-texte-${label}`,
          severity: 'attention',
          category: 'transformation',
          title: 'Ingrédient texturant',
          explanation: `Contient ${label}, un ingrédient texturant fréquent dans les produits transformés.`,
          source: TEXTURE_SOURCE,
        });
      }
    }
  }

  return insights;
};
