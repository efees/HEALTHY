import type { OFFProduct } from '../types/openFoodFacts';

export type InsightSeverity = 'info' | 'attention' | 'vigilance';

export type InsightCategory =
  | 'arome'
  | 'additif'
  | 'sucre'
  | 'transformation'
  | 'origine'
  | 'certification'
  | 'profil';

export interface InsightSource {
  label: string;
  url: string;
}

export interface Insight {
  id: string;
  severity: InsightSeverity;
  category: InsightCategory;
  /** Court, factuel. */
  title: string;
  /** 2 à 3 phrases, langage courant. Jamais "dangereux/mauvais/toxique/à éviter", jamais de note globale — voir RULES.md. */
  explanation: string;
  source: InsightSource;
  /** Quel élément du profil a déclenché cet insight, le cas échéant (ex. "grossesse", "allergie:gluten"). */
  profileTriggered?: string;
}

export type RegulatedAllergen =
  | 'gluten'
  | 'crustaces'
  | 'oeufs'
  | 'poisson'
  | 'arachides'
  | 'soja'
  | 'lait'
  | 'fruits-a-coque'
  | 'celeri'
  | 'moutarde'
  | 'graines-de-sesame'
  | 'anhydride-sulfureux-et-sulfites'
  | 'lupin'
  | 'mollusques';

export type Vigilance = 'renale' | 'cardiovasculaire' | 'glycemique' | 'digestive';

export type Regime = 'omnivore' | 'vegetarien' | 'vegetalien' | 'sans-gluten' | 'sans-lactose';

/**
 * Tranche d'âge déclarée à l'onboarding. Les bornes exactes seront arrêtées
 * à l'étape 5 (onboarding) ; ce type sera ajusté à ce moment si besoin.
 */
export type AgeRange = '18-24' | '25-39' | '40-59' | '60+';

/**
 * Chaque champ est optionnel et signifie "non renseigné" quand absent —
 * pas "non"/"aucun". L'onboarding est sautable et modifiable à tout moment
 * (voir le brief), donc une question sans réponse ne doit jamais être
 * traitée par le moteur comme une réponse négative implicite.
 */
export interface HealthProfile {
  ageRange?: AgeRange;
  grossesseOuAllaitement?: boolean;
  allergies?: RegulatedAllergen[];
  vigilances?: Vigilance[];
  regime?: Regime;
  enfantMoinsDeTroisAns?: boolean;
}

/**
 * Une règle est une fonction pure : produit + profil en entrée, insights en
 * sortie (éventuellement aucun). Pas d'effet de bord, pas d'état partagé —
 * ce qui la rend testable isolément avec de simples fixtures.
 */
export type Rule = (product: OFFProduct, profile: HealthProfile) => Insight[];
