import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import { lessonsData } from '@/constants/lessonsData';
import { AGE_GROUP_CONFIG } from '@/constants/ageGroupData';
import LessonCard from '@/components/app/LessonCard';
import QuizComponent from '@/components/app/QuizComponent';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, BookOpen, FileQuestion, ChevronLeft, ChevronRight, Star, Trophy } from 'lucide-react-native';

type ViewMode = 'list' | 'lesson' | 'quiz';

export default function ChildLearn() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLesson, setSelectedLesson] = useState<typeof lessonsData[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  if (!child) return null;

  const ageGroup = getAgeGroup(child.age);
  const config = AGE_GROUP_CONFIG[ageGroup];
  const isJunior = ageGroup === 'junior';
  const isSenior = ageGroup === 'senior';

  // Filter lessons by age group
  const availableLessons = lessonsData.filter(l => config.lessonIds.includes(l.id));

  const bgColor = isJunior ? '#FFF5F5' : isSenior ? '#F0F0F8' : '#F8F8FC';
  const primaryColor = config.colorPrimary;

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
    const progressPct = (child.lessonsCompleted.filter(id => config.lessonIds.includes(id)).length / availableLessons.length) * 100;
    const completedCount = child.lessonsCompleted.filter(id => config.lessonIds.includes(id)).length;

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2">
            <Text className="text-2xl font-black text-[#1a1a2e]">
              {isJunior ? 'Санхүүгийн хичээл' : isSenior ? 'Санхүүгийн сургалт' : 'Санхүүгийн хичээл'}
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: primaryColor }}>
              {completedCount}/{availableLessons.length} хичээл дуусгасан
              {isJunior && ' · Badge цуглуул!'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mt-3 mb-5">
            <View className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: isJunior ? '#FFE0E0' : isSenior ? '#E0E0EA' : '#E5E5EA' }}>
              <View
                className="h-full rounded-full"
                style={{ width: `${progressPct}%`, backgroundColor: isJunior ? '#FF6B6B' : isSenior ? '#6C63FF' : '#34C759' }}
              />
            </View>
          </Animated.View>

          {/* Age group badge */}
          {isJunior && (
            <Animated.View entering={FadeInDown.duration(500).delay(150)} className="px-6 mb-4">
              <View className="bg-[#FFD93D]/15 rounded-2xl p-4 border-2 border-[#FFD93D]/30 flex-row items-center gap-3">
                <Star size={24} color="#FF9500" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#FF9500]">Бяцхан санхүүч</Text>
                  <Text className="text-xs text-[#8E8E93]">Хичээл бүрийг дуусгаад badge авна!</Text>
                </View>
              </View>
            </Animated.View>
          )}

          {isSenior && (
            <Animated.View entering={FadeInDown.duration(500).delay(150)} className="px-6 mb-4">
              <View className="bg-[#6C63FF]/5 rounded-2xl p-4 border border-[#6C63FF]/15 flex-row items-center gap-3">
                <Trophy size={24} color="#6C63FF" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#6C63FF]">Ахлах санхүүч</Text>
                  <Text className="text-xs text-[#8E8E93]">Бүх хичээлийг гүнзгий ойлголттойгоор сур</Text>
                </View>
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.duration(500).delay(200)} className="px-6">
            {availableLessons.map((lesson, i) => (
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
      <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 rounded-2xl justify-center items-center"
              style={{ backgroundColor: isJunior ? '#FFE0E0' : isSenior ? '#E0E0EA' : '#F2F2F7' }}
              onPress={() => setViewMode('list')}
            >
              <ArrowLeft size={18} color={isJunior ? '#FF6B6B' : '#1a1a2e'} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#1a1a2e]">{selectedLesson.title}</Text>
              <Text className="text-xs text-[#AEAEB2]">Алхам {currentStep + 1}/{selectedLesson.steps.length}</Text>
            </View>
          </Animated.View>

          {/* Step progress */}
          <View className="px-6 mt-3 mb-5 flex-row gap-1.5">
            {selectedLesson.steps.map((_, i) => (
              <View
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{
                  backgroundColor: i <= currentStep
                    ? (isJunior ? '#FF6B6B' : isSenior ? '#6C63FF' : '#6C63FF')
                    : (isJunior ? '#FFE0E0' : '#E5E5EA')
                }}
              />
            ))}
          </View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-6">
            <View
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: '#fff',
                borderWidth: isJunior ? 2 : 1,
                borderColor: isJunior ? '#FFE0E0' : isSenior ? '#E0E0EA' : '#F2F2F7',
              }}
            >
              <View
                className="w-16 h-16 rounded-3xl justify-center items-center self-center mb-4"
                style={{ backgroundColor: (isJunior ? '#FF6B6B' : '#6C63FF') + '10' }}
              >
                <BookOpen size={30} color={isJunior ? '#FF6B6B' : '#6C63FF'} />
              </View>
              <Text className="text-xl font-bold text-[#1a1a2e] text-center mb-4">{step.title}</Text>
              <Text className="text-base text-[#3C3C43] leading-7">{step.content}</Text>
            </View>
          </Animated.View>

          <View className="px-6 mt-6 flex-row gap-3">
            {currentStep > 0 && (
              <TouchableOpacity
                className="flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2"
                style={{ backgroundColor: isJunior ? '#FFE0E0' : '#F2F2F7' }}
                onPress={() => setCurrentStep(p => p - 1)}
                activeOpacity={0.7}
              >
                <ChevronLeft size={18} color="#8E8E93" />
                <Text className="text-base font-semibold text-[#8E8E93]">Өмнөх</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2"
              style={{ backgroundColor: isJunior ? '#FF6B6B' : '#6C63FF' }}
              onPress={() => isLast ? setViewMode('quiz') : setCurrentStep(p => p + 1)}
              activeOpacity={0.7}
            >
              <Text className="text-base font-bold text-white">
                {isLast ? (isJunior ? 'Quiz!' : 'Quiz эхлэх') : 'Дараах'}
              </Text>
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
      <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 rounded-2xl justify-center items-center"
              style={{ backgroundColor: isJunior ? '#FFE0E0' : '#F2F2F7' }}
              onPress={() => setViewMode('lesson')}
            >
              <ArrowLeft size={18} color={isJunior ? '#FF6B6B' : '#1a1a2e'} />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <FileQuestion size={18} color={isJunior ? '#FF6B6B' : '#6C63FF'} />
              <Text className="text-lg font-bold text-[#1a1a2e]">
                Quiz: {selectedLesson.title}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-6 mt-4">
            <View
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: '#fff',
                borderWidth: isJunior ? 2 : 1,
                borderColor: isJunior ? '#FFE0E0' : '#F2F2F7',
              }}
            >
              <QuizComponent questions={selectedLesson.quiz} onComplete={handleQuizComplete} />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
