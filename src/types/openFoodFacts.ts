/**
 * Types du sous-ensemble de l'API Open Food Facts v2 utilisé par
 * l'application (voir la liste de `fields` dans src/api/off.ts).
 * https://openfoodfacts.github.io/openfoodfacts-server/api/
 */

export type OFFNovaGroup = 1 | 2 | 3 | 4;

export type OFFGrade = 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown' | 'not-applicable';

/**
 * Les clés de nutriments OFF suivent le motif `<nutrient>_100g` /
 * `<nutrient>_serving` / `<nutrient>_unit`, avec des dizaines de nutriments
 * possibles selon le produit : pas de liste fermée côté API, d'où
 * l'index signature en plus des clés les plus utilisées par le moteur.
 */
export interface OFFNutriments {
  'energy-kcal_100g'?: number;
  energy_100g?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
  potassium_100g?: number;
  phosphorus_100g?: number;
  [key: string]: number | undefined;
}

/**
 * Les tags OFF (`fr:...`, `en:...`) forment un vocabulaire ouvert et évolutif.
 * `(string & {})` conserve l'autocomplétion des valeurs connues tout en
 * acceptant n'importe quelle chaîne, sans recourir à `any`.
 */
export type OFFTag =
  | 'en:palm-oil'
  | 'en:palm-oil-free'
  | 'en:may-contain-palm-oil'
  | 'en:vegan'
  | 'en:non-vegan'
  | 'en:vegetarian'
  | 'en:non-vegetarian'
  | (string & {});

export interface OFFProduct {
  code: string;
  product_name_fr?: string;
  brands?: string;
  image_url?: string;
  ingredients_text_fr?: string;
  ingredients_analysis_tags?: OFFTag[];
  additives_tags?: OFFTag[];
  allergens_tags?: OFFTag[];
  traces_tags?: OFFTag[];
  labels_tags?: OFFTag[];
  origins_tags?: OFFTag[];
  countries_tags?: OFFTag[];
  manufacturing_places?: string;
  categories_tags?: OFFTag[];
  nova_group?: OFFNovaGroup;
  nutriscore_grade?: OFFGrade;
  ecoscore_grade?: OFFGrade;
  nutriments?: OFFNutriments;
  quantity?: string;
  packaging_tags?: OFFTag[];
}

/** Enveloppe brute de la réponse `GET /api/v2/product/{barcode}.json`. */
export interface OFFApiResponse {
  code: string;
  status: 0 | 1;
  status_verbose?: string;
  product?: OFFProduct;
}

/** Les champs demandés à l'API via le paramètre `fields=`, dans cet ordre. */
export const OFF_REQUESTED_FIELDS = [
  'code',
  'product_name_fr',
  'brands',
  'image_url',
  'ingredients_text_fr',
  'ingredients_analysis_tags',
  'additives_tags',
  'allergens_tags',
  'traces_tags',
  'labels_tags',
  'origins_tags',
  'countries_tags',
  'manufacturing_places',
  'categories_tags',
  'nova_group',
  'nutriscore_grade',
  'ecoscore_grade',
  'nutriments',
  'quantity',
  'packaging_tags',
] as const;
