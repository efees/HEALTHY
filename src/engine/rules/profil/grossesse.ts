import type { Insight, Rule } from '../../types';

interface Marker {
  id: string;
  pattern: RegExp;
  explanation: string;
}

/**
 * Motifs simples (mot ou expression isolée), pas la grammaire "de X" des
 * arômes — risque de faux positif nettement plus faible. Les justifications
 * entre parenthèses (listériose, vitamine A…) sont des repères de sens
 * courant, pas une citation vérifiée — voir l'avertissement ⚠️ de
 * RULES.md#8-profil-grossesse, qui s'applique aussi à ces libellés.
 */
const MARKERS: Marker[] = [
  {
    id: 'alcool',
    pattern: /\balcool\b/i,
    explanation: "Contient de l'alcool. Les recommandations de santé publique préconisent de l'éviter pendant la grossesse.",
  },
  {
    id: 'foie-abats',
    pattern: /\b(foie|abats)\b/i,
    explanation: 'Contient du foie ou des abats. Une vigilance fréquemment recommandée pendant la grossesse.',
  },
  {
    id: 'lait-cru',
    pattern: /lait\s+cru/i,
    explanation: 'Contient du lait cru. Une vigilance fréquemment recommandée pendant la grossesse.',
  },
  {
    id: 'soja',
    pattern: /\bsoja\b/i,
    explanation: 'Contient du soja. Une vigilance fréquemment recommandée pendant la grossesse.',
  },
  {
    id: 'cafeine',
    pattern: /\bcaf[eé]ine\b/i,
    explanation: 'Contient de la caféine. Une vigilance fréquemment recommandée pendant la grossesse.',
  },
];

const SOURCE = {
  label: 'Recommandations de santé publique (ANSES, Santé publique France)',
  url: 'https://www.mangerbouger.fr/',
};

/**
 * Se déclenche uniquement si grossesseOuAllaitement === true (jamais sur
 * une valeur non renseignée). Alcool, foie/abats, fromages au lait cru,
 * soja, caféine. Voir RULES.md#8-profil-grossesse.
 */
export const grossesseRule: Rule = (product, profile) => {
  if (!profile.grossesseOuAllaitement) {
    return [];
  }

  const text = product.ingredients_text_fr;
  if (!text) {
    return [];
  }

  const insights: Insight[] = [];
  for (const marker of MARKERS) {
    if (marker.pattern.test(text)) {
      insights.push({
        id: `grossesse-${marker.id}`,
        severity: 'vigilance',
        category: 'profil',
        title: marker.explanation.split('.')[0],
        explanation: marker.explanation,
        source: SOURCE,
        profileTriggered: 'grossesse',
      });
    }
  }

  return insights;
};
