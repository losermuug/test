import type { AgeGroup } from '@/contexts/AppContext';

// ─── Age Group Configurations ──────────────────────────────

export interface AgeGroupConfig {
  label: string;
  description: string;
  colorPrimary: string;
  colorSecondary: string;
  bgGradient: string;
  loanEnabled: boolean;
  lessonIds: string[]; // which lesson IDs are available
}

export const AGE_GROUP_CONFIG: Record<AgeGroup, AgeGroupConfig> = {
  junior: {
    label: 'Бяцхан санхүүч',
    description: '6-9 насны хүүхдүүдэд зориулсан',
    colorPrimary: '#FF6B6B',
    colorSecondary: '#FFD93D',
    bgGradient: '#FFF5F5',
    loanEnabled: false,
    lessonIds: ['what-is-money', 'saving-vs-borrowing', 'budgeting'],
  },
  teen: {
    label: 'Залуу санхүүч',
    description: '10-14 насны хүүхдүүдэд зориулсан',
    colorPrimary: '#6C63FF',
    colorSecondary: '#4ECDC4',
    bgGradient: '#F8F8FC',
    loanEnabled: true,
    lessonIds: ['what-is-money', 'saving-vs-borrowing', 'what-is-interest', 'budgeting', 'financial-goals', 'smart-spending'],
  },
  senior: {
    label: 'Ахлах санхүүч',
    description: '15-18 насны хүүхдүүдэд зориулсан',
    colorPrimary: '#1a1a2e',
    colorSecondary: '#6C63FF',
    bgGradient: '#F0F0F8',
    loanEnabled: true,
    lessonIds: ['what-is-money', 'saving-vs-borrowing', 'what-is-interest', 'budgeting', 'financial-goals', 'smart-spending'],
  },
};

// ─── Junior-specific educational loan content ──────────────

export interface LoanLesson {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
  badgeId: string;
}

export const juniorLoanLessons: LoanLesson[] = [
  {
    id: 'loan-basics',
    title: 'Зээл гэж юу вэ?',
    icon: 'Target',
    description: 'Зээлийн суурь ойлголтыг тоглоомоор сурцгаая!',
    content: 'Зээл гэдэг нь хэн нэгнээс мөнгө зээлж аваад, дараа нь буцааж өгөх амлалт юм.\n\nЖишээ нь: Найзаасаа 5 наадам зээлж аваад, маргааш 5 наадам буцааж өгөхийг хэлнэ.\n\nГэхдээ зээл авахдаа нэмж (хүү) төлөх ёстой. Тэгэхээр 5 наадам зээлж аваад, 6 наадам буцааж өгөх юм.',
    badgeId: 'loan-basics-learned',
  },
  {
    id: 'why-repay',
    title: 'Яагаад буцааж өгөх вэ?',
    icon: 'CheckCircle',
    description: 'Зээл буцааж төлөхийн ач холбогдлыг мэдэж авцгаая!',
    content: 'Зээл буцааж өгөхгүй бол юу болох вэ?\n\n1. Найз чамд итгэхгүй болно 😟\n2. Дараа дахин зээлж авч чадахгүй болно ❌\n3. Илүү их мөнгө төлөх ёстой болно 📈\n\nХарин цагтаа буцаавал:\n1. Бүгд чамд итгэнэ 🌟\n2. Дараа дахин зээлж авч болно ✅\n3. Бага хүү төлнө 💰',
    badgeId: 'repay-understood',
  },
  {
    id: 'save-vs-borrow',
    title: 'Хадгалах уу? Зээлэх үү?',
    icon: 'TrendingUp',
    description: 'Хэзээ хадгалах, хэзээ зээлэх нь дээр вэ?',
    content: 'Хадгалах нь ДЭЭР байх үе:\n🟢 Хангалттай цаг байвал → мөнгөө хуримтлуул!\n🟢 Тэвчээртэй бай → илүү сайн юм авч чадна!\n\nЗээлэх нь ДЭЭР байх үе:\n🔴 Маш яаралтай хэрэгтэй үед\n🔴 Буцааж төлж чадахаа мэдэж байвал\n\nСанаарай: Хадгалах нь ихэнх тохиолдолд ДЭЭР!',
    badgeId: 'save-borrow-mastered',
  },
];

// ─── Senior-specific deep loan content ─────────────────────

export interface DeepLoanTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
}

export const seniorLoanTopics: DeepLoanTopic[] = [
  {
    id: 'credit-score-deep',
    title: 'Кредит скор гэж юу вэ?',
    icon: 'star',
    description: 'Кредит скорыг хэрхэн тооцоолдог, яагаад чухал болохыг гүнзгий ойлго',
    content: 'Кредит скор нь чиний санхүүгийн найдвартай байдлыг тоогоор илэрхийлсэн үнэлгээ юм.\n\nСкор 1-5 хооронд байна:\n• 5/5 — Маш найдвартай (зээл бүрэн, цагтаа төлдөг)\n• 3/5 — Дунд зэрэг (шинэ эсвэл төлбөрийн түүхгүй)\n• 1/5 — Бага (зээл хугацаандаа төлөхгүй)\n\nСкор нэмэгдүүлэхийн тулд:\n1. Зээлээ цаг тухайд нь төл\n2. Хэт их зээл авахгүй бай\n3. Тогтмол даалгавар гүйцэтгэ',
  },
  {
    id: 'interest-calculation',
    title: 'Хүүгийн тооцоолол',
    icon: 'calculator',
    description: 'Энгийн болон нийлмэл хүүг хэрхэн тооцоолдогийг сур',
    content: 'Энгийн хүү:\nХүү = Үндсэн дүн × Хүүгийн хувь × Хугацаа\n\nЖишээ: 10,000₮ зээл, 10% хүү, 1 сар\nХүү = 10,000 × 0.10 = 1,000₮\nНийт төлбөр = 11,000₮\n\nНийлмэл хүү:\nХүү тооцох тутамд өмнөх хүүн дээрээ нэмж тооцоолно.\nЭнэ нь удаан хугацаанд илүү их мөнгө болж хувирна.\n\nОйлголт: Зээл аваад удаан байх тусам илүү их төлнө!',
  },
  {
    id: 'loan-strategy',
    title: 'Зээлийн стратеги',
    icon: 'target',
    description: 'Зээл авах, буцаах зөв стратегийг сур',
    content: 'Зээл авахдаа дараах зүйлсийг бодож үз:\n\n1. ЗОРИЛГО: Яагаад хэрэгтэй вэ?\n2. ДҮН: Яг хэдэн мөнгө хэрэгтэй вэ?\n3. ХУГАЦАА: Хэзээ буцааж төлж чадах вэ?\n4. ХҮҮ: Нийт хэдийг буцааж өгөх вэ?\n\nЗөвлөгөө:\n• Аль болох бага дүн зээлэ\n• Зээлийг хурдан буцааж төл\n• Нэг удаад нэг зээл байлгахыг хичээ\n• Зээл авахаас өмнө хадгаламж ашиглаж чадах эсэхээ бод',
  },
];
