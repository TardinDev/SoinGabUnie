import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import LiquidCapsule from '../../components/LiquidCapsule';

export default function TabLayout() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const insets = useSafeAreaInsets();

  const CustomTabBar = React.useMemo(() => {
    return () => (
      <View style={{ flex: 1 }}>
        {/* Gradient fade-out pour masquer le contenu qui défile */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(11, 12, 16, 0.4)',
            'rgba(11, 12, 16, 0.8)',
            'rgba(11, 12, 16, 0.95)'
          ]}
          style={{
            position: 'absolute',
            top: Platform.select({
              ios: -40,
              android: -60, // Plus haut sur Android pour masquer plus de contenu
            }),
            left: 0,
            right: 0,
            height: Platform.select({
              ios: 40,
              android: 60, // Plus de hauteur sur Android
            }),
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <BlurView
          intensity={Platform.select({
            ios: 80,
            android: 100,
          })}
          tint="dark"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Platform.select({
              ios: 'rgba(11, 12, 16, 0.7)',
              android: 'rgba(11, 12, 16, 0.85)',
            }),
            zIndex: 2,
          }}
          experimentalBlurMethod="dimezisBlurView"
        />

        {/* Capsule liquid effect */}
        <View style={{ zIndex: 3 }}>
          <LiquidCapsule activeIndex={activeIndex} tabCount={4} />
        </View>
      </View>
    );
  }, [activeIndex]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // SDK 54 Liquid Glass TabBar
          position: 'absolute',
          bottom: Platform.select({
            ios: 0,
            android: 8, // 8px d'espace au-dessus des boutons Android
          }),
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          height: Platform.select({
            ios: 84,
            android: 100, // Plus de hauteur sur Android pour plus d'espace
          }),
          // Padding dynamique avec plus d'espace pour Android
          paddingBottom: Platform.select({
            ios: 0,
            android: Math.max(16, insets.bottom + 8), // Plus d'espace de sécurité
          }),
          // Margin supplémentaire pour Android
          marginBottom: Platform.select({
            ios: 0,
            android: Math.max(4, insets.bottom / 4),
          }),
        },
        tabBarBackground: CustomTabBar,
        tabBarActiveTintColor: '#8A5CF6',
        tabBarInactiveTintColor: '#B4B8C5',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700', // Plus bold pour plus d'impact
          letterSpacing: 0.3,
          marginBottom: 6, // Plus d'espace pour la capsule
          marginTop: 2,
          // Glow effect sur le texte actif
          textShadowColor: 'rgba(138, 92, 246, 0.9)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        },
        tabBarIconStyle: {
          marginTop: 8, // Plus d'espace pour la capsule
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 16, // Plus d'espace vertical
          paddingHorizontal: 12,
          justifyContent: 'center',
          alignItems: 'center',
        },
        // SDK 54 liquid morphing effect
        tabBarHideOnKeyboard: true,
        tabBarVisibilityAnimationConfig: {
          show: {
            animation: 'spring',
            config: {
              damping: 20,
              mass: 1,
              stiffness: 100,
            },
          },
          hide: {
            animation: 'spring',
            config: {
              damping: 20,
              mass: 1,
              stiffness: 100,
            },
          },
        },
        // Protection renforcée pour Android avec navigation par gestes
        ...(Platform.OS === 'android' && {
          tabBarSafeAreaInsets: {
            bottom: Math.max(12, insets.bottom * 0.6), // Protection renforcée
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={focused ? '#8A5CF6' : '#B4B8C5'}
              style={{
                // SDK 54 glow effect pour React Native
                ...(focused && {
                  shadowColor: '#8A5CF6',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  elevation: 8,
                }),
              }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveIndex(0);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={size}
              color={focused ? '#8A5CF6' : '#B4B8C5'}
              style={{
                ...(focused && {
                  shadowColor: '#8A5CF6',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  elevation: 8,
                }),
              }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveIndex(1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size}
              color={focused ? '#8A5CF6' : '#B4B8C5'}
              style={{
                ...(focused && {
                  shadowColor: '#8A5CF6',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  elevation: 8,
                }),
              }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveIndex(2);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Réservations',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={focused ? '#8A5CF6' : '#B4B8C5'}
              style={{
                ...(focused && {
                  shadowColor: '#8A5CF6',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  elevation: 8,
                }),
              }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveIndex(3);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
    </Tabs>
  );
}
