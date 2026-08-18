import { describe, expect, it } from 'vitest';
import { ultraTransformationRule } from '../../src/engine/rules/ultraTransformation';
import { offFixtureList } from '../../src/fixtures/off';
import { offSyntheticFixtures } from '../../src/fixtures/off/synthetic';
import type { OFFProduct } from '../../src/types/openFoodFacts';

describe('règle ultra-transformation — sur les fixtures réelles', () => {
  it('ne signale rien pour les 4 produits actuels (NOVA 3, 3, 3, 1 — aucun NOVA 4, aucun marqueur de texture)', () => {
    for (const product of offFixtureList) {
      expect(ultraTransformationRule(product, {})).toEqual([]);
    }
  });
});

describe('règle ultra-transformation — sur fixture synthétique (aucune vraie fixture ne couvre encore ce cas)', () => {
  // À revalider avec une vraie fixture NOVA 4 dès qu'elle sera disponible —
  // voir src/fixtures/off/synthetic/README.md.
  const nova4 = offSyntheticFixtures['9999999999991'];

  it('signale nova_group === 4 sans jugement de valeur dans le texte', () => {
    const insights = ultraTransformationRule(nova4, {});
    const novaInsight = insights.find((insight) => insight.id === 'ultra-transformation-nova4');
    expect(novaInsight).toBeDefined();
    expect(novaInsight?.explanation).not.toMatch(/dangereux|mauvais|toxique|à éviter/i);
  });

  it('nomme l’origine académique de NOVA (Université de São Paulo, Monteiro) dans le texte affiché', () => {
    const insights = ultraTransformationRule(nova4, {});
    const novaInsight = insights.find((insight) => insight.id === 'ultra-transformation-nova4');
    expect(novaInsight?.explanation).toContain('São Paulo');
    expect(novaInsight?.explanation).toContain('Monteiro');
  });

  it('détecte la gomme de caroube (E410) via additives_tags', () => {
    const insights = ultraTransformationRule(nova4, {});
    expect(insights.some((insight) => insight.id.includes('e410'))).toBe(true);
  });

  it('détecte "maltodextrine" dans ingredients_text_fr', () => {
    const insights = ultraTransformationRule(nova4, {});
    expect(insights.some((insight) => insight.explanation.includes('maltodextrine'))).toBe(true);
  });
});

describe('règle ultra-transformation — non testé, ni en réel ni en synthétique', () => {
  it.todo('détecte la gomme xanthane (E415) via additives_tags');
  it.todo('détecte la gomme guar (E412) et la pectine (E440) via additives_tags');
  it.todo('détecte "inuline" et "fibre d’acacia" dans ingredients_text_fr');
});

describe('règle ultra-transformation — câblage', () => {
  it('ne signale rien pour un produit minimal sans nova_group ni additifs', () => {
    const minimal: OFFProduct = { code: '0000000000000' };
    expect(ultraTransformationRule(minimal, {})).toEqual([]);
  });
});
