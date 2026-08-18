export { analyze } from './analyze';
export type {
  AgeRange,
  HealthProfile,
  Insight,
  InsightCategory,
  InsightSeverity,
  InsightSource,
  Regime,
  RegulatedAllergen,
  Rule,
  Vigilance,
} from './types';

// Mesure du taux de silence de la règle arômes — désactivée par défaut,
// pour un script d'analyse une fois de vraies fixtures/scans disponibles.
// Voir src/engine/rules/aromes/instrumentation.ts.
export {
  disableAromeParserInstrumentation,
  enableAromeParserInstrumentation,
  getAromeParserStats,
  getAromeUncertaintyRate,
  resetAromeParserStats,
} from './rules/aromes/instrumentation';
export type {
  AromeParserStats,
  AromeRuleOutcome,
  AromeUncertaintyReason,
} from './rules/aromes/instrumentation';
