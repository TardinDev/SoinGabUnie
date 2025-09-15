import React from 'react';
import { View, Pressable, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  withSpring,
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

export default function LiquidGlassTabBar({ state, navigation }: LiquidGlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const bubblePosition = useSharedValue(0);

  // Get real screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 24; // paddingHorizontal total (12 * 2)
  const tabWidth = (screenWidth - containerPadding) / 4;
  const bubbleWidth = 64;
  const bubbleOffset = (tabWidth - bubbleWidth) / 2;

  React.useEffect(() => {
    bubblePosition.value = withSpring(state.index, {
      damping: 20,
      stiffness: 90,
      mass: 0.8,
    });
  }, [state.index]);

  const bubbleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      bubblePosition.value,
      [0, 1, 2, 3],
      [
        containerPadding / 2 + bubbleOffset,
        containerPadding / 2 + bubbleOffset + tabWidth,
        containerPadding / 2 + bubbleOffset + tabWidth * 2,
        containerPadding / 2 + bubbleOffset + tabWidth * 3
      ]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const liquidBubbleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      bubblePosition.value % 1,
      [0, 0.5, 1],
      [1, 1.15, 1]
    );

    const translateX = interpolate(
      bubblePosition.value,
      [0, 1, 2, 3],
      [
        containerPadding / 2 + bubbleOffset - 2, // -2 pour compenser la largeur
        containerPadding / 2 + bubbleOffset + tabWidth - 2,
        containerPadding / 2 + bubbleOffset + tabWidth * 2 - 2,
        containerPadding / 2 + bubbleOffset + tabWidth * 3 - 2
      ]
    );

    return {
      transform: [{ translateX }, { scale }],
    };
  });

  const renderAndroidGlassEffect = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(11, 12, 16, 0.85)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Multiple gradient layers for glass effect */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.02)',
          'rgba(255, 255, 255, 0.01)',
          'transparent'
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
        }}
      />

      {/* Glass reflection simulation */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.12)',
          'rgba(255, 255, 255, 0.06)',
          'transparent'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
        }}
      />

      {/* Saturation layer for glass depth */}
      <LinearGradient
        colors={[
          'rgba(138, 92, 246, 0.015)',
          'rgba(11, 12, 16, 0.02)',
          'rgba(11, 12, 16, 0.04)'
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
        }}
      />

      {/* Content overlay */}
      <View
        style={{
          flexDirection: 'row',
          height: 84,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 12,
          paddingTop: 12,
          position: 'relative',
        }}
      >
        {/* Enhanced Liquid Bubble for Android */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 6,
              width: 68,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
              elevation: 12,
              shadowColor: '#8A5CF6',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              zIndex: 1,
            },
            liquidBubbleStyle,
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(138, 92, 246, 0.25)',
              'rgba(138, 92, 246, 0.18)',
              'rgba(138, 92, 246, 0.10)',
              'rgba(138, 92, 246, 0.05)'
            ]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={{
              flex: 1,
              borderRadius: 30,
            }}
          />
          {/* Android glass reflection effect */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.25)',
              'rgba(255, 255, 255, 0.10)',
              'transparent'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60%',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          />
          {/* Secondary reflection */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.15)',
              'transparent'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              width: 20,
              height: 20,
              borderRadius: 10,
            }}
          />
        </Animated.View>

        {/* Main Liquid Bubble */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 8,
              width: 64,
              height: 56,
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(138, 92, 246, 0.35)',
              elevation: 8,
              shadowColor: '#8A5CF6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              zIndex: 2,
            },
            bubbleStyle,
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(138, 92, 246, 0.22)',
              'rgba(138, 92, 246, 0.15)',
              'rgba(138, 92, 246, 0.08)',
              'rgba(138, 92, 246, 0.04)'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
            }}
          />
          {/* Glass reflection on main bubble */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.20)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.6 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              borderRadius: 28,
            }}
          />
          {/* Highlight reflection */}
          <View
            style={{
              position: 'absolute',
              top: 4,
              left: 4,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            }}
          />
        </Animated.View>

        {/* Enhanced outer glow for Android */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 2,
              width: 76,
              height: 68,
              borderRadius: 34,
              backgroundColor: 'rgba(138, 92, 246, 0.06)',
              elevation: 20,
              shadowColor: '#8A5CF6',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.6,
              shadowRadius: 24,
              zIndex: 0,
            },
            liquidBubbleStyle,
          ]}
        />

        {tabs.map((tab, index) => {
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
            />
          );
        })}
      </View>
    </View>
  );

  const renderIOSGlassEffect = () => (
    <BlurView
      intensity={30}
      style={{
        flex: 1,
        backgroundColor: 'rgba(11, 12, 16, 0.65)',
      }}
    >
      {/* Glass reflection top line */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
        }}
      />

      {/* Glass reflection inner line */}
      <View
        style={{
          position: 'absolute',
          top: 1,
          left: 0,
          right: 0,
          height: 0.5,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          height: 84,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 12,
          paddingTop: 12,
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(255, 255, 255, 0.06)',
          position: 'relative',
        }}
      >
        {/* Liquid Bubble Background Layer */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 6,
              width: 68,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
              zIndex: 1,
            },
            liquidBubbleStyle,
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(138, 92, 246, 0.25)',
              'rgba(138, 92, 246, 0.15)',
              'rgba(138, 92, 246, 0.08)'
            ]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={{
              flex: 1,
              borderRadius: 30,
            }}
          />
        </Animated.View>

        {/* Liquid Bubble Main */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 8,
              width: 64,
              height: 56,
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 0.5,
              borderColor: 'rgba(138, 92, 246, 0.3)',
              zIndex: 2,
            },
            bubbleStyle,
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(138, 92, 246, 0.2)',
              'rgba(138, 92, 246, 0.12)',
              'rgba(138, 92, 246, 0.06)'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
            }}
          />
          {/* Inner glass reflection */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.6 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              borderRadius: 28,
            }}
          />
        </Animated.View>

        {/* Outer glow shadow */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 4,
              width: 72,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(138, 92, 246, 0.05)',
              shadowColor: '#8A5CF6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
              elevation: 15,
              zIndex: 0,
            },
            liquidBubbleStyle,
          ]}
        />

        {tabs.map((tab, index) => {
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
            />
          );
        })}
      </View>
    </BlurView>
  );

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
      {/* Background Gradient Overlay */}
      <LinearGradient
        colors={Platform.OS === 'ios'
          ? ['transparent', 'rgba(11, 12, 16, 0.4)', 'rgba(11, 12, 16, 0.8)']
          : ['transparent', 'rgba(11, 12, 16, 0.6)', 'rgba(11, 12, 16, 0.9)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120 + insets.bottom,
          pointerEvents: 'none',
        }}
      />

      {/* Render platform-specific glass effect */}
      {Platform.OS === 'ios' ? renderIOSGlassEffect() : renderAndroidGlassEffect()}
    </View>
  );
}

interface TabButtonProps {
  tab: TabItem;
  isFocused: boolean;
  onPress: () => void;
}

function TabButton({ tab, isFocused, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);
  const iconScale = useSharedValue(1);
  const glowOpacity = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withTiming(isFocused ? 1.05 : 1, { duration: 200 });
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
    glowOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    iconScale.value = withSpring(isFocused ? 1.1 : 1, {
      damping: 15,
      stiffness: 200,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
    transform: [
      {
        translateY: withTiming(isFocused ? -1 : 0, { duration: 200 })
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
        zIndex: 20,
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={tab.title}
    >
      {/* Enhanced icon glow effect for Android */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(138, 92, 246, 0.2)',
            shadowColor: '#8A5CF6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: Platform.OS === 'android' ? 1 : 0.8,
            shadowRadius: Platform.OS === 'android' ? 16 : 12,
            elevation: Platform.OS === 'android' ? 12 : 8,
          },
          glowAnimatedStyle
        ]}
      />

      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedStyle
        ]}
      >
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons
            name={isFocused ? tab.iconFocused : tab.icon}
            size={24}
            color={isFocused ? '#8A5CF6' : '#B4B8C5'}
            style={{
              marginBottom: 4,
              textShadowColor: isFocused ? 'rgba(138, 92, 246, 0.8)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: isFocused ? (Platform.OS === 'android' ? 12 : 8) : 0,
            }}
          />
        </Animated.View>

        <Animated.Text
          style={[
            {
              fontSize: 10,
              fontWeight: '600',
              color: isFocused ? '#8A5CF6' : '#B4B8C5',
              letterSpacing: 0.2,
              textShadowColor: isFocused ? 'rgba(138, 92, 246, 0.4)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: isFocused ? (Platform.OS === 'android' ? 6 : 4) : 0,
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