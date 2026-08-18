import { describe, expect, it } from 'vitest';
import { aromeRule } from '../../src/engine/rules/aromes';
import type { OFFProduct } from '../../src/types/openFoodFacts';

function productWith(ingredients_text_fr: string): OFFProduct {
  return { code: '0000000000000', ingredients_text_fr };
}

describe('aromeRule', () => {
  it('émet un insight pour un arôme non conforme', () => {
    const insights = aromeRule(productWith('sucre, arôme naturel, eau'), {});
    expect(insights).toHaveLength(1);
    expect(insights[0].category).toBe('arome');
    expect(insights[0].explanation).toContain('arôme naturel');
  });

  it('n’émet rien pour un arôme conforme ("de X")', () => {
    expect(aromeRule(productWith('arôme naturel de fraise'), {})).toEqual([]);
  });

  it('n’émet rien pour une mention incertaine — le doute reste silencieux', () => {
    expect(aromeRule(productWith('arôme naturel: fraise'), {})).toEqual([]);
  });

  it('n’émet rien sans ingredients_text_fr', () => {
    expect(aromeRule({ code: '0000000000000' }, {})).toEqual([]);
  });

  it('sourcé de façon opposable, jamais un jugement de valeur', () => {
    const [insight] = aromeRule(productWith('arôme naturel'), {});
    expect(insight.source.label).toContain('1334/2008');
    expect(insight.explanation).not.toMatch(/dangereux|mauvais|toxique|à éviter/i);
  });

  it('n’émet rien pour une source coordonnée ("de citron et de gingembre"), probablement conforme mais non vérifiée', () => {
    expect(aromeRule(productWith('arôme naturel de citron et de gingembre'), {})).toEqual([]);
  });

  it('reste silencieuse pour tout le produit si une seule mention est incertaine, même si une autre est clairement non conforme', () => {
    // "arôme naturel" seul (non conforme) + une source coordonnée (incertaine)
    // dans le même texte : un signalement partiel donnerait une impression
    // de certitude que le moteur n'a pas — voir RULES.md#1-arômes.
    const insights = aromeRule(
      productWith('arôme naturel, arôme naturel de citron et de gingembre'),
      {}
    );
    expect(insights).toEqual([]);
  });
});
