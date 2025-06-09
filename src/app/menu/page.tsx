
import type { Metadata } from 'next';
import MenuClient from '@/components/page-specific/MenuClient';
import type { ComponentType } from 'react';
import type { Coffee, CakeSlice, Sandwich, GlassWater, Milk } from 'lucide-react';


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
  id: string | number; // Allow number if API sends numeric IDs
  name: string;
  category: MenuItemCategory;
  description: string;
  price: number; // Changed to number
  imageSrc: string;
  imageHint: string;
  // Optional: for backend driven icons if you choose to implement
  // icon?: keyof typeof categoryIconsMap; 
};


// This data is now for type definition reference and will be fetched from API
// const menuItemsData: MenuItem[] = [
//   // ... mock data removed ...
// ];

export default function MenuPage() {
  // Data will be fetched in MenuClient component
  return <MenuClient />;
}
