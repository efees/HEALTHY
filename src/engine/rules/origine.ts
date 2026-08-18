import { formatTagLabel } from '../../utils/formatTags';
import type { Rule } from '../types';

const SOURCE = {
  label: 'Règlement (UE) 2018/848 relatif à la production biologique',
  url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R0848',
};

// Valeurs d'agrégat du référentiel OFF : une origine déclarée, mais pas un
// pays précis. À distinguer d'un vrai pays (en:france, en:germany…).
const VAGUE_ORIGIN_TAGS = new Set([
  'en:unknown',
  'en:european-union',
  'en:non-european-union',
  'en:european-union-and-non-european-union',
]);

/**
 * Croise origins_tags, manufacturing_places et countries_tags. Signale
 * explicitement une origine des matières premières absente, ou déclarée de
 * façon large (agrégat "Union européenne et hors UE", etc.) sans pays
 * précis — voir RULES.md#6-origine.
 */
export const origineRule: Rule = (product) => {
  const origins = product.origins_tags ?? [];
  const hasPreciseOrigin = origins.some((tag) => !VAGUE_ORIGIN_TAGS.has(tag));

  if (hasPreciseOrigin) {
    return [];
  }

  const manufacturingNote = product.manufacturing_places
    ? ` Lieu de fabrication : ${product.manufacturing_places}.`
    : '';

  if (origins.length > 0) {
    return [
      {
        id: 'origine-floue',
        severity: 'info',
        category: 'origine',
        title: 'Origine des matières premières déclarée de façon large',
        explanation: `L'origine des matières premières est déclarée de façon large (${origins
          .map(formatTagLabel)
          .join(', ')}), sans pays précis.${manufacturingNote}`,
        source: SOURCE,
      },
    ];
  }

  const countries = product.countries_tags ?? [];
  const soldIn =
    countries.length > 0
      ? ` (seul le pays de vente, ${countries.map(formatTagLabel).join(', ')}, est renseigné)`
      : '';

  return [
    {
      id: 'origine-absente',
      severity: 'attention',
      category: 'origine',
      title: 'Origine des matières premières non précisée',
      explanation: `L'origine des matières premières n'est pas précisée pour ce produit${soldIn}.${manufacturingNote}`,
      source: SOURCE,
    },
  ];
};
