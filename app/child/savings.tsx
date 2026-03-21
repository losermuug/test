import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import JuniorBackground from '@/components/app/JuniorBackground';
import MoneyVisualizer from '@/components/app/MoneyVisualizer';
import {
  PiggyBank, Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  Target, Sparkles, Shield, X, Star, Heart, Calculator,
  BadgeCheck, ReceiptText, Lightbulb,
} from 'lucide-react-native';

export default function ChildSavings() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'add' | 'withdraw'>('add');
  const [amount, setAmount] = useState('');

  if (!child) return null;

  const ageGroup = getAgeGroup(child.age);
  const isJunior = ageGroup === 'junior';
  const isSenior = ageGroup === 'senior';

  const savingsGoal = isJunior ? 10000 : isSenior ? 100000 : 50000;
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
      Alert.alert(isJunior ? 'Баяр хүргэе! 🎉' : 'Амжилттай!', `₮${num.toLocaleString()} хадгаламж руу нэмэгдлээ!`);
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

  // Shared form component
  const renderForm = (accentColor: string, bgColor: string, borderColor: string) => {
    if (!showForm) return null;
    const presets = isJunior ? ['100', '500', '1000', '2000'] : isSenior ? ['1000', '5000', '10000', '20000'] : ['500', '1000', '3000', '5000'];
    return (
      <Animated.View entering={FadeInDown.duration(400)} style={{ marginHorizontal: 24, marginTop: 16, backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a2e' }}>
            {formType === 'add' ? (isJunior ? '🐷 Хадгаламж нэмэх' : 'Хадгаламж нэмэх') : (isJunior ? '💸 Буцаах' : 'Хэтэвч рүү буцаах')}
          </Text>
          <TouchableOpacity onPress={() => setShowForm(false)}>
            <X size={22} color="#AEAEB2" />
          </TouchableOpacity>
        </View>

        {formType === 'add' && !isJunior && (
          <View style={{ backgroundColor: bgColor, borderRadius: 16, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Wallet size={16} color="#34C759" />
            <Text style={{ fontSize: 13, color: '#8E8E93' }}>Хэтэвчээс: ₮{child.balance.toLocaleString()}</Text>
          </View>
        )}
        {formType === 'withdraw' && (
          <View style={{ backgroundColor: bgColor, borderRadius: 16, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <PiggyBank size={16} color={accentColor} />
            <Text style={{ fontSize: 13, color: '#8E8E93' }}>Хадгаламж: ₮{child.savings.toLocaleString()}</Text>
          </View>
        )}

        <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 8 }}>Дүн (₮)</Text>
        <TextInput
          style={{ backgroundColor: bgColor, borderRadius: 16, padding: 16, fontSize: 18, color: '#1a1a2e', marginBottom: 12, fontWeight: '800', textAlign: 'center' }}
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor="#C7C7CC"
          autoFocus
        />

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {presets.map(val => (
            <TouchableOpacity
              key={val}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 16, alignItems: 'center', backgroundColor: amount === val ? accentColor : `${accentColor}15` }}
              onPress={() => setAmount(val)}
            >
              <Text style={{ fontSize: 11, fontWeight: '800', color: amount === val ? '#fff' : accentColor }}>
                ₮{parseInt(val).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: formType === 'add' ? accentColor : '#0A7EA4', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
          onPress={handleAction}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>
            {formType === 'add' ? 'Хадгаламж нэмэх' : 'Хэтэвч рүү буцаах'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // JUNIOR (6-9) — Cute pastel PiggyBank world
  // ═══════════════════════════════════════════════════════════
  if (isJunior) {
    const starCount = Math.min(Math.floor(child.savings / 2000), 5);
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#FDF4FF' }}>
        <JuniorBackground />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(500)} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#1a1a2e' }}>Миний хагас банк 🐷</Text>
          </Animated.View>

          {/* Big PiggyBank Card */}
          <Animated.View entering={ZoomIn.duration(600).delay(100)} style={{ paddingHorizontal: 24, marginTop: 12 }}>
            <View style={{
              backgroundColor: '#F9A8D4', borderRadius: 32, padding: 28, alignItems: 'center',
              shadowColor: '#EC4899', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
              overflow: 'hidden',
            }}>
              <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)', top: -30, right: -20 }} />
              <View style={{ position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.08)', bottom: -20, left: 10 }} />

              <View style={{ width: 80, height: 80, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <PiggyBank size={42} color="#fff" />
              </View>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '800', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Миний хадгаламж</Text>
              <View style={{ marginBottom: 8, minHeight: 48, justifyContent: 'center' }}>
                <MoneyVisualizer amount={child.savings} size={42} textColor="#fff" />
              </View>

              {/* Star progress */}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Animated.View key={i} entering={ZoomIn.duration(300).delay(200 + i * 80)}>
                    <View style={{
                      width: 36, height: 36, borderRadius: 12,
                      backgroundColor: i <= starCount ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      <Star size={20} color={i <= starCount ? '#C084FC' : 'rgba(255,255,255,0.3)'} fill={i <= starCount ? '#C084FC' : 'none'} />
                    </View>
                  </Animated.View>
                ))}
              </View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '700', marginTop: 8 }}>
                {starCount < 5 ? `₮${((starCount + 1) * 2000).toLocaleString()} хүрвэл дараагийн од!` : 'Бүх одыг цуглуулсан!'}
              </Text>

              {/* Progress bar */}
              <View style={{ width: '100%', marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Зорилго: {savingsGoal / 1000} зоос</Text>
                  <Text style={{ fontSize: 11, color: '#fff', fontWeight: '800' }}>{Math.round(progress)}%</Text>
                </View>
                <View style={{ height: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, overflow: 'hidden' }}>
                  <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#fff', borderRadius: 6 }} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Big cute action buttons */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ flexDirection: 'row', gap: 12, marginHorizontal: 24, marginTop: 16 }}>
            <TouchableOpacity
              style={{
                flex: 1, backgroundColor: '#4ADE80', borderRadius: 24, paddingVertical: 20,
                alignItems: 'center', gap: 6,
                shadowColor: '#16A34A', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
              }}
              onPress={() => openForm('add')} activeOpacity={0.82}>
              <ArrowDownToLine size={22} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff' }}>Хадгалах</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1, backgroundColor: '#FB923C', borderRadius: 24, paddingVertical: 20,
                alignItems: 'center', gap: 6,
                shadowColor: '#EA580C', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
              }}
              onPress={() => openForm('withdraw')} activeOpacity={0.82}>
              <ArrowUpFromLine size={22} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff' }}>Буцаах</Text>
            </TouchableOpacity>
          </Animated.View>

          {renderForm('#EC4899', '#FDF2F8', '#F9A8D440')}

          {/* Fun Tips */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)} style={{ paddingHorizontal: 24, marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1a1a2e', marginBottom: 14 }}>Хадгаламжийн нууц 🌟</Text>

            {[
              { emoji: '🐷', title: 'Хагас банк дүүргэ!', desc: 'Өдөр бүр бага бага хадгалаарай!', bg: '#FCE7F3', border: '#F9A8D4' },
              { emoji: '🎯', title: 'Зорилго тавь!', desc: 'Юу авахыг хүсэж байна? Тэрүүгээ зурж тавь!', bg: '#EDE9FE', border: '#C4B5FD' },
              { emoji: '💪', title: 'Тэвчээртэй бай!', desc: 'Чихэр авахын оронд хадгалаад том зүйл ав!', bg: '#D1FAE5', border: '#6EE7B7' },
            ].map((tip, i) => (
              <Animated.View key={tip.title} entering={FadeInDown.duration(400).delay(350 + i * 80)}>
                <View style={{
                  backgroundColor: tip.bg, borderRadius: 20, padding: 16, marginBottom: 10,
                  flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2, borderColor: tip.border,
                }}>
                  <Text style={{ fontSize: 28 }}>{tip.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1a1a2e' }}>{tip.title}</Text>
                    <Text style={{ fontSize: 12, color: '#8E8E93', fontWeight: '600', marginTop: 2 }}>{tip.desc}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SENIOR (15-18) — Light fintech with interest calculator
  // ═══════════════════════════════════════════════════════════
  if (isSenior) {
    const interestRate = 0.05;
    const monthlyInterest = Math.round(child.savings * interestRate / 12);
    const yearlyInterest = Math.round(child.savings * interestRate);

    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#F4F4F9' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(500)} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
            <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase' }}>Хадгаламжийн данс</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#1a1a2e', marginTop: 4 }}>Хадгаламж</Text>
          </Animated.View>

          {/* Main Balance Card */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={{ marginHorizontal: 24, marginTop: 8 }}>
            <View style={{
              backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24,
              borderWidth: 1, borderColor: '#E5E7EB',
              shadowColor: '#0A7EA4', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
            }}>
              <View style={{ position: 'absolute', top: 20, right: 20, width: 8, height: 8, borderRadius: 4, backgroundColor: '#0A7EA4' }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: '#0A7EA418', justifyContent: 'center', alignItems: 'center' }}>
                  <PiggyBank size={17} color="#0A7EA4" />
                </View>
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>Нийт хадгаламж</Text>
              </View>
              <Text style={{ fontSize: 40, fontWeight: '900', color: '#1a1a2e', letterSpacing: -1 }}>
                ₮{child.savings.toLocaleString()}
              </Text>

              {/* Progress */}
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600' }}>Зорилго: ₮{savingsGoal.toLocaleString()}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#0A7EA4' }}>{Math.round(progress)}%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#0A7EA4', borderRadius: 4 }} />
                </View>
              </View>

              {/* Stats row */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                  <Text style={{ fontSize: 8, color: '#6B7280', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Сарын хүү</Text>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#0A7EA4', marginTop: 4 }}>₮{monthlyInterest.toLocaleString()}</Text>
                  <Text style={{ fontSize: 9, color: '#6B7280', fontWeight: '600', marginTop: 2 }}>5% жилийн хүү</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                  <Text style={{ fontSize: 8, color: '#6B7280', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Жилийн хүү</Text>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#0A84FF', marginTop: 4 }}>₮{yearlyInterest.toLocaleString()}</Text>
                  <Text style={{ fontSize: 9, color: '#6B7280', fontWeight: '600', marginTop: 2 }}>Таамаг тооцоо</Text>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#0A7EA4', borderRadius: 18, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => openForm('add')} activeOpacity={0.85}>
                <ArrowDownToLine size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Хадгалах</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB' }}
                onPress={() => openForm('withdraw')} activeOpacity={0.85}>
                <ArrowUpFromLine size={16} color="#4B5563" />
                <Text style={{ color: '#4B5563', fontWeight: '800', fontSize: 14 }}>Буцаах</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {renderForm('#0A7EA4', '#F9FAFB', '#0A7EA425')}

          {/* Interest Calculator Info */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ marginHorizontal: 24, marginTop: 20 }}>
            <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 12 }}>Хадгаламжийн тооцоолол</Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' }}>
              {[
                { label: '6 сарын дараа', value: `₮${Math.round(child.savings * (1 + interestRate / 2)).toLocaleString()}`, color: '#0A7EA4' },
                { label: '1 жилийн дараа', value: `₮${Math.round(child.savings * (1 + interestRate)).toLocaleString()}`, color: '#0A84FF' },
                { label: '3 жилийн дараа', value: `₮${Math.round(child.savings * Math.pow(1 + interestRate, 3)).toLocaleString()}`, color: '#0A7EA4' },
              ].map((item, i) => (
                <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                  <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: item.color }}>{item.value}</Text>
                </View>
              ))}

              <View style={{ backgroundColor: '#0A84FF0D', borderRadius: 16, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#0A84FF20', flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#0A84FF25', justifyContent: 'center', alignItems: 'center' }}>
                  <Lightbulb size={16} color="#0A84FF" />
                </View>
                <Text style={{ flex: 1, fontSize: 12, color: '#4B5563', lineHeight: 18, fontWeight: '500' }}>
                  Нийлмэл хүүгийн ачаар хадгаламж урт хугацаанд хурдан өсдөг. Эрт эхэлсэн тусам илүү!
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Wallet info */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={{ marginHorizontal: 24, marginTop: 16 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFB80018', justifyContent: 'center', alignItems: 'center' }}>
                <Wallet size={18} color="#FFB800" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1 }}>ХЭТЭВЧ</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a1a2e', marginTop: 2 }}>₮{child.balance.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TEEN (10-14) — Bold goal tracker with vibrant colors
  // ═══════════════════════════════════════════════════════════
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#F0F0FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#1a1a2e' }}>Миний хадгаламж</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Wallet size={14} color="#AEAEB2" />
            <Text style={{ fontSize: 13, color: '#AEAEB2', fontWeight: '600' }}>Хэтэвч: ₮{child.balance.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Savings Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={{ paddingHorizontal: 24, marginTop: 8 }}>
          <View style={{
            backgroundColor: '#0A7EA4', borderRadius: 28, padding: 24,
            shadowColor: '#0A7EA4', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
            overflow: 'hidden',
          }}>
            <View style={{ position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)', top: -40, right: -20 }} />
            <View style={{ position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -10, left: 10 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <PiggyBank size={20} color="#fff" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>Нийт хадгаламж</Text>
            </View>
            <Text style={{ fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 16 }}>
              ₮{child.savings.toLocaleString()}
            </Text>

            {/* Goal tracker */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18, padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Target size={14} color="#fff" />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>Зорилго: ₮{savingsGoal.toLocaleString()}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>{Math.round(progress)}%</Text>
              </View>
              <View style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden' }}>
                <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#fff', borderRadius: 5 }} />
              </View>
              {progress < 100 && (
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 8 }}>
                  Үлдсэн: ₮{Math.max(0, savingsGoal - child.savings).toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={{ flexDirection: 'row', gap: 12, marginHorizontal: 24, marginTop: 14 }}>
          <TouchableOpacity
            style={{
              flex: 1, backgroundColor: '#34C759', borderRadius: 20, paddingVertical: 16,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              shadowColor: '#34C759', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
            }}
            onPress={() => openForm('add')} activeOpacity={0.82}>
            <ArrowDownToLine size={17} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Хадгалах</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1, backgroundColor: '#0A7EA4', borderRadius: 20, paddingVertical: 16,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              shadowColor: '#0A7EA4', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
            }}
            onPress={() => openForm('withdraw')} activeOpacity={0.82}>
            <ArrowUpFromLine size={17} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Буцаах</Text>
          </TouchableOpacity>
        </Animated.View>

        {renderForm('#0A7EA4', '#F0F0FB', '#0A7EA425')}

        {/* Tips */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '900', color: '#1a1a2e', marginBottom: 14 }}>Хадгаламжийн зөвлөгөө</Text>

          {[
            { icon: TrendingUp, color: '#0A7EA4', bg: '#0A7EA415', title: 'Бага багаар хуримтлуул', desc: 'Өдөр бүр бага дүн хадгалах нь том дүнгээс илүү үр дүнтэй!' },
            { icon: Target, color: '#0A7EA4', bg: '#0A7EA415', title: 'Зорилго тавь', desc: 'Тодорхой зорилготой бол хадгалах хүсэл тэсвэр нэмэгддэг!' },
            { icon: Shield, color: '#0A7EA4', bg: '#0A7EA415', title: 'Шаардлагагүй зардлаас зайлсхий', desc: 'Худалдан авахын өмнө "Надад үнэхээр хэрэгтэй юу?" гэж бод!' },
          ].map(tip => (
            <View key={tip.title} style={{
              backgroundColor: '#fff', borderRadius: 22, padding: 16, marginBottom: 10,
              flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderColor: '#EBEBF5',
            }}>
              <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: tip.bg, justifyContent: 'center', alignItems: 'center' }}>
                <tip.icon size={20} color={tip.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a1a2e', marginBottom: 2 }}>{tip.title}</Text>
                <Text style={{ fontSize: 12, color: '#AEAEB2', fontWeight: '500' }}>{tip.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
