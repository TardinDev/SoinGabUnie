import React from 'react';
import { View, Text } from 'react-native';
import type { Provider } from '../types';

interface ProviderInfoProps {
  provider: Provider;
}

export function ProviderInfo({ provider }: ProviderInfoProps) {
  return (
    <View className="bg-background-surface border border-border rounded-2xl p-4 mb-6">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-text-primary font-semibold text-lg mb-1">
            {provider.name}
          </Text>
          <Text className="text-text-secondary text-sm mb-2">
            {provider.address}
          </Text>
          <View className="flex-row items-center space-x-4">
            <Text className="text-text-secondary text-sm">
              📍 {provider.distance} km
            </Text>
            <Text className="text-text-secondary text-sm">
              ⭐ {provider.rating} ({provider.reviewCount} avis)
            </Text>
          </View>
        </View>
        <View className={`px-2 py-1 rounded-full ${
          provider.isOpen ? 'bg-accent-secondary' : 'bg-accent-alert'
        }`}>
          <Text className="text-white text-xs font-medium">
            {provider.isOpen ? 'Ouvert' : 'Fermé'}
          </Text>
        </View>
      </View>

      <Text className="text-text-secondary text-sm leading-5 mb-3">
        {provider.description}
      </Text>

      {/* Services */}
      <View className="border-t border-border pt-3">
        <Text className="text-text-secondary text-xs mb-2">Services:</Text>
        <Text className="text-text-secondary text-sm">
          {provider.services.join(' • ')}
        </Text>
      </View>
    </View>
  );
}