import { describe, expect, it } from 'vitest';
import { certificationRule } from '../../src/engine/rules/certification';
import { offFixtures, offFixtureList } from '../../src/fixtures/off';
import type { OFFProduct } from '../../src/types/openFoodFacts';

describe('règle certification — sur les fixtures réelles', () => {
  it('reconnaît la certification officielle sans code d’organisme précisé (Gerblé)', () => {
    const [insight] = certificationRule(offFixtures['3175681272958'], {});
    expect(insight.category).toBe('certification');
    expect(insight.explanation).toContain('Certifié agriculture biologique');
    expect(insight.explanation).not.toContain('organisme');
  });

  it('affiche plusieurs codes d’organismes certificateurs (Bjorg — DE-ÖKO-001 et GB-ORG-05)', () => {
    const [insight] = certificationRule(offFixtures['3229820129488'], {});
    expect(insight.explanation).toContain('DE-OKO-001');
    expect(insight.explanation).toContain('GB-ORG-05');
  });

  it('affiche un seul code d’organisme (Vrai — FR-BIO-01)', () => {
    const [insight] = certificationRule(offFixtures['3273220530351'], {});
    expect(insight.explanation).toContain('FR-BIO-01');
  });

  it('affiche deux codes d’organismes pour un même produit (beurre de cacahuète — FR-BIO-01 et NL-BIO-01)', () => {
    const [insight] = certificationRule(offFixtures['3760020507350'], {});
    expect(insight.explanation).toContain('FR-BIO-01');
    expect(insight.explanation).toContain('NL-BIO-01');
  });

  it('ne confond jamais un label sans rapport (nutriscore, vegan society, planet score…) avec une certification bio', () => {
    // Chaque fixture porte aussi des labels sans rapport avec le bio
    // (nutriscore, vegan society, planet score, b-corp…) : une seule
    // certification officielle doit en ressortir par produit, jamais plus.
    for (const product of offFixtureList) {
      expect(certificationRule(product, {})).toHaveLength(1);
    }
  });
});

describe('règle certification — non testé en positif, aucune fixture ne porte ces labels', () => {
  it.todo('reconnaît Demeter (en:demeter)');
  it.todo('reconnaît Nature et Progrès (fr:nature-et-progres)');
  it.todo('reconnaît Bio Cohérence (fr:bio-coherence)');
});

describe('règle certification — câblage', () => {
  it('ne signale rien sans labels_tags', () => {
    const minimal: OFFProduct = { code: '0000000000000' };
    expect(certificationRule(minimal, {})).toEqual([]);
  });

  it('ne signale rien pour des labels_tags sans rapport avec le bio', () => {
    const nonBio: OFFProduct = {
      code: '0000000000000',
      labels_tags: ['en:nutriscore', 'en:nutriscore-grade-c', 'en:vegetarian'],
    };
    expect(certificationRule(nonBio, {})).toEqual([]);
  });
});
