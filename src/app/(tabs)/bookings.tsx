import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingStore } from '../../stores/bookingStore';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useBookingStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-accent-secondary';
      case 'pending':
        return 'bg-yellow-600';
      case 'completed':
        return 'bg-blue-600';
      case 'cancelled':
        return 'bg-accent-alert';
      default:
        return 'bg-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-text-primary text-2xl font-bold mb-2">
            Réservations
          </Text>
          <Text className="text-text-secondary text-base">
            Gérez vos rendez-vous médicaux
          </Text>
        </View>

        {bookings.length === 0 ? (
          /* Empty State */
          <View className="flex-1 items-center justify-center px-8 py-16">
            <View className="w-24 h-24 bg-background-surface rounded-2xl items-center justify-center mb-6">
              <Text className="text-4xl">📅</Text>
            </View>
            <Text className="text-text-primary text-xl font-bold text-center mb-3">
              Aucune réservation
            </Text>
            <Text className="text-text-secondary text-center leading-6">
              Vos prochains rendez-vous apparaîtront ici une fois que vous aurez effectué une réservation.
            </Text>
          </View>
        ) : (
          /* Bookings List */
          <View className="px-6 pb-8">
            <View className="space-y-4">
              {bookings.map((booking) => (
                <View
                  key={booking.id}
                  className="bg-background-surface border border-border rounded-2xl p-4"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-text-primary font-semibold text-base mb-1">
                        {booking.providerName}
                      </Text>
                      <Text className="text-text-secondary text-sm">
                        {booking.reason}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      <Text className="text-white text-xs font-medium">
                        {getStatusText(booking.status)}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-border pt-3">
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-text-secondary text-sm">
                          📅 {new Date(booking.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text className="text-text-secondary text-sm">
                          🕒 {booking.time}
                        </Text>
                      </View>
                      {booking.status === 'pending' && (
                        <Pressable className="bg-accent-primary px-4 py-2 rounded-xl">
                          <Text className="text-white text-sm font-medium">
                            Modifier
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}