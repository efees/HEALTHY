import type { OFFApiResponse, OFFProduct } from '../../types/openFoodFacts';

/**
 * Registre statique des fixtures. Metro ne supporte pas les `require`/`import`
 * dynamiques par variable, donc chaque fixture s'importe explicitement ici —
 * voir README.md dans ce dossier pour la marche à suivre.
 *
 * Exemple une fois un fichier ajouté dans ./products :
 *
 *   import produit3229820129488 from './products/3229820129488.json';
 *   ...
 *   '3229820129488': (produit3229820129488 as OFFApiResponse).product!,
 */
const rawFixtures: Record<string, OFFApiResponse> = {
  // Ajouter les entrées ici au fur et à mesure des fixtures reçues.
};

export const offFixtures: Record<string, OFFProduct> = Object.fromEntries(
  Object.entries(rawFixtures)
    .filter(([, response]) => response.status === 1 && response.product)
    .map(([barcode, response]) => [barcode, response.product as OFFProduct])
);

export const offFixtureList: OFFProduct[] = Object.values(offFixtures);

/**
 * Code-barres réservés pour simuler explicitement le cas "produit absent"
 * en mode mock, sans avoir besoin d'un fichier JSON dédié.
 */
export const OFF_FIXTURE_NOT_FOUND_BARCODES = ['0000000000000', '00000000'];
