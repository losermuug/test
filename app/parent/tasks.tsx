import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import TaskCard from '@/components/app/TaskCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Plus, X, Zap, PenLine, FileText, Gift,
  Rocket, Star, ShieldCheck, Sparkles, GraduationCap,
  Bell,
} from 'lucide-react-native';

// ── Design tokens (shared across parent screens) ──────────────────────────────
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

const quickTasks = [
  { title: 'Өрөөгөө цэвэрлэх', reward: 500 },
  { title: 'Аяга таваг угаах',  reward: 300 },
  { title: 'Ном унших (30 мин)',reward: 1000 },
  { title: 'Нохой гаргах',      reward: 500 },
  { title: 'Орноо засах',       reward: 200 },
  { title: 'Хогоо хаях',        reward: 200 },
];

// ── Atoms ─────────────────────────────────────────────────────────────────────

const HRule = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: T.border }} />
);

const InputLabel = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 }}>
    {icon}
    <Text style={{ fontSize: 11, fontWeight: '600', color: T.inkMute, letterSpacing: 0.5, textTransform: 'uppercase' }}>
      {text}
    </Text>
  </View>
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

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ParentTasks() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(state.children[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');

  const childObj = state.children.find(c => c.id === selectedChild);
  const isJunior = childObj && childObj.age <= 9;

  const handleCreateTask = () => {
    if (!title.trim()) { Alert.alert('Алдаа', 'Даалгаврын нэр оруулна уу'); return; }
    let rewardAmount = parseInt(reward) || 0;
    if (isJunior) rewardAmount = rewardAmount * 1000;
    dispatch({ type: 'CREATE_TASK', childId: selectedChild, title: title.trim(), description: description.trim(), reward: rewardAmount });
    setTitle(''); setDescription(''); setReward('');
    setShowForm(false);
    Alert.alert('Амжилттай', isJunior
      ? `${parseInt(reward) || 0} зоосны даалгавар үүсгэлээ!`
      : `₮${rewardAmount.toLocaleString()} даалгавар үүсгэлээ!`
    );
  };

  const handleApprove = (childId: string, taskId: string) => {
    dispatch({ type: 'APPROVE_TASK', childId, taskId });
    const child = state.children.find(c => c.id === childId);
    const isChildJunior = child && child.age <= 9;
    Alert.alert('Баталгаажлаа!', isChildJunior
      ? 'Шагнал хүүхдийн хадгаламжид нэмэгдлээ!'
      : 'Хүүхдийн хэтэвчинд мөнгө нэмэгдлээ.'
    );
  };

  const allTasks = state.children
    .flatMap(c => c.tasks.map(t => ({ ...t, childName: c.name, childAvatar: c.avatar, childId: c.id })))
    .sort((a, b) => {
      const order: Record<string, number> = { completed: 0, pending: 1, approved: 2 };
      return (order[a.status] ?? 1) - (order[b.status] ?? 1);
    });

  const completedCount = allTasks.filter(t => t.status === 'completed').length;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: T.canvas }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: T.ink, letterSpacing: -0.7 }}>Даалгаврууд</Text>
            <Text style={{ fontSize: 13, color: T.inkMute, fontWeight: '500', marginTop: 3 }}>Гэрийн ажил & шагнал</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)} activeOpacity={0.8}
            style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: showForm ? T.lossSoft : T.brand,
              justifyContent: 'center', alignItems: 'center',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: showForm ? T.loss : T.brand,
              marginTop: 6,
            }}
          >
            {showForm ? <X size={18} color={T.loss} /> : <Plus size={18} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Create task form ──────────────────────────────────────── */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(350)} style={{ marginHorizontal: 24, marginBottom: 18 }}>
            <View style={{ backgroundColor: T.surface, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: T.border, overflow: 'hidden' }}>
              <View style={{ padding: 18 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: T.ink, letterSpacing: -0.3, marginBottom: 16 }}>Шинэ даалгавар</Text>

                {/* Child picker */}
                <InputLabel text="Хүүхэд" />
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                  {state.children.map(child => {
                    const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
                    const active = selectedChild === child.id;
                    return (
                      <TouchableOpacity
                        key={child.id} onPress={() => setSelectedChild(child.id)}
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

                {/* Quick tasks */}
                <InputLabel text="Хурдан сонголт" icon={<Zap size={12} color={T.inkMute} />} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {quickTasks.map((qt, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setTitle(qt.title);
                          setReward(isJunior ? (qt.reward / 1000).toString() : qt.reward.toString());
                        }}
                        style={{
                          backgroundColor: T.surfaceAlt, borderRadius: 14,
                          paddingHorizontal: 12, paddingVertical: 10,
                          borderWidth: StyleSheet.hairlineWidth, borderColor: T.border,
                        }}
                      >
                        <Text style={{ fontSize: 13, color: T.ink, fontWeight: '500' }}>{qt.title}</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: T.gain, marginTop: 3 }}>
                          {isJunior ? `${qt.reward / 1000} зоос` : `₮${qt.reward}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Name */}
                <InputLabel text="Нэр" icon={<PenLine size={12} color={T.inkMute} />} />
                <Field value={title} onChangeText={setTitle} placeholder="Өрөөгөө цэвэрлэх" />

                {/* Description */}
                <InputLabel text="Тайлбар" icon={<FileText size={12} color={T.inkMute} />} />
                <Field
                  value={description} onChangeText={setDescription}
                  placeholder="Нэмэлт тайлбар..."
                  multiline style={{ minHeight: 80, textAlignVertical: 'top' }}
                />

                {/* Reward */}
                <InputLabel
                  text={isJunior ? 'Шагнал (зоос)' : 'Шагнал (₮)'}
                  icon={<Gift size={12} color={T.inkMute} />}
                />
                <Field
                  value={reward} onChangeText={setReward}
                  keyboardType="number-pad"
                  placeholder={isJunior ? '2' : '500'}
                  style={{ marginBottom: 0 }}
                />
              </View>

              <HRule />

              <TouchableOpacity onPress={handleCreateTask} activeOpacity={0.8} style={{ padding: 14 }}>
                <View style={{ backgroundColor: T.brand, borderRadius: 16, paddingVertical: 15, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Даалгавар үүсгэх</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ── Pending approval banner ───────────────────────────────── */}
        {completedCount > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginHorizontal: 24, marginBottom: 18 }}>
            <View style={{
              backgroundColor: T.surface, borderRadius: 18, padding: 14,
              flexDirection: 'row', alignItems: 'center', gap: 12,
              borderWidth: StyleSheet.hairlineWidth, borderColor: T.border,
            }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: T.brandSoft, justifyContent: 'center', alignItems: 'center' }}>
                <Bell size={15} color={T.brand} />
              </View>
              <View style={{ flex: 1 }}> 
                <Text style={{ fontSize: 13, fontWeight: '700', color: T.ink }}>Батлах хүлээгдэж буй</Text>
                <Text style={{ fontSize: 12, color: T.inkMute, marginTop: 1 }}>{completedCount} даалгавар хийгдсэн</Text>
              </View>
              <View style={{ backgroundColor: T.brand, borderRadius: 10, minWidth: 22, height: 22, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{completedCount}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* ── Task list ─────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 24 }}>
          {allTasks.length === 0 ? (
            <EmptyState title="Даалгавар байхгүй" message="Хүүхдэд гэрийн ажлын даалгавар үүсгээрэй." />
          ) : (
            <>
              <Text style={{ fontSize: 17, fontWeight: '800', color: T.ink, letterSpacing: -0.3, marginBottom: 12 }}>
                Бүх даалгаврууд
              </Text>
              <View style={{ gap: 8 }}>
                {allTasks.map(task => {
                  const AvatarIcon = AVATAR_ICONS[task.childAvatar] || Rocket;
                  return (
                    <View key={task.id}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4, marginLeft: 4 }}>
                        <AvatarIcon size={11} color={T.inkMute} />
                        <Text style={{ fontSize: 11, color: T.inkMute, fontWeight: '500' }}>{task.childName}</Text>
                      </View>
                      <TaskCard
                        task={task}
                        role="parent"
                        onAction={task.status === 'completed' ? () => handleApprove(task.childId, task.id) : undefined}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}