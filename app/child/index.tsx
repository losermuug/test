import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, achievementsData } from '@/contexts/AppContext';
import AchievementBadge from '@/components/app/AchievementBadge';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  Wallet, Flame, Star, CheckSquare, BookOpen, LogOut,
  TrendingDown, ArrowRight, Rocket, ShieldCheck, Sparkles, GraduationCap,
  ArrowDownToLine, ArrowUpFromLine, X,
} from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket, star: Star, shield: ShieldCheck, sparkle: Sparkles, graduate: GraduationCap,
};

export default function ChildDashboard() {
  const { state, dispatch, getSelectedChild } = useApp();
  const router = useRouter();
  const child = getSelectedChild();
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');

  if (!child) return null;

  const activeLoans = child.loans.filter(l => l.status === 'active');
  const totalDebt = activeLoans.reduce((sum, l) => sum + (l.totalDue - l.paidAmount), 0);
  const pendingTasks = child.tasks.filter(t => t.status === 'pending').length;
  const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;

  const handleTransaction = () => {
    const num = parseInt(amount);
    if (!num || num <= 0) { Alert.alert('Алдаа', 'Зөв дүн оруулна уу'); return; }
    if (modalType === 'withdraw' && num > child.balance) {
      Alert.alert('Алдаа', 'Хэтэвчинд хүрэлцэхгүй байна');
      return;
    }
    dispatch({
      type: modalType === 'deposit' ? 'DEPOSIT' : 'WITHDRAW',
      childId: child.id,
      amount: num,
    });
    Alert.alert(
      'Амжилттай',
      modalType === 'deposit'
        ? `₮${num.toLocaleString()} цэнэглэгдлээ!`
        : `₮${num.toLocaleString()} таталт хийгдлээ!`
    );
    setAmount('');
    setModalType(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      {/* Deposit/Withdraw Modal */}
      <Modal visible={modalType !== null} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-white rounded-3xl p-6 mx-6 w-[85%] shadow-lg">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-black text-[#1a1a2e]">
                {modalType === 'deposit' ? '💰 Цэнэглэх' : '💸 Таталт хийх'}
              </Text>
              <TouchableOpacity onPress={() => { setModalType(null); setAmount(''); }}>
                <X size={24} color="#AEAEB2" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Дүн (₮)</Text>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-lg text-[#1a1a2e] mb-2 border border-[#F2F2F7] font-bold text-center"
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#C7C7CC"
              autoFocus
            />
            {modalType === 'withdraw' && (
              <Text className="text-xs text-[#AEAEB2] text-center mb-3">
                Хэтэвч: ₮{child.balance.toLocaleString()}
              </Text>
            )}

            <View className="flex-row gap-2 mb-4">
              {['1000', '3000', '5000', '10000'].map(val => (
                <TouchableOpacity
                  key={val}
                  className="flex-1 py-2.5 rounded-2xl bg-[#6C63FF]/10 items-center"
                  onPress={() => setAmount(val)}
                >
                  <Text className="text-xs font-bold text-[#6C63FF]">₮{parseInt(val).toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className={`rounded-2xl py-4 items-center ${modalType === 'deposit' ? 'bg-[#34C759]' : 'bg-[#FF9500]'}`}
              onPress={handleTransaction}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">
                {modalType === 'deposit' ? 'Цэнэглэх' : 'Таталт хийх'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-2xl bg-[#6C63FF] justify-center items-center">
              <AvatarIcon size={24} color="#fff" />
            </View>
            <View>
              <Text className="text-sm text-[#AEAEB2]">Сайн байна уу!</Text>
              <Text className="text-xl font-black text-[#1a1a2e]">{child.name}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center bg-[#FF9500]/10 px-3 py-2 rounded-2xl gap-1">
              <Flame size={16} color="#FF9500" />
              <Text className="text-sm font-bold text-[#FF9500]">{child.streak}</Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 rounded-2xl bg-[#F2F2F7] justify-center items-center"
              onPress={() => { dispatch({ type: 'LOGOUT' }); router.replace('/'); }}
            >
              <LogOut size={16} color="#AEAEB2" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Wallet Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} className="px-6 mt-3">
          <View className="bg-[#6C63FF] rounded-3xl p-6 shadow-lg overflow-hidden relative">
            <View className="absolute w-40 h-40 rounded-full bg-white/5 -top-10 -right-10" />
            <View className="absolute w-24 h-24 rounded-full bg-white/5 bottom-0 left-4" />
            <View className="flex-row items-center gap-2 mb-1">
              <Wallet size={16} color="#fff" />
              <Text className="text-sm font-semibold text-white/70">Миний хэтэвч</Text>
            </View>
            <Text className="text-4xl font-black text-white mb-4">₮{child.balance.toLocaleString()}</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white/10 rounded-2xl p-3 flex-row items-center gap-2">
                <TrendingDown size={16} color="#FF6B6B" />
                <View>
                  <Text className="text-2xs text-white/50">Нийт өр</Text>
                  <Text className="text-sm font-bold text-white">₮{totalDebt.toLocaleString()}</Text>
                </View>
              </View>
              <View className="flex-1 bg-white/10 rounded-2xl p-3 flex-row items-center gap-2">
                <Star size={16} color="#FFD93D" fill="#FFD93D" />
                <View>
                  <Text className="text-2xs text-white/50">Итгэлцэл</Text>
                  <Text className="text-sm font-bold text-white">{child.creditScore}/5</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Deposit / Withdraw Buttons */}
          <View className="flex-row gap-3 mt-3">
            <TouchableOpacity
              className="flex-1 bg-[#34C759] rounded-2xl py-3.5 flex-row items-center justify-center gap-2"
              onPress={() => setModalType('deposit')}
              activeOpacity={0.7}
            >
              <ArrowDownToLine size={18} color="#fff" />
              <Text className="text-white font-bold text-sm">Цэнэглэх</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#FF9500] rounded-2xl py-3.5 flex-row items-center justify-center gap-2"
              onPress={() => setModalType('withdraw')}
              activeOpacity={0.7}
            >
              <ArrowUpFromLine size={18} color="#fff" />
              <Text className="text-white font-bold text-sm">Таталт</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} className="px-6 mt-6">
          <Text className="text-base font-bold text-[#1a1a2e] mb-3">Хурдан үйлдэл</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-white rounded-3xl p-4 items-center border border-[#F2F2F7] shadow-sm"
              onPress={() => router.push('/child/tasks' as any)}
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-2xl bg-[#34C759]/10 justify-center items-center mb-2">
                <CheckSquare size={22} color="#34C759" />
              </View>
              <Text className="text-sm font-bold text-[#1a1a2e]">Даалгавар</Text>
              <Text className="text-xs text-[#AEAEB2]">{pendingTasks} хүлээж буй</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white rounded-3xl p-4 items-center border border-[#F2F2F7] shadow-sm"
              onPress={() => router.push('/child/loans' as any)}
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 justify-center items-center mb-2">
                <Wallet size={22} color="#6C63FF" />
              </View>
              <Text className="text-sm font-bold text-[#1a1a2e]">Зээл</Text>
              <Text className="text-xs text-[#AEAEB2]">{activeLoans.length} идэвхтэй</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white rounded-3xl p-4 items-center border border-[#F2F2F7] shadow-sm"
              onPress={() => router.push('/child/learn' as any)}
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-2xl bg-[#FF9500]/10 justify-center items-center mb-2">
                <BookOpen size={22} color="#FF9500" />
              </View>
              <Text className="text-sm font-bold text-[#1a1a2e]">Сурах</Text>
              <Text className="text-xs text-[#AEAEB2]">{child.lessonsCompleted.length}/6</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} className="mt-6">
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-[#1a1a2e]">Амжилтууд</Text>
            <Text className="text-xs text-[#AEAEB2]">{child.achievements.length}/{achievementsData.length}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {achievementsData.slice(0, 6).map((ach, i) => (
              <Animated.View key={ach.id} entering={FadeInRight.duration(400).delay(i * 80)}>
                <AchievementBadge
                  title={ach.title}
                  isUnlocked={child.achievements.some(a => a.id === ach.id)}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
