import { describe, expect, it } from 'vitest';
import { huileDePalmeRule } from '../../src/engine/rules/huileDePalme';
import { offFixtureList } from '../../src/fixtures/off';
import type { OFFProduct } from '../../src/types/openFoodFacts';

describe('règle huile de palme — sur les fixtures réelles', () => {
  it('ne signale rien pour les 4 produits actuels (tous "palm-oil-free")', () => {
    for (const product of offFixtureList) {
      expect(huileDePalmeRule(product, {})).toEqual([]);
    }
  });
});

describe('règle huile de palme — non testé en positif, aucune fixture n’en contient', () => {
  it.todo('signale la présence du tag ingredients_analysis_tags "en:palm-oil"');
});

describe('règle huile de palme — câblage', () => {
  it('ne fait pas de faux positif quand ingredients_analysis_tags est absent', () => {
    const minimal: OFFProduct = { code: '0000000000000' };
    expect(huileDePalmeRule(minimal, {})).toEqual([]);
  });
});
