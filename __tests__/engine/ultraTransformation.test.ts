import { describe, it } from 'vitest';

/**
 * En attente des fixtures réelles et de la logique de la règle
 * (RULES.md#2-ultra-transformation). Cas à couvrir :
 */
describe('règle ultra-transformation', () => {
  it.todo('signale nova_group === 4 sans jugement de valeur dans le texte');
  it.todo(
    'détecte les marqueurs de texture dans les ingrédients (gomme xanthane E415, guar E412, caroube E410, pectine E440, inuline, fibre d’acacia, maltodextrine)'
  );
  it.todo('ne signale rien pour un produit nova_group 1 sans marqueur de texture');
});
