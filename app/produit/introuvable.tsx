import { PlaceholderScreen } from '../../src/components/PlaceholderScreen';
import { fr } from '../../src/i18n/fr';

export default function ProduitIntrouvableScreen() {
  return (
    <PlaceholderScreen
      title={fr.produit.introuvable.title}
      description={fr.produit.introuvable.description}
    />
  );
}
