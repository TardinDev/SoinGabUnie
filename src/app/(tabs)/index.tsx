import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { getAllProviders, getNotifications, getCurrentUser, getUnreadNotificationsCount, getUpcomingEventsCount } from '../../utils/mockData';
import { Header, NotificationPanel, FilterChips, ServiceGrid, DeliverySection, ProviderSection } from '../../components';
import ScreenWrapper from '../../components/ScreenWrapper';
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
      const user = getCurrentUser();
      if (!user) {
        throw new Error("Aucun utilisateur trouvé");
      }
      return user;
    },
  });

  const unreadNotificationsCount = getUnreadNotificationsCount();
  const upcomingEventsCount = getUpcomingEventsCount();

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
      height: notificationHeight.value * 200, 
      overflow: 'hidden',
    };
  });

  // Animation pour l'icône de feu
  const fireScale = useSharedValue(1);
  const fireOpacity = useSharedValue(0.8);

  const animateFireIcon = () => {
    fireScale.value = withTiming(1.2, { duration: 800 }, () => {
      fireScale.value = withTiming(1, { duration: 800 });
    });
    fireOpacity.value = withTiming(1, { duration: 400 }, () => {
      fireOpacity.value = withTiming(0.8, { duration: 400 });
    });
  };

  // Démarre l'animation en boucle
  React.useEffect(() => {
    const interval = setInterval(animateFireIcon, 2000);
    return () => clearInterval(interval);
  }, []);

  const animatedFireStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fireScale.value }],
      opacity: fireOpacity.value,
    };
  });

  return (
    <ScreenWrapper style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header
          user={user}
          unreadNotificationsCount={unreadNotificationsCount}
          onNotificationPress={toggleNotifications}
        />

        <NotificationPanel
          notifications={notifications}
          animatedStyle={animatedNotificationStyle}
        />

        <FilterChips
          filters={FILTER_CHIPS}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
        />

        <DeliverySection onDeliveryPress={navigateToCategory} />

        <ServiceGrid
          services={SERVICES}
          upcomingEventsCount={upcomingEventsCount}
          animatedFireStyle={animatedFireStyle}
          onServicePress={navigateToCategory}
        />

        <ProviderSection
          title="Proche de vous"
          providers={nearbyProviders}
          onProviderPress={navigateToProvider}
          variant="nearby"
        />

        <ProviderSection
          title="Populaires"
          providers={popularProviders}
          onProviderPress={navigateToProvider}
          variant="popular"
        />
      </ScrollView>
    </ScreenWrapper>
  );
}