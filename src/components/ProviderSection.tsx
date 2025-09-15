import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProviderCard } from './ProviderCard';
import type { Provider } from '../types';

interface ProviderSectionProps {
  title: string;
  providers: Provider[];
  onProviderPress: (providerId: string) => void;
  variant?: 'nearby' | 'popular';
}

export function ProviderSection({
  title,
  providers,
  onProviderPress,
  variant = 'nearby'
}: ProviderSectionProps) {
  if (variant === 'nearby') {
    return (
      <View className="px-6 mb-8">
        <Text className="text-text-primary text-xl font-bold mb-4">
          {title}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-4">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onPress={onProviderPress}
                variant="nearby"
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="px-6 mb-8">
      <Text className="text-text-primary text-xl font-bold mb-4">
        {title}
      </Text>
      <View className="space-y-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onPress={onProviderPress}
            variant="popular"
          />
        ))}
      </View>
    </View>
  );
}