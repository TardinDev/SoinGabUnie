import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const pulseScale = useSharedValue(1);

  const navigateToOnboarding = () => {
    router.replace('/onboarding');
  };

  useEffect(() => {
    // Animation sequence
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 800 });

    // Pulse animation for the cross
    const startPulse = () => {
      pulseScale.value = withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      );
    };

    const pulseInterval = setInterval(startPulse, 2000);
    startPulse();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      runOnJS(navigateToOnboarding)();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseInterval);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View className="flex-1 bg-background-primary items-center justify-center px-8">
      <Animated.View style={animatedStyle} className="items-center">
        {/* Logo placeholder - Medical cross with leaf elements */}
        <Animated.View style={pulseStyle} className="mb-8">
          <View className="w-20 h-20 bg-accent-primary rounded-2xl items-center justify-center">
            <Text className="text-white text-3xl font-bold">+</Text>
          </View>
        </Animated.View>

        {/* App name */}
        <Text className="text-text-primary text-3xl font-bold text-center mb-4">
          SoinGabUnie
        </Text>

        {/* Tagline */}
        <Text className="text-text-secondary text-center text-lg leading-6">
          Votre santé, notre priorité.{'\n'}
          Trouvez les meilleurs soins près de chez vous.
        </Text>

        {/* Loading indicator */}
        <View className="mt-12 flex-row space-x-2">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className="w-2 h-2 bg-accent-primary rounded-full"
              style={[
                {
                  opacity: opacity.value,
                }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}