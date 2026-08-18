import type { OFFApiResponse, OFFProduct } from '../../../types/openFoodFacts';
import produitNova4 from './products/9999999999991.json';
import produitHuileDePalme from './products/9999999999992.json';
import produitNonBio from './products/9999999999993.json';

/**
 * SYNTHÉTIQUE — voir README.md dans ce dossier. Ne jamais fusionner avec
 * le registre réel de `../index.ts` : ni le mode mock de l'app, ni la
 * mesure du taux d'incertitude arômes ne doivent lire ces produits
 * inventés comme si c'étaient de vraies données.
 */
const rawSyntheticFixtures: Record<string, OFFApiResponse> = {
  '9999999999991': produitNova4 as OFFApiResponse, // NOVA 4
  '9999999999992': produitHuileDePalme as OFFApiResponse, // huile de palme
  '9999999999993': produitNonBio as OFFApiResponse, // non-bio
};

export const offSyntheticFixtures: Record<string, OFFProduct> = Object.fromEntries(
  Object.entries(rawSyntheticFixtures).map(([barcode, response]) => [
    barcode,
    response.product as OFFProduct,
  ])
);

export const offSyntheticFixtureList: OFFProduct[] = Object.values(offSyntheticFixtures);
