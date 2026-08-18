import { describe, expect, it } from 'vitest';
import { aromeRule } from '../../src/engine/rules/aromes';
import { certificationRule } from '../../src/engine/rules/certification';
import type { OFFProduct } from '../../src/types/openFoodFacts';

/**
 * Tout le moteur suppose implicitement un contexte bio (c'est le produit),
 * mais rien ne garantissait qu'il se taise correctement en dehors. Fixture
 * construite à la main plutôt qu'une vraie fixture : un produit
 * conventionnel plausible, sans aucun label bio, portant volontairement
 * d'autres labels (nutriscore, végétarien) pour vérifier que la règle
 * certification ne les confond pas avec une certification bio plutôt que de
 * les ignorer par simple absence de données.
 */
const nonBioProduct: OFFProduct = {
  code: '0000000000002',
  product_name_fr: 'Sablés nature',
  brands: 'Marque Distributeur',
  ingredients_text_fr: 'Farine de blé, sucre, beurre, oeufs, sel.',
  labels_tags: ['en:nutriscore', 'en:nutriscore-grade-c', 'en:vegetarian'],
  nova_group: 3,
};

describe('produit non bio — le moteur doit se taire correctement hors de son terrain', () => {
  it('ne déclenche aucune règle de certification', () => {
    expect(certificationRule(nonBioProduct, {})).toEqual([]);
  });

  it('ne déclenche aucune règle d’arôme (aucune mention "arôme naturel" dans ce produit)', () => {
    expect(aromeRule(nonBioProduct, {})).toEqual([]);
  });
});
