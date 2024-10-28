import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { router, Tabs } from "expo-router";
import { TabBarIcon } from "../../components/TabBarIcon";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { HomeIcon as HomeSolid, AcademicCapIcon as AcademicCapSolid, ClockIcon as ClockSolid, UserIcon as UserSolid, SparklesIcon } from "react-native-heroicons/solid";
import Octicons from '@expo/vector-icons/Octicons';

// animate tipis-tipis for tab icon
const AnimatedTabIcon = ({ Icon, SolidIcon, title, color, focused }) => {
  const IconComponent = focused ? SolidIcon : Icon;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="justify-center items-center gap-1">
      <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: spin }] }}>
        <IconComponent size={24} color={color} />
      </Animated.View>
      <Text className="text-xs font-geistSemiBold" style={{ color }}>
        {title}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarActiveTintColor: "#2A86FF",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 80,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            // <AnimatedTabIcon Icon={HomeIcon} SolidIcon={HomeSolid} color={color} title="Home" focused={focused} />
            <TabBarIcon name={focused ? 'home-lg' : 'home-alt'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            // <AnimatedTabIcon Icon={AcademicCapIcon} SolidIcon={AcademicCapSolid} color={color} title="Explore" focused={focused} />
            <TabBarIcon name={focused ? 'map-location-dot' : 'map-location-dot'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "Friends",
          tabBarIcon: ({ color, focused }) => (
            // <AnimatedTabIcon Icon={UserIcon} SolidIcon={UserSolid} color={color} title="Friends" focused={focused} />
            
            <Octicons name="history" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
