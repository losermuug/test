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

  // Theme colors based on age group
  const activeColor = isJunior ? '#FF6B6B' : isSenior ? '#1a1a2e' : '#6C63FF';
  const tabBg = isJunior ? '#FFF5F5' : '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopWidth: 1,
          borderTopColor: isJunior ? '#FFE0E0' : '#F2F2F7',
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
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
          title: isJunior ? 'Хадгал' : 'Хадгаламж',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? '#4ECDC415' : 'transparent',
            }}>
              <PiggyBank size={isJunior ? 22 : 20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: isJunior ? 'Суралц' : 'Зээл',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? (isJunior ? '#FF950015' : activeColor + '15') : 'transparent',
            }}>
              {isJunior ? <BookOpen size={22} color={color} /> : <Wallet size={20} color={color} />}
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
          href: null,
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
