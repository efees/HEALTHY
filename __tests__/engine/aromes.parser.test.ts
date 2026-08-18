import { describe, expect, it } from 'vitest';
import { parseAromeMentions } from '../../src/engine/rules/aromes/parser';

describe('parseAromeMentions — cas conformes ("de X")', () => {
  it('reconnaît "arôme naturel de fraise"', () => {
    const [mention] = parseAromeMentions('arôme naturel de fraise');
    expect(mention).toEqual({
      raw: 'arôme naturel de fraise',
      verdict: 'conforme',
      source: 'fraise',
    });
  });

  it('reconnaît la contraction "d\'orange"', () => {
    const [mention] = parseAromeMentions('sucre, arôme naturel d\'orange, eau');
    expect(mention.verdict).toBe('conforme');
    expect(mention.source).toBe('orange');
  });

  it('reconnaît le pluriel "arômes naturels de citron"', () => {
    const [mention] = parseAromeMentions('arômes naturels de citron');
    expect(mention.verdict).toBe('conforme');
  });

  it('est insensible à la casse et tolère l\'absence d\'accent', () => {
    const [mention] = parseAromeMentions('AROME NATUREL DE FRAISE');
    expect(mention.verdict).toBe('conforme');
    expect(mention.source).toBe('FRAISE');
  });
});

describe('parseAromeMentions — cas non conformes', () => {
  it('signale "arôme naturel" seul, sans source', () => {
    const [mention] = parseAromeMentions('sucre, arôme naturel, eau');
    expect(mention).toEqual({ raw: 'arôme naturel', verdict: 'non-conforme' });
  });

  it('signale le pluriel "arômes naturels" seul', () => {
    const [mention] = parseAromeMentions('arômes naturels');
    expect(mention.verdict).toBe('non-conforme');
  });

  it('signale "arôme naturel goût fraise" (préposition incorrecte)', () => {
    const [mention] = parseAromeMentions('arôme naturel goût fraise');
    expect(mention.verdict).toBe('non-conforme');
  });

  it('signale "arôme naturel gout fraise" sans accent sur "goût"', () => {
    const [mention] = parseAromeMentions('arôme naturel gout fraise');
    expect(mention.verdict).toBe('non-conforme');
  });
});

describe('parseAromeMentions — mentions multiples dans une même liste', () => {
  it('traite "arôme naturel de citron et autres arômes naturels" comme deux mentions distinctes', () => {
    const mentions = parseAromeMentions('arôme naturel de citron et autres arômes naturels');
    expect(mentions).toHaveLength(2);
    expect(mentions[0]).toEqual({
      raw: 'arôme naturel de citron',
      verdict: 'conforme',
      source: 'citron',
    });
    expect(mentions[1]).toEqual({ raw: 'autres arômes naturels', verdict: 'non-conforme' });
  });

  it('traite chaque virgule comme une clause séparée', () => {
    const mentions = parseAromeMentions('arôme naturel de vanille, arôme naturel, sel');
    expect(mentions).toHaveLength(2);
    expect(mentions[0].verdict).toBe('conforme');
    expect(mentions[1].verdict).toBe('non-conforme');
  });

  it('isole une mention entre parenthèses', () => {
    const mentions = parseAromeMentions('crème (arôme naturel de vanille), sucre');
    expect(mentions).toHaveLength(1);
    expect(mentions[0].verdict).toBe('conforme');
  });
});

describe('parseAromeMentions — incertitude assumée en silence', () => {
  it('classe "incertain" une structure non reconnue plutôt que de deviner', () => {
    const [mention] = parseAromeMentions('arôme naturel: fraise');
    expect(mention.verdict).toBe('incertain');
  });

  it('classe "incertain" une préposition "de" sans source (donnée tronquée)', () => {
    const [mention] = parseAromeMentions('arôme naturel de');
    expect(mention.verdict).toBe('incertain');
  });

  it('ne classe jamais une clause non reconnue comme "conforme"', () => {
    const mentions = parseAromeMentions('arôme naturel: fraise');
    expect(mentions.every((mention) => mention.verdict !== 'conforme')).toBe(true);
  });
});

describe('parseAromeMentions — absence de mention', () => {
  it('retourne un tableau vide sans "arôme naturel" dans le texte', () => {
    expect(parseAromeMentions('farine de blé, sucre, sel')).toEqual([]);
  });

  it('retourne un tableau vide pour un texte vide ou blanc', () => {
    expect(parseAromeMentions('')).toEqual([]);
    expect(parseAromeMentions('   ')).toEqual([]);
  });

  it('ignore un arôme non naturel (hors périmètre de cette règle)', () => {
    // "arôme" seul (sans "naturel") relève d'une autre question (arôme de
    // synthèse) que cette règle ne traite pas — voir RULES.md#1-arômes.
    expect(parseAromeMentions('arôme fraise')).toEqual([]);
  });
});
