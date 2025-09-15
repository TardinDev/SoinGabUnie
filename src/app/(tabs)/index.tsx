import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { getAllProviders, getNotifications, getCurrentUser, getUnreadNotificationsCount } from '../../utils/mockData';
import type { ServiceType, Provider, Notification, User } from '../../types';

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
  const [activeFilters, setActiveFilters] = useState(['nearby']);
  const [showNotifications, setShowNotifications] = useState(false);
  const insets = useSafeAreaInsets();

  const notificationOpacity = useSharedValue(0);
  const notificationHeight = useSharedValue(0);

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: async (): Promise<Provider[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return getAllProviders();
    },
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getNotifications();
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return getCurrentUser();
    },
  });

  const unreadNotificationsCount = getUnreadNotificationsCount();

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const toggleNotifications = () => {
    if (showNotifications) {
      notificationOpacity.value = withTiming(0, { duration: 300 });
      notificationHeight.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setShowNotifications)(false);
      });
    } else {
      setShowNotifications(true);
      notificationOpacity.value = withTiming(1, { duration: 400 });
      notificationHeight.value = withTiming(1, { duration: 400 });
    }
  };

  const navigateToCategory = (type: ServiceType) => {
    router.push(`/category/${type}`);
  };

  const navigateToProvider = (providerId: string) => {
    router.push(`/provider/${providerId}`);
  };

  const nearbyProviders = providers.slice(0, 3);
  const popularProviders = providers.filter(p => p.rating >= 4.5).slice(0, 3);

  const animatedNotificationStyle = useAnimatedStyle(() => {
    return {
      opacity: notificationOpacity.value,
      height: notificationHeight.value * 200, // Hauteur maximale de 200px
      overflow: 'hidden',
    };
  });

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold"
                  style={{ color: '#8A5CF6' }}>
              SoinGabUnie
            </Text>

            <View className="flex-row items-center space-x-4">
              {/* Notification Icon */}
              <Pressable
                className="relative"
                onPress={toggleNotifications}
              >
                <Text className="text-2xl">🔔</Text>
                {unreadNotificationsCount > 0 && (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-accent-alert rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* User Profile */}
              <Pressable>
                {user ? (
                  <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-primary">
                    <Image
                      source={{ uri: user.avatar }}
                      className="w-full h-full"
                      style={{ resizeMode: 'cover' }}
                    />
                  </View>
                ) : (
                  <View className="w-10 h-10 rounded-full bg-background-surface border-2 border-border items-center justify-center">
                    <Text className="text-xl">👤</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          <Text className="text-text-secondary text-base">
            {user
              ? `Bonjour ${user.name.split(' ')[0]} ! Trouvez les meilleurs soins de santé`
              : 'Trouvez les meilleurs soins de santé au Gabon'
            }
          </Text>
        </View>

        {/* Notifications Content */}
        {notifications.filter(n => !n.isRead).length > 0 && (
          <Animated.View style={[animatedNotificationStyle]} className="px-6 mb-6">
            <Text className="text-text-primary text-lg font-semibold mb-3">
              Notifications récentes
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-4">
                {notifications
                  .filter(n => !n.isRead)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 4)
                  .map((notification) => (
                    <Pressable
                      key={notification.id}
                      className={`w-80 rounded-2xl p-4 border ${
                        notification.priority === 'urgent'
                          ? 'bg-red-600/10 border-red-600/30'
                          : notification.priority === 'high'
                            ? 'bg-orange-600/10 border-orange-600/30'
                            : 'bg-background-surface border-border'
                      }`}
                    >
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className={`font-semibold text-sm flex-1 ${
                          notification.priority === 'urgent'
                            ? 'text-red-200'
                            : notification.priority === 'high'
                              ? 'text-orange-200'
                              : 'text-text-primary'
                        }`}>
                          {notification.title}
                        </Text>
                        <Text className={`text-lg ${
                          notification.type === 'delivery' ? '🏍️' :
                          notification.type === 'pharmacy' ? '💊' :
                          notification.type === 'doctor' ? '👨‍⚕️' :
                          notification.type === 'clinic' ? '🏥' :
                          notification.type === 'hospital' ? '🏨' :
                          notification.type === 'tradipractitioner' ? '🌿' : '📢'
                        }`}>
                        </Text>
                      </View>
                      <Text className={`text-xs leading-4 mb-2 ${
                        notification.priority === 'urgent'
                          ? 'text-red-200/80'
                          : notification.priority === 'high'
                            ? 'text-orange-200/80'
                            : 'text-text-secondary'
                      }`}>
                        {notification.message.length > 100
                          ? `${notification.message.substring(0, 100)}...`
                          : notification.message
                        }
                      </Text>
                      {notification.fromProvider && (
                        <Text className="text-xs text-accent-primary font-medium">
                          De: {notification.fromProvider}
                        </Text>
                      )}
                    </Pressable>
                  ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}


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

        {/* Delivery Section */}
        <View className="px-6 mb-8">
          <Pressable
            onPress={() => navigateToCategory('delivery')}
            className="bg-orange-600 rounded-2xl p-6 active:opacity-90"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold mb-2">
                  Livraison Express 🏍️
                </Text>
                <Text className="text-orange-100 text-sm mb-3">
                  Commandez vos médicaments et recevez-les rapidement
                </Text>
                <View className="flex-row items-center">
                  <View className="bg-orange-700 px-3 py-1 rounded-full mr-2">
                    <Text className="text-orange-100 text-xs font-medium">
                      AirtelMoney
                    </Text>
                  </View>
                  <View className="bg-orange-700 px-3 py-1 rounded-full">
                    <Text className="text-orange-100 text-xs font-medium">
                      MoovMoney
                    </Text>
                  </View>
                </View>
              </View>
              <View className="w-16 h-16 bg-white bg-opacity-20 rounded-full items-center justify-center">
                <Text className="text-2xl">🚚</Text>
              </View>
            </View>
          </Pressable>
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