import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Loan } from '@/contexts/AppContext';
import { TrendingDown, Calendar, AlertTriangle, CheckCircle, Clock, ArrowDownCircle } from 'lucide-react-native';

interface LoanCardProps {
  loan: Loan;
  onRepay?: () => void;
  showRepay?: boolean;
}

export default function LoanCard({ loan, onRepay, showRepay = false }: LoanCardProps) {
  const progress = loan.totalDue > 0 ? (loan.paidAmount / loan.totalDue) : 0;
  const progressPercent = Math.round(progress * 100);
  const remaining = loan.totalDue - loan.paidAmount;
  const dueDate = new Date(loan.dueDate);
  const isOverdue = loan.status === 'overdue' || (new Date() > dueDate && loan.status === 'active');
  const isPaid = loan.status === 'paid';

  const statusConfig = isPaid
    ? { label: 'Төлөгдсөн', Icon: CheckCircle, color: '#34C759', bg: 'bg-[#34C759]/10' }
    : isOverdue
    ? { label: 'Хэтэрсэн', Icon: AlertTriangle, color: '#FF3B30', bg: 'bg-[#FF3B30]/10' }
    : { label: 'Идэвхтэй', Icon: Clock, color: '#FF9500', bg: 'bg-[#FF9500]/10' };

  return (
    <View className={`bg-white rounded-3xl p-5 mb-4 shadow-md border border-[#F2F2F7] ${isPaid ? 'opacity-60' : ''}`}>
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-2xl bg-[#6C63FF]/10 justify-center items-center">
            <TrendingDown size={22} color="#6C63FF" />
          </View>
          <View>
            <Text className="text-xl font-black text-[#1a1a2e]">₮{loan.amount.toLocaleString()}</Text>
            <Text className="text-xs text-[#AEAEB2]">Хүү: {loan.interestRate}%</Text>
          </View>
        </View>
        <View className={`${statusConfig.bg} px-3 py-1.5 rounded-full flex-row items-center gap-1`}>
          <statusConfig.Icon size={12} color={statusConfig.color} />
          <Text className="text-xs font-bold" style={{ color: statusConfig.color }}>{statusConfig.label}</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-[#AEAEB2] font-medium">Төлөлтийн явц</Text>
          <Text className="text-xs font-bold text-[#6C63FF]">{progressPercent}%</Text>
        </View>
        <View className="h-2.5 bg-[#F2F2F7] rounded-full overflow-hidden">
          <View
            className={`h-full rounded-full ${isPaid ? 'bg-[#34C759]' : 'bg-[#6C63FF]'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-row items-center gap-2">
          <ArrowDownCircle size={14} color="#AEAEB2" />
          <View>
            <Text className="text-2xs text-[#AEAEB2]">Үлдэгдэл</Text>
            <Text className="text-sm font-bold text-[#1a1a2e]">₮{remaining.toLocaleString()}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color="#AEAEB2" />
          <View>
            <Text className="text-2xs text-[#AEAEB2]">Хугацаа</Text>
            <Text className={`text-sm font-bold ${isOverdue ? 'text-[#FF3B30]' : 'text-[#1a1a2e]'}`}>
              {dueDate.toLocaleDateString('mn-MN')}
            </Text>
          </View>
        </View>
      </View>

      {showRepay && (loan.status === 'active' || loan.status === 'overdue') && (
        <TouchableOpacity
          className="bg-[#6C63FF] rounded-2xl py-4 items-center mt-4 flex-row justify-center gap-2"
          onPress={onRepay}
          activeOpacity={0.7}
        >
          <ArrowDownCircle size={18} color="#fff" />
          <Text className="text-white text-base font-bold">Зээл төлөх</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
