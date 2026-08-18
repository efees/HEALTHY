import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProductNotFound } from '../../../src/components/ProductNotFound';
import { useProduct } from '../../../src/hooks/useProduct';
import { colors, spacing, typography } from '../../../src/theme';
import type { OFFProduct } from '../../../src/types/openFoodFacts';
import { formatTagLabel } from '../../../src/utils/formatTags';

export default function ProduitScreen() {
  const params = useLocalSearchParams<{ barcode: string }>();
  const barcode = Array.isArray(params.barcode) ? params.barcode[0] : params.barcode;
  const { data, isLoading, isError } = useProduct(barcode);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (isError || !data || data.type === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Impossible de récupérer ce produit pour le moment. Vérifiez votre
          connexion et réessayez.
        </Text>
      </View>
    );
  }

  if (data.type === 'not-found') {
    return <ProductNotFound barcode={barcode} />;
  }

  const { product } = data;

  // TODO (étape 4, branchement du moteur) : la section "Ce qui mérite votre
  // attention" prendra place ici. Elle doit distinguer explicitement "aucune
  // vigilance" (profil complet, rien détecté) de "profil incomplet" (des
  // questions d'onboarding sautées) — dans ce second cas, proposer de
  // compléter le profil plutôt que de laisser croire qu'aucune vigilance ne
  // s'applique. Voir HealthProfile dans src/engine/types.ts : un champ
  // absent signifie "non renseigné", jamais "non".
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={`Photo du produit ${product.product_name_fr ?? ''}`}
        />
      ) : null}

      <Text style={styles.name}>{product.product_name_fr ?? 'Nom non renseigné'}</Text>
      {product.brands ? <Text style={styles.brand}>{product.brands}</Text> : null}
      {product.quantity ? <Text style={styles.quantity}>{product.quantity}</Text> : null}

      {product.labels_tags && product.labels_tags.length > 0 ? (
        <Section title="Labels">
          <Text style={styles.body}>{product.labels_tags.map(formatTagLabel).join(', ')}</Text>
        </Section>
      ) : null}

      <Section title="Origine">
        <Text style={styles.body}>{formatOrigin(product)}</Text>
      </Section>

      <Section title="Ingrédients">
        {product.ingredients_text_fr ? (
          <Text style={styles.body}>{product.ingredients_text_fr}</Text>
        ) : (
          <Text style={styles.bodyMuted}>Liste d'ingrédients non renseignée.</Text>
        )}
      </Section>

      <Text style={styles.attribution}>Données produit : Open Food Facts (ODbL)</Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function formatOrigin(product: OFFProduct): string {
  if (product.origins_tags && product.origins_tags.length > 0) {
    return product.origins_tags.map(formatTagLabel).join(', ');
  }
  if (product.manufacturing_places) {
    return product.manufacturing_places;
  }
  if (product.countries_tags && product.countries_tags.length > 0) {
    return `Origine des matières premières non précisée (vendu en ${product.countries_tags
      .map(formatTagLabel)
      .join(', ')}).`;
  }
  return 'Origine non renseignée.';
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  errorText: { ...typography.body, color: colors.ink, textAlign: 'center' },
  image: { width: '100%', height: 220, backgroundColor: colors.surface, borderRadius: 12 },
  name: { ...typography.screenTitle, color: colors.ink },
  brand: { ...typography.body, color: colors.inkMuted },
  quantity: { ...typography.bodyMuted, color: colors.inkMuted },
  section: { gap: spacing.xs, marginTop: spacing.sm },
  sectionTitle: { ...typography.sectionTitle, color: colors.ink },
  body: { ...typography.body, color: colors.ink },
  bodyMuted: { ...typography.body, color: colors.inkMuted, fontStyle: 'italic' },
  attribution: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
