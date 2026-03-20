import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import LoanCard from '@/components/app/LoanCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Plus, X, Wallet, Percent, Calendar, Calculator,
  Rocket, Star, ShieldCheck, Sparkles, GraduationCap,
  CheckCircle, XCircle, Clock, MessageSquare, Send, ArrowDownToLine,
} from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket, star: Star, shield: ShieldCheck, sparkle: Sparkles, graduate: GraduationCap,
};

export default function ParentLoans() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(state.children[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [dueDays, setDueDays] = useState('7');

  // Pending loan requests from all children
  const pendingRequests = state.children.flatMap(c =>
    c.loanRequests
      .filter(r => r.status === 'pending')
      .map(r => ({ ...r, childName: c.name, childAvatar: c.avatar }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateLoan = () => {
    const amountNum = parseInt(amount);
    if (!amountNum || amountNum <= 0) {
      Alert.alert('Алдаа', 'Зээлийн дүнг зөв оруулна уу');
      return;
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(dueDays));
    dispatch({ type: 'CREATE_LOAN', childId: selectedChild, amount: amountNum, interestRate: parseFloat(interestRate), dueDate: dueDate.toISOString() });
    setAmount('');
    setShowForm(false);
    Alert.alert('Амжилттай', `₮${amountNum.toLocaleString()} зээл үүсгэлээ!`);
  };

  const handleApproveRequest = (childId: string, requestId: string, requestAmount: number) => {
    Alert.alert(
      'Зээл зөвшөөрөх',
      `₮${requestAmount.toLocaleString()} зээл зөвшөөрөх үү?\n\nХүү: 10% | Хугацаа: 7 хоног`,
      [
        { text: 'Болих', style: 'cancel' },
        {
          text: 'Зөвшөөрөх',
          onPress: () => {
            dispatch({
              type: 'APPROVE_LOAN_REQUEST',
              childId,
              requestId,
              interestRate: 10,
              dueDays: 7,
            });
            Alert.alert('Амжилттай', 'Зээл зөвшөөрөгдлөө! Хүүхдийн данс руу мөнгө орлоо.');
          },
        },
      ]
    );
  };

  const handleRejectRequest = (childId: string, requestId: string) => {
    Alert.alert(
      'Зээл татгалзах',
      'Энэ зээлийн хүсэлтийг татгалзах уу?',
      [
        { text: 'Болих', style: 'cancel' },
        {
          text: 'Татгалзах',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'REJECT_LOAN_REQUEST', childId, requestId });
            Alert.alert('Татгалзлаа', 'Зээлийн хүсэлт татгалзагдлаа.');
          },
        },
      ]
    );
  };

  const allLoans = state.children.flatMap(c =>
    c.loans.map(l => ({ ...l, childName: c.name, childAvatar: c.avatar }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-black text-[#1a1a2e]">Зээлийн удирдлага</Text>
            <Text className="text-sm text-[#AEAEB2] mt-0.5">Хүүхдэд зээл үүсгэх</Text>
          </View>
          <TouchableOpacity
            className={`w-12 h-12 rounded-2xl justify-center items-center ${showForm ? 'bg-[#FF3B30]' : 'bg-[#6C63FF]'}`}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.7}
          >
            {showForm ? <X size={22} color="#fff" /> : <Plus size={22} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>

        {/* Direct Loan Creation Form */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="mx-6 bg-white rounded-3xl p-5 mb-4 shadow-sm border border-[#6C63FF]/10">
            <Text className="text-lg font-bold text-[#1a1a2e] mb-4">Шинэ зээл</Text>

            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Хүүхэд</Text>
            <View className="flex-row gap-2 mb-4">
              {state.children.map(child => {
                const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
                return (
                  <TouchableOpacity
                    key={child.id}
                    className={`flex-1 p-3 rounded-2xl border-2 items-center ${
                      selectedChild === child.id ? 'border-[#6C63FF] bg-[#6C63FF]/5' : 'border-[#F2F2F7]'
                    }`}
                    onPress={() => setSelectedChild(child.id)}
                  >
                    <AvatarIcon size={24} color={selectedChild === child.id ? '#6C63FF' : '#C7C7CC'} />
                    <Text className={`text-sm font-semibold mt-1 ${selectedChild === child.id ? 'text-[#6C63FF]' : 'text-[#AEAEB2]'}`}>
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Wallet size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Зээлийн дүн (₮)</Text>
            </View>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-3 border border-[#F2F2F7]"
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="5000"
              placeholderTextColor="#C7C7CC"
            />

            <View className="flex-row items-center gap-2 mb-2">
              <Percent size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Хүүгийн хувь</Text>
            </View>
            <View className="flex-row gap-2 mb-3">
              {['5', '10', '15', '20'].map(rate => (
                <TouchableOpacity
                  key={rate}
                  className={`flex-1 py-3 rounded-2xl items-center ${interestRate === rate ? 'bg-[#6C63FF]' : 'bg-[#F8F8FC]'}`}
                  onPress={() => setInterestRate(rate)}
                >
                  <Text className={`font-bold ${interestRate === rate ? 'text-white' : 'text-[#8E8E93]'}`}>{rate}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Calendar size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Хугацаа</Text>
            </View>
            <View className="flex-row gap-2 mb-4">
              {['3', '7', '14', '30'].map(days => (
                <TouchableOpacity
                  key={days}
                  className={`flex-1 py-3 rounded-2xl items-center ${dueDays === days ? 'bg-[#4ECDC4]' : 'bg-[#F8F8FC]'}`}
                  onPress={() => setDueDays(days)}
                >
                  <Text className={`font-bold ${dueDays === days ? 'text-white' : 'text-[#8E8E93]'}`}>{days}д</Text>
                </TouchableOpacity>
              ))}
            </View>

            {amount ? (
              <View className="bg-[#6C63FF]/5 rounded-2xl p-4 mb-4 flex-row items-center gap-3 border border-[#6C63FF]/10">
                <Calculator size={18} color="#6C63FF" />
                <View>
                  <Text className="text-xs text-[#6C63FF] font-semibold">Тооцоолол</Text>
                  <Text className="text-sm text-[#1a1a2e]">
                    ₮{parseInt(amount || '0').toLocaleString()} + ₮{Math.round(parseInt(amount || '0') * parseFloat(interestRate) / 100).toLocaleString()} = <Text className="font-bold">₮{Math.round(parseInt(amount || '0') * (1 + parseFloat(interestRate) / 100)).toLocaleString()}</Text>
                  </Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity className="bg-[#6C63FF] rounded-2xl py-4 items-center" onPress={handleCreateLoan} activeOpacity={0.7}>
              <Text className="text-white text-base font-bold">Зээл үүсгэх</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Pending Loan Requests from Children */}
        {pendingRequests.length > 0 && (
          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Send size={16} color="#FF9500" />
              <Text className="text-base font-bold text-[#FF9500]">Хүүхдийн зээл хүсэлтүүд</Text>
              <View className="bg-[#FF9500] rounded-full w-6 h-6 items-center justify-center ml-1">
                <Text className="text-xs font-bold text-white">{pendingRequests.length}</Text>
              </View>
            </View>

            {pendingRequests.map(req => {
              const AvatarIcon = AVATAR_ICONS[req.childAvatar] || Rocket;
              return (
                <View key={req.id} className="bg-white rounded-3xl p-5 mb-3 shadow-sm border border-[#FF9500]/15">
                  {/* Child info & amount */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-2xl bg-[#6C63FF]/10 justify-center items-center">
                        <AvatarIcon size={20} color="#6C63FF" />
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-[#AEAEB2]">{req.childName}</Text>
                        <Text className="text-xl font-black text-[#1a1a2e]">₮{req.amount.toLocaleString()}</Text>
                      </View>
                    </View>
                    <View className="bg-[#FF9500]/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                      <Clock size={12} color="#FF9500" />
                      <Text className="text-xs font-bold text-[#FF9500]">Хүлээгдэж буй</Text>
                    </View>
                  </View>

                  {/* Purpose */}
                  <View className="bg-[#F8F8FC] rounded-2xl p-3.5 mb-4 flex-row items-start gap-2">
                    <MessageSquare size={16} color="#6C63FF" style={{ marginTop: 1 }} />
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-[#6C63FF] mb-1">Зорилго</Text>
                      <Text className="text-sm text-[#1a1a2e]">{req.purpose}</Text>
                    </View>
                  </View>

                  {/* Date */}
                  <Text className="text-xs text-[#AEAEB2] mb-3">
                    Хүсэлт: {new Date(req.createdAt).toLocaleDateString('mn-MN')}
                  </Text>

                  {/* Action buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-[#34C759] rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
                      onPress={() => handleApproveRequest(req.childId, req.id, req.amount)}
                      activeOpacity={0.7}
                    >
                      <CheckCircle size={18} color="#fff" />
                      <Text className="text-white font-bold text-sm">Зөвшөөрөх</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-[#FF3B30] rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
                      onPress={() => handleRejectRequest(req.childId, req.id)}
                      activeOpacity={0.7}
                    >
                      <XCircle size={18} color="#fff" />
                      <Text className="text-white font-bold text-sm">Татгалзах</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </Animated.View>
        )}

        {/* All Loans */}
        <View className="px-6 mt-2">
          {allLoans.length === 0 && pendingRequests.length === 0 ? (
            <EmptyState title="Зээл байхгүй" message="Хүүхдэд зээл үүсгэхийн тулд + товч дарна уу." />
          ) : allLoans.length > 0 ? (
            <>
              <Text className="text-base font-bold text-[#1a1a2e] mb-3">Бүх зээлүүд</Text>
              {allLoans.map(loan => {
                const AvatarIcon = AVATAR_ICONS[loan.childAvatar] || Rocket;
                return (
                  <View key={loan.id}>
                    <View className="flex-row items-center gap-1.5 mb-1 ml-1">
                      <AvatarIcon size={12} color="#AEAEB2" />
                      <Text className="text-xs text-[#AEAEB2]">{loan.childName}</Text>
                    </View>
                    <LoanCard loan={loan} />
                  </View>
                );
              })}
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
