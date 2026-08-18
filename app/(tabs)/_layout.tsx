import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, minTouchTarget } from '../../src/theme';
import { fr } from '../../src/i18n/fr';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarItemStyle: { minHeight: minTouchTarget },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: fr.tabs.scan,
          tabBarIcon: ({ color, size }) => <Ionicons name="scan-outline" size={size} color={color} />,
          tabBarAccessibilityLabel: fr.tabs.scan,
        }}
      />
      <Tabs.Screen
        name="historique"
        options={{
          title: fr.tabs.historique,
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
          tabBarAccessibilityLabel: fr.tabs.historique,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: fr.tabs.profil,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          tabBarAccessibilityLabel: fr.tabs.profil,
        }}
      />
    </Tabs>
  );
}
