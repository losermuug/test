import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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
  ChevronLeft,
  Heart,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ── Brand tokens ──────────────────────────────────────────
const C = {
  cream:    '#FDF8F2',      // page background
  surface:  '#FFFFFF',      // cards
  border:   '#EDE8DF',      // subtle borders
  textPrimary:   '#1A1612',
  textSecondary: '#8C7B6E',
  textHint:      '#BDB0A4',

  // Accent palette — warm & friendly
  indigo:   '#5B4FCF',      // primary action
  indigoSoft:'#EEE9FF',
  mint:     '#2DB896',      // child accent
  mintSoft: '#E5F8F3',
  peach:    '#F97048',      // parent accent
  peachSoft:'#FFF0EB',
  amber:    '#F5A623',
  amberSoft:'#FFF8E6',
  rose:     '#E85F8A',
  roseSoft: '#FEF0F5',
  teal:     '#26A69A',
  tealSoft: '#E0F7F4',
};

// Avatar configs
const AVATARS = [
  { key: 'rocket',   Icon: Rocket,        color: C.peach,  softColor: C.peachSoft },
  { key: 'star',     Icon: Star,          color: C.amber,  softColor: C.amberSoft },
  { key: 'shield',   Icon: ShieldCheck,   color: C.indigo, softColor: C.indigoSoft },
  { key: 'sparkle',  Icon: Sparkles,      color: C.mint,   softColor: C.mintSoft },
  { key: 'graduate', Icon: GraduationCap, color: C.rose,   softColor: C.roseSoft },
];

// ── Shared UI primitives ──────────────────────────────────
const Pill = ({
  label,
  active,
  color = C.indigo,
  softColor = C.indigoSoft,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  softColor?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      flex: 1,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
      backgroundColor: active ? softColor : C.surface,
      borderWidth: 1.5,
      borderColor: active ? color : C.border,
    }}
  >
    <Text style={{ fontSize: 14, fontWeight: '700', color: active ? color : C.textSecondary }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const PrimaryButton = ({
  label,
  onPress,
  disabled,
  icon,
  color = C.indigo,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  color?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
    style={{
      backgroundColor: disabled ? C.border : color,
      borderRadius: 18,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}
  >
    {icon}
    <Text style={{ color: disabled ? C.textHint : '#FFF', fontSize: 16, fontWeight: '700' }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const GhostButton = ({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      borderWidth: 1.5,
      borderColor: C.border,
      borderRadius: 18,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: C.surface,
    }}
  >
    {icon}
    <Text style={{ color: C.textPrimary, fontSize: 16, fontWeight: '700' }}>{label}</Text>
  </TouchableOpacity>
);

const SectionLabel = ({ children }: { children: string }) => (
  <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, letterSpacing: 0.8, marginBottom: 8 }}>
    {children.toUpperCase()}
  </Text>
);

const FloatingInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  secureTextEntry,
  autoFocus,
  center,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  maxLength?: number;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  center?: boolean;
}) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={C.textHint}
    keyboardType={keyboardType}
    maxLength={maxLength}
    secureTextEntry={secureTextEntry}
    autoFocus={autoFocus}
    style={{
      backgroundColor: C.surface,
      borderWidth: 1.5,
      borderColor: C.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: C.textPrimary,
      textAlign: center ? 'center' : 'left',
      letterSpacing: secureTextEntry ? 8 : 0,
    }}
  />
);

// ── Helper ────────────────────────────────────────────────
const getAvatarIcon = (avatarKey: string, size = 24, color = '#fff') => {
  const av = AVATARS.find(a => a.key === avatarKey);
  if (!av) return <User size={size} color={color} />;
  return <av.Icon size={size} color={color} />;
};

// ══════════════════════════════════════════════════════════
export default function LoginScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');

  // Login state
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Register state
  const [regName, setRegName]   = useState('');
  const [regPin, setRegPin]     = useState('');
  const [regRole, setRegRole]   = useState<'parent' | 'child'>('child');
  const [regAvatar, setRegAvatar] = useState('rocket');
   const [regAge, setRegAge]     = useState('');
 
   const pinInputRef = useRef<TextInput>(null);

  // ── Handlers ────────────────────────────────────────────
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
    if (regRole === 'child') {
      const age = parseInt(regAge);
      if (!age || age < 5 || age > 17) {
        setError('5-17 насны хооронд оруулна уу');
        return;
      }
    }
    dispatch({
      type: 'REGISTER',
      name: regName.trim(),
      pin: regPin,
      role: regRole,
      avatar: regAvatar,
      age: regRole === 'child' ? parseInt(regAge) : undefined,
    });
    if (regRole === 'child') {
      router.replace('/child' as any);
    } else {
      router.replace('/parent' as any);
    }
  };

  const resetAndBack = () => {
    setMode('welcome');
    setSelectedUser(null);
    setPin('');
    setError('');
  };

  // ╔══════════════════════════════════════════════════════╗
  // ║  WELCOME                                             ║
  // ╚══════════════════════════════════════════════════════╝
  if (mode === 'welcome') {
    return (
      <View style={{ flex: 1, backgroundColor: C.cream }}>
        <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

        {/* Decorative blobs — soft, pastel */}
        <View style={{
          position: 'absolute', width: 260, height: 260, borderRadius: 130,
          backgroundColor: C.indigoSoft, top: -80, right: -60, opacity: 0.6,
        }} />
        <View style={{
          position: 'absolute', width: 180, height: 180, borderRadius: 90,
          backgroundColor: C.mintSoft, bottom: 160, left: -40, opacity: 0.7,
        }} />
        <View style={{
          position: 'absolute', width: 120, height: 120, borderRadius: 60,
          backgroundColor: C.peachSoft, bottom: 60, right: 24, opacity: 0.6,
        }} />

        <SafeAreaView style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingTop: 32, paddingBottom: 36 }}>

          {/* Hero */}
          <Animated.View entering={FadeInUp.duration(700)} style={{ alignItems: 'center', marginTop: 40 }}>
            <Image 
              source={require('../assets/images/Logo.png')} 
              style={{
                width: width * 0.85,
                height: width * 0.85,
                marginBottom: -width * 0.3, // Pull text even closer
                shadowColor: C.indigo,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 15,
              }}
              resizeMode="contain"
            />

            <Text style={{ fontSize: 36, fontWeight: '800', color: C.textPrimary, letterSpacing: -1 }}>
              FINLOX
            </Text>

          </Animated.View>

          {/* CTA buttons */}
          <Animated.View entering={FadeInDown.duration(700).delay(300)} style={{ gap: 12 }}>
            <PrimaryButton
              label="Нэвтрэх"
              onPress={() => setMode('login')}
              icon={<Lock size={18} color="#fff" />}
            />
            <GhostButton
              label="Шинэ хэрэглэгч үүсгэх"
              onPress={() => setMode('register')}
              icon={<UserPlus size={18} color={C.textPrimary} />}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
              <Heart size={12} color={C.textHint} fill={C.textHint} />
              <Text style={{ fontSize: 12, color: C.textHint }}>
                Санхүүгийн зөв дадлыг бага наснаас нь
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  // ╔══════════════════════════════════════════════════════╗
  // ║  LOGIN                                               ║
  // ╚══════════════════════════════════════════════════════╝
  if (mode === 'login') {
    return (
      <View style={{ flex: 1, backgroundColor: C.cream }}>
        <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32, flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Back */}
              <Animated.View entering={FadeInUp.duration(500)}>
                <TouchableOpacity
                  onPress={resetAndBack}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 }}
                >
                  <ChevronLeft size={18} color={C.textSecondary} />
                  <Text style={{ color: C.textSecondary, fontSize: 14, fontWeight: '600' }}>Буцах</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 28, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 }}>
                  Нэвтрэх
                </Text>
                <Text style={{ fontSize: 14, color: C.textSecondary, marginTop: 4, marginBottom: 28 }}>
                  Хэрэглэгчээ сонгоод PIN оруулна уу
                </Text>
              </Animated.View>

              {/* User cards */}
              <Animated.View entering={FadeInDown.duration(500).delay(150)} style={{ gap: 10, marginBottom: 24 }}>
                <SectionLabel>Хэрэглэгч</SectionLabel>
                {state.users.map(user => {
                  const av = AVATARS.find(a => a.key === user.avatar);
                  const isSelected = selectedUser === user.id;
                  const accentColor = av?.color ?? C.indigo;
                  const softColor   = av?.softColor ?? C.indigoSoft;

                  return (
                    <TouchableOpacity
                      key={user.id}
                      onPress={() => { setSelectedUser(user.id); setError(''); }}
                      activeOpacity={0.75}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 14,
                        borderRadius: 18,
                        backgroundColor: isSelected ? softColor : C.surface,
                        borderWidth: 1.5,
                        borderColor: isSelected ? accentColor : C.border,
                      }}
                    >
                      {/* Avatar circle */}
                      <View style={{
                        width: 48, height: 48, borderRadius: 16,
                        backgroundColor: accentColor,
                        justifyContent: 'center', alignItems: 'center',
                        marginRight: 14,
                      }}>
                        {getAvatarIcon(user.avatar, 22, '#fff')}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>{user.name}</Text>
                        <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>
                          {user.role === 'parent' 
                            ? 'Эцэг эх' 
                            : user.age! <= 10 ? '5-10 нас' : user.age! <= 14 ? '11-14 нас' : '15-17 нас'}
                        </Text>
                      </View>

                      {/* Selection indicator */}
                      <View style={{
                        width: 22, height: 22, borderRadius: 11,
                        backgroundColor: isSelected ? accentColor : C.border,
                        justifyContent: 'center', alignItems: 'center',
                      }}>
                        {isSelected && (
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>✓</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>

              {/* PIN section */}
              {selectedUser && (
                <Animated.View entering={FadeInDown.duration(400)} style={{ gap: 16 }}>
                  <SectionLabel>4 оронтой PIN</SectionLabel>

                  {/* PIN dots area wrappted in Touchable to refocus */}
                  <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => pinInputRef.current?.focus()}
                    style={{ flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 4 }}
                  >
                    {[0, 1, 2, 3].map(i => {
                      const filled = pin.length > i;
                      return (
                        <View
                          key={i}
                          style={{
                            width: 56, height: 56, borderRadius: 16,
                            justifyContent: 'center', alignItems: 'center',
                            backgroundColor: filled ? C.indigo : C.surface,
                            borderWidth: 1.5,
                            borderColor: filled ? C.indigo : C.border,
                          }}
                        >
                          {filled && (
                            <View style={{
                              width: 12, height: 12, borderRadius: 6,
                              backgroundColor: '#fff',
                            }} />
                          )}
                        </View>
                      );
                    })}
                    {/* Hidden input to capture keyboard - placed here so KAV tracks it */}
                    <TextInput
                      ref={pinInputRef}
                      value={pin}
                      onChangeText={t => { setPin(t.slice(0, 4)); setError(''); }}
                      keyboardType="number-pad"
                      maxLength={4}
                      autoFocus
                      style={{ position: 'absolute', opacity: 0, width: '100%', height: 56 }}
                    />
                  </TouchableOpacity>

                  {error ? (
                    <View style={{
                      backgroundColor: '#FFF0F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
                    }}>
                      <Text style={{ color: '#D94040', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                        {error}
                      </Text>
                    </View>
                  ) : null}

                  <PrimaryButton
                    label="Нэвтрэх"
                    onPress={handleLogin}
                    disabled={pin.length < 4}
                    icon={pin.length === 4 ? <ArrowRight size={18} color="#fff" /> : undefined}
                  />
                </Animated.View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  // ╔══════════════════════════════════════════════════════╗
  // ║  REGISTER                                            ║
  // ╚══════════════════════════════════════════════════════╝
  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back */}
            <Animated.View entering={FadeInUp.duration(500)}>
              <TouchableOpacity
                onPress={resetAndBack}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 }}
              >
                <ChevronLeft size={18} color={C.textSecondary} />
                <Text style={{ color: C.textSecondary, fontSize: 14, fontWeight: '600' }}>Буцах</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 28, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 }}>
                Бүртгүүлэх
              </Text>
              <Text style={{ fontSize: 14, color: C.textSecondary, marginTop: 4, marginBottom: 28 }}>
                Гэр бүлийн шинэ гишүүн нэмэх
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(150)} style={{ gap: 22 }}>

              {/* Role */}
              <View>
                <SectionLabel>Дүр</SectionLabel>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => setRegRole('parent')}
                    activeOpacity={0.75}
                    style={{
                      flex: 1, padding: 16, borderRadius: 18, alignItems: 'center', gap: 8,
                      backgroundColor: regRole === 'parent' ? C.peachSoft : C.surface,
                      borderWidth: 1.5,
                      borderColor: regRole === 'parent' ? C.peach : C.border,
                    }}
                  >
                    <ShieldCheck size={28} color={regRole === 'parent' ? C.peach : C.textHint} />
                    <Text style={{
                      fontSize: 13, fontWeight: '700',
                      color: regRole === 'parent' ? C.peach : C.textSecondary,
                    }}>Эцэг эх</Text>
                    <Text style={{ fontSize: 11, color: C.textHint, textAlign: 'center' }}>
                      Хянах, зохицуулах
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRegRole('child')}
                    activeOpacity={0.75}
                    style={{
                      flex: 1, padding: 16, borderRadius: 18, alignItems: 'center', gap: 8,
                      backgroundColor: regRole === 'child' ? C.mintSoft : C.surface,
                      borderWidth: 1.5,
                      borderColor: regRole === 'child' ? C.mint : C.border,
                    }}
                  >
                    <Rocket size={28} color={regRole === 'child' ? C.mint : C.textHint} />
                    <Text style={{
                      fontSize: 13, fontWeight: '700',
                      color: regRole === 'child' ? C.mint : C.textSecondary,
                    }}>Хүүхэд</Text>
                    <Text style={{ fontSize: 11, color: C.textHint, textAlign: 'center' }}>
                      Суралцах, тоглох
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Avatar */}
              <View>
                <SectionLabel>Аватар</SectionLabel>
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                  {AVATARS.map(av => {
                    const active = regAvatar === av.key;
                    return (
                      <TouchableOpacity
                        key={av.key}
                        onPress={() => setRegAvatar(av.key)}
                        activeOpacity={0.75}
                        style={{
                          width: 54, height: 54, borderRadius: 16,
                          justifyContent: 'center', alignItems: 'center',
                          backgroundColor: active ? av.color : av.softColor,
                          borderWidth: 2,
                          borderColor: active ? av.color : 'transparent',
                        }}
                      >
                        <av.Icon size={24} color={active ? '#fff' : av.color} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Name */}
              <View>
                <SectionLabel>Нэр</SectionLabel>
                <FloatingInput
                  value={regName}
                  onChangeText={setRegName}
                  placeholder="Нэрээ оруулна уу"
                />
              </View>

              {/* Age (child only) */}
              {regRole === 'child' && (
                <View>
                  <SectionLabel>Нас</SectionLabel>
                  <FloatingInput
                    value={regAge}
                    onChangeText={t => setRegAge(t.replace(/[^0-9]/g, '').slice(0, 2))}
                    placeholder="жишээ: 10"
                    keyboardType="number-pad"
                    maxLength={2}
                    center
                  />
                  <Text style={{ fontSize: 11, color: C.textHint, marginTop: 4 }}>5–17 насны хооронд</Text>
                </View>
              )}

              {/* PIN */}
              <View>
                <SectionLabel>PIN код</SectionLabel>
                <FloatingInput
                  value={regPin}
                  onChangeText={t => setRegPin(t.slice(0, 4))}
                  placeholder="• • • •"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  center
                />
                <Text style={{ fontSize: 11, color: C.textHint, marginTop: 4 }}>4 оронтой тоо</Text>
              </View>

              {/* Error */}
              {error ? (
                <View style={{
                  backgroundColor: '#FFF0F0', borderRadius: 12,
                  paddingHorizontal: 14, paddingVertical: 10,
                }}>
                  <Text style={{ color: '#D94040', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              <PrimaryButton
                label="Бүртгүүлэх"
                onPress={handleRegister}
                icon={<UserPlus size={18} color="#fff" />}
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}