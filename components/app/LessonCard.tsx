import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lesson } from '@/constants/lessonsData';
import { BookOpen, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react-native';

const LESSON_COLORS = [
  '#6C63FF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF9500', '#34C759',
];

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  onPress: () => void;
  index?: number;
}

export default function LessonCard({ lesson, isCompleted, onPress, index = 0 }: LessonCardProps) {
  const color = LESSON_COLORS[index % LESSON_COLORS.length];

  return (
    <TouchableOpacity
      className={`bg-white rounded-3xl p-4 mb-3 flex-row items-center shadow-sm border ${
        isCompleted ? 'border-[#34C759]/30' : 'border-[#F2F2F7]'
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="w-14 h-14 rounded-2xl justify-center items-center mr-4 relative"
        style={{ backgroundColor: color + '15' }}
      >
        <BookOpen size={26} color={color} />
        {isCompleted && (
          <View className="absolute -bottom-1 -right-1 bg-[#34C759] w-5 h-5 rounded-full justify-center items-center border-2 border-white">
            <CheckCircle2 size={10} color="#fff" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-[#1a1a2e] mb-0.5">{lesson.title}</Text>
        <Text className="text-sm text-[#AEAEB2] leading-5" numberOfLines={1}>{lesson.description}</Text>
        <View className="flex-row gap-4 mt-2">
          <View className="flex-row items-center gap-1">
            <BookOpen size={11} color="#C7C7CC" />
            <Text className="text-xs text-[#C7C7CC] font-medium">{lesson.steps.length} хичээл</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <HelpCircle size={11} color="#C7C7CC" />
            <Text className="text-xs text-[#C7C7CC] font-medium">{lesson.quiz.length} асуулт</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={22} color="#C7C7CC" />
    </TouchableOpacity>
  );
}
