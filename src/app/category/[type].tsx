import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getProvidersByType } from '../../utils/mockData';
import type { Provider, ServiceType } from '../../types';

const CATEGORY_TITLES: Record<ServiceType, string> = {
  pharmacy: 'Pharmacies',
  doctor: 'Médecins',
  clinic: 'Cliniques',
  hospital: 'Hôpitaux',
  tradipractitioner: 'Tradipraticiens',
  delivery: 'Livreurs Disponibles',
};

const CATEGORY_DESCRIPTIONS: Record<ServiceType, string> = {
  pharmacy: 'Trouvez des pharmacies près de chez vous',
  doctor: 'Consultez des médecins qualifiés',
  clinic: 'Découvrez les cliniques spécialisées',
  hospital: 'Accédez aux hôpitaux de la région',
  tradipractitioner: 'Consultez des tradipraticiens expérimentés',
  delivery: 'Choisissez votre livreur pour vos médicaments',
};

const SORT_OPTIONS = [
  { id: 'distance', label: 'Distance' },
  { id: 'rating', label: 'Note' },
  { id: 'name', label: 'Nom' },
];

export default function CategoryScreen() {
  const { type } = useLocalSearchParams<{ type: ServiceType }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const insets = useSafeAreaInsets();

  const { data: providers = [] } = useQuery({
    queryKey: ['providers', type],
    queryFn: async (): Promise<Provider[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getProvidersByType(type);
    },
    enabled: !!type,
  });

  const navigateToProvider = (providerId: string) => {
    router.push(`/provider/${providerId}`);
  };

  const goBack = () => {
    router.back();
  };

  const filteredProviders = providers
    .filter(provider =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (!type) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center">
        <Text className="text-text-primary">Catégorie non trouvée</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-border">
        <Pressable onPress={goBack} className="mr-4">
          <Text className="text-accent-primary text-lg">←</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-text-primary text-xl font-bold">
            {CATEGORY_TITLES[type]}
          </Text>
          <Text className="text-text-secondary text-sm">
            {CATEGORY_DESCRIPTIONS[type]}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search & Sort */}
        <View className="px-6 py-4 space-y-4">
          {/* Search Bar */}
          <View className="bg-background-surface rounded-2xl px-4 py-3 border border-border">
            <TextInput
              className="text-text-primary text-base"
              placeholder="Rechercher..."
              placeholderTextColor="#B4B8C5"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Sort Options */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {SORT_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => setSortBy(option.id)}
                  className={`px-4 py-2 rounded-full border ${
                    sortBy === option.id
                      ? 'bg-accent-primary border-accent-primary'
                      : 'bg-background-surface border-border'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      sortBy === option.id
                        ? 'text-white'
                        : 'text-text-secondary'
                    }`}
                  >
                    Trier par {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results */}
        <View className="px-6 pb-8">
          <Text className="text-text-secondary text-sm mb-4">
            {filteredProviders.length} résultat{filteredProviders.length > 1 ? 's' : ''}
          </Text>

          <View className="space-y-4">
            {filteredProviders.map((provider) => (
              <Pressable
                key={provider.id}
                onPress={() => navigateToProvider(provider.id)}
                className="bg-background-surface border border-border rounded-2xl p-4 active:opacity-80"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-text-primary font-semibold text-lg mb-1">
                      {provider.name}
                    </Text>
                    <Text className="text-text-secondary text-sm mb-2">
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
                        <Text className="text-accent-primary text-sm font-medium">
                          {provider.deliveryFee} FCFA
                        </Text>
                      )}
                    </View>
                    {provider.type === 'delivery' && provider.estimatedTime && (
                      <View className="mb-3">
                        <Text className="text-accent-secondary text-sm font-medium">
                          ⏱️ {provider.estimatedTime}
                        </Text>
                      </View>
                    )}
                    <Text className="text-text-secondary text-sm leading-5 mb-3">
                      {provider.description.length > 100
                        ? `${provider.description.substring(0, 100)}...`
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

                {/* Tags */}
                <View className="flex-row flex-wrap mb-3">
                  {provider.tags.slice(0, 3).map((tag: string, index: number) => (
                    <View key={index} className="bg-background-primary px-2 py-1 rounded mr-2 mb-1">
                      <Text className="text-text-secondary text-xs">{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Services */}
                <View className="border-t border-border pt-3">
                  <Text className="text-text-secondary text-xs mb-2">Services:</Text>
                  <Text className="text-text-secondary text-sm">
                    {provider.services.slice(0, 3).join(' • ')}
                    {provider.services.length > 3 && ' ...'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {filteredProviders.length === 0 && searchQuery && (
            <View className="items-center justify-center py-16">
              <Text className="text-text-secondary text-center">
                Aucun résultat pour "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}