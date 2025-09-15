import React from 'react';
import { View, TextInput, ScrollView, Pressable, Text } from 'react-native';

interface SortOption {
  id: string;
  label: string;
}

interface SearchAndSortProps {
  searchQuery: string;
  sortBy: string;
  sortOptions: SortOption[];
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
}

export function SearchAndSort({
  searchQuery,
  sortBy,
  sortOptions,
  onSearchChange,
  onSortChange
}: SearchAndSortProps) {
  return (
    <View className="px-6 py-4 space-y-4">
      {/* Search Bar */}
      <View className="bg-background-surface rounded-2xl px-4 py-3 border border-border">
        <TextInput
          className="text-text-primary text-base"
          placeholder="Rechercher..."
          placeholderTextColor="#B4B8C5"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Sort Options */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {sortOptions.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => onSortChange(option.id)}
              className={`px-4 py-2 rounded-full border ${
                sortBy === option.id
                  ? 'bg-accent-primary border-accent-primary'
                  : 'bg-background-surface border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  sortBy === option.id
                    ? 'text-white'
                    : 'text-text-secondary'
                }`}
              >
                Trier par {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}