import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  activeFilters: string[];
  onToggleFilter: (filterId: string) => void;
}

export function FilterChips({ filters, activeFilters, onToggleFilter }: FilterChipsProps) {
  return (
    <View className="px-6 mb-8">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => onToggleFilter(filter.id)}
              className={`px-4 py-2 rounded-full border ${
                activeFilters.includes(filter.id)
                  ? 'bg-accent-primary border-accent-primary'
                  : 'bg-background-surface border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilters.includes(filter.id)
                    ? 'text-white'
                    : 'text-text-secondary'
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}