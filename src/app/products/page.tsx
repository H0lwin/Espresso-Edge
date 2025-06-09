
import type { Metadata } from 'next';
import ProductsClient from '@/components/page-specific/ProductsClient';
import type { MenuItem } from '@/app/menu/page'; // Re-use MenuItem

export const metadata: Metadata = {
  title: 'محصولات ما', // Our Products
  description: 'مجموعه محصولات ویژه اسپرسو اج، از دانه‌های قهوه تا لوازم جانبی دم‌آوری را کاوش کنید.',
};

// Example product data structure (now fetched from API)
// This type re-uses MenuItem, ensure your API for products aligns or create a distinct ProductItem type if needed
// const productsData: MenuItem[] = [
//   { id: 'prod1', name: 'دانه قهوه عربیکا ممتاز', category: 'Coffee Beans', description: '۱ کیلوگرم دانه قهوه عربیکا ۱۰۰٪ خالص با رست مدیوم.', price: 750000, imageSrc: 'https://placehold.co/400x300.png', imageHint: 'coffee beans bag' },
//   // ... other mock data removed
// ];


export default function ProductsPage() {
  // Data will be fetched in ProductsClient component
  return <ProductsClient />;
}
