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
    lessonIds: ['what-is-money', 'saving-vs-borrowing', 'what-is-interest', 'budgeting', 'smart-spending', 'financial-goals'],
  },
  senior: {
    label: 'Ахлах санхүүч',
    description: '15-18 насны хүүхдүүдэд зориулсан',
    colorPrimary: '#1a1a2e',
    colorSecondary: '#6C63FF',
    bgGradient: '#F0F0F8',
    loanEnabled: true,
    lessonIds: ['credit-score-advanced', 'tax-and-income', 'investing-basics', 'compound-interest', 'financial-goals'],
  },
};

// ─── Junior-specific educational loan content (kept for backward compat) ──────────────

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
    content: 'Зээл буцааж өгөхгүй бол юу болох вэ?\n\n1. Найз чамд итгэхгүй болно\n2. Дараа дахин зээлж авч чадахгүй болно\n3. Илүү их мөнгө төлөх ёстой болно\n\nХарин цагтаа буцаавал:\n1. Бүгд чамд итгэнэ\n2. Дараа дахин зээлж авч болно\n3. Бага хүү төлнө',
    badgeId: 'repay-understood',
  },
  {
    id: 'save-vs-borrow',
    title: 'Хадгалах уу? Зээлэх үү?',
    icon: 'TrendingUp',
    description: 'Хэзээ хадгалах, хэзээ зээлэх нь дээр вэ?',
    content: 'Хадгалах нь ДЭЭР байх үе:\n• Хангалттай цаг байвал → мөнгөө хуримтлуул!\n• Тэвчээртэй бай → илүү сайн юм авч чадна!\n\nЗээлэх нь ДЭЭР байх үе:\n• Маш яаралтай хэрэгтэй үед\n• Буцааж төлж чадахаа мэдэж байвал\n\nСанаарай: Хадгалах нь ихэнх тохиолдолд ДЭЭР!',
    badgeId: 'save-borrow-mastered',
  },
];

// ─── Junior Money & Savings Lessons (replaces loan content for juniors) ──────

export interface MoneyLesson {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  content: string;
  funFact: string;
  badgeId: string;
  game?: {
    type: 'select' | 'collect';
    question?: string;
    options?: { id: string; icon: string; label: string; isCorrect: boolean; color: string }[];
    targetCount?: number;
    collectIcon?: string;
  };
}

export const juniorMoneyLessons: MoneyLesson[] = [
  {
    id: 'what-is-money-jr',
    title: 'Мөнгө гэж юу вэ?',
    icon: 'BadgeDollarSign',
    color: '#FF9500',
    bgColor: '#FFF4E0',
    description: 'Мөнгөний тухай тоглоомоор сурцгаая!',
    content: 'Мөнгө гэдэг нь бид юм худалдаж авахад ашигладаг зүйл юм!\n\n• Жишээ нь: Алим авахын тулд мөнгө өгнө\n• Тоглоом авахын тулд мөнгө хэрэгтэй\n• Ном авахдаа мөнгөөр солилцдог\n\nМөнгө нь зоос болон цаасан мөнгө гэж 2 төрөлтэй:\n• Зоос: 20₮, 50₮, 100₮, 200₮\n• Цаасан: 500₮, 1000₮, 5000₮, 10000₮, 20000₮',
    funFact: 'Мэдсэн үү? Эрт дээр үед хүмүүс мөнгөний оронд мал, давс, бүрхэвч зэргийг ашигладаг байсан!',
    badgeId: 'money-basics-learned',
    game: {
      type: 'select',
      question: 'Аль нь мөнгөн тэмдэгт вэ?',
      options: [
        { id: 'opt1', icon: 'Gamepad2', label: 'Тоглоом', isCorrect: false, color: '#FF3B30' },
        { id: 'opt2', icon: 'Banknote', label: 'Мөнгө', isCorrect: true, color: '#34C759' },
      ],
    },
  },
  {
    id: 'what-is-saving-jr',
    title: 'Хадгаламж гэж юу вэ?',
    icon: 'PiggyBank',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    description: 'Мөнгөө хадгалж сурцгаая!',
    content: 'Хадгаламж гэдэг нь мөнгөө зарахгүйгээр хуримтлуулж хадгалах юм!\n\n• Хадгаламжийн гахайд мөнгөө хийж хадгалдаг\n• Банкинд мөнгөө хадгалж болно\n• Апп дотор хадгалж болно\n\nЯагаад хадгалах вэ?\n• Том зүйл авахын тулд (тоглоом, дугуй)\n• Яаралтай үед ашиглахын тулд\n• Ирээдүйд баялаг болохын тулд',
    funFact: 'Хэрэв өдөр бүр 100₮ хадгалвал 1 жилийн дараа 36,500₮ болно!',
    badgeId: 'saving-basics-learned',
    game: {
      type: 'collect',
      question: 'Гахайнд 5 зоос хийгээрэй!',
      targetCount: 5,
      collectIcon: 'PiggyBank',
    },
  },
  {
    id: 'needs-vs-wants-jr',
    title: 'Хэрэгтэй юу? Хүсэмж үү?',
    icon: 'Heart',
    color: '#6C63FF',
    bgColor: '#EDE9FE',
    description: 'Хэрэгтэй зүйл, хүсэмж юугаараа ялгаатай вэ?',
    content: 'ХЭРЭГТЭЙ зүйлс (Заавал байх ёстой):\n• Хоол - амьдрахын тулд идэх хэрэгтэй\n• Гэр - амрах газартай байх хэрэгтэй\n• Хувцас - дулаан байх хэрэгтэй\n• Сургуулийн хэрэгсэл\n\nХҮСЭМЖ (Байвал сайхан, заавал биш):\n• Шинэ тоглоом\n• Чихэр\n• Тоглоом (game)\n\nМөнгөө зарахдаа эхлээд ХЭРЭГТЭЙ зүйлсийг ав!',
    funFact: 'Ухаалаг хүүхдүүд мөнгөнийхөө 50%-ийг хэрэгтэй зүйлд, 30%-ийг хүсэмжид, 20%-ийг хадгаламжинд хийдэг!',
    badgeId: 'needs-wants-learned',
    game: {
      type: 'select',
      question: 'Аль нь хүнд заавал ХЭРЭГТЭЙ зүйл вэ?',
      options: [
        { id: 'opt1', icon: 'Apple', label: 'Хоол', isCorrect: true, color: '#FF9500' },
        { id: 'opt2', icon: 'Puzzle', label: 'Тоглоом', isCorrect: false, color: '#C084FC' },
      ],
    },
  },
  {
    id: 'earning-money-jr',
    title: 'Мөнгө хэрхэн олох вэ?',
    icon: 'Star',
    color: '#34C759',
    bgColor: '#D1FAE5',
    description: 'Хүүхдүүд мөнгөө хэрхэн олж болох вэ?',
    content: 'Хүүхдүүд ажил хийж мөнгө олж болно!\n\n• Өрөөгөө цэвэрлэх\n• Аяга таваг угаах\n• Нохой гаргах\n• Хичээлээ сайн хийх\n• Цэцэг услах\n\nДаалгавар бүрийг сайн хийвэл:\n• Мөнгө олно\n• Хариуцлагатай болно\n• Эцэг эх баярлана',
    funFact: 'Дэлхийн хамгийн баян хүмүүс бага насандаа жижиг ажлуудаас эхэлсэн!',
    badgeId: 'earning-money-learned',
    game: {
      type: 'select',
      question: 'Даалгавар биелүүлж яаж мөнгө олох вэ?',
      options: [
        { id: 'opt1', icon: 'Tv', label: 'Зурагт үзэх', isCorrect: false, color: '#FF3B30' },
        { id: 'opt2', icon: 'CheckSquare', label: 'Өрөөгөө цэвэрлэх', isCorrect: true, color: '#6C63FF' },
      ],
    },
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
    icon: 'Star',
    description: 'Кредит скорыг хэрхэн тооцоолдог, яагаад чухал болохыг гүнзгий ойлго',
    content: 'Кредит скор нь чиний санхүүгийн найдвартай байдлыг тоогоор илэрхийлсэн үнэлгээ юм.\n\nСкор 1-5 хооронд байна:\n• 5/5 — Маш найдвартай (зээл бүрэн, цагтаа төлдөг)\n• 3/5 — Дунд зэрэг (шинэ эсвэл төлбөрийн түүхгүй)\n• 1/5 — Бага (зээл хугацаандаа төлөхгүй)\n\nСкор нэмэгдүүлэхийн тулд:\n1. Зээлээ цаг тухайд нь төл\n2. Хэт их зээл авахгүй бай\n3. Тогтмол даалгавар гүйцэтгэ',
  },
  {
    id: 'interest-calculation',
    title: 'Хүүгийн тооцоолол',
    icon: 'Calculator',
    description: 'Энгийн болон нийлмэл хүүг хэрхэн тооцоолдогийг сур',
    content: 'Энгийн хүү:\nХүү = Үндсэн дүн × Хүүгийн хувь × Хугацаа\n\nЖишээ: 10,000₮ зээл, 10% хүү, 1 сар\nХүү = 10,000 × 0.10 = 1,000₮\nНийт төлбөр = 11,000₮\n\nНийлмэл хүү:\nХүү тооцох тутамд өмнөх хүүн дээрээ нэмж тооцоолно.\nЭнэ нь удаан хугацаанд илүү их мөнгө болж хувирна.\n\nОйлголт: Зээл аваад удаан байх тусам илүү их төлнө!',
  },
  {
    id: 'loan-strategy',
    title: 'Зээлийн стратеги',
    icon: 'Target',
    description: 'Зээл авах, буцаах зөв стратегийг сур',
    content: 'Зээл авахдаа дараах зүйлсийг бодож үз:\n\n1. ЗОРИЛГО: Яагаад хэрэгтэй вэ?\n2. ДҮН: Яг хэдэн мөнгө хэрэгтэй вэ?\n3. ХУГАЦАА: Хэзээ буцааж төлж чадах вэ?\n4. ХҮҮ: Нийт хэдийг буцааж өгөх вэ?\n\nЗөвлөгөө:\n• Аль болох бага дүн зээлэ\n• Зээлийг хурдан буцааж төл\n• Нэг удаад нэг зээл байлгахыг хичээ\n• Зээл авахаас өмнө хадгаламж ашиглаж чадах эсэхээ бод',
  },
];
