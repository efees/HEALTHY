export type AromeVerdict = 'conforme' | 'non-conforme' | 'incertain';

export interface AromeMention {
  /** Fragment de texte tel qu'extrait de la liste d'ingrédients. */
  raw: string;
  verdict: AromeVerdict;
  /** Source nommée après "de"/"d'", uniquement quand verdict === 'conforme'. */
  source?: string;
}

// Découpe grossière en clauses : virgule, point-virgule, parenthèses, et le
// mot "et" isolé (pas les "et" internes à un mot, grâce à \b).
const SPLIT_PATTERN = /,|;|\(|\)|\bet\b/i;

const CONTAINS_AROME_NATUREL = /ar[oô]mes?\s+naturels?/i;

// Une clause reconnue est : ["autres"] "arôme(s) naturel(s)" [préposition
// source]. Tolère l'absence d'accent (arome/gout), pas les autres fautes de
// frappe — voir la note de limites connues plus bas.
const MENTION_PATTERN =
  /^(?:autres?\s+)?ar[oô]mes?\s+naturels?(?:\s+(de|d['’]|go[uû]t)\s*(.*))?$/i;

/**
 * Isole chaque mention d'arôme naturel dans un champ ingrédients libre et la
 * classe conforme / non-conforme / incertaine — jamais par déduction quand
 * la structure du texte ne le permet pas clairement.
 *
 * C'est la règle la plus délicate du moteur : elle repose sur du parsing de
 * langue naturelle dans un champ libre (fautes de frappe, casse aléatoire,
 * mentions multiples dans une même liste). D'où un module isolé, séparé de
 * la règle qui en consomme le résultat (./index.ts) : cette dernière n'émet
 * un insight que pour les mentions 'non-conforme'. Le doute reste silencieux
 * — jamais affiché comme un fait. Voir RULES.md#1-arômes.
 *
 * Limites connues, assumées plutôt que dissimulées :
 * - Tolère l'absence d'accent circonflexe (arome/gout) mais pas les autres
 *   fautes de frappe : une clause non reconnue devient 'incertaine', elle
 *   n'est jamais mal classée.
 * - Une source composée jointe par "et" sous un seul "de" (« arôme naturel
 *   de fraise et de framboise ») : seule la première partie est comptée
 *   conforme, la suite est simplement ignorée (silence), pas mal classée.
 */
export function parseAromeMentions(ingredientsText: string): AromeMention[] {
  if (!ingredientsText.trim()) {
    return [];
  }

  const fragments = ingredientsText
    .split(SPLIT_PATTERN)
    .map((fragment) => fragment.trim())
    .filter(Boolean);

  const mentions: AromeMention[] = [];

  for (const fragment of fragments) {
    if (!CONTAINS_AROME_NATUREL.test(fragment)) {
      continue;
    }

    const match = fragment.match(MENTION_PATTERN);
    if (!match) {
      mentions.push({ raw: fragment, verdict: 'incertain' });
      continue;
    }

    const [, preposition, sourceRaw] = match;

    if (!preposition) {
      mentions.push({ raw: fragment, verdict: 'non-conforme' });
      continue;
    }

    if (/^go[uû]t$/i.test(preposition)) {
      mentions.push({ raw: fragment, verdict: 'non-conforme' });
      continue;
    }

    const source = sourceRaw?.trim();
    if (!source) {
      mentions.push({ raw: fragment, verdict: 'incertain' });
      continue;
    }

    mentions.push({ raw: fragment, verdict: 'conforme', source });
  }

  return mentions;
}
