import { describe, it } from 'vitest';

/**
 * En attente des fixtures réelles et de la logique de la règle
 * (RULES.md#6-origine). Cas à couvrir :
 */
describe('règle origine', () => {
  it.todo('utilise origins_tags quand disponible');
  it.todo('se replie sur manufacturing_places en l’absence d’origins_tags');
  it.todo('signale explicitement une origine des matières premières absente ou floue');
});
