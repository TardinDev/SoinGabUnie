import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getProvidersByType, getUpcomingEvents, getTraditionalProducts } from '../../utils/mockData';
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

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return getUpcomingEvents();
    },
    enabled: type === 'tradipractitioner',
  });

  const { data: traditionalProducts = [] } = useQuery({
    queryKey: ['traditionalProducts'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
      return getTraditionalProducts();
    },
    enabled: type === 'tradipractitioner',
  });

  const navigateToProvider = (providerId: string) => {
    router.push(`/provider/${providerId}`);
  };

  const goBack = () => {
    router.back();
  };

  const getTradipractitionerCardStyle = (providerId: string) => {
    if (type !== 'tradipractitioner') return 'bg-background-surface border border-border';

    const colors = [
      'bg-purple-900/20 border border-purple-500/30', // Violet spirituel
      'bg-emerald-900/20 border border-emerald-500/30', // Vert nature
      'bg-amber-900/20 border border-amber-500/30', // Ambre terre
      'bg-blue-900/20 border border-blue-500/30', // Bleu sagesse
      'bg-rose-900/20 border border-rose-500/30', // Rose guérison
      'bg-teal-900/20 border border-teal-500/30', // Turquoise eau
      'bg-orange-900/20 border border-orange-500/30', // Orange énergie
    ];

    const index = parseInt(providerId) % colors.length;
    return colors[index];
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

        {/* Traditional Products for Tradipractitioners */}
        {type === 'tradipractitioner' && traditionalProducts.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center mb-4">
              <Text className="text-text-primary text-lg font-bold flex-1">
                Produits Traditionnels
              </Text>
              <Text className="text-emerald-500 text-sm">🌿</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {traditionalProducts.map((product) => (
                  <Pressable
                    key={product.id}
                    className="w-32 bg-background-surface border border-border rounded-2xl overflow-hidden active:opacity-80"
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: product.image }}
                        className="w-full h-20"
                        style={{ resizeMode: 'cover' }}
                      />
                      {!product.inStock && (
                        <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
                          <Text className="text-white text-xs font-medium">Rupture</Text>
                        </View>
                      )}
                      <View className="absolute top-1 right-1 bg-background-primary bg-opacity-80 rounded-full px-1 py-0.5">
                        <Text className="text-text-secondary text-xs">⭐ {product.rating}</Text>
                      </View>
                    </View>

                    <View className="p-2">
                      <Text className="text-text-primary font-semibold text-xs mb-1" numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text className="text-text-secondary text-xs mb-1 leading-3" numberOfLines={2}>
                        {product.description}
                      </Text>

                      <View className="mb-1">
                        <Text className="text-accent-secondary text-xs font-bold">
                          {product.price}
                        </Text>
                      </View>

                      <View className="mb-1">
                        <Text className="text-text-secondary text-xs" numberOfLines={1}>
                          Par: {product.seller}
                        </Text>
                      </View>

                      <View className="bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        <Text className="text-emerald-300 text-xs font-medium text-center" numberOfLines={1}>
                          {product.category}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Upcoming Events for Tradipractitioners */}
        {type === 'tradipractitioner' && events.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center mb-4">
              <Text className="text-text-primary text-lg font-bold flex-1">
                Événements à venir
              </Text>
              <Text className="text-accent-primary text-sm">🔥</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-4">
                {events.map((event) => (
                  <Pressable
                    key={event.id}
                    className="w-72 bg-background-surface border border-border rounded-2xl overflow-hidden active:opacity-80"
                  >
                    <Image
                      source={{ uri: event.image }}
                      className="w-full h-20"
                      style={{ resizeMode: 'cover' }}
                    />
                    <View className="p-3">
                      <Text className="text-text-primary font-semibold text-sm mb-1">
                        {event.title}
                      </Text>
                      <Text className="text-text-secondary text-xs mb-2 leading-4">
                        {event.description.length > 60
                          ? `${event.description.substring(0, 60)}...`
                          : event.description
                        }
                      </Text>

                      <View className="space-y-1 mb-2">
                        <View className="flex-row items-center">
                          <Text className="text-accent-primary text-xs font-medium">
                            📅 {event.date} • {event.time}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="text-text-secondary text-xs">
                            📍 {event.location}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-end mb-2">
                        <Text className="text-text-secondary text-xs">
                          {event.currentParticipants}/{event.maxParticipants} participants
                        </Text>
                      </View>

                      <View className="flex-row flex-wrap">
                        {event.tags.slice(0, 2).map((tag, index) => (
                          <View key={index} className="bg-background-primary px-1.5 py-0.5 rounded mr-1">
                            <Text className="text-text-secondary text-xs">{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

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
                className={`${getTradipractitionerCardStyle(provider.id)} rounded-2xl p-4 active:opacity-80`}
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