import type { Insight, Rule } from '../types';

const OFFICIAL_SOURCE = {
  label: 'Règlement (UE) 2018/848 relatif à la production biologique',
  url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R0848',
};

const OFFICIAL_ORGANIC_TAGS = new Set(['en:eu-organic', 'fr:ab-agriculture-biologique']);

// Codes d'organisme certificateur observés sur de vraies fixtures :
// FR-BIO-01, DE-ÖKO-001, GB-ORG-05, NL-BIO-01. Le suffixe varie par pays
// (bio / öko / org) — motif large plutôt qu'une énumération fermée, à
// élargir si d'autres formats apparaissent sur de nouvelles fixtures.
const CERTIFIER_CODE_PATTERN = /^en:([a-z]{2})-(bio|oko|org)-(\d+)$/i;

/**
 * Labels privés distincts de la certification bio officielle. Slugs non
 * vérifiés sur une vraie fixture — aucune des fixtures actuelles ne les
 * porte — à confirmer dès qu'un produit Demeter/Nature et Progrès/Bio
 * Cohérence sera disponible. Jusque-là, cette branche n'est pas testée en
 * positif (voir __tests__/engine/certification.test.ts, cas .todo). Une
 * erreur de slug ici échoue en silence (aucun insight émis), jamais par une
 * fausse classification — cohérent avec le reste du moteur.
 */
const PRIVATE_LABELS: Record<string, string> = {
  'en:demeter': 'Demeter',
  'fr:nature-et-progres': 'Nature et Progrès',
  'fr:bio-coherence': 'Bio Cohérence',
};

/**
 * Lit labels_tags pour distinguer une certification officielle
 * (Eurofeuille/AB) d'un cahier des charges privé (Demeter, Nature et
 * Progrès, Bio Cohérence). Volontairement une liste fermée de tags connus
 * plutôt qu'un balayage de labels_tags au sens large : un label sans
 * rapport (nutriscore, vegan society, planet score…) ne doit jamais être
 * confondu avec une certification bio — voir RULES.md#5-certification.
 */
export const certificationRule: Rule = (product) => {
  const labels = product.labels_tags ?? [];
  const insights: Insight[] = [];

  if (labels.some((tag) => OFFICIAL_ORGANIC_TAGS.has(tag))) {
    const certifierCodes = labels
      .map((tag) => tag.match(CERTIFIER_CODE_PATTERN))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match) => match[0].replace('en:', '').toUpperCase());

    insights.push({
      id: 'certification-officielle',
      severity: 'info',
      category: 'certification',
      title: 'Certifié agriculture biologique',
      explanation:
        certifierCodes.length > 0
          ? `Certifié agriculture biologique (Eurofeuille), sous contrôle de l'organisme ${certifierCodes.join(', ')}.`
          : 'Certifié agriculture biologique (Eurofeuille).',
      source: OFFICIAL_SOURCE,
    });
  }

  for (const tag of labels) {
    const privateLabel = PRIVATE_LABELS[tag];
    if (privateLabel) {
      insights.push({
        id: `certification-privee-${tag}`,
        severity: 'info',
        category: 'certification',
        title: `Label privé : ${privateLabel}`,
        explanation: `Porte le label ${privateLabel}, un cahier des charges privé, distinct de la certification bio officielle.`,
        source: { label: privateLabel, url: 'https://world.openfoodfacts.org/' },
      });
    }
  }

  return insights;
};
