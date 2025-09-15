import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import type { BookingFormData } from '../utils/validation';

interface BookingFormProps {
  formData: BookingFormData;
  errors: Partial<Record<keyof BookingFormData, string>>;
  onUpdateField: (field: keyof BookingFormData, value: string) => void;
}

export function BookingForm({ formData, errors, onUpdateField }: BookingFormProps) {
  return (
    <View className="space-y-6">
      {/* Nom */}
      <View>
        <Text className="text-text-primary text-sm font-medium mb-2">
          Nom complet *
        </Text>
        <TextInput
          className={`bg-background-surface border rounded-2xl px-4 py-3 text-text-primary ${
            errors.userName ? 'border-accent-alert' : 'border-border'
          }`}
          placeholder="Votre nom et prénom"
          placeholderTextColor="#B4B8C5"
          value={formData.userName}
          onChangeText={(value) => onUpdateField('userName', value)}
        />
        {errors.userName && (
          <Text className="text-accent-alert text-xs mt-1">{errors.userName}</Text>
        )}
      </View>

      {/* Téléphone */}
      <View>
        <Text className="text-text-primary text-sm font-medium mb-2">
          Téléphone *
        </Text>
        <TextInput
          className={`bg-background-surface border rounded-2xl px-4 py-3 text-text-primary ${
            errors.phone ? 'border-accent-alert' : 'border-border'
          }`}
          placeholder="+241 XX XX XX XX"
          placeholderTextColor="#B4B8C5"
          value={formData.phone}
          onChangeText={(value) => onUpdateField('phone', value)}
          keyboardType="phone-pad"
        />
        {errors.phone && (
          <Text className="text-accent-alert text-xs mt-1">{errors.phone}</Text>
        )}
      </View>

      {/* Motif */}
      <View>
        <Text className="text-text-primary text-sm font-medium mb-2">
          Motif de consultation *
        </Text>
        <TextInput
          className={`bg-background-surface border rounded-2xl px-4 py-3 text-text-primary ${
            errors.reason ? 'border-accent-alert' : 'border-border'
          }`}
          placeholder="Décrivez brièvement votre motif"
          placeholderTextColor="#B4B8C5"
          value={formData.reason}
          onChangeText={(value) => onUpdateField('reason', value)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        {errors.reason && (
          <Text className="text-accent-alert text-xs mt-1">{errors.reason}</Text>
        )}
      </View>

      {/* Notes supplémentaires */}
      <View>
        <Text className="text-text-primary text-sm font-medium mb-2">
          Notes supplémentaires
        </Text>
        <TextInput
          className="bg-background-surface border border-border rounded-2xl px-4 py-3 text-text-primary"
          placeholder="Informations complémentaires (optionnel)"
          placeholderTextColor="#B4B8C5"
          value={formData.notes}
          onChangeText={(value) => onUpdateField('notes', value)}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}