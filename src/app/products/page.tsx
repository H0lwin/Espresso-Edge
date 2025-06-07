
import type { Metadata } from 'next';
import ProductsClient from '@/components/page-specific/ProductsClient';
import type { MenuItem } from '@/app/menu/page'; // Re-use MenuItem or create a new ProductItem type

export const metadata: Metadata = {
  title: 'محصولات ما', // Our Products
  description: 'مجموعه محصولات ویژه اسپرسو اج، از دانه‌های قهوه تا لوازم جانبی دم‌آوری را کاوش کنید.',
};

// Example product data - expand or modify as needed
const productsData: MenuItem[] = [
  { id: 'prod1', name: 'دانه قهوه عربیکا ممتاز', category: 'Coffee', description: '۱ کیلوگرم دانه قهوه عربیکا ۱۰۰٪ خالص با رست مدیوم.', price: '۷۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'coffee beans bag' },
  { id: 'prod2', name: 'ماگ سرامیکی اسپرسو اج', category: 'Snacks', /* Using Snacks as placeholder category */ description: 'ماگ دست‌ساز با لوگوی اسپرسو اج، مناسب برای قهوه صبحگاهی شما.', price: '۳۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'coffee mug brand' },
  { id: 'prod3', name: 'فرنچ پرس کلاسیک', category: 'Coffee', description: 'فرنچ پرس شیشه‌ای با کیفیت برای دم‌آوری قهوه عالی در خانه.', price: '۹۰۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'french press coffee' },
  { id: 'prod4', name: 'کتاب هنر لاته', category: 'Pastries', /* Using Pastries as placeholder category */ description: 'راهنمای جامع برای ایجاد طرح‌های زیبای لاته آرت.', price: '۴۵۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'latte art book' },
];


export default function ProductsPage() {
  return <ProductsClient products={productsData} />;
}
