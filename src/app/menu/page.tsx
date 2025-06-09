
import type { Metadata } from 'next';
import MenuClient from '@/components/page-specific/MenuClient';
import type { ComponentType } from 'react';
import type { Coffee, CakeSlice, Sandwich, GlassWater, Milk } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { AnimatedPage } from '@/components/shared/AnimatedPage';


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
  id: string | number;
  name: string;
  category: MenuItemCategory;
  description: string;
  price: number; // price is a number
  imageSrc: string;
  imageHint: string;
};


interface MenuPageData {
  menuItems: MenuItem[];
}

async function getMenuData(): Promise<MenuPageData | null> {
  try {
    // Assuming your API endpoint for all menu items is /api/menu-items/
    const menuItems = await apiClient<MenuItem[]>('/api/menu-items/');
    return { menuItems: menuItems || [] };
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    // For server components, error handling might involve throwing to an error boundary
    // or returning null/empty state for the client component to handle.
    return null; 
  }
}


export default async function MenuPage() {
  const data = await getMenuData();

  if (!data) {
    // This case handles if getMenuData returns null due to an error
    // The client component will show its own error/empty state.
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <p className="text-destructive text-xl">خطا در بارگذاری منو. لطفاً بعداً دوباره تلاش کنید.</p>
        </div>
      </AnimatedPage>
    );
  }
  
  return <MenuClient menuItems={data.menuItems} />;
}
