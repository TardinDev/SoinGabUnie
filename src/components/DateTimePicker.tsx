import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { BookingFormData } from '../utils/validation';

interface DateTimePickerProps {
  formData: BookingFormData;
  errors: Partial<Record<keyof BookingFormData, string>>;
  timeSlots: string[];
  onUpdateField: (field: keyof BookingFormData, value: string) => void;
}

export function DateTimePicker({
  formData,
  errors,
  timeSlots,
  onUpdateField
}: DateTimePickerProps) {
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <View className="space-y-6">
      {/* Date */}
      <View>
        <Text className="text-text-primary text-sm font-medium mb-3">
          Date souhaitée *
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {dates.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = formData.date === dateStr;
              return (
                <Pressable
                  key={dateStr}
                  onPress={() => onUpdateField('date', dateStr)}
                  className={`px-4 py-3 rounded-2xl border min-w-[80px] items-center ${
                    isSelected
                      ? 'bg-accent-primary border-accent-primary'
                      : 'bg-background-surface border-border'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? 'text-white' : 'text-text-secondary'
                    }`}
                  >
                    {formatDisplayDate(date)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        {errors.date && (
          <Text className="text-accent-alert text-xs mt-2">{errors.date}</Text>
        )}
      </View>

      {/* Heure */}
      <View>
        <Text className="text-text-primary text-sm font-medium mb-3">
          Heure souhaitée *
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {timeSlots.map((time) => {
            const isSelected = formData.time === time;
            return (
              <Pressable
                key={time}
                onPress={() => onUpdateField('time', time)}
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? 'bg-accent-primary border-accent-primary'
                    : 'bg-background-surface border-border'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-text-secondary'
                  }`}
                >
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.time && (
          <Text className="text-accent-alert text-xs mt-2">{errors.time}</Text>
        )}
      </View>
    </View>
  );
}