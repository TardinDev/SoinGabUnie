import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenWrapper style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-text-primary text-2xl font-bold mb-2">
            Favoris
          </Text>
          <Text className="text-text-secondary text-base">
            Vos prestataires de santé préférés
          </Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-8 py-16">
          <View className="w-24 h-24 bg-background-surface rounded-2xl items-center justify-center mb-6">
            <Text className="text-4xl">❤️</Text>
          </View>
          <Text className="text-text-primary text-xl font-bold text-center mb-3">
            Aucun favori pour le moment
          </Text>
          <Text className="text-text-secondary text-center leading-6">
            Ajoutez vos prestataires de santé préférés pour les retrouver facilement ici.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}