import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { typography } from '@/constants/typography';
import { UserPreferenceProvider } from '@/context/UserPreferenceContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <UserPreferenceProvider>      
      <Tabs 
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.darkMuted,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 0,
            borderTopColor: "transparent",
            backgroundColor: colors.surface,
          },
          tabBarLabelStyle: {
            fontSize: typography.caption,
            fontFamily: fonts.regular,
          },
        }}
      >
        <Tabs.Screen 
          name="index"
          options={{
            title: "Today",
            tabBarIcon: ({color, size, focused}) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"}
                size={20}
                color={color}
              />
            )
          }}
        /> 

        <Tabs.Screen 
          name="Insights"
          options={{
            title: "Insights",
            tabBarIcon: ({color, size, focused}) => (
              <Ionicons 
                name={focused ? "bar-chart" : "bar-chart-outline"}
                size={20}
                color={color}
              />
            )
          }}
        /> 

        <Tabs.Screen 
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({color, size, focused}) => (
              <Ionicons 
                name={focused ? "person" : "person-outline"}
                size={20}
                color={color}
              />
            )
          }}
        /> 
      </Tabs>
    </ UserPreferenceProvider>
  )
}
