import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '../src/api/queryClient';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              headerTintColor: colors.accent,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen
              name="saisie-manuelle"
              options={{ presentation: 'modal', headerShown: true, title: 'Saisie manuelle' }}
            />
            <Stack.Screen
              name="produit/[barcode]/index"
              options={{ headerShown: true, title: '', headerBackTitle: '' }}
            />
            <Stack.Screen name="produit/[barcode]/avis" options={{ headerShown: true }} />
            <Stack.Screen name="produit/introuvable" options={{ headerShown: true, title: '' }} />
            <Stack.Screen name="a-propos" options={{ headerShown: true }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
