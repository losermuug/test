import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, achievementsData, getAgeGroup } from '@/contexts/AppContext';
import AchievementBadge from '@/components/app/AchievementBadge';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import JuniorBackground from '@/components/app/JuniorBackground';
import MoneyVisualizer from '@/components/app/MoneyVisualizer';
import {
  User, Wallet, PiggyBank, Star, Flame, Trophy, BookOpen,
  TrendingDown, LogOut, RefreshCw, ChevronRight,
  Rocket, ShieldCheck, Sparkles, GraduationCap,
} from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket, star: Star, shield: ShieldCheck, sparkle: Sparkles, graduate: GraduationCap,
};

export default function ChildProfile() {
  const { state, dispatch, getSelectedChild } = useApp();
  const router = useRouter();
  const child = getSelectedChild();

  if (!child) return null;

  const isJunior = getAgeGroup(child.age) === 'junior';
  const primaryColor = isJunior ? '#C084FC' : '#0A7EA4';

  const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
  const activeLoans = child.loans.filter(l => l.status === 'active');
  const totalDebt = activeLoans.reduce((sum, l) => sum + (l.totalDue - l.paidAmount), 0);
  const paidLoans = child.loans.filter(l => l.status === 'paid').length;
  const completedTasks = child.tasks.filter(t => t.status === 'approved').length;
  const totalEarned = child.tasks.filter(t => t.status === 'approved').reduce((s, t) => s + t.reward, 0);

  const handleLogout = () => {
    Alert.alert('Гарах', 'Та гарахдаа итгэлтэй байна уу?', [
      { text: 'Болих', style: 'cancel' },
      {
        text: 'Гарах',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'LOGOUT' });
          router.replace('/');
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Анхааруулга',
      'Бүх өгөгдлийг устгах уу? Энэ үйлдлийг буцаах боломжгүй!',
      [
        { text: 'Болих', style: 'cancel' },
        {
          text: 'Устгах',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET' });
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isJunior ? '#FDF4FF' : '#F8F8FC' }}>
      {isJunior && <JuniorBackground />}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-6 items-center">
          <View className="w-24 h-24 rounded-3xl justify-center items-center mb-4 shadow-lg border-2" style={{ backgroundColor: primaryColor, shadowColor: primaryColor, borderColor: isJunior ? '#F3E8FF' : '#E0F2FE' }}>
            <AvatarIcon size={48} color="#fff" />
          </View>
          <Text className="text-2xl font-black text-[#1a1a2e]">{child.name}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="flex-row items-center px-3 py-1.5 rounded-full gap-1" style={{ backgroundColor: primaryColor + '15' }}>
              <Star size={14} color={primaryColor} fill={primaryColor} />
              <Text className="text-xs font-bold" style={{ color: primaryColor }}>Итгэлцэл: {child.creditScore}/5</Text>
            </View>
            <View className="flex-row items-center px-3 py-1.5 rounded-full gap-1" style={{ backgroundColor: primaryColor + '15' }}>
              <Flame size={14} color={primaryColor} />
              <Text className="text-xs font-bold" style={{ color: primaryColor }}>{child.streak} хоног</Text>
            </View>
          </View>
        </Animated.View>

        {/* Financial Summary */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} className="px-6 mt-6">
          <Text className="text-base font-bold text-[#1a1a2e] mb-3">Санхүүгийн мэдээлэл</Text>
          <View className="bg-white rounded-3xl p-5 border border-[#F2F2F7] shadow-sm">
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1 bg-[#34C759]/5 rounded-2xl p-3.5 items-center border border-[#34C759]/10">
                <Wallet size={20} color="#34C759" />
                <Text className="text-xs text-[#AEAEB2] mt-1.5 mb-1">Хэтэвч</Text>
                {isJunior ? (
                  <MoneyVisualizer amount={child.balance} size={24} textColor="#34C759" />
                ) : (
                  <Text className="text-base font-black text-[#34C759]">₮{child.balance.toLocaleString()}</Text>
                )}
              </View>
              <View className="flex-1 rounded-2xl p-3.5 items-center border" style={{ backgroundColor: primaryColor + '0D', borderColor: primaryColor + '1A' }}>
                <PiggyBank size={20} color={primaryColor} />
                <Text className="text-xs text-[#AEAEB2] mt-1.5 mb-1">Хадгаламж</Text>
                {isJunior ? (
                  <MoneyVisualizer amount={child.savings} size={24} textColor={primaryColor} />
                ) : (
                  <Text className="text-base font-black" style={{ color: primaryColor }}>₮{child.savings.toLocaleString()}</Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-[#FF3B30]/5 rounded-2xl p-3.5 items-center border border-[#FF3B30]/10">
                <TrendingDown size={20} color="#FF3B30" />
                <Text className="text-xs text-[#AEAEB2] mt-1.5 mb-1">Нийт өр</Text>
                {isJunior ? (
                  <MoneyVisualizer amount={totalDebt} size={24} textColor="#FF3B30" />
                ) : (
                  <Text className="text-base font-black text-[#FF3B30]">₮{totalDebt.toLocaleString()}</Text>
                )}
              </View>
              <View className="flex-1 rounded-2xl p-3.5 items-center border" style={{ backgroundColor: primaryColor + '0D', borderColor: primaryColor + '1A' }}>
                <Trophy size={20} color={primaryColor} />
                <Text className="text-xs text-[#AEAEB2] mt-1.5 mb-1">Нийт олсон</Text>
                {isJunior ? (
                  <MoneyVisualizer amount={totalEarned} size={24} textColor={primaryColor} />
                ) : (
                  <Text className="text-base font-black" style={{ color: primaryColor }}>₮{totalEarned.toLocaleString()}</Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} className="px-6 mt-5">
          <Text className="text-base font-bold text-[#1a1a2e] mb-3">Статистик</Text>
          <View className="bg-white rounded-3xl border border-[#F2F2F7] shadow-sm overflow-hidden">
            {[
              { label: 'Гүйцэтгэсэн даалгавар', value: `${completedTasks}`, icon: <Star size={18} color={primaryColor} /> },
              { label: 'Төлсөн зээл', value: `${paidLoans}`, icon: <TrendingDown size={18} color="#34C759" /> },
              { label: 'Дууссан хичээл', value: `${child.lessonsCompleted.length}/6`, icon: <BookOpen size={18} color={primaryColor} /> },
              { label: 'Амжилтууд', value: `${child.achievements.length}/${achievementsData.length}`, icon: <Trophy size={18} color={primaryColor} /> },
            ].map((item, i) => (
              <View
                key={i}
                className={`flex-row items-center justify-between p-4 ${i < 3 ? 'border-b border-[#F2F2F7]' : ''}`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-xl bg-[#F8F8FC] justify-center items-center">
                    {item.icon}
                  </View>
                  <Text className="text-sm font-medium text-[#1a1a2e]">{item.label}</Text>
                </View>
                <Text className="text-base font-bold text-[#1a1a2e]">{item.value}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} className="mt-5">
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-[#1a1a2e]">Амжилтууд</Text>
            <Text className="text-xs text-[#AEAEB2]">{child.achievements.length}/{achievementsData.length}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {achievementsData.map((ach, i) => (
              <Animated.View key={ach.id} entering={FadeInRight.duration(400).delay(i * 60)}>
                <AchievementBadge
                  title={ach.title}
                  isUnlocked={child.achievements.some(a => a.id === ach.id)}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} className="px-6 mt-6">
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-[#F2F2F7] shadow-sm mb-3"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-2xl bg-[#FF3B30]/10 justify-center items-center">
                <LogOut size={20} color="#FF3B30" />
              </View>
              <Text className="text-sm font-bold text-[#FF3B30]">Гарах</Text>
            </View>
            <ChevronRight size={18} color="#AEAEB2" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-[#F2F2F7] shadow-sm"
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-2xl bg-[#AEAEB2]/10 justify-center items-center">
                <RefreshCw size={20} color="#AEAEB2" />
              </View>
              <Text className="text-sm font-bold text-[#AEAEB2]">Өгөгдөл цэвэрлэх</Text>
            </View>
            <ChevronRight size={18} color="#AEAEB2" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
