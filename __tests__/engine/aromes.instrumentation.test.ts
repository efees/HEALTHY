import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { aromeRule } from '../../src/engine/rules/aromes';
import {
  disableAromeParserInstrumentation,
  enableAromeParserInstrumentation,
  getAromeParserStats,
  getAromeUncertaintyRate,
  resetAromeParserStats,
} from '../../src/engine/rules/aromes/instrumentation';
import { parseAromeMentions } from '../../src/engine/rules/aromes/parser';
import type { OFFProduct } from '../../src/types/openFoodFacts';

function productWith(ingredients_text_fr: string): OFFProduct {
  return { code: '0000000000000', ingredients_text_fr };
}

describe('instrumentation du parser arômes', () => {
  afterEach(() => {
    disableAromeParserInstrumentation();
    resetAromeParserStats();
  });

  it('ne compte rien tant qu’elle n’est pas activée (désactivée par défaut)', () => {
    parseAromeMentions('arôme naturel');
    expect(getAromeParserStats().totalMentions).toBe(0);
  });

  describe('une fois activée', () => {
    beforeEach(() => {
      resetAromeParserStats();
      enableAromeParserInstrumentation();
    });

    it('compte chaque mention par verdict', () => {
      parseAromeMentions('arôme naturel de fraise, arôme naturel');
      const stats = getAromeParserStats();
      expect(stats.totalMentions).toBe(2);
      expect(stats.byVerdict.conforme).toBe(1);
      expect(stats.byVerdict['non-conforme']).toBe(1);
    });

    it('ventile les mentions incertaines par raison', () => {
      parseAromeMentions('arôme naturel de citron et de gingembre'); // coordination
      parseAromeMentions('arôme naturel de'); // source manquante
      parseAromeMentions('arôme naturel: fraise'); // structure non reconnue

      const stats = getAromeParserStats();
      expect(stats.byVerdict.incertain).toBe(3);
      expect(stats.incertainByReason.coordination).toBe(1);
      expect(stats.incertainByReason['source-manquante']).toBe(1);
      expect(stats.incertainByReason['structure-non-reconnue']).toBe(1);
    });

    it('resetAromeParserStats repart de zéro', () => {
      parseAromeMentions('arôme naturel');
      resetAromeParserStats();
      expect(getAromeParserStats().totalMentions).toBe(0);
    });

    it('compte le résultat de la règle par produit (sans-mention / silencieux / signalé)', () => {
      aromeRule(productWith('farine, sucre'), {}); // sans-mention
      aromeRule(productWith('arôme naturel de fraise'), {}); // silencieux-conforme
      aromeRule(productWith('arôme naturel de citron et de gingembre'), {}); // silencieux-incertain
      aromeRule(productWith('arôme naturel'), {}); // signale

      const stats = getAromeParserStats();
      expect(stats.byRuleOutcome['sans-mention']).toBe(1);
      expect(stats.byRuleOutcome['silencieux-conforme']).toBe(1);
      expect(stats.byRuleOutcome['silencieux-incertain']).toBe(1);
      expect(stats.byRuleOutcome.signale).toBe(1);
    });

    it('calcule le taux de silence dû à l’incertitude, hors produits sans arôme', () => {
      aromeRule(productWith('farine, sucre'), {}); // exclu du calcul
      aromeRule(productWith('arôme naturel de fraise'), {}); // conforme
      aromeRule(productWith('arôme naturel de citron et de gingembre'), {}); // incertain
      aromeRule(productWith('arôme naturel'), {}); // signalé

      // 1 incertain sur 3 produits avec au moins une mention d'arôme
      expect(getAromeUncertaintyRate()).toBeCloseTo(1 / 3);
    });

    it('retourne null pour le taux quand aucun produit avec mention n’a été observé', () => {
      aromeRule(productWith('farine, sucre'), {});
      expect(getAromeUncertaintyRate()).toBeNull();
    });
  });

  it('disableAromeParserInstrumentation arrête le comptage', () => {
    enableAromeParserInstrumentation();
    resetAromeParserStats();
    parseAromeMentions('arôme naturel');
    disableAromeParserInstrumentation();
    parseAromeMentions('arôme naturel');
    expect(getAromeParserStats().totalMentions).toBe(1);
  });

  it('n’altère jamais le résultat public de parseAromeMentions (forme inchangée)', () => {
    enableAromeParserInstrumentation();
    const mentions = parseAromeMentions('arôme naturel de fraise');
    expect(mentions).toEqual([{ raw: 'arôme naturel de fraise', verdict: 'conforme', source: 'fraise' }]);
    expect(Object.keys(mentions[0])).not.toContain('reason');
  });
});
