import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getAllProviders } from '../../utils/mockData';
import type { ServiceType, Provider } from '../../types';

const SERVICES = [
  { type: 'pharmacy' as ServiceType, title: 'Pharmacie', color: 'bg-blue-600', image: 'https://www.pod.fr/wp-content/uploads/2020/05/dans-quelle-ville-acheter-sa-pharmacie-1.jpg' },
  { type: 'doctor' as ServiceType, title: 'Médecins', color: 'bg-green-600', image: 'https://img.freepik.com/photos-gratuite/medecin-aide-humanitaire-afrique-prenant-soin-patient_23-2149117845.jpg?semt=ais_hybrid&w=740&q=80' },
  { type: 'clinic' as ServiceType, title: 'Cliniques', color: 'bg-purple-600', image: 'https://scontent-cdg4-1.xx.fbcdn.net/v/t39.30808-6/302566289_392239139724537_1985908333651052967_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ye6yAjGQq1YQ7kNvwEhTquQ&_nc_oc=AdmWHKv0vtSEl41ZvYf7FSAlp-61pM-9zZnKOkFEG0_ZLgshzxrt0REwNbs2BOCu3nz3DEZkzGVuS5hjr-Cpf4Qj&_nc_zt=23&_nc_ht=scontent-cdg4-1.xx&_nc_gid=L5Wf7WlgMSkKCynJ9DRCUA&oh=00_AfZVHVLxwFI62N1JfOT9x5g2M2p_SC183yh7ajQVt4hVNw&oe=68CBD93A' },
  { type: 'hospital' as ServiceType, title: 'Hôpitaux', color: 'bg-red-600', image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrWymETnjl0KdoRMceBxBcyrxWUzptaF7jbmYHT4sqJZr6lnyiI-n5jIR9ApQWXp-psWG0Zue0aVNcwoG5m1N5W-i15SDh2m45z72g6htc6w6wh3z0-UTb7NqDMTQKtIJkqg5tK=s1360-w1360-h1020-rw' },
  { type: 'tradipractitioner' as ServiceType, title: 'Tradipraticiens', color: 'bg-emerald-600', image: 'https://www.divergence-images.com/wimages/800-800/204749.jpg' },
];

const FILTER_CHIPS = [
  { id: 'nearby', label: 'Proche', active: true },
  { id: 'open', label: 'Ouvert', active: false },
  { id: 'rating', label: 'Bien noté', active: false },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(['nearby']);
  const insets = useSafeAreaInsets();

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: async (): Promise<Provider[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return getAllProviders();
    },
  });

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const navigateToCategory = (type: ServiceType) => {
    router.push(`/category/${type}`);
  };

  const navigateToProvider = (providerId: string) => {
    router.push(`/provider/${providerId}`);
  };

  const nearbyProviders = providers.slice(0, 3);
  const popularProviders = providers.filter(p => p.rating >= 4.5).slice(0, 3);

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-text-primary text-3xl font-bold mb-2">
            SoinGabUnie
          </Text>
          <Text className="text-text-secondary text-base">
            Trouvez les meilleurs soins de santé
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View className="bg-background-surface rounded-2xl px-4 py-3 border border-border">
            <TextInput
              className="text-text-primary text-base"
              placeholder="Rechercher un service, médecin..."
              placeholderTextColor="#B4B8C5"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View className="px-6 mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {FILTER_CHIPS.map((filter) => (
                <Pressable
                  key={filter.id}
                  onPress={() => toggleFilter(filter.id)}
                  className={`px-4 py-2 rounded-full border ${
                    activeFilters.includes(filter.id)
                      ? 'bg-accent-primary border-accent-primary'
                      : 'bg-background-surface border-border'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      activeFilters.includes(filter.id)
                        ? 'text-white'
                        : 'text-text-secondary'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Services Grid */}
        <View className="px-6 mb-8">
          <Text className="text-text-primary text-xl font-bold mb-4">
            Services
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {SERVICES.map((service, index) => (
              <Pressable
                key={service.type}
                onPress={() => navigateToCategory(service.type)}
                className={`w-[48%] h-32 bg-background-surface border border-border rounded-2xl overflow-hidden mb-4 active:opacity-80 ${
                  index === SERVICES.length - 1 && SERVICES.length % 2 !== 0 ? 'w-full' : ''
                }`}
              >
                <View className="h-full">
                  <View className="flex-[3] w-full">
                    <Image
                      source={{ uri: service.image }}
                      className="w-full h-full"
                      style={{ resizeMode: 'cover' }}
                    />
                  </View>
                  <View className="flex-[1] px-3 py-2 justify-center">
                    <Text className="text-text-primary font-semibold text-center text-sm">
                      {service.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Nearby Section */}
        <View className="px-6 mb-8">
          <Text className="text-text-primary text-xl font-bold mb-4">
            Proche de vous
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-4">
              {nearbyProviders.map((provider) => (
                <Pressable
                  key={provider.id}
                  onPress={() => navigateToProvider(provider.id)}
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
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Popular Section */}
        <View className="px-6 mb-8">
          <Text className="text-text-primary text-xl font-bold mb-4">
            Populaires
          </Text>
          <View className="space-y-3">
            {popularProviders.map((provider) => (
              <Pressable
                key={provider.id}
                onPress={() => navigateToProvider(provider.id)}
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
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}