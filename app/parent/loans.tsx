import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Alert, Modal, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import LoanCard from '@/components/app/LoanCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Plus, X, Wallet, Percent, Calendar, Calculator,
  Rocket, Star, ShieldCheck, Sparkles, GraduationCap,
  CheckCircle, XCircle, Clock, MessageSquare, Send,
} from 'lucide-react-native';

// ── Design tokens (same as ParentDashboard) ──────────────────────────────────
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

// ── Atoms ─────────────────────────────────────────────────────────────────────

const HRule = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: T.border }} />
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
      backgroundColor: T.surfaceAlt, borderRadius: 14,
      paddingHorizontal: 14, paddingVertical: 13,
      fontSize: 15, color: T.ink,
      borderWidth: StyleSheet.hairlineWidth, borderColor: T.border,
      marginBottom: 16,
    }, props.style]}
    placeholderTextColor={T.inkMute}
  />
);

const PrimaryBtn = ({ label, onPress, icon, color }: {
  label: string; onPress: () => void; icon?: React.ReactNode; color?: string;
}) => (
  <TouchableOpacity
    onPress={onPress} activeOpacity={0.85}
    style={{
      backgroundColor: color || T.brand, borderRadius: 16,
      paddingVertical: 15, flexDirection: 'row',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}
  >
    {icon}
    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{label}</Text>
  </TouchableOpacity>
);

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ParentLoans() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(state.children.find(c => c.age >= 10)?.id || '');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [dueDays, setDueDays] = useState('7');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approveInterest, setApproveInterest] = useState('10');

  const childObj = state.children.find(c => c.id === selectedChild);
  const isTeenSelected = childObj && childObj.age >= 10 && childObj.age <= 14;
  const currentInterestRate = isTeenSelected ? 0 : parseFloat(interestRate) || 0;

  const pendingRequests = state.children
    .flatMap(c => c.loanRequests.filter(r => r.status === 'pending').map(r => ({
      ...r, childName: c.name, childAvatar: c.avatar,
    })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const allLoans = state.children
    .flatMap(c => c.loans.map(l => ({ ...l, childName: c.name, childAvatar: c.avatar })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateLoan = () => {
    const amountNum = parseInt(amount);
    if (!amountNum || amountNum <= 0) { Alert.alert('Алдаа', 'Зээлийн дүнг зөв оруулна уу'); return; }
    const dueDate = new Date();
    const days = parseInt(dueDays) || 0;
    dueDate.setDate(dueDate.getDate() + days);
    dispatch({ type: 'CREATE_LOAN', childId: selectedChild, amount: amountNum, interestRate: currentInterestRate, dueDays: days, dueDate: dueDate.toISOString() });
    setAmount(''); setShowForm(false);
    Alert.alert('Амжилттай', `₮${amountNum.toLocaleString()} зээл үүсгэлээ!`);
  };

  const openApproveModal = (req: any, defaultInterest: number) => {
    setSelectedRequest(req);
    setApproveInterest(defaultInterest.toString());
  };

  const confirmApproveRequest = () => {
    if (!selectedRequest) return;
    dispatch({
      type: 'APPROVE_LOAN_REQUEST',
      childId: selectedRequest.childId,
      requestId: selectedRequest.id,
      interestRate: parseFloat(approveInterest) || 0,
      dueDays: selectedRequest.dueDays || 14,
      installments: selectedRequest.installments || 1,
    });
    setSelectedRequest(null);
    Alert.alert('Амжилттай', 'Зээл зөвшөөрөгдлөө! Хүүхдийн данс руу мөнгө орлоо.');
  };

  const handleRejectRequest = (childId: string, requestId: string) => {
    Alert.alert('Зээл татгалзах', 'Энэ зээлийн хүсэлтийг татгалзах уу?', [
      { text: 'Болих', style: 'cancel' },
      {
        text: 'Татгалзах', style: 'destructive',
        onPress: () => {
          dispatch({ type: 'REJECT_LOAN_REQUEST', childId, requestId });
          Alert.alert('Татгалзлаа', 'Зээлийн хүсэлт татгалзагдлаа.');
        },
      },
    ]);
  };

  const amountNum = parseInt(amount || '0');
  const daysNum = parseInt(dueDays);
  const interest = Math.round(amountNum * (currentInterestRate / 100) * (daysNum / 30));
  const total = amountNum + interest;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: T.canvas }}>

      {/* ── Approve sheet ────────────────────────────────────────────── */}
      <Modal visible={!!selectedRequest} transparent animationType="slide" onRequestClose={() => setSelectedRequest(null)}>
        <TouchableWithoutFeedback onPress={() => setSelectedRequest(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'flex-end' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                <View style={{ backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 14, paddingHorizontal: 24, paddingBottom: 40 }}>
                  {/* handle */}
                  <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: T.borderMid, alignSelf: 'center', marginBottom: 20 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.4 }}>Зээл зөвшөөрөх</Text>
                    <TouchableOpacity onPress={() => setSelectedRequest(null)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: T.surfaceAlt, justifyContent: 'center', alignItems: 'center' }}>
                      <X size={16} color={T.inkMute} />
                    </TouchableOpacity>
                  </View>

                  {selectedRequest && (
                    <>
                      {/* Summary block */}
                      <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: T.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>Хүссэн дүн</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: T.ink, letterSpacing: -1, marginBottom: 14 }}>
                          ₮{selectedRequest.amount.toLocaleString()}
                        </Text>
                        <HRule />
                        <View style={{ flexDirection: 'row', gap: 24, marginTop: 14 }}>
                          <View>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: T.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Зорилго</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{selectedRequest.purpose}</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: T.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Хугацаа</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{selectedRequest.dueDays || 14} хоног · {selectedRequest.installments || 1}x</Text>
                          </View>
                        </View>
                      </View>

                      <InputLabel text="Сарын хүү (%)" />
                      <Field
                        value={approveInterest}
                        onChangeText={setApproveInterest}
                        keyboardType="decimal-pad"
                        placeholder="Жишээ нь: 5 эсвэл 3.5"
                        style={{ marginBottom: 20 }}
                      />

                      <PrimaryBtn
                        label="Батлах"
                        onPress={confirmApproveRequest}
                        color={T.gain}
                        icon={<CheckCircle size={17} color="#fff" />}
                      />
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Main scroll ───────────────────────────────────────────────── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: T.ink, letterSpacing: -0.7 }}>Зээлийн удирдлага</Text>
            <Text style={{ fontSize: 13, color: T.inkMute, fontWeight: '500', marginTop: 3 }}>Хүүхдэд зээл үүсгэх</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.8}
            style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: showForm ? T.lossSoft : T.brand,
              justifyContent: 'center', alignItems: 'center',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: showForm ? T.loss : T.brand,
              marginTop: 6,
            }}
          >
            {showForm
              ? <X size={18} color={T.loss} />
              : <Plus size={18} color="#fff" />
            }
          </TouchableOpacity>
        </Animated.View>

        {/* ── Create loan form ──────────────────────────────────────── */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(350)} style={{ marginHorizontal: 24, marginBottom: 18 }}>
            <View style={{ backgroundColor: T.surface, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, overflow: 'hidden' }}>
              <View style={{ padding: 18 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: T.ink, letterSpacing: -0.3, marginBottom: 16 }}>Шинэ зээл</Text>

                {state.children.filter(c => c.age >= 10).length === 0 ? (
                  <View style={{ backgroundColor: T.lossSoft, borderRadius: 14, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: T.loss + '30' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: T.loss, textAlign: 'center' }}>
                      Зээл авах боломжтой (10-аас дээш насны) хүүхэд байхгүй байна.
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Child picker */}
                    <InputLabel text="Хүүхэд" />
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                      {state.children.filter(c => c.age >= 10).map(child => {
                        const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
                        const active = selectedChild === child.id;
                        return (
                          <TouchableOpacity
                            key={child.id}
                            onPress={() => setSelectedChild(child.id)}
                            style={{
                              flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center',
                              backgroundColor: active ? T.brandSoft : T.surfaceAlt,
                              borderWidth: active ? 1.5 : StyleSheet.hairlineWidth,
                              borderColor: active ? T.brand : T.border,
                            }}
                          >
                            <AvatarIcon size={22} color={active ? T.brand : T.inkMute} />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: active ? T.brand : T.inkMute, marginTop: 5 }}>
                              {child.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <InputLabel text="Зээлийн дүн (₮)" />
                    <Field value={amount} onChangeText={setAmount} keyboardType="number-pad" placeholder="5,000" />

                    {isTeenSelected ? (
                      <View style={{ backgroundColor: T.gainSoft, borderRadius: 14, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: T.gain }} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: T.gain }}>Teen насны хүүхдэд зээлийн хүү тооцохгүй (0%)</Text>
                      </View>
                    ) : (
                      <>
                        <InputLabel text="Хүүгийн хувь (%)" />
                        <Field
                          value={interestRate}
                          onChangeText={setInterestRate}
                          keyboardType="decimal-pad"
                          placeholder="10"
                        />
                      </>
                    )}

                    <InputLabel text="Хугацаа" />
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                      {['3', '7', '14', '30'].map(days => (
                        <TouchableOpacity
                          key={days} onPress={() => setDueDays(days)}
                          style={{
                            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
                            backgroundColor: dueDays === days ? T.brand : T.surfaceAlt,
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: dueDays === days ? T.brand : T.border,
                          }}
                        >
                          <Text style={{ fontSize: 13, fontWeight: '700', color: dueDays === days ? '#fff' : T.inkMid }}>
                            {days}д
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {amountNum > 0 && (
                      <View style={{ backgroundColor: T.brandSoft, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: T.brand + '20', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Calculator size={16} color={T.brand} />
                        <View>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: T.brand, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Тооцоолол</Text>
                          <Text style={{ fontSize: 13, color: T.inkMid }}>
                            ₮{amountNum.toLocaleString()} + ₮{interest.toLocaleString()} = {' '}
                            <Text style={{ fontWeight: '800', color: T.ink }}>₮{total.toLocaleString()}</Text>
                          </Text>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>

              {state.children.filter(c => c.age >= 10).length > 0 && (
                <>
                  <HRule />
                  <TouchableOpacity
                    onPress={handleCreateLoan} activeOpacity={0.8}
                    style={{ padding: 18 }}
                  >
                    <View style={{ backgroundColor: T.brand, borderRadius: 16, paddingVertical: 15, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Зээл үүсгэх</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {/* ── Pending requests ──────────────────────────────────────── */}
        {pendingRequests.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ paddingHorizontal: 24, marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: T.ink, letterSpacing: -0.3, flex: 1 }}>Хүсэлтүүд</Text>
              <View style={{ backgroundColor: T.brand, borderRadius: 10, minWidth: 22, height: 22, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{pendingRequests.length}</Text>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              {pendingRequests.map(req => {
                const reqChildObj = state.children.find(c => c.id === req.childId);
                const isReqTeen = reqChildObj && reqChildObj.age >= 10 && reqChildObj.age <= 14;
                const reqInterest = isReqTeen ? 0 : 10;
                const AvatarIcon = AVATAR_ICONS[req.childAvatar] || Rocket;

                return (
                  <View key={req.id} style={{ backgroundColor: T.surface, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, overflow: 'hidden' }}>
                    {/* Top row */}
                    <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: T.brandSoft, justifyContent: 'center', alignItems: 'center' }}>
                        <AvatarIcon size={20} color={T.brand} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: T.inkMute, fontWeight: '500' }}>{req.childName}</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: T.ink, letterSpacing: -0.7, marginTop: 1 }}>
                          ₮{req.amount.toLocaleString()}
                        </Text>
                      </View>
                      <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border }}>
                        <Clock size={11} color={T.inkMute} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: T.inkMute }}>Хүлээгдэж буй</Text>
                      </View>
                    </View>

                    <HRule />

                    {/* Purpose */}
                    <View style={{ padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                      <MessageSquare size={14} color={T.brand} style={{ marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: T.brand, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Зорилго</Text>
                        <Text style={{ fontSize: 13, color: T.inkMid, lineHeight: 18 }}>{req.purpose}</Text>
                      </View>
                    </View>

                    <View style={{ paddingHorizontal: 14, paddingBottom: 4 }}>
                      <Text style={{ fontSize: 11, color: T.inkMute }}>
                        Хүсэлт: {new Date(req.createdAt).toLocaleDateString('mn-MN')}
                      </Text>
                    </View>

                    <HRule />

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', padding: 12, gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => openApproveModal(req, reqInterest)} activeOpacity={0.8}
                        style={{ flex: 1, backgroundColor: T.gainSoft, borderRadius: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: T.gain + '30' }}
                      >
                        <CheckCircle size={16} color={T.gain} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: T.gain }}>Зөвшөөрөх</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRejectRequest(req.childId, req.id)} activeOpacity={0.8}
                        style={{ flex: 1, backgroundColor: T.lossSoft, borderRadius: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: T.loss + '30' }}
                      >
                        <XCircle size={16} color={T.loss} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: T.loss }}>Татгалзах</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* ── All loans ─────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 24 }}>
          {allLoans.length === 0 && pendingRequests.length === 0 ? (
            <EmptyState title="Зээл байхгүй" message="Хүүхдэд зээл үүсгэхийн тулд + товч дарна уу." />
          ) : allLoans.length > 0 ? (
            <>
              <Text style={{ fontSize: 17, fontWeight: '800', color: T.ink, letterSpacing: -0.3, marginBottom: 12 }}>Бүх зээлүүд</Text>
              <View style={{ gap: 8 }}>
                {allLoans.map(loan => {
                  const AvatarIcon = AVATAR_ICONS[loan.childAvatar] || Rocket;
                  return (
                    <View key={loan.id}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, marginLeft: 4 }}>
                        <AvatarIcon size={11} color={T.inkMute} />
                        <Text style={{ fontSize: 11, color: T.inkMute, fontWeight: '500' }}>{loan.childName}</Text>
                      </View>
                      <LoanCard loan={loan} />
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}