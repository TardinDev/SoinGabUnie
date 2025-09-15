import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  animatedStyle: any;
}

export function NotificationPanel({ notifications, animatedStyle }: NotificationPanelProps) {
  const unreadNotifications = notifications.filter(n => !n.isRead);

  if (unreadNotifications.length === 0) return null;

  return (
    <Animated.View style={[animatedStyle]} className="px-6 mb-6">
      <Text className="text-text-primary text-lg font-semibold mb-3">
        Notifications récentes
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-4">
          {unreadNotifications
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
  );
}