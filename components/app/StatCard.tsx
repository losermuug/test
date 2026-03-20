import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Flame, CreditCard, Star, BookOpen, Wallet } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: 'wallet' | 'trending' | 'flame' | 'credit' | 'star' | 'book';
  bg?: string;
  iconColor?: string;
  subtitle?: string;
}

const icons = {
  wallet: Wallet,
  trending: TrendingUp,
  flame: Flame,
  credit: CreditCard,
  star: Star,
  book: BookOpen,
};

export default function StatCard({ title, value, icon, bg = 'bg-primary-600', iconColor = '#fff', subtitle }: StatCardProps) {
  const IconComp = icons[icon];
  return (
    <View className={`${bg} rounded-3xl p-5 mb-3 shadow-lg`}>
      <View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center mb-3">
        <IconComp size={22} color={iconColor} />
      </View>
      <Text className="text-xs font-semibold text-white/70 mb-1 uppercase tracking-wide">{title}</Text>
      <Text className="text-2xl font-black text-white">{value}</Text>
      {subtitle && <Text className="text-xs text-white/50 mt-1">{subtitle}</Text>}
    </View>
  );
}
