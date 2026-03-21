import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, getAgeGroup } from '@/contexts/AppContext';
import { lessonsData } from '@/constants/lessonsData';
import { AGE_GROUP_CONFIG, juniorMoneyLessons } from '@/constants/ageGroupData';
import LessonCard from '@/components/app/LessonCard';
import QuizComponent from '@/components/app/QuizComponent';
import Animated, { FadeInDown } from 'react-native-reanimated';
import JuniorBackground from '@/components/app/JuniorBackground';
import { 
  ArrowLeft, BookOpen, FileQuestion, ChevronLeft, ChevronRight, 
  Star, Trophy, PiggyBank, Heart, Coins, Sparkles, 
  BadgeDollarSign, Zap, Info, HelpCircle,
  Gamepad2, Banknote, Apple, Puzzle, Tv, CheckSquare
} from 'lucide-react-native';

const MONEY_ICON_MAP: Record<string, any> = {
  Coins, PiggyBank, Heart, Star, BookOpen, BadgeDollarSign, Zap, Info, HelpCircle,
  Gamepad2, Banknote, Apple, Puzzle, Tv, CheckSquare
};

type ViewMode = 'list' | 'lesson' | 'quiz';

export default function ChildLearn() {
  const { dispatch, getSelectedChild } = useApp();
  const child = getSelectedChild();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLesson, setSelectedLesson] = useState<typeof lessonsData[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeMoneyLesson, setActiveMoneyLesson] = useState<string | null>(null);

  // Gamification state
  const [collectedCount, setCollectedCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    const juniorCompleted = child.achievements.filter(a => juniorMoneyLessons.some(l => l.badgeId === a.id)).length;
    const completedCount = isJunior ? juniorCompleted : child.lessonsCompleted.filter(id => config.lessonIds.includes(id)).length;
    const totalLessons = isJunior ? juniorMoneyLessons.length : availableLessons.length;
    const progressPct = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }}>
        {isJunior && <JuniorBackground />}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(500)} className="px-6 pt-4 pb-2">
            <Text className="text-2xl font-black text-[#1a1a2e]">
              {isJunior ? 'Санхүүгийн хичээл' : isSenior ? 'Санхүүгийн сургалт' : 'Санхүүгийн хичээл'}
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: primaryColor }}>
              {completedCount}/{totalLessons} хичээл дуусгасан
              {isJunior && ' · Badge цуглуул!'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-6 mt-3 mb-5">
            <View className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: isJunior ? '#F3E8FF' : isSenior ? '#E0E0EA' : '#E5E5EA' }}>
              <View
                className="h-full rounded-full"
                style={{ width: `${progressPct}%`, backgroundColor: isJunior ? '#C084FC' : isSenior ? '#0A7EA4' : '#34C759' }}
              />
            </View>
          </Animated.View>

          {/* Age group badge */}
          {isJunior && (
            <Animated.View entering={FadeInDown.duration(500).delay(150)} className="px-6 mb-4">
              <View className="bg-[#C084FC]/15 rounded-2xl p-4 border-2 border-[#C084FC]/30 flex-row items-center gap-3">
                <Star size={24} color="#C084FC" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#C084FC]">Бяцхан санхүүч</Text>
                  <Text className="text-xs text-[#8E8E93]">Хичээл бүрийг дуусгаад badge авна!</Text>
                </View>
              </View>
            </Animated.View>
          )}

          {isSenior && (
            <Animated.View entering={FadeInDown.duration(500).delay(150)} className="px-6 mb-4">
              <View className="bg-[#0A7EA4]/5 rounded-2xl p-4 border border-[#0A7EA4]/15 flex-row items-center gap-3">
                <Trophy size={24} color="#0A7EA4" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#0A7EA4]">Ахлах санхүүч</Text>
                  <Text className="text-xs text-[#8E8E93]">Бүх хичээлийг гүнзгий ойлголттойгоор сур</Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Junior Money & Savings Lessons */}
          {isJunior && (
            <Animated.View entering={FadeInDown.duration(500).delay(180)} className="px-6 mb-5">
              <View className="flex-row items-center gap-2 mb-3">
                <BadgeDollarSign size={20} color="#1a1a2e" />
                <Text className="text-lg font-black text-[#1a1a2e]">Мөнгө & Хадгаламж</Text>
              </View>
              {activeMoneyLesson ? (() => {
                const ml = juniorMoneyLessons.find(l => l.id === activeMoneyLesson);
                if (!ml) return null;
                const done = child.achievements.some(a => a.id === ml.badgeId);
                const MoneyIcon = MONEY_ICON_MAP[ml.icon] || Coins;
                const handleSuccess = () => {
                  setShowSuccessModal(true);
                  if (!done) {
                    dispatch({ type: 'UNLOCK_ACHIEVEMENT', childId: child.id, achievementId: ml.badgeId });
                  }
                };

                return (
                  <Animated.View entering={FadeInDown.duration(400)}>
                    <View className="bg-white rounded-3xl p-5 border-2" style={{ borderColor: ml.color + '40' }}>
                      <TouchableOpacity
                        className="w-9 h-9 rounded-full bg-[#F3E8FF] justify-center items-center mb-4"
                        onPress={() => { setActiveMoneyLesson(null); setCollectedCount(0); setShowSuccessModal(false); }}
                      >
                        <ArrowLeft size={16} color="#C084FC" />
                      </TouchableOpacity>
                      
                      <View className="items-center mb-4">
                        <View className="w-20 h-20 rounded-3xl justify-center items-center mb-3" style={{ backgroundColor: ml.bgColor }}>
                          <MoneyIcon size={40} color={ml.color} />
                        </View>
                        <Text className="text-xl font-black text-[#1a1a2e] text-center mb-1">{ml.title}</Text>
                        <Text className="text-sm text-[#8E8E93] text-center px-4 leading-5">{ml.content}</Text>
                      </View>

                      {ml.game && !done && !showSuccessModal && (
                        <View className="mt-2 mb-2 p-4 bg-[#F8F8FC] rounded-2xl border border-[#E5E5EA]">
                          <Text className="text-base font-bold text-[#1a1a2e] text-center mb-4">{ml.game.question}</Text>
                          
                          {ml.game.type === 'select' && (
                            <View className="flex-row gap-3">
                              {ml.game.options?.map(opt => {
                                const OptIcon = MONEY_ICON_MAP[opt.icon] || Star;
                                return (
                                  <TouchableOpacity
                                    key={opt.id}
                                    className="flex-1 bg-white p-4 rounded-2xl items-center shadow-sm border border-[#F2F2F7]"
                                    onPress={() => {
                                      if (opt.isCorrect) handleSuccess();
                                    }}
                                    activeOpacity={0.7}
                                  >
                                    <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: opt.color + '15' }}>
                                      <OptIcon size={24} color={opt.color} />
                                    </View>
                                    <Text className="text-xs font-bold text-[#1a1a2e] text-center">{opt.label}</Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}

                          {ml.game.type === 'collect' && (
                            <View className="items-center py-4">
                              <Text className="text-sm font-bold text-[#8E8E93] mb-4">Цуглуулсан: {collectedCount} / {ml.game.targetCount}</Text>
                              <TouchableOpacity
                                className="w-20 h-20 rounded-full bg-[#FFD93D] items-center justify-center shadow-md border-4 border-[#FF9500]"
                                onPress={() => {
                                  const next = collectedCount + 1;
                                  setCollectedCount(next);
                                  if (next >= (ml.game?.targetCount || 5)) handleSuccess();
                                }}
                                activeOpacity={0.6}
                              >
                                <Coins size={32} color="#D97706" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}

                      {done && !showSuccessModal && (
                        <View className="bg-[#C084FC]/10 rounded-2xl p-4 items-center border border-[#C084FC]/30 mt-2">
                          <Text className="text-base font-black text-[#C084FC] mb-2">Badge авсан! ⭐</Text>
                          <Text className="text-xs text-[#8E8E93] text-center">{ml.funFact}</Text>
                        </View>
                      )}

                      {showSuccessModal && (
                        <Animated.View entering={FadeInDown.duration(400)} className="items-center py-6 bg-[#D1FAE5] rounded-3xl mt-2 border-2 border-[#34C759] shadow-sm">
                          <Sparkles size={48} color="#10B981" />
                          <Text className="text-2xl font-black text-[#10B981] mt-4 mb-2">Ямар мундаг юм бэ! 🎉</Text>
                          <Text className="text-sm font-bold text-[#047857] text-center px-4 mb-4">Чи амжилттай давлаа!</Text>
                          <TouchableOpacity
                            className="bg-[#10B981] px-6 py-3 rounded-full flex-row gap-2 items-center"
                            onPress={() => { setShowSuccessModal(false); setActiveMoneyLesson(null); setCollectedCount(0); }}
                          >
                            <Trophy size={18} color="#fff" />
                            <Text className="text-white font-bold text-base">Үргэлжлүүлэх</Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </View>
                  </Animated.View>
                );
              })() : (
                <View className="gap-3">
                  {juniorMoneyLessons.map((ml, i) => {
                    const done = child.achievements.some(a => a.id === ml.badgeId);
                    const MoneyIcon = MONEY_ICON_MAP[ml.icon] || Coins;
                    return (
                      <Animated.View key={ml.id} entering={FadeInDown.duration(400).delay(i * 80)}>
                        <TouchableOpacity
                          className="bg-white rounded-2xl p-4 flex-row items-center gap-3 border-2"
                          style={{ borderColor: done ? '#C084FC40' : ml.color + '30' }}
                          onPress={() => setActiveMoneyLesson(ml.id)}
                          activeOpacity={0.7}
                        >
                          <View className="w-14 h-14 rounded-2xl justify-center items-center" style={{ backgroundColor: ml.bgColor }}>
                            <MoneyIcon size={28} color={ml.color} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-black text-[#1a1a2e]">{ml.title}</Text>
                            <Text className="text-xs text-[#8E8E93] mt-0.5">{ml.description}</Text>
                          </View>
                          {done && (
                            <View className="w-7 h-7 rounded-full bg-[#C084FC] items-center justify-center">
                              <Star size={14} color="#fff" fill="#fff" />
                            </View>
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          )}

          {/* Regular lessons */}
          {!isJunior && (
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
          )}
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
        {isJunior && <JuniorBackground />}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 rounded-2xl justify-center items-center"
              style={{ backgroundColor: isJunior ? '#F3E8FF' : isSenior ? '#E0E0EA' : '#F2F2F7' }}
              onPress={() => setViewMode('list')}
            >
              <ArrowLeft size={18} color={isJunior ? '#C084FC' : '#1a1a2e'} />
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
                    ? (isJunior ? '#C084FC' : isSenior ? '#0A7EA4' : '#0A7EA4')
                    : (isJunior ? '#F3E8FF' : '#E5E5EA')
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
                borderColor: isJunior ? '#F3E8FF' : isSenior ? '#E0E0EA' : '#F2F2F7',
              }}
            >
              <View
                className="w-16 h-16 rounded-3xl justify-center items-center self-center mb-4"
                style={{ backgroundColor: (isJunior ? '#C084FC' : '#0A7EA4') + '10' }}
              >
                <BookOpen size={30} color={isJunior ? '#C084FC' : '#0A7EA4'} />
              </View>
              <Text className="text-xl font-bold text-[#1a1a2e] text-center mb-4">{step.title}</Text>
              <Text className="text-base text-[#3C3C43] leading-7">{step.content}</Text>
            </View>
          </Animated.View>

          <View className="px-6 mt-6 flex-row gap-3">
            {currentStep > 0 && (
              <TouchableOpacity
                className="flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2"
                style={{ backgroundColor: isJunior ? '#F3E8FF' : '#F2F2F7' }}
                onPress={() => setCurrentStep(p => p - 1)}
                activeOpacity={0.7}
              >
                <ChevronLeft size={18} color="#8E8E93" />
                <Text className="text-base font-semibold text-[#8E8E93]">Өмнөх</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2"
              style={{ backgroundColor: isJunior ? '#C084FC' : '#0A7EA4' }}
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
        {isJunior && <JuniorBackground />}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-4 pb-2 flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 rounded-2xl justify-center items-center"
              style={{ backgroundColor: isJunior ? '#F3E8FF' : '#F2F2F7' }}
              onPress={() => setViewMode('lesson')}
            >
              <ArrowLeft size={18} color={isJunior ? '#C084FC' : '#1a1a2e'} />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <FileQuestion size={18} color={isJunior ? '#C084FC' : '#0A7EA4'} />
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
                borderColor: isJunior ? '#F3E8FF' : '#F2F2F7',
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
