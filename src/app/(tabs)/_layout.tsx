import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

function TabButton(props: any) {
  const { children, onPress, accessibilityState } = props;
  const focused = Boolean(accessibilityState?.selected);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(focused ? 1.06 : 1, { duration: 160 }) }],
    backgroundColor: withTiming(focused ? '#151821' : 'transparent', { duration: 160 }),
    borderColor: '#232634',
    borderWidth: focused ? 1 : 0,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  }));

  return (
    <Pressable
      onPress={async () => {
        await Haptics.selectionAsync();
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      hitSlop={10}
      style={{ borderRadius: 14 }}
    >
      <Animated.View style={[{justifyContent: 'center', alignItems: 'center'}, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0C10',
          borderTopColor: '#232634',
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#8A5CF6',
        tabBarInactiveTintColor: '#B4B8C5',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          marginHorizontal: 6,
          borderRadius: 14,
        },
        tabBarButton: (props) => <TabButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarAccessibilityLabel: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
              accessibilityLabel="Icône Accueil"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarAccessibilityLabel: 'Favoris',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={size}
              color={color}
              accessibilityLabel="Icône Favoris"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Réservations',
          tabBarAccessibilityLabel: 'Réservations',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
              accessibilityLabel="Icône Réservations"
            />
          ),
        }}
      />
    </Tabs>
  );
}
