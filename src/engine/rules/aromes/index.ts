import type { Rule } from '../../types';
import { parseAromeMentions } from './parser';

const SOURCE = {
  label: 'Règlement (CE) n° 1334/2008 sur les arômes',
  // Lien vers le texte du règlement (pas vers un article précis : le numéro
  // d'article exact n'est pas encore confirmé, voir RULES.md#1-arômes).
  url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32008R1334',
};

/**
 * N'émet un insight que pour les mentions classées 'non-conforme' par le
 * parser — et seulement si AUCUNE mention du texte n'est 'incertaine'. Une
 * seule mention ambiguë suffit à faire taire toute la règle pour ce
 * produit : un signalement partiel (« cette mention-ci est non conforme »)
 * à côté d'une mention qu'on n'a pas su trancher donnerait une impression
 * de certitude que le moteur n'a pas. Le silence total est préférable à un
 * verdict partiel — voir RULES.md#1-arômes.
 */
export const aromeRule: Rule = (product) => {
  const text = product.ingredients_text_fr;
  if (!text) {
    return [];
  }

  const mentions = parseAromeMentions(text);
  const hasUncertainty = mentions.some((mention) => mention.verdict === 'incertain');
  if (hasUncertainty) {
    return [];
  }

  return mentions
    .filter((mention) => mention.verdict === 'non-conforme')
    .map((mention, index) => ({
      id: `arome-${index}`,
      severity: 'attention',
      category: 'arome',
      title: 'Arôme sans source nommée',
      explanation: `Cet ingrédient est étiqueté « ${mention.raw} ». La mention « arôme naturel de [ingrédient] » impliquerait qu'au moins 95 % de l'arôme provient de cette source nommée.`,
      source: SOURCE,
    }));
};
