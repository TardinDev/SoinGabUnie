import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  price: string;
  currentParticipants: number;
  maxParticipants: number;
  tags: string[];
  image: string;
}

interface EventsSectionProps {
  events: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <View className="px-6 mb-6">
      <View className="flex-row items-center mb-4">
        <Text className="text-text-primary text-lg font-bold flex-1">
          Événements à venir
        </Text>
        <Text className="text-accent-primary text-sm">🔥</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-4">
          {events.map((event) => (
            <Pressable
              key={event.id}
              className="w-72 bg-background-surface border border-border rounded-2xl overflow-hidden active:opacity-80"
            >
              <Image
                source={{ uri: event.image }}
                className="w-full h-20"
                style={{ resizeMode: 'cover' }}
              />
              <View className="p-3">
                <Text className="text-text-primary font-semibold text-sm mb-1">
                  {event.title}
                </Text>
                <Text className="text-text-secondary text-xs mb-2 leading-4">
                  {event.description.length > 60
                    ? `${event.description.substring(0, 60)}...`
                    : event.description
                  }
                </Text>

                <View className="space-y-1 mb-2">
                  <View className="flex-row items-center">
                    <Text className="text-accent-primary text-xs font-medium">
                      📅 {event.date} • {event.time}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary text-xs">
                      📍 {event.location}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-end mb-2">
                  <Text className="text-text-secondary text-xs">
                    {event.currentParticipants}/{event.maxParticipants} participants
                  </Text>
                </View>

                <View className="flex-row flex-wrap">
                  {event.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} className="bg-background-primary px-1.5 py-0.5 rounded mr-1">
                      <Text className="text-text-secondary text-xs">{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}