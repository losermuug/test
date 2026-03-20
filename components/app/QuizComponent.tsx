import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuizQuestion } from '@/constants/lessonsData';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react-native';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export default function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentQ];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowResult(true);
    if (index === question.correctIndex) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  if (isFinished) {
    const isPerfect = score === questions.length;
    return (
      <View className="items-center py-8">
        <View className={`w-20 h-20 rounded-full justify-center items-center mb-4 ${isPerfect ? 'bg-[#FFD93D]/20' : 'bg-[#6C63FF]/10'}`}>
          <Sparkles size={40} color={isPerfect ? '#FFD93D' : '#6C63FF'} />
        </View>
        <Text className="text-3xl font-black text-[#1a1a2e] mb-2">
          {isPerfect ? 'Гайхалтай!' : 'Сайн байна!'}
        </Text>
        <Text className="text-lg text-[#AEAEB2] mb-8">
          {score}/{questions.length} зөв хариулт
        </Text>
        <TouchableOpacity
          className="bg-[#6C63FF] rounded-2xl px-8 py-4 flex-row items-center gap-2"
          onPress={() => onComplete(score, questions.length)}
          activeOpacity={0.7}
        >
          <Sparkles size={18} color="#fff" />
          <Text className="text-white text-lg font-bold">Дуусгах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {/* Progress */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-sm font-bold text-[#6C63FF]">
          Асуулт {currentQ + 1}/{questions.length}
        </Text>
        <View className="flex-row gap-1.5">
          {questions.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === currentQ ? 'w-6 bg-[#6C63FF]' : i < currentQ ? 'w-2 bg-[#34C759]' : 'w-2 bg-[#E5E5EA]'
              }`}
            />
          ))}
        </View>
      </View>

      <Text className="text-xl font-bold text-[#1a1a2e] mb-6 leading-7">{question.question}</Text>

      <View className="gap-3">
        {question.options.map((option, index) => {
          const isCorrect = showResult && index === question.correctIndex;
          const isWrong = showResult && index === selected && index !== question.correctIndex;

          return (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center rounded-2xl p-4 border-2 ${
                isCorrect
                  ? 'bg-[#34C759]/10 border-[#34C759]'
                  : isWrong
                  ? 'bg-[#FF3B30]/10 border-[#FF3B30]'
                  : 'bg-[#F8F8FC] border-transparent'
              }`}
              onPress={() => handleSelect(index)}
              activeOpacity={0.7}
              disabled={selected !== null}
            >
              <View className={`w-8 h-8 rounded-xl justify-center items-center mr-3 ${
                isCorrect ? 'bg-[#34C759]' : isWrong ? 'bg-[#FF3B30]' : 'bg-[#6C63FF]/10'
              }`}>
                {isCorrect ? (
                  <Check size={16} color="#fff" />
                ) : isWrong ? (
                  <X size={16} color="#fff" />
                ) : (
                  <Text className="text-sm font-bold text-[#6C63FF]">
                    {String.fromCharCode(65 + index)}
                  </Text>
                )}
              </View>
              <Text className={`text-base flex-1 ${(isCorrect || isWrong) ? 'font-semibold' : ''} text-[#1a1a2e]`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
