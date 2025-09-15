import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '../../stores/bookingStore';
import { getProviderById } from '../../utils/mockData';
import { bookingSchema, type BookingFormData } from '../../utils/validation';
import * as Haptics from 'expo-haptics';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

export default function BookingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const insets = useSafeAreaInsets();
  const { addBooking } = useBookingStore();

  const [formData, setFormData] = useState<BookingFormData>({
    userName: '',
    phone: '',
    reason: '',
    date: '',
    time: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: provider } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getProviderById(providerId!);
    },
    enabled: !!providerId,
  });

  const updateField = (field: keyof BookingFormData, value: string) => {
    setFormData((prev: BookingFormData) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      bookingSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const validationErrors: Partial<Record<keyof BookingFormData, string>> = {};
        (error as any).issues.forEach((issue: any) => {
          const field = issue.path[0] as keyof BookingFormData;
          if (field) {
            validationErrors[field] = issue.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!provider) return;

    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      addBooking({
        providerId: provider.id,
        providerName: provider.name,
        userName: formData.userName,
        reason: formData.reason,
        date: formData.date,
        time: formData.time,
        status: 'pending',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        provider.type === 'delivery' ? 'Demande envoyée' : 'Réservation confirmée',
        provider.type === 'delivery'
          ? `Votre demande de livraison a été envoyée à ${provider.name}. Il vous contactera pour confirmer et organiser la livraison.`
          : `Votre demande de rendez-vous avec ${provider.name} a été envoyée. Vous recevrez une confirmation prochainement.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Impossible de traiter votre demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    router.back();
  };

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
      <View className="px-6 py-4 flex-row items-center border-b border-border">
        <Pressable onPress={goBack} className="mr-4">
          <Text className="text-accent-primary text-lg">←</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-text-primary text-lg font-bold">
            {provider.type === 'delivery' ? 'Demande de livraison' : 'Réservation'}
          </Text>
          <Text className="text-text-secondary text-sm">
            {provider.name}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 space-y-6">
          {/* Personal Information */}
          <View className="bg-background-surface border border-border rounded-2xl p-6">
            <Text className="text-text-primary text-lg font-semibold mb-4">
              Informations personnelles
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-text-primary font-medium mb-2">
                  Nom complet *
                </Text>
                <TextInput
                  className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary"
                  placeholder="Votre nom et prénom"
                  placeholderTextColor="#B4B8C5"
                  value={formData.userName}
                  onChangeText={(value) => updateField('userName', value)}
                />
                {errors.userName && (
                  <Text className="text-accent-alert text-sm mt-1">
                    {errors.userName}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-text-primary font-medium mb-2">
                  Téléphone *
                </Text>
                <TextInput
                  className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary"
                  placeholder="+241 XX XX XX XX"
                  placeholderTextColor="#B4B8C5"
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                />
                {errors.phone && (
                  <Text className="text-accent-alert text-sm mt-1">
                    {errors.phone}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Delivery/Appointment Details */}
          <View className="bg-background-surface border border-border rounded-2xl p-6">
            <Text className="text-text-primary text-lg font-semibold mb-4">
              {provider.type === 'delivery' ? 'Détails de la livraison' : 'Détails du rendez-vous'}
            </Text>

            <View className="space-y-4">
              {provider.type === 'delivery' && (
                <>
                  <View>
                    <Text className="text-text-primary font-medium mb-2">
                      Code pharmacien *
                    </Text>
                    <TextInput
                      className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary text-center text-lg font-mono"
                      placeholder="Ex: PH123A4"
                      placeholderTextColor="#B4B8C5"
                      value={formData.reason}
                      onChangeText={(value) => updateField('reason', value.toUpperCase())}
                      autoCapitalize="characters"
                    />
                    <Text className="text-text-secondary text-xs mt-1">
                      Code fourni par la pharmacie lors de la commande
                    </Text>
                    {errors.reason && (
                      <Text className="text-accent-alert text-sm mt-1">
                        {errors.reason}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text className="text-text-primary font-medium mb-2">
                      Adresse de livraison *
                    </Text>
                    <TextInput
                      className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary"
                      placeholder="Votre adresse complète"
                      placeholderTextColor="#B4B8C5"
                      value={formData.notes}
                      onChangeText={(value) => updateField('notes', value)}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                    {errors.notes && (
                      <Text className="text-accent-alert text-sm mt-1">
                        {errors.notes}
                      </Text>
                    )}
                  </View>
                </>
              )}

              {provider.type !== 'delivery' && (
                <View>
                  <Text className="text-text-primary font-medium mb-2">
                    Motif de consultation *
                  </Text>
                  <TextInput
                    className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary"
                    placeholder="Ex: Consultation générale, urgence..."
                    placeholderTextColor="#B4B8C5"
                    value={formData.reason}
                    onChangeText={(value) => updateField('reason', value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  {errors.reason && (
                    <Text className="text-accent-alert text-sm mt-1">
                      {errors.reason}
                    </Text>
                  )}
                </View>
              )}

              {provider.type !== 'delivery' && (
                <>
                  <View>
                    <Text className="text-text-primary font-medium mb-2">
                      Date souhaitée *
                    </Text>
                    <TextInput
                      className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary"
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#B4B8C5"
                      value={formData.date}
                      onChangeText={(value) => updateField('date', value)}
                    />
                    <Text className="text-text-secondary text-xs mt-1">
                      Format: YYYY-MM-DD (ex: 2024-03-15)
                    </Text>
                    {errors.date && (
                      <Text className="text-accent-alert text-sm mt-1">
                        {errors.date}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-text-primary font-medium mb-3">
                      Heure préférée *
                    </Text>
                    <View className="flex-row flex-wrap">
                      {TIME_SLOTS.map((time) => (
                        <Pressable
                          key={time}
                          onPress={() => updateField('time', time)}
                          className={`px-4 py-2 rounded-xl mr-3 mb-3 border ${
                            formData.time === time
                              ? 'bg-accent-primary border-accent-primary'
                              : 'bg-background-primary border-border'
                          }`}
                        >
                          <Text
                            className={`font-medium ${
                              formData.time === time
                                ? 'text-white'
                                : 'text-text-secondary'
                            }`}
                          >
                            {time}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    {errors.time && (
                      <Text className="text-accent-alert text-sm mt-1">
                        {errors.time}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-text-primary font-medium mb-2">
                      Notes additionnelles
                    </Text>
                    <TextInput
                      className="bg-background-primary border border-border rounded-xl px-4 py-3 text-text-primary"
                      placeholder="Informations complémentaires..."
                      placeholderTextColor="#B4B8C5"
                      value={formData.notes}
                      onChangeText={(value) => updateField('notes', value)}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                    {errors.notes && (
                      <Text className="text-accent-alert text-sm mt-1">
                        {errors.notes}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Important Notice */}
          <View className={`border rounded-2xl p-4 ${
            provider.type === 'delivery'
              ? 'bg-orange-600/10 border-orange-600/30'
              : 'bg-yellow-600/10 border-yellow-600/30'
          }`}>
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">{provider.type === 'delivery' ? '🏍️' : 'ℹ️'}</Text>
              <View className="flex-1">
                <Text className={`font-semibold mb-1 ${
                  provider.type === 'delivery' ? 'text-orange-200' : 'text-yellow-200'
                }`}>
                  {provider.type === 'delivery' ? 'Comment ça marche' : 'Important'}
                </Text>
                <Text className={`text-sm leading-5 ${
                  provider.type === 'delivery' ? 'text-orange-200/80' : 'text-yellow-200/80'
                }`}>
                  {provider.type === 'delivery'
                    ? 'Votre demande sera envoyée au livreur. Il vous contactera pour confirmer et récupérer vos médicaments. Paiement par AirtelMoney ou MoovMoney.'
                    : 'Votre demande sera envoyée au prestataire. Vous recevrez une confirmation par SMS ou appel téléphonique.'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`py-4 rounded-2xl ${
              isSubmitting
                ? 'bg-background-surface border border-border'
                : provider.type === 'delivery'
                  ? 'bg-orange-600 active:opacity-80'
                  : 'bg-accent-primary active:opacity-80'
            }`}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                isSubmitting ? 'text-text-secondary' : 'text-white'
              }`}
            >
              {isSubmitting
                ? 'Envoi en cours...'
                : provider.type === 'delivery'
                  ? 'Contacter le livreur'
                  : 'Confirmer la réservation'
              }
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}