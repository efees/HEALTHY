import { describe, it } from 'vitest';

/**
 * En attente des fixtures réelles (voir src/fixtures/off/README.md) et de
 * la logique de la règle (RULES.md#1-arômes). Cas à couvrir :
 */
describe('règle arômes', () => {
  it.todo('signale « arôme naturel » seul, sans source nommée');
  it.todo('signale « arôme naturel goût X » (préposition manquante)');
  it.todo('ne signale rien pour « arôme naturel de X » (conforme)');
});
