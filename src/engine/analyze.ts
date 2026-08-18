import type { OFFProduct } from '../types/openFoodFacts';
import { rules } from './rules';
import type { HealthProfile, Insight } from './types';

/**
 * Point d'entrée unique du moteur de règles. Module TypeScript pur, sans
 * dépendance React — testable et utilisable indépendamment de l'interface.
 */
export function analyze(product: OFFProduct, profile: HealthProfile): Insight[] {
  return rules.flatMap((rule) => rule(product, profile));
}
