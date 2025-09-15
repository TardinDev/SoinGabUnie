import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Provider } from '../types';

interface ProviderCardProps {
  provider: Provider;
  onPress: (providerId: string) => void;
  variant?: 'nearby' | 'popular';
}

export function ProviderCard({ provider, onPress, variant = 'nearby' }: ProviderCardProps) {
  if (variant === 'nearby') {
    return (
      <Pressable
        key={provider.id}
        onPress={() => onPress(provider.id)}
        className="w-64 bg-background-surface border border-border rounded-2xl p-4 active:opacity-80"
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-text-primary font-semibold text-base flex-1">
            {provider.name}
          </Text>
          <View className={`px-2 py-1 rounded-full ${
            provider.isOpen ? 'bg-accent-secondary' : 'bg-accent-alert'
          }`}>
            <Text className="text-white text-xs font-medium">
              {provider.isOpen ? 'Ouvert' : 'Fermé'}
            </Text>
          </View>
        </View>
        <Text className="text-text-secondary text-sm mb-3">
          {provider.distance} km • ⭐ {provider.rating}
        </Text>
        <View className="flex-row flex-wrap">
          {provider.tags.slice(0, 2).map((tag: string, index: number) => (
            <View key={index} className="bg-background-primary px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-text-secondary text-xs">{tag}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      key={provider.id}
      onPress={() => onPress(provider.id)}
      className="bg-background-surface border border-border rounded-2xl p-4 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-text-primary font-semibold text-base mb-1">
            {provider.name}
          </Text>
          <Text className="text-text-secondary text-sm mb-2">
            {provider.distance} km • ⭐ {provider.rating} ({provider.reviewCount} avis)
          </Text>
          <Text className="text-text-secondary text-sm leading-5">
            {provider.description.length > 80
              ? `${provider.description.substring(0, 80)}...`
              : provider.description
            }
          </Text>
        </View>
        <View className={`ml-3 px-2 py-1 rounded-full ${
          provider.isOpen ? 'bg-accent-secondary' : 'bg-accent-alert'
        }`}>
          <Text className="text-white text-xs font-medium">
            {provider.isOpen ? 'Ouvert' : 'Fermé'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}