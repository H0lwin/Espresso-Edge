
import type { Metadata } from 'next';
import MenuClient from '@/components/page-specific/MenuClient';

export const metadata: Metadata = {
  title: 'منوی ما', // Our Menu
  description: 'پیشنهادات خوشمزه در اسپرسو اج را کاوش کنید. از قهوه‌های ویژه گرفته تا شیرینی‌ها و میان‌وعده‌های لذت‌بخش.',
};

// Define product data structure
export type MenuItem = {
  id: string;
  name: string;
  category: 'Coffee' | 'Pastries' | 'Snacks';
  description: string;
  price: string; // Assuming price is a string like "$3.00" or "۱۲۰،۰۰۰ تومان"
  imageSrc: string;
  imageHint: string;
};

const menuItemsData: MenuItem[] = [
  // Coffee - قهوه
  { id: 'c1', name: 'اسپرسو کلاسیک', category: 'Coffee', description: 'یک شات غلیظ از قهوه غنی و معطر.', price: '۱۰۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'espresso shot' },
  { id: 'c2', name: 'لاته ابریشمی', category: 'Coffee', description: 'اسپرسو با شیر بخارپز و لایه نازکی از کف.', price: '۱۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'latte coffee' },
  { id: 'c3', name: 'کاپوچینو کف‌دار', category: 'Coffee', description: 'ترکیب مساوی از اسپرسو، شیر بخارپز و کف شیر.', price: '۱۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'cappuccino coffee' },
  { id: 'c4', name: 'آمریکانو قوی', category: 'Coffee', description: 'شات‌های اسپرسو رقیق شده با آب داغ.', price: '۱۲۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'americano coffee' },
  // Pastries - شیرینی‌ها
  { id: 'p1', name: 'کروسان کره‌ای', category: 'Pastries', description: 'پفکی، طلایی و به طور غیرقابل مقاومتی کره‌ای.', price: '۹۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'croissant pastry' },
  { id: 'p2', name: 'مافین بلوبری', category: 'Pastries', description: 'مرطوب و پر از بلوبری تازه.', price: '۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'blueberry muffin' },
  { id: 'p3', name: 'اسکون شکلاتی', category: 'Pastries', description: 'یک اسکون دلپذیر پر از تکه‌های شکلات.', price: '۸۵،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'chocolate scone' },
  { id: 'p4', name: 'دانمارکی بادامی', category: 'Pastries', description: 'شیرینی شیرین با مغز بادام و گلیز.', price: '۱۱۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'almond danish' },
  // Snacks - میان‌وعده‌ها
  { id: 's1', name: 'ساندویچ کلاب بوقلمون', category: 'Snacks', description: 'کلاب کلاسیک با بوقلمون، بیکن، کاهو و گوجه فرنگی.', price: '۲۲۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'club sandwich' },
  { id: 's2', name: 'سالاد کاپرزه', category: 'Snacks', description: 'موزارلای تازه، گوجه فرنگی، ریحان و گلیز بالزامیک.', price: '۱۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'caprese salad' },
  { id: 's3', name: 'کیش اسفناج و فتا', category: 'Snacks', description: 'کیش خوش طعم با اسفناج و پنیر فتا.', price: '۱۷۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'quiche slice' },
];

export default function MenuPage() {
  return <MenuClient menuItems={menuItemsData} />;
}
