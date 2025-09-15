import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  unreadNotificationsCount: number;
  onNotificationPress: () => void;
}

export function Header({ user, unreadNotificationsCount, onNotificationPress }: HeaderProps) {
  return (
    <View className="px-6 py-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-3xl font-bold" style={{ color: '#8A5CF6' }}>
          SoinGabUnie
        </Text>

        <View className="flex-row items-center space-x-4">
          {/* Notification Icon */}
          <Pressable className="relative" onPress={onNotificationPress}>
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
  );
}