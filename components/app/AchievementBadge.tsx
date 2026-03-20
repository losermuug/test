import React from 'react';
import { View, Text } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { Lock } from 'lucide-react-native';

interface AchievementBadgeProps {
  title: string;
  isUnlocked: boolean;
  icon?: string;
  color?: string;
}

export default function AchievementBadge({ title, isUnlocked, icon, color = '#6C63FF' }: AchievementBadgeProps) {
  const Icon = (LucideIcons as any)[icon || 'Trophy'] || LucideIcons.Trophy;

  return (
    <View className={`items-center p-3 rounded-3xl w-[100px] mr-3 border ${
      isUnlocked ? 'bg-white border-[#F2F2F7]' : 'bg-[#F8F8F8] border-transparent opacity-50'
    }`}>
      <View
        className={`w-12 h-12 rounded-2xl justify-center items-center mb-2`}
        style={{ backgroundColor: isUnlocked ? color + '15' : '#E5E5EA' }}
      >
        {isUnlocked ? (
          <Icon size={22} color={color} />
        ) : (
          <Lock size={18} color="#C7C7CC" />
        )}
      </View>
      <Text
        className={`text-2xs font-semibold text-center ${isUnlocked ? 'text-[#1a1a2e]' : 'text-[#AEAEB2]'}`}
        numberOfLines={2}
      >
        {title}
      </Text>
    </View>
  );
}
