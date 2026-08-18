import { describe, expect, it } from 'vitest';
import { allergiesRule } from '../../src/engine/rules/profil/allergies';
import { diabeteRule } from '../../src/engine/rules/profil/diabete';
import { enfantRule } from '../../src/engine/rules/profil/enfant';
import { grossesseRule } from '../../src/engine/rules/profil/grossesse';
import { renalRule } from '../../src/engine/rules/profil/renal';
import type { HealthProfile } from '../../src/engine/types';
import { offFixtures } from '../../src/fixtures/off';
import { offSyntheticFixtures } from '../../src/fixtures/off/synthetic';
import type { OFFProduct } from '../../src/types/openFoodFacts';

describe('règles déclenchées par le profil', () => {
  describe('grossesse — non testé en positif, aucune fixture (réelle ou synthétique) ne contient ces marqueurs', () => {
    it.todo('signale alcool, foie/abats, fromages au lait cru, soja, caféine');

    it('ne se déclenche pas quand grossesseOuAllaitement n’est pas true (profil non renseigné ou négatif)', () => {
      const product: OFFProduct = { code: '0000000000000', ingredients_text_fr: 'alcool, foie' };
      expect(grossesseRule(product, {})).toEqual([]);
      expect(grossesseRule(product, { grossesseOuAllaitement: false })).toEqual([]);
    });
  });

  describe('fonction rénale — sur fixture synthétique (aucune fixture réelle n’a de potassium/phosphore renseigné)', () => {
    const vigilanceRenale: HealthProfile = { vigilances: ['renale'] };
    const nova4 = offSyntheticFixtures['9999999999991'];

    it('signale sodium, potassium et phosphore élevés', () => {
      const insights = renalRule(nova4, vigilanceRenale);
      expect(insights.map((i) => i.id)).toEqual(
        expect.arrayContaining(['renal-sodium', 'renal-potassium', 'renal-phosphore'])
      );
    });

    it('signale un additif phosphaté (E451)', () => {
      const insights = renalRule(nova4, vigilanceRenale);
      expect(insights.some((i) => i.id === 'renal-additif-en:e451')).toBe(true);
    });

    it('ne se déclenche pas sans "renale" dans les vigilances', () => {
      expect(renalRule(nova4, {})).toEqual([]);
      expect(renalRule(nova4, { vigilances: ['glycemique'] })).toEqual([]);
    });

    it('ne signale rien pour un produit réel à faible teneur (yaourt Vrai, sodium 0,04 g/100g)', () => {
      expect(renalRule(offFixtures['3273220530351'], vigilanceRenale)).toEqual([]);
    });
  });

  describe('diabète — sur fixture réelle', () => {
    const vigilanceGlycemique: HealthProfile = { vigilances: ['glycemique'] };

    it('signale des sucres élevés (Gerblé, 16 g/100g)', () => {
      const [insight] = diabeteRule(offFixtures['3175681272958'], vigilanceGlycemique);
      expect(insight.explanation).toContain('16');
    });

    it('ne signale rien pour un produit à faible teneur (yaourt Vrai, 4,3 g/100g)', () => {
      expect(diabeteRule(offFixtures['3273220530351'], vigilanceGlycemique)).toEqual([]);
    });

    it('ne se déclenche pas sans "glycemique" dans les vigilances', () => {
      expect(diabeteRule(offFixtures['3175681272958'], {})).toEqual([]);
      expect(diabeteRule(offFixtures['3175681272958'], { vigilances: ['renale'] })).toEqual([]);
    });
  });

  describe('allergies — sur fixtures réelles', () => {
    it('croise allergens_tags avec une allergie déclarée (gluten, Gerblé)', () => {
      const insights = allergiesRule(offFixtures['3175681272958'], { allergies: ['gluten'] });
      expect(insights).toEqual([
        expect.objectContaining({ id: 'allergie-gluten', profileTriggered: 'allergie:gluten' }),
      ]);
    });

    it('croise allergens_tags avec une allergie déclarée (lait, yaourt Vrai)', () => {
      const insights = allergiesRule(offFixtures['3273220530351'], { allergies: ['lait'] });
      expect(insights[0].id).toBe('allergie-lait');
    });

    it('croise allergens_tags avec une allergie déclarée (arachides, beurre de cacahuète)', () => {
      const insights = allergiesRule(offFixtures['3760020507350'], { allergies: ['arachides'] });
      expect(insights[0].id).toBe('allergie-arachides');
    });

    it('croise traces_tags avec une allergie déclarée (lupin, en trace seulement sur Gerblé)', () => {
      const insights = allergiesRule(offFixtures['3175681272958'], { allergies: ['lupin'] });
      expect(insights[0].id).toBe('trace-lupin');
      expect(insights[0].title).toContain('Traces possibles');
    });

    it('croise traces_tags avec une allergie déclarée (graines de sésame, beurre de cacahuète)', () => {
      const insights = allergiesRule(offFixtures['3760020507350'], { allergies: ['graines-de-sesame'] });
      expect(insights[0].id).toBe('trace-graines-de-sesame');
    });

    it('ne signale rien pour une allergie non déclarée dans le profil', () => {
      // Gerblé contient du soja en trace, mais le profil ne le déclare pas.
      expect(allergiesRule(offFixtures['3175681272958'], { allergies: ['arachides'] })).toEqual([]);
    });

    it('ne se déclenche pas pour un profil sans allergie déclarée', () => {
      expect(allergiesRule(offFixtures['3175681272958'], {})).toEqual([]);
    });
  });

  describe('enfant de moins de trois ans', () => {
    const profilEnfant: HealthProfile = { enfantMoinsDeTroisAns: true };

    it('signale des sucres ajoutés élevés (Gerblé, sur fixture réelle — 15,23 g/100g)', () => {
      const insights = enfantRule(offFixtures['3175681272958'], profilEnfant);
      expect(insights.some((i) => i.id === 'enfant-sucres-ajoutes')).toBe(true);
    });

    it('signale un sel élevé — sur fixture synthétique (aucune fixture réelle ne dépasse le seuil)', () => {
      const insights = enfantRule(offSyntheticFixtures['9999999999991'], profilEnfant);
      expect(insights.some((i) => i.id === 'enfant-sel')).toBe(true);
    });

    it.todo('signale les additifs déconseillés avant trois ans (non implémenté, pas de liste de référence vérifiée)');

    it('ne se déclenche pas sans enfantMoinsDeTroisAns === true', () => {
      expect(enfantRule(offFixtures['3175681272958'], {})).toEqual([]);
      expect(enfantRule(offFixtures['3175681272958'], { enfantMoinsDeTroisAns: false })).toEqual([]);
    });
  });
});
