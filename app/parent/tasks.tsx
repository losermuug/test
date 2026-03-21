import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import TaskCard from '@/components/app/TaskCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Plus, X, Zap, PenLine, FileText, Gift, Rocket, Star, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react-native';

const AVATAR_ICONS: Record<string, any> = {
  rocket: Rocket, star: Star, shield: ShieldCheck, sparkle: Sparkles, graduate: GraduationCap,
};

const quickTasks = [
  { title: 'Өрөөгөө цэвэрлэх', reward: 500 },
  { title: 'Аяга таваг угаах', reward: 300 },
  { title: 'Ном унших (30 мин)', reward: 1000 },
  { title: 'Нохой гаргах', reward: 500 },
  { title: 'Орноо засах', reward: 200 },
  { title: 'Хогоо хаях', reward: 200 },
];

export default function ParentTasks() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(state.children[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');

  const handleCreateTask = () => {
    if (!title.trim()) { Alert.alert('Алдаа', 'Даалгаврын нэр оруулна уу'); return; }
    dispatch({ type: 'CREATE_TASK', childId: selectedChild, title: title.trim(), description: description.trim(), reward: parseInt(reward) || 0 });
    setTitle(''); setDescription(''); setReward('');
    setShowForm(false);
    Alert.alert('Амжилттай', 'Даалгавар үүсгэлээ!');
  };

  const handleApprove = (childId: string, taskId: string) => {
    dispatch({ type: 'APPROVE_TASK', childId, taskId });
    const child = state.children.find(c => c.id === childId);
    const isJunior = child && child.age <= 9;
    Alert.alert('Баталгаажлаа!', isJunior ? 'Шагнал хүүхдийн хадгаламжид нэмэгдлээ! 🐷' : 'Хүүхдийн хэтэвчинд мөнгө нэмэгдлээ.');
  };

  const allTasks = state.children.flatMap(c =>
    c.tasks.map(t => ({ ...t, childName: c.name, childAvatar: c.avatar, childId: c.id }))
  ).sort((a, b) => {
    const order: Record<string, number> = { completed: 0, pending: 1, approved: 2 };
    return (order[a.status] ?? 1) - (order[b.status] ?? 1);
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FC]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-black text-[#1a1a2e]">Даалгаврууд</Text>
            <Text className="text-sm text-[#AEAEB2] mt-0.5">Гэрийн ажил & шагнал</Text>
          </View>
          <TouchableOpacity
            className={`w-12 h-12 rounded-2xl justify-center items-center ${showForm ? 'bg-[#FF3B30]' : 'bg-[#6C63FF]'}`}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.7}
          >
            {showForm ? <X size={22} color="#fff" /> : <Plus size={22} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>

        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="mx-6 bg-white rounded-3xl p-5 mb-4 shadow-sm border border-[#6C63FF]/10">
            <Text className="text-lg font-bold text-[#1a1a2e] mb-4">Шинэ даалгавар</Text>

            <Text className="text-sm font-semibold text-[#8E8E93] mb-2">Хүүхэд</Text>
            <View className="flex-row gap-2 mb-4">
              {state.children.map(child => {
                const AvatarIcon = AVATAR_ICONS[child.avatar] || Rocket;
                return (
                  <TouchableOpacity
                    key={child.id}
                    className={`flex-1 p-3 rounded-2xl border-2 items-center ${selectedChild === child.id ? 'border-[#6C63FF] bg-[#6C63FF]/5' : 'border-[#F2F2F7]'}`}
                    onPress={() => setSelectedChild(child.id)}
                  >
                    <AvatarIcon size={24} color={selectedChild === child.id ? '#6C63FF' : '#C7C7CC'} />
                    <Text className={`text-sm font-semibold mt-1 ${selectedChild === child.id ? 'text-[#6C63FF]' : 'text-[#AEAEB2]'}`}>{child.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Zap size={14} color="#FF9500" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Хурдан сонголт</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-2">
                {quickTasks.map((qt, i) => (
                  <TouchableOpacity
                    key={i}
                    className="bg-[#F8F8FC] rounded-xl px-3 py-2 border border-[#F2F2F7]"
                    onPress={() => { setTitle(qt.title); setReward(qt.reward.toString()); }}
                  >
                    <Text className="text-sm text-[#1a1a2e] font-medium">{qt.title}</Text>
                    <Text className="text-xs text-[#34C759] font-bold">₮{qt.reward}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View className="flex-row items-center gap-2 mb-2">
              <PenLine size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Нэр</Text>
            </View>
            <TextInput className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-3 border border-[#F2F2F7]" value={title} onChangeText={setTitle} placeholder="Өрөөгөө цэвэрлэх" placeholderTextColor="#C7C7CC" />

            <View className="flex-row items-center gap-2 mb-2">
              <FileText size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Тайлбар</Text>
            </View>
            <TextInput className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-3 border border-[#F2F2F7]" value={description} onChangeText={setDescription} placeholder="Нэмэлт тайлбар..." placeholderTextColor="#C7C7CC" multiline />

            <View className="flex-row items-center gap-2 mb-2">
              <Gift size={14} color="#8E8E93" />
              <Text className="text-sm font-semibold text-[#8E8E93]">Шагнал (₮)</Text>
            </View>
            <TextInput className="bg-[#F8F8FC] rounded-2xl p-4 text-base text-[#1a1a2e] mb-4 border border-[#F2F2F7]" value={reward} onChangeText={setReward} keyboardType="number-pad" placeholder="500" placeholderTextColor="#C7C7CC" />

            <TouchableOpacity className="bg-[#6C63FF] rounded-2xl py-4 items-center" onPress={handleCreateTask} activeOpacity={0.7}>
              <Text className="text-white text-base font-bold">Даалгавар үүсгэх</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View className="px-6 mt-2">
          {allTasks.length === 0 ? (
            <EmptyState title="Даалгавар байхгүй" message="Хүүхдэд гэрийн ажлын даалгавар үүсгээрэй." />
          ) : (
            allTasks.map(task => {
              const AvatarIcon = AVATAR_ICONS[task.childAvatar] || Rocket;
              return (
                <View key={task.id}>
                  <View className="flex-row items-center gap-1.5 mb-1 ml-1">
                    <AvatarIcon size={12} color="#AEAEB2" />
                    <Text className="text-xs text-[#AEAEB2]">{task.childName}</Text>
                  </View>
                  <TaskCard task={task} role="parent" onAction={task.status === 'completed' ? () => handleApprove(task.childId, task.id) : undefined} />
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
