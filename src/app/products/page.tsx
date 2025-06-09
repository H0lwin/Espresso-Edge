
import type { Metadata } from 'next';
import ProductsClient from '@/components/page-specific/ProductsClient';
import type { MenuItem } from '@/app/menu/page'; // Re-use MenuItem
import apiClient from '@/lib/apiClient';
import { AnimatedPage } from '@/components/shared/AnimatedPage';

export const metadata: Metadata = {
  title: 'محصولات ما', // Our Products
  description: 'مجموعه محصولات ویژه اسپرسو اج، از دانه‌های قهوه تا لوازم جانبی دم‌آوری را کاوش کنید.',
};

interface ProductsPageData {
  products: MenuItem[];
}

async function getProductsData(): Promise<ProductsPageData | null> {
  try {
    // Assuming your API endpoint for all products is /api/products/
    const products = await apiClient<MenuItem[]>('/api/products/');
    return { products: products || [] };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return null;
  }
}

export default async function ProductsPage() {
  const data = await getProductsData();

  if (!data) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <p className="text-destructive text-xl">خطا در بارگذاری محصولات. لطفاً بعداً دوباره تلاش کنید.</p>
        </div>
      </AnimatedPage>
    );
  }
  return <ProductsClient products={data.products} />;
}
