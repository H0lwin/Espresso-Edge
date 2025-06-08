
import type { Metadata } from 'next';
import MenuClient from '@/components/page-specific/MenuClient';

export const metadata: Metadata = {
  title: 'منوی ما', // Our Menu
  description: 'پیشنهادات خوشمزه در اسپرسو اج را کاوش کنید. از نوشیدنی‌های گرم و سرد گرفته تا دسرها و میان‌وعده‌های لذت‌بخش.',
};

// Define new product data structure
export type MenuItemCategory = 
  | 'نوشیدنی‌های گرم' 
  | 'نوشیدنی‌های سرد' 
  | 'شیک و اسموتی' 
  | 'کیک و دسر' 
  | 'اسنک و میان‌وعده';

export type MenuItem = {
  id: string;
  name: string;
  category: MenuItemCategory;
  description: string;
  price: string;
  imageSrc: string;
  imageHint: string;
};

const menuItemsData: MenuItem[] = [
  // نوشیدنی‌های گرم
  { id: 'c1', name: 'اسپرسو کلاسیک', category: 'نوشیدنی‌های گرم', description: 'یک شات غلیظ از قهوه غنی و معطر.', price: '۱۰۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'espresso shot' },
  { id: 'c2', name: 'لاته ابریشمی', category: 'نوشیدنی‌های گرم', description: 'اسپرسو با شیر بخارپز و لایه نازکی از کف.', price: '۱۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'latte coffee' },
  { id: 'c3', name: 'کاپوچینو کف‌دار', category: 'نوشیدنی‌های گرم', description: 'ترکیب مساوی از اسپرسو، شیر بخارپز و کف شیر.', price: '۱۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'cappuccino coffee' },
  { id: 'c4', name: 'آمریکانو قوی', category: 'نوشیدنی‌های گرم', description: 'شات‌های اسپرسو رقیق شده با آب داغ.', price: '۱۲۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'americano coffee' },
  { id: 'hg1', name: 'چای سیاه ممتاز', category: 'نوشیدنی‌های گرم', description: 'چای سیاه کلاسیک، دم‌کشیده و معطر.', price: '۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'black tea' },
  { id: 'hg2', name: 'چای سبز ژاپنی', category: 'نوشیدنی‌های گرم', description: 'چای سبز با طعمی ملایم و خواص آنتی‌اکسیدانی.', price: '۹۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'green tea' },
  { id: 'hg3', name: 'هات چاکلت ویژه', category: 'نوشیدنی‌های گرم', description: 'شکلات داغ غلیظ با خامه و مارشمالو.', price: '۱۶۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'hot chocolate' },

  // نوشیدنی‌های سرد
  { id: 'cd1', name: 'آب پرتقال طبیعی', category: 'نوشیدنی‌های سرد', description: 'آب پرتقال تازه و سرشار از ویتامین C.', price: '۱۱۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'orange juice' },
  { id: 'cd2', name: 'لیموناد کلاسیک', category: 'نوشیدنی‌های سرد', description: 'ترکیب خنک و گوارای لیمو و شکر.', price: '۱۰۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'lemonade glass' },
  { id: 'cd3', name: 'آیس لاته وانیلی', category: 'نوشیدنی‌های سرد', description: 'اسپرسو، شیر سرد، یخ و طعم وانیل.', price: '۱۷۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'iced latte' },
  { id: 'cd4', name: 'موکتل هاوایی', category: 'نوشیدنی‌های سرد', description: 'ترکیبی استوایی از آب آناناس، نارگیل و بلوکاراسائو.', price: '۱۹۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'fruit mocktail' },
  
  // شیک و اسموتی
  { id: 'ss1', name: 'شیک شکلات نوتلا', category: 'شیک و اسموتی', description: 'شیک خامه‌ای با طعم بی‌نظیر شکلات و نوتلا.', price: '۲۰۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'chocolate shake' },
  { id: 'ss2', name: 'اسموتی توت فرنگی و موز', category: 'شیک و اسموتی', description: 'ترکیب سالم و خوشمزه توت فرنگی و موز.', price: '۱۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'strawberry smoothie' },
  { id: 'ss3', name: 'شیک وانیل و کارامل', category: 'شیک و اسموتی', description: 'شیک کلاسیک وانیلی با سس کارامل نمکی.', price: '۲۱۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'vanilla shake' },

  // کیک و دسر
  { id: 'p1', name: 'کروسان کره‌ای', category: 'کیک و دسر', description: 'پفکی، طلایی و به طور غیرقابل مقاومتی کره‌ای.', price: '۹۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'croissant pastry' },
  { id: 'p2', name: 'مافین بلوبری', category: 'کیک و دسر', description: 'مرطوب و پر از بلوبری تازه.', price: '۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'blueberry muffin' },
  { id: 'p3', name: 'اسکون شکلاتی', category: 'کیک و دسر', description: 'یک اسکون دلپذیر پر از تکه‌های شکلات.', price: '۸۵،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'chocolate scone' },
  { id: 'p4', name: 'دانمارکی بادامی', category: 'کیک و دسر', description: 'شیرینی شیرین با مغز بادام و گلیز.', price: '۱۱۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'almond danish' },
  { id: 'd1', name: 'چیزکیک نیویورکی', category: 'کیک و دسر', description: 'چیزکیک کلاسیک با بافتی نرم و طعمی غنی.', price: '۱۷۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'cheesecake slice' },
  { id: 'd2', name: 'کیک شکلاتی مذاب', category: 'کیک و دسر', description: 'کیک شکلاتی گرم با مرکز مذاب و بستنی وانیلی.', price: '۱۹۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'lava cake' },
  { id: 'd3', name: 'تیرامیسو ایتالیایی', category: 'کیک و دسر', description: 'دسر قهوه ایتالیایی با بیسکویت لیدی فینگر و پنیر ماسکارپونه.', price: '۱۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'tiramisu dessert' },
  
  // اسنک و میان‌وعده
  { id: 's1', name: 'ساندویچ کلاب بوقلمون', category: 'اسنک و میان‌وعده', description: 'کلاب کلاسیک با بوقلمون، بیکن، کاهو و گوجه فرنگی.', price: '۲۲۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'club sandwich' },
  { id: 's2', name: 'سالاد کاپرزه', category: 'اسنک و میان‌وعده', description: 'موزارلای تازه، گوجه فرنگی، ریحان و گلیز بالزامیک.', price: '۱۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'caprese salad' },
  { id: 's3', name: 'کیش اسفناج و فتا', category: 'اسنک و میان‌وعده', description: 'کیش خوش طعم با اسفناج و پنیر فتا.', price: '۱۷۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'quiche slice' },
  { id: 'sm1', name: 'پنینی مرغ و پستو', category: 'اسنک و میان‌وعده', description: 'سینه مرغ گریل شده با سس پستو و پنیر موزارلا.', price: '۲۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'chicken panini' },
  { id: 'sm2', name: 'سالاد سزار با مرغ', category: 'اسنک و میان‌وعده', description: 'کاهو، مرغ گریل، کروتان و سس سزار مخصوص.', price: '۲۳۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'caesar salad' },
];

export default function MenuPage() {
  return <MenuClient menuItems={menuItemsData} />;
}
