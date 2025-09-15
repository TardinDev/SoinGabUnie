import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';

interface TraditionalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  seller: string;
  sellerId: string;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
}

interface TraditionalProductsSectionProps {
  products: TraditionalProduct[];
}

export function TraditionalProductsSection({ products }: TraditionalProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <View className="px-6 mb-6">
      <View className="flex-row items-center mb-4">
        <Text className="text-text-primary text-lg font-bold flex-1">
          Produits Traditionnels
        </Text>
        <Text className="text-emerald-500 text-sm">🌿</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {products.map((product) => (
            <Pressable
              key={product.id}
              className="w-32 bg-background-surface border border-border rounded-2xl overflow-hidden active:opacity-80"
            >
              <View className="relative">
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-20"
                  style={{ resizeMode: 'cover' }}
                />
                {!product.inStock && (
                  <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
                    <Text className="text-white text-xs font-medium">Rupture</Text>
                  </View>
                )}
                <View className="absolute top-1 right-1 bg-background-primary bg-opacity-80 rounded-full px-1 py-0.5">
                  <Text className="text-text-secondary text-xs">⭐ {product.rating}</Text>
                </View>
              </View>

              <View className="p-2">
                <Text className="text-text-primary font-semibold text-xs mb-1" numberOfLines={1}>
                  {product.name}
                </Text>
                <Text className="text-text-secondary text-xs mb-1 leading-3" numberOfLines={2}>
                  {product.description}
                </Text>

                <View className="mb-1">
                  <Text className="text-accent-secondary text-xs font-bold">
                    {product.price}
                  </Text>
                </View>

                <View className="mb-1">
                  <Text className="text-text-secondary text-xs" numberOfLines={1}>
                    Par: {product.seller}
                  </Text>
                </View>

                <View className="bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  <Text className="text-emerald-300 text-xs font-medium text-center" numberOfLines={1}>
                    {product.category}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}