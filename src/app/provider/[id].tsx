import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { getProviderById } from '../../utils/mockData';

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAYS_FRENCH = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export default function ProviderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'services'>('info');
  const insets = useSafeAreaInsets();
  const favoriteScale = useSharedValue(1);

  const { data: provider, isLoading } = useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getProviderById(id!);
    },
    enabled: !!id,
  });

  const goBack = () => {
    router.back();
  };

  const navigateToBooking = () => {
    if (provider) {
      router.push(`/booking/${provider.id}`);
    }
  };

  const toggleFavorite = () => {
    favoriteScale.value = withSpring(0.8, {}, () => {
      favoriteScale.value = withSpring(1);
    });
  };

  const favoriteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center">
        <View className="w-16 h-16 bg-background-surface rounded-2xl items-center justify-center mb-4">
          <Text className="text-accent-primary text-2xl">⏳</Text>
        </View>
        <Text className="text-text-secondary">Chargement...</Text>
      </View>
    );
  }

  if (!provider) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center">
        <Text className="text-text-primary">Prestataire non trouvé</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border">
        <Pressable onPress={goBack}>
          <Text className="text-accent-primary text-lg">←</Text>
        </Pressable>
        <Text className="text-text-primary text-lg font-semibold">
          Détails
        </Text>
        <Animated.View style={favoriteStyle}>
          <Pressable onPress={toggleFavorite}>
            <Text className="text-2xl">🤍</Text>
          </Pressable>
        </Animated.View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Provider Info Card */}
        <View className="mx-6 my-6 bg-background-surface border border-border rounded-2xl p-6">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-text-primary text-2xl font-bold mb-2">
                {provider.name}
              </Text>
              <Text className="text-text-secondary text-base mb-3">
                {provider.address}
              </Text>
              <View className="flex-row items-center space-x-4 mb-3">
                <Text className="text-text-secondary text-sm">
                  📍 {provider.distance} km
                </Text>
                <Text className="text-text-secondary text-sm">
                  ⭐ {provider.rating} ({provider.reviewCount} avis)
                </Text>
                {provider.type === 'delivery' && provider.deliveryFee && (
                  <Text className="text-accent-primary text-sm font-semibold">
                    {provider.deliveryFee} FCFA
                  </Text>
                )}
              </View>
              {provider.type === 'delivery' && provider.estimatedTime && (
                <View className="mb-3">
                  <Text className="text-accent-secondary text-sm font-semibold">
                    ⏱️ Livraison en {provider.estimatedTime}
                  </Text>
                </View>
              )}
            </View>
            <View className={`px-3 py-2 rounded-xl ${
              provider.isOpen ? 'bg-accent-secondary' : 'bg-accent-alert'
            }`}>
              <Text className="text-white text-sm font-semibold">
                {provider.isOpen ? 'Ouvert' : 'Fermé'}
              </Text>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-4">
            {provider.tags.map((tag: string, index: number) => (
              <View key={index} className="bg-background-primary px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-text-secondary text-sm">{tag}</Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          <Pressable
            onPress={navigateToBooking}
            className={`py-4 rounded-2xl active:opacity-80 ${
              provider.type === 'delivery' ? 'bg-orange-600' : 'bg-accent-primary'
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {provider.type === 'delivery' ? 'Demander une livraison' : 'Prendre rendez-vous'}
            </Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="px-6 mb-6">
          <View className="flex-row bg-background-surface rounded-2xl p-2 border border-border">
            {[
              { key: 'info', label: 'Infos' },
              { key: 'hours', label: 'Horaires' },
              { key: 'services', label: 'Services' },
            ].map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === tab.key ? 'bg-accent-primary' : ''
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    activeTab === tab.key ? 'text-white' : 'text-text-secondary'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View className="px-6 pb-8">
          {activeTab === 'info' && (
            <View className="bg-background-surface border border-border rounded-2xl p-6">
              <Text className="text-text-primary text-lg font-semibold mb-4">
                À propos
              </Text>
              <Text className="text-text-secondary leading-6">
                {provider.description}
              </Text>
            </View>
          )}

          {activeTab === 'hours' && (
            <View className="bg-background-surface border border-border rounded-2xl p-6">
              <Text className="text-text-primary text-lg font-semibold mb-4">
                Horaires d'ouverture
              </Text>
              <View className="space-y-3">
                {DAYS_ORDER.map((day) => {
                  const hours = provider.hours[day];
                  return (
                    <View key={day} className="flex-row justify-between items-center py-2">
                      <Text className="text-text-primary font-medium">
                        {DAYS_FRENCH[day as keyof typeof DAYS_FRENCH]}
                      </Text>
                      <Text className="text-text-secondary">
                        {hours ? `${hours.open} - ${hours.close}` : 'Fermé'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {activeTab === 'services' && (
            <View className="bg-background-surface border border-border rounded-2xl p-6">
              <Text className="text-text-primary text-lg font-semibold mb-4">
                Services disponibles
              </Text>
              <View className="space-y-3">
                {provider.services.map((service: string, index: number) => (
                  <View key={index} className="flex-row items-center py-2">
                    <View className="w-2 h-2 bg-accent-primary rounded-full mr-3" />
                    <Text className="text-text-secondary flex-1">{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Contact Actions */}
        <View className="px-6 pb-8">
          <View className="bg-background-surface border border-border rounded-2xl p-6">
            <Text className="text-text-primary text-lg font-semibold mb-4">
              Contact
            </Text>
            <View className="space-y-3">
              <Pressable className="flex-row items-center py-3 px-4 bg-background-primary rounded-xl">
                <Text className="text-2xl mr-3">📞</Text>
                <Text className="text-text-primary font-medium">Appeler</Text>
              </Pressable>
              <Pressable className="flex-row items-center py-3 px-4 bg-background-primary rounded-xl">
                <Text className="text-2xl mr-3">📍</Text>
                <Text className="text-text-primary font-medium">Itinéraire</Text>
              </Pressable>
              <Pressable className="flex-row items-center py-3 px-4 bg-background-primary rounded-xl">
                <Text className="text-2xl mr-3">💬</Text>
                <Text className="text-text-primary font-medium">Message</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}