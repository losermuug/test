import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import LoanCard from '@/components/app/LoanCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Wallet, CheckCircle, Plus, X, Send, FileText,
  Clock, XCircle, CheckCircle2, MessageSquare,
} from 'lucide-react-native';

export default function ChildLoans() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [showForm, setShowForm] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  if (!child) return null;

  const activeLoans = child.loans.filter(l => l.status === 'active');
  const paidLoans = child.loans.filter(l => l.status === 'paid');
  const pendingRequests = child.loanRequests.filter(r => r.status === 'pending');
  const respondedRequests = child.loanRequests.filter(r => r.status !== 'pending');

  const handleRepay = (loanId: string, totalDue: number, paidAmount: number) => {
    const remaining = totalDue - paidAmount;
    const repayAmount = Math.min(remaining, child.balance);
    if (child.balance <= 0) { Alert.alert('Мөнгө хүрэхгүй', 'Даалгавар гүйцэтгэж мөнгө олоорой!'); return; }

    Alert.alert(
      'Зээл төлөх',
      `₮${repayAmount.toLocaleString()} төлөх үү?\n\nХэтэвч: ₮${child.balance.toLocaleString()}\nҮлдэгдэл: ₮${remaining.toLocaleString()}`,
      [
        { text: 'Болих', style: 'cancel' },
        {
          text: 'Төлөх',
          onPress: () => {
            dispatch({ type: 'REPAY_LOAN', childId: child.id, loanId, amount: repayAmount });
            if (repayAmount >= remaining) {
              const loan = child.loans.find(l => l.id === loanId);
              if (loan && new Date() < new Date(loan.dueDate)) {
                dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'early-repay' });
                Alert.alert('Амжилт!', '"Цагаа олсон" амжилт нээгдлээ!');
              } else {
                dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'first-loan-repaid' });
                Alert.alert('Баяр хүргэе!', 'Зээлээ бүрэн төллөө!');
              }
              const otherActive = child.loans.filter(l => l.status === 'active' && l.id !== loanId);
              if (otherActive.length === 0) dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'zero-balance' });
            } else {
              Alert.alert('Амжилттай', `₮${repayAmount.toLocaleString()} төлөгдлөө!`);
            }
          },
        },
      ]
    );
  };

  const handleRequestLoan = () => {
    const amountNum = parseInt(requestAmount);
    if (!amountNum || amountNum <= 0) {
      Alert.alert('Алдаа', 'Зээлийн дүнг зөв оруулна уу');
      return;
    }
    if (!purpose.trim()) {
      Alert.alert('Алдаа', 'Зээлийн зорилгоо бичнэ үү');
      return;
    }
    dispatch({
      type: 'REQUEST_LOAN',
      childId: child.id,
      amount: amountNum,
      purpose: purpose.trim(),
    });
    setRequestAmount('');
    setPurpose('');
    setShowForm(false);
    Alert.alert('Амжилттай', 'Зээлийн хүсэлт эцэг эх рүү илгээгдлээ!');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-black text-[#1a1a2e]">Миний зээлүүд</Text>
            <View className="flex-row items-center gap-2 mt-1">
              <Wallet size={14} color="#AEAEB2" />
              <Text className="text-sm text-[#AEAEB2]">Хэтэвч: ₮{child.balance.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity
            className={`w-12 h-12 rounded-2xl justify-center items-center ${showForm ? 'bg-[#FF3B30]' : 'bg-[#4ECDC4]'}`}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.7}
          >
            {showForm ? <X size={22} color="#fff" /> : <Plus size={22} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>

        {/* Loan Request Form */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="mx-6 bg-white rounded-3xl p-5 mb-4 shadow-sm border border-[#4ECDC4]/20">
            <View className="flex-row items-center gap-2 mb-4">
              <Send size={18} color="#4ECDC4" />
              <Text className="text-lg font-bold text-[#1a1a2e]">Зээл хүсэх</Text>
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Wallet size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Хүсэж буй дүн (₮)</Text>
            </View>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-3 border border-[#F2F2F7]"
              value={requestAmount}
              onChangeText={setRequestAmount}
              keyboardType="number-pad"
              placeholder="5000"
              placeholderTextColor="#C7C7CC"
            />

            <View className="flex-row gap-2 mb-3">
              {['1000', '3000', '5000', '10000'].map(val => (
                <TouchableOpacity
                  key={val}
                  className={`flex-1 py-2.5 rounded-2xl items-center ${requestAmount === val ? 'bg-[#4ECDC4]' : 'bg-[#F8F8FC]'}`}
                  onPress={() => setRequestAmount(val)}
                >
                  <Text className={`text-xs font-bold ${requestAmount === val ? 'text-white' : 'text-[#8E8E93]'}`}>
                    ₮{parseInt(val).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <FileText size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Зорилго (заавал бичих)</Text>
            </View>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-4 border border-[#F2F2F7]"
              value={purpose}
              onChangeText={setPurpose}
              placeholder="Жишээ: Ном худалдаж авах, хичээлийн хэрэгсэл..."
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{ minHeight: 80 }}
            />

            <TouchableOpacity
              className="bg-[#4ECDC4] rounded-2xl py-4 items-center flex-row justify-center gap-2"
              onPress={handleRequestLoan}
              activeOpacity={0.7}
            >
              <Send size={18} color="#fff" />
              <Text className="text-white text-base font-bold">Эцэг эх рүү хүсэлт илгээх</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View className="px-6 mt-2">
          {/* Pending Loan Requests */}
          {pendingRequests.length > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(50)}>
              <View className="flex-row items-center gap-2 mb-3">
                <Clock size={14} color="#FF9500" />
                <Text className="text-sm font-bold text-[#FF9500]">Хүлээгдэж буй хүсэлтүүд</Text>
              </View>
              {pendingRequests.map(req => (
                <View key={req.id} className="bg-[#FF9500]/5 rounded-3xl p-4 mb-3 border border-[#FF9500]/20">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-black text-[#1a1a2e]">₮{req.amount.toLocaleString()}</Text>
                    <View className="bg-[#FF9500]/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                      <Clock size={12} color="#FF9500" />
                      <Text className="text-xs font-bold text-[#FF9500]">Хүлээгдэж буй</Text>
                    </View>
                  </View>
                  <View className="flex-row items-start gap-2">
                    <MessageSquare size={14} color="#AEAEB2" style={{ marginTop: 2 }} />
                    <Text className="text-sm text-[#8E8E93] flex-1">{req.purpose}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Responded Requests */}
          {respondedRequests.length > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(100)}>
              <Text className="text-sm font-bold text-[#AEAEB2] mb-3 mt-2">Хариу ирсэн хүсэлтүүд</Text>
              {respondedRequests.slice(0, 5).map(req => (
                <View
                  key={req.id}
                  className={`rounded-3xl p-4 mb-3 border ${
                    req.status === 'approved'
                      ? 'bg-[#34C759]/5 border-[#34C759]/20'
                      : 'bg-[#FF3B30]/5 border-[#FF3B30]/20'
                  }`}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-black text-[#1a1a2e]">₮{req.amount.toLocaleString()}</Text>
                    <View
                      className={`px-3 py-1.5 rounded-full flex-row items-center gap-1 ${
                        req.status === 'approved' ? 'bg-[#34C759]/10' : 'bg-[#FF3B30]/10'
                      }`}
                    >
                      {req.status === 'approved' ? (
                        <>
                          <CheckCircle2 size={12} color="#34C759" />
                          <Text className="text-xs font-bold text-[#34C759]">Зөвшөөрсөн</Text>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} color="#FF3B30" />
                          <Text className="text-xs font-bold text-[#FF3B30]">Татгалзсан</Text>
                        </>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-start gap-2">
                    <MessageSquare size={14} color="#AEAEB2" style={{ marginTop: 2 }} />
                    <Text className="text-sm text-[#8E8E93] flex-1">{req.purpose}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Active Loans */}
          {activeLoans.length > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(150)}>
              <Text className="text-sm font-bold text-[#FF9500] mb-3 mt-2">Идэвхтэй зээлүүд</Text>
              {activeLoans.map(loan => (
                <LoanCard key={loan.id} loan={loan} showRepay onRepay={() => handleRepay(loan.id, loan.totalDue, loan.paidAmount)} />
              ))}
            </Animated.View>
          )}

          {/* Paid Loans */}
          {paidLoans.length > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
              <View className="flex-row items-center gap-2 mb-3 mt-4">
                <CheckCircle size={14} color="#34C759" />
                <Text className="text-sm font-bold text-[#34C759]">Төлөгдсөн</Text>
              </View>
              {paidLoans.map(loan => <LoanCard key={loan.id} loan={loan} />)}
            </Animated.View>
          )}

          {/* Empty State */}
          {child.loans.length === 0 && child.loanRequests.length === 0 && (
            <EmptyState title="Зээл байхгүй" message="Зээл хүсэхийн тулд + товч дарна уу." />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
