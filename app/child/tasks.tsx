import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import TaskCard from '@/components/app/TaskCard';
import EmptyState from '@/components/app/EmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';
import JuniorBackground from '@/components/app/JuniorBackground';
import { Clock, Send, PartyPopper } from 'lucide-react-native';

export default function ChildTasks() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  if (!child) return null;

  const isJunior = getAgeGroup(child.age) === 'junior';

  const pendingTasks = child.tasks.filter(t => t.status === 'pending');
  const completedTasks = child.tasks.filter(t => t.status === 'completed');
  const approvedTasks = child.tasks.filter(t => t.status === 'approved');

  const handleComplete = (taskId: string) => {
    Alert.alert('Даалгавар дууссан уу?', 'Эцэг эхдээ батлуулахаар илгээх үү?', [
      { text: 'Болих', style: 'cancel' },
      {
        text: 'Тийм',
        onPress: () => {
          dispatch({ type: 'COMPLETE_TASK', childId: child.id, taskId });
          const doneCount = child.tasks.filter(t => t.status === 'approved').length + 1;
          if (doneCount >= 5) dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'five-tasks-done' });
          if (doneCount >= 10) dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'ten-tasks-done' });
          Alert.alert('Илгээгдлээ!', 'Эцэг эхээс батлагдахыг хүлээнэ үү.');
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1" style={{ backgroundColor: isJunior ? '#FDF4FF' : '#F8F8FC' }}>
      {isJunior && <JuniorBackground />}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-black text-[#1a1a2e]">Даалгаврууд</Text>
          <Text className="text-sm text-[#AEAEB2] mt-0.5">Ажил хийж мөнгө олоорой!</Text>
        </Animated.View>

        <View className="px-6 mt-4">
          {child.tasks.length === 0 ? (
            <EmptyState title="Даалгавар байхгүй" message="Эцэг эхээсээ даалгавар өгүүлээрэй!" />
          ) : (
            <>
              {pendingTasks.length > 0 && (
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                  <View className="flex-row items-center gap-2 mb-3">
                    <Clock size={14} color={isJunior ? '#C084FC' : '#0A7EA4'} />
                    <Text className="text-sm font-bold" style={{ color: isJunior ? '#C084FC' : '#0A7EA4' }}>Хийх даалгавар</Text>
                  </View>
                  {pendingTasks.map(task => (
                    <TaskCard key={task.id} task={task} role="child" onAction={() => handleComplete(task.id)} />
                  ))}
                </Animated.View>
              )}
              {completedTasks.length > 0 && (
                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                  <View className="flex-row items-center gap-2 mb-3 mt-4">
                    <Send size={14} color="#007AFF" />
                    <Text className="text-sm font-bold text-[#007AFF]">Батлагдахыг хүлээж буй</Text>
                  </View>
                  {completedTasks.map(task => <TaskCard key={task.id} task={task} role="child" />)}
                </Animated.View>
              )}
              {approvedTasks.length > 0 && (
                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                  <View className="flex-row items-center gap-2 mb-3 mt-4">
                    <PartyPopper size={14} color="#34C759" />
                    <Text className="text-sm font-bold text-[#34C759]">Дууссан</Text>
                  </View>
                  {approvedTasks.map(task => <TaskCard key={task.id} task={task} role="child" />)}
                </Animated.View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
