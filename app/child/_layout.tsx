import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, Wallet, CheckSquare, PiggyBank, User } from 'lucide-react-native';

export default function ChildLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F2F2F7',
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#C7C7CC',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
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
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
            }}>
              <Home size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Хадгаламж',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? '#4ECDC415' : 'transparent',
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
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 5,
              borderRadius: 12,
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
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
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
            }}>
              <CheckSquare size={20} color={color} />
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
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
            }}>
              <User size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
