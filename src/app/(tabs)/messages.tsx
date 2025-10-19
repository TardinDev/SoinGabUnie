import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getMessages, getCurrentUser } from '../../utils/mockData';
import ScreenWrapper from '../../components/ScreenWrapper';
import type { Message, User } from '../../types';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: async (): Promise<Message[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getMessages();
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return getCurrentUser();
    },
  });

  const filteredMessages = messages.filter(message =>
    message.fromProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <ScreenWrapper style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-text-primary text-2xl font-bold mb-2">
          Messages
        </Text>
        <Text className="text-text-secondary text-sm">
          Vos conversations avec les prestataires
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <View className="bg-background-surface rounded-2xl px-4 py-3 border border-border">
          <TextInput
            className="text-text-primary text-base"
            placeholder="Rechercher un message..."
            placeholderTextColor="#B4B8C5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-8">
          {filteredMessages.length > 0 ? (
            <View className="space-y-3">
              {filteredMessages.map((message) => (
                <Pressable
                  key={message.id}
                  className={`bg-background-surface border rounded-2xl p-4 active:opacity-80 ${
                    !message.isRead ? 'border-accent-primary' : 'border-border'
                  }`}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className={`text-lg mr-2 ${
                          message.providerType === 'delivery' ? '🏍️' :
                          message.providerType === 'pharmacy' ? '💊' :
                          message.providerType === 'doctor' ? '👨‍⚕️' :
                          message.providerType === 'clinic' ? '🏥' :
                          message.providerType === 'hospital' ? '🏨' :
                          message.providerType === 'tradipractitioner' ? '🌿' : '💬'
                        }`}>
                        </Text>
                        <Text className="text-text-primary font-semibold text-base flex-1">
                          {message.fromProvider}
                        </Text>
                        {!message.isRead && (
                          <View className="w-3 h-3 bg-accent-primary rounded-full ml-2" />
                        )}
                      </View>
                      <Text className="text-text-secondary text-xs mb-2">
                        {getTimeAgo(message.timestamp)}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-text-secondary text-sm leading-5 mb-3">
                    {message.content}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-accent-primary text-xs font-medium">
                      💬 Appuyer pour répondre
                    </Text>
                    <Text className={`text-xs px-2 py-1 rounded-full ${
                      message.providerType === 'delivery' ? 'bg-orange-600/20 text-orange-200' :
                      message.providerType === 'pharmacy' ? 'bg-blue-600/20 text-blue-200' :
                      message.providerType === 'doctor' ? 'bg-green-600/20 text-green-200' :
                      message.providerType === 'clinic' ? 'bg-purple-600/20 text-purple-200' :
                      message.providerType === 'hospital' ? 'bg-red-600/20 text-red-200' :
                      message.providerType === 'tradipractitioner' ? 'bg-emerald-600/20 text-emerald-200' :
                      'bg-gray-600/20 text-gray-200'
                    }`}>
                      {message.providerType === 'delivery' ? 'Livreur' :
                       message.providerType === 'pharmacy' ? 'Pharmacie' :
                       message.providerType === 'doctor' ? 'Médecin' :
                       message.providerType === 'clinic' ? 'Clinique' :
                       message.providerType === 'hospital' ? 'Hôpital' :
                       message.providerType === 'tradipractitioner' ? 'Tradipraticien' :
                       'Message'
                      }
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-16">
              <Text className="text-6xl mb-4">💬</Text>
              <Text className="text-text-primary text-lg font-semibold mb-2">
                Aucun message
              </Text>
              <Text className="text-text-secondary text-center">
                {searchQuery
                  ? `Aucun résultat pour "${searchQuery}"`
                  : 'Vos conversations avec les prestataires apparaîtront ici'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}