import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  // Calcul du padding bottom pour éviter que le contenu passe sous la tabBar
  const paddingBottom = Platform.select({
    ios: 84 + 20, // hauteur tabBar + marge de sécurité
    android: 100 + Math.max(16, insets.bottom + 8) + 20, // hauteur tabBar + padding + marge
  });

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#0B0C10',
          paddingBottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}