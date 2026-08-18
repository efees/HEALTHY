import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '../../../src/components/PlaceholderScreen';

export default function ProduitScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  return <PlaceholderScreen title="Fiche produit" description={`Code-barres : ${barcode}`} />;
}
