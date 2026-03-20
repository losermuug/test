import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { lessonsData } from '@/constants/lessonsData';
import LessonCard from '@/components/app/LessonCard';
import QuizComponent from '@/components/app/QuizComponent';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, BookOpen, FileQuestion, ChevronLeft, ChevronRight } from 'lucide-react-native';

type ViewMode = 'list' | 'lesson' | 'quiz';

export default function ChildLearn() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLesson, setSelectedLesson] = useState<typeof lessonsData[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  if (!child) return null;

  const openLesson = (lesson: typeof lessonsData[0]) => {
    setSelectedLesson(lesson);
    setCurrentStep(0);
    setViewMode('lesson');
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (!selectedLesson) return;
    dispatch({ type: 'COMPLETE_LESSON', childId: child.id, lessonId: selectedLesson.id });
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'first-quiz' });
    if (score === total) dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'perfect-score' });
    const completedCount = child.lessonsCompleted.length + (child.lessonsCompleted.includes(selectedLesson.id) ? 0 : 1);
    if (completedCount >= lessonsData.length) dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: 'all-lessons' });
    setViewMode('list');
    setSelectedLesson(null);
  };

  // ─── List ──────────────────────
  if (viewMode === 'list') {
    const progressPct = (child.lessonsCompleted.length / lessonsData.length) * 100;
    return (
      <SafeAreaView className="flex-1 bg-[#F8F8FC]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2">
            <Text className="text-2xl font-black text-[#1a1a2e]">Санхүүгийн хичээл</Text>
            <Text className="text-sm text-[#AEAEB2] mt-0.5">
              {child.lessonsCompleted.length}/{lessonsData.length} хичээл дуусгасан
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mt-3 mb-5">
            <View className="h-3 bg-[#E5E5EA] rounded-full overflow-hidden">
              <View className="h-full bg-[#34C759] rounded-full" style={{ width: `${progressPct}%` }} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} className="px-6">
            {lessonsData.map((lesson, i) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={child.lessonsCompleted.includes(lesson.id)}
                onPress={() => openLesson(lesson)}
                index={i}
              />
            ))}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Lesson Steps ──────────────
  if (viewMode === 'lesson' && selectedLesson) {
    const step = selectedLesson.steps[currentStep];
    const isLast = currentStep === selectedLesson.steps.length - 1;

    return (
      <SafeAreaView className="flex-1 bg-[#F8F8FC]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
            <TouchableOpacity className="w-10 h-10 rounded-2xl bg-[#F2F2F7] justify-center items-center" onPress={() => setViewMode('list')}>
              <ArrowLeft size={18} color="#1a1a2e" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#1a1a2e]">{selectedLesson.title}</Text>
              <Text className="text-xs text-[#AEAEB2]">Алхам {currentStep + 1}/{selectedLesson.steps.length}</Text>
            </View>
          </Animated.View>

          {/* Step progress */}
          <View className="px-6 mt-3 mb-5 flex-row gap-1.5">
            {selectedLesson.steps.map((_, i) => (
              <View key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? 'bg-[#6C63FF]' : 'bg-[#E5E5EA]'}`} />
            ))}
          </View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-6">
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-[#F2F2F7]">
              <View className="w-16 h-16 rounded-3xl bg-[#6C63FF]/10 justify-center items-center self-center mb-4">
                <BookOpen size={30} color="#6C63FF" />
              </View>
              <Text className="text-xl font-bold text-[#1a1a2e] text-center mb-4">{step.title}</Text>
              <Text className="text-base text-[#3C3C43] leading-7">{step.content}</Text>
            </View>
          </Animated.View>

          <View className="px-6 mt-6 flex-row gap-3">
            {currentStep > 0 && (
              <TouchableOpacity
                className="flex-1 bg-[#F2F2F7] rounded-2xl py-4 items-center flex-row justify-center gap-2"
                onPress={() => setCurrentStep(p => p - 1)}
                activeOpacity={0.7}
              >
                <ChevronLeft size={18} color="#8E8E93" />
                <Text className="text-base font-semibold text-[#8E8E93]">Өмнөх</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-1 bg-[#6C63FF] rounded-2xl py-4 items-center flex-row justify-center gap-2"
              onPress={() => isLast ? setViewMode('quiz') : setCurrentStep(p => p + 1)}
              activeOpacity={0.7}
            >
              <Text className="text-base font-bold text-white">{isLast ? 'Quiz эхлэх' : 'Дараах'}</Text>
              {isLast ? <FileQuestion size={18} color="#fff" /> : <ChevronRight size={18} color="#fff" />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Quiz ──────────────────────
  if (viewMode === 'quiz' && selectedLesson) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F8FC]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
            <TouchableOpacity className="w-10 h-10 rounded-2xl bg-[#F2F2F7] justify-center items-center" onPress={() => setViewMode('lesson')}>
              <ArrowLeft size={18} color="#1a1a2e" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <FileQuestion size={18} color="#6C63FF" />
              <Text className="text-lg font-bold text-[#1a1a2e]">Quiz: {selectedLesson.title}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-6 mt-4">
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-[#F2F2F7]">
              <QuizComponent questions={selectedLesson.quiz} onComplete={handleQuizComplete} />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
