import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../src/theme';

export default function SaisieManuelleScreen() {
  const [code, setCode] = useState('');
  const digitsOnly = code.replace(/[^0-9]/g, '');
  const isValid = digitsOnly.length === 8 || digitsOnly.length === 13;

  const submit = () => {
    if (!isValid) return;
    router.replace(`/produit/${digitsOnly}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saisir un code-barres</Text>
      <Text style={styles.description}>
        Le code EAN se trouve sous le code-barres imprimé sur l'emballage,
        généralement 8 ou 13 chiffres.
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="Ex. 3229820129488"
        placeholderTextColor={colors.inkMuted}
        style={styles.input}
        accessibilityLabel="Code-barres du produit"
        maxLength={13}
        autoFocus
      />
      <Pressable
        onPress={submit}
        disabled={!isValid}
        accessibilityRole="button"
        accessibilityLabel="Rechercher ce produit"
        style={[styles.button, !isValid && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>Rechercher</Text>
      </Pressable>
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
  description: { ...typography.body, color: colors.inkMuted },
  input: {
    ...typography.body,
    color: colors.ink,
    minHeight: minTouchTarget,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  button: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { backgroundColor: colors.border },
  buttonText: { ...typography.button, color: colors.onAccent },
});
