import React from 'react';
import { View, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  iconColor?: string;
}

export default function EmptyState({ title, message, iconColor = '#C7C7CC' }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-20 h-20 rounded-3xl bg-[#F2F2F7] justify-center items-center mb-5">
        <Inbox size={36} color={iconColor} />
      </View>
      <Text className="text-xl font-bold text-[#1a1a2e] mb-2 text-center">{title}</Text>
      <Text className="text-sm text-[#AEAEB2] text-center leading-5">{message}</Text>
    </View>
  );
}
