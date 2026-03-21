import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { LayoutDashboard, Wallet, ClipboardList } from 'lucide-react-native';

export default function ParentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F2F2F7',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#C7C7CC',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        tabBarItemStyle: { gap: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Хянах',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 6,
              borderRadius: 12,
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
            }}>
              <LayoutDashboard size={22} color={color} />
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
              padding: 6,
              borderRadius: 12,
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
            }}>
              <Wallet size={22} color={color} />
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
              padding: 6,
              borderRadius: 12,
              backgroundColor: focused ? '#6C63FF15' : 'transparent',
            }}>
              <ClipboardList size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
