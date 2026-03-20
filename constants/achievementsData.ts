export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: string; // description of how to unlock
}

export const achievementsData: Achievement[] = [
  {
    id: 'first-loan-repaid',
    title: 'Анхны төлбөр',
    description: 'Эхний зээлээ амжилттай буцааж төллөө!',
    emoji: '🏆',
    condition: 'Нэг зээлийг бүрэн төлөх',
  },
  {
    id: 'five-tasks-done',
    title: 'Ажилсаг хүүхэд',
    description: '5 даалгавар амжилттай гүйцэтгэлээ!',
    emoji: '⭐',
    condition: '5 даалгавар хийж дуусгах',
  },
  {
    id: 'all-lessons',
    title: 'Мэдлэгийн баатар',
    description: 'Бүх санхүүгийн хичээлийг дуусгалаа!',
    emoji: '🎓',
    condition: 'Бүх 6 хичээлийг үзэж, quiz-ийг зөв хариулах',
  },
  {
    id: 'zero-balance',
    title: 'Цэвэр данс',
    description: 'Бүх зээлээ бүрэн төлж дууслаа!',
    emoji: '✨',
    condition: 'Active зээлгүй болох (нийт зээлийг бүгдийг нь төлөх)',
  },
  {
    id: 'early-repay',
    title: 'Цагаа олсон',
    description: 'Зээлээ хугацаанаас нь өмнө төллөө!',
    emoji: '⚡',
    condition: 'Зээлийг due date-ээс өмнө бүрэн төлөх',
  },
  {
    id: 'first-quiz',
    title: 'Эхний quiz',
    description: 'Анхны quiz-ээ амжилттай бөглөлөө!',
    emoji: '📝',
    condition: 'Нэг хичээлийн quiz-ийг бүрэн бөглөх',
  },
  {
    id: 'three-day-streak',
    title: '3 өдрийн streak',
    description: '3 өдөр дараалан апп ашигласан!',
    emoji: '🔥',
    condition: '3 өдөр дараалан нэвтэрч ажил хийх',
  },
  {
    id: 'ten-tasks-done',
    title: 'Мастер ажилчин',
    description: '10 даалгавар амжилттай гүйцэтгэлээ!',
    emoji: '💪',
    condition: '10 даалгавар дуусгах',
  },
  {
    id: 'saver',
    title: 'Хуримтлуулагч',
    description: 'Хэтэвчинд 10,000₮-ээс дээш хуримтлуулсан!',
    emoji: '🐷',
    condition: 'Balance 10,000₮-д хүрэх',
  },
  {
    id: 'perfect-score',
    title: 'Төгс оноо',
    description: 'Quiz дээр бүх хариултыг зөв бөглөсөн!',
    emoji: '💯',
    condition: 'Нэг quiz дээр алдаагүй зөв хариулах',
  },
];
