import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Modal, Alert, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import { AGE_GROUP_CONFIG } from '@/constants/ageGroupData';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Bell, LogOut, Wallet, Star, BookOpen, Rocket, ShieldCheck,
  Sparkles, GraduationCap, ArrowDownToLine, X, Send, UserPlus,
  PiggyBank,
} from 'lucide-react-native';

// ── Design tokens ────────────────────────────────────────────────────────────
const T = {
  canvas:    '#F2F2F4',
  surface:   '#FFFFFF',
  surfaceAlt:'#F7F7F9',
  border:    '#E4E4E8',
  borderMid: '#CECECE',
  ink:       '#111118',
  inkMid:    '#44444C',
  inkMute:   '#909099',
  brand:     '#4845C8',
  brandSoft: '#EEEEFF',
  gain:      '#1A9E5C',
  gainSoft:  '#E8F9F0',
  loss:      '#D63B3B',
  lossSoft:  '#FEECEC',
};

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket, star: Star, shield: ShieldCheck,
  sparkle: Sparkles, graduate: GraduationCap,
};

const AVATARS = [
  { key: 'rocket',   Icon: Rocket },
  { key: 'star',     Icon: Star },
  { key: 'shield',   Icon: ShieldCheck },
  { key: 'sparkle',  Icon: Sparkles },
  { key: 'graduate', Icon: GraduationCap },
];

// ── Atoms ────────────────────────────────────────────────────────────────────

const HRule = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: T.border }} />
);

const Pill = ({ label }: { label: string }) => (
  <View style={{ backgroundColor: T.brandSoft, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
    <Text style={{ fontSize: 11, fontWeight: '600', color: T.brand }}>{label}</Text>
  </View>
);

const MoneyBadge = ({ amount, positive }: { amount: number; positive: boolean }) => (
  <Text style={{ fontSize: 14, fontWeight: '800', color: positive ? T.gain : T.loss, letterSpacing: -0.3 }}>
    ₮{amount.toLocaleString()}
  </Text>
);

const InputLabel = ({ text }: { text: string }) => (
  <Text style={{ fontSize: 11, fontWeight: '600', color: T.inkMute, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 7 }}>
    {text}
  </Text>
);

const Field = (props: any) => (
  <TextInput
    {...props}
    style={[{
      backgroundColor: T.surfaceAlt, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
      fontSize: 15, color: T.ink, borderWidth: StyleSheet.hairlineWidth,
      borderColor: T.border, marginBottom: 16,
    }, props.style]}
    placeholderTextColor={T.inkMute}
  />
);

const PrimaryBtn = ({ label, onPress, icon }: { label: string; onPress: () => void; icon?: React.ReactNode }) => (
  <TouchableOpacity
    onPress={onPress} activeOpacity={0.85}
    style={{ backgroundColor: T.brand, borderRadius: 16, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
  >
    {icon}
    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{label}</Text>
  </TouchableOpacity>
);

// ── Sheet wrapper ─────────────────────────────────────────────────────────────

const Sheet = ({ visible, onClose, title, children }: {
  visible: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'flex-end' }}>
      <View style={{ backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 14, paddingHorizontal: 24, paddingBottom: 40 }}>
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: T.borderMid, alignSelf: 'center', marginBottom: 20 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.4 }}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: T.surfaceAlt, justifyContent: 'center', alignItems: 'center' }}>
            <X size={16} color={T.inkMute} />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </View>
  </Modal>
);

// ── Main component ────────────────────────────────────────────────────────────

export default function ParentDashboard() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [depositChildId, setDepositChildId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childAvatar, setChildAvatar] = useState('rocket');

  const totalLoans = state.children.reduce((a, c) => a + c.loans.filter(l => l.status === 'active' || l.status === 'overdue').length, 0);
  const totalTasks = state.children.reduce((a, c) => a + c.tasks.filter(t => t.status !== 'approved').length, 0);
  const pendingApprovals = state.children.reduce((a, c) => a + c.tasks.filter(t => t.status === 'completed').length, 0);
  const pendingLoanRequests = state.children.reduce((a, c) => a + c.loanRequests.filter(r => r.status === 'pending').length, 0);

  const handleDeposit = () => {
    const num = parseInt(depositAmount);
    if (!num || num <= 0 || !depositChildId) { Alert.alert('Алдаа', 'Зөв дүн оруулна уу'); return; }
    dispatch({ type: 'DEPOSIT', childId: depositChildId, amount: num });
    const name = state.children.find(c => c.id === depositChildId)?.name || '';
    Alert.alert('Амжилттай', `${name}-ын данс руу ₮${num.toLocaleString()} цэнэглэгдлээ!`);
    setDepositAmount(''); setDepositChildId(null);
  };

  const handleAddChild = () => {
    if (!childName.trim()) { Alert.alert('Алдаа', 'Хүүхдийн нэрийг оруулна уу'); return; }
    const age = parseInt(childAge);
    if (!age || age < 6 || age > 18) { Alert.alert('Алдаа', '6–18 насны хооронд оруулна уу'); return; }
    dispatch({ type: 'ADD_CHILD', name: childName.trim(), avatar: childAvatar, age });
    const config = AGE_GROUP_CONFIG[getAgeGroup(age)];
    Alert.alert('Амжилттай!', `${childName.trim()} "${config.label}" бүлэгт бүртгэгдлээ!\nPIN: 1234`);
    setChildName(''); setChildAge(''); setChildAvatar('rocket'); setShowAddChild(false);
  };

  const getAgeGroupLabel = (age: number) => AGE_GROUP_CONFIG[getAgeGroup(age)].label;
  const depositingChild = state.children.find(c => c.id === depositChildId);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: T.canvas }}>

      {/* ── Deposit sheet ────────────────────────────────────────── */}
      <Sheet
        visible={depositChildId !== null}
        onClose={() => { setDepositChildId(null); setDepositAmount(''); }}
        title={depositingChild ? `${depositingChild.name}-д цэнэглэх` : 'Цэнэглэх'}
      >
        <InputLabel text="Дүн (₮)" />
        <TextInput
          style={{
            backgroundColor: T.surfaceAlt, borderRadius: 14, paddingVertical: 14,
            fontSize: 32, fontWeight: '800', color: T.ink, textAlign: 'center',
            borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, marginBottom: 12, letterSpacing: -1,
          }}
          value={depositAmount} onChangeText={setDepositAmount}
          keyboardType="number-pad" placeholder="0"
          placeholderTextColor={T.borderMid} autoFocus
        />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
          {['1000', '3000', '5000', '10000'].map(val => (
            <TouchableOpacity
              key={val} onPress={() => setDepositAmount(val)}
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
                backgroundColor: depositAmount === val ? T.brand : T.surfaceAlt,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: depositAmount === val ? T.brand : T.border,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: depositAmount === val ? '#fff' : T.inkMid }}>
                ₮{parseInt(val).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <PrimaryBtn label="Цэнэглэх" onPress={handleDeposit} />
      </Sheet>

      {/* ── Add child sheet ──────────────────────────────────────── */}
      <Modal visible={showAddChild} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)' }}
          >
            <View style={{ backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 14, paddingHorizontal: 24, paddingBottom: 40 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: T.borderMid, alignSelf: 'center', marginBottom: 20 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.4 }}>Хүүхэд бүртгэх</Text>
                <TouchableOpacity onPress={() => setShowAddChild(false)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: T.surfaceAlt, justifyContent: 'center', alignItems: 'center' }}>
                  <X size={16} color={T.inkMute} />
                </TouchableOpacity>
              </View>

              <InputLabel text="Нэр" />
              <Field value={childName} onChangeText={setChildName} placeholder="Хүүхдийн нэр" />

              <InputLabel text="Нас (6–18)" />
              <Field
                value={childAge}
                onChangeText={(t: string) => setChildAge(t.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="number-pad" placeholder="10"
                style={{ textAlign: 'center', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}
                maxLength={2}
              />
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {['7', '10', '13', '16'].map(val => (
                  <TouchableOpacity
                    key={val} onPress={() => setChildAge(val)}
                    style={{
                      flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: 'center',
                      backgroundColor: childAge === val ? T.brand : T.surfaceAlt,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: childAge === val ? T.brand : T.border,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: childAge === val ? '#fff' : T.inkMid }}>
                      {val} нас
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {childAge && parseInt(childAge) >= 6 && parseInt(childAge) <= 18 && (
                <View style={{ backgroundColor: T.brandSoft, borderRadius: 12, padding: 11, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: T.brand }} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: T.brand, flex: 1 }}>
                    {getAgeGroupLabel(parseInt(childAge))} · {AGE_GROUP_CONFIG[getAgeGroup(parseInt(childAge))].description}
                  </Text>
                </View>
              )}

              <InputLabel text="Аватар" />
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                {AVATARS.map(av => (
                  <TouchableOpacity
                    key={av.key} onPress={() => setChildAvatar(av.key)}
                    style={{
                      flex: 1, aspectRatio: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
                      backgroundColor: childAvatar === av.key ? T.brand : T.surfaceAlt,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: childAvatar === av.key ? T.brand : T.border,
                    }}
                  >
                    <av.Icon size={20} color={childAvatar === av.key ? '#fff' : T.inkMid} />
                  </TouchableOpacity>
                ))}
              </View>

              <PrimaryBtn label="Бүртгүүлэх" onPress={handleAddChild} icon={<UserPlus size={17} color="#fff" />} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Page ────────────────────────────────────────────────── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 13, color: T.inkMute, fontWeight: '500', letterSpacing: 0.2 }}>Сайн байна уу</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: T.ink, marginTop: 2, letterSpacing: -0.7 }}>
              {state.currentUser?.name || 'Эцэг эх'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => { dispatch({ type: 'LOGOUT' }); router.replace('/'); }}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: T.surface, justifyContent: 'center', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, marginTop: 6 }}
          >
            <LogOut size={16} color={T.inkMute} />
          </TouchableOpacity>
        </Animated.View>

        {/* Summary card */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={{ marginHorizontal: 24, marginBottom: 18 }}>
          <View style={{ backgroundColor: T.surface, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, overflow: 'hidden', flexDirection: 'row' }}>
            <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: T.inkMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Идэвхтэй зээл</Text>
              <Text style={{ fontSize: 34, fontWeight: '800', color: T.ink, letterSpacing: -1.5 }}>{totalLoans}</Text>
            </View>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: T.border }} />
            <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: T.inkMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Даалгавар</Text>
              <Text style={{ fontSize: 34, fontWeight: '800', color: T.ink, letterSpacing: -1.5 }}>{totalTasks}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Alerts */}
        {(pendingLoanRequests > 0 || pendingApprovals > 0) && (
          <Animated.View entering={FadeInDown.duration(400).delay(140)} style={{ marginHorizontal: 24, gap: 8, marginBottom: 18 }}>
            {pendingLoanRequests > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/parent/loans' as any)} activeOpacity={0.72}
                style={{ backgroundColor: T.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: T.brandSoft, justifyContent: 'center', alignItems: 'center' }}>
                  <Send size={15} color={T.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: T.ink }}>Зээлийн хүсэлт</Text>
                  <Text style={{ fontSize: 12, color: T.inkMute, marginTop: 1 }}>{pendingLoanRequests} хүсэлт хүлээгдэж байна</Text>
                </View>
                <View style={{ backgroundColor: T.brand, borderRadius: 10, minWidth: 22, height: 22, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{pendingLoanRequests}</Text>
                </View>
              </TouchableOpacity>
            )}
            {pendingApprovals > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/parent/tasks' as any)} activeOpacity={0.72}
                style={{ backgroundColor: T.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: T.brandSoft, justifyContent: 'center', alignItems: 'center' }}>
                  <Bell size={15} color={T.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: T.ink }}>Батлах хүлээгдэж буй</Text>
                  <Text style={{ fontSize: 12, color: T.inkMute, marginTop: 1 }}>{pendingApprovals} даалгавар хийгдсэн</Text>
                </View>
                <View style={{ backgroundColor: T.brand, borderRadius: 10, minWidth: 22, height: 22, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{pendingApprovals}</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* Children header */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: T.ink, letterSpacing: -0.3 }}>Хүүхдүүд</Text>
          <TouchableOpacity
            onPress={() => setShowAddChild(true)} activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: T.brand, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}
          >
            <UserPlus size={14} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Нэмэх</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Child cards */}
        <Animated.View entering={FadeInDown.duration(400).delay(260)} style={{ paddingHorizontal: 24, gap: 12 }}>
          {state.children.map(child => {
            const totalOwed = child.loans
              .filter(l => l.status === 'active' || l.status === 'overdue')
              .reduce((s, l) => s + (l.totalDue - l.paidAmount), 0);
            const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
            const childPending = child.loanRequests.filter(r => r.status === 'pending').length;
            const isJunior = getAgeGroup(child.age) === 'junior';

            return (
              <View key={child.id} style={{ backgroundColor: T.surface, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, overflow: 'hidden' }}>

                {/* Identity row */}
                <View style={{ padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: T.brandSoft, justifyContent: 'center', alignItems: 'center' }}>
                    <AvatarIcon size={22} color={T.brand} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: T.ink, letterSpacing: -0.2 }}>{child.name}</Text>
                      {childPending > 0 && (
                        <View style={{ backgroundColor: T.brand, borderRadius: 8, minWidth: 18, height: 18, paddingHorizontal: 4, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{childPending}</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }}>
                      <Pill label={`${child.age} нас`} />
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Star size={10} color={T.inkMute} />
                        <Text style={{ fontSize: 11, color: T.inkMute, fontWeight: '500' }}>{child.creditScore}/5</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <HRule />

                {/* Stats */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
                  {isJunior ? (
                    <>
                      <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 14, padding: 12 }}>
                        <Text style={{ fontSize: 10, color: T.inkMute, fontWeight: '500', marginBottom: 5 }}>Хадгаламж</Text>
                        <MoneyBadge amount={child.savings} positive />
                      </View>
                      <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 14, padding: 12 }}>
                        <Text style={{ fontSize: 10, color: T.inkMute, fontWeight: '500', marginBottom: 5 }}>Хичээл</Text>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: T.brand, letterSpacing: -0.3 }}>
                          {child.lessonsCompleted.length}<Text style={{ fontSize: 12, color: T.inkMute, fontWeight: '400' }}>/6</Text>
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 14, padding: 12 }}>
                        <Text style={{ fontSize: 10, color: T.inkMute, fontWeight: '500', marginBottom: 5 }}>Хэтэвч</Text>
                        <MoneyBadge amount={child.balance} positive />
                      </View>
                      <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 14, padding: 12 }}>
                        <Text style={{ fontSize: 10, color: T.inkMute, fontWeight: '500', marginBottom: 5 }}>Зээл</Text>
                        <MoneyBadge amount={totalOwed} positive={false} />
                      </View>
                      <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 14, padding: 12 }}>
                        <Text style={{ fontSize: 10, color: T.inkMute, fontWeight: '500', marginBottom: 5 }}>Хичээл</Text>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: T.brand, letterSpacing: -0.3 }}>
                          {child.lessonsCompleted.length}<Text style={{ fontSize: 12, color: T.inkMute, fontWeight: '400' }}>/6</Text>
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                <HRule />

                {/* Deposit tap row */}
                <TouchableOpacity
                  onPress={() => setDepositChildId(child.id)} activeOpacity={0.65}
                  style={{ paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                >
                  <ArrowDownToLine size={14} color={T.brand} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: T.brand }}>
                    {isJunior ? 'Хадгаламж нэмэх' : 'Данс цэнэглэх'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}