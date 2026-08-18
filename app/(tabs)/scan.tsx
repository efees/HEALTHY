import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScannerFrame } from '../../src/components/ScannerFrame';
import { colors, minTouchTarget, radius, spacing, typography } from '../../src/theme';

const SCAN_COOLDOWN_MS = 2000;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);

  const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
    const now = Date.now();
    const last = lastScanRef.current;
    if (last && last.code === result.data && now - last.at < SCAN_COOLDOWN_MS) {
      return;
    }
    lastScanRef.current = { code: result.data, at: now };
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push(`/produit/${result.data}`);
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.title}>Autoriser l'appareil photo</Text>
        <Text style={styles.description}>
          Verso a besoin de la caméra pour scanner le code-barres des produits.
          Vous pouvez aussi saisir le code à la main.
        </Text>
        {permission.canAskAgain ? (
          <Pressable
            onPress={requestPermission}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Autoriser l'accès à la caméra"
          >
            <Text style={styles.buttonText}>Autoriser la caméra</Text>
          </Pressable>
        ) : (
          <Text style={styles.description}>
            L'autorisation a été refusée. Activez-la depuis les réglages du
            téléphone pour scanner un produit.
          </Text>
        )}
        <ManualEntryButton variant="dark" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <ScannerFrame />
      <View style={styles.footer}>
        <ManualEntryButton variant="light" />
      </View>
    </View>
  );
}

function ManualEntryButton({ variant }: { variant: 'light' | 'dark' }) {
  return (
    <Pressable
      onPress={() => router.push('/saisie-manuelle')}
      style={[styles.manualButton, variant === 'dark' && styles.manualButtonDark]}
      accessibilityRole="button"
      accessibilityLabel="Saisir un code-barres manuellement"
    >
      <Text style={[styles.manualButtonText, variant === 'dark' && styles.manualButtonTextDark]}>
        Saisir un code-barres
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  description: { ...typography.body, color: colors.inkMuted, textAlign: 'center' },
  button: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { ...typography.button, color: colors.onAccent },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  manualButton: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualButtonDark: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  manualButtonText: { ...typography.button, color: colors.ink },
  manualButtonTextDark: { color: colors.accent },
});
