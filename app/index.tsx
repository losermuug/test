import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, BounceIn } from 'react-native-reanimated';
import {
  Wallet,
  GraduationCap,
  ShieldCheck,
  Rocket,
  Star,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  UserPlus,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AVATARS = [
  { key: 'rocket', Icon: Rocket, color: '#FF6B6B' },
  { key: 'star', Icon: Star, color: '#FFD93D' },
  { key: 'shield', Icon: ShieldCheck, color: '#6C63FF' },
  { key: 'sparkle', Icon: Sparkles, color: '#4ECDC4' },
  { key: 'graduate', Icon: GraduationCap, color: '#FF9500' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regRole, setRegRole] = useState<'parent' | 'child'>('child');
  const [regAvatar, setRegAvatar] = useState('rocket');

  const handleLogin = () => {
    const user = state.users.find(u => u.id === selectedUser);
    if (!user) return;
    if (user.pin !== pin) {
      setError('PIN буруу байна');
      setPin('');
      return;
    }
    dispatch({ type: 'LOGIN', user });
    if (user.role === 'child') {
      dispatch({ type: 'SELECT_CHILD', childId: user.id });
      dispatch({ type: 'UPDATE_STREAK', childId: user.id });
      router.replace('/child' as any);
    } else {
      router.replace('/parent' as any);
    }
  };

  const handleRegister = () => {
    if (!regName.trim() || regPin.length < 4) {
      setError('Нэр болон 4 оронтой PIN оруулна уу');
      return;
    }
    dispatch({
      type: 'REGISTER',
      name: regName.trim(),
      pin: regPin,
      role: regRole,
      avatar: regAvatar,
    });
    // After register, navigate
    if (regRole === 'child') {
      router.replace('/child' as any);
    } else {
      router.replace('/parent' as any);
    }
  };

  const getAvatarIcon = (avatarKey: string, size = 28, color = '#fff') => {
    const avatar = AVATARS.find(a => a.key === avatarKey);
    if (!avatar) return <User size={size} color={color} />;
    return <avatar.Icon size={size} color={color} />;
  };

  // ─── Welcome Screen ───────────────────
  if (mode === 'welcome') {
    return (
      <View className="flex-1 bg-[#0B0B1E]">
        <StatusBar barStyle="light-content" />
        {/* Gradient blobs */}
        <View className="absolute w-80 h-80 rounded-full bg-[#6C63FF]/20 -top-20 -right-16" />
        <View className="absolute w-60 h-60 rounded-full bg-[#4ECDC4]/15 bottom-40 -left-10" />
        <View className="absolute w-40 h-40 rounded-full bg-[#FF6B6B]/15 bottom-10 right-8" />

        <SafeAreaView className="flex-1 px-6 justify-between pt-8 pb-6">
          <Animated.View entering={FadeInUp.duration(800)} className="items-center mt-8">
            <View className="w-20 h-20 rounded-3xl bg-[#6C63FF] justify-center items-center mb-4 shadow-lg">
              <Wallet size={40} color="#fff" />
            </View>
            <Text className="text-4xl font-black text-white tracking-widest">MoneyMii</Text>
            <Text className="text-base text-white/50 mt-2 text-center">
              Хүүхдийн санхүүгийн{'\n'}ухаалаг боловсрол
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800).delay(300)} className="gap-4">
            <TouchableOpacity
              className="bg-[#6C63FF] rounded-2xl py-5 flex-row items-center justify-center gap-3"
              onPress={() => setMode('login')}
              activeOpacity={0.8}
            >
              <Lock size={20} color="#fff" />
              <Text className="text-white text-lg font-bold">Нэвтрэх</Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white/10 rounded-2xl py-5 flex-row items-center justify-center gap-3 border border-white/10"
              onPress={() => setMode('register')}
              activeOpacity={0.8}
            >
              <UserPlus size={20} color="#fff" />
              <Text className="text-white text-lg font-bold">Бүртгүүлэх</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(600)}>
            <Text className="text-center text-white/30 text-xs">
              Санхүүгийн зөв дадлыг бага наснаас нь эхлэе
            </Text>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  // ─── Login Screen ─────────────────────
  if (mode === 'login') {
    return (
      <View className="flex-1 bg-[#0B0B1E]">
        <StatusBar barStyle="light-content" />
        <View className="absolute w-72 h-72 rounded-full bg-[#6C63FF]/15 -top-16 -right-12" />

        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              className="flex-1 px-6 pt-4"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View entering={FadeInUp.duration(600)}>
                <TouchableOpacity onPress={() => { setMode('welcome'); setSelectedUser(null); setPin(''); setError(''); }}>
                  <Text className="text-white/60 text-base mb-4">← Буцах</Text>
                </TouchableOpacity>
                <Text className="text-3xl font-black text-white mb-2">Нэвтрэх</Text>
                <Text className="text-base text-white/50 mb-8">Хэрэглэгчээ сонгоод PIN оруулна уу</Text>
              </Animated.View>

              {/* User list */}
              <Animated.View entering={FadeInDown.duration(600).delay(200)} className="gap-3 mb-6">
                {state.users.map((user, index) => {
                  const avatarConfig = AVATARS.find(a => a.key === user.avatar);
                  const bgColor = avatarConfig?.color || '#6C63FF';
                  const isSelected = selectedUser === user.id;

                  return (
                    <TouchableOpacity
                      key={user.id}
                      className={`flex-row items-center p-4 rounded-2xl border-2 ${
                        isSelected ? 'border-[#6C63FF] bg-[#6C63FF]/10' : 'border-white/10 bg-white/5'
                      }`}
                      onPress={() => { setSelectedUser(user.id); setError(''); }}
                      activeOpacity={0.7}
                    >
                      <View
                        className="w-12 h-12 rounded-xl justify-center items-center mr-4"
                        style={{ backgroundColor: bgColor }}
                      >
                        {getAvatarIcon(user.avatar, 24, '#fff')}
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-lg font-bold">{user.name}</Text>
                        <Text className="text-white/40 text-sm">
                          {user.role === 'parent' ? 'Эцэг эх' : 'Хүүхэд'}
                        </Text>
                      </View>
                      {isSelected && (
                        <View className="w-6 h-6 rounded-full bg-[#6C63FF] justify-center items-center">
                          <Text className="text-white text-xs font-bold">✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>

              {/* PIN Input */}
              {selectedUser && (
                <Animated.View entering={FadeInDown.duration(400)} className="gap-4">
                  <Text className="text-white/70 text-sm font-semibold">4 оронтой PIN</Text>
                  <View className="flex-row gap-3 justify-center mb-2">
                    {[0, 1, 2, 3].map(i => (
                      <View
                        key={i}
                        className={`w-14 h-14 rounded-2xl justify-center items-center border-2 ${
                          pin.length > i ? 'bg-[#6C63FF] border-[#6C63FF]' : 'border-white/20 bg-white/5'
                        }`}
                      >
                        <Text className="text-white text-2xl font-bold">
                          {pin.length > i ? '•' : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <TextInput
                    className="absolute opacity-0 w-full h-14"
                    value={pin}
                    onChangeText={t => { setPin(t.slice(0, 4)); setError(''); }}
                    keyboardType="number-pad"
                    maxLength={4}
                    autoFocus
                  />

                  {error ? (
                    <Text className="text-red-400 text-center text-sm font-medium">{error}</Text>
                  ) : null}

                  <TouchableOpacity
                    className={`rounded-2xl py-4 items-center mt-2 ${
                      pin.length === 4 ? 'bg-[#6C63FF]' : 'bg-white/10'
                    }`}
                    onPress={handleLogin}
                    disabled={pin.length < 4}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-lg font-bold ${pin.length === 4 ? 'text-white' : 'text-white/30'}`}>
                      Нэвтрэх
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  // ─── Register Screen ──────────────────
  return (
    <View className="flex-1 bg-[#0B0B1E]">
      <StatusBar barStyle="light-content" />
      <View className="absolute w-72 h-72 rounded-full bg-[#4ECDC4]/15 -top-16 -left-12" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-6 pt-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInUp.duration(600)}>
              <TouchableOpacity onPress={() => { setMode('welcome'); setError(''); }}>
                <Text className="text-white/60 text-base mb-4">← Буцах</Text>
              </TouchableOpacity>
              <Text className="text-3xl font-black text-white mb-2">Бүртгүүлэх</Text>
              <Text className="text-base text-white/50 mb-6">Шинэ хэрэглэгч үүсгэх</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(200)} className="gap-5">
              {/* Role */}
              <View>
                <Text className="text-white/70 text-sm font-semibold mb-2">Дүр</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className={`flex-1 p-4 rounded-2xl border-2 items-center ${
                      regRole === 'parent' ? 'border-[#6C63FF] bg-[#6C63FF]/10' : 'border-white/10 bg-white/5'
                    }`}
                    onPress={() => setRegRole('parent')}
                  >
                    <ShieldCheck size={28} color={regRole === 'parent' ? '#6C63FF' : '#ffffff80'} />
                    <Text className={`text-sm font-bold mt-2 ${regRole === 'parent' ? 'text-[#6C63FF]' : 'text-white/50'}`}>
                      Эцэг эх
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 p-4 rounded-2xl border-2 items-center ${
                      regRole === 'child' ? 'border-[#4ECDC4] bg-[#4ECDC4]/10' : 'border-white/10 bg-white/5'
                    }`}
                    onPress={() => setRegRole('child')}
                  >
                    <Rocket size={28} color={regRole === 'child' ? '#4ECDC4' : '#ffffff80'} />
                    <Text className={`text-sm font-bold mt-2 ${regRole === 'child' ? 'text-[#4ECDC4]' : 'text-white/50'}`}>
                      Хүүхэд
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Avatar */}
              <View>
                <Text className="text-white/70 text-sm font-semibold mb-2">Аватар</Text>
                <View className="flex-row gap-3 justify-center">
                  {AVATARS.map(av => (
                    <TouchableOpacity
                      key={av.key}
                      className={`w-14 h-14 rounded-2xl justify-center items-center border-2 ${
                        regAvatar === av.key ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: av.color + (regAvatar === av.key ? '' : '40') }}
                      onPress={() => setRegAvatar(av.key)}
                    >
                      <av.Icon size={24} color="#fff" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Name */}
              <View>
                <Text className="text-white/70 text-sm font-semibold mb-2">Нэр</Text>
                <TextInput
                  className="bg-white/10 rounded-2xl p-4 text-white text-base border border-white/10"
                  value={regName}
                  onChangeText={setRegName}
                  placeholder="Нэрээ оруулна уу"
                  placeholderTextColor="#ffffff40"
                />
              </View>

              {/* PIN */}
              <View>
                <Text className="text-white/70 text-sm font-semibold mb-2">PIN (4 орон)</Text>
                <TextInput
                  className="bg-white/10 rounded-2xl p-4 text-white text-base border border-white/10 tracking-[12px] text-center"
                  value={regPin}
                  onChangeText={t => setRegPin(t.slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  placeholder="• • • •"
                  placeholderTextColor="#ffffff40"
                />
              </View>

              {error ? <Text className="text-red-400 text-sm">{error}</Text> : null}

              <TouchableOpacity
                className="bg-[#6C63FF] rounded-2xl py-4 items-center flex-row justify-center gap-2"
                onPress={handleRegister}
                activeOpacity={0.7}
              >
                <UserPlus size={20} color="#fff" />
                <Text className="text-white text-lg font-bold">Бүртгүүлэх</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
