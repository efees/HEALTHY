import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../api/off';

export function useProduct(barcode: string | undefined) {
  return useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode as string),
    enabled: Boolean(barcode),
    staleTime: 1000 * 60 * 30,
    // Le retry réseau est déjà géré dans fetchProduct, avec une gestion
    // explicite du cas "produit absent" — inutile de le refaire ici.
    retry: false,
  });
}
