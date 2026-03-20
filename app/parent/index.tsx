import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import StatCard from '@/components/app/StatCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Bell, LogOut, Wallet, Star, BookOpen, Rocket, ShieldCheck, Sparkles, GraduationCap,
  ArrowDownToLine, X, Send,
} from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket,
  star: Star,
  shield: ShieldCheck,
  sparkle: Sparkles,
  graduate: GraduationCap,
};

export default function ParentDashboard() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [depositChildId, setDepositChildId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const totalLoans = state.children.reduce((acc, c) => acc + c.loans.filter(l => l.status === 'active').length, 0);
  const totalTasks = state.children.reduce((acc, c) => acc + c.tasks.filter(t => t.status !== 'approved').length, 0);
  const pendingApprovals = state.children.reduce((acc, c) => acc + c.tasks.filter(t => t.status === 'completed').length, 0);
  const pendingLoanRequests = state.children.reduce((acc, c) => acc + c.loanRequests.filter(r => r.status === 'pending').length, 0);

  const handleDeposit = () => {
    const num = parseInt(depositAmount);
    if (!num || num <= 0 || !depositChildId) { Alert.alert('Алдаа', 'Зөв дүн оруулна уу'); return; }
    dispatch({ type: 'DEPOSIT', childId: depositChildId, amount: num });
    const childName = state.children.find(c => c.id === depositChildId)?.name || '';
    Alert.alert('Амжилттай', `${childName}-ын данс руу ₮${num.toLocaleString()} цэнэглэгдлээ!`);
    setDepositAmount('');
    setDepositChildId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      {/* Deposit Modal */}
      <Modal visible={depositChildId !== null} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-white rounded-3xl p-6 mx-6 w-[85%] shadow-lg">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-black text-[#1a1a2e]">
                💰 {state.children.find(c => c.id === depositChildId)?.name}-д цэнэглэх
              </Text>
              <TouchableOpacity onPress={() => { setDepositChildId(null); setDepositAmount(''); }}>
                <X size={24} color="#AEAEB2" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Дүн (₮)</Text>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-lg text-[#1a1a2e] mb-2 border border-[#F2F2F7] font-bold text-center"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#C7C7CC"
              autoFocus
            />

            <View className="flex-row gap-2 mb-4">
              {['1000', '3000', '5000', '10000'].map(val => (
                <TouchableOpacity
                  key={val}
                  className="flex-1 py-2.5 rounded-2xl bg-[#6C63FF]/10 items-center"
                  onPress={() => setDepositAmount(val)}
                >
                  <Text className="text-xs font-bold text-[#6C63FF]">₮{parseInt(val).toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-[#34C759] rounded-2xl py-4 items-center"
              onPress={handleDeposit}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">Цэнэглэх</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-[#AEAEB2] font-medium">Сайн байна уу!</Text>
            <Text className="text-2xl font-black text-[#1a1a2e] mt-0.5">
              {state.currentUser?.name || 'Эцэг эх'}
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-2xl bg-[#F2F2F7] justify-center items-center"
            onPress={() => {
              dispatch({ type: 'LOGOUT' });
              router.replace('/');
            }}
          >
            <LogOut size={18} color="#AEAEB2" />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard title="Идэвхтэй зээл" value={`${totalLoans}`} icon="wallet" bg="bg-[#6C63FF]" />
            </View>
            <View className="flex-1">
              <StatCard title="Даалгавар" value={`${totalTasks}`} icon="book" bg="bg-[#4ECDC4]" />
            </View>
          </View>
        </Animated.View>

        {/* Pending Loan Requests Alert */}
        {pendingLoanRequests > 0 && (
          <Animated.View entering={FadeInDown.duration(500).delay(150)} className="px-6 mb-2">
            <TouchableOpacity
              className="bg-[#4ECDC4]/10 rounded-2xl p-4 flex-row items-center border border-[#4ECDC4]/20"
              onPress={() => router.push('/parent/loans' as any)}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-2xl bg-[#4ECDC4]/20 justify-center items-center mr-3">
                <Send size={20} color="#4ECDC4" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#4ECDC4]">Зээлийн хүсэлт ирсэн</Text>
                <Text className="text-xs text-[#4ECDC4]/70">{pendingLoanRequests} хүсэлт хүлээгдэж байна</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Pending Task Approvals */}
        {pendingApprovals > 0 && (
          <Animated.View entering={FadeInDown.duration(500).delay(200)} className="px-6 mb-4">
            <TouchableOpacity
              className="bg-[#FF9500]/10 rounded-2xl p-4 flex-row items-center border border-[#FF9500]/20"
              onPress={() => router.push('/parent/tasks' as any)}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-2xl bg-[#FF9500]/20 justify-center items-center mr-3">
                <Bell size={20} color="#FF9500" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#FF9500]">Батлах хүлээгдэж буй</Text>
                <Text className="text-xs text-[#FF9500]/70">{pendingApprovals} даалгавар хийгдсэн</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Children */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} className="px-6 mt-2">
          <Text className="text-lg font-bold text-[#1a1a2e] mb-3">Хүүхдүүд</Text>
          {state.children.map(child => {
            const totalOwed = child.loans.filter(l => l.status === 'active').reduce((s, l) => s + (l.totalDue - l.paidAmount), 0);
            const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
            const childPendingRequests = child.loanRequests.filter(r => r.status === 'pending').length;

            return (
              <View key={child.id} className="bg-white rounded-3xl p-5 mb-3 shadow-sm border border-[#F2F2F7]">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 justify-center items-center mr-3">
                    <AvatarIcon size={24} color="#6C63FF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#1a1a2e]">{child.name}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <Star size={12} color="#FFD93D" fill="#FFD93D" />
                      <Text className="text-xs text-[#AEAEB2]">
                        Итгэлцэл: {child.creditScore}/5
                      </Text>
                    </View>
                  </View>
                  {childPendingRequests > 0 && (
                    <View className="bg-[#FF9500] rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-xs font-bold text-white">{childPendingRequests}</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row gap-2 mb-3">
                  <View className="flex-1 bg-[#F8F8FC] rounded-2xl p-3 items-center">
                    <Wallet size={14} color="#34C759" />
                    <Text className="text-xs text-[#AEAEB2] mt-1">Хэтэвч</Text>
                    <Text className="text-sm font-bold text-[#34C759]">₮{child.balance.toLocaleString()}</Text>
                  </View>
                  <View className="flex-1 bg-[#F8F8FC] rounded-2xl p-3 items-center">
                    <Wallet size={14} color="#FF3B30" />
                    <Text className="text-xs text-[#AEAEB2] mt-1">Зээл</Text>
                    <Text className="text-sm font-bold text-[#FF3B30]">₮{totalOwed.toLocaleString()}</Text>
                  </View>
                  <View className="flex-1 bg-[#F8F8FC] rounded-2xl p-3 items-center">
                    <BookOpen size={14} color="#6C63FF" />
                    <Text className="text-xs text-[#AEAEB2] mt-1">Хичээл</Text>
                    <Text className="text-sm font-bold text-[#6C63FF]">{child.lessonsCompleted.length}/6</Text>
                  </View>
                </View>

                {/* Deposit Button */}
                <TouchableOpacity
                  className="bg-[#34C759]/10 rounded-2xl py-3 items-center flex-row justify-center gap-2 border border-[#34C759]/20"
                  onPress={() => setDepositChildId(child.id)}
                  activeOpacity={0.7}
                >
                  <ArrowDownToLine size={16} color="#34C759" />
                  <Text className="text-sm font-bold text-[#34C759]">Данс руу цэнэглэх</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
