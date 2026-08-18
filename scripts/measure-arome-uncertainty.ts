/**
 * Fait tourner la règle arômes sur les fixtures (src/fixtures/off) et
 * rapporte le taux de silence dû à l'incertitude — voir
 * RULES.md#mesurer-le-taux-de-silence. Ne modifie rien, lecture seule.
 *
 * À terme, faire tourner la même mesure sur un relevé de vrais scans plutôt
 * que sur les seules fixtures (remplacer la source `offFixtureList`
 * ci-dessous par ce relevé, une fois disponible).
 *
 * Usage : npm run measure:aromes
 */
import { aromeRule } from '../src/engine/rules/aromes';
import {
  enableAromeParserInstrumentation,
  getAromeParserStats,
  getAromeUncertaintyRate,
  resetAromeParserStats,
} from '../src/engine/rules/aromes/instrumentation';
import { offFixtureList } from '../src/fixtures/off';

resetAromeParserStats();
enableAromeParserInstrumentation();

for (const product of offFixtureList) {
  aromeRule(product, {});
}

const stats = getAromeParserStats();
const rate = getAromeUncertaintyRate();

console.log(`Produits analysés : ${offFixtureList.length}`);
console.log();
console.log('Issue de la règle par produit :');
for (const [outcome, count] of Object.entries(stats.byRuleOutcome)) {
  console.log(`  ${outcome}: ${count}`);
}
console.log();
console.log(
  `Taux de silence dû à l'incertitude (hors produits sans arôme) : ${
    rate === null ? 'n/a (aucun produit avec mention d’arôme)' : `${(rate * 100).toFixed(1)} %`
  }`
);
console.log();
console.log('Mentions d’arôme détectées, par verdict :');
for (const [verdict, count] of Object.entries(stats.byVerdict)) {
  console.log(`  ${verdict}: ${count}`);
}
console.log();
console.log('Mentions incertaines, ventilées par raison :');
for (const [reason, count] of Object.entries(stats.incertainByReason)) {
  console.log(`  ${reason}: ${count}`);
}
