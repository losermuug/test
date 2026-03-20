import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '@/contexts/AppContext';
import { Clock, CheckCircle, PartyPopper, Hand, ThumbsUp, Gift } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onAction?: () => void;
  role: 'parent' | 'child';
}

export default function TaskCard({ task, onAction, role }: TaskCardProps) {
  const statusConfig: Record<string, { label: string; Icon: any; color: string; bg: string; btnBg: string }> = {
    pending: { label: 'Хүлээгдэж буй', Icon: Clock, color: '#FF9500', bg: 'bg-[#FF9500]/10', btnBg: 'bg-[#FF9500]' },
    completed: { label: 'Хийгдсэн', Icon: CheckCircle, color: '#007AFF', bg: 'bg-[#007AFF]/10', btnBg: 'bg-[#007AFF]' },
    approved: { label: 'Баталгаажсан', Icon: PartyPopper, color: '#34C759', bg: 'bg-[#34C759]/10', btnBg: 'bg-[#34C759]' },
  };

  const status = statusConfig[task.status];
  const StatusIcon = status.Icon;

  const getActionConfig = () => {
    if (role === 'child' && task.status === 'pending') return { label: 'Гүйцэтгэсэн', Icon: Hand };
    if (role === 'parent' && task.status === 'completed') return { label: 'Батлах', Icon: ThumbsUp };
    return null;
  };

  const actionConfig = getActionConfig();

  return (
    <View className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-[#F2F2F7]">
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-2xl bg-[#F5F3FF] justify-center items-center mr-3">
          <StatusIcon size={22} color={status.color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-[#1a1a2e]">{task.title}</Text>
          {task.description ? (
            <Text className="text-sm text-[#AEAEB2] mt-0.5" numberOfLines={1}>{task.description}</Text>
          ) : null}
        </View>
        <View className="items-end bg-[#34C759]/10 px-3 py-2 rounded-xl">
          <View className="flex-row items-center gap-1">
            <Gift size={12} color="#34C759" />
            <Text className="text-lg font-black text-[#34C759]">₮{task.reward.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className={`${status.bg} px-3 py-1.5 rounded-full flex-row items-center gap-1`}>
          <StatusIcon size={11} color={status.color} />
          <Text className="text-xs font-semibold" style={{ color: status.color }}>{status.label}</Text>
        </View>
        {actionConfig && onAction && (
          <TouchableOpacity
            className={`${status.btnBg} px-4 py-2.5 rounded-xl flex-row items-center gap-1.5`}
            onPress={onAction}
            activeOpacity={0.7}
          >
            <actionConfig.Icon size={14} color="#fff" />
            <Text className="text-white text-sm font-bold">{actionConfig.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
