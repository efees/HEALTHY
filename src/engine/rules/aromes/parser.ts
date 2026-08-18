export type AromeVerdict = 'conforme' | 'non-conforme' | 'incertain';

export interface AromeMention {
  /** Fragment de texte tel qu'extrait de la liste d'ingrédients. */
  raw: string;
  verdict: AromeVerdict;
  /** Source nommée après "de"/"d'", uniquement quand verdict === 'conforme'. */
  source?: string;
}

// Frontières "dures" : au-delà, on ne suppose jamais une continuation de la
// même mention d'arôme — virgule, point-virgule, parenthèses.
const HARD_BOUNDARY = /,|;|\(|\)/;

const TRIGGER_PATTERN =
  /^(?:autres?\s+)?ar[oô]mes?\s+naturels?(?:\s+(de|d['’]|go[uû]t)\s*(.*))?$/i;
const STARTS_WITH_TRIGGER = /^(?:autres?\s+)?ar[oô]mes?\s+naturels?\b/i;
const CONTAINS_AROME_NATUREL = /ar[oô]mes?\s+naturels?/i;
const STARTS_WITH_DE = /^(de\s|d['’])/i;
const CONTAINS_STANDALONE_ET = /\bet\b/i;

/**
 * Isole chaque mention d'arôme naturel dans un champ ingrédients libre et la
 * classe conforme / non-conforme / incertaine — jamais par déduction quand
 * la structure du texte ne le permet pas clairement.
 *
 * C'est la règle la plus délicate du moteur : elle repose sur du parsing de
 * langue naturelle dans un champ libre (fautes de frappe, casse aléatoire,
 * mentions multiples dans une même liste, sources coordonnées : « arôme
 * naturel de citron et de gingembre »). D'où un module isolé, séparé de la
 * règle qui en consomme le résultat (./index.ts) : cette dernière n'émet un
 * insight que pour les mentions 'non-conforme', et reste entièrement
 * silencieuse pour tout le produit dès qu'une seule mention est incertaine
 * — voir ./index.ts. Le doute reste silencieux, jamais affiché comme un
 * fait. Voir RULES.md#1-arômes.
 *
 * Sources coordonnées : « de citron et de gingembre », « de citron et
 * gingembre », « de citron, de gingembre », « de citron, mandarine et
 * bergamote » sont toutes des formulations conformes et fréquentes citant
 * plusieurs sources sous un seul "de". Le parser ne tente pas de vérifier
 * que *toutes* les sources listées sont bien nommées : dès qu'il détecte
 * une coordination (une clause qui suit une mention "de X" sans être
 * elle-même une nouvelle mention d'arôme, reliée par "et" ou par une
 * virgule qui commence par "de"/"d'" ou contient un "et" autonome), il
 * classe l'ensemble 'incertain' plutôt que de ne compter que la première
 * source. Un effet de bord assumé : une virgule anodine suivie d'un "et"
 * sans rapport (« arôme naturel de citron, poivre et sel ») peut aussi
 * déclencher 'incertain' à tort — un excès de silence, jamais un excès
 * d'accusation, ce qui est le sens de compromis voulu ici.
 *
 * Autre limite connue, assumée : ne corrige pas les fautes de frappe
 * au-delà de l'accent circonflexe (arome/gout).
 */
export function parseAromeMentions(ingredientsText: string): AromeMention[] {
  if (!ingredientsText.trim()) {
    return [];
  }

  const segments = ingredientsText
    .split(HARD_BOUNDARY)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const mentions: AromeMention[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segmentMentions = parseSegment(segments[i]);
    if (segmentMentions.length === 0) {
      continue;
    }

    const last = segmentMentions[segmentMentions.length - 1];
    const nextSegment = segments[i + 1];
    if (
      last.verdict === 'conforme' &&
      nextSegment &&
      !STARTS_WITH_TRIGGER.test(nextSegment) &&
      (STARTS_WITH_DE.test(nextSegment) || CONTAINS_STANDALONE_ET.test(nextSegment))
    ) {
      // La coordination franchit une virgule qu'on ne peut pas distinguer
      // avec certitude d'un simple passage à l'ingrédient suivant.
      last.verdict = 'incertain';
      last.raw = `${last.raw}, ${nextSegment}`;
      delete last.source;
    }

    mentions.push(...segmentMentions);
  }

  return mentions;
}

/** Découpe une clause (déjà isolée par virgule/point-virgule/parenthèses) sur les "et" autonomes. */
function parseSegment(segment: string): AromeMention[] {
  const parts = segment
    .split(/\bet\b/i)
    .map((part) => part.trim())
    .filter(Boolean);

  const mentions: AromeMention[] = [];
  let current: AromeMention | null = null;

  for (const part of parts) {
    const match = part.match(TRIGGER_PATTERN);
    if (match) {
      if (current) {
        mentions.push(current);
      }
      const [, preposition, sourceRaw] = match;
      current = classify(part, preposition, sourceRaw);
      continue;
    }

    if (CONTAINS_AROME_NATUREL.test(part)) {
      // Contient la locution mais dans une structure non reconnue (ex.
      // ponctuation inattendue) : sa propre mention incertaine, distincte
      // de ce qui précède plutôt que devinée comme une continuation.
      if (current) {
        mentions.push(current);
      }
      current = { raw: part, verdict: 'incertain' };
      continue;
    }

    if (current) {
      // "et <part>" qui ne relance pas de mention propre : coordination de
      // sources qu'on ne valide pas en détail, jamais un fait acquis.
      if (current.verdict === 'conforme') {
        current.verdict = 'incertain';
        delete current.source;
      }
      current.raw = `${current.raw} et ${part}`;
    }
  }
  if (current) {
    mentions.push(current);
  }

  return mentions;
}

function classify(
  raw: string,
  preposition: string | undefined,
  sourceRaw: string | undefined
): AromeMention {
  if (!preposition) {
    return { raw, verdict: 'non-conforme' };
  }
  if (/^go[uû]t$/i.test(preposition)) {
    return { raw, verdict: 'non-conforme' };
  }
  const source = sourceRaw?.trim();
  if (!source) {
    return { raw, verdict: 'incertain' };
  }
  return { raw, verdict: 'conforme', source };
}
