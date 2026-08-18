import { describe, expect, it } from 'vitest';
import { analyze } from '../../src/engine/analyze';
import type { HealthProfile } from '../../src/engine/types';
import type { OFFProduct } from '../../src/types/openFoodFacts';

// Objet minimal, non un produit réel — sert uniquement à vérifier le
// câblage du registre, pas la logique d'une règle.
const minimalProduct: OFFProduct = { code: '0000000000000' };
const emptyProfile: HealthProfile = {};

describe('analyze', () => {
  it('retourne un tableau, jamais undefined, même sans profil renseigné', () => {
    expect(analyze(minimalProduct, emptyProfile)).toEqual([]);
  });

  it('compose toutes les règles enregistrées sans lever d’exception', () => {
    expect(() => analyze(minimalProduct, emptyProfile)).not.toThrow();
  });

  it('ne déclenche aucun insight de profil quand aucun élément du profil n’est renseigné', () => {
    // Un profil vide (onboarding entièrement sauté) doit se comporter comme
    // "je ne sais pas", jamais comme "non" — voir src/engine/types.ts.
    const insights = analyze(minimalProduct, emptyProfile);
    expect(insights.filter((insight) => insight.category === 'profil')).toEqual([]);
  });
});
