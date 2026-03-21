export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}

export const achievementsData: Achievement[] = [
  // General achievements (10)
  {
    id: 'first-loan-repaid',
    title: 'Зээлээ төлөгч баатар',
    description: 'Эхний зээлээ амжилттай буцааж төллөө!',
    icon: 'Trophy',
    condition: 'Нэг зээлийг бүрэн төлөх',
  },
  {
    id: 'five-tasks-done',
    title: 'Тусламжийн од',
    description: '5 даалгавар амжилттай гүйцэтгэж гэрийнхэндээ тусаллаа!',
    icon: 'Star',
    condition: '5 даалгавар хийж дуусгах',
  },
  {
    id: 'all-lessons',
    title: 'Ухаантан санхүүч',
    description: 'Бүх санхүүгийн хичээлийг үзэж төгслөө!',
    icon: 'GraduationCap',
    condition: 'Бүх хичээлийг үзэж, quiz-ийг зөв хариулах',
  },
  {
    id: 'zero-balance',
    title: 'Өргүй гайхамшиг',
    description: 'Авсан бүх зээлээ бүрэн төлж дуусгалаа!',
    icon: 'Sparkles',
    condition: 'Active зээлгүй болох (нийт зээлийг бүгдийг нь төлөх)',
  },
  {
    id: 'early-repay',
    title: 'Цагийн эзэн',
    description: 'Зээлээ хугацаанаас нь өмнө хариуцлагатайгаар төллөө!',
    icon: 'Zap',
    condition: 'Зээлийг due date-ээс өмнө бүрэн төлөх',
  },
  {
    id: 'first-quiz',
    title: 'Эхний ялалт',
    description: 'Санхүүгийн мэдлэг шалгах анхны сорилтоо амжилттай давлаа!',
    icon: 'FileText',
    condition: 'Нэг хичээлийн quiz-ийг бүрэн бөглөх',
  },
  {
    id: 'three-day-streak',
    title: 'Цуцашгүй ажилчин',
    description: '3 өдөр дараалан апп ашиглаж, зорилгоо биелүүлсэн!',
    icon: 'Flame',
    condition: '3 өдөр дараалан нэвтэрч ажил хийх',
  },
  {
    id: 'ten-tasks-done',
    title: 'Жинхэнэ туслагч',
    description: '10 даалгавар амжилттай гүйцэтгэж, мундаг туслагч боллоо!',
    icon: 'Award',
    condition: '10 даалгавар дуусгах',
  },
  {
    id: 'saver',
    title: 'Мөнгөний соронз',
    description: 'Хэтэвчиндээ 10,000₮-ээс дээш амжилттай хуримтлуулсан!',
    icon: 'PiggyBank',
    condition: 'Balance 10,000₮-д хүрэх',
  },
  {
    id: 'perfect-score',
    title: 'Төгс хариулагч',
    description: 'Quiz дээр ямар ч алдаагүй, үнэн зөв хариулсан!',
    icon: 'BadgeCheck',
    condition: 'Нэг quiz дээр алдаагүй зөв хариулах',
  },
  
  // Junior exclusive games achievements (4 added)
  {
    id: 'money-basics-learned',
    title: 'Мөнгө танигч',
    description: 'Мөнгийг бусад зүйлсээс ялгаж таньдаг боллоо!',
    icon: 'Banknote',
    condition: 'Мөнгө гэж юу вэ? хичээлийг давах',
  },
  {
    id: 'saving-basics-learned',
    title: 'Гахай тэжээгч',
    description: 'Гахайндаа мөнгө амжилттай цуглуулж сурлаа!',
    icon: 'PiggyBank',
    condition: 'Хадгаламж хичээлийг давах',
  },
  {
    id: 'needs-wants-learned',
    title: 'Ухаалаг сонгогч',
    description: 'Хэрэгцээтэй болон хүсэлтэй зүйлсийг ялгаж сурсан!',
    icon: 'Heart',
    condition: 'Хэрэгцээ ба хүсэл хичээлийг давах',
  },
  {
    id: 'earning-money-learned',
    title: 'Хөдөлмөрч хүүхэд',
    description: 'Хэрхэн хөдөлмөрлөж мөнгө олохыг мэддэг болсон!',
    icon: 'Star',
    condition: 'Мөнгө олох арга хичээлийг давах',
  },
];
