import type { Rule } from '../../types';

/**
 * Seuil heuristique provisoire — non validé cliniquement, voir la même
 * réserve dans src/engine/rules/profil/renal.ts et RULES.md#10.
 */
const SUGAR_HIGH_100G = 15;

const SOURCE = {
  label: 'Recommandation nutritionnelle générale (pas de texte réglementaire)',
  url: 'https://www.mangerbouger.fr/',
};

/**
 * Se déclenche si "glycemique" fait partie des vigilances déclarées.
 * Sucres pour 100g. Voir RULES.md#10-profil-diabète.
 *
 * L'index glycémique des ingrédients dominants, également prévu par le
 * brief, n'est pas implémenté : il demanderait une base de référence des
 * index glycémiques par ingrédient que le moteur n'a pas — mieux vaut ne
 * rien afficher que deviner un index.
 */
export const diabeteRule: Rule = (product, profile) => {
  if (!profile.vigilances?.includes('glycemique')) {
    return [];
  }

  const sugars = product.nutriments?.['sugars_100g'];
  if (typeof sugars !== 'number' || sugars < SUGAR_HIGH_100G) {
    return [];
  }

  return [
    {
      id: 'diabete-sucres',
      severity: 'vigilance',
      category: 'profil',
      title: 'Teneur en sucres élevée',
      explanation: `Teneur en sucres de ${sugars} g/100g.`,
      source: SOURCE,
      profileTriggered: 'vigilance:glycemique',
    },
  ];
};
