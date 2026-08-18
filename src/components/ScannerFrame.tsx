import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

/**
 * Cadre de visée superposé au flux caméra. La caméra scanne en continu
 * (voir app/(tabs)/scan.tsx) : les emballages courbés ou brillants demandent
 * souvent plusieurs secondes avant une lecture correcte, d'où le message
 * d'aide plutôt qu'un simple viseur.
 */
export function ScannerFrame() {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.frame} />
      <Text style={styles.hint}>
        Centrez le code-barres. Tenez l'appareil stable : les emballages courbés
        ou brillants demandent parfois plusieurs secondes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  frame: {
    width: '78%',
    height: 140,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  hint: {
    ...typography.bodyMuted,
    color: colors.surface,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
