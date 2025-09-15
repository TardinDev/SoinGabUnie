import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { ServiceType } from '../types';

interface DeliverySectionProps {
  onDeliveryPress: (type: ServiceType) => void;
}

export function DeliverySection({ onDeliveryPress }: DeliverySectionProps) {
  return (
    <View className="px-6 mb-8">
      <Pressable
        onPress={() => onDeliveryPress('delivery')}
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
  );
}