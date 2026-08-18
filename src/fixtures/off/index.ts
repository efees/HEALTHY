import type { OFFApiResponse, OFFProduct } from '../../types/openFoodFacts';
import produit3175681272958 from './products/3175681272958.json';
import produit3229820129488 from './products/3229820129488.json';
import produit3273220530351 from './products/3273220530351.json';
import produit3760020507350 from './products/3760020507350.json';

/**
 * Registre statique des fixtures. Metro ne supporte pas les `require`/`import`
 * dynamiques par variable, donc chaque fixture s'importe explicitement ici —
 * voir README.md dans ce dossier pour la marche à suivre.
 */
const rawFixtures: Record<string, OFFApiResponse> = {
  '3175681272958': produit3175681272958 as OFFApiResponse, // Gerblé — biscuit avoine/coco/cacao bio, NOVA 3
  '3229820129488': produit3229820129488 as OFFApiResponse, // Bjorg — muesli fruits bio, plusieurs origines
  '3273220530351': produit3273220530351 as OFFApiResponse, // Vrai — yaourt nature bio, liste courte
  '3760020507350': produit3760020507350 as OFFApiResponse, // Jardin Bio étic — beurre de cacahuète, NOVA 1
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
