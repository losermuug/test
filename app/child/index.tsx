import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, achievementsData, getAgeGroup } from '@/contexts/AppContext';
import { AGE_GROUP_CONFIG } from '@/constants/ageGroupData';
import AchievementBadge from '@/components/app/AchievementBadge';
import JuniorBackground from '@/components/app/JuniorBackground';
import MoneyVisualizer from '@/components/app/MoneyVisualizer';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';
import {
  Wallet, Flame, Star, CheckSquare, BookOpen, LogOut,
  TrendingDown, Rocket, ShieldCheck, Sparkles, GraduationCap,
  ArrowDownToLine, ArrowUpFromLine, X, Trophy, Zap,
  Award, Crown, ChevronRight, Lock, PiggyBank,
  Heart, Gem, Medal, HandCoins, Banknote,
  CircleDollarSign, ReceiptText, BrainCircuit,
  ShoppingBag, Lightbulb, BadgeCheck, BadgeDollarSign,
} from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket, star: Star, shield: ShieldCheck, sparkle: Sparkles, graduate: GraduationCap,
};

// ─── Lucide Sticker Component ──────────────────────────────────────────────
// A rounded colored tile containing a Lucide icon — the "sticker"
function Sticker({
  icon: Icon,
  color,
  bg,
  size = 22,
  tileSize = 48,
  radius = 16,
  shadow = true,
}: {
  icon: any;
  color: string;
  bg: string;
  size?: number;
  tileSize?: number;
  radius?: number;
  shadow?: boolean;
}) {
  return (
    <View style={{
      width: tileSize, height: tileSize, borderRadius: radius,
      backgroundColor: bg,
      justifyContent: 'center', alignItems: 'center',
      ...(shadow ? {
        shadowColor: color,
        shadowOpacity: 0.22,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      } : {}),
    }}>
      <Icon size={size} color={color} />
    </View>
  );
}

// ─── Shared Bottom-Sheet Modal ─────────────────────────────────────────────
function TransactionModal({
  visible, type, balance, onClose, onConfirm, theme,
}: {
  visible: boolean;
  type: 'deposit' | 'withdraw' | null;
  balance: number;
  onClose: () => void;
  onConfirm: (amount: string) => void;
  theme: 'junior' | 'teen' | 'senior';
}) {
  const [amount, setAmount] = useState('');
  const isDeposit = type === 'deposit';

  const presets = theme === 'junior' ? ['500', '1000', '2000', '5000']
    : theme === 'senior' ? ['1000', '5000', '10000', '20000']
    : ['1000', '3000', '5000', '10000'];

  const accent = theme === 'junior' ? '#C084FC' : theme === 'senior' ? '#0A84FF' : '#6C63FF';
  const btnColor = isDeposit ? '#4ADE80' : '#FB923C';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 28, paddingBottom: Platform.OS === 'ios' ? 44 : 32 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 24 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Sticker icon={isDeposit ? HandCoins : ShoppingBag} color={btnColor} bg={`${btnColor}20`} size={21} tileSize={44} radius={14} />
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#1a1a2e' }}>
                      {isDeposit ? 'Мөнгө нэмэх' : 'Мөнгө авах'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => { onClose(); setAmount(''); }}
                    style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' }}>
                    <X size={15} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: `${accent}0D`, borderRadius: 22, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: `${accent}25` }}>
                  <Text style={{ fontSize: 11, color: '#AEAEB2', fontWeight: '700', letterSpacing: 1, marginBottom: 4 }}>ДҮН (₮)</Text>
                  <TextInput
                    style={{ fontSize: 44, fontWeight: '900', color: '#1a1a2e', textAlign: 'center', minWidth: 100 }}
                    value={amount} onChangeText={setAmount}
                    keyboardType="number-pad" placeholder="0" placeholderTextColor="#C7C7CC" autoFocus
                  />
                </View>

                {type === 'withdraw' && (
                  <Text style={{ textAlign: 'center', color: '#8E8E93', fontSize: 12, marginBottom: 10, fontWeight: '600' }}>
                    Хэтэвч: ₮{balance.toLocaleString()}
                  </Text>
                )}

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                  {presets.map(val => (
                    <TouchableOpacity key={val}
                      style={{ flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: amount === val ? accent : `${accent}15`, alignItems: 'center' }}
                      onPress={() => setAmount(val)}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: amount === val ? '#fff' : accent }}>
                        ₮{parseInt(val).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={{ backgroundColor: btnColor, borderRadius: 20, paddingVertical: 18, alignItems: 'center' }}
                  onPress={() => { onConfirm(amount); setAmount(''); }} activeOpacity={0.85}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900' }}>
                    {isDeposit ? 'Нэмэх' : 'Авах'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────
export default function ChildDashboard() {
  const { state, dispatch, getSelectedChild } = useApp();
  const router = useRouter();
  const child = getSelectedChild();
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);

  if (!child) return null;

  const ageGroup = getAgeGroup(child.age);
  const isJunior = ageGroup === 'junior';
  const isSenior = ageGroup === 'senior';

  const activeLoans = child.loans.filter(l => l.status === 'active' || l.status === 'overdue');
  const totalDebt = activeLoans.reduce((sum, l) => sum + (l.totalDue - l.paidAmount), 0);
  const pendingTasks = child.tasks.filter(t => t.status === 'pending').length;
  const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;

  const handleTransaction = (amount: string) => {
    const num = parseInt(amount);
    if (!num || num <= 0) { Alert.alert('Алдаа', 'Зөв дүн оруулна уу'); return; }
    if (modalType === 'withdraw' && num > child.balance) {
      Alert.alert('Алдаа', 'Хэтэвчинд хүрэлцэхгүй байна'); return;
    }
    dispatch({ type: modalType === 'deposit' ? 'DEPOSIT' : 'WITHDRAW', childId: child.id, amount: num });
    Alert.alert('Амжилттай', modalType === 'deposit' ? `₮${num.toLocaleString()} нэмэгдлээ!` : `₮${num.toLocaleString()} авагдлаа!`);
    setModalType(null);
  };

  // Sticker sets for achievements
  const STICKERS_JUNIOR = [
    { icon: Star,    color: '#C084FC', bg: '#C084FC15' },
    { icon: Rocket,  color: '#C084FC', bg: '#C084FC15' },
    { icon: Heart,   color: '#C084FC', bg: '#C084FC15' },
    { icon: Trophy,  color: '#C084FC', bg: '#C084FC15' },
    { icon: Gem,     color: '#C084FC', bg: '#C084FC15' },
    { icon: Medal,   color: '#C084FC', bg: '#C084FC15' },
    { icon: Crown,   color: '#C084FC', bg: '#C084FC15' },
    { icon: Sparkles,color: '#C084FC', bg: '#C084FC15' },
  ];
  const STICKERS_TEEN = [
    { icon: Trophy,      color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Star,        color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Zap,         color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Heart,       color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Award,       color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Gem,         color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Crown,       color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: ShieldCheck, color: '#0A7EA4', bg: '#0A7EA415' },
  ];
  const STICKERS_SENIOR = [
    { icon: BadgeCheck,  color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Trophy,      color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Award,       color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Star,        color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Gem,         color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Crown,       color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: ShieldCheck, color: '#0A7EA4', bg: '#0A7EA415' },
    { icon: Sparkles,    color: '#0A7EA4', bg: '#0A7EA415' },
  ];

  // ═══════════════════════════════════════════════════════════
  // JUNIOR (6–9) — Sticker world: pastel, bubbly, big tiles
  // ═══════════════════════════════════════════════════════════
  const insets = useSafeAreaInsets();

  if (isJunior) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDF4FF' }}>
        <JuniorBackground />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 52 + insets.bottom }}>

          {/* Header */}
          <View style={{
            backgroundColor: '#C084FC', 
            paddingTop: insets.top + 8, 
            paddingBottom: 32,
            paddingHorizontal: 20, borderBottomLeftRadius: 44, borderBottomRightRadius: 44, overflow: 'hidden',
          }}>
            <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.1)', top: -60, right: -30 }} />
            <View style={{ position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.05)', bottom: 0, left: 15 }} />

            {/* Top bar */}
            <Animated.View entering={FadeInDown.duration(400)}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 20, backgroundColor: '#fff',
                  justifyContent: 'center', alignItems: 'center',
                  shadowColor: '#C084FC', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
                  borderWidth: 3, borderColor: '#F3E8FF',
                }}>
                  <AvatarIcon size={26} color="#C084FC" />
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: '#E0F2FE', fontWeight: '700' }}>Сайн уу!</Text>
                  <Text style={{ fontSize: 24, color: '#fff', fontWeight: '900' }}>{child.name}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                {/* Flame sticker */}
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7, flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                  <Flame size={16} color="#FFD93D" fill="#FFD93D" />
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>{child.streak}</Text>
                </View>
                <TouchableOpacity onPress={() => { dispatch({ type: 'LOGOUT' }); router.replace('/'); }}
                  style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                  <LogOut size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={{
              marginTop: 20, backgroundColor: '#fff', borderRadius: 32, padding: 24, alignItems: 'center',
              shadowColor: '#C084FC', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
            }}>
              <View style={{ width: 66, height: 66, borderRadius: 22, backgroundColor: '#F9A8D430', justifyContent: 'center', alignItems: 'center' }}>
                <PiggyBank size={34} color="#EC4899" />
              </View>
              <Text style={{ fontSize: 13, color: '#EC4899', fontWeight: '800', marginTop: 16, marginBottom: 8, letterSpacing: 1.2, textTransform: 'uppercase' }}>Миний хадгаламж</Text>
              <MoneyVisualizer amount={child.savings} size={48} textColor="#EC4899" />
              {/* Star savings progress */}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
                {[1, 2, 3, 4, 5].map(i => {
                  const earned = i <= Math.min(Math.floor(child.savings / 2000), 5);
                  return (
                    <View key={i} style={{
                      width: 32, height: 32, borderRadius: 10,
                      backgroundColor: earned ? '#FEF3C7' : '#F5F5F5',
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      <Star size={17} color={earned ? '#F59E0B' : '#D1D1D6'} fill={earned ? '#F59E0B' : 'none'} />
                    </View>
                  );
                })}
              </View>
              <Text style={{ fontSize: 11, color: '#EC4899', fontWeight: '700', marginTop: 6 }}>Хадгаламжийн одууд</Text>
            </Animated.View>
          </View>

          {/* Adventure sticker cards */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ paddingHorizontal: 20, marginTop: 26 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1a1a2e', marginBottom: 14 }}>Юу хийх вэ?</Text>
            <View style={{ gap: 10 }}>
              {[
                { icon: CheckSquare,   iColor: '#C084FC', iBg: '#C084FC15', bColor: '#F2F2F7', cardBg: '#FFFFFF', label: 'Даалгавар',  sub: `${pendingTasks} хүлээж байна`,              route: '/child/tasks'   },
                { icon: GraduationCap, iColor: '#C084FC', iBg: '#C084FC15', bColor: '#F2F2F7', cardBg: '#FFFFFF', label: 'Хичээл',   sub: 'Мөнгө & хадгаламжийн хичээл',             route: '/child/learn'   },
                // { icon: PiggyBank,     iColor: '#EC4899', iBg: '#FCE7F330', bColor: '#F9A8D440', cardBg: '#FDF2F8', label: 'Хадгаламж', sub: `₮${child.savings.toLocaleString()} хуримтлуулсан`, route: '/child/savings' },
              ].map(item => (
                <TouchableOpacity key={item.label}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: item.cardBg, borderRadius: 24, paddingVertical: 16, paddingHorizontal: 16,
                    borderWidth: 2, borderColor: item.bColor,
                  }}
                  onPress={() => router.push(item.route as any)} activeOpacity={0.8}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <Sticker icon={item.icon} color={item.iColor} bg={item.iBg} size={24} tileSize={54} radius={18} />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: '#1a1a2e' }}>{item.label}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: item.iColor, marginTop: 2 }}>{item.sub}</Text>
                    </View>
                  </View>
                  <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: item.iBg, justifyContent: 'center', alignItems: 'center' }}>
                    <ChevronRight size={18} color={item.iColor} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Sticker badge shelf */}
          <Animated.View entering={FadeInDown.duration(500).delay(280)} style={{ marginTop: 28, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#1a1a2e' }}>Миний стикерүүд</Text>
              <View style={{ backgroundColor: '#C084FC15', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#C084FC' }}>{child?.achievements?.length || 0}/{achievementsData.length}</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
              {achievementsData.map((ach, i) => {
                const unlocked = (child?.achievements || []).some(a => a.id === ach.id);
                const s = STICKERS_JUNIOR[i % STICKERS_JUNIOR.length];
                return (
                  <Animated.View key={ach.id} entering={ZoomIn.duration(360).delay(i * 60)}>
                    <View style={{
                      width: 84, alignItems: 'center', gap: 8, padding: 14, borderRadius: 24,
                      backgroundColor: unlocked ? '#fff' : '#F5F5F5',
                      borderWidth: 2, borderColor: unlocked ? s.bg : '#EBEBEB',
                      shadowColor: unlocked ? s.color : 'transparent',
                      shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
                      opacity: unlocked ? 1 : 0.42,
                    }}>
                      <Sticker icon={unlocked ? s.icon : Lock} color={unlocked ? s.color : '#AEAEB2'} bg={unlocked ? s.bg : '#EBEBEB'} size={22} tileSize={44} radius={14} shadow={false} />
                      <Text style={{ fontSize: 9, fontWeight: '800', textAlign: 'center', color: unlocked ? '#1a1a2e' : '#AEAEB2' }} numberOfLines={2}>
                        {ach.title}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>

        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SENIOR (15–18) — Light fintech, stickers as data icons
  // ═══════════════════════════════════════════════════════════
  if (isSenior) {
    const paidLoans = child.loans.filter(l => l.status === 'paid').length;
    const repaymentRate = child.loans.length > 0 ? Math.round((paidLoans / child.loans.length) * 100) : 0;
    const scoreColor = child.creditScore >= 4 ? '#00C896' : child.creditScore >= 3 ? '#FFB800' : '#FF4D4D';
    const scoreLabel = child.creditScore >= 4 ? 'МАШ САЙН' : child.creditScore >= 3 ? 'ДУНДАЖ' : 'ХӨГЖҮҮЛЭХ';

    const navItems = [
      { icon: CheckSquare,      label: 'Даалгавар',              sub: `${pendingTasks} хүлээж буй`,    route: '/child/tasks',  color: '#00C896' },
      { icon: CircleDollarSign, label: 'Зээл удирдах',           sub: `${activeLoans.length} идэвхтэй`, route: '/child/loans',  color: '#0A84FF' },
      { icon: BrainCircuit,     label: 'Санхүүгийн боловсрол',   sub: `${child.lessonsCompleted.length}/6 хичээл`, route: '/child/learn', color: '#BF5AF2' },
    ];

    return (
      <View style={{ flex: 1, backgroundColor: '#F4F4F9' }}>
        <TransactionModal visible={modalType !== null} type={modalType} balance={child.balance}
          onClose={() => setModalType(null)} onConfirm={handleTransaction} theme="senior" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 52 + insets.bottom }}>

          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)}
            style={{ paddingHorizontal: 20, paddingTop: insets.top + 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Sticker icon={AvatarIcon} color="#0A84FF" bg="#FFFFFF" size={22} tileSize={46} radius={15} />
              <View>
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase' }}>Санхүүгийн аккаунт</Text>
                <Text style={{ fontSize: 18, color: '#1a1a2e', fontWeight: '900' }}>{child.name}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 13, paddingHorizontal: 12, paddingVertical: 7, flexDirection: 'row', gap: 5, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Flame size={14} color="#0A84FF" />
                <Text style={{ color: '#0A84FF', fontWeight: '700', fontSize: 13 }}>{child.streak}д</Text>
              </View>
              <TouchableOpacity onPress={() => { dispatch({ type: 'LOGOUT' }); router.replace('/'); }}
                style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}>
                <LogOut size={15} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Glass balance card */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={{ marginHorizontal: 20, marginTop: 16 }}>
            <View style={{
              backgroundColor: '#FFFFFF', borderRadius: 30, padding: 24,
              borderWidth: 1, borderColor: '#E5E7EB',
              shadowColor: '#0A84FF', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
            }}>
              <View style={{ position: 'absolute', top: 22, right: 22, width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C896' }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Sticker icon={Wallet} color="#0A84FF" bg="#0A84FF18" size={17} tileSize={34} radius={11} />
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>Нийт үлдэгдэл</Text>
              </View>
              <Text style={{ fontSize: 42, fontWeight: '900', color: '#1a1a2e', letterSpacing: -1 }}>
                ₮{child.balance.toLocaleString()}
              </Text>
              {totalDebt > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 18 }}>
                  <TrendingDown size={12} color="#FF4D4D" />
                  <Text style={{ fontSize: 12, color: '#FF4D4D', fontWeight: '600' }}>Нийт зээл: ₮{totalDebt.toLocaleString()}</Text>
                </View>
              )}
              {totalDebt === 0 && <View style={{ height: 18 }} />}

              {/* Metric sticker row */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { icon: BadgeCheck,   label: 'КРЕДИТ', value: `${child.creditScore}/5`, sub: scoreLabel, color: scoreColor },
                  { icon: ReceiptText,  label: 'ТӨЛБӨР', value: `${repaymentRate}%`,      sub: 'Буцааж төлсөн', color: '#0A84FF' },
                  { icon: BookOpen,     label: 'ХИЧЭЭЛ', value: `${child.lessonsCompleted.length}/6`, sub: 'Дууссан', color: '#BF5AF2' },
                ].map(m => (
                  <View key={m.label} style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                    <Sticker icon={m.icon} color={m.color} bg={`${m.color}18`} size={14} tileSize={30} radius={9} shadow={false} />
                    <Text style={{ fontSize: 8, color: '#6B7280', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 }}>{m.label}</Text>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: m.color, marginTop: 2 }}>{m.value}</Text>
                    <Text style={{ fontSize: 9, color: '#6B7280', fontWeight: '600', marginTop: 1 }}>{m.sub}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#00C896', borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => setModalType('deposit')} activeOpacity={0.85}>
                <ArrowDownToLine size={17} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Цэнэглэх</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB' }}
                onPress={() => setModalType('withdraw')} activeOpacity={0.85}>
                <ArrowUpFromLine size={17} color="#4B5563" />
                <Text style={{ color: '#4B5563', fontWeight: '800', fontSize: 14 }}>Таталт</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Financial insight */}
          <Animated.View entering={FadeInDown.duration(500).delay(180)} style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 12 }}>Санхүүгийн тойм</Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 26, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', gap: 18 }}>
              {[
                { label: 'Кредит скорын явц', pct: (child.creditScore / 5) * 100, color: scoreColor, right: scoreLabel },
                { label: 'Зээл буцаасан харьцаа', pct: repaymentRate, color: '#0A84FF', right: `${repaymentRate}%` },
              ].map(bar => (
                <View key={bar.label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600' }}>{bar.label}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: bar.color }}>{bar.right}</Text>
                  </View>
                  <View style={{ backgroundColor: '#F3F4F6', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                    <View style={{ width: `${bar.pct}%`, backgroundColor: bar.color, height: '100%', borderRadius: 8 }} />
                  </View>
                </View>
              ))}
              {/* Lightbulb sticker tip */}
              <View style={{ backgroundColor: '#0A84FF0D', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#0A84FF20', flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <Sticker icon={Lightbulb} color="#0A84FF" bg="#0A84FF25" size={17} tileSize={36} radius={12} shadow={false} />
                <Text style={{ flex: 1, fontSize: 12, color: '#4B5563', lineHeight: 19, fontWeight: '500' }}>
                  {child.creditScore >= 4 ? 'Маш сайн кредит скор! Зээлийн хүү хамгийн бага байна.'
                    : child.creditScore >= 3 ? 'Дараагийн 2 зээлийг хугацаанд нь төлж скороо нэмэгдүүл.'
                    : 'Жижиг зээл авч цагтаа бүрэн төл — скор сайжрах болно.'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Nav list */}
          <Animated.View entering={FadeInDown.duration(500).delay(250)} style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 12 }}>Хурдан үйлдэл</Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 26, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
              {navItems.map((item, i) => (
                <TouchableOpacity key={item.label}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 18, borderBottomWidth: i < navItems.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}
                  onPress={() => router.push(item.route as any)} activeOpacity={0.7}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <Sticker icon={item.icon} color={item.color} bg={`${item.color}18`} size={18} tileSize={42} radius={14} shadow={false} />
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a2e' }}>{item.label}</Text>
                      <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500', marginTop: 2 }}>{item.sub}</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Achievements */}
          <Animated.View entering={FadeInDown.duration(500).delay(320)} style={{ marginTop: 22 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 12 }}>
              <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase' }}>Амжилтууд</Text>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600' }}>{child.achievements.length}/{achievementsData.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
              {achievementsData.map((ach, i) => {
                const unlocked = child.achievements.some(a => a.id === ach.id);
                const s = STICKERS_SENIOR[i % STICKERS_SENIOR.length];
                return (
                  <Animated.View key={ach.id} entering={FadeInRight.duration(350).delay(i * 50)}>
                    <View style={{
                      width: 80, alignItems: 'center', gap: 8, padding: 14, borderRadius: 20,
                      backgroundColor: '#FFFFFF', borderWidth: 1,
                      borderColor: unlocked ? s.bg : '#E5E7EB', opacity: unlocked ? 1 : 0.6,
                    }}>
                      <Sticker icon={unlocked ? s.icon : Lock} color={unlocked ? s.color : '#9CA3AF'} bg={unlocked ? s.bg : '#F3F4F6'} size={19} tileSize={40} radius={13} shadow={false} />
                      <Text style={{ fontSize: 9, fontWeight: '700', textAlign: 'center', color: unlocked ? '#4B5563' : '#9CA3AF' }} numberOfLines={2}>
                        {ach.title}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>

        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TEEN (10–14) — Bold gradients, stickers as expressive accents
  // ═══════════════════════════════════════════════════════════
  return (
    <View style={{ flex: 1, backgroundColor: '#F0F0FB' }}>
      <TransactionModal visible={modalType !== null} type={modalType} balance={child.balance}
        onClose={() => setModalType(null)} onConfirm={handleTransaction} theme="teen" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 44 + insets.bottom }}>

        {/* Minimal formal hero */}
        <View style={{ backgroundColor: '#0A7EA4', paddingTop: insets.top + 8, paddingBottom: 36, borderBottomLeftRadius: 44, borderBottomRightRadius: 44, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.08)', top: -70, right: -40 }} />
          <View style={{ position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -10, left: 20 }} />

          <Animated.View entering={FadeInDown.duration(400)}
            style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)' }}>
                <AvatarIcon size={24} color="#fff" />
              </View>
              <View>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Сайн байна уу!</Text>
                <Text style={{ fontSize: 22, color: '#fff', fontWeight: '900' }}>{child.name}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7, flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <Flame size={14} color="#FFD93D" fill="#FFD93D" />
                <Text style={{ color: '#FFD93D', fontWeight: '900', fontSize: 14 }}>{child.streak}</Text>
              </View>
              <TouchableOpacity onPress={() => { dispatch({ type: 'LOGOUT' }); router.replace('/'); }}
                style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                <LogOut size={15} color="rgba(255,255,255,0.75)" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Floating balance card */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={{ marginHorizontal: 20, marginTop: 20 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 30, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Sticker icon={Wallet} color="#fff" bg="rgba(255,255,255,0.2)" size={14} tileSize={28} radius={9} shadow={false} />
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Миний хэтэвч</Text>
              </View>
              <Text style={{ fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1 }}>
                ₮{child.balance.toLocaleString()}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Sticker icon={TrendingDown} color="#FF6B6B" bg="rgba(255,107,107,0.22)" size={13} tileSize={28} radius={9} shadow={false} />
                  <View>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Нийт зээл</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>₮{totalDebt.toLocaleString()}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Sticker icon={Star} color="#FFD93D" bg="rgba(255,217,61,0.22)" size={13} tileSize={28} radius={9} shadow={false} />
                  <View>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Итгэлцэл</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>{child.creditScore}/5</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Transaction buttons */}
        <Animated.View entering={FadeInDown.duration(500).delay(150)}
          style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#34C759', borderRadius: 22, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#34C759', shadowOpacity: 0.38, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
            onPress={() => setModalType('deposit')} activeOpacity={0.82}>
            <Sticker icon={ArrowDownToLine} color="#fff" bg="rgba(255,255,255,0.25)" size={16} tileSize={30} radius={10} shadow={false} />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Цэнэглэх</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#0A7EA4', borderRadius: 22, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#0A7EA4', shadowOpacity: 0.38, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
            onPress={() => setModalType('withdraw')} activeOpacity={0.82}>
            <Sticker icon={ArrowUpFromLine} color="#fff" bg="rgba(255,255,255,0.25)" size={16} tileSize={30} radius={10} shadow={false} />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Таталт</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick action grid */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '900', color: '#1a1a2e', marginBottom: 14 }}>Хурдан үйлдэл</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { icon: CheckSquare,      color: '#0A7EA4', bg: '#E0F2FE', border: '#0A7EA420', label: 'Даалгавар', sub: `${pendingTasks} хүлээж буй`, route: '/child/tasks' },
              { icon: CircleDollarSign, color: '#0A7EA4', bg: '#E0F2FE', border: '#0A7EA420', label: 'Зээл',      sub: `Хүүгүй · ${activeLoans.length} идэвхтэй`, route: '/child/loans' },
              { icon: BookOpen,         color: '#0A7EA4', bg: '#E0F2FE', border: '#0A7EA420', label: 'Сурах',     sub: `${child.lessonsCompleted.length}/6`, route: '/child/learn' },
            ].map(item => (
              <TouchableOpacity key={item.label}
                style={{ flex: 1, backgroundColor: '#fff', borderRadius: 24, paddingVertical: 20, alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: item.border }}
                onPress={() => router.push(item.route as any)} activeOpacity={0.8}>
                <Sticker icon={item.icon} color={item.color} bg={item.bg} size={22} tileSize={48} radius={16} />
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#1a1a2e' }}>{item.label}</Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: item.color }}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Progress bar */}
        <Animated.View entering={FadeInDown.duration(500).delay(250)} style={{ marginHorizontal: 20, marginTop: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 26, padding: 20, borderWidth: 1, borderColor: '#EBEBF5' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Sticker icon={Zap} color="#0A7EA4" bg="#0A7EA415" size={15} tileSize={32} radius={10} />
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#1a1a2e' }}>Хичээлийн явц</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A7EA4' }}>{child.lessonsCompleted.length}/6</Text>
            </View>
            <View style={{ backgroundColor: '#F0F0FB', borderRadius: 10, height: 12, overflow: 'hidden', marginBottom: 10 }}>
              <View style={{ width: `${(child.lessonsCompleted.length / 6) * 100}%`, backgroundColor: '#0A7EA4', height: '100%', borderRadius: 10 }} />
            </View>
            <Text style={{ fontSize: 11, color: '#AEAEB2', fontWeight: '600' }}>
              {6 - child.lessonsCompleted.length > 0
                ? `${6 - child.lessonsCompleted.length} хичээл үлдсэн байна`
                : 'Бүх хичээлийг дуусгасан!'}
            </Text>
          </View>
        </Animated.View>

        {/* Sticker achievements */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={{ marginTop: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#1a1a2e' }}>Амжилтууд</Text>
            <View style={{ backgroundColor: '#0A7EA415', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#0A7EA4' }}>{child.achievements.length}/{achievementsData.length}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {achievementsData.map((ach, i) => {
              const unlocked = child.achievements.some(a => a.id === ach.id);
              const s = STICKERS_TEEN[i % STICKERS_TEEN.length];
              return (
                <Animated.View key={ach.id} entering={FadeInRight.duration(360).delay(i * 60)}>
                  <View style={{
                    width: 80, alignItems: 'center', gap: 8, padding: 14, borderRadius: 22,
                    backgroundColor: unlocked ? '#fff' : '#F5F5F5',
                    borderWidth: 1.5, borderColor: unlocked ? s.bg : '#EBEBEB',
                    shadowColor: unlocked ? s.color : 'transparent',
                    shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
                    opacity: unlocked ? 1 : 0.42,
                  }}>
                    <Sticker icon={unlocked ? s.icon : Lock} color={unlocked ? s.color : '#AEAEB2'} bg={unlocked ? s.bg : '#EBEBEB'} size={20} tileSize={42} radius={14} shadow={false} />
                    <Text style={{ fontSize: 9, fontWeight: '800', textAlign: 'center', color: unlocked ? s.color : '#AEAEB2' }} numberOfLines={2}>
                      {ach.title}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>

      </ScrollView>
    </View>
  );
}