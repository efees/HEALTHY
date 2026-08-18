import { describe, expect, it } from 'vitest';
import {
  OFF_FIXTURE_NOT_FOUND_BARCODES,
  offFixtureList,
  offFixtures,
} from '../../src/fixtures/off';

/**
 * Vérifie le câblage du registre de fixtures lui-même (pas encore les
 * règles) : voir src/fixtures/off/README.md pour ajouter les fixtures
 * réelles, qui feront automatiquement grossir offFixtureList sans qu'aucun
 * de ces tests n'ait besoin d'être réécrit.
 */
describe('registre de fixtures Open Food Facts', () => {
  it('expose des collections bien formées', () => {
    expect(Array.isArray(offFixtureList)).toBe(true);
    expect(typeof offFixtures).toBe('object');
  });

  it('réserve des codes-barres pour simuler le cas "produit absent"', () => {
    expect(OFF_FIXTURE_NOT_FOUND_BARCODES.length).toBeGreaterThan(0);
  });

  it.todo('contient au moins 5 à 10 produits réels une fois les fixtures ajoutées');
});
