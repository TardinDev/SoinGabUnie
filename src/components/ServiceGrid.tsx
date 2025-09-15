import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ServiceType } from '../types';

interface Service {
  type: ServiceType;
  title: string;
  color: string;
  image: string;
}

interface ServiceGridProps {
  services: Service[];
  upcomingEventsCount: number;
  animatedFireStyle: any;
  onServicePress: (type: ServiceType) => void;
}

export function ServiceGrid({
  services,
  upcomingEventsCount,
  animatedFireStyle,
  onServicePress
}: ServiceGridProps) {
  return (
    <View className="px-6 mb-8">
      <Text className="text-text-primary text-xl font-bold mb-4">
        Services
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {services.map((service, index) => (
          <Pressable
            key={service.type}
            onPress={() => onServicePress(service.type)}
            className={`w-[48%] h-32 bg-background-surface border border-border rounded-2xl overflow-hidden mb-4 active:opacity-80 ${
              index === services.length - 1 && services.length % 2 !== 0 ? 'w-full' : ''
            }`}
          >
            <View className="h-full relative">
              <View className="flex-[3] w-full">
                <Image
                  source={{ uri: service.image }}
                  className="w-full h-full"
                  style={{ resizeMode: 'cover' }}
                />
              </View>
              <View className="flex-[1] px-3 py-2 justify-center">
                {service.type === 'tradipractitioner' ? (
                  <View className="flex-row items-center justify-center space-x-1">
                    <Text className="text-text-primary font-semibold text-center text-sm">
                      {service.title}
                    </Text>
                    <Animated.View style={[animatedFireStyle]} className="flex-row items-center">
                      <Text style={{ fontSize: 14 }}>🔥</Text>
                      <View className="bg-accent-alert rounded-full px-1.5 py-0.5 ml-1">
                        <Text className="text-white text-xs font-bold">{upcomingEventsCount}</Text>
                      </View>
                    </Animated.View>
                  </View>
                ) : (
                  <Text className="text-text-primary font-semibold text-center text-sm">
                    {service.title}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}