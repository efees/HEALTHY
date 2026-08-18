import { offFixtures, OFF_FIXTURE_NOT_FOUND_BARCODES } from '../fixtures/off';
import type { OFFApiResponse, OFFProduct } from '../types/openFoodFacts';
import { OFF_REQUESTED_FIELDS } from '../types/openFoodFacts';

const OFF_BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';

/**
 * L'API Open Food Facts bloque les clients anonymes : un User-Agent
 * identifiant l'application est obligatoire dès le premier appel.
 */
const USER_AGENT = 'Verso/0.1 (contact@verso-app.fr)';

const REQUEST_TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

/**
 * `EXPO_PUBLIC_USE_FIXTURES=true` bascule sur les fixtures locales plutôt
 * que sur l'API réseau — pratique en environnement de développement sans
 * accès à world.openfoodfacts.org. Faux par défaut : sans configuration,
 * l'app appelle l'API réelle.
 */
const useFixtures = process.env.EXPO_PUBLIC_USE_FIXTURES === 'true';

/**
 * Le produit absent est un cas nominal de l'API OFF, pas une erreur : d'où
 * un type de résultat qui distingue explicitement les trois issues plutôt
 * que de tout faire remonter par une exception.
 */
export type ProductFetchResult =
  | { type: 'found'; product: OFFProduct }
  | { type: 'not-found'; barcode: string }
  | { type: 'error'; message: string };

export async function fetchProduct(barcode: string): Promise<ProductFetchResult> {
  const normalized = barcode.trim();
  return useFixtures ? fetchFromFixtures(normalized) : fetchFromNetwork(normalized);
}

function fetchFromFixtures(barcode: string): ProductFetchResult {
  if (OFF_FIXTURE_NOT_FOUND_BARCODES.includes(barcode)) {
    return { type: 'not-found', barcode };
  }
  const product = offFixtures[barcode];
  return product ? { type: 'found', product } : { type: 'not-found', barcode };
}

async function fetchFromNetwork(barcode: string, attempt = 0): Promise<ProductFetchResult> {
  const url = `${OFF_BASE_URL}/${encodeURIComponent(barcode)}.json?fields=${OFF_REQUESTED_FIELDS.join(',')}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });

    if (response.status === 404) {
      return { type: 'not-found', barcode };
    }

    if (!response.ok) {
      return retryOrFail(barcode, attempt, `Réponse HTTP ${response.status}`);
    }

    const data = (await response.json()) as OFFApiResponse;

    if (data.status !== 1 || !data.product) {
      return { type: 'not-found', barcode };
    }

    return { type: 'found', product: data.product };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur réseau inconnue';
    return retryOrFail(barcode, attempt, message);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function retryOrFail(
  barcode: string,
  attempt: number,
  message: string
): Promise<ProductFetchResult> {
  if (attempt >= MAX_RETRIES) {
    return { type: 'error', message };
  }
  await delay(RETRY_BASE_DELAY_MS * 2 ** attempt);
  return fetchFromNetwork(barcode, attempt + 1);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
