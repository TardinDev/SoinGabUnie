import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
  Easing,
  runOnJS,
  withDelay,
  withSequence,
  useDerivedValue,
} from 'react-native-reanimated';

interface LiquidCapsuleProps {
  activeIndex: number;
  tabCount: number;
}

export default function LiquidCapsule({ activeIndex, tabCount }: LiquidCapsuleProps) {
  const screenWidth = Dimensions.get('window').width;
  const capsulePosition = useSharedValue(0);
  const capsuleScale = useSharedValue(1);
  const capsuleOpacity = useSharedValue(1);

  // Calcul des dimensions adaptées aux icônes
  const tabBarPadding = 12;
  const tabWidth = (screenWidth - tabBarPadding * 2) / tabCount;
  const iconSize = 24; // Taille standard des icônes
  const capsuleWidth = iconSize * 2.5; // 60px - parfaitement adapté aux icônes
  const capsuleHeight = iconSize * 1.5; // 36px - hauteur proportionnelle
  const capsulePadding = 8; // Espace autour de l'icône

  // SDK 54 optimized derived values for better performance
  const morphingProgress = useDerivedValue(() => {
    return capsulePosition.value % 1;
  });

  const isTransitioning = useDerivedValue(() => {
    return Math.abs(capsulePosition.value % 1) > 0.01;
  });

  React.useEffect(() => {
    // SDK 54 Enhanced liquid spring animation
    capsulePosition.value = withSpring(activeIndex, {
      damping: 14,
      stiffness: 150,
      mass: 0.6,
    });

    // Advanced morphing sequence with SDK 54 easing curves
    capsuleScale.value = withSequence(
      withTiming(1.3, {
        duration: 120,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      }),
      withSpring(1, {
        damping: 10,
        stiffness: 250,
        mass: 0.5,
      })
    );

    // Enhanced opacity pulse with delay
    capsuleOpacity.value = withSequence(
      withTiming(0.7, {
        duration: 80,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(40,
        withTiming(1, {
          duration: 180,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        })
      )
    );
  }, [activeIndex]);

  const capsuleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      capsulePosition.value,
      Array.from({ length: tabCount }, (_, i) => i),
      Array.from({ length: tabCount }, (_, i) =>
        tabBarPadding + i * tabWidth + (tabWidth - capsuleWidth) / 2
      )
    );

    // SDK 54 Enhanced liquid morphing with smoother curves
    const morphScaleX = interpolate(
      morphingProgress.value,
      [0, 0.15, 0.35, 0.65, 0.85, 1],
      [1, 1.4, 1.05, 1.15, 1.35, 1],
      'clamp'
    );

    const morphScaleY = interpolate(
      morphingProgress.value,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      [1, 0.85, 1.12, 0.92, 1.08, 1],
      'clamp'
    );

    // Liquid squash effect during high-speed transitions
    const liquidSquash = interpolate(
      Math.abs(capsulePosition.value - Math.round(capsulePosition.value)),
      [0, 0.5],
      [1, 0.88],
      'clamp'
    );

    return {
      transform: [
        { translateX },
        { scaleX: morphScaleX * capsuleScale.value },
        { scaleY: morphScaleY * capsuleScale.value * liquidSquash },
      ],
      opacity: capsuleOpacity.value,
    };
  });

  const liquidGlowStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      capsulePosition.value,
      Array.from({ length: tabCount }, (_, i) => i),
      Array.from({ length: tabCount }, (_, i) =>
        tabBarPadding + i * tabWidth + (tabWidth - capsuleWidth - 16) / 2
      )
    );

    const glowScale = interpolate(
      capsulePosition.value % 1,
      [0, 0.5, 1],
      [1, 1.4, 1],
      'clamp'
    );

    return {
      transform: [
        { translateX },
        { scale: glowScale },
      ],
      opacity: interpolate(
        capsuleOpacity.value,
        [0.8, 1],
        [0.3, 0.6],
        'clamp'
      ),
    };
  });

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Glow externe perfectionné */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: Platform.select({
              ios: 20,
              android: 18, // Ajusté pour le nouvel espacement Android
            }),
            width: capsuleWidth + 20,
            height: capsuleHeight + 12,
            borderRadius: (capsuleHeight + 12) / 2,
            backgroundColor: 'rgba(138, 92, 246, 0.12)',
            shadowColor: '#8A5CF6',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 18,
            elevation: 12,
          },
          liquidGlowStyle,
        ]}
      />

      {/* Glow secondaire pour effet de profondeur */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: Platform.select({
              ios: 18,
              android: 16,
            }),
            width: capsuleWidth + 28,
            height: capsuleHeight + 16,
            borderRadius: (capsuleHeight + 16) / 2,
            backgroundColor: 'rgba(138, 92, 246, 0.06)',
            shadowColor: '#8A5CF6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 6,
          },
          useAnimatedStyle(() => ({
            transform: [
              {
                translateX: interpolate(
                  capsulePosition.value,
                  Array.from({ length: tabCount }, (_, i) => i),
                  Array.from({ length: tabCount }, (_, i) =>
                    tabBarPadding + i * tabWidth + (tabWidth - capsuleWidth - 28) / 2
                  )
                ),
              },
              {
                scale: interpolate(
                  morphingProgress.value,
                  [0, 0.5, 1],
                  [1, 1.2, 1],
                  'clamp'
                ),
              },
            ],
            opacity: interpolate(
              capsuleOpacity.value,
              [0.7, 1],
              [0.2, 0.4],
              'clamp'
            ),
          })),
        ]}
      />

      {/* Capsule principale redesignée */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: Platform.select({
              ios: 24,
              android: 22, // Centré parfaitement sur l'icône pour Android
            }),
            width: capsuleWidth,
            height: capsuleHeight,
            borderRadius: capsuleHeight / 2,
            overflow: 'hidden',
            shadowColor: '#8A5CF6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
            // Bordure subtile pour plus d'élégance
            borderWidth: 0.5,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
          capsuleStyle,
        ]}
      >
        {/* Gradient principal amélioré */}
        <LinearGradient
          colors={[
            'rgba(138, 92, 246, 0.45)', // Plus intense
            'rgba(138, 92, 246, 0.35)',
            'rgba(138, 92, 246, 0.22)',
            'rgba(138, 92, 246, 0.12)',
            'rgba(138, 92, 246, 0.05)',
          ]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          locations={[0, 0.3, 0.5, 0.8, 1]}
          style={{
            flex: 1,
            borderRadius: capsuleHeight / 2,
          }}
        />

        {/* Glass reflection multicouche */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.25)',
            'rgba(255, 255, 255, 0.1)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70%',
            borderRadius: capsuleHeight / 2,
          }}
        />

        {/* Highlight spot principal */}
        <View
          style={{
            position: 'absolute',
            top: 3,
            left: 6,
            width: 16,
            height: 10,
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
          }}
        />

        {/* Highlight spot secondaire */}
        <View
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            width: 8,
            height: 6,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Reflet de profondeur */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.08)',
            'rgba(255, 255, 255, 0.15)',
          ]}
          start={{ x: 0, y: 0.6 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            borderRadius: capsuleHeight / 2,
          }}
        />
      </Animated.View>

      {/* Liquid ripple effect amélioré */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: Platform.select({
              ios: 22,
              android: 20,
            }),
            width: capsuleWidth + 12,
            height: capsuleHeight + 8,
            borderRadius: (capsuleHeight + 8) / 2,
            backgroundColor: 'rgba(138, 92, 246, 0.1)',
            shadowColor: '#8A5CF6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 5,
          },
          useAnimatedStyle(() => ({
            transform: [
              {
                translateX: interpolate(
                  capsulePosition.value,
                  Array.from({ length: tabCount }, (_, i) => i),
                  Array.from({ length: tabCount }, (_, i) =>
                    tabBarPadding + i * tabWidth + (tabWidth - capsuleWidth - 12) / 2
                  )
                ),
              },
              {
                scale: interpolate(
                  morphingProgress.value,
                  [0, 0.3, 0.7, 1],
                  [1, 1.2, 0.9, 1],
                  'clamp'
                ),
              },
            ],
            opacity: interpolate(
              capsuleOpacity.value,
              [0.7, 1],
              [0.3, 0.7],
              'clamp'
            ),
          })),
        ]}
      />

      {/* Micro ripples pour effet liquide avancé */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: Platform.select({
              ios: 26,
              android: 24,
            }),
            width: capsuleWidth + 6,
            height: capsuleHeight + 2,
            borderRadius: (capsuleHeight + 2) / 2,
            backgroundColor: 'rgba(138, 92, 246, 0.05)',
            shadowColor: '#8A5CF6',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 2,
          },
          useAnimatedStyle(() => ({
            transform: [
              {
                translateX: interpolate(
                  capsulePosition.value,
                  Array.from({ length: tabCount }, (_, i) => i),
                  Array.from({ length: tabCount }, (_, i) =>
                    tabBarPadding + i * tabWidth + (tabWidth - capsuleWidth - 6) / 2
                  )
                ),
              },
              {
                scale: interpolate(
                  morphingProgress.value,
                  [0, 0.2, 0.8, 1],
                  [1, 0.95, 1.05, 1],
                  'clamp'
                ),
              },
            ],
            opacity: isTransitioning.value
              ? interpolate(morphingProgress.value, [0, 0.5, 1], [0.4, 0.6, 0.4], 'clamp')
              : 0.2,
          })),
        ]}
      />
    </View>
  );
}