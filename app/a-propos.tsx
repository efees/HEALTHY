import { StyleSheet, Text, View } from 'react-native';
import { fr } from '../src/i18n/fr';
import { colors, spacing, typography } from '../src/theme';

export default function AProposScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fr.apropos.title}</Text>
      <Text style={styles.body}>{fr.apropos.attribution}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { ...typography.screenTitle, color: colors.ink },
  body: { ...typography.body, color: colors.inkMuted },
});
