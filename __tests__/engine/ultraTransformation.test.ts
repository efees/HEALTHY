import { describe, expect, it } from 'vitest';
import { ultraTransformationRule } from '../../src/engine/rules/ultraTransformation';
import { offFixtureList } from '../../src/fixtures/off';
import type { OFFProduct } from '../../src/types/openFoodFacts';

describe('règle ultra-transformation — sur les fixtures réelles', () => {
  it('ne signale rien pour les 4 produits actuels (NOVA 3, 3, 3, 1 — aucun NOVA 4, aucun marqueur de texture)', () => {
    for (const product of offFixtureList) {
      expect(ultraTransformationRule(product, {})).toEqual([]);
    }
  });
});

describe('règle ultra-transformation — non testé en positif, aucune fixture ne l’exerce', () => {
  it.todo('signale nova_group === 4 sans jugement de valeur dans le texte');
  it.todo('nomme l’origine académique de NOVA (Université de São Paulo, Monteiro) dans le texte affiché');
  it.todo('détecte la gomme xanthane (E415) via additives_tags');
  it.todo('détecte la gomme guar (E412), la caroube (E410), la pectine (E440) via additives_tags');
  it.todo('détecte "inuline", "fibre d’acacia", "maltodextrine" dans ingredients_text_fr');
});

describe('règle ultra-transformation — câblage', () => {
  it('ne signale rien pour un produit minimal sans nova_group ni additifs', () => {
    const minimal: OFFProduct = { code: '0000000000000' };
    expect(ultraTransformationRule(minimal, {})).toEqual([]);
  });
});
