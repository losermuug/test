import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  PiggyBank, Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  Target, Sparkles, Shield, X,
} from 'lucide-react-native';

export default function ChildSavings() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'add' | 'withdraw'>('add');
  const [amount, setAmount] = useState('');

  if (!child) return null;

  const savingsGoal = 50000; // Default goal
  const progress = savingsGoal > 0 ? Math.min((child.savings / savingsGoal) * 100, 100) : 0;

  const handleAction = () => {
    const num = parseInt(amount);
    if (!num || num <= 0) { Alert.alert('Алдаа', 'Зөв дүн оруулна уу'); return; }

    if (formType === 'add') {
      if (num > child.balance) {
        Alert.alert('Алдаа', `Хэтэвчинд хүрэлцэхгүй байна.\nХэтэвч: ₮${child.balance.toLocaleString()}`);
        return;
      }
      dispatch({ type: 'ADD_TO_SAVINGS', childId: child.id, amount: num });
      Alert.alert('Амжилттай! 🎉', `₮${num.toLocaleString()} хадгаламж руу нэмэгдлээ!`);
    } else {
      if (num > child.savings) {
        Alert.alert('Алдаа', `Хадгаламжинд хүрэлцэхгүй байна.\nХадгаламж: ₮${child.savings.toLocaleString()}`);
        return;
      }
      dispatch({ type: 'WITHDRAW_FROM_SAVINGS', childId: child.id, amount: num });
      Alert.alert('Амжилттай', `₮${num.toLocaleString()} хэтэвч рүү шилжлээ.`);
    }
    setAmount('');
    setShowForm(false);
  };

  const openForm = (type: 'add' | 'withdraw') => {
    setFormType(type);
    setShowForm(true);
    setAmount('');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-black text-[#1a1a2e]">Миний хадгаламж</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Wallet size={14} color="#AEAEB2" />
            <Text className="text-sm text-[#AEAEB2]">Хэтэвч: ₮{child.balance.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Savings Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} className="px-6 mt-3">
          <View className="bg-[#4ECDC4] rounded-3xl p-6 shadow-lg overflow-hidden relative">
            <View className="absolute w-40 h-40 rounded-full bg-white/5 -top-10 -right-10" />
            <View className="absolute w-24 h-24 rounded-full bg-white/5 bottom-0 left-4" />
            <View className="flex-row items-center gap-2 mb-1">
              <PiggyBank size={20} color="#fff" />
              <Text className="text-sm font-semibold text-white/70">Нийт хадгаламж</Text>
            </View>
            <Text className="text-4xl font-black text-white mb-4">₮{child.savings.toLocaleString()}</Text>

            {/* Progress toward goal */}
            <View className="bg-white/10 rounded-2xl p-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-2">
                  <Target size={14} color="#fff" />
                  <Text className="text-xs font-semibold text-white/70">Зорилго: ₮{savingsGoal.toLocaleString()}</Text>
                </View>
                <Text className="text-xs font-bold text-white">{Math.round(progress)}%</Text>
              </View>
              <View className="h-3 bg-white/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} className="px-6 mt-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-[#4ECDC4] rounded-2xl py-4 flex-row items-center justify-center gap-2"
              onPress={() => openForm('add')}
              activeOpacity={0.7}
            >
              <ArrowDownToLine size={18} color="#fff" />
              <Text className="text-white font-bold text-sm">Хадгаламж нэмэх</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#FF9500] rounded-2xl py-4 flex-row items-center justify-center gap-2"
              onPress={() => openForm('withdraw')}
              activeOpacity={0.7}
            >
              <ArrowUpFromLine size={18} color="#fff" />
              <Text className="text-white font-bold text-sm">Буцаах</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Form */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="mx-6 mt-4 bg-white rounded-3xl p-5 shadow-sm border border-[#4ECDC4]/15">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-[#1a1a2e]">
                {formType === 'add' ? '💰 Хадгаламж нэмэх' : '💸 Хэтэвч рүү буцаах'}
              </Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={22} color="#AEAEB2" />
              </TouchableOpacity>
            </View>

            {formType === 'add' && (
              <View className="bg-[#F8F8FC] rounded-2xl p-3 mb-3 flex-row items-center gap-2 border border-[#F2F2F7]">
                <Wallet size={16} color="#34C759" />
                <Text className="text-sm text-[#8E8E93]">Хэтэвчээс: ₮{child.balance.toLocaleString()}</Text>
              </View>
            )}
            {formType === 'withdraw' && (
              <View className="bg-[#F8F8FC] rounded-2xl p-3 mb-3 flex-row items-center gap-2 border border-[#F2F2F7]">
                <PiggyBank size={16} color="#4ECDC4" />
                <Text className="text-sm text-[#8E8E93]">Хадгаламж: ₮{child.savings.toLocaleString()}</Text>
              </View>
            )}

            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Дүн (₮)</Text>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-lg text-[#1a1a2e] mb-3 border border-[#F2F2F7] font-bold text-center"
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#C7C7CC"
              autoFocus
            />

            <View className="flex-row gap-2 mb-4">
              {['500', '1000', '3000', '5000'].map(val => (
                <TouchableOpacity
                  key={val}
                  className={`flex-1 py-2.5 rounded-2xl items-center ${amount === val ? 'bg-[#4ECDC4]' : 'bg-[#4ECDC4]/10'}`}
                  onPress={() => setAmount(val)}
                >
                  <Text className={`text-xs font-bold ${amount === val ? 'text-white' : 'text-[#4ECDC4]'}`}>
                    ₮{parseInt(val).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className={`rounded-2xl py-4 items-center ${formType === 'add' ? 'bg-[#4ECDC4]' : 'bg-[#FF9500]'}`}
              onPress={handleAction}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">
                {formType === 'add' ? 'Хадгаламж нэмэх' : 'Хэтэвч рүү буцаах'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Tips */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} className="px-6 mt-6">
          <Text className="text-base font-bold text-[#1a1a2e] mb-3">Хадгаламжийн зөвлөгөө</Text>

          <View className="bg-white rounded-3xl p-4 mb-3 flex-row items-start gap-3 border border-[#F2F2F7] shadow-sm">
            <View className="w-10 h-10 rounded-2xl bg-[#4ECDC4]/10 justify-center items-center">
              <TrendingUp size={20} color="#4ECDC4" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#1a1a2e] mb-1">Бага багаар хуримтлуул</Text>
              <Text className="text-xs text-[#AEAEB2]">Өдөр бүр бага дүн хадгалах нь том дүнгээс илүү үр дүнтэй!</Text>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-4 mb-3 flex-row items-start gap-3 border border-[#F2F2F7] shadow-sm">
            <View className="w-10 h-10 rounded-2xl bg-[#6C63FF]/10 justify-center items-center">
              <Target size={20} color="#6C63FF" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#1a1a2e] mb-1">Зорилго тавь</Text>
              <Text className="text-xs text-[#AEAEB2]">Тодорхой зорилготой бол хадгалах хүсэл тэсвэр нэмэгддэг!</Text>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-4 mb-3 flex-row items-start gap-3 border border-[#F2F2F7] shadow-sm">
            <View className="w-10 h-10 rounded-2xl bg-[#FF9500]/10 justify-center items-center">
              <Shield size={20} color="#FF9500" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#1a1a2e] mb-1">Шаардлагагүй зардлаас зайлсхий</Text>
              <Text className="text-xs text-[#AEAEB2]">Худалдан авахын өмнө "Надад үнэхээр хэрэгтэй юу?" гэж бод!</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
