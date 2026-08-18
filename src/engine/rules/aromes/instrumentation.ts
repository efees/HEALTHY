import type { AromeVerdict } from './parser';

/**
 * Instrumentation du parser d'arômes — désactivée par défaut, à activer
 * explicitement (développement, script d'analyse sur fixtures ou sur de
 * vrais scans) pour mesurer le taux de silence de la règle : si une trop
 * grande part des mentions ou des produits tombe en `incertain`, la règle
 * ne sert plus à rien et il faut reprendre le parser plutôt que la
 * questionner à l'aveugle. Sans mesure, ce taux ne se sait jamais.
 *
 * État de module (singleton), volontairement simple : pas de dépendance,
 * pas de coût quand désactivée (un seul test booléen par appel).
 */

export type AromeUncertaintyReason =
  /** La locution est présente mais dans une structure non reconnue (ex. ponctuation inattendue). */
  | 'structure-non-reconnue'
  /** "de"/"d'" présent mais sans source qui suit (donnée tronquée). */
  | 'source-manquante'
  /** Coordination détectée après une source nommée ("et de Y", ", de Y", ", Y et Z"). */
  | 'coordination';

export type AromeRuleOutcome =
  /** Aucune mention d'arôme naturel dans le texte. */
  | 'sans-mention'
  /** Au moins une mention incertaine : la règle s'est tue pour tout le produit. */
  | 'silencieux-incertain'
  /** Mentions présentes, toutes conformes : la règle se tait, légitimement. */
  | 'silencieux-conforme'
  /** Au moins un insight émis (non-conforme, sans aucune incertitude ailleurs). */
  | 'signale';

export interface AromeParserStats {
  totalMentions: number;
  byVerdict: Record<AromeVerdict, number>;
  incertainByReason: Record<AromeUncertaintyReason, number>;
  byRuleOutcome: Record<AromeRuleOutcome, number>;
}

function createEmptyStats(): AromeParserStats {
  return {
    totalMentions: 0,
    byVerdict: { conforme: 0, 'non-conforme': 0, incertain: 0 },
    incertainByReason: {
      'structure-non-reconnue': 0,
      'source-manquante': 0,
      coordination: 0,
    },
    byRuleOutcome: {
      'sans-mention': 0,
      'silencieux-incertain': 0,
      'silencieux-conforme': 0,
      signale: 0,
    },
  };
}

let enabled = false;
let stats = createEmptyStats();

export function enableAromeParserInstrumentation(): void {
  enabled = true;
}

export function disableAromeParserInstrumentation(): void {
  enabled = false;
}

export function resetAromeParserStats(): void {
  stats = createEmptyStats();
}

/** Copie défensive : l'appelant ne peut pas muter l'état interne du module. */
export function getAromeParserStats(): AromeParserStats {
  return {
    totalMentions: stats.totalMentions,
    byVerdict: { ...stats.byVerdict },
    incertainByReason: { ...stats.incertainByReason },
    byRuleOutcome: { ...stats.byRuleOutcome },
  };
}

/**
 * Taux de silence dû à l'incertitude, parmi les produits qui contenaient au
 * moins une mention d'arôme naturel (les produits sans arôme n'entrent pas
 * dans le calcul : leur silence n'a rien à voir avec le doute du parser).
 * `null` tant qu'aucun produit avec mention n'a été observé.
 */
export function getAromeUncertaintyRate(): number | null {
  const { 'silencieux-incertain': silencieux, 'silencieux-conforme': conforme, signale } =
    stats.byRuleOutcome;
  const withMention = silencieux + conforme + signale;
  return withMention === 0 ? null : silencieux / withMention;
}

export function recordAromeMention(verdict: AromeVerdict, reason?: AromeUncertaintyReason): void {
  if (!enabled) {
    return;
  }
  stats.totalMentions += 1;
  stats.byVerdict[verdict] += 1;
  if (verdict === 'incertain' && reason) {
    stats.incertainByReason[reason] += 1;
  }
}

export function recordAromeRuleOutcome(outcome: AromeRuleOutcome): void {
  if (!enabled) {
    return;
  }
  stats.byRuleOutcome[outcome] += 1;
}
