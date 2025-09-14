import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SLIDES = [
  {
    title: 'Trouvez des soins près de chez vous',
    description: 'Découvrez pharmacies, médecins, cliniques et tradipraticiens dans votre région.',
    emoji: '🏥',
  },
  {
    title: 'Réservez en toute sécurité',
    description: 'Prenez rendez-vous facilement et gérez vos consultations en un clic.',
    emoji: '🔒',
  },
  {
    title: 'Soins traditionnels & modernes',
    description: 'Accédez aux médecines modernes et traditionnelles du Gabon.',
    emoji: '🌿',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideProgress = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          slideProgress.value,
          [0, 1, 2],
          [0, -100, -200]
        ),
      },
    ],
  }));

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      slideProgress.value = withTiming(next, { duration: 300 });
    } else {
      router.replace('/(tabs)');
    }
  };

  const skipOnboarding = () => {
    router.replace('/(tabs)');
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Skip button */}
      <View className="px-6 py-4 items-end">
        <Pressable onPress={skipOnboarding}>
          <Text className="text-text-secondary text-base">Passer</Text>
        </Pressable>
      </View>

      {/* Slides container */}
      <View className="flex-1 justify-center px-8">
        <Animated.View style={animatedStyle} className="flex-row">
          {SLIDES.map((slide, index) => (
            <View key={index} className="w-full items-center" style={{ width: '100%' }}>
              <Text className="text-6xl mb-8">{slide.emoji}</Text>
              <Text className="text-text-primary text-2xl font-bold text-center mb-6">
                {slide.title}
              </Text>
              <Text className="text-text-secondary text-center text-lg leading-6">
                {slide.description}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom section */}
      <View className="px-8 pb-8">
        {/* Dots indicator */}
        <View className="flex-row justify-center space-x-3 mb-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-accent-primary' : 'bg-border'
              }`}
            />
          ))}
        </View>

        {/* Continue button */}
        <Pressable
          onPress={nextSlide}
          className="bg-accent-primary py-4 px-8 rounded-2xl active:opacity-80"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {currentSlide === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}