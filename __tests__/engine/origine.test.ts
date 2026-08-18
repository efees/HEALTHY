import { describe, expect, it } from 'vitest';
import { origineRule } from '../../src/engine/rules/origine';
import { offFixtures } from '../../src/fixtures/off';
import type { OFFProduct } from '../../src/types/openFoodFacts';

describe('règle origine — sur les fixtures réelles', () => {
  it('signale une origine absente, avec le pays de vente en repli (Gerblé)', () => {
    // origins_tags: [], manufacturing_places: '', countries_tags: ['en:france']
    const [insight] = origineRule(offFixtures['3175681272958'], {});
    expect(insight.title).toBe('Origine des matières premières non précisée');
    expect(insight.explanation).toContain('France');
  });

  it('signale une origine déclarée de façon large, avec le lieu de fabrication (Bjorg — UE et hors UE, Allemagne)', () => {
    // origins_tags: ['en:european-union-and-non-european-union'], manufacturing_places: 'Allemagne'
    const [insight] = origineRule(offFixtures['3229820129488'], {});
    expect(insight.title).toBe('Origine des matières premières déclarée de façon large');
    expect(insight.explanation).toContain('Allemagne');
  });

  it('ne signale rien pour une origine précise (Vrai — France)', () => {
    // origins_tags: ['en:france', 'fr:Lait Bio du grand ouest']
    expect(origineRule(offFixtures['3273220530351'], {})).toEqual([]);
  });

  it('signale une origine large même quand le lieu de fabrication est dans l’UE (beurre de cacahuète — hors UE déclaré, fabriqué aux Pays-Bas)', () => {
    // Cas de données réelles pas parfaitement cohérentes : origins_tags dit
    // "hors UE", manufacturing_places dit Pays-Bas (UE). On rapporte les
    // deux faits tels quels, sans trancher la contradiction apparente.
    const [insight] = origineRule(offFixtures['3760020507350'], {});
    expect(insight.title).toBe('Origine des matières premières déclarée de façon large');
    expect(insight.explanation).toContain('Pays-Bas');
  });
});

describe('règle origine — câblage', () => {
  it('ne signale rien pour un produit minimal sans aucune donnée d’origine ni de pays', () => {
    const minimal: OFFProduct = { code: '0000000000000' };
    const [insight] = origineRule(minimal, {});
    expect(insight.title).toBe('Origine des matières premières non précisée');
    expect(insight.explanation).not.toContain('pays de vente');
  });
});
