import { describe, it } from 'vitest';

/**
 * En attente des fixtures réelles et de la logique de la règle
 * (RULES.md#4-huile-de-palme). Cas à couvrir :
 */
describe('règle huile de palme', () => {
  it.todo('signale la présence du tag ingredients_analysis_tags "en:palm-oil"');
  it.todo('ne signale rien pour "en:palm-oil-free"');
  it.todo('ne fait pas de faux positif quand le tag est absent (statut inconnu)');
});
