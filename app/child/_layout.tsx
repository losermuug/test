import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, Wallet, CheckSquare, PiggyBank, User, BookOpen, Gamepad2 } from 'lucide-react-native';
import { useApp, getAgeGroup } from '@/contexts/AppContext';

export default function ChildLayout() {
  const { getSelectedChild } = useApp();
  const child = getSelectedChild();
  const ageGroup = child ? getAgeGroup(child.age) : 'teen';

  const isJunior = ageGroup === 'junior';
  const isSenior = ageGroup === 'senior';

  // Theme colors unified to formal Fintech layout
  const activeColor = isJunior ? '#C084FC' : '#0A7EA4';
  const tabBg = '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopWidth: 1,
          borderTopColor: '#F2F2F7',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#C7C7CC',
        tabBarLabelStyle: { fontSize: isJunior ? 11 : 10, fontWeight: '600', marginTop: 2 },
        tabBarItemStyle: { gap: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Нүүр',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? activeColor + '15' : 'transparent',
            }}>
              <Home size={isJunior ? 22 : 20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Хадгаламж',
          href: isJunior ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? activeColor + '15' : 'transparent',
            }}>
              <PiggyBank size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Зээл',
          href: isJunior ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? activeColor + '15' : 'transparent',
            }}>
              <Wallet size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Даалгавар',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? activeColor + '15' : 'transparent',
            }}>
              <CheckSquare size={isJunior ? 22 : 20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Хичээл',
          href: isJunior ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? activeColor + '15' : 'transparent',
            }}>
              <BookOpen size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профайл',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? activeColor + '15' : 'transparent',
            }}>
              <User size={isJunior ? 22 : 20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
