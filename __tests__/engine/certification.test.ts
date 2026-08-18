import { describe, it } from 'vitest';

/**
 * En attente des fixtures réelles et de la logique de la règle
 * (RULES.md#5-certification). Cas à couvrir :
 */
describe('règle certification', () => {
  it.todo('reconnaît l’Eurofeuille / AB et affiche le code de l’organisme certificateur');
  it.todo('reconnaît les cahiers des charges privés (Demeter, Nature et Progrès, Bio Cohérence)');
  it.todo('distingue une certification d’une mention marketing libre (ex. "naturel" sans label)');
});
