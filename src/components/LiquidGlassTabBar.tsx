import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Text } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabItem {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}

interface LiquidGlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const tabs: TabItem[] = [
  { name: 'index', title: 'Accueil', icon: 'home-outline', iconFocused: 'home' },
  { name: 'favorites', title: 'Favoris', icon: 'heart-outline', iconFocused: 'heart' },
  { name: 'messages', title: 'Messages', icon: 'chatbubbles-outline', iconFocused: 'chatbubbles' },
  { name: 'bookings', title: 'Réservations', icon: 'calendar-outline', iconFocused: 'calendar' },
];

export default function LiquidGlassTabBar({ state, descriptors, navigation }: LiquidGlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const bubblePosition = useSharedValue(0);

  React.useEffect(() => {
    bubblePosition.value = withSpring(state.index, {
      damping: 25,
      stiffness: 120,
    });
  }, [state.index]);

  const bubbleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      bubblePosition.value,
      [0, 1, 2, 3],
      [20, 95, 170, 245]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Liquid Glass Background */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 25 : 80}
        style={{
          flex: 1,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(11, 12, 16, 0.85)' : '#0B0C10',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            height: 84,
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingHorizontal: 16,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: 'rgba(35, 38, 52, 0.3)',
            position: 'relative',
          }}
        >
          {/* Liquid Bubble Indicator */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 8,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(138, 92, 246, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(138, 92, 246, 0.3)',
              },
              bubbleStyle,
            ]}
          />

          {/* Glow Effect */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 4,
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: 'rgba(138, 92, 246, 0.08)',
                shadowColor: '#8A5CF6',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              },
              bubbleStyle,
            ]}
          />

          {tabs.map((tab, index) => {
            const { options } = descriptors[state.routes[index].key];
            const isFocused = state.index === index;

            const handlePress = async () => {
              await Haptics.selectionAsync();

              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[index].key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(state.routes[index].name);
              }
            };

            return (
              <TabButton
                key={tab.name}
                tab={tab}
                isFocused={isFocused}
                onPress={handlePress}
                index={index}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

interface TabButtonProps {
  tab: TabItem;
  isFocused: boolean;
  onPress: () => void;
  index: number;
}

function TabButton({ tab, isFocused, onPress, index }: TabButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);

  React.useEffect(() => {
    scale.value = withTiming(isFocused ? 1.1 : 1, { duration: 200 });
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
    transform: [
      {
        translateY: withTiming(isFocused ? -2 : 0, { duration: 200 })
      }
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        zIndex: 10,
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={tab.title}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedStyle
        ]}
      >
        <Ionicons
          name={isFocused ? tab.iconFocused : tab.icon}
          size={24}
          color={isFocused ? '#8A5CF6' : '#B4B8C5'}
          style={{
            marginBottom: 4,
            textShadowColor: isFocused ? 'rgba(138, 92, 246, 0.5)' : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isFocused ? 8 : 0,
          }}
        />

        <Animated.Text
          style={[
            {
              fontSize: 10,
              fontWeight: '600',
              color: isFocused ? '#8A5CF6' : '#B4B8C5',
              letterSpacing: 0.2,
              textShadowColor: isFocused ? 'rgba(138, 92, 246, 0.3)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: isFocused ? 4 : 0,
            },
            textAnimatedStyle
          ]}
        >
          {tab.title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}