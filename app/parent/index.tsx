import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import { AGE_GROUP_CONFIG } from '@/constants/ageGroupData';
import StatCard from '@/components/app/StatCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Bell, LogOut, Wallet, Star, BookOpen, Rocket, ShieldCheck, Sparkles, GraduationCap,
  ArrowDownToLine, X, Send, UserPlus, Baby, Calendar,
} from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket,
  star: Star,
  shield: ShieldCheck,
  sparkle: Sparkles,
  graduate: GraduationCap,
};

const AVATARS = [
  { key: 'rocket', Icon: Rocket, color: '#FF6B6B' },
  { key: 'star', Icon: Star, color: '#FFD93D' },
  { key: 'shield', Icon: ShieldCheck, color: '#6C63FF' },
  { key: 'sparkle', Icon: Sparkles, color: '#4ECDC4' },
  { key: 'graduate', Icon: GraduationCap, color: '#FF9500' },
];

export default function ParentDashboard() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [depositChildId, setDepositChildId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Add child form
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childAvatar, setChildAvatar] = useState('rocket');

  const totalLoans = state.children.reduce((acc, c) => acc + c.loans.filter(l => l.status === 'active').length, 0);
  const totalTasks = state.children.reduce((acc, c) => acc + c.tasks.filter(t => t.status !== 'approved').length, 0);
  const pendingApprovals = state.children.reduce((acc, c) => acc + c.tasks.filter(t => t.status === 'completed').length, 0);
  const pendingLoanRequests = state.children.reduce((acc, c) => acc + c.loanRequests.filter(r => r.status === 'pending').length, 0);

  const handleDeposit = () => {
    const num = parseInt(depositAmount);
    if (!num || num <= 0 || !depositChildId) { Alert.alert('Алдаа', 'Зөв дүн оруулна уу'); return; }
    dispatch({ type: 'DEPOSIT', childId: depositChildId, amount: num });
    const childNameFound = state.children.find(c => c.id === depositChildId)?.name || '';
    Alert.alert('Амжилттай', `${childNameFound}-ын данс руу ₮${num.toLocaleString()} цэнэглэгдлээ!`);
    setDepositAmount('');
    setDepositChildId(null);
  };

  const handleAddChild = () => {
    if (!childName.trim()) {
      Alert.alert('Алдаа', 'Хүүхдийн нэрийг оруулна уу');
      return;
    }
    const age = parseInt(childAge);
    if (!age || age < 6 || age > 18) {
      Alert.alert('Алдаа', '6-18 насны хооронд оруулна уу');
      return;
    }

    dispatch({
      type: 'ADD_CHILD',
      name: childName.trim(),
      avatar: childAvatar,
      age,
    });

    const ageGroup = getAgeGroup(age);
    const groupConfig = AGE_GROUP_CONFIG[ageGroup];

    Alert.alert(
      'Амжилттай!',
      `${childName.trim()} "${groupConfig.label}" бүлэгт бүртгэгдлээ!\nPIN: 1234 (дараа солино)`
    );
    setChildName('');
    setChildAge('');
    setChildAvatar('rocket');
    setShowAddChild(false);
  };

  const getAgeGroupLabel = (age: number) => {
    const group = getAgeGroup(age);
    return AGE_GROUP_CONFIG[group].label;
  };

  const getAgeGroupColor = (age: number) => {
    const group = getAgeGroup(age);
    return AGE_GROUP_CONFIG[group].colorPrimary;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      {/* Deposit Modal */}
      <Modal visible={depositChildId !== null} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-white rounded-3xl p-6 mx-6 w-[85%] shadow-lg">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center gap-2">
                <Wallet size={24} color="#1a1a2e" />
                <Text className="text-xl font-black text-[#1a1a2e]">
                  {state.children.find(c => c.id === depositChildId)?.name}-д цэнэглэх
                </Text>
              </View>
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

      {/* Add Child Modal */}
      <Modal visible={showAddChild} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View className="bg-white rounded-3xl p-6 mx-6 w-[90%] shadow-lg">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center gap-2">
                <Baby size={22} color="#6C63FF" />
                <Text className="text-xl font-black text-[#1a1a2e]">Хүүхэд бүртгэх</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddChild(false)}>
                <X size={24} color="#AEAEB2" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Нэр</Text>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-4 border border-[#F2F2F7]"
              value={childName}
              onChangeText={setChildName}
              placeholder="Хүүхдийн нэр"
              placeholderTextColor="#C7C7CC"
            />

            {/* Age */}
            <View className="flex-row items-center gap-2 mb-2">
              <Calendar size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Нас (6-18)</Text>
            </View>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-2 border border-[#F2F2F7] text-center"
              value={childAge}
              onChangeText={t => setChildAge(t.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="number-pad"
              placeholder="10"
              placeholderTextColor="#C7C7CC"
              maxLength={2}
            />

            {/* Age quick select */}
            <View className="flex-row gap-2 mb-4">
              {['7', '10', '13', '16'].map(val => (
                <TouchableOpacity
                  key={val}
                  className={`flex-1 py-2.5 rounded-2xl items-center ${childAge === val ? 'bg-[#6C63FF]' : 'bg-[#F8F8FC] border border-[#F2F2F7]'}`}
                  onPress={() => setChildAge(val)}
                >
                  <Text className={`text-xs font-bold ${childAge === val ? 'text-white' : 'text-[#8E8E93]'}`}>{val} нас</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age group preview */}
            {childAge && parseInt(childAge) >= 6 && parseInt(childAge) <= 18 && (
              <View
                className="rounded-2xl p-3 mb-4 items-center"
                style={{ backgroundColor: getAgeGroupColor(parseInt(childAge)) + '15' }}
              >
                <Text className="text-sm font-bold" style={{ color: getAgeGroupColor(parseInt(childAge)) }}>
                  {getAgeGroupLabel(parseInt(childAge))} · {AGE_GROUP_CONFIG[getAgeGroup(parseInt(childAge))].description}
                </Text>
              </View>
            )}

            {/* Avatar selection */}
            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Аватар</Text>
            <View className="flex-row gap-3 justify-center mb-5">
              {AVATARS.map(av => (
                <TouchableOpacity
                  key={av.key}
                  className={`w-12 h-12 rounded-2xl justify-center items-center border-2 ${
                    childAvatar === av.key ? 'border-[#6C63FF]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: av.color + (childAvatar === av.key ? '' : '30') }}
                  onPress={() => setChildAvatar(av.key)}
                >
                  <av.Icon size={22} color="#fff" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-[#6C63FF] rounded-2xl py-4 items-center flex-row justify-center gap-2"
              onPress={handleAddChild}
              activeOpacity={0.7}
            >
              <UserPlus size={18} color="#fff" />
              <Text className="text-white text-base font-bold">Бүртгүүлэх</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
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
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-[#1a1a2e]">Хүүхдүүд</Text>
            <TouchableOpacity
              className="bg-[#6C63FF] rounded-2xl px-4 py-2 flex-row items-center gap-2"
              onPress={() => setShowAddChild(true)}
              activeOpacity={0.7}
            >
              <UserPlus size={16} color="#fff" />
              <Text className="text-sm font-bold text-white">Нэмэх</Text>
            </TouchableOpacity>
          </View>

          {state.children.map(child => {
            const totalOwed = child.loans.filter(l => l.status === 'active').reduce((s, l) => s + (l.totalDue - l.paidAmount), 0);
            const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
            const childPendingRequests = child.loanRequests.filter(r => r.status === 'pending').length;
            const ageGroupColor = getAgeGroupColor(child.age);
            const ageGroupLabel = getAgeGroupLabel(child.age);

            return (
              <View key={child.id} className="bg-white rounded-3xl p-5 mb-3 shadow-sm border border-[#F2F2F7]">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 justify-center items-center mr-3">
                    <AvatarIcon size={24} color="#6C63FF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#1a1a2e]">{child.name}</Text>
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <View
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: ageGroupColor + '15' }}
                      >
                        <Text className="text-xs font-bold" style={{ color: ageGroupColor }}>
                          {child.age} нас · {ageGroupLabel}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Star size={10} color="#FFD93D" fill="#FFD93D" />
                        <Text className="text-xs text-[#AEAEB2]">{child.creditScore}/5</Text>
                      </View>
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
