import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { fr } from '../i18n/fr';

type Props = {
  title: string;
  description?: string;
};

/**
 * Écran vide temporaire pour les routes pas encore construites (étape 1
 * de l'ordre de construction : navigation et thème avant logique).
 */
export function PlaceholderScreen({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      <Text style={styles.comingSoon}>{fr.common.comingSoon}</Text>
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
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  comingSoon: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: spacing.md,
  },
});
