import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { fr } from '../i18n/fr';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

type Props = { barcode?: string };

export function ProductNotFound({ barcode }: Props) {
  const contributeUrl = barcode
    ? `https://world.openfoodfacts.org/cgi/product.pl?type=add&code=${encodeURIComponent(barcode)}`
    : 'https://world.openfoodfacts.org/';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fr.produit.introuvable.title}</Text>
      <Text style={styles.description}>{fr.produit.introuvable.description}</Text>
      {barcode ? <Text style={styles.barcode}>Code-barres : {barcode}</Text> : null}
      <Pressable
        onPress={() => Linking.openURL(contributeUrl)}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={fr.produit.introuvable.contribute}
      >
        <Text style={styles.buttonText}>{fr.produit.introuvable.contribute}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  description: { ...typography.body, color: colors.inkMuted, textAlign: 'center' },
  barcode: { ...typography.caption, color: colors.inkMuted, marginTop: spacing.xs },
  button: {
    marginTop: spacing.lg,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { ...typography.button, color: colors.onAccent },
});
