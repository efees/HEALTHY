import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { fr } from '../../src/i18n/fr';
import { colors, minTouchTarget, spacing, typography } from '../../src/theme';

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fr.profil.title}</Text>
      <Text style={styles.comingSoon}>{fr.common.comingSoon}</Text>
      <Link href="/a-propos" style={styles.link} accessibilityRole="link">
        {fr.profil.about}
      </Link>
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
  title: { ...typography.screenTitle, color: colors.ink },
  comingSoon: { ...typography.caption, color: colors.inkMuted, marginBottom: spacing.md },
  link: {
    ...typography.button,
    color: colors.accent,
    minHeight: minTouchTarget,
    textAlignVertical: 'center',
  },
});
