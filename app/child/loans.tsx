import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import { juniorLoanLessons, seniorLoanTopics } from '@/constants/ageGroupData';
import LoanCard from '@/components/app/LoanCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Wallet, CheckCircle, Plus, X, Send, FileText,
  Clock, XCircle, CheckCircle2, MessageSquare,
  Target, ArrowLeft, BookOpen, Trophy, Star,
  Calculator, TrendingUp, CalendarDays, Info,
  Sparkles, ShieldCheck, BadgeDollarSign, Zap, HelpCircle,
} from 'lucide-react-native';

const ICON_MAP: Record<string, any> = {
  Target,
  CheckCircle,
  TrendingUp,
  BookOpen,
  BadgeDollarSign,
  Zap,
  Info,
  HelpCircle,
  Star,
  Calculator,
  ShieldCheck,
  FileText,
  Trophy,
  Sparkles,
};

export default function ChildLoans() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [showForm, setShowForm] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  // Junior lesson state
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Senior topic state
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  // Senior loan duration
  const [loanDuration, setLoanDuration] = useState<number>(14);

  if (!child) return null;

  const ageGroup = getAgeGroup(child.age);
  const isJunior = ageGroup === 'junior';
  const isSenior = ageGroup === 'senior';

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

  const handleCompleteLoanLesson = (badgeId: string) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: badgeId });
    Alert.alert('Badge авлаа!', 'Чи маш сайн суралцлаа! Шинэ badge нээгдлээ!');
    setActiveLessonId(null);
  };

  // ═══════════════════════════════════════════════
  // JUNIOR (6-9) — Educational loan lessons only
  // ═══════════════════════════════════════════════
  if (isJunior) {
    const activeLesson = juniorLoanLessons.find(l => l.id === activeLessonId);

    if (activeLesson) {
      const isCompleted = child.achievements.some(a => a.id === activeLesson.badgeId);
      return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF5F5' }}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-[#E0F2FE] justify-center items-center"
                onPress={() => setActiveLessonId(null)}
              >
                <ArrowLeft size={18} color="#0A7EA4" />
              </TouchableOpacity>
              <Text className="text-xl font-black text-[#1a1a2e]">{activeLesson.title}</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mt-4">
              <View className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#E0F2FE]">
                <View className="w-20 h-20 rounded-full bg-[#0A7EA4]/10 justify-center items-center self-center mb-4">
                  {React.createElement(ICON_MAP[activeLesson.icon] || BookOpen, { size: 36, color: '#0A7EA4' })}
                </View>
                <Text className="text-base text-[#3C3C43] leading-7 text-center">{activeLesson.content}</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(200)} className="px-6 mt-6">
              {isCompleted ? (
                <View className="bg-[#0A7EA4]/10 rounded-2xl p-4 items-center border border-[#0A7EA4]/30">
                  <Trophy size={28} color="#0A7EA4" />
                  <Text className="text-base font-black text-[#0A7EA4] mt-2">Badge аль хэдийн авсан!</Text>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-[#0A7EA4] rounded-2xl py-4 items-center flex-row justify-center gap-2"
                  onPress={() => handleCompleteLoanLesson(activeLesson.badgeId)}
                  activeOpacity={0.7}
                >
                  <Trophy size={20} color="#fff" />
                  <Text className="text-white text-lg font-black">Badge авах!</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF5F5' }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2">
            <Text className="text-2xl font-black text-[#1a1a2e]">Зээлийн тухай суралцая!</Text>
            <Text className="text-sm text-[#0A7EA4] font-bold mt-1">
              Хичээл дуусгаад Badge цуглуулаарай!
            </Text>
          </Animated.View>

          {/* Fun info banner */}
          <Animated.View entering={FadeInDown.duration(500).delay(50)} className="px-6 mt-3">
            <View className="bg-[#0A7EA4]/15 rounded-3xl p-5 border-2 border-[#0A7EA4]/30">
              <Text className="text-sm font-bold text-[#0A7EA4] text-center">
                Мэдсэн үү? Зээл гэдэг нь хэн нэгнээс мөнгө зээлж аваад буцааж өгөх амлалт юм!
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mt-5">
            {juniorLoanLessons.map((lesson, i) => {
              const isCompleted = child.achievements.some(a => a.id === lesson.badgeId);
              return (
                <Animated.View key={lesson.id} entering={FadeInDown.duration(400).delay(i * 100)}>
                  <TouchableOpacity
                    className="bg-white rounded-3xl p-5 mb-4 shadow-sm border-2"
                    style={{ borderColor: isCompleted ? '#0A7EA4' : '#E0F2FE' }}
                    onPress={() => setActiveLessonId(lesson.id)}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-14 h-14 rounded-full justify-center items-center"
                        style={{ backgroundColor: isCompleted ? '#0A7EA4' + '20' : '#0A7EA4' + '15' }}
                      >
                        {React.createElement(ICON_MAP[lesson.icon] || BookOpen, { size: 28, color: '#0A7EA4' })}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-black text-[#1a1a2e]">{lesson.title}</Text>
                        <Text className="text-xs text-[#8E8E93] mt-0.5">{lesson.description}</Text>
                      </View>
                      {isCompleted ? (
                        <View className="bg-[#0A7EA4] rounded-full w-8 h-8 items-center justify-center">
                          <CheckCircle size={18} color="#fff" />
                        </View>
                      ) : (
                        <View className="bg-[#0A7EA4]/10 rounded-full px-3 py-1.5">
                          <Text className="text-xs font-bold text-[#0A7EA4]">Суралц →</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Progress */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)} className="px-6 mt-2">
            <View className="bg-white rounded-3xl p-5 border-2 border-[#0A7EA4]/30">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-bold text-[#1a1a2e]">Явц</Text>
                <Text className="text-sm font-black text-[#0A7EA4]">
                  {juniorLoanLessons.filter(l => child.achievements.some(a => a.id === l.badgeId)).length}/{juniorLoanLessons.length}
                </Text>
              </View>
              <View className="h-3 bg-[#F2F2F7] rounded-full overflow-hidden">
                <View
                  className="h-full bg-[#0A7EA4] rounded-full"
                  style={{
                    width: `${(juniorLoanLessons.filter(l => child.achievements.some(a => a.id === l.badgeId)).length / juniorLoanLessons.length) * 100}%`
                  }}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════
  // SENIOR (15-18) — Full loans + deep education
  // ═══════════════════════════════════════════════
  if (isSenior) {
    const activeTopic = seniorLoanTopics.find(t => t.id === activeTopicId);

    if (activeTopic) {
      return (
        <SafeAreaView className="flex-1 bg-[#F0F0F8]">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
              <TouchableOpacity
                className="w-10 h-10 rounded-2xl bg-[#E0E0EA] justify-center items-center"
                onPress={() => setActiveTopicId(null)}
              >
                <ArrowLeft size={18} color="#1a1a2e" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-[#1a1a2e]">{activeTopic.title}</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mt-4">
              <View className="bg-white rounded-3xl p-6 shadow-sm border border-[#E0E0EA]">
                <Text className="text-base text-[#3C3C43] leading-7">{activeTopic.content}</Text>
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-[#F0F0F8]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2 flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-black text-[#1a1a2e]">Зээлийн удирдлага</Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Wallet size={14} color="#8E8E93" />
                <Text className="text-sm text-[#8E8E93]">Хэтэвч: ₮{child.balance.toLocaleString()}</Text>
              </View>
            </View>
            <TouchableOpacity
              className={`w-12 h-12 rounded-2xl justify-center items-center ${showForm ? 'bg-[#FF3B30]' : 'bg-[#0A7EA4]'}`}
              onPress={() => setShowForm(!showForm)}
              activeOpacity={0.7}
            >
              {showForm ? <X size={22} color="#fff" /> : <Plus size={22} color="#fff" />}
            </TouchableOpacity>
          </Animated.View>

          {/* Deep Learning Section */}
          <Animated.View entering={FadeInDown.duration(500).delay(50)} className="px-6 mt-3 mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <BookOpen size={16} color="#0A7EA4" />
              <Text className="text-sm font-bold text-[#0A7EA4]">Гүнзгий суралцах</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {seniorLoanTopics.map((topic, i) => (
                <TouchableOpacity
                  key={topic.id}
                  className="bg-white rounded-2xl p-4 mr-3 w-44 border border-[#E0E0EA] shadow-sm"
                  onPress={() => setActiveTopicId(topic.id)}
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 rounded-xl bg-[#0A7EA4]/10 justify-center items-center mb-2">
                    {React.createElement(ICON_MAP[topic.icon] || BookOpen, { size: 18, color: '#0A7EA4' })}
                  </View>
                  <Text className="text-sm font-bold text-[#1a1a2e] mb-1">{topic.title}</Text>
                  <Text className="text-xs text-[#8E8E93]" numberOfLines={2}>{topic.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Loan Request Form */}
          {showForm && (
            <Animated.View entering={FadeInDown.duration(400)} className="mx-6 bg-white rounded-3xl p-5 mb-4 shadow-sm border border-[#0A7EA4]/20">
              <View className="flex-row items-center gap-2 mb-4">
                <Send size={18} color="#0A7EA4" />
                <Text className="text-lg font-bold text-[#1a1a2e]">Зээл хүсэх</Text>
              </View>

              <View className="flex-row items-center gap-2 mb-2">
                <Wallet size={14} color="#8E8E93" />
                <Text className="text-sm font-semibold text-[#8E8E93]">Хүсэж буй дүн (₮)</Text>
              </View>
              <TextInput
                className="bg-[#F0F0F8] rounded-2xl p-4 text-base text-[#1a1a2e] mb-3 border border-[#E0E0EA]"
                value={requestAmount}
                onChangeText={setRequestAmount}
                keyboardType="number-pad"
                placeholder="5000"
                placeholderTextColor="#C7C7CC"
              />

              <View className="flex-row gap-2 mb-3">
                {['1000', '5000', '10000', '20000'].map(val => (
                  <TouchableOpacity
                    key={val}
                    className={`flex-1 py-2.5 rounded-2xl items-center ${requestAmount === val ? 'bg-[#0A7EA4]' : 'bg-[#F0F0F8]'}`}
                    onPress={() => setRequestAmount(val)}
                  >
                    <Text className={`text-xs font-bold ${requestAmount === val ? 'text-white' : 'text-[#8E8E93]'}`}>
                      ₮{parseInt(val).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Loan Duration Selector */}
              <View className="flex-row items-center gap-2 mb-2">
                <CalendarDays size={14} color="#8E8E93" />
                <Text className="text-sm font-semibold text-[#8E8E93]">Зээлийн хугацаа</Text>
              </View>
              <View className="flex-row gap-2 mb-3">
                {[{ days: 7, label: '7 хоног' }, { days: 14, label: '14 хоног' }, { days: 30, label: '30 хоног' }].map(opt => (
                  <TouchableOpacity
                    key={opt.days}
                    className={`flex-1 py-3 rounded-2xl items-center ${loanDuration === opt.days ? 'bg-[#0A7EA4]' : 'bg-[#F0F0F8]'}`}
                    onPress={() => setLoanDuration(opt.days)}
                  >
                    <Text className={`text-xs font-bold ${loanDuration === opt.days ? 'text-white' : 'text-[#8E8E93]'}`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Interest & Payment Schedule Preview */}
              {requestAmount && parseInt(requestAmount) > 0 && (
                <View className="bg-[#0A7EA4]/5 rounded-2xl p-4 mb-3 border border-[#0A7EA4]/10">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Calculator size={14} color="#0A7EA4" />
                    <Text className="text-sm font-bold text-[#0A7EA4]">Төлбөрийн тооцоолол</Text>
                  </View>
                  <View className="bg-white rounded-xl p-3 gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-[#8E8E93]">Үндсэн дүн</Text>
                      <Text className="text-xs font-bold text-[#1a1a2e]">₮{parseInt(requestAmount).toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-[#8E8E93]">Хүү (10%)</Text>
                      <Text className="text-xs font-bold text-[#0A7EA4]">₮{Math.round(parseInt(requestAmount) * 0.1).toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-[#8E8E93]">Хугацаа</Text>
                      <Text className="text-xs font-bold text-[#1a1a2e]">{loanDuration} хоног</Text>
                    </View>
                    <View className="h-px bg-[#E0E0EA] my-1" />
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-bold text-[#1a1a2e]">Нийт төлөх</Text>
                      <Text className="text-sm font-black text-[#0A7EA4]">₮{Math.round(parseInt(requestAmount) * 1.1).toLocaleString()}</Text>
                    </View>
                    {loanDuration >= 14 && (
                      <View className="bg-[#0A7EA4]/5 rounded-lg p-2 mt-1">
                        <View className="flex-row items-center gap-1 mb-1">
                          <CalendarDays size={10} color="#0A7EA4" />
                          <Text className="text-[10px] font-bold text-[#0A7EA4]">Хуваарьт төлбөр (7 хоног тутам)</Text>
                        </View>
                        <Text className="text-xs text-[#3C3C43]">
                          {Math.ceil(loanDuration / 7)} удаа × ₮{Math.round((parseInt(requestAmount) * 1.1) / Math.ceil(loanDuration / 7)).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              <View className="flex-row items-center gap-2 mb-2">
                <FileText size={14} color="#8E8E93" />
                <Text className="text-sm font-semibold text-[#8E8E93]">Зорилго (заавал бичих)</Text>
              </View>
              <TextInput
                className="bg-[#F0F0F8] rounded-2xl p-4 text-base text-[#1a1a2e] mb-4 border border-[#E0E0EA]"
                value={purpose}
                onChangeText={setPurpose}
                placeholder="Жишээ: Ном худалдаж авах..."
                placeholderTextColor="#C7C7CC"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 80 }}
              />

              <TouchableOpacity
                className="bg-[#0A7EA4] rounded-2xl py-4 items-center flex-row justify-center gap-2"
                onPress={handleRequestLoan}
                activeOpacity={0.7}
              >
                <Send size={18} color="#fff" />
                <Text className="text-white text-base font-bold">Хүсэлт илгээх</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View className="px-6 mt-2">
            {/* Pending + responded requests + active/paid loans — same as below */}
            {pendingRequests.length > 0 && (
              <Animated.View entering={FadeInDown.duration(500).delay(50)}>
                <View className="flex-row items-center gap-2 mb-3">
                  <Clock size={14} color="#0A7EA4" />
                  <Text className="text-sm font-bold text-[#0A7EA4]">Хүлээгдэж буй хүсэлтүүд</Text>
                </View>
                {pendingRequests.map(req => (
                  <View key={req.id} className="bg-[#0A7EA4]/5 rounded-3xl p-4 mb-3 border border-[#0A7EA4]/20">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-lg font-black text-[#1a1a2e]">₮{req.amount.toLocaleString()}</Text>
                      <View className="bg-[#0A7EA4]/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                        <Clock size={12} color="#0A7EA4" />
                        <Text className="text-xs font-bold text-[#0A7EA4]">Хүлээгдэж буй</Text>
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

            {respondedRequests.length > 0 && (
              <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                <Text className="text-sm font-bold text-[#AEAEB2] mb-3 mt-2">Хариу ирсэн хүсэлтүүд</Text>
                {respondedRequests.slice(0, 5).map(req => (
                  <View
                    key={req.id}
                    className={`rounded-3xl p-4 mb-3 border ${
                      req.status === 'approved' ? 'bg-[#34C759]/5 border-[#34C759]/20' : 'bg-[#FF3B30]/5 border-[#FF3B30]/20'
                    }`}
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-lg font-black text-[#1a1a2e]">₮{req.amount.toLocaleString()}</Text>
                      <View className={`px-3 py-1.5 rounded-full flex-row items-center gap-1 ${
                        req.status === 'approved' ? 'bg-[#34C759]/10' : 'bg-[#FF3B30]/10'
                      }`}>
                        {req.status === 'approved' ? (
                          <><CheckCircle2 size={12} color="#34C759" /><Text className="text-xs font-bold text-[#34C759]">Зөвшөөрсөн</Text></>
                        ) : (
                          <><XCircle size={12} color="#FF3B30" /><Text className="text-xs font-bold text-[#FF3B30]">Татгалзсан</Text></>
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

            {activeLoans.length > 0 && (
              <Animated.View entering={FadeInDown.duration(500).delay(150)}>
                <Text className="text-sm font-bold text-[#0A7EA4] mb-3 mt-2">Идэвхтэй зээлүүд</Text>
                {activeLoans.map(loan => (
                  <LoanCard key={loan.id} loan={loan} showRepay onRepay={() => handleRepay(loan.id, loan.totalDue, loan.paidAmount)} />
                ))}
              </Animated.View>
            )}

            {paidLoans.length > 0 && (
              <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                <View className="flex-row items-center gap-2 mb-3 mt-4">
                  <CheckCircle size={14} color="#34C759" />
                  <Text className="text-sm font-bold text-[#34C759]">Төлөгдсөн</Text>
                </View>
                {paidLoans.map(loan => <LoanCard key={loan.id} loan={loan} />)}
              </Animated.View>
            )}

            {child.loans.length === 0 && child.loanRequests.length === 0 && (
              <EmptyState title="Зээл байхгүй" message="Зээл хүсэхийн тулд + товч дарна уу." />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════
  // TEEN (10-14) — Interest-free loans with tasks
  // ═══════════════════════════════════════════════

  const TEEN_LOAN_TASKS = [
    { label: 'Ном авах', amount: '3000', icon: 'BookOpen' },
    { label: 'Хичээлийн хэрэгсэл', amount: '5000', icon: 'FileText' },
    { label: 'Спортын хэрэгсэл', amount: '8000', icon: 'Trophy' },
    { label: 'Бүтээлч төсөл', amount: '10000', icon: 'Sparkles' },
  ];

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
            className={`w-12 h-12 rounded-2xl justify-center items-center ${showForm ? 'bg-[#FF3B30]' : 'bg-[#0A7EA4]'}`}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.7}
          >
            {showForm ? <X size={22} color="#fff" /> : <Plus size={22} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>

        {/* Interest-free info banner */}
        <Animated.View entering={FadeInDown.duration(500).delay(30)} className="px-6 mt-2 mb-3">
          <View className="bg-[#0A7EA4]/10 rounded-2xl p-4 border border-[#0A7EA4]/25 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-[#0A7EA4]/20 justify-center items-center">
              <ShieldCheck size={20} color="#0A7EA4" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#0A7EA4]">Хүүгүй зээл</Text>
              <Text className="text-xs text-[#8E8E93] mt-0.5">Зээлсэн дүнгээ л буцааж төлнө. Нэмэлт хүү байхгүй!</Text>
            </View>
          </View>
        </Animated.View>

        {/* Loan Request Form */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="mx-6 bg-white rounded-3xl p-5 mb-4 shadow-sm border border-[#0A7EA4]/20">
            <View className="flex-row items-center gap-2 mb-4">
              <Send size={18} color="#0A7EA4" />
              <Text className="text-lg font-bold text-[#1a1a2e]">Зээл хүсэх</Text>
            </View>

            {/* Quick task-based loan options */}
            <Text className="text-xs font-bold text-[#8E8E93] mb-2">Зорилгоо сонго:</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {TEEN_LOAN_TASKS.map(task => (
                <TouchableOpacity
                  key={task.label}
                  className={`rounded-2xl px-4 py-3 border ${
                    purpose === task.label && requestAmount === task.amount
                      ? 'bg-[#0A7EA4] border-[#0A7EA4]'
                      : 'bg-[#F8F8FC] border-[#F2F2F7]'
                  }`}
                  onPress={() => { setPurpose(task.label); setRequestAmount(task.amount); }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-2">
                    {React.createElement(ICON_MAP[task.icon] || BookOpen, { 
                      size: 14, 
                      color: purpose === task.label && requestAmount === task.amount ? '#fff' : '#1a1a2e' 
                    })}
                    <Text className={`text-sm font-bold ${
                      purpose === task.label && requestAmount === task.amount ? 'text-white' : 'text-[#1a1a2e]'
                    }`}>
                      {task.label}
                    </Text>
                  </View>
                  <Text className={`text-xs mt-0.5 ${
                    purpose === task.label && requestAmount === task.amount ? 'text-white/70' : 'text-[#8E8E93]'
                  }`}>
                    ₮{parseInt(task.amount).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Wallet size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Дүн (₮)</Text>
            </View>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-3 border border-[#F2F2F7]"
              value={requestAmount}
              onChangeText={setRequestAmount}
              keyboardType="number-pad"
              placeholder="3000"
              placeholderTextColor="#C7C7CC"
            />

            <View className="flex-row gap-2 mb-3">
              {['1000', '3000', '5000', '10000'].map(val => (
                <TouchableOpacity
                  key={val}
                  className={`flex-1 py-2.5 rounded-2xl items-center ${requestAmount === val ? 'bg-[#0A7EA4]' : 'bg-[#F8F8FC]'}`}
                  onPress={() => setRequestAmount(val)}
                >
                  <Text className={`text-xs font-bold ${requestAmount === val ? 'text-white' : 'text-[#8E8E93]'}`}>
                    ₮{parseInt(val).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 0% interest confirmation */}
            {requestAmount && parseInt(requestAmount) > 0 && (
              <View className="bg-[#34C759]/8 rounded-2xl p-3 mb-3 border border-[#34C759]/15 flex-row items-center gap-2">
                <CheckCircle size={16} color="#34C759" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-[#34C759]">Хүүгүй зээл · Нийт төлөх: ₮{parseInt(requestAmount).toLocaleString()}</Text>
                  <Text className="text-[10px] text-[#8E8E93] mt-0.5">Даалгавар гүйцэтгэж зээлээ төлж болно</Text>
                </View>
              </View>
            )}

            <View className="flex-row items-center gap-2 mb-2">
              <FileText size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Зорилго</Text>
            </View>
            <TextInput
              className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-4 border border-[#F2F2F7]"
              value={purpose}
              onChangeText={setPurpose}
              placeholder="Жишээ: Ном худалдаж авах..."
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              style={{ minHeight: 60 }}
            />

            <TouchableOpacity
              className="bg-[#0A7EA4] rounded-2xl py-4 items-center flex-row justify-center gap-2"
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
                <Clock size={14} color="#0A7EA4" />
                <Text className="text-sm font-bold text-[#0A7EA4]">Хүлээгдэж буй хүсэлтүүд</Text>
              </View>
              {pendingRequests.map(req => (
                <View key={req.id} className="bg-[#0A7EA4]/5 rounded-3xl p-4 mb-3 border border-[#0A7EA4]/20">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-black text-[#1a1a2e]">₮{req.amount.toLocaleString()}</Text>
                    <View className="bg-[#0A7EA4]/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                      <Clock size={12} color="#0A7EA4" />
                      <Text className="text-xs font-bold text-[#0A7EA4]">Хүлээгдэж буй</Text>
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
              <Text className="text-sm font-bold text-[#0A7EA4] mb-3 mt-2">Идэвхтэй зээлүүд</Text>
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
